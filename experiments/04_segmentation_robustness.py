"""
Experiment 04: Segmentation Sensitivity of the Theoretical-to-Feasible
Cross-Driver Lap-Time Gap.

Research Question:
    "How sensitive are the theoretical cross-driver composite advantage and
     the physics-constrained feasibility gap to the choice of spatial
     segment length?"

Design:
    The ONLY independent variable is segment length.
    Three fixed resolutions are evaluated: 50 m, 100 m, 250 m.

    Everything else is IDENTICAL to Experiments 01--03:
      - Same session, drivers, laps, telemetry (2023 Bahrain Q3, Ferrari LEC/SAI)
      - Same 5369.0 m canonical spatial domain, 1.0 m PCHIP resampling
      - Same Level-2 coupled vehicle model and calibrated parameters
      - Same periodic bisection solver (tol <= 0.01 m/s)
      - Same donor-speed constraint formulation
      - Same driver-selection rule (minimum segment integral time)
      - No segmentation-specific tuning or calibration

Canonical 100 m control values (Experiments 02/03, scientifically locked):
    Baseline: PHYSICS-CONSTRAINED LITERATURE BASELINE (Policy A, mu_x = 1.700 fixed)
    T_theoretical = 88.869 s   (from Experiment 02 -- telemetry-derived, unaffected by calibration)
    T_feasible    = 91.583 s   (from Experiment 03 -- physics-constrained, Policy A calibration)
    Gap           = 2.714 s

    HISTORICAL NOTE:
    An earlier unconstrained optimizer run produced mu_x = 0.9356 (artifact of compensating
    for missing drivetrain/throttle-modulation dynamics in public FastF1 telemetry).
    That unconstrained run produced T_feasible = 91.805 s and Gap = 2.937 s.
    Historical artifacts are preserved in data/processed/ with
    the prefix historical_unconstrained_*. The active scientific baseline is Policy A.

This experiment does NOT modify Experiments 01--03 in any way.

IMPORTANT:
    Kinetic-energy quantities at driver transitions are described strictly as
    boundary kinetic-energy state mismatches.  They are NOT called energy
    losses, dissipated energy, or thermodynamic energy.
"""

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

import numpy as np
import pandas as pd

from src.ingestion.fetcher import FastF1Fetcher
from src.ingestion.lap_curator import LapCurator
from src.preprocessing.spatial_resampler import SpatialResampler
from src.preprocessing.geometry import TrajectoryGeometry
from src.preprocessing.segmentation import CircuitSegmenter
from src.baseline.theoretical_composite import TheoreticalCompositeAnalyzer
from src.composite.physics_composite import PhysicsConstrainedCompositeBuilder
from src.vehicle_model.level2_coupled import Level2CoupledModel
from src.vehicle_model.calibrator import ModelCalibrator
from src.vehicle_model.forward_backward_solver import ForwardBackwardSolver
from src.config import PROCESSED_DIR, PLOTS_DIR


# ---------------------------------------------------------------------------
# Helpers (identical to Experiments 02/03 -- do not alter)
# ---------------------------------------------------------------------------

def integrate_spatial_time(speed_mps: np.ndarray, step_ds: float = 1.0) -> np.ndarray:
    """Cumulative spatial-integral time: T = sum ds / ((v_i + v_{i+1}) / 2)."""
    dt = np.zeros(len(speed_mps))
    dt[1:] = step_ds / (0.5 * (speed_mps[:-1] + speed_mps[1:]))
    return np.cumsum(dt)


def run_feasibility_solve(
    df_lec: pd.DataFrame,
    df_sai: pd.DataFrame,
    df_segs: pd.DataFrame,
    solver: ForwardBackwardSolver,
    label: str,
) -> tuple:
    """
    Assemble composite trajectory and run the periodic physics solver.

    Parameters
    ----------
    df_lec, df_sai : aligned spatial DataFrames
    df_segs        : segment-winner table from TheoreticalCompositeAnalyzer
    solver         : calibrated ForwardBackwardSolver
    label          : resolution label for progress printing

    Returns
    -------
    (sim_df, diag, v_donor_caps, df_comp)
    """
    comp_builder = PhysicsConstrainedCompositeBuilder(step_ds=1.0)
    df_comp = comp_builder.build_composite_arrays(
        df_lec, df_sai, df_segs,
        driver1_name="Leclerc", driver2_name="Sainz",
    )

    s = df_comp["Distance"].values
    kappa_comp = df_comp["Curvature_kappa"].values
    drs_comp = df_comp["DRS_active"].values
    v_donor_caps = df_comp["Donor_Speed_mps"].values

    print(f"      [{label}] Solving donor-capped periodic lap ...")
    sim_df, diag = solver.solve_periodic_lap(
        distances=s,
        curvatures=kappa_comp,
        drs_active=drs_comp,
        v_donor_caps=v_donor_caps,
        tol=0.01,
    )

    return sim_df, diag, v_donor_caps, df_comp


# ---------------------------------------------------------------------------
# Main experiment
# ---------------------------------------------------------------------------

def main():
    SEP = "=" * 90
    print(SEP)
    print("Experiment 04: Segmentation Sensitivity of the Theoretical-to-Feasible Gap")
    print(SEP)

    # ------------------------------------------------------------------
    # 1. Canonical telemetry -- IDENTICAL to Experiments 01--03
    # ------------------------------------------------------------------
    print("\n1. Loading canonical telemetry: 2023 Bahrain GP Q3 - Ferrari (LEC vs SAI) ...")
    fetcher = FastF1Fetcher()
    session = fetcher.get_session(2023, "Bahrain", "Q")

    lap_lec, lap_sai, meta = LapCurator.get_fastest_teammate_laps(session, "LEC", "SAI")
    raw_lec = LapCurator.extract_raw_telemetry(lap_lec)
    raw_sai = LapCurator.extract_raw_telemetry(lap_sai)

    resampler = SpatialResampler(step_ds=1.0)
    df_lec_raw = resampler.resample_lap(raw_lec)
    df_sai_raw = resampler.resample_lap(raw_sai)

    df_lec, df_sai = SpatialResampler.align_teammates(df_lec_raw, df_sai_raw, step_ds=1.0)

    geom = TrajectoryGeometry(step_ds=1.0)
    df_lec = geom.compute_geometry(df_lec)
    df_sai = geom.compute_geometry(df_sai)

    # Spatially integrated reference times
    df_lec["Time_s"] = integrate_spatial_time(df_lec["Speed_mps"].values, step_ds=1.0)
    df_sai["Time_s"] = integrate_spatial_time(df_sai["Speed_mps"].values, step_ds=1.0)

    total_distance = float(df_lec["Distance"].iloc[-1])
    n_samples = len(df_lec)
    t_lec_obs = float(df_lec["Time_s"].iloc[-1])
    t_sai_obs = float(df_sai["Time_s"].iloc[-1])

    print(f"   Canonical domain S = {total_distance:.1f} m | Grid = 1.0 m | Samples = {n_samples}")

    print(f"   T_LEC_observed = {t_lec_obs:.3f} s")
    print(f"   T_SAI_observed = {t_sai_obs:.3f} s")

    # ------------------------------------------------------------------
    # 2. Calibrate vehicle model -- IDENTICAL to Experiment 03
    # ------------------------------------------------------------------
    print("\n2. Calibrating Level-2 vehicle model (identical to Experiment 03) ...")
    calibrator = ModelCalibrator(Level2CoupledModel)
    model, calib_info = calibrator.calibrate(df_lec, max_iters=25)
    print(
        f"   P_max={model.power_max / 1000:.1f} kW | "
        f"k_drag_off={model.k_drag_drs_off:.3f} | "
        f"k_drag_on={model.k_drag_drs_on:.3f} | "
        f"k_down={model.k_down:.3f} | "
        f"mu_y={model.mu_y:.3f}"
    )

    solver = ForwardBackwardSolver(model, step_ds=1.0)

    # ------------------------------------------------------------------
    # 3. Experiment loop -- three segment lengths
    # ------------------------------------------------------------------
    resolutions = [50.0, 100.0, 250.0]
    segmenter = CircuitSegmenter(step_ds=1.0)
    analyzer = TheoreticalCompositeAnalyzer(mass=810.0)

    summary_rows = []          # one row per resolution
    boundary_rows = []         # one row per boundary per resolution

    print("\n3. Running segmentation sensitivity sweep ...")
    print(f"   Resolutions: {[int(r) for r in resolutions]} m\n")

    for res_m in resolutions:
        res_label = f"{int(res_m)}m"
        print(f"   -- Resolution: {res_label} --------------------------------------------------")

        # --- 3a. Generate segments ---
        segments = segmenter.segment_by_fixed_distance(
            total_distance, segment_length_m=res_m
        )
        n_segs = len(segments)

        # Coverage audit (mandatory; failure is a hard stop)
        cov = CircuitSegmenter.validate_coverage(segments, total_distance)
        assert cov["ok"], (
            f"[{res_label}] Coverage validation FAILED: {cov}. "
            "Experiment 04 cannot proceed."
        )
        print(f"      Segments: {n_segs}  |  Coverage: OK  |  "
              f"Final partial: {segments[-1]['length_m']:.1f} m")

        # --- 3b. Theoretical composite ---
        analysis = analyzer.analyze_composite(
            df_lec, df_sai, segments,
            driver1_name="Leclerc", driver2_name="Sainz",
        )
        summary = analysis["summary"]
        df_segs = analysis["segments_df"]
        df_jumps = analysis["jumps_df"]

        t_theoretical = float(df_segs["dt_winner"].sum())

        # Sanity: composite must not exceed the faster individual
        faster_baseline = min(t_lec_obs, t_sai_obs)
        assert t_theoretical <= faster_baseline + 1e-4, (
            f"[{res_label}] Theoretical composite ({t_theoretical:.4f} s) "
            f"exceeds faster individual ({faster_baseline:.4f} s)."
        )

        # Theoretical gain metrics
        g_theoretical_lec = t_lec_obs - t_theoretical
        g_theoretical_sai = t_sai_obs - t_theoretical

        print(f"      T_theoretical = {t_theoretical:.3f} s | "
              f"G_theoretical vs LEC = +{g_theoretical_lec:.3f} s | "
              f"G_theoretical vs SAI = +{g_theoretical_sai:.3f} s")

        # --- 3c. Boundary discontinuity audit ---
        switches_df = df_jumps[df_jumps["driver_switch"] == True].copy()
        n_switches = len(switches_df)

        max_delta_v_mps = float(switches_df["abs_delta_v_mps"].max()) if not switches_df.empty else 0.0
        mean_delta_v_mps = float(switches_df["abs_delta_v_mps"].mean()) if not switches_df.empty else 0.0
        max_delta_ke_kj = float(switches_df["abs_delta_energy_kj"].max()) if not switches_df.empty else 0.0
        total_abs_delta_ke_kj = float(switches_df["abs_delta_energy_kj"].sum()) if not switches_df.empty else 0.0

        print(f"      Driver switches: {n_switches} | "
              f"Max |Deltav| = {max_delta_v_mps:.3f} m/s ({max_delta_v_mps * 3.6:.2f} km/h) | "
              f"Total |DeltaKE| = {total_abs_delta_ke_kj:.2f} kJ")

        # Collect boundary metrics for all boundaries of this resolution
        for _, jrow in df_jumps.iterrows():
            boundary_rows.append({
                "resolution_m": int(res_m),
                "resolution_label": res_label,
                "boundary_s_m": round(float(jrow["boundary_s"]), 1),
                "driver_from": jrow["driver_from"],
                "driver_to": jrow["driver_to"],
                "driver_switch": bool(jrow["driver_switch"]),
                "v_exit_mps": round(float(jrow["v_exit"]), 4),
                "v_entry_mps": round(float(jrow["v_entry"]), 4),
                "delta_v_mps": round(float(jrow["delta_v_mps"]), 4),
                "abs_delta_v_mps": round(float(jrow["abs_delta_v_mps"]), 4),
                "abs_delta_v_kmh": round(float(jrow["abs_delta_v_kmh"]), 3),
                "delta_ke_kj": round(float(jrow["delta_energy_kj"]), 4),
                "abs_delta_ke_kj": round(float(jrow["abs_delta_energy_kj"]), 4),
            })

        # --- 3d. Physics-constrained feasibility ---
        sim_df, diag, v_donor_caps, df_comp = run_feasibility_solve(
            df_lec, df_sai, df_segs, solver, res_label
        )

        t_feasible = diag["lap_time"]
        periodicity_residual = diag["periodicity_error"]

        # Donor-cap violation check
        v_feas = sim_df["Speed_mps"].values
        cap_excess = v_feas - v_donor_caps
        cap_violations = cap_excess > 1e-3
        max_donor_cap_violation = float(np.max(cap_excess)) if np.any(cap_violations) else 0.0

        # --- 3e. Primary metrics ---
        p_feasibility = t_feasible - t_theoretical         # feasibility penalty
        g_feasible_lec = t_lec_obs - t_feasible            # feasible gain vs LEC
        g_feasible_sai = t_sai_obs - t_feasible            # feasible gain vs SAI

        if abs(g_theoretical_lec) > 1e-6:
            retained_fraction = g_feasible_lec / g_theoretical_lec
        else:
            retained_fraction = float("nan")  # denominator degenerate

        print(f"      T_feasible     = {t_feasible:.3f} s | "
              f"P_feasibility  = +{p_feasibility:.3f} s | "
              f"G_feasible vs LEC = {g_feasible_lec:+.3f} s")
        print(f"      Retained fraction R = {retained_fraction:.3f} | "
              f"Periodicity residual = {periodicity_residual:.5f} m/s | "
              f"Max donor-cap violation = {max_donor_cap_violation:.6f} m/s")

        # --- 3f. 100 m canonical control check ---
        if res_m == 100.0:
            CANON_T_THEO = 88.869
            CANON_T_FEAS = 91.583
            CANON_GAP = 2.714
            TOLERANCE = 0.005  # 5 ms rounding tolerance

            theo_diff = abs(t_theoretical - CANON_T_THEO)
            feas_diff = abs(t_feasible - CANON_T_FEAS)
            gap_diff = abs(p_feasibility - CANON_GAP)

            if theo_diff > TOLERANCE or feas_diff > TOLERANCE or gap_diff > TOLERANCE:
                print(
                    f"\n   *** 100 m CANONICAL CONTROL FAILURE ***\n"
                    f"   T_theoretical: expected {CANON_T_THEO:.3f} s, "
                    f"got {t_theoretical:.3f} s (diff {theo_diff:.4f} s)\n"
                    f"   T_feasible:    expected {CANON_T_FEAS:.3f} s, "
                    f"got {t_feasible:.3f} s (diff {feas_diff:.4f} s)\n"
                    f"   Gap:           expected {CANON_GAP:.3f} s, "
                    f"got {p_feasibility:.3f} s (diff {gap_diff:.4f} s)\n"
                    f"\n   STOPPING -- do not alter canonical model to force agreement.\n"
                )
                raise RuntimeError(
                    f"100 m canonical control check FAILED: "
                    f"T_theo diff={theo_diff:.4f} s, "
                    f"T_feas diff={feas_diff:.4f} s, "
                    f"Gap diff={gap_diff:.4f} s. "
                    "Experiment 04 BLOCKED."
                )
            else:
                print(
                    f"      OK 100 m canonical control: "
                    f"T_theo={t_theoretical:.3f} s (diff={theo_diff:.4f} s) | "
                    f"T_feas={t_feasible:.3f} s (diff={feas_diff:.4f} s) | "
                    f"Gap={p_feasibility:.3f} s (diff={gap_diff:.4f} s)"
                )

        summary_rows.append({
            "segment_length_m":           int(res_m),
            "resolution_label":           res_label,
            "number_of_segments":         n_segs,
            "final_partial_segment_m":    round(segments[-1]["length_m"], 2),
            "t_lec_observed_s":           round(t_lec_obs, 3),
            "t_sai_observed_s":           round(t_sai_obs, 3),
            "theoretical_lap_time_s":     round(t_theoretical, 3),
            "theoretical_gain_vs_lec_s":  round(g_theoretical_lec, 3),
            "theoretical_gain_vs_sai_s":  round(g_theoretical_sai, 3),
            "feasible_lap_time_s":        round(t_feasible, 3),
            "feasibility_penalty_s":      round(p_feasibility, 3),
            "feasible_gain_vs_lec_s":     round(g_feasible_lec, 3),
            "feasible_gain_vs_sai_s":     round(g_feasible_sai, 3),
            "retained_fraction":          round(retained_fraction, 4) if not np.isnan(retained_fraction) else "NaN",
            "number_of_driver_switches":  n_switches,
            "max_delta_v_mps":            round(max_delta_v_mps, 4),
            "mean_delta_v_mps":           round(mean_delta_v_mps, 4),
            "max_delta_v_kmh":            round(max_delta_v_mps * 3.6, 3),
            "mean_delta_v_kmh":           round(mean_delta_v_mps * 3.6, 3),
            "max_delta_ke_kj":            round(max_delta_ke_kj, 3),
            "total_abs_delta_ke_kj":      round(total_abs_delta_ke_kj, 3),
            "periodicity_residual_mps":   round(periodicity_residual, 6),
            "max_donor_cap_violation_mps": round(max_donor_cap_violation, 8),
            "lec_segments":               int(summary["d1_segments_count"]),
            "sainz_segments":             int(summary["d2_segments_count"]),
            "lec_distance_pct":           round(summary["d1_pct_distance"], 2),
            "sainz_distance_pct":         round(summary["d2_pct_distance"], 2),
        })

        print()

    # ------------------------------------------------------------------
    # 4. Save output files
    # ------------------------------------------------------------------
    print("4. Saving output artefacts ...")

    summary_df = pd.DataFrame(summary_rows)
    summary_csv = PROCESSED_DIR / "experiment_04_segmentation_robustness.csv"
    summary_df.to_csv(summary_csv, index=False)
    print(f"   Saved: {summary_csv}")

    boundary_df = pd.DataFrame(boundary_rows)
    boundary_csv = PROCESSED_DIR / "experiment_04_boundary_metrics.csv"
    boundary_df.to_csv(boundary_csv, index=False)
    print(f"   Saved: {boundary_csv}")

    # ------------------------------------------------------------------
    # 5. Print comparison table
    # ------------------------------------------------------------------
    print("\n" + "=" * 90)
    print("EXPERIMENT 04: SENSITIVITY SUMMARY TABLE")
    print("=" * 90)

    header = (
        f"{'Segment':>8} | {'# Segs':>7} | {'T_theo (s)':>11} | {'T_feas (s)':>11} | "
        f"{'G_theo (s)':>10} | {'P_feas (s)':>10} | {'G_feas (s)':>10} | "
        f"{'R':>8} | {'# sw':>5} | {'Max|Deltav|(m/s)':>13} | {'Tot|DeltaKE|(kJ)':>13}"
    )
    print(header)
    print("-" * len(header))

    for row in summary_rows:
        r_val = row["retained_fraction"]
        r_str = f"{r_val:8.4f}" if r_val != "NaN" else f"{'NaN':>8}"
        print(
            f"{row['resolution_label']:>8} | "
            f"{row['number_of_segments']:>7} | "
            f"{row['theoretical_lap_time_s']:>11.3f} | "
            f"{row['feasible_lap_time_s']:>11.3f} | "
            f"{row['theoretical_gain_vs_lec_s']:>+10.3f} | "
            f"{row['feasibility_penalty_s']:>+10.3f} | "
            f"{row['feasible_gain_vs_lec_s']:>+10.3f} | "
            f"{r_str} | "
            f"{row['number_of_driver_switches']:>5} | "
            f"{row['max_delta_v_mps']:>13.4f} | "
            f"{row['total_abs_delta_ke_kj']:>13.3f}"
        )

    print("=" * 90)
    print("\nNOTE: G_feasible is reported honestly; negative values indicate the feasible")
    print("      composite is slower than the Leclerc observed baseline.")
    print("NOTE: |DeltaKE| quantities describe boundary kinetic-energy state mismatches at")
    print("      driver transitions; they are not energy losses or thermodynamic energy.")

    print("\n" + "=" * 90)
    print("EXPERIMENT 04 COMPLETE")
    print("=" * 90)


if __name__ == "__main__":
    main()

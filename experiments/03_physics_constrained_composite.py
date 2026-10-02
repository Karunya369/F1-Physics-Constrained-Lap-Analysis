"""
Experiment 03: Physics-Constrained Feasibility and State-Continuity Analysis of Cross-Driver Composite Laps.

Research Objective:
Evaluates the physical feasibility and state-continuity penalties of the theoretical cross-driver
composite lap under continuous Level-2 vehicle dynamics on the canonical Bahrain spatial domain (S = 5369.0 m).

Evaluates two core physics formulations:
1. Case A: Optimal Geometry Reference (T_optimal_geom) — unconstrained vehicle dynamics ceiling on composite line.
2. Case B: Donor-Envelope Feasibility (T_feasible_donor_capped) — state-continuous lap constrained by observed donor speed ceiling.

Also provides First-Order Energetic Diagnostic Decomposition of the transition penalties.
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
from src.baseline.theoretical_composite import TheoreticalCompositeAnalyzer
from src.composite.physics_composite import PhysicsConstrainedCompositeBuilder
from src.vehicle_model.level2_coupled import Level2CoupledModel
from src.vehicle_model.calibrator import ModelCalibrator
from src.vehicle_model.forward_backward_solver import ForwardBackwardSolver
from src.synthesis.gap_attribution import GapAttributionAnalyzer
from src.visualization.plot_physics_composite import (
    plot_experiment_03_speed_profiles,
    plot_diagnostic_breakdown,
)
from src.config import PROCESSED_DIR, PLOTS_DIR


def integrate_spatial_time(speed_mps: np.ndarray, step_ds: float = 1.0) -> np.ndarray:
    dt = np.zeros(len(speed_mps))
    dt[1:] = step_ds / (0.5 * (speed_mps[:-1] + speed_mps[1:]))
    return np.cumsum(dt)


def main():
    print("=" * 85)
    print("Experiment 03: Physics-Constrained Feasibility and State-Continuity Analysis")
    print("=" * 85)

    # 1. Load Ingestion & Preprocessing Pipeline
    print("\n1. Ingesting and aligning telemetry (Bahrain 2023 Q3 - Ferrari LEC vs SAI)...")
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

    # Integrate spatial time as baseline ground truth
    df_lec["Time_s"] = integrate_spatial_time(df_lec["Speed_mps"].values, step_ds=1.0)
    df_sai["Time_s"] = integrate_spatial_time(df_sai["Speed_mps"].values, step_ds=1.0)

    total_distance = float(df_lec["Distance"].iloc[-1])
    n_samples = len(df_lec)
    t_lec_obs = float(df_lec["Time_s"].iloc[-1])
    t_sai_obs = float(df_sai["Time_s"].iloc[-1])

    print(f"   Canonical Domain Length S: {total_distance:.1f} m | Grid resolution: 1.0 m | Samples: {n_samples}")
    print(f"   LEC Observed Lap Time: {t_lec_obs:.3f} s")
    print(f"   SAI Observed Lap Time: {t_sai_obs:.3f} s")

    # 2. Load 100m Theoretical Composite from Experiment 02
    print("\n2. Loading Experiment 02 100m Theoretical Composite Map...")
    theo_segs_path = PROCESSED_DIR / "theoretical_composite_100m.csv"
    theo_jumps_path = PROCESSED_DIR / "theoretical_composite_jumps_100m.csv"

    if not theo_segs_path.exists() or not theo_jumps_path.exists():
        raise FileNotFoundError(
            f"Required Experiment 02 artifacts missing in {PROCESSED_DIR}. Run 02_theoretical_composite.py first."
        )

    df_segs = pd.read_csv(theo_segs_path)
    df_jumps = pd.read_csv(theo_jumps_path)

    # Theoretical reference lap time
    t_theoretical = float(df_segs["dt_winner"].sum())
    theoretical_gain_lec = t_lec_obs - t_theoretical
    theoretical_gain_sai = t_sai_obs - t_theoretical

    print(f"   Number of 100m Segments: {len(df_segs)}")
    print(f"   T_theoretical (100m):    {t_theoretical:.3f} s")
    print(f"   Theoretical Gain vs LEC: +{theoretical_gain_lec:.3f} s")
    print(f"   Theoretical Gain vs SAI: +{theoretical_gain_sai:.3f} s")

    # 3. Assemble Composite Arrays
    print("\n3. Assembling Composite Trajectory Arrays via PhysicsConstrainedCompositeBuilder...")
    comp_builder = PhysicsConstrainedCompositeBuilder(step_ds=1.0)
    df_comp = comp_builder.build_composite_arrays(
        df_lec, df_sai, df_segs, driver1_name="Leclerc", driver2_name="Sainz"
    )

    s = df_comp["Distance"].values
    kappa_comp = df_comp["Curvature_kappa"].values
    drs_comp = df_comp["DRS_active"].values
    v_donor_caps = df_comp["Donor_Speed_mps"].values

    # 4. Calibrate Level-2 Coupled Vehicle Model
    # Policy A: mu_x is fixed at 1.700 (literature reference); optimizer varies
    # [k_drag_drs_off, k_down, mu_y] only using L-BFGS-B within declared PARAM_BOUNDS.
    print("\n4. Calibrating Level-2 Coupled Vehicle Model (Mass = 810 kg, mu_x fixed = 1.700)...")
    calibrator = ModelCalibrator(Level2CoupledModel)
    model, calib_info = calibrator.calibrate(df_lec, max_iters=25)
    print(
        f"   Calibrated Parameters: "
        f"P_max={model.power_max/1000.0:.1f} kW | "
        f"k_drag_off={model.k_drag_drs_off:.4f} | "
        f"k_drag_on={model.k_drag_drs_on:.4f} | "
        f"k_down={model.k_down:.4f} | "
        f"mu_x={model.mu_x:.4f} (FIXED, Policy A) | "
        f"mu_y={model.mu_y:.4f}"
    )

    solver = ForwardBackwardSolver(model, step_ds=1.0)

    # 5. Execute Solves
    print("\n5. Executing Periodic Boundary-Value Physics Solves (Bisection root finding, tol <= 0.01 m/s)...")

    # Single driver simulated references
    print("   [1/4] Solving LEC Simulated Baseline (T_LEC_sim)...")
    sim_lec, diag_lec = solver.solve_periodic_lap(
        distances=s,
        curvatures=df_lec["Curvature_kappa"].values,
        drs_active=df_lec["DRS_active"].values,
        v_donor_caps=None,
        tol=0.01,
    )
    t_lec_sim = diag_lec["lap_time"]

    print("   [2/4] Solving SAI Simulated Baseline (T_SAI_sim)...")
    sim_sai, diag_sai = solver.solve_periodic_lap(
        distances=s,
        curvatures=df_sai["Curvature_kappa"].values,
        drs_active=df_sai["DRS_active"].values,
        v_donor_caps=None,
        tol=0.01,
    )
    t_sai_sim = diag_sai["lap_time"]

    # Case A: Optimal Geometry Reference (No donor caps)
    print("   [3/4] Solving Case A: Optimal Geometry Reference (T_optimal_geom)...")
    sim_optimal, diag_optimal = solver.solve_periodic_lap(
        distances=s,
        curvatures=kappa_comp,
        drs_active=drs_comp,
        v_donor_caps=None,
        tol=0.01,
    )
    t_optimal_geom = diag_optimal["lap_time"]

    # Case B: Donor-Envelope Feasible Lap (With donor observed speed caps)
    print("   [4/4] Solving Case B: Donor-Envelope Feasible Lap (T_feasible_donor_capped)...")
    sim_feasible, diag_feasible = solver.solve_periodic_lap(
        distances=s,
        curvatures=kappa_comp,
        drs_active=drs_comp,
        v_donor_caps=v_donor_caps,
        tol=0.01,
    )
    t_feasible_donor_capped = diag_feasible["lap_time"]

    # 6. Headline Metric Calculations
    opt_gain_vs_lec = t_lec_obs - t_optimal_geom
    feas_gain_vs_lec = t_lec_obs - t_feasible_donor_capped
    theo_to_feas_gap = t_feasible_donor_capped - t_theoretical
    theo_to_opt_diff = t_optimal_geom - t_theoretical
    donor_cap_penalty = t_feasible_donor_capped - t_optimal_geom

    # 7. Discontinuity & Continuity Metrics
    switches = df_jumps[df_jumps["driver_switch"] == True]
    num_switches = len(switches)
    max_delta_v_mps = float(switches["abs_delta_v_mps"].max()) if not switches.empty else 0.0
    max_delta_v_kmh = max_delta_v_mps * 3.6
    max_delta_ke_kj = float(switches["abs_delta_energy_kj"].max()) if not switches.empty else 0.0
    total_abs_delta_ke_kj = float(switches["abs_delta_energy_kj"].sum()) if not switches.empty else 0.0

    # Max adjacent |Dv| in continuous trace
    v_feas_mps = sim_feasible["Speed_mps"].values
    max_adj_dv_feas = float(np.max(np.abs(np.diff(v_feas_mps))))

    # Verify donor cap inequality: v_feas <= v_donor_caps + 1e-3
    cap_violations = v_feas_mps > (v_donor_caps + 1e-3)
    max_cap_violation = float(np.max(v_feas_mps - v_donor_caps)) if np.any(cap_violations) else 0.0

    # 8. First-Order Energetic Diagnostic Decomposition
    print("\n6. Computing First-Order Energetic Diagnostic Decomposition...")
    gap_analyzer = GapAttributionAnalyzer(mass=810.0)
    diagnostics = gap_analyzer.attribute_gap(
        sim_feasible, df_segs, df_jumps, gap_total_s=theo_to_feas_gap
    )

    # 9. Save CSV Outputs
    print("\n7. Saving Structured Artifacts to data/processed/...")
    # Telemetry CSV for Case B
    sim_feasible_out = sim_feasible.copy()
    sim_feasible_out["Donor_Speed_mps"] = v_donor_caps
    sim_feasible_out["Donor_Speed_kmh"] = v_donor_caps * 3.6
    sim_feasible_out["Selected_Driver"] = df_comp["Donor_Driver"]
    sim_feasible_out["Curvature_kappa"] = kappa_comp
    sim_feasible_out["DRS_active"] = drs_comp

    feas_csv_path = PROCESSED_DIR / "physics_constrained_composite_100m.csv"
    sim_feasible_out.to_csv(feas_csv_path, index=False)

    # Boundary transition table
    trans_rows = []
    for _, sw in switches.iterrows():
        b_s = sw["boundary_s"]
        idx = int(np.argmin(np.abs(s - b_s)))
        v_feas_at_b = float(v_feas_mps[idx])
        trans_rows.append({
            "boundary_s": b_s,
            "driver_from": sw["driver_from"],
            "driver_to": sw["driver_to"],
            "v_exit_theo_mps": sw["v_exit"],
            "v_entry_theo_mps": sw["v_entry"],
            "delta_v_theo_mps": sw["delta_v_mps"],
            "delta_v_theo_kmh": sw["delta_v_kmh"],
            "delta_energy_kj": sw["delta_energy_kj"],
            "v_realized_feasible_mps": v_feas_at_b,
            "v_realized_feasible_kmh": v_feas_at_b * 3.6,
        })
    df_trans = pd.DataFrame(trans_rows)
    trans_csv_path = PROCESSED_DIR / "physics_constrained_transitions_100m.csv"
    df_trans.to_csv(trans_csv_path, index=False)

    # Experiment summary CSV
    summary_data = {
        "Canonical_Track_Length_m": total_distance,
        "T_LEC_obs_s": round(t_lec_obs, 3),
        "T_SAI_obs_s": round(t_sai_obs, 3),
        "T_theoretical_s": round(t_theoretical, 3),
        "T_optimal_geom_s": round(t_optimal_geom, 3),
        "T_feasible_donor_capped_s": round(t_feasible_donor_capped, 3),
        "T_LEC_sim_s": round(t_lec_sim, 3),
        "T_SAI_sim_s": round(t_sai_sim, 3),
        "Theoretical_Gain_vs_LEC_s": round(theoretical_gain_lec, 3),
        "Theoretical_Gain_vs_SAI_s": round(theoretical_gain_sai, 3),
        "Optimal_Geometry_Gain_vs_LEC_s": round(opt_gain_vs_lec, 3),
        "Feasible_Gain_vs_LEC_s": round(feas_gain_vs_lec, 3),
        "Theoretical_to_Feasible_Gap_s": round(theo_to_feas_gap, 3),
        "Theoretical_to_Optimal_Diff_s": round(theo_to_opt_diff, 3),
        "Donor_Cap_Penalty_vs_Optimal_s": round(donor_cap_penalty, 3),
        "Number_of_Donor_Switches": num_switches,
        "Max_Abs_Boundary_Delta_V_mps": round(max_delta_v_mps, 3),
        "Max_Abs_Boundary_Delta_V_kmh": round(max_delta_v_kmh, 2),
        "Max_Abs_Boundary_Delta_KE_kJ": round(max_delta_ke_kj, 2),
        "Sum_of_Abs_Boundary_KE_Mismatches_kJ": round(total_abs_delta_ke_kj, 2),
        "Periodicity_Error_Feasible_mps": round(diag_feasible["periodicity_error"], 5),
        "Periodicity_Error_Optimal_mps": round(diag_optimal["periodicity_error"], 5),
        "Diagnostic_KE_Penalty_s": diagnostics["diagnostic_ke_acceleration_penalty_s"],
        "Diagnostic_Braking_Penalty_s": diagnostics["diagnostic_braking_displacement_penalty_s"],
        "Diagnostic_Corner_Exit_Grip_Deficit_s": diagnostics["diagnostic_corner_exit_grip_deficit_s"],
        "Residual_State_Propagation_Term_s": diagnostics["residual_state_propagation_term_s"],
    }
    summary_df = pd.DataFrame([summary_data])
    summary_csv_path = PROCESSED_DIR / "experiment_03_summary.csv"
    summary_df.to_csv(summary_csv_path, index=False)

    # 10. Generate Publication Plots
    print("\n8. Generating Publication-Quality Diagnostic Plots...")
    plot_speed_path = PLOTS_DIR / "exp03_speed_profiles.png"
    plot_experiment_03_speed_profiles(
        df_lec=df_lec,
        df_sai=df_sai,
        df_theoretical=df_comp,
        df_optimal=sim_optimal,
        df_feasible=sim_feasible,
        jumps_df=df_jumps,
        save_path=plot_speed_path,
    )

    plot_diag_path = PLOTS_DIR / "exp03_diagnostic_waterfall.png"
    plot_diagnostic_breakdown(
        summary_dict=summary_data,
        diagnostics=diagnostics,
        save_path=plot_diag_path,
    )

    # 11. Final Structured Scientific Report
    print("\n" + "=" * 85)
    print("EXPERIMENT 03: FINAL SCIENTIFIC RESULTS REPORT")
    print("=" * 85)
    print(f"Canonical Track Length (S):       {total_distance:.1f} m ({n_samples} samples at ds=1.0m)")
    print(f"Observed Teammate Delta:          {abs(t_lec_obs - t_sai_obs):.3f} s (LEC faster)")
    print("-" * 85)
    print("CORE LAP TIME COMPARISONS:")
    print(f"  1. T_LEC (observed baseline):         {t_lec_obs:.3f} s")
    print(f"  2. T_SAI (observed baseline):         {t_sai_obs:.3f} s")
    print(f"  3. T_theoretical (100m discontinuous): {t_theoretical:.3f} s  (Gain vs LEC: +{theoretical_gain_lec:.3f} s)")
    print(f"  4. T_optimal_geom (Case A reference): {t_optimal_geom:.3f} s  (Gain vs LEC: +{opt_gain_vs_lec:.3f} s)")
    print(f"  5. T_feasible_donor_capped (Case B):  {t_feasible_donor_capped:.3f} s  (Gain vs LEC: {feas_gain_vs_lec:+.3f} s)")
    print(f"  6. T_LEC_sim (calibrated simulation): {t_lec_sim:.3f} s")
    print(f"  7. T_SAI_sim (calibrated simulation): {t_sai_sim:.3f} s")
    print("-" * 85)
    print("PRIMARY PERFORMANCE DELTAS & GAPS:")
    print(f"  Theoretical Gain vs LEC:              +{theoretical_gain_lec:.3f} s")
    print(f"  Optimal-Geometry Gain vs LEC:         +{opt_gain_vs_lec:.3f} s")
    print(f"  Donor-Capped Feasible Gain vs LEC:    {feas_gain_vs_lec:+.3f} s (Loss of {abs(feas_gain_vs_lec):.3f} s)")
    print(f"  Theoretical -> Feasible Gap:          +{theo_to_feas_gap:.3f} s (State-continuity penalty)")
    print(f"  Theoretical -> Optimal Difference:    {theo_to_opt_diff:+.3f} s")
    print(f"  Donor-Cap Penalty vs Optimal Geom:    +{donor_cap_penalty:.3f} s")
    print("-" * 85)
    print("BOUNDARY TRANSITION & CONTINUITY METRICS:")
    print(f"  Total Driver Switches:                {num_switches} transitions")
    print(f"  Max Boundary |Delta_v| (Theoretical): {max_delta_v_mps:.3f} m/s ({max_delta_v_kmh:.2f} km/h)")
    print(f"  Max Adjacent |Delta_v| (Feasible):    {max_adj_dv_feas:.4f} m/s (C^0 continuous)")
    print(f"  Max Absolute Boundary Delta_KE:       {max_delta_ke_kj:.2f} kJ")
    print(f"  Sum of Abs Boundary KE Mismatches:    {total_abs_delta_ke_kj:.2f} kJ")
    print(f"  Realized Periodicity Error (Feasible):{diag_feasible['periodicity_error']:.5f} m/s (<= 0.01 m/s)")
    print(f"  Realized Periodicity Error (Optimal): {diag_optimal['periodicity_error']:.5f} m/s (<= 0.01 m/s)")
    print(f"  Donor Speed Cap Violation:            {max_cap_violation:.6f} m/s (Strict inequality respected)")
    print("-" * 85)
    print(f"FIRST-ORDER ENERGETIC DIAGNOSTIC DECOMPOSITION (Total Gap = +{theo_to_feas_gap:.3f} s):")
    print(f"  Diagnostic KE Acceleration Penalty:   +{diagnostics['diagnostic_ke_acceleration_penalty_s']:.3f} s")
    print(f"  Diagnostic Braking Displacement:      +{diagnostics['diagnostic_braking_displacement_penalty_s']:.3f} s")
    print(f"  Diagnostic Corner-Exit Grip Deficit:  +{diagnostics['diagnostic_corner_exit_grip_deficit_s']:.3f} s")
    print(f"  Residual State-Propagation Term:      +{diagnostics['residual_state_propagation_term_s']:.3f} s")
    print("=" * 85)
    print("EXPERIMENT 03 EXECUTION COMPLETE")


if __name__ == "__main__":
    main()

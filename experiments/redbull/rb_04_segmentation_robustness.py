"""
Experiment RB-04: Segmentation Sensitivity of the Theoretical-to-Feasible Cross-Driver Lap-Time Gap (Red Bull Racing: VER vs PER).
Sweeps 50m, 100m (canonical), and 250m resolutions to evaluate sensitivity of the feasibility gap.
"""

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from src.preprocessing.segmentation import CircuitSegmenter
from src.baseline.theoretical_composite import TheoreticalCompositeAnalyzer
from src.composite.physics_composite import PhysicsConstrainedCompositeBuilder
from src.vehicle_model.level2_coupled import Level2CoupledModel
from src.vehicle_model.forward_backward_solver import ForwardBackwardSolver
from src.configs.redbull_config import OUTPUT_PROCESSED_DIR, OUTPUT_PLOTS_DIR


def main():
    print("=" * 85)
    print("F1 Research Pipeline: Experiment RB-04 — Red Bull Segmentation Sensitivity Sweep")
    print("=" * 85)

    aligned_csv = OUTPUT_PROCESSED_DIR / "redbull_aligned_telemetry.csv"
    params_csv = OUTPUT_PROCESSED_DIR / "redbull_calibrated_parameters.csv"

    if not aligned_csv.exists() or not params_csv.exists():
        raise FileNotFoundError("Missing prerequisite artifacts. Run rb_00 and rb_01 first.")

    df_aligned = pd.read_csv(aligned_csv)
    params_df = pd.read_csv(params_csv)
    l2_params = params_df.iloc[0].to_dict()

    df_ver = pd.DataFrame({
        "Distance": df_aligned["Distance"],
        "Speed_mps": df_aligned["Speed_VER_mps"],
        "Time_s": df_aligned["Time_VER_s"],
        "Curvature_kappa": df_aligned["Curvature_kappa"],
        "DRS_active": df_aligned["DRS_active"],
    })

    df_per = pd.DataFrame({
        "Distance": df_aligned["Distance"],
        "Speed_mps": df_aligned["Speed_PER_mps"],
        "Time_s": df_aligned["Time_PER_s"],
        "Curvature_kappa": df_aligned["Curvature_kappa"],
        "DRS_active": df_aligned["DRS_active"],
    })

    total_track_length = float(df_aligned["Distance"].iloc[-1])
    t_ver_obs = float(df_ver["Time_s"].iloc[-1])
    t_per_obs = float(df_per["Time_s"].iloc[-1])

    analyzer = TheoreticalCompositeAnalyzer(mass=810.0)
    segmenter = CircuitSegmenter(step_ds=1.0)
    comp_builder = PhysicsConstrainedCompositeBuilder(step_ds=1.0)
    model = Level2CoupledModel(l2_params)
    solver = ForwardBackwardSolver(model, step_ds=1.0)

    resolutions = [
        (50.0, "50m"),
        (100.0, "100m"),
        (250.0, "250m"),
    ]

    robustness_results = []
    all_boundary_metrics = []

    for seg_len, label in resolutions:
        print(f"\n--- Evaluating Resolution: {label} (Segment length: {seg_len}m) ---")
        segments = segmenter.segment_by_fixed_distance(total_distance=total_track_length, segment_length_m=seg_len)
        final_partial_m = segments[-1]["length_m"]

        # 1. Theoretical Composite
        res_theo = analyzer.analyze_composite(
            df_ver, df_per, segments,
            driver1_name="Verstappen", driver2_name="Perez"
        )
        s_info = res_theo["summary"]
        df_segs = res_theo["segments_df"]
        df_jumps = res_theo["jumps_df"]

        t_theo = s_info["t_theoretical"]
        gain_theo_ver = t_ver_obs - t_theo
        gain_theo_per = t_per_obs - t_theo

        # 2. Physics Composite Construction
        df_comp = comp_builder.build_composite_arrays(
            df_ver, df_per, df_segs, driver1_name="Verstappen", driver2_name="Perez"
        )
        s = df_comp["Distance"].values
        kappa_comp = df_comp["Curvature_kappa"].values
        drs_comp = df_comp["DRS_active"].values
        v_donor_caps = df_comp["Donor_Speed_mps"].values

        # 3. Feasible Solve
        sim_feas, diag_feas = solver.solve_periodic_lap(
            distances=s, curvatures=kappa_comp, drs_active=drs_comp, v_donor_caps=v_donor_caps, tol=0.01
        )
        t_feas = diag_feas["lap_time"]
        feas_penalty = t_feas - t_theo
        gain_feas_ver = t_ver_obs - t_feas
        gain_feas_per = t_per_obs - t_feas
        retained_fraction = gain_feas_ver / gain_theo_ver if gain_theo_ver != 0 else 0.0

        switches = df_jumps[df_jumps["driver_switch"] == True]
        num_switches = len(switches)

        max_dv_mps = float(switches["abs_delta_v_mps"].max()) if not switches.empty else 0.0
        mean_dv_mps = float(switches["abs_delta_v_mps"].mean()) if not switches.empty else 0.0
        max_dv_kmh = max_dv_mps * 3.6
        mean_dv_kmh = mean_dv_mps * 3.6

        max_ke_kj = float(switches["abs_delta_energy_kj"].max()) if not switches.empty else 0.0
        total_ke_kj = float(switches["abs_delta_energy_kj"].sum()) if not switches.empty else 0.0

        print(f"  T_theoretical:      {t_theo:.3f} s (Gain: +{gain_theo_ver:.3f} s)")
        print(f"  T_feasible:         {t_feas:.3f} s (Gain: {gain_feas_ver:.3f} s)")
        print(f"  Feasibility Penalty: +{feas_penalty:.3f} s")
        print(f"  Retained Fraction R: {retained_fraction:.4f}")
        print(f"  Switches:            {num_switches}")
        print(f"  Max |Delta v|:       {max_dv_mps:.3f} m/s ({max_dv_kmh:.2f} km/h)")
        print(f"  Total |Delta KE|:    {total_ke_kj:.2f} kJ")

        robustness_results.append({
            "segment_length_m": seg_len,
            "resolution_label": label,
            "number_of_segments": len(segments),
            "final_partial_segment_m": round(final_partial_m, 1),
            "t_ver_observed_s": round(t_ver_obs, 3),
            "t_per_observed_s": round(t_per_obs, 3),
            "theoretical_lap_time_s": round(t_theo, 3),
            "theoretical_gain_vs_ver_s": round(gain_theo_ver, 3),
            "theoretical_gain_vs_per_s": round(gain_theo_per, 3),
            "feasible_lap_time_s": round(t_feas, 3),
            "feasibility_penalty_s": round(feas_penalty, 3),
            "feasible_gain_vs_ver_s": round(gain_feas_ver, 3),
            "feasible_gain_vs_per_s": round(gain_feas_per, 3),
            "retained_fraction": round(retained_fraction, 4),
            "number_of_driver_switches": num_switches,
            "max_delta_v_mps": round(max_dv_mps, 4),
            "mean_delta_v_mps": round(mean_dv_mps, 4),
            "max_delta_v_kmh": round(max_dv_kmh, 3),
            "mean_delta_v_kmh": round(mean_dv_kmh, 3),
            "max_delta_ke_kj": round(max_ke_kj, 3),
            "total_abs_delta_ke_kj": round(total_ke_kj, 3),
            "periodicity_residual_mps": round(float(diag_feas["periodicity_error"]), 6),
            "max_donor_cap_violation_mps": round(float(diag_feas.get("max_donor_cap_violation", 0.0)), 6),
            "ver_segments": s_info["d1_segments_count"],
            "per_segments": s_info["d2_segments_count"],
            "ver_distance_pct": round(s_info["d1_pct_distance"], 2),
            "per_distance_pct": round(s_info["d2_pct_distance"], 2),
        })

        # Record boundary metrics
        if not switches.empty:
            for _, sw in switches.iterrows():
                all_boundary_metrics.append({
                    "resolution": label,
                    "boundary_s": sw["boundary_s"],
                    "from_driver": sw["driver_from"],
                    "to_driver": sw["driver_to"],
                    "delta_v_mps": sw["delta_v_mps"],
                    "abs_delta_v_kmh": sw["abs_delta_v_kmh"],
                    "delta_energy_kj": sw["delta_energy_kj"],
                    "abs_delta_energy_kj": sw["abs_delta_energy_kj"],
                })

    df_robustness = pd.DataFrame(robustness_results)
    rob_csv = OUTPUT_PROCESSED_DIR / "redbull_experiment_04_segmentation_robustness.csv"
    df_robustness.to_csv(rob_csv, index=False)
    print(f"\nSaved Red Bull robustness sweep to: {rob_csv}")

    df_bmetrics = pd.DataFrame(all_boundary_metrics)
    bmetrics_csv = OUTPUT_PROCESSED_DIR / "redbull_experiment_04_boundary_metrics.csv"
    df_bmetrics.to_csv(bmetrics_csv, index=False)
    print(f"Saved Red Bull boundary metrics to: {bmetrics_csv}")

    # Plot Sensitivity Comparison
    plt.figure(figsize=(10, 6), dpi=200)
    labels = df_robustness["resolution_label"]
    t_theo_vals = df_robustness["theoretical_lap_time_s"]
    t_feas_vals = df_robustness["feasible_lap_time_s"]
    penalties = df_robustness["feasibility_penalty_s"]

    x = np.arange(len(labels))
    w = 0.35

    plt.subplot(2, 1, 1)
    plt.bar(x - w/2, t_theo_vals, w, label="Theoretical Lap Time", color="#FFAEAA")
    plt.bar(x + w/2, t_feas_vals, w, label="Feasible Lap Time", color="#1E41FF")
    plt.axhline(t_ver_obs, color="#17191D", ls="--", label=f"Verstappen Baseline ({t_ver_obs:.3f} s)")
    plt.ylabel("Lap Time (s)", fontsize=9)
    plt.ylim(87, 95)
    plt.title("Red Bull Segmentation Sensitivity Sweep — Lap Times", fontsize=11, fontweight="bold")
    plt.xticks(x, labels)
    plt.legend(frameon=True, facecolor="#F4F1EA")
    plt.grid(axis="y", alpha=0.3)

    plt.subplot(2, 1, 2)
    plt.bar(labels, penalties, color="#C83E36", width=0.45)
    for i, p in enumerate(penalties):
        plt.text(i, p + 0.1, f"+{p:.3f} s", ha="center", fontfamily="sans-serif", fontsize=9)
    plt.ylabel("Feasibility Penalty (s)", fontsize=9)
    plt.title("Feasibility Penalty (T_feasible - T_theoretical)", fontsize=10, fontweight="bold")
    plt.grid(axis="y", alpha=0.3)
    plt.tight_layout()

    plot_sens = OUTPUT_PLOTS_DIR / "redbull_segmentation_sensitivity.png"
    plt.savefig(plot_sens)
    plt.close()
    print(f"Saved sensitivity plot to: {plot_sens}")


if __name__ == "__main__":
    main()

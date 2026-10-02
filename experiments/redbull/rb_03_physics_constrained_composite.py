"""
Experiment RB-03: Physics-Constrained Feasibility and State-Continuity Analysis (Red Bull Racing: VER vs PER).
Applies Level-2 coupled vehicle dynamics with periodic boundary bisection solve on canonical 100m composite.
"""

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from src.composite.physics_composite import PhysicsConstrainedCompositeBuilder
from src.vehicle_model.level2_coupled import Level2CoupledModel
from src.vehicle_model.forward_backward_solver import ForwardBackwardSolver
from src.synthesis.gap_attribution import GapAttributionAnalyzer
from src.configs.redbull_config import OUTPUT_PROCESSED_DIR, OUTPUT_PLOTS_DIR


def main():
    print("=" * 85)
    print("F1 Research Pipeline: Experiment RB-03 — Red Bull Physics-Constrained Feasibility")
    print("=" * 85)

    # 1. Load aligned telemetry and 100m theoretical composite
    aligned_csv = OUTPUT_PROCESSED_DIR / "redbull_aligned_telemetry.csv"
    theo_segs_csv = OUTPUT_PROCESSED_DIR / "redbull_theoretical_composite_100m.csv"
    theo_jumps_csv = OUTPUT_PROCESSED_DIR / "redbull_theoretical_composite_jumps_100m.csv"
    params_csv = OUTPUT_PROCESSED_DIR / "redbull_calibrated_parameters.csv"

    if not aligned_csv.exists() or not theo_segs_csv.exists() or not params_csv.exists():
        raise FileNotFoundError("Missing prerequisite artifacts. Run rb_00, rb_01, rb_02 first.")

    df_aligned = pd.read_csv(aligned_csv)
    df_segs = pd.read_csv(theo_segs_csv)
    df_jumps = pd.read_csv(theo_jumps_csv)
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

    t_ver_obs = float(df_ver["Time_s"].iloc[-1])
    t_per_obs = float(df_per["Time_s"].iloc[-1])
    t_theoretical = float(df_segs["dt_winner"].sum())

    print(f"VER Observed Lap Time: {t_ver_obs:.3f} s")
    print(f"PER Observed Lap Time: {t_per_obs:.3f} s")
    print(f"T_theoretical (100m):  {t_theoretical:.3f} s (Gain vs VER: +{t_ver_obs - t_theoretical:.3f} s)")

    # 2. Assemble Composite Arrays
    print("\nAssembling Composite Trajectory Arrays via PhysicsConstrainedCompositeBuilder...")
    comp_builder = PhysicsConstrainedCompositeBuilder(step_ds=1.0)
    df_comp = comp_builder.build_composite_arrays(
        df_ver, df_per, df_segs, driver1_name="Verstappen", driver2_name="Perez"
    )

    s = df_comp["Distance"].values
    kappa_comp = df_comp["Curvature_kappa"].values
    drs_comp = df_comp["DRS_active"].values
    v_donor_caps = df_comp["Donor_Speed_mps"].values

    # 3. Initialize Calibrated Model and Solver
    print(f"\nInitializing Calibrated Level-2 Model: Policy A (mu_x={l2_params['mu_x']:.3f}, k_drag_off={l2_params['k_drag_drs_off']:.4f}, k_down={l2_params['k_down']:.4f}, mu_y={l2_params['mu_y']:.4f})...")
    model = Level2CoupledModel(l2_params)
    solver = ForwardBackwardSolver(model, step_ds=1.0)

    # 4. Solves
    print("\nExecuting Periodic Boundary-Value Physics Solves (tol <= 0.01 m/s)...")

    # Case A: Optimal Geometry
    print("  Solving Case A: Optimal Geometry Reference (T_optimal_geom)...")
    sim_optimal, diag_optimal = solver.solve_periodic_lap(
        distances=s, curvatures=kappa_comp, drs_active=drs_comp, v_donor_caps=None, tol=0.01
    )
    t_optimal_geom = diag_optimal["lap_time"]

    # Case B: Feasible Lap (Donor Capped)
    print("  Solving Case B: Donor-Capped Feasible Lap (T_feasible_donor_capped)...")
    sim_feasible, diag_feasible = solver.solve_periodic_lap(
        distances=s, curvatures=kappa_comp, drs_active=drs_comp, v_donor_caps=v_donor_caps, tol=0.01
    )
    t_feasible_donor_capped = diag_feasible["lap_time"]

    # Single driver simulated baselines
    print("  Solving Single Driver Simulated Baselines...")
    sim_ver, diag_ver = solver.solve_periodic_lap(
        distances=s, curvatures=df_ver["Curvature_kappa"].values, drs_active=df_ver["DRS_active"].values, v_donor_caps=None, tol=0.01
    )
    t_ver_sim = diag_ver["lap_time"]

    sim_per, diag_per = solver.solve_periodic_lap(
        distances=s, curvatures=df_per["Curvature_kappa"].values, drs_active=df_per["DRS_active"].values, v_donor_caps=None, tol=0.01
    )
    t_per_sim = diag_per["lap_time"]

    # 5. Core Metric Calculations
    theo_gain_ver = t_ver_obs - t_theoretical
    theo_gain_per = t_per_obs - t_theoretical
    feas_gain_ver = t_ver_obs - t_feasible_donor_capped
    feas_gain_per = t_per_obs - t_feasible_donor_capped
    theo_to_feas_gap = t_feasible_donor_capped - t_theoretical
    donor_cap_penalty = t_feasible_donor_capped - t_optimal_geom

    print("\n" + "=" * 60)
    print(f"HEADLINE RESULTS (Red Bull Racing 100m Canonical):")
    print(f"  T_VER_obs:                  {t_ver_obs:.3f} s")
    print(f"  T_PER_obs:                  {t_per_obs:.3f} s")
    print(f"  T_theoretical:              {t_theoretical:.3f} s (Gain vs VER: +{theo_gain_ver:.3f} s)")
    print(f"  T_optimal_geom:             {t_optimal_geom:.3f} s")
    print(f"  T_feasible_donor_capped:    {t_feasible_donor_capped:.3f} s (Gain vs VER: {feas_gain_ver:.3f} s)")
    print(f"  Theoretical-to-Feasible Gap: +{theo_to_feas_gap:.3f} s")
    print(f"  Donor-Cap Penalty vs Opt:   +{donor_cap_penalty:.3f} s")
    print(f"  Periodicity Residual:       {diag_feasible['periodicity_error']:.6f} m/s")
    print(f"  Max Donor Cap Violation:    {diag_feasible.get('max_donor_cap_violation', 0.0):.6f} m/s")
    print("=" * 60)

    # 6. Diagnostic Gap Attribution
    print("\nComputing Diagnostic Gap Attribution Breakdown...")
    gap_analyzer = GapAttributionAnalyzer(mass=810.0)
    diag_breakdown = gap_analyzer.attribute_gap(
        sim_df=sim_feasible,
        segments_df=df_segs,
        jumps_df=df_jumps,
        gap_total_s=theo_to_feas_gap,
    )

    print(f"  Boundary KE Penalty:          +{diag_breakdown['diagnostic_ke_acceleration_penalty_s']:.3f} s")
    print(f"  Boundary Braking Penalty:     +{diag_breakdown['diagnostic_braking_displacement_penalty_s']:.3f} s")
    print(f"  Corner Exit Grip Deficit:     +{diag_breakdown['diagnostic_corner_exit_grip_deficit_s']:.3f} s")
    print(f"  Residual Propagation Term:    +{diag_breakdown['residual_state_propagation_term_s']:.3f} s")

    # 7. Save Processed Trajectory and Summary
    sim_feasible_out = sim_feasible.copy()
    sim_feasible_out["Speed_kmh"] = sim_feasible_out["Speed_mps"] * 3.6
    sim_feasible_out["Donor_Speed_mps"] = v_donor_caps
    sim_feasible_out["Donor_Speed_kmh"] = v_donor_caps * 3.6
    sim_feasible_out["Selected_Driver"] = df_comp["Donor_Driver"]
    sim_feasible_out["Curvature_kappa"] = kappa_comp
    sim_feasible_out["DRS_active"] = drs_comp

    out_comp_csv = OUTPUT_PROCESSED_DIR / "redbull_physics_constrained_composite_100m.csv"
    sim_feasible_out.to_csv(out_comp_csv, index=False)
    print(f"\nSaved feasible trajectory to: {out_comp_csv}")

    switches = df_jumps[df_jumps["driver_switch"] == True]
    summary_data = {
        "Canonical_Track_Length_m": float(s[-1]),
        "T_VER_obs_s": round(t_ver_obs, 3),
        "T_PER_obs_s": round(t_per_obs, 3),
        "T_theoretical_s": round(t_theoretical, 3),
        "T_optimal_geom_s": round(t_optimal_geom, 3),
        "T_feasible_donor_capped_s": round(t_feasible_donor_capped, 3),
        "T_VER_sim_s": round(t_ver_sim, 3),
        "T_PER_sim_s": round(t_per_sim, 3),
        "Theoretical_Gain_vs_VER_s": round(theo_gain_ver, 3),
        "Theoretical_Gain_vs_PER_s": round(theo_gain_per, 3),
        "Optimal_Geometry_Gain_vs_VER_s": round(t_ver_obs - t_optimal_geom, 3),
        "Feasible_Gain_vs_VER_s": round(feas_gain_ver, 3),
        "Theoretical_to_Feasible_Gap_s": round(theo_to_feas_gap, 3),
        "Theoretical_to_Optimal_Diff_s": round(t_optimal_geom - t_theoretical, 3),
        "Donor_Cap_Penalty_vs_Optimal_s": round(donor_cap_penalty, 3),
        "Number_of_Donor_Switches": len(switches),
        "Max_Abs_Boundary_Delta_V_mps": round(float(switches["abs_delta_v_mps"].max()), 3),
        "Max_Abs_Boundary_Delta_V_kmh": round(float(switches["abs_delta_v_mps"].max() * 3.6), 2),
        "Max_Abs_Boundary_Delta_KE_kJ": round(float(switches["abs_delta_energy_kj"].max()), 2),
        "Sum_of_Abs_Boundary_KE_Mismatches_kJ": round(float(switches["abs_delta_energy_kj"].sum()), 2),
        "Periodicity_Error_Feasible_mps": round(float(diag_feasible["periodicity_error"]), 6),
        "Periodicity_Error_Optimal_mps": round(float(diag_optimal["periodicity_error"]), 6),
        "Diagnostic_KE_Penalty_s": round(float(diag_breakdown["diagnostic_ke_acceleration_penalty_s"]), 3),
        "Diagnostic_Braking_Penalty_s": round(float(diag_breakdown["diagnostic_braking_displacement_penalty_s"]), 3),
        "Diagnostic_Corner_Exit_Grip_Deficit_s": round(float(diag_breakdown["diagnostic_corner_exit_grip_deficit_s"]), 3),
        "Residual_State_Propagation_Term_s": round(float(diag_breakdown["residual_state_propagation_term_s"]), 3),
    }

    summary_df = pd.DataFrame([summary_data])
    out_summary_csv = OUTPUT_PROCESSED_DIR / "redbull_experiment_03_summary.csv"
    summary_df.to_csv(out_summary_csv, index=False)
    print(f"Saved Exp 03 summary to: {out_summary_csv}")

    # 8. Plots
    # Speed profile comparison
    plt.figure(figsize=(14, 6), dpi=200)
    plt.plot(s, v_donor_caps * 3.6, color="#FFAEAA", ls="--", lw=1.2, label=f"Theoretical Donor Ceiling ({t_theoretical:.3f} s)")
    plt.plot(s, sim_feasible["Speed_mps"] * 3.6, color="#1E41FF", lw=1.6, label=f"Feasible Lap Profile ({t_feasible_donor_capped:.3f} s)")
    plt.plot(s, sim_optimal["Speed_mps"] * 3.6, color="#657887", lw=1.0, alpha=0.7, label=f"Optimal Geometry ({t_optimal_geom:.3f} s)")
    plt.title("Red Bull RB19 Experiment 03 — Speed Profiles: Feasible vs. Theoretical Ceiling", fontsize=11, fontweight="bold")
    plt.xlabel("Track Distance (m)", fontsize=9)
    plt.ylabel("Speed (km/h)", fontsize=9)
    plt.grid(True, alpha=0.3)
    plt.legend(frameon=True, facecolor="#F4F1EA")
    plt.tight_layout()
    plot_speed = OUTPUT_PLOTS_DIR / "redbull_exp03_speed_profiles.png"
    plt.savefig(plot_speed)
    plt.close()

    # Diagnostic waterfall plot
    components = [
        ("ΔT_KE", diag_breakdown["diagnostic_ke_acceleration_penalty_s"], "#C83E36"),
        ("ΔT_brake", diag_breakdown["diagnostic_braking_displacement_penalty_s"], "#657887"),
        ("ΔT_traction", diag_breakdown["diagnostic_corner_exit_grip_deficit_s"], "#737D70"),
        ("ΔT_residual", diag_breakdown["residual_state_propagation_term_s"], "#26282B"),
    ]
    plt.figure(figsize=(9, 4.5), dpi=200)
    names = [c[0] for c in components]
    vals = [c[1] for c in components]
    colors = [c[2] for c in components]
    bars = plt.barh(names, vals, color=colors, height=0.55)
    for bar in bars:
        w = bar.get_width()
        plt.text(w + 0.02, bar.get_y() + bar.get_height() / 2, f"+{w:.3f} s", va="center", fontfamily="sans-serif", fontsize=9)
    plt.xlim(0, max(vals) * 1.25)
    plt.title(f"Red Bull Diagnostic Gap Attribution Breakdown (Total Gap: +{theo_to_feas_gap:.3f} s)", fontsize=11, fontweight="bold")
    plt.xlabel("Penalty Duration (seconds)", fontsize=9)
    plt.grid(axis="x", alpha=0.3)
    plt.tight_layout()
    plot_waterfall = OUTPUT_PLOTS_DIR / "redbull_exp03_diagnostic_waterfall.png"
    plt.savefig(plot_waterfall)
    plt.close()
    print(f"Saved diagnostic plots to: {plot_speed} and {plot_waterfall}")


if __name__ == "__main__":
    main()

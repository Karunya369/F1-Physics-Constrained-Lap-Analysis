"""
Experiment RB-01: Red Bull RB19 Vehicle Model Calibration & Validation Hierarchy.
Calibrates Level 0, Level 1, and Level 2 vehicle models on Max Verstappen's telemetry (training)
and cross-validates on Sergio Perez's telemetry (evaluation).
Adheres strictly to Policy A (mu_x = 1.700 fixed literature reference).
"""

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from src.vehicle_model.level0_longitudinal import Level0LongitudinalModel
from src.vehicle_model.level1_aero import Level1AeroModel
from src.vehicle_model.level2_coupled import Level2CoupledModel
from src.vehicle_model.forward_backward_solver import ForwardBackwardSolver
from src.vehicle_model.calibrator import ModelValidator, ModelCalibrator
from src.configs.redbull_config import OUTPUT_PROCESSED_DIR, OUTPUT_PLOTS_DIR, DEFAULT_PARAMS


def main():
    print("=" * 80)
    print("F1 Research Pipeline: Experiment RB-01 — Red Bull Vehicle Model Calibration")
    print("=" * 80)

    # 1. Load aligned telemetry
    aligned_csv = OUTPUT_PROCESSED_DIR / "redbull_aligned_telemetry.csv"
    if not aligned_csv.exists():
        raise FileNotFoundError(f"Missing {aligned_csv}. Run rb_00_data_validation.py first.")

    df_aligned = pd.read_csv(aligned_csv)

    # Prepare single-driver reference dataframes
    df_ver = pd.DataFrame({
        "Distance": df_aligned["Distance"],
        "Speed_mps": df_aligned["Speed_VER_mps"],
        "Time_s": df_aligned["Time_VER_s"],
        "Curvature_kappa": df_aligned["Curvature_kappa"],
        "DRS_active": df_aligned["DRS_active"],
        "Accel_x_mps2": np.gradient(df_aligned["Speed_VER_mps"], df_aligned["Distance"]) * df_aligned["Speed_VER_mps"],
    })

    df_per = pd.DataFrame({
        "Distance": df_aligned["Distance"],
        "Speed_mps": df_aligned["Speed_PER_mps"],
        "Time_s": df_aligned["Time_PER_s"],
        "Curvature_kappa": df_aligned["Curvature_kappa"],
        "DRS_active": df_aligned["DRS_active"],
        "Accel_x_mps2": np.gradient(df_aligned["Speed_PER_mps"], df_aligned["Distance"]) * df_aligned["Speed_PER_mps"],
    })

    s = df_ver["Distance"].values
    curvatures = df_ver["Curvature_kappa"].values
    drs = df_ver["DRS_active"].values
    v_init_ver = float(df_ver["Speed_mps"].iloc[0])
    v_init_per = float(df_per["Speed_mps"].iloc[0])

    print(f"\nTraining telemetry: Max Verstappen ({df_ver['Time_s'].iloc[-1]:.3f} s)")
    print(f"Cross-validation telemetry: Sergio Perez ({df_per['Time_s'].iloc[-1]:.3f} s)")

    results = []
    models_to_test = [
        ("Level 0: Pure Longitudinal", Level0LongitudinalModel),
        ("Level 1: Longitudinal + Aero", Level1AeroModel),
        ("Level 2: Coupled (Policy A)", Level2CoupledModel),
    ]

    calibrated_models = {}

    for model_name, model_cls in models_to_test:
        print(f"\n--- Calibrating {model_name} on VER Telemetry ---")
        calibrator = ModelCalibrator(model_cls)
        calibrated_model, params = calibrator.calibrate(df_ver, max_iters=20)
        calibrated_models[model_name] = (calibrated_model, params)

        print(f"  Calibrated Parameters:")
        for k in ["k_drag_drs_off", "k_down", "mu_x", "mu_y", "power_max"]:
            if k in params:
                print(f"    {k}: {params[k]:.4f}")

        solver = ForwardBackwardSolver(calibrated_model, step_ds=1.0)

        # 1. Training Evaluation (VER)
        sim_ver = solver.solve_lap(s, curvatures, drs, v_initial=v_init_ver)
        metrics_ver = ModelValidator.compute_validation_metrics(sim_ver, df_ver)
        metrics_ver["model"] = model_name
        metrics_ver["test_driver"] = "VER (Training)"
        metrics_ver["periodicity_error_mps"] = abs(sim_ver["Speed_mps"].iloc[-1] - sim_ver["Speed_mps"].iloc[0])
        results.append(metrics_ver)

        print(f"  VER -> Lap Time: {metrics_ver['lap_time_sim_s']}s (Error: {metrics_ver['lap_time_error_s']}s, RMSE: {metrics_ver['velocity_rmse_mps']} m/s) -> Verdict: {metrics_ver['verdict']}")

        # 2. Cross-Validation Evaluation (PER)
        sim_per = solver.solve_lap(s, curvatures, drs, v_initial=v_init_per)
        metrics_per = ModelValidator.compute_validation_metrics(sim_per, df_per)
        metrics_per["model"] = model_name
        metrics_per["test_driver"] = "PER (Cross-Validation)"
        metrics_per["periodicity_error_mps"] = abs(sim_per["Speed_mps"].iloc[-1] - sim_per["Speed_mps"].iloc[0])
        results.append(metrics_per)

        print(f"  PER -> Lap Time: {metrics_per['lap_time_sim_s']}s (Error: {metrics_per['lap_time_error_s']}s, RMSE: {metrics_per['velocity_rmse_mps']} m/s) -> Verdict: {metrics_per['verdict']}")

    df_results = pd.DataFrame(results)
    val_csv = OUTPUT_PROCESSED_DIR / "redbull_model_validation_results.csv"
    df_results.to_csv(val_csv, index=False)
    print(f"\nSaved Red Bull validation table to: {val_csv}")

    # Save calibrated parameters for Level 2
    l2_model, l2_params = calibrated_models["Level 2: Coupled (Policy A)"]
    params_df = pd.DataFrame([l2_params])
    params_csv = OUTPUT_PROCESSED_DIR / "redbull_calibrated_parameters.csv"
    params_df.to_csv(params_csv, index=False)
    print(f"Saved Red Bull Level-2 calibrated parameters to: {params_csv}")

    # Generate Validation Plots
    solver_l2 = ForwardBackwardSolver(l2_model, step_ds=1.0)
    sim_ver_l2 = solver_l2.solve_lap(s, curvatures, drs, v_initial=v_init_ver)

    plt.figure(figsize=(14, 6), dpi=200)
    plt.subplot(2, 1, 1)
    plt.plot(df_ver["Distance"], df_ver["Speed_mps"] * 3.6, label="Observed VER (FastF1)", color="#1E41FF", lw=1.5)
    plt.plot(sim_ver_l2["Distance"], sim_ver_l2["Speed_mps"] * 3.6, label="Simulated Level-2 (Policy A)", color="#FF1801", lw=1.2, ls="--")
    plt.title("Red Bull RB19 Model Validation — Max Verstappen Baseline Overlay", fontsize=11, fontweight="bold")
    plt.ylabel("Speed (km/h)", fontsize=9)
    plt.grid(True, alpha=0.3)
    plt.legend(frameon=True, facecolor="#F4F1EA")

    plt.subplot(2, 1, 2)
    speed_err = (sim_ver_l2["Speed_mps"].values - df_ver["Speed_mps"].values) * 3.6
    plt.plot(df_ver["Distance"], speed_err, color="#657887", lw=1.0)
    plt.axhline(0, color="#17191D", ls="--", lw=0.8)
    plt.fill_between(df_ver["Distance"], speed_err, 0, color="#657887", alpha=0.2)
    plt.title("Simulation Error Profile: v_sim - v_ref (km/h)", fontsize=10)
    plt.xlabel("Track Distance (m)", fontsize=9)
    plt.ylabel("Error (km/h)", fontsize=9)
    plt.grid(True, alpha=0.3)
    plt.tight_layout()

    val_plot = OUTPUT_PLOTS_DIR / "redbull_validation_Max Verstappen.png"
    plt.savefig(val_plot)
    plt.close()
    print(f"Saved validation plot to: {val_plot}")


if __name__ == "__main__":
    main()

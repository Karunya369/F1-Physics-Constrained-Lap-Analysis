"""
Experiment 01: Vehicle Model Validation & Hierarchy Gate.
Evaluates Level 0, Level 1, and Level 2 models against real telemetry from the MVP session.
Verifies the empirical necessity of advancing from Level 0 to Level 1 and Level 2.

Audit & Consistency Standard:
- Distinguishes three distinct lap-time references:
  1. Measured FastF1 LapTime (official timing transponder)
  2. Integrated time from spatial telemetry: t(s) = integral (1 / v(s)) ds
  3. Solver-generated lap time: t_sim(s) = integral (1 / v_sim(s)) ds
- Model validation uses the spatially integrated time as the unified reference,
  matching the spatial discretization and numerical formulation of the forward-backward solver.
- No artificial speed caps (e.g. 1.02x observed envelope cap) are applied to the solver.
"""

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

import pandas as pd
import numpy as np
from src.ingestion.fetcher import FastF1Fetcher
from src.ingestion.lap_curator import LapCurator
from src.preprocessing.spatial_resampler import SpatialResampler
from src.preprocessing.geometry import TrajectoryGeometry
from src.vehicle_model.level0_longitudinal import Level0LongitudinalModel
from src.vehicle_model.level1_aero import Level1AeroModel
from src.vehicle_model.level2_coupled import Level2CoupledModel
from src.vehicle_model.forward_backward_solver import ForwardBackwardSolver
from src.vehicle_model.calibrator import ModelValidator, ModelCalibrator
from src.visualization.plot_telemetry import plot_validation_overlay
from src.config import VALIDATION_THRESHOLDS


def integrate_spatial_time(speed_mps: np.ndarray, step_ds: float = 1.0) -> np.ndarray:
    """
    Compute cumulative time from spatial speed profile using midpoint Riemann sum,
    identical to the formulation used in ForwardBackwardSolver.
    """
    dt = np.zeros(len(speed_mps))
    dt[1:] = step_ds / (0.5 * (speed_mps[:-1] + speed_mps[1:]))
    return np.cumsum(dt)


def main():
    print("=" * 75)
    print("F1 Research Pipeline: Experiment 01 - Model Validation & Hierarchy Gate")
    print("=" * 75)

    fetcher = FastF1Fetcher()
    session = fetcher.get_session(2023, "Bahrain", "Q")

    print("\nExtracting and resampling clean Q3 telemetry for Leclerc (LEC) and Sainz (SAI)...")
    lap_lec, lap_sai, meta = LapCurator.get_fastest_teammate_laps(session, "LEC", "SAI")
    raw_lec = LapCurator.extract_raw_telemetry(lap_lec)
    raw_sai = LapCurator.extract_raw_telemetry(lap_sai)

    resampler = SpatialResampler(step_ds=1.0)
    df_lec_raw = resampler.resample_lap(raw_lec)
    df_sai_raw = resampler.resample_lap(raw_sai)

    # Align track lengths
    df_lec, df_sai = SpatialResampler.align_teammates(df_lec_raw, df_sai_raw, step_ds=1.0)

    # Derive track geometry and curvature
    geom = TrajectoryGeometry(step_ds=1.0)
    df_lec = geom.compute_geometry(df_lec)
    df_sai = geom.compute_geometry(df_sai)

    s = df_lec["Distance"].values
    curvatures = df_lec["Curvature_kappa"].values
    drs = df_lec["DRS_active"].values
    v_init = float(df_lec["Speed_mps"].iloc[0])

    # Unify lap-time references:
    # 1. Measured FastF1 LapTime (transponder)
    t_transponder_lec = float(meta["lap_time_d1"])
    t_transponder_sai = float(meta["lap_time_d2"])

    # 2. Resampled raw telemetry time (PCHIP interpolation)
    t_pchip_lec = float(df_lec["Time_s"].iloc[-1])
    t_pchip_sai = float(df_sai["Time_s"].iloc[-1])

    # 3. Spatially integrated time: integral (1/v) ds
    # Replace Time_s in reference DataFrames with the exact spatial integral
    # to guarantee 1-to-1 consistency with the solver's spatial time integration.
    df_lec["Time_s"] = integrate_spatial_time(df_lec["Speed_mps"].values, step_ds=1.0)
    df_sai["Time_s"] = integrate_spatial_time(df_sai["Speed_mps"].values, step_ds=1.0)
    t_spatial_lec = float(df_lec["Time_s"].iloc[-1])
    t_spatial_sai = float(df_sai["Time_s"].iloc[-1])

    print(f"Track length: {s[-1]:.1f} m | Grid resolution: 1.0 m")
    print("\nLap-Time Reference Audit:")
    print(f"  LEC Official Transponder LapTime:       {t_transponder_lec:.3f} s")
    print(f"  LEC Resampled Telemetry Time (PCHIP):   {t_pchip_lec:.3f} s")
    print(f"  LEC Spatially Integrated Time (trapz):  {t_spatial_lec:.3f} s  <-- UNIFIED VALIDATION REFERENCE")
    print()
    print(f"  SAI Official Transponder LapTime:       {t_transponder_sai:.3f} s")
    print(f"  SAI Resampled Telemetry Time (PCHIP):   {t_pchip_sai:.3f} s")
    print(f"  SAI Spatially Integrated Time (trapz):  {t_spatial_sai:.3f} s  <-- UNIFIED VALIDATION REFERENCE")

    # Evaluate Model Hierarchy
    models = [
        ("Level 0: Pure Longitudinal", Level0LongitudinalModel),
        ("Level 1: Longitudinal + Aero", Level1AeroModel),
        ("Level 2: Coupled + Friction Ellipse", Level2CoupledModel),
    ]

    validation_results = []
    best_level2_sim = None

    for name, model_cls in models:
        print(f"\nEvaluating {name}...")
        # Calibrate on Driver A (Leclerc)
        calibrator = ModelCalibrator(model_cls)
        calibrated_model, params = calibrator.calibrate(df_lec, max_iters=25)

        # Simulate on Driver A without artificial envelope speed caps
        is_periodic = ("Level 2" in name)
        solver = ForwardBackwardSolver(calibrated_model, step_ds=1.0)
        sim_df = solver.solve_lap(s, curvatures, drs, v_initial=v_init, periodic=is_periodic)

        # Audit against metrics using unified spatial reference
        metrics_lec = ModelValidator.compute_validation_metrics(sim_df, df_lec)
        metrics_lec["model"] = name
        metrics_lec["test_driver"] = "LEC (Training)"
        metrics_lec["transponder_ref_s"] = t_transponder_lec
        metrics_lec["v0_mps"] = round(float(sim_df["Speed_mps"].iloc[0]), 3)
        metrics_lec["v_final_mps"] = round(float(sim_df["Speed_mps"].iloc[-1]), 3)
        metrics_lec["periodicity_error_mps"] = round(abs(float(sim_df["Speed_mps"].iloc[-1]) - float(sim_df["Speed_mps"].iloc[0])), 4)
        validation_results.append(metrics_lec)

        # Cross-validate on Driver B (Sainz) without artificial caps
        v_init_sai = float(df_sai["Speed_mps"].iloc[0])
        sim_df_sai = solver.solve_lap(
            s, df_sai["Curvature_kappa"].values, df_sai["DRS_active"].values, v_initial=v_init_sai, periodic=is_periodic
        )
        metrics_sai = ModelValidator.compute_validation_metrics(sim_df_sai, df_sai)
        metrics_sai["model"] = name
        metrics_sai["test_driver"] = "SAI (Cross-Validation)"
        metrics_sai["transponder_ref_s"] = t_transponder_sai
        metrics_sai["v0_mps"] = round(float(sim_df_sai["Speed_mps"].iloc[0]), 3)
        metrics_sai["v_final_mps"] = round(float(sim_df_sai["Speed_mps"].iloc[-1]), 3)
        metrics_sai["periodicity_error_mps"] = round(abs(float(sim_df_sai["Speed_mps"].iloc[-1]) - float(sim_df_sai["Speed_mps"].iloc[0])), 4)
        validation_results.append(metrics_sai)

        if "Level 2" in name:
            best_level2_sim = sim_df
            plot_validation_overlay(sim_df, df_lec, "Charles Leclerc", "Level 2 Coupled")

    val_df = pd.DataFrame(validation_results)
    print("\n" + "=" * 75)
    print("MODEL VALIDATION HIERARCHY AUDIT RESULTS:")
    print("=" * 75)
    cols = ["model", "test_driver", "verdict", "lap_time_sim_s", "lap_time_ref_s", "lap_time_error_s", "velocity_rmse_mps", "top_speed_error_mps"]
    print(val_df[cols].to_string(index=False))

    # Explicit Validation Gate Assessment
    print("\n" + "=" * 75)
    print("VALIDATION GATE VERDICT & HONEST ASSESSMENT:")
    print("=" * 75)
    target_pass_count = (val_df["verdict"] == "TARGET_PASS").sum()
    inadequate_count = (val_df["verdict"] == "INADEQUATE").sum()
    failed_count = (val_df["verdict"] == "FAILED_UNTRUSTABLE").sum()

    print(f"Target Pass Count:     {target_pass_count} / {len(val_df)}")
    print(f"Inadequate Count:      {inadequate_count} / {len(val_df)}")
    print(f"Failed/Untrustable:    {failed_count} / {len(val_df)}")
    print(f"\nDeclared Target Thresholds: Lap Time Error <= {VALIDATION_THRESHOLDS['lap_time_error_target']} s, Velocity RMSE <= {VALIDATION_THRESHOLDS['velocity_rmse_target']} m/s")
    print(f"Inadequate Thresholds:      Lap Time Error <= {VALIDATION_THRESHOLDS['lap_time_error_inadequate']} s, Velocity RMSE <= {VALIDATION_THRESHOLDS['velocity_rmse_inadequate']} m/s")

    level2_lec = val_df[(val_df["model"].str.contains("Level 2")) & (val_df["test_driver"].str.contains("LEC"))].iloc[0]
    level2_sai = val_df[(val_df["model"].str.contains("Level 2")) & (val_df["test_driver"].str.contains("SAI"))].iloc[0]

    print(f"\nLevel 2 Coupled Model Verdict:")
    print(f"  LEC: Lap Time Error = {level2_lec['lap_time_error_s']:.3f} s, RMSE = {level2_lec['velocity_rmse_mps']:.3f} m/s -> {level2_lec['verdict']}")
    print(f"  SAI: Lap Time Error = {level2_sai['lap_time_error_s']:.3f} s, RMSE = {level2_sai['velocity_rmse_mps']:.3f} m/s -> {level2_sai['verdict']}")

    if target_pass_count == 0:
        print("\n*** CRITICAL SCIENTIFIC AUDIT FINDING ***")
        print("NO MODEL SATISFIES TARGET_PASS (<=1.50 s AND <=3.00 m/s).")
        print("Level 2 Coupled model status is: " + level2_lec['verdict'])
        print("The simulation is NOT yet at production fidelity without telemetry capping.")
    else:
        print("\nTarget pass achieved for at least one model.")

    # Save validation table
    val_csv = PROJECT_ROOT / "data" / "processed" / "model_validation_results.csv"
    val_df.to_csv(val_csv, index=False)
    print(f"\nSaved validation results to: {val_csv}")


if __name__ == "__main__":
    main()

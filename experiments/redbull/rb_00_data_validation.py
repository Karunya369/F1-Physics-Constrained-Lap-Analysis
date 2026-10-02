"""
Experiment RB-00: Red Bull Racing Telemetry Validation & Driver Baselines.
Extracts, resamples, and validates Q3 flying laps for Max Verstappen (VER) and Sergio Perez (PER).
"""

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from src.ingestion.fetcher import FastF1Fetcher
from src.ingestion.lap_curator import LapCurator
from src.preprocessing.spatial_resampler import SpatialResampler
from src.preprocessing.geometry import TrajectoryGeometry
from src.configs.redbull_config import (
    YEAR, RACE, SESSION_TYPE, DRIVER_1_CODE, DRIVER_2_CODE,
    OUTPUT_PROCESSED_DIR, OUTPUT_PLOTS_DIR
)


def integrate_spatial_time(speed_mps: np.ndarray, step_ds: float = 1.0) -> np.ndarray:
    dt = np.zeros(len(speed_mps))
    dt[1:] = step_ds / (0.5 * (speed_mps[:-1] + speed_mps[1:]))
    return np.cumsum(dt)


def main():
    print("=" * 75)
    print("F1 Research Pipeline: Experiment RB-00 — Red Bull Data Validation")
    print("=" * 75)

    fetcher = FastF1Fetcher()
    session = fetcher.get_session(YEAR, RACE, SESSION_TYPE)

    print(f"\n1. Ingesting clean Q3 laps for {DRIVER_1_CODE} and {DRIVER_2_CODE}...")
    lap_ver, lap_per, meta = LapCurator.get_fastest_teammate_laps(session, DRIVER_1_CODE, DRIVER_2_CODE)

    print(f"  Official Transponder LapTime (VER): {meta['lap_time_d1']:.3f} s (Compound: {meta['compound_d1']})")
    print(f"  Official Transponder LapTime (PER): {meta['lap_time_d2']:.3f} s (Compound: {meta['compound_d2']})")
    print(f"  Teammate Delta: {meta['time_delta']:.3f} s | Matching Compound: {meta['compound_match']}")

    # Extract raw telemetry
    raw_ver = LapCurator.extract_raw_telemetry(lap_ver)
    raw_per = LapCurator.extract_raw_telemetry(lap_per)

    print(f"\n2. Spatial Resampling (step_ds = 1.0 m, monotonic PCHIP)...")
    resampler = SpatialResampler(step_ds=1.0)
    df_ver_resampled = resampler.resample_lap(raw_ver)
    df_per_resampled = resampler.resample_lap(raw_per)

    # Align track lengths to canonical domain
    df_ver, df_per = SpatialResampler.align_teammates(df_ver_resampled, df_per_resampled, step_ds=1.0)

    # Derive track curvature
    geom = TrajectoryGeometry(step_ds=1.0)
    df_ver = geom.compute_geometry(df_ver)
    df_per = geom.compute_geometry(df_per)

    # Calculate unified spatially integrated time
    df_ver["Time_s"] = integrate_spatial_time(df_ver["Speed_mps"].values, step_ds=1.0)
    df_per["Time_s"] = integrate_spatial_time(df_per["Speed_mps"].values, step_ds=1.0)

    t_spatial_ver = float(df_ver["Time_s"].iloc[-1])
    t_spatial_per = float(df_per["Time_s"].iloc[-1])

    print(f"\n3. Spatial Integration Standard:")
    print(f"  VER Integrated Time: {t_spatial_ver:.3f} s (delta vs transponder: {abs(t_spatial_ver - meta['lap_time_d1']):.3f} s)")
    print(f"  PER Integrated Time: {t_spatial_per:.3f} s (delta vs transponder: {abs(t_spatial_per - meta['lap_time_d2']):.3f} s)")
    print(f"  Track Distance Domain: 0.0 m -> {df_ver['Distance'].iloc[-1]:.1f} m ({len(df_ver)} spatial points)")

    # Baseline Summary
    baseline_summary = pd.DataFrame([
        {
            "driver": "VER",
            "driver_name": "Max Verstappen",
            "transponder_time_s": meta["lap_time_d1"],
            "spatial_integrated_time_s": round(t_spatial_ver, 3),
            "v_min_kmh": round(df_ver["Speed_mps"].min() * 3.6, 1),
            "v_max_kmh": round(df_ver["Speed_mps"].max() * 3.6, 1),
            "v_mean_kmh": round(df_ver["Speed_mps"].mean() * 3.6, 1),
            "drs_distance_m": float(df_ver[df_ver["DRS_active"] == 1]["Distance"].count()),
        },
        {
            "driver": "PER",
            "driver_name": "Sergio Perez",
            "transponder_time_s": meta["lap_time_d2"],
            "spatial_integrated_time_s": round(t_spatial_per, 3),
            "v_min_kmh": round(df_per["Speed_mps"].min() * 3.6, 1),
            "v_max_kmh": round(df_per["Speed_mps"].max() * 3.6, 1),
            "v_mean_kmh": round(df_per["Speed_mps"].mean() * 3.6, 1),
            "drs_distance_m": float(df_per[df_per["DRS_active"] == 1]["Distance"].count()),
        }
    ])

    # Save to data/processed/redbull/
    OUTPUT_PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    summary_csv = OUTPUT_PROCESSED_DIR / "redbull_baseline_summary.csv"
    baseline_summary.to_csv(summary_csv, index=False)
    print(f"\nSaved baseline summary to: {summary_csv}")

    # Combine aligned telemetry for subsequent experiments
    df_aligned = pd.DataFrame({
        "Distance": df_ver["Distance"],
        "Speed_VER_mps": df_ver["Speed_mps"],
        "Speed_VER_kmh": df_ver["Speed_mps"] * 3.6,
        "Time_VER_s": df_ver["Time_s"],
        "Speed_PER_mps": df_per["Speed_mps"],
        "Speed_PER_kmh": df_per["Speed_mps"] * 3.6,
        "Time_PER_s": df_per["Time_s"],
        "Curvature_kappa": df_ver["Curvature_kappa"],
        "DRS_active": df_ver["DRS_active"],
        "X": df_ver["X"],
        "Y": df_ver["Y"],
    })
    aligned_csv = OUTPUT_PROCESSED_DIR / "redbull_aligned_telemetry.csv"
    df_aligned.to_csv(aligned_csv, index=False)
    print(f"Saved aligned telemetry to: {aligned_csv}")

    # Plot Speed Comparison
    OUTPUT_PLOTS_DIR.mkdir(parents=True, exist_ok=True)
    plt.figure(figsize=(14, 5), dpi=200)
    plt.plot(df_ver["Distance"], df_ver["Speed_mps"] * 3.6, label="Max Verstappen (89.708 s)", color="#1E41FF", lw=1.5)
    plt.plot(df_per["Distance"], df_per["Speed_mps"] * 3.6, label="Sergio Perez (89.846 s)", color="#FF1801", lw=1.2, alpha=0.85)
    plt.title("2023 Bahrain GP Q3 — Red Bull Racing RB19 Speed Profile Comparison", fontsize=12, fontweight="bold")
    plt.xlabel("Track Distance (m)", fontsize=10)
    plt.ylabel("Speed (km/h)", fontsize=10)
    plt.grid(True, alpha=0.3)
    plt.legend(frameon=True, facecolor="#F4F1EA", edgecolor="#D8D5CE")
    plt.tight_layout()

    plot_path = OUTPUT_PLOTS_DIR / "redbull_speed_comparison.png"
    plt.savefig(plot_path)
    plt.close()
    print(f"Saved speed comparison plot to: {plot_path}")


if __name__ == "__main__":
    main()

"""
Telemetry plotting routines: Speed profiles, delta-time traces, and model validation overlays.
"""

from pathlib import Path
from typing import Optional
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from src.config import PLOTS_DIR


def plot_speed_comparison(
    df_d1: pd.DataFrame,
    df_d2: pd.DataFrame,
    df_achievable: Optional[pd.DataFrame] = None,
    driver1: str = "Driver 1",
    driver2: str = "Driver 2",
    save_path: Optional[Path] = None,
):
    """
    Plot comparative speed traces and delta-v overlay across the track distance.
    """
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 8), sharex=True, gridspec_kw={"height_ratios": [3, 1]})

    s = df_d1["Distance"].values
    v1 = df_d1["Speed_kmh"].values
    v2 = df_d2["Speed_kmh"].values

    # Top panel: Speed traces
    ax1.plot(s, v1, label=f"{driver1} (Measured)", color="#E8002D", linewidth=1.5, alpha=0.85)  # Ferrari Red
    ax1.plot(s, v2, label=f"{driver2} (Measured)", color="#FFD700", linewidth=1.5, alpha=0.85)  # Yellow
    if df_achievable is not None:
        ax1.plot(
            df_achievable["Distance"],
            df_achievable["Speed_kmh"],
            label="Achievable Physics Composite",
            color="#00D2BE",
            linewidth=2.0,
            linestyle="--",
        )

    ax1.set_ylabel("Speed (km/h)", fontsize=11, fontweight="bold")
    ax1.set_title("Cross-Driver Lap Speed Profile & Continuity Reconciliation", fontsize=13, fontweight="bold")
    ax1.grid(True, linestyle=":", alpha=0.6)
    ax1.legend(loc="lower right", framealpha=0.9)

    # Bottom panel: Delta-v
    delta_v = v1 - v2
    ax2.plot(s, delta_v, color="#333333", linewidth=1.2)
    ax2.axhline(0, color="gray", linestyle="--", linewidth=0.8)
    ax2.fill_between(s, 0, delta_v, where=(delta_v > 0), color="#E8002D", alpha=0.3, label=f"{driver1} faster")
    ax2.fill_between(s, 0, delta_v, where=(delta_v < 0), color="#FFD700", alpha=0.3, label=f"{driver2} faster")
    ax2.set_xlabel("Track Distance (m)", fontsize=11, fontweight="bold")
    ax2.set_ylabel("Delta V (km/h)", fontsize=11, fontweight="bold")
    ax2.grid(True, linestyle=":", alpha=0.6)
    ax2.legend(loc="upper right", framealpha=0.9)

    plt.tight_layout()
    target = save_path if save_path else PLOTS_DIR / "speed_comparison.png"
    plt.savefig(target, dpi=200)
    plt.close()
    print(f"Saved plot to: {target}")


def plot_validation_overlay(
    sim_df: pd.DataFrame,
    ref_df: pd.DataFrame,
    driver_name: str,
    model_name: str,
    save_path: Optional[Path] = None,
):
    """
    Plot single-driver validation: simulated vs empirical speed and error residuals.
    """
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 7), sharex=True, gridspec_kw={"height_ratios": [3, 1]})

    s = ref_df["Distance"].values
    v_ref = ref_df["Speed_kmh"].values
    v_sim = sim_df["Speed_kmh"].values
    residual_kmh = v_sim - v_ref

    ax1.plot(s, v_ref, label=f"{driver_name} (Measured Telemetry)", color="#1F77B4", linewidth=1.6)
    ax1.plot(s, v_sim, label=f"Model Simulation ({model_name})", color="#FF7F0E", linestyle="--", linewidth=1.6)
    ax1.set_ylabel("Speed (km/h)", fontsize=11, fontweight="bold")
    ax1.set_title(f"Vehicle Model Single-Driver Validation ({driver_name})", fontsize=13, fontweight="bold")
    ax1.grid(True, linestyle=":", alpha=0.6)
    ax1.legend(loc="lower right")

    ax2.plot(s, residual_kmh, color="#D62728", linewidth=1.2)
    ax2.axhline(0, color="black", linestyle="--", linewidth=0.8)
    ax2.set_xlabel("Track Distance (m)", fontsize=11, fontweight="bold")
    ax2.set_ylabel("Error (km/h)", fontsize=11, fontweight="bold")
    ax2.grid(True, linestyle=":", alpha=0.6)

    plt.tight_layout()
    target = save_path if save_path else PLOTS_DIR / f"validation_{driver_name}.png"
    plt.savefig(target, dpi=200)
    plt.close()
    print(f"Saved plot to: {target}")

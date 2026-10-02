"""
Visualization module for driver selection and boundary discontinuities along track distance.
Creates publication-quality selection ribbon maps and transition jump charts.
"""

from pathlib import Path
from typing import Optional
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from src.config import PLOTS_DIR


def plot_driver_selection_map(
    df_d1: pd.DataFrame,
    df_d2: pd.DataFrame,
    df_segments: pd.DataFrame,
    df_jumps: pd.DataFrame,
    driver1: str = "Leclerc",
    driver2: str = "Sainz",
    resolution_label: str = "100m",
    save_path: Optional[Path] = None,
):
    """
    Plot driver selection ribbon, speed profiles, and boundary discontinuities across track distance.

    Args:
        df_d1: Resampled telemetry for Driver 1 (Leclerc).
        df_d2: Resampled telemetry for Driver 2 (Sainz).
        df_segments: Segment table containing s_start, s_end, winner, delta_dt.
        df_jumps: Boundary jumps table containing boundary_s, driver_switch, delta_v_kmh, abs_delta_v_mps.
        driver1: Driver 1 name.
        driver2: Driver 2 name.
        resolution_label: String describing segmentation resolution (e.g. '100m').
        save_path: Optional custom destination path for output PNG.
    """
    fig, (ax1, ax2, ax3) = plt.subplots(
        3, 1, figsize=(15, 10), sharex=True,
        gridspec_kw={"height_ratios": [2.5, 0.8, 1.7]}
    )

    s1 = df_d1["Distance"].values
    v1 = df_d1["Speed_kmh"].values
    v2 = df_d2["Speed_kmh"].values

    c_d1 = "#E8002D"  # Ferrari Red
    c_d2 = "#FF9900"  # Ferrari Gold / Amber

    # Top panel: Speed traces with background shading by selected driver
    ax1.plot(s1, v1, label=f"{driver1} (Empirical)", color=c_d1, linewidth=1.5, alpha=0.9)
    ax1.plot(s1, v2, label=f"{driver2} (Empirical)", color=c_d2, linewidth=1.5, alpha=0.9)

    for _, row in df_segments.iterrows():
        color = c_d1 if row["winner"] == driver1 else c_d2
        ax1.axvspan(row["s_start"], row["s_end"], color=color, alpha=0.08)

    ax1.set_ylabel("Speed (km/h)", fontsize=11, fontweight="bold")
    ax1.set_title(
        f"Theoretical Cross-Driver Composite: Driver Selection & Speed Profiles ({resolution_label} Segments)\n"
        f"2023 Bahrain GP Q3 — Ferrari Telemetry Analysis",
        fontsize=13, fontweight="bold", pad=12
    )
    ax1.grid(True, linestyle=":", alpha=0.6)
    ax1.legend(loc="lower right", framealpha=0.9)

    # Middle panel: Driver selection ribbon (stepped bar)
    for _, row in df_segments.iterrows():
        color = c_d1 if row["winner"] == driver1 else c_d2
        label_val = 1 if row["winner"] == driver1 else 0
        ax2.barh(
            0, row["length_m"], left=row["s_start"],
            color=color, edgecolor="black", linewidth=0.5, height=0.7
        )

    ax2.set_yticks([0])
    ax2.set_yticklabels(["Selected\nDriver"], fontsize=10, fontweight="bold")
    ax2.set_ylim(-0.6, 0.6)
    ax2.grid(True, axis="x", linestyle=":", alpha=0.6)

    # Create legend proxies for ribbon
    import matplotlib.patches as mpatches
    patch_d1 = mpatches.Patch(color=c_d1, label=f"{driver1} Selected")
    patch_d2 = mpatches.Patch(color=c_d2, label=f"{driver2} Selected")
    ax2.legend(handles=[patch_d1, patch_d2], loc="upper right", framealpha=0.9)

    # Bottom panel: Segment time advantage & transition jump markers
    s_centers = 0.5 * (df_segments["s_start"].values + df_segments["s_end"].values)
    delta_ms = df_segments["delta_dt"].values * 1000.0  # seconds to milliseconds
    bar_colors = [c_d1 if w == driver1 else c_d2 for w in df_segments["winner"].values]

    ax3.bar(
        s_centers, delta_ms, width=df_segments["length_m"].values * 0.9,
        color=bar_colors, alpha=0.7, edgecolor="black", linewidth=0.3,
        label="Selected Driver Advantage (ms)"
    )

    # Mark driver switch boundaries with vertical lines and delta-v annotations
    switches = df_jumps[df_jumps["driver_switch"] == True]
    for _, sw in switches.iterrows():
        b_s = sw["boundary_s"]
        dv = sw["delta_v_kmh"]
        ax3.axvline(b_s, color="#222222", linestyle="--", linewidth=1.0, alpha=0.7)

    ax3.set_ylabel("Advantage (ms)", fontsize=11, fontweight="bold")
    ax3.set_xlabel("Track Distance (m)", fontsize=11, fontweight="bold")
    ax3.grid(True, linestyle=":", alpha=0.6)

    # Add subtitle / annotation
    ax3.text(
        0.01, 0.92,
        f"Vertical dashed lines: Driver transitions ({len(switches)} switches). "
        f"Max boundary |Δv| = {switches['abs_delta_v_mps'].max():.2f} m/s ({switches['abs_delta_v_mps'].max()*3.6:.1f} km/h)",
        transform=ax3.transAxes, fontsize=9, style="italic",
        bbox=dict(boxstyle="round,pad=0.3", facecolor="white", alpha=0.8)
    )

    plt.tight_layout()
    target_path = save_path if save_path else PLOTS_DIR / f"driver_selection_{resolution_label}.png"
    target_path.parent.mkdir(parents=True, exist_ok=True)
    plt.savefig(target_path, dpi=200)
    plt.close()
    print(f"Saved driver selection map to: {target_path}")
    return target_path

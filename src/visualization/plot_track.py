"""
Circuit map visualization routines.
Plots 2D track map colored by segment winner and highlights boundary state jump locations.
"""

from pathlib import Path
from typing import Optional, List, Dict, Any
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from src.config import PLOTS_DIR


def plot_circuit_winners(
    df_geometry: pd.DataFrame,
    segments_df: pd.DataFrame,
    driver1: str = "Driver 1",
    driver2: str = "Driver 2",
    jumps_df: Optional[pd.DataFrame] = None,
    save_path: Optional[Path] = None,
):
    """
    Plot 2D track trajectory colored by segment winner with unphysical boundary jumps highlighted.
    """
    fig, ax = plt.subplots(figsize=(10, 10))

    # Driver colors
    color_d1 = "#E8002D"  # Ferrari Red
    color_d2 = "#FFB800"  # Yellow / Gold

    for _, seg in segments_df.iterrows():
        s_start = seg["s_start"]
        s_end = seg["s_end"]
        winner = seg["winner"]
        color = color_d1 if winner == driver1 else color_d2

        sub = df_geometry[(df_geometry["Distance"] >= s_start) & (df_geometry["Distance"] <= s_end)]
        if len(sub) > 1:
            ax.plot(sub["X"], sub["Y"], color=color, linewidth=4.0, solid_capstyle="round")

    # Mark boundary jumps where driver switch occurs
    if jumps_df is not None and not jumps_df.empty:
        switches = jumps_df[jumps_df["driver_switch"] == True]
        for _, jmp in switches.iterrows():
            s_jump = jmp["boundary_s"]
            pt = df_geometry.iloc[(df_geometry["Distance"] - s_jump).abs().argsort()[:1]]
            dv = abs(jmp["delta_v_kmh"])
            size = min(250, max(50, dv * 12))
            ax.scatter(pt["X"], pt["Y"], s=size, color="black", edgecolor="cyan", linewidth=1.5, zorder=5)

    ax.set_aspect("equal", "datalim")
    ax.axis("off")
    ax.set_title("Theoretical Composite Lap: Segment Donor Distribution & Boundary Jumps", fontsize=12, fontweight="bold")

    # Legend handles
    from matplotlib.lines import Line2D
    legend_elements = [
        Line2D([0], [0], color=color_d1, lw=4, label=f"{driver1} Faster"),
        Line2D([0], [0], color=color_d2, lw=4, label=f"{driver2} Faster"),
        Line2D([0], [0], marker="o", color="w", markerfacecolor="black", markeredgecolor="cyan", markersize=10, label="Boundary State Mismatch (Δv)"),
    ]
    ax.legend(handles=legend_elements, loc="lower right", framealpha=0.9)

    plt.tight_layout()
    target = save_path if save_path else PLOTS_DIR / "track_segment_winners.png"
    plt.savefig(target, dpi=200)
    plt.close()
    print(f"Saved plot to: {target}")


def plot_boundary_discontinuities(
    jumps_df: pd.DataFrame,
    save_path: Optional[Path] = None,
):
    """
    Bar plot of velocity step discontinuities (Δv_k) across circuit distance.
    """
    fig, ax = plt.subplots(figsize=(12, 5))

    s = jumps_df["boundary_s"].values
    dv = jumps_df["delta_v_kmh"].values
    switches = jumps_df["driver_switch"].values

    colors = ["#E8002D" if sw else "#AAAAAA" for sw in switches]
    ax.bar(s, dv, width=40.0, color=colors, edgecolor="black", linewidth=0.5)

    ax.axhline(0, color="black", linewidth=0.8)
    ax.set_xlabel("Boundary Distance (m)", fontsize=11, fontweight="bold")
    ax.set_ylabel("Speed Step Jump Δv (km/h)", fontsize=11, fontweight="bold")
    ax.set_title("Boundary State Discontinuities in Naive Theoretical Composite", fontsize=12, fontweight="bold")
    ax.grid(True, linestyle=":", alpha=0.6)

    plt.tight_layout()
    target = save_path if save_path else PLOTS_DIR / "boundary_discontinuities.png"
    plt.savefig(target, dpi=200)
    plt.close()
    print(f"Saved plot to: {target}")

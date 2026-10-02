"""
Gap decomposition waterfall and sensitivity plotting routines.
"""

from pathlib import Path
from typing import Optional, Dict, Any
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from src.config import PLOTS_DIR


def plot_gap_waterfall(
    summary: Dict[str, Any],
    breakdown: Dict[str, Any],
    save_path: Optional[Path] = None,
):
    """
    Plot waterfall diagram showing progression from Theoretical Lap Time to Achievable Lap Time.
    """
    t_theo = summary["t_theoretical_s"]
    ke_pen = breakdown["kinetic_energy_deficit_s"]
    brake_pen = breakdown["braking_displacement_s"]
    trac_pen = breakdown["coupled_traction_penalty_s"]
    inter_pen = breakdown["interaction_nonlinear_term_s"]
    t_ach = summary["t_achievable_s"]
    t_base = summary["t_baseline_s"]

    labels = [
        "Theoretical\nComposite",
        "Kinetic Energy\nDeficit",
        "Braking Point\nOffset",
        "Traction\nGrip Limit",
        "Coupling\nInteraction",
        "Achievable\nComposite",
        "Best Real Lap\n(Baseline)",
    ]

    values = [
        t_theo,
        ke_pen,
        brake_pen,
        trac_pen,
        inter_pen,
        t_ach,
        t_base,
    ]

    fig, ax = plt.subplots(figsize=(12, 6))

    # Calculate bar bottoms
    bottoms = [
        0.0,
        t_theo,
        t_theo + ke_pen,
        t_theo + ke_pen + brake_pen,
        t_theo + ke_pen + brake_pen + trac_pen,
        0.0,
        0.0,
    ]

    colors = [
        "#00D2BE",  # Teal for theoretical
        "#E8002D",  # Red for penalties
        "#E8002D",
        "#E8002D",
        "#FF8C00",
        "#2E7D32",  # Green for achievable
        "#1565C0",  # Blue for baseline
    ]

    # Zoom in y-axis around lap time
    y_min = t_theo - 0.5
    y_max = t_base + 0.5
    ax.set_ylim(y_min, y_max)

    bars = ax.bar(labels, values, bottom=bottoms, color=colors, edgecolor="black", width=0.6)

    # Add text labels on bars
    for i, bar in enumerate(bars):
        if i == 0 or i >= 5:
            # Full lap times
            val = values[i]
            ax.text(bar.get_x() + bar.get_width() / 2, val + 0.05, f"{val:.3f} s", ha="center", fontweight="bold")
        else:
            # Penalties
            val = values[i]
            top = bottoms[i] + val
            ax.text(bar.get_x() + bar.get_width() / 2, top + 0.02, f"+{val:.3f} s", ha="center", fontsize=9)

    ax.set_ylabel("Lap Time (s)", fontsize=11, fontweight="bold")
    ax.set_title(
        f"From Theoretical to Achievable Lap Time: Gap Decomposition\n"
        f"Retained Advantage: {summary['retained_percentage']}% of Nominal Theoretical Gain",
        fontsize=12,
        fontweight="bold",
    )
    ax.grid(True, axis="y", linestyle=":", alpha=0.6)

    plt.tight_layout()
    target = save_path if save_path else PLOTS_DIR / "gap_waterfall_decomposition.png"
    plt.savefig(target, dpi=200)
    plt.close()
    print(f"Saved plot to: {target}")


def plot_sensitivity_analysis(
    sensitivity_df: pd.DataFrame,
    save_path: Optional[Path] = None,
):
    """
    Plot sensitivity of theoretical vs achievable lap time across segmentation schemes.
    """
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

    schemes = sensitivity_df["scheme"].values
    t_theo_gain = sensitivity_df["theoretical_gain_s"].values
    t_ach_gain = sensitivity_df["achievable_gain_s"].values
    eta = sensitivity_df["retained_fraction_eta"].values * 100.0

    x = np.arange(len(schemes))
    w = 0.35

    # Panel 1: Time gains
    ax1.bar(x - w / 2, t_theo_gain, width=w, label="Theoretical Gain", color="#00D2BE", edgecolor="black")
    ax1.bar(x + w / 2, t_ach_gain, width=w, label="Achievable Gain", color="#2E7D32", edgecolor="black")
    ax1.set_xticks(x)
    ax1.set_xticklabels(schemes, rotation=15, ha="right", fontweight="bold")
    ax1.set_ylabel("Lap Time Gain over Baseline (s)", fontsize=11, fontweight="bold")
    ax1.set_title("Theoretical vs Achievable Gain across Segmentation Schemes", fontsize=11, fontweight="bold")
    ax1.grid(True, axis="y", linestyle=":", alpha=0.6)
    ax1.legend()

    # Panel 2: Retained percentage
    ax2.plot(schemes, eta, marker="o", color="#E8002D", linewidth=2.5, markersize=8)
    ax2.set_ylabel("Retained Advantage (%)", fontsize=11, fontweight="bold")
    ax2.set_title("Retained Advantage Fraction vs Segmentation Scheme", fontsize=11, fontweight="bold")
    ax2.set_ylim(0, 100)
    ax2.grid(True, linestyle=":", alpha=0.6)
    for i, txt in enumerate(eta):
        ax2.annotate(f"{txt:.1f}%", (schemes[i], eta[i] + 3), ha="center", fontweight="bold")

    plt.tight_layout()
    target = save_path if save_path else PLOTS_DIR / "segmentation_sensitivity.png"
    plt.savefig(target, dpi=200)
    plt.close()
    print(f"Saved plot to: {target}")

"""
Visualization tools for Experiment 03: Physics-Constrained Feasibility Analysis.
Generates publication-quality plots of speed profiles, spatial deltas, and diagnostic decomposition.
"""

from pathlib import Path
from typing import Dict, Any, Optional
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt


def plot_experiment_03_speed_profiles(
    df_lec: pd.DataFrame,
    df_sai: pd.DataFrame,
    df_theoretical: pd.DataFrame,
    df_optimal: pd.DataFrame,
    df_feasible: pd.DataFrame,
    jumps_df: pd.DataFrame,
    save_path: Optional[Path] = None,
) -> plt.Figure:
    """
    Plot 5-trace comparative speed profile across the entire track.
    """
    fig, (ax1, ax2) = plt.subplots(
        2, 1, figsize=(15, 9), gridspec_kw={"height_ratios": [3, 1]}, sharex=True
    )

    s = df_lec["Distance"].values

    # Top panel: Speed traces
    ax1.plot(s, df_lec["Speed_kmh"], color="#DC0000", alpha=0.35, label="LEC Observed Telemetry", linewidth=1.2)
    ax1.plot(s, df_sai["Speed_kmh"], color="#FF8700", alpha=0.35, label="SAI Observed Telemetry", linewidth=1.2)
    ax1.plot(s, df_theoretical["Donor_Speed_kmh"], color="#00D2BE", linestyle="--", alpha=0.75, label="Theoretical Composite (Exp 02)", linewidth=1.5)
    ax1.plot(s, df_optimal["Speed_kmh"], color="#1E90FF", linewidth=1.8, label="Case A: Optimal Geometry Reference ($T_{opt}$)")
    ax1.plot(s, df_feasible["Speed_kmh"], color="#990099", linewidth=2.0, label="Case B: Donor-Capped Feasible ($T_{feas}$)")

    # Highlight switch boundaries
    switches = jumps_df[jumps_df["driver_switch"] == True]
    for _, sw in switches.iterrows():
        ax1.axvline(sw["boundary_s"], color="gray", linestyle=":", alpha=0.4, linewidth=0.8)

    ax1.set_ylabel("Speed (km/h)", fontsize=11, fontweight="bold")
    ax1.set_title("Experiment 03: Physics-Constrained Cross-Driver Speed Profile Analysis (Bahrain 2023 Q3)", fontsize=13, fontweight="bold")
    ax1.grid(True, linestyle="--", alpha=0.5)
    ax1.legend(loc="lower right", framealpha=0.9, fontsize=10)

    # Bottom panel: Delta vs Theoretical (km/h)
    delta_opt = df_optimal["Speed_kmh"].values - df_theoretical["Donor_Speed_kmh"].values
    delta_feas = df_feasible["Speed_kmh"].values - df_theoretical["Donor_Speed_kmh"].values

    ax2.plot(s, delta_opt, color="#1E90FF", linewidth=1.2, label="$v_{opt} - v_{theo}$")
    ax2.plot(s, delta_feas, color="#990099", linewidth=1.5, label="$v_{feas} - v_{theo}$ (Boundary penalties)")
    ax2.axhline(0, color="black", linestyle="-", linewidth=0.8)

    for _, sw in switches.iterrows():
        ax2.axvline(sw["boundary_s"], color="gray", linestyle=":", alpha=0.4, linewidth=0.8)

    ax2.set_xlabel("Track Distance (m)", fontsize=11, fontweight="bold")
    ax2.set_ylabel(r"$\Delta v$ vs Theo (km/h)", fontsize=11, fontweight="bold")
    ax2.grid(True, linestyle="--", alpha=0.5)
    ax2.legend(loc="lower right", framealpha=0.9, fontsize=9)

    plt.tight_layout()
    if save_path:
        save_path.parent.mkdir(parents=True, exist_ok=True)
        fig.savefig(save_path, dpi=300, bbox_inches="tight")
    return fig


def plot_diagnostic_breakdown(
    summary_dict: Dict[str, Any],
    diagnostics: Dict[str, Any],
    save_path: Optional[Path] = None,
) -> plt.Figure:
    """
    Plot waterfall-style first-order energetic diagnostic decomposition.
    """
    fig, ax = plt.subplots(figsize=(10, 6))

    labels = [
        "Theoretical\nComposite",
        "Diagnostic KE\nAccel Penalty",
        "Diagnostic Braking\nDisplacement",
        "Diagnostic Exit\nGrip Deficit",
        "Residual State\nPropagation",
        "Donor-Capped\nFeasible Lap",
    ]

    t_theo = summary_dict.get("T_theoretical_s", summary_dict.get("t_theoretical_s", 0.0))
    dt_ke = diagnostics.get("diagnostic_ke_acceleration_penalty_s", 0.0)
    dt_brake = diagnostics.get("diagnostic_braking_displacement_penalty_s", 0.0)
    dt_grip = diagnostics.get("diagnostic_corner_exit_grip_deficit_s", 0.0)
    dt_res = diagnostics.get("residual_state_propagation_term_s", diagnostics.get("residual_nonlinear_state_interaction_s", 0.0))
    t_feas = summary_dict.get("T_feasible_donor_capped_s", summary_dict.get("t_feasible_donor_capped_s", 0.0))

    values = [t_theo, dt_ke, dt_brake, dt_grip, dt_res, t_feas]

    # Bar positions
    x = np.arange(len(labels))
    colors = ["#00D2BE", "#FF8700", "#FF4500", "#E67E22", "#95A5A6", "#990099"]

    bars = ax.bar(x, values, color=colors, width=0.55, edgecolor="black", linewidth=0.8)

    # Annotate values
    for i, bar in enumerate(bars):
        height = bar.get_height()
        if i == 0 or i == len(bars) - 1:
            ax.text(bar.get_x() + bar.get_width() / 2.0, height + 0.5, f"{height:.3f} s", ha="center", va="bottom", fontweight="bold", fontsize=10)
        else:
            ax.text(bar.get_x() + bar.get_width() / 2.0, height + 0.5, f"+{height:.3f} s", ha="center", va="bottom", fontsize=9)

    ax.set_ylabel("Lap Time / Time Penalty (s)", fontsize=11, fontweight="bold")
    ax.set_title("First-Order Energetic Diagnostic Decomposition of State-Continuity Gap", fontsize=12, fontweight="bold")
    ax.set_xticks(x)
    ax.set_xticklabels(labels, fontsize=9)
    ax.grid(axis="y", linestyle="--", alpha=0.5)
    ax.set_ylim(0, max(values) * 1.15)

    plt.tight_layout()
    if save_path:
        save_path.parent.mkdir(parents=True, exist_ok=True)
        fig.savefig(save_path, dpi=300, bbox_inches="tight")
    return fig

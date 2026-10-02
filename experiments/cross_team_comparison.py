"""
Cross-Team Comparison: Scuderia Ferrari (SF-23) vs. Red Bull Racing (RB19).
Synthesizes independent experimental results from Ferrari (LEC vs SAI) and Red Bull (VER vs PER).
CRITICAL RULE: Does NOT mix Ferrari and Red Bull segments into a cross-team composite.
"""

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from src.config import PROCESSED_DIR, PLOTS_DIR


def main():
    print("=" * 80)
    print("F1 Research Pipeline: Cross-Team Comparative Synthesis")
    print("=" * 80)

    # 1. Load Ferrari results
    ferrari_exp03 = pd.read_csv(PROCESSED_DIR / "experiment_03_summary.csv").iloc[0]
    ferrari_exp04 = pd.read_csv(PROCESSED_DIR / "experiment_04_segmentation_robustness.csv")

    # 2. Load Red Bull results
    rb_exp03 = pd.read_csv(PROCESSED_DIR / "redbull" / "redbull_experiment_03_summary.csv").iloc[0]
    rb_exp04 = pd.read_csv(PROCESSED_DIR / "redbull" / "redbull_experiment_04_segmentation_robustness.csv")

    comparison_data = [
        {
            "Metric": "Car & Chassis",
            "Ferrari": "Ferrari SF-23",
            "Red Bull": "Red Bull RB19",
        },
        {
            "Metric": "Drivers Analyzed",
            "Ferrari": "Charles Leclerc vs. Carlos Sainz",
            "Red Bull": "Max Verstappen vs. Sergio Perez",
        },
        {
            "Metric": "Driver 1 Observed Baseline",
            "Ferrari": f"{ferrari_exp03['T_LEC_obs_s']:.3f} s (LEC)",
            "Red Bull": f"{rb_exp03['T_VER_obs_s']:.3f} s (VER)",
        },
        {
            "Metric": "Driver 2 Observed Baseline",
            "Ferrari": f"{ferrari_exp03['T_SAI_obs_s']:.3f} s (SAI)",
            "Red Bull": f"{rb_exp03['T_PER_obs_s']:.3f} s (PER)",
        },
        {
            "Metric": "Observed Teammate Delta",
            "Ferrari": f"{abs(ferrari_exp03['T_LEC_obs_s'] - ferrari_exp03['T_SAI_obs_s']):.3f} s",
            "Red Bull": f"{abs(rb_exp03['T_VER_obs_s'] - rb_exp03['T_PER_obs_s']):.3f} s",
        },
        {
            "Metric": "Theoretical Composite Lap (100m)",
            "Ferrari": f"{ferrari_exp03['T_theoretical_s']:.3f} s",
            "Red Bull": f"{rb_exp03['T_theoretical_s']:.3f} s",
        },
        {
            "Metric": "Theoretical Gain vs. D1",
            "Ferrari": f"+{ferrari_exp03['Theoretical_Gain_vs_LEC_s']:.3f} s",
            "Red Bull": f"+{rb_exp03['Theoretical_Gain_vs_VER_s']:.3f} s",
        },
        {
            "Metric": "Feasible Lap Time (100m, Policy A)",
            "Ferrari": f"{ferrari_exp03['T_feasible_donor_capped_s']:.3f} s",
            "Red Bull": f"{rb_exp03['T_feasible_donor_capped_s']:.3f} s",
        },
        {
            "Metric": "Theoretical-to-Feasible Gap",
            "Ferrari": f"+{ferrari_exp03['Theoretical_to_Feasible_Gap_s']:.3f} s",
            "Red Bull": f"+{rb_exp03['Theoretical_to_Feasible_Gap_s']:.3f} s",
        },
        {
            "Metric": "Feasible Gain vs. D1 (Net)",
            "Ferrari": f"{ferrari_exp03['Feasible_Gain_vs_LEC_s']:.3f} s",
            "Red Bull": f"{rb_exp03['Feasible_Gain_vs_VER_s']:.3f} s",
        },
        {
            "Metric": "Driver Switches (100m)",
            "Ferrari": f"{int(ferrari_exp03['Number_of_Donor_Switches'])}",
            "Red Bull": f"{int(rb_exp03['Number_of_Donor_Switches'])}",
        },
        {
            "Metric": "Max Boundary Velocity Jump |Δv|",
            "Ferrari": f"{ferrari_exp03['Max_Abs_Boundary_Delta_V_mps']:.3f} m/s ({ferrari_exp03['Max_Abs_Boundary_Delta_V_kmh']:.2f} km/h)",
            "Red Bull": f"{rb_exp03['Max_Abs_Boundary_Delta_V_mps']:.3f} m/s ({rb_exp03['Max_Abs_Boundary_Delta_V_kmh']:.2f} km/h)",
        },
        {
            "Metric": "Total Boundary KE Mismatch",
            "Ferrari": f"{ferrari_exp03['Sum_of_Abs_Boundary_KE_Mismatches_kJ']:.2f} kJ",
            "Red Bull": f"{rb_exp03['Sum_of_Abs_Boundary_KE_Mismatches_kJ']:.2f} kJ",
        },
        {
            "Metric": "Periodic Residual",
            "Ferrari": f"{ferrari_exp03['Periodicity_Error_Feasible_mps']:.6f} m/s",
            "Red Bull": f"{rb_exp03['Periodicity_Error_Feasible_mps']:.6f} m/s",
        },
        {
            "Metric": "Qualitative Takeaway",
            "Ferrari": "Feasible Lap Slower than Baseline (R < 0)",
            "Red Bull": "Feasible Lap Slower than Baseline (R < 0)",
        },
    ]

    df_comp = pd.DataFrame(comparison_data)
    out_csv = PROCESSED_DIR / "cross_team_comparison_summary.csv"
    df_comp.to_csv(out_csv, index=False)
    print(f"\nSaved cross-team comparison table to: {out_csv}")
    print(df_comp.to_string(index=False))

    # Cross-team plots
    # 1. Lap times comparison plot
    plt.figure(figsize=(10, 5), dpi=200)
    teams = ["Ferrari (SF-23)", "Red Bull (RB19)"]
    d1_obs = [ferrari_exp03["T_LEC_obs_s"], rb_exp03["T_VER_obs_s"]]
    t_theo = [ferrari_exp03["T_theoretical_s"], rb_exp03["T_theoretical_s"]]
    t_feas = [ferrari_exp03["T_feasible_donor_capped_s"], rb_exp03["T_feasible_donor_capped_s"]]

    x = np.arange(len(teams))
    w = 0.25

    plt.bar(x - w, d1_obs, w, label="Lead Driver Observed Baseline", color="#657887")
    plt.bar(x, t_theo, w, label="Theoretical Composite (100m)", color="#FFAEAA")
    plt.bar(x + w, t_feas, w, label="Feasible Lap Time (100m)", color="#C83E36")

    for i in range(len(teams)):
        plt.text(x[i] - w, d1_obs[i] + 0.15, f"{d1_obs[i]:.2f}s", ha="center", fontsize=8)
        plt.text(x[i], t_theo[i] + 0.15, f"{t_theo[i]:.2f}s", ha="center", fontsize=8)
        plt.text(x[i] + w, t_feas[i] + 0.15, f"{t_feas[i]:.2f}s", ha="center", fontsize=8)

    plt.ylim(85, 96)
    plt.xticks(x, teams, fontsize=10, fontweight="bold")
    plt.ylabel("Lap Time (seconds)", fontsize=9)
    plt.title("Cross-Team Lap Time Benchmark: Ferrari vs. Red Bull Racing", fontsize=11, fontweight="bold")
    plt.legend(frameon=True, facecolor="#F4F1EA")
    plt.grid(axis="y", alpha=0.3)
    plt.tight_layout()

    plot_lap = PLOTS_DIR / "cross_team_lap_comparison.png"
    plt.savefig(plot_lap)
    plt.close()

    # 2. Feasibility penalty comparison
    plt.figure(figsize=(8, 4.5), dpi=200)
    gaps = [ferrari_exp03["Theoretical_to_Feasible_Gap_s"], rb_exp03["Theoretical_to_Feasible_Gap_s"]]
    colors = ["#C83E36", "#1E41FF"]
    bars = plt.bar(teams, gaps, color=colors, width=0.45)
    for bar in bars:
        h = bar.get_height()
        plt.text(bar.get_x() + bar.get_width() / 2, h + 0.1, f"+{h:.3f} s", ha="center", fontweight="bold", fontsize=10)
    plt.ylim(0, max(gaps) * 1.25)
    plt.ylabel("Feasibility Penalty (T_feasible - T_theoretical) in seconds", fontsize=9)
    plt.title("Cross-Team Feasibility Penalty Comparison (+ΔT)", fontsize=11, fontweight="bold")
    plt.grid(axis="y", alpha=0.3)
    plt.tight_layout()

    plot_gap = PLOTS_DIR / "cross_team_gap_comparison.png"
    plt.savefig(plot_gap)
    plt.close()
    print(f"Saved cross-team plots to: {plot_lap} and {plot_gap}")


if __name__ == "__main__":
    main()

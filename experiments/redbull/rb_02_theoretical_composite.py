"""
Experiment RB-02: Theoretical Cross-Driver Composite Lap Analysis (Red Bull Racing: VER vs PER).
Constructs the naive sector-stitching baseline across 50m, 100m (canonical), and 250m resolutions.
Audits boundary velocity jumps (Delta v) and boundary kinetic energy mismatches (Delta KE).
"""

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from src.preprocessing.segmentation import CircuitSegmenter
from src.baseline.theoretical_composite import TheoreticalCompositeAnalyzer
from src.configs.redbull_config import OUTPUT_PROCESSED_DIR, OUTPUT_PLOTS_DIR, DRIVER_1_NAME, DRIVER_2_NAME


def main():
    print("=" * 80)
    print("F1 Research Pipeline: Experiment RB-02 — Red Bull Theoretical Composite Lap")
    print("=" * 80)

    aligned_csv = OUTPUT_PROCESSED_DIR / "redbull_aligned_telemetry.csv"
    if not aligned_csv.exists():
        raise FileNotFoundError(f"Missing {aligned_csv}. Run rb_00_data_validation.py first.")

    df_aligned = pd.read_csv(aligned_csv)

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

    total_track_length = float(df_aligned["Distance"].iloc[-1])
    print(f"Track distance domain: S = {total_track_length:.1f} m")

    analyzer = TheoreticalCompositeAnalyzer(mass=810.0)
    segmenter = CircuitSegmenter(step_ds=1.0)

    resolutions = [50.0, 100.0, 250.0]
    results_summary = []

    for seg_len in resolutions:
        label = f"{int(seg_len)}m"
        print(f"\n--- Analyzing Resolution: {label} ---")
        segments = segmenter.segment_by_fixed_distance(total_distance=total_track_length, segment_length_m=seg_len)
        print(f"  Created {len(segments)} segments.")

        res = analyzer.analyze_composite(
            df_ver, df_per, segments,
            driver1_name="Verstappen", driver2_name="Perez"
        )

        s_info = res["summary"]
        t_theo = s_info["t_theoretical"]
        gain_ver = s_info["gain_vs_d1_s"]
        gain_per = s_info["gain_vs_d2_s"]

        switches = s_info["driver_switch_count"]
        max_dv_mps = s_info["max_abs_delta_v_mps"]
        max_dv_kmh = s_info["max_abs_delta_v_kmh"]
        total_ke_kj = s_info["total_abs_energy_jump_kj"]
        max_ke_kj = s_info["max_abs_delta_energy_kj"]

        # Driver segment distribution
        df_segs = res["segments_df"]
        n_ver = s_info["d1_segments_count"]
        n_per = s_info["d2_segments_count"]
        pct_ver = s_info["d1_pct_distance"]
        pct_per = s_info["d2_pct_distance"]

        print(f"  Theoretical Lap Time: {t_theo:.3f} s")
        print(f"  Gain vs. VER: +{gain_ver:.3f} s | vs. PER: +{gain_per:.3f} s")
        print(f"  Driver Allocation: VER {n_ver} ({pct_ver:.1f}%) | PER {n_per} ({pct_per:.1f}%)")
        print(f"  Driver Switches: {switches}")
        print(f"  Max Velocity Jump: {max_dv_mps:.3f} m/s ({max_dv_kmh:.2f} km/h)")
        print(f"  Total Abs KE Mismatch: {total_ke_kj:.2f} kJ (Max jump: {max_ke_kj:.2f} kJ)")

        # Save segment files
        seg_csv = OUTPUT_PROCESSED_DIR / f"redbull_theoretical_composite_{label}.csv"
        df_segs.to_csv(seg_csv, index=False)

        jumps_csv = OUTPUT_PROCESSED_DIR / f"redbull_theoretical_composite_jumps_{label}.csv"
        res["jumps_df"].to_csv(jumps_csv, index=False)

        results_summary.append({
            "segment_length_m": seg_len,
            "resolution": label,
            "segments_count": len(segments),
            "theoretical_lap_time_s": round(t_theo, 3),
            "gain_vs_ver_s": round(gain_ver, 3),
            "gain_vs_per_s": round(gain_per, 3),
            "driver_switches": switches,
            "ver_segments": n_ver,
            "per_segments": n_per,
            "ver_pct": round(pct_ver, 2),
            "per_pct": round(pct_per, 2),
            "max_dv_mps": round(max_dv_mps, 3),
            "max_dv_kmh": round(max_dv_kmh, 2),
            "total_ke_kj": round(total_ke_kj, 2),
            "max_ke_kj": round(max_ke_kj, 2),
        })

        # Canonical 100m plot
        if seg_len == 100.0:
            # Driver selection plot
            plt.figure(figsize=(14, 4), dpi=200)
            for _, seg in df_segs.iterrows():
                color = "#1E41FF" if seg["winner"] == "Verstappen" else "#FF1801"
                plt.axvspan(seg["s_start"], seg["s_end"], color=color, alpha=0.6)
            plt.plot(df_ver["Distance"], df_ver["Speed_mps"] * 3.6, color="#17191D", lw=1.2, label="Verstappen Profile")
            plt.plot(df_per["Distance"], df_per["Speed_mps"] * 3.6, color="#A3A199", lw=1.0, ls=":", label="Perez Profile")
            plt.title("Red Bull RB19 Theoretical Composite (100m Canonical) — Driver Allocation", fontsize=11, fontweight="bold")
            plt.xlabel("Track Distance (m)", fontsize=9)
            plt.ylabel("Speed (km/h)", fontsize=9)
            plt.legend(loc="lower right", frameon=True, facecolor="#F4F1EA")
            plt.tight_layout()
            plot_sel = OUTPUT_PLOTS_DIR / "redbull_driver_selection_100m.png"
            plt.savefig(plot_sel)
            plt.close()

            # Boundary discontinuities plot
            df_jumps = res["jumps_df"]
            switch_jumps = df_jumps[df_jumps["driver_switch"] == True]
            plt.figure(figsize=(14, 5), dpi=200)
            plt.subplot(2, 1, 1)
            plt.stem(switch_jumps["boundary_s"], switch_jumps["abs_delta_v_kmh"], linefmt="r-", markerfmt="ro", basefmt="k-")
            plt.title("Red Bull 100m Boundary Velocity Step Jumps |Δv| (km/h)", fontsize=10, fontweight="bold")
            plt.ylabel("|Δv| (km/h)", fontsize=9)
            plt.grid(True, alpha=0.3)

            plt.subplot(2, 1, 2)
            plt.stem(switch_jumps["boundary_s"], switch_jumps["abs_delta_energy_kj"], linefmt="b-", markerfmt="bo", basefmt="k-")
            plt.title("Boundary Kinetic Energy Mismatches |ΔKE| (kJ)", fontsize=10, fontweight="bold")
            plt.xlabel("Track Distance (m)", fontsize=9)
            plt.ylabel("|ΔKE| (kJ)", fontsize=9)
            plt.grid(True, alpha=0.3)
            plt.tight_layout()
            plot_jumps = OUTPUT_PLOTS_DIR / "redbull_boundary_discontinuities.png"
            plt.savefig(plot_jumps)
            plt.close()

    summary_df = pd.DataFrame(results_summary)
    summary_csv = OUTPUT_PROCESSED_DIR / "redbull_theoretical_composite_summary.csv"
    summary_df.to_csv(summary_csv, index=False)
    print(f"\nSaved Red Bull theoretical summary to: {summary_csv}")


if __name__ == "__main__":
    main()

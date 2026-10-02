"""
Experiment 02: Theoretical Cross-Driver Composite Lap Analysis.

Research Question:
"If each spatial segment is allowed to select whichever driver's observed trajectory
is faster in that segment, what theoretical lap-time advantage exists before enforcing
cross-segment physical continuity?"

Scientific Standard:
- Evaluates the theoretical reference constructed strictly from observed telemetry.
- Primary analysis uses fixed spatial segmentations: 50m, 100m (primary reference), and 250m.
- Audits boundary velocity jumps (Delta v) and boundary kinetic-energy mismatches (Delta KE).
- Does NOT execute the physics solver or achievable composite (reserved for Experiment 03).
"""

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

import numpy as np
import pandas as pd
from src.ingestion.fetcher import FastF1Fetcher
from src.ingestion.lap_curator import LapCurator
from src.preprocessing.spatial_resampler import SpatialResampler
from src.preprocessing.geometry import TrajectoryGeometry
from src.preprocessing.segmentation import CircuitSegmenter
from src.baseline.theoretical_composite import TheoreticalCompositeAnalyzer
from src.visualization.plot_driver_selection import plot_driver_selection_map
from src.config import PROCESSED_DIR, PLOTS_DIR



def integrate_spatial_time(speed_mps: np.ndarray, step_ds: float = 1.0) -> np.ndarray:
    dt = np.zeros(len(speed_mps))
    dt[1:] = step_ds / (0.5 * (speed_mps[:-1] + speed_mps[1:]))
    return np.cumsum(dt)


def main():
    print("=" * 80)
    print("F1 Research Pipeline: Experiment 02 — Theoretical Cross-Driver Composite Lap")
    print("=" * 80)

    # 1. Lock Dataset
    print("\n1. Locking Dataset: 2023 Bahrain GP Qualifying (Q3) — Ferrari (LEC vs SAI)...")
    fetcher = FastF1Fetcher()
    session = fetcher.get_session(2023, "Bahrain", "Q")

    lap_lec, lap_sai, meta = LapCurator.get_fastest_teammate_laps(session, "LEC", "SAI")
    raw_lec = LapCurator.extract_raw_telemetry(lap_lec)
    raw_sai = LapCurator.extract_raw_telemetry(lap_sai)

    resampler = SpatialResampler(step_ds=1.0)
    df_lec_raw = resampler.resample_lap(raw_lec)
    df_sai_raw = resampler.resample_lap(raw_sai)

    df_lec, df_sai = SpatialResampler.align_teammates(df_lec_raw, df_sai_raw, step_ds=1.0)

    geom = TrajectoryGeometry(step_ds=1.0)
    df_lec = geom.compute_geometry(df_lec)
    df_sai = geom.compute_geometry(df_sai)

    # Spatially integrated time as unified reference
    df_lec["Time_s"] = integrate_spatial_time(df_lec["Speed_mps"].values, step_ds=1.0)
    df_sai["Time_s"] = integrate_spatial_time(df_sai["Speed_mps"].values, step_ds=1.0)

    total_distance = float(df_lec["Distance"].iloc[-1])
    print(f"   Track length: {total_distance:.1f} m | Grid resolution: 1.0 m | Samples: {len(df_lec)}")

    # 2. Compute Driver Baselines
    print("\n2. Computing Driver Baseline Telemetry Statistics...")
    analyzer = TheoreticalCompositeAnalyzer(mass=810.0)
    base_lec = analyzer.compute_driver_baseline(df_lec, "Charles Leclerc (LEC)")
    base_sai = analyzer.compute_driver_baseline(df_sai, "Carlos Sainz (SAI)")

    print(f"   LEC Baseline: Lap Time = {base_lec['lap_time_s']:.3f} s | Min = {base_lec['v_min_kmh']:.1f} km/h | Max = {base_lec['v_max_kmh']:.1f} km/h | Mean = {base_lec['v_mean_kmh']:.1f} km/h")
    print(f"   SAI Baseline: Lap Time = {base_sai['lap_time_s']:.3f} s | Min = {base_sai['v_min_kmh']:.1f} km/h | Max = {base_sai['v_max_kmh']:.1f} km/h | Mean = {base_sai['v_mean_kmh']:.1f} km/h")

    faster_baseline = min(base_lec["lap_time_s"], base_sai["lap_time_s"])
    faster_driver = "LEC" if base_lec["lap_time_s"] < base_sai["lap_time_s"] else "SAI"
    baseline_delta = abs(base_lec["lap_time_s"] - base_sai["lap_time_s"])
    print(f"   Observed Teammate Delta: {baseline_delta:.3f} s (Faster: {faster_driver} at {faster_baseline:.3f} s)")

    # 3. Fixed Spatial Segmentations
    resolutions = [50.0, 100.0, 250.0]
    segmenter = CircuitSegmenter(step_ds=1.0)
    summary_rows = []
    primary_res_data = None

    print("\n3. Evaluating Theoretical Composite Across Fixed Spatial Segmentations...")

    for res_m in resolutions:
        res_label = f"{int(res_m)}m"
        segments = segmenter.segment_by_fixed_distance(total_distance, segment_length_m=res_m)

        # Audit exact track coverage
        cov_start = segments[0]["s_start"]
        cov_end = segments[-1]["s_end"]
        cov_total = sum(s["s_end"] - s["s_start"] for s in segments)
        assert cov_start == 0.0, f"Coverage gap at start: {cov_start}"
        assert abs(cov_end - total_distance) < 1e-4, f"Coverage gap at end: {cov_end} vs {total_distance}"
        assert abs(cov_total - total_distance) < 1e-4, f"Total coverage mismatch: {cov_total}"

        # Analyze theoretical composite
        analysis = analyzer.analyze_composite(
            df_lec, df_sai, segments, driver1_name="Leclerc", driver2_name="Sainz"
        )
        summary = analysis["summary"]
        df_segs = analysis["segments_df"]
        df_jumps = analysis["jumps_df"]

        # Mathematical verification
        t_comp = summary["t_theoretical"]
        assert t_comp <= faster_baseline + 1e-6, f"Theoretical composite ({t_comp:.4f}s) slower than faster baseline ({faster_baseline:.4f}s)"

        summary_rows.append({
            "Resolution": res_label,
            "Segment_Length_m": res_m,
            "Segments": summary["total_segments"],
            "Composite_Time_s": round(t_comp, 3),
            "Gain_vs_LEC_s": round(summary["gain_vs_d1_s"], 3),
            "Gain_vs_SAI_s": round(summary["gain_vs_d2_s"], 3),
            "Gain_vs_Best_s": round(summary["theoretical_gain_s"], 3),
            "Pct_Gain_vs_LEC": round(summary["pct_gain_vs_d1"], 2),
            "Pct_Gain_vs_SAI": round(summary["pct_gain_vs_d2"], 2),
            "LEC_Selection_Pct": round(summary["d1_pct_distance"], 1),
            "SAI_Selection_Pct": round(summary["d2_pct_distance"], 1),
            "LEC_Segments": summary["d1_segments_count"],
            "SAI_Segments": summary["d2_segments_count"],
            "Switches": summary["driver_switch_count"],
            "Max_Abs_Delta_V_mps": round(summary["max_abs_delta_v_mps"], 3),
            "Max_Abs_Delta_V_kmh": round(summary["max_abs_delta_v_kmh"], 2),
            "Mean_Abs_Delta_V_mps": round(summary["mean_abs_delta_v_mps"], 3),
            "Mean_Abs_Delta_V_kmh": round(summary["mean_abs_delta_v_kmh"], 2),
            "Max_Abs_Delta_KE_kJ": round(summary["max_abs_delta_energy_kj"], 2),
            "Total_Abs_Delta_KE_kJ": round(summary["total_abs_energy_jump_kj"], 2),
        })

        # Save segment table and jumps table for each resolution
        segs_csv = PROCESSED_DIR / f"theoretical_composite_{res_label}.csv"
        df_segs.to_csv(segs_csv, index=False)

        jumps_csv = PROCESSED_DIR / f"theoretical_composite_jumps_{res_label}.csv"
        df_jumps.to_csv(jumps_csv, index=False)

        # Generate driver selection map plot
        plot_path = PLOTS_DIR / f"driver_selection_{res_label}.png"
        plot_driver_selection_map(
            df_lec, df_sai, df_segs, df_jumps,
            driver1="Leclerc", driver2="Sainz",
            resolution_label=res_label, save_path=plot_path
        )

        if res_m == 100.0:
            primary_res_data = (summary, df_segs, df_jumps)

    summary_df = pd.DataFrame(summary_rows)
    summary_csv = PROCESSED_DIR / "theoretical_composite_sensitivity.csv"
    summary_df.to_csv(summary_csv, index=False)

    print("\n" + "=" * 80)
    print("THEORETICAL COMPOSITE SENSITIVITY SUMMARY TABLE:")
    print("=" * 80)
    cols_display = [
        "Resolution", "Segments", "Composite_Time_s", "Gain_vs_LEC_s", "Gain_vs_SAI_s",
        "Gain_vs_Best_s", "LEC_Selection_Pct", "SAI_Selection_Pct", "Switches",
        "Max_Abs_Delta_V_kmh", "Max_Abs_Delta_KE_kJ"
    ]
    print(summary_df[cols_display].to_string(index=False))

    # 4. Detailed Primary Reference (100m) Diagnostics
    print("\n" + "=" * 80)
    print("PRIMARY REFERENCE (100m) DETAILED AUDIT:")
    print("=" * 80)
    prim_summary, prim_segs, prim_jumps = primary_res_data

    print(f"Total track length:              {total_distance:.1f} m")
    print(f"Number of 100m segments:         {prim_summary['total_segments']}")
    print(f"Leclerc baseline lap time:       {prim_summary['t_driver1']:.3f} s")
    print(f"Sainz baseline lap time:         {prim_summary['t_driver2']:.3f} s")
    print(f"Theoretical composite lap time:  {prim_summary['t_theoretical']:.3f} s")
    print(f"Theoretical gain vs Leclerc:     {prim_summary['gain_vs_d1_s']:.3f} s ({prim_summary['pct_gain_vs_d1']:.2f}%)")
    print(f"Theoretical gain vs Sainz:       {prim_summary['gain_vs_d2_s']:.3f} s ({prim_summary['pct_gain_vs_d2']:.2f}%)")
    print(f"Theoretical gain vs Best:        {prim_summary['theoretical_gain_s']:.3f} s")
    print(f"Leclerc selection:               {prim_summary['d1_segments_count']} segments ({prim_summary['d1_pct_distance']:.1f}% distance)")
    print(f"Sainz selection:                 {prim_summary['d2_segments_count']} segments ({prim_summary['d2_pct_distance']:.1f}% distance)")
    print(f"Driver switches (transitions):   {prim_summary['driver_switch_count']}")
    print(f"Max boundary |Delta_v|:          {prim_summary['max_abs_delta_v_mps']:.3f} m/s ({prim_summary['max_abs_delta_v_kmh']:.2f} km/h)")
    print(f"Mean boundary |Delta_v|:         {prim_summary['mean_abs_delta_v_mps']:.3f} m/s ({prim_summary['mean_abs_delta_v_kmh']:.2f} km/h)")
    print(f"Max boundary |Delta_KE|:         {prim_summary['max_abs_delta_energy_kj']:.2f} kJ")
    print(f"Total boundary |Delta_KE| mism:  {prim_summary['total_abs_energy_jump_kj']:.2f} kJ")

    # List top 5 driver transition discontinuities
    switches_prim = prim_jumps[prim_jumps["driver_switch"] == True].copy()
    if not switches_prim.empty:
        switches_prim_sorted = switches_prim.sort_values(by="abs_delta_v_mps", ascending=False)
        print("\nTop 5 Boundary Discontinuities at Driver Transitions (100m):")
        for idx, (_, row) in enumerate(switches_prim_sorted.head(5).iterrows()):
            print(
                f"  {idx+1}. Boundary s = {row['boundary_s']:.1f} m: "
                f"{row['driver_from']} -> {row['driver_to']} | "
                f"v_exit = {row['v_exit']*3.6:.1f} km/h, v_entry = {row['v_entry']*3.6:.1f} km/h | "
                f"|Delta_v| = {row['abs_delta_v_kmh']:.2f} km/h ({row['abs_delta_v_mps']:.3f} m/s) | "
                f"|Delta_KE| = {row['abs_delta_energy_kj']:.2f} kJ"
            )

    print("\n" + "=" * 80)
    print("EXPERIMENT 02 COMPLETE -- OUTPUTS SAVED")
    print("=" * 80)
    print(f"CSVs saved to: {PROCESSED_DIR}")
    print(f"Plots saved to: {PLOTS_DIR}")



if __name__ == "__main__":
    main()

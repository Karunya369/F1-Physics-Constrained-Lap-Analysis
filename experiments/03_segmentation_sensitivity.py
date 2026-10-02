"""
Experiment 03: Segmentation Granularity Sensitivity Analysis (Hypothesis H3).
Evaluates whether finer segmentation artificially inflates the theoretical gain
while increasing boundary discontinuities and reconciliation penalties.
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
from src.preprocessing.segmentation import CircuitSegmenter
from src.baseline.theoretical_composite import TheoreticalCompositeAnalyzer
from src.vehicle_model.level2_coupled import Level2CoupledModel
from src.synthesis.continuity_sim import ContinuitySimulator
from src.visualization.plot_gap import plot_sensitivity_analysis


def main():
    print("=" * 75)
    print("F1 Research Pipeline: Experiment 03 - Segmentation Sensitivity (Hypothesis H3)")
    print("=" * 75)

    fetcher = FastF1Fetcher()
    session = fetcher.get_session(2023, "Bahrain", "Q")
    circuit_info = fetcher.get_circuit_info(session)

    lap_lec, lap_sai, _ = LapCurator.get_fastest_teammate_laps(session, "LEC", "SAI")
    raw_lec = LapCurator.extract_raw_telemetry(lap_lec)
    raw_sai = LapCurator.extract_raw_telemetry(lap_sai)

    resampler = SpatialResampler(step_ds=1.0)
    df_lec_raw = resampler.resample_lap(raw_lec)
    df_sai_raw = resampler.resample_lap(raw_sai)
    df_lec, df_sai = SpatialResampler.align_teammates(df_lec_raw, df_sai_raw, step_ds=1.0)

    geom = TrajectoryGeometry(step_ds=1.0)
    df_lec = geom.compute_geometry(df_lec)
    df_sai = geom.compute_geometry(df_sai)

    total_dist = df_lec["Distance"].max()
    t_baseline = min(
        float(np.trapezoid(1.0 / df_lec["Speed_mps"].values, df_lec["Distance"].values)),
        float(np.trapezoid(1.0 / df_sai["Speed_mps"].values, df_sai["Distance"].values)),
    )

    segmenter = CircuitSegmenter(step_ds=1.0)
    schemes = [
        ("Hybrid Corner Complexes", segmenter.segment_by_hybrid_corners(df_lec, circuit_info=circuit_info)),
        ("Fixed 250m Mini-Sectors", segmenter.segment_by_fixed_distance(total_dist, segment_length_m=250.0)),
        ("Fixed 100m Mini-Sectors", segmenter.segment_by_fixed_distance(total_dist, segment_length_m=100.0)),
        ("Fixed 50m Mini-Sectors", segmenter.segment_by_fixed_distance(total_dist, segment_length_m=50.0)),
    ]

    model = Level2CoupledModel()
    sim_engine = ContinuitySimulator(model, step_ds=1.0)
    theo_analyzer = TheoreticalCompositeAnalyzer(mass=810.0)

    results = []

    for name, segs in schemes:
        print(f"\nEvaluating scheme: {name} ({len(segs)} segments)...")
        theo = theo_analyzer.analyze_composite(df_lec, df_sai, segs, "LEC", "SAI")
        s_theo = theo["summary"]

        ach = sim_engine.simulate_achievable_lap(
            df_lec,
            df_sai,
            theo["segments_df"],
            "LEC",
            "SAI",
            baseline_time=t_baseline,
            theoretical_time=s_theo["t_theoretical"],
        )
        s_ach = ach["summary"]

        results.append({
            "scheme": name,
            "segment_count": len(segs),
            "driver_switch_count": s_theo["driver_switch_count"],
            "max_delta_v_kmh": s_theo["max_abs_delta_v_kmh"],
            "mean_delta_v_kmh": s_theo["mean_abs_delta_v_kmh"],
            "t_theoretical_s": round(s_theo["t_theoretical"], 3),
            "theoretical_gain_s": round(s_theo["theoretical_gain_s"], 3),
            "t_achievable_s": round(s_ach["t_achievable_s"], 3),
            "achievable_gain_s": round(s_ach["achievable_gain_s"], 3),
            "gap_s": round(s_ach["gap_s"], 3),
            "retained_fraction_eta": round(s_ach["retained_fraction_eta"], 3),
        })

    sens_df = pd.DataFrame(results)
    print("\n" + "=" * 75)
    print("SEGMENTATION SENSITIVITY RESULTS (Hypothesis H3):")
    print("=" * 75)
    cols = ["scheme", "segment_count", "driver_switch_count", "theoretical_gain_s", "achievable_gain_s", "gap_s", "retained_fraction_eta"]
    print(sens_df[cols].to_string(index=False))

    plot_sensitivity_analysis(sens_df)
    out_csv = PROJECT_ROOT / "data" / "processed" / "segmentation_sensitivity_results.csv"
    sens_df.to_csv(out_csv, index=False)
    print(f"\nSaved sensitivity table to: {out_csv}")


if __name__ == "__main__":
    main()

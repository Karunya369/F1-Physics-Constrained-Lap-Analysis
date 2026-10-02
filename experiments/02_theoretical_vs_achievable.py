"""
================================================================================
DEPRECATED / HISTORICAL PIPELINE — NOT CURRENT EXPERIMENT 02
================================================================================
This script represents the historical prototype (MVP) pipeline.
It is SUPERSEDED by the canonical, locked experiments:
  - Experiment 02: experiments/02_theoretical_composite.py (Fixed 100m canonical reference)
  - Experiment 03: experiments/03_physics_constrained_composite.py (Physics-constrained feasibility)

Reasons for deprecation:
  1. Truncated spatial domain: Only covers s in [0.0, 5014.87 m] (omitting track tail to 5369.0 m).
  2. Overstated theoretical gain: Uses hybrid corner phase splitting (51 segments) that
     artificially inflates nominal theoretical gain to 7.077 s (82.845 s composite) by exploiting
     causally coupled entry/apex/exit sub-phases.
  3. Replaced by the canonical 54-segment fixed 100m pipeline (88.869 s theoretical composite,
     15 switches, complete 5369.0 m coverage).

Preserved for historical reproducibility and sensitivity benchmarking only.
Do NOT use as the current Experiment 02 reference.
================================================================================
"""

import sys
import json
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
from src.vehicle_model.calibrator import ModelCalibrator
from src.synthesis.continuity_sim import ContinuitySimulator
from src.synthesis.gap_attribution import GapAttributionAnalyzer
from src.visualization.plot_telemetry import plot_speed_comparison
from src.visualization.plot_track import plot_circuit_winners, plot_boundary_discontinuities
from src.visualization.plot_gap import plot_gap_waterfall


def main():
    print("=" * 75)
    print("F1 Research Pipeline: Experiment 02 - Theoretical vs Achievable Composite Lap")
    print("=" * 75)

    fetcher = FastF1Fetcher()
    session = fetcher.get_session(2023, "Bahrain", "Q")
    circuit_info = fetcher.get_circuit_info(session)

    print("\n1. Extracting clean flying laps for teammates LEC and SAI...")
    lap_lec, lap_sai, meta = LapCurator.get_fastest_teammate_laps(session, "LEC", "SAI")
    raw_lec = LapCurator.extract_raw_telemetry(lap_lec)
    raw_sai = LapCurator.extract_raw_telemetry(lap_sai)

    print("2. Spatial domain transformation (ds = 1.0 m) and geometry extraction...")
    resampler = SpatialResampler(step_ds=1.0)
    df_lec_raw = resampler.resample_lap(raw_lec)
    df_sai_raw = resampler.resample_lap(raw_sai)
    df_lec, df_sai = SpatialResampler.align_teammates(df_lec_raw, df_sai_raw, step_ds=1.0)

    geom = TrajectoryGeometry(step_ds=1.0)
    df_lec = geom.compute_geometry(df_lec)
    df_sai = geom.compute_geometry(df_sai)

    print("3. Partitioning track into hybrid corner complexes and straights...")
    segmenter = CircuitSegmenter(step_ds=1.0)
    segments = segmenter.segment_by_hybrid_corners(df_lec, circuit_info=circuit_info)
    print(f"   Created {len(segments)} circuit segments.")

    print("\n4. Evaluating Naive Theoretical Composite Baseline...")
    theo_analyzer = TheoreticalCompositeAnalyzer(mass=810.0)
    theo_results = theo_analyzer.analyze_composite(
        df_lec, df_sai, segments, driver1_name="LEC", driver2_name="SAI"
    )

    summary_theo = theo_results["summary"]
    segments_df = theo_results["segments_df"]
    jumps_df = theo_results["jumps_df"]

    print("\n" + "-" * 75)
    print("THEORETICAL COMPOSITE BASELINE RESULTS:")
    print("-" * 75)
    print(f"Actual Driver A (LEC) Lap Time: {summary_theo['t_driver1']:.3f} s")
    print(f"Actual Driver B (SAI) Lap Time: {summary_theo['t_driver2']:.3f} s")
    print(f"Best Real Lap (Baseline):        {summary_theo['t_best_single']:.3f} s")
    print(f"Naive Theoretical Composite:     {summary_theo['t_theoretical']:.3f} s")
    print(f"Nominal Theoretical Gain:        {summary_theo['theoretical_gain_s']:.3f} s")
    print(f"Driver Boundary Switches:        {summary_theo['driver_switch_count']} transitions")
    print(f"Max Boundary Velocity Jump (Delta_v): {summary_theo['max_abs_delta_v_kmh']:.2f} km/h")
    print(f"Mean Boundary Velocity Jump (Delta_v):{summary_theo['mean_abs_delta_v_kmh']:.2f} km/h")
    print(f"Total Discontinuous Energy Jump: {summary_theo['total_abs_energy_jump_kj']:.1f} kJ")

    print("\n5. Calibrating Level 2 Coupled Vehicle Model...")
    calibrator = ModelCalibrator(Level2CoupledModel)
    calibrated_model, _ = calibrator.calibrate(df_lec, max_iters=25)

    print("\n6. Synthesizing Physics-Constrained Continuous Composite Lap...")
    sim_engine = ContinuitySimulator(calibrated_model, step_ds=1.0)
    achievable_results = sim_engine.simulate_achievable_lap(
        df_lec,
        df_sai,
        segments_df,
        driver1_name="LEC",
        driver2_name="SAI",
        baseline_time=summary_theo["t_best_single"],
        theoretical_time=summary_theo["t_theoretical"],
    )

    summary_ach = achievable_results["summary"]
    achievable_df = achievable_results["telemetry_df"]

    print("\n" + "-" * 75)
    print("PHYSICS-CONSTRAINED COMPOSITE RESULTS:")
    print("-" * 75)
    print(f"Physically Achievable Lap Time:  {summary_ach['t_achievable_s']:.3f} s")
    print(f"Achievable Lap Gain vs Baseline: {summary_ach['achievable_gain_s']:.3f} s")
    print(f"Theoretical-to-Achievable Gap:   {summary_ach['gap_s']:.3f} s")
    print(f"Retained Theoretical Advantage:  {summary_ach['retained_percentage']}% (eta = {summary_ach['retained_fraction_eta']:.3f})")

    print("\n7. Decomposing Gap into Physical Attribution Mechanisms...")
    gap_analyzer = GapAttributionAnalyzer(mass=810.0)
    breakdown = gap_analyzer.attribute_gap(
        achievable_df, segments_df, jumps_df, summary_ach["gap_s"]
    )

    print("\n" + "-" * 75)
    print("PHYSICAL GAP ATTRIBUTION BREAKDOWN:")
    print("-" * 75)
    for k, v in breakdown.items():
        print(f"  {k:35s}: {v}")

    print("\n8. Generating Publication-Quality Research Plots...")
    plot_speed_comparison(df_lec, df_sai, df_achievable=achievable_df, driver1="LEC", driver2="SAI")
    plot_circuit_winners(df_lec, segments_df, driver1="LEC", driver2="SAI", jumps_df=jumps_df)
    plot_boundary_discontinuities(jumps_df)
    plot_gap_waterfall(summary_ach, breakdown)

    # Save structured results
    final_output = {
        "theoretical_summary": summary_theo,
        "achievable_summary": summary_ach,
        "gap_attribution": breakdown,
    }
    out_json = PROJECT_ROOT / "data" / "processed" / "mvp_results.json"
    with open(out_json, "w") as f:
        json.dump(final_output, f, indent=2)

    segments_df.to_csv(PROJECT_ROOT / "data" / "processed" / "mvp_segments.csv", index=False)
    jumps_df.to_csv(PROJECT_ROOT / "data" / "processed" / "mvp_boundary_jumps.csv", index=False)
    print(f"\nAll artifacts and results saved to data/processed and outputs/plots successfully!")


if __name__ == "__main__":
    main()

"""
Unit tests for the Theoretical Cross-Driver Composite Lap module.
Verifies full track coverage, zero overlaps, segment time integration,
composite time summation, theoretical bounds, and determinism.
"""

import unittest
import numpy as np
import pandas as pd
from src.preprocessing.segmentation import CircuitSegmenter
from src.baseline.theoretical_composite import TheoreticalCompositeAnalyzer


class TestTheoreticalComposite(unittest.TestCase):
    """Test suite covering the 6 required criteria for Experiment 02."""

    def setUp(self):
        self.step_ds = 1.0
        self.total_distance = 1000.0
        self.s = np.arange(0.0, self.total_distance + self.step_ds, self.step_ds)
        n = len(self.s)

        # Synthetic speed profiles for two drivers
        # Driver 1 faster in first half, Driver 2 faster in second half
        v1 = 60.0 + 10.0 * np.sin(2 * np.pi * self.s / self.total_distance)
        v2 = 60.0 - 10.0 * np.sin(2 * np.pi * self.s / self.total_distance)

        self.df_d1 = pd.DataFrame({
            "Distance": self.s,
            "Speed_mps": v1,
            "Speed_kmh": v1 * 3.6,
        })
        self.df_d2 = pd.DataFrame({
            "Distance": self.s,
            "Speed_mps": v2,
            "Speed_kmh": v2 * 3.6,
        })

        self.segmenter = CircuitSegmenter(step_ds=self.step_ds)
        self.analyzer = TheoreticalCompositeAnalyzer(mass=810.0)

    def test_full_track_coverage(self):
        """1. Full track coverage: first segment starts at 0.0 and final segment ends at total_distance."""
        for seg_len in [50.0, 100.0, 250.0]:
            segments = self.segmenter.segment_by_fixed_distance(self.total_distance, seg_len)
            self.assertEqual(segments[0]["s_start"], 0.0)
            self.assertEqual(segments[-1]["s_end"], self.total_distance)

    def test_no_segment_overlap(self):
        """2. No segment overlap: contiguous boundaries and total length equals total_distance."""
        for seg_len in [50.0, 100.0, 250.0]:
            segments = self.segmenter.segment_by_fixed_distance(self.total_distance, seg_len)
            total_len = sum(s["s_end"] - s["s_start"] for s in segments)
            self.assertAlmostEqual(total_len, self.total_distance, places=6)

            for i in range(len(segments) - 1):
                self.assertAlmostEqual(
                    segments[i]["s_end"], segments[i + 1]["s_start"], places=6,
                    msg=f"Boundary mismatch at segment {i}"
                )

    def test_segment_times_calculated_correctly(self):
        """3. Segment times sum to the full-lap integrated time for each driver."""
        segments = self.segmenter.segment_by_fixed_distance(self.total_distance, 100.0)
        res = self.analyzer.analyze_composite(
            self.df_d1, self.df_d2, segments, driver1_name="D1", driver2_name="D2"
        )
        df_segs = res["segments_df"]
        summary = res["summary"]

        t_d1_sum = df_segs["dt_d1"].sum()
        t_d2_sum = df_segs["dt_d2"].sum()

        self.assertAlmostEqual(t_d1_sum, summary["t_driver1"], places=5)
        self.assertAlmostEqual(t_d2_sum, summary["t_driver2"], places=5)

    def test_composite_time_equals_sum_of_selected_segment_times(self):
        """4. Composite time equals exact sum of selected winning segment times."""
        segments = self.segmenter.segment_by_fixed_distance(self.total_distance, 100.0)
        res = self.analyzer.analyze_composite(
            self.df_d1, self.df_d2, segments, driver1_name="D1", driver2_name="D2"
        )
        df_segs = res["segments_df"]
        summary = res["summary"]

        expected_t_comp = df_segs[["dt_d1", "dt_d2"]].min(axis=1).sum()
        self.assertAlmostEqual(summary["t_theoretical"], expected_t_comp, places=6)

    def test_composite_cannot_be_slower_than_faster_baseline(self):
        """5. T_theoretical <= min(T_d1, T_d2) within numerical precision."""
        for seg_len in [50.0, 100.0, 250.0]:
            segments = self.segmenter.segment_by_fixed_distance(self.total_distance, seg_len)
            res = self.analyzer.analyze_composite(
                self.df_d1, self.df_d2, segments, driver1_name="D1", driver2_name="D2"
            )
            summary = res["summary"]
            t_comp = summary["t_theoretical"]
            t_best = summary["t_best_single"]

            self.assertLessEqual(
                t_comp, t_best + 1e-9,
                msg=f"Composite time ({t_comp:.4f}s) exceeded faster baseline ({t_best:.4f}s)"
            )
            self.assertGreaterEqual(summary["theoretical_gain_s"], -1e-9)

    def test_driver_selection_is_deterministic(self):
        """6. Driver selection and boundary jumps are strictly deterministic across repeated runs."""
        segments = self.segmenter.segment_by_fixed_distance(self.total_distance, 100.0)
        res1 = self.analyzer.analyze_composite(
            self.df_d1, self.df_d2, segments, driver1_name="D1", driver2_name="D2"
        )
        res2 = self.analyzer.analyze_composite(
            self.df_d1, self.df_d2, segments, driver1_name="D1", driver2_name="D2"
        )

        pd.testing.assert_frame_equal(res1["segments_df"], res2["segments_df"])
        pd.testing.assert_frame_equal(res1["jumps_df"], res2["jumps_df"])
        self.assertEqual(res1["summary"], res2["summary"])


if __name__ == "__main__":
    unittest.main()

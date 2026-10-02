"""
Unit tests for CircuitSegmenter and coverage validation.
Verifies complete lap coverage without gaps or overlaps across fixed-distance and hybrid segmentation.
"""

import unittest
import numpy as np
import pandas as pd
from src.preprocessing.segmentation import CircuitSegmenter


class TestSegmentationCoverage(unittest.TestCase):

    def setUp(self):
        self.segmenter = CircuitSegmenter(step_ds=1.0)
        self.total_dist = 5412.0

        # Synthetic geometry dataframe with straights and corner complexes
        s_grid = np.arange(0.0, self.total_dist + 1.0, 1.0)
        kappa = np.zeros_like(s_grid)
        # Turn 1 at s=400..600
        kappa[400:600] = 0.015
        # Turn 2 at s=1200..1400
        kappa[1200:1400] = 0.020
        # Turn 3 at s=3000..3250
        kappa[3000:3250] = 0.010
        # Turn 4 at s=5000..5300
        kappa[5000:5300] = 0.018

        self.df_geom = pd.DataFrame({
            "Distance": s_grid,
            "Curvature_kappa": kappa,
            "Speed_mps": np.full_like(s_grid, 60.0),
        })

    def test_fixed_distance_coverage(self):
        """Fixed-distance segmentation must cover the full circuit with 0 gaps and 0 overlaps."""
        segments = self.segmenter.segment_by_fixed_distance(self.total_dist, segment_length_m=100.0)
        report = CircuitSegmenter.validate_coverage(segments, self.total_dist)

        self.assertTrue(report["ok"])
        self.assertEqual(report["n_gaps"], 0)
        self.assertEqual(report["n_overlaps"], 0)
        self.assertEqual(report["uncovered_distance_m"], 0.0)
        self.assertTrue(report["starts_at_zero"])
        self.assertTrue(report["ends_at_total"])

    def test_hybrid_corners_coverage(self):
        """Hybrid corner-straight segmentation must cover the full circuit with 0 gaps and 0 overlaps."""
        segments = self.segmenter.segment_by_hybrid_corners(self.df_geom, min_corner_curvature=0.005)
        report = CircuitSegmenter.validate_coverage(segments, self.total_dist)

        self.assertTrue(report["ok"], f"Hybrid coverage validation failed: {report}")
        self.assertEqual(report["n_gaps"], 0)
        self.assertEqual(report["n_overlaps"], 0)
        self.assertAlmostEqual(report["uncovered_distance_m"], 0.0, places=3)
        self.assertTrue(report["starts_at_zero"])
        self.assertTrue(report["ends_at_total"])

    def test_validate_coverage_detects_gap(self):
        """validate_coverage must detect an artificially introduced gap."""
        segments = self.segmenter.segment_by_fixed_distance(1000.0, segment_length_m=100.0)
        # Introduce a 10m gap between segment 2 and 3
        segments[3]["s_start"] += 10.0
        report = CircuitSegmenter.validate_coverage(segments, 1000.0)
        self.assertFalse(report["ok"])
        self.assertGreater(report["n_gaps"], 0)
        self.assertAlmostEqual(report["max_gap_m"], 10.0, places=3)

    def test_validate_coverage_detects_overlap(self):
        """validate_coverage must detect an artificially introduced overlap."""
        segments = self.segmenter.segment_by_fixed_distance(1000.0, segment_length_m=100.0)
        # Introduce a 5m overlap
        segments[3]["s_start"] -= 5.0
        report = CircuitSegmenter.validate_coverage(segments, 1000.0)
        self.assertFalse(report["ok"])
        self.assertGreater(report["n_overlaps"], 0)
        self.assertAlmostEqual(report["max_overlap_m"], 5.0, places=3)


if __name__ == "__main__":
    unittest.main()

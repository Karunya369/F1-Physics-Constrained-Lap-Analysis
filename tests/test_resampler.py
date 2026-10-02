"""
Unit tests for SpatialResampler.
Verifies distance monotonicity, uniform step size, and conservation of track distance.
"""

import unittest
import numpy as np
import pandas as pd
from src.preprocessing.spatial_resampler import SpatialResampler


class TestSpatialResampler(unittest.TestCase):

    def setUp(self):
        # Synthetic non-uniform telemetry trace
        s_raw = np.array([0.0, 1.2, 2.5, 4.0, 5.8, 7.1, 8.9, 10.0])
        t_raw = s_raw / 50.0  # constant 50 m/s
        v_raw = np.full_like(s_raw, 50.0)
        self.raw_df = pd.DataFrame({
            "Distance": s_raw,
            "Time_s": t_raw,
            "Speed_mps": v_raw,
            "Speed": v_raw * 3.6,
            "Throttle": np.full_like(s_raw, 100.0),
            "Brake": np.zeros_like(s_raw),
            "DRS_active": np.ones_like(s_raw, dtype=int),
            "X": s_raw * 2.0,
            "Y": s_raw * 0.5,
        })

    def test_uniform_grid(self):
        resampler = SpatialResampler(step_ds=1.0)
        res = resampler.resample_lap(self.raw_df)

        diffs = np.diff(res["Distance"].values)
        np.testing.assert_allclose(diffs, 1.0, atol=1e-5)
        self.assertEqual(res["Distance"].iloc[0], 0.0)
        self.assertEqual(res["Distance"].iloc[-1], 10.0)

    def test_non_decreasing_distance(self):
        # Introduce a backwards glitch
        corrupted = self.raw_df.copy()
        corrupted.loc[3, "Distance"] = 2.4  # reverse step
        resampler = SpatialResampler(step_ds=1.0)
        res = resampler.resample_lap(corrupted)
        self.assertTrue((np.diff(res["Distance"].values) > 0).all())


if __name__ == "__main__":
    unittest.main()

"""
Spatial domain transformation and resampling module.
Converts raw time-indexed telemetry x(t) to an equidistant spatial grid x(s).
Uses shape-preserving PCHIP interpolation to avoid unphysical oscillations.
"""

from typing import Dict, Any, Tuple
import numpy as np
import pandas as pd
from scipy.interpolate import PchipInterpolator, interp1d
from src.config import SPATIAL_STEP_DS


class SpatialResampler:
    """Transforms raw time-domain telemetry to a strictly monotonic, equidistant distance grid."""

    def __init__(self, step_ds: float = SPATIAL_STEP_DS):
        self.step_ds = step_ds

    def resample_lap(self, raw_df: pd.DataFrame, max_distance: float = None) -> pd.DataFrame:
        """
        Resample raw telemetry dataframe onto a uniform distance grid s = 0, ds, 2*ds, ... S.

        Args:
            raw_df: DataFrame containing Distance, Time_s, Speed_mps, Throttle, Brake, DRS_active, X, Y
            max_distance: Optional fixed track length to align multiple drivers to identical distance grid.

        Returns:
            Uniformly resampled DataFrame with spatial step self.step_ds.
        """
        df = raw_df.sort_values(by="Distance").copy()

        # Enforce strict spatial monotonicity (discard any reverse distance artifacts)
        s_raw = df["Distance"].values
        strictly_increasing = np.diff(s_raw, prepend=-np.inf) > 1e-4
        df = df[strictly_increasing].reset_index(drop=True)

        s_clean = df["Distance"].values
        s_start = 0.0
        s_end = max_distance if max_distance is not None else s_clean[-1]

        # Uniform distance grid
        s_grid = np.arange(s_start, s_end + 1e-6, self.step_ds)

        # Interpolate continuous variables using PCHIP (avoids overshoot)
        interp_time = PchipInterpolator(s_clean, df["Time_s"].values)
        interp_speed = PchipInterpolator(s_clean, df["Speed_mps"].values)
        interp_x = PchipInterpolator(s_clean, df["X"].values)
        interp_y = PchipInterpolator(s_clean, df["Y"].values)

        # Control inputs (throttle, brake, DRS) - nearest or linear
        interp_throttle = interp1d(s_clean, df["Throttle"].values, kind="linear", bounds_error=False, fill_value="extrapolate")
        interp_brake = interp1d(s_clean, df["Brake"].values, kind="nearest", bounds_error=False, fill_value="extrapolate")
        interp_drs = interp1d(s_clean, df["DRS_active"].values, kind="nearest", bounds_error=False, fill_value=0)

        # Evaluate on grid
        v_grid = np.maximum(interp_speed(s_grid), 0.1)  # avoid division by zero
        t_grid = interp_time(s_grid)
        x_grid = interp_x(s_grid)
        y_grid = interp_y(s_grid)
        th_grid = np.clip(interp_throttle(s_grid), 0.0, 100.0)
        br_grid = np.clip(interp_brake(s_grid), 0.0, 100.0)
        drs_grid = interp_drs(s_grid).astype(int)

        # Derive longitudinal acceleration: a_x = v * dv/ds = 0.5 * d(v^2)/ds
        v_sq = v_grid ** 2
        dv_sq_ds = np.gradient(v_sq, self.step_ds)
        ax_grid = 0.5 * dv_sq_ds

        resampled_df = pd.DataFrame({
            "Distance": s_grid,
            "Time_s": t_grid,
            "Speed_mps": v_grid,
            "Speed_kmh": v_grid * 3.6,
            "Accel_x_mps2": ax_grid,
            "Throttle": th_grid,
            "Brake": br_grid,
            "DRS_active": drs_grid,
            "X": x_grid,
            "Y": y_grid,
        })

        return resampled_df

    @classmethod
    def align_teammates(
        cls, df_d1: pd.DataFrame, df_d2: pd.DataFrame, step_ds: float = SPATIAL_STEP_DS
    ) -> Tuple[pd.DataFrame, pd.DataFrame]:
        """
        Align both drivers to a common maximum track distance to ensure exact 1-to-1 spatial grid comparison.
        """
        max_dist = min(df_d1["Distance"].max(), df_d2["Distance"].max())
        resampler = cls(step_ds=step_ds)
        d1_res = resampler.resample_lap(df_d1, max_distance=max_dist)
        d2_res = resampler.resample_lap(df_d2, max_distance=max_dist)
        return d1_res, d2_res

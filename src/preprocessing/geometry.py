"""
Track trajectory geometry derivation module.
Computes path heading, signed curvature kappa(s), corner radii, and lateral acceleration.
"""

import numpy as np
import pandas as pd
from scipy.signal import savgol_filter
from src.config import SPATIAL_STEP_DS


class TrajectoryGeometry:
    """Calculates geometric curvature and kinematics from trajectory coordinates."""

    def __init__(self, step_ds: float = SPATIAL_STEP_DS, filter_window_m: int = 61):
        self.step_ds = step_ds
        # Window length in samples for Savitzky-Golay smoothing (must be odd)
        window = int(filter_window_m / step_ds)
        self.window_len = window if window % 2 == 1 else window + 1

    def compute_geometry(self, resampled_df: pd.DataFrame) -> pd.DataFrame:
        """
        Derive heading angle, curvature kappa(s), and lateral acceleration from coordinates X, Y.
        """
        df = resampled_df.copy()
        x = df["X"].values
        y = df["Y"].values
        v = df["Speed_mps"].values

        # Spatial derivatives: dx/ds, dy/ds
        dx_ds = np.gradient(x, self.step_ds)
        dy_ds = np.gradient(y, self.step_ds)

        # Smooth derivatives if trajectory is sufficiently long
        if len(x) > self.window_len:
            dx_ds = savgol_filter(dx_ds, window_length=self.window_len, polyorder=3)
            dy_ds = savgol_filter(dy_ds, window_length=self.window_len, polyorder=3)

        # Second spatial derivatives: d2x/ds2, d2y/ds2
        d2x_ds2 = np.gradient(dx_ds, self.step_ds)
        d2y_ds2 = np.gradient(dy_ds, self.step_ds)

        if len(x) > self.window_len:
            d2x_ds2 = savgol_filter(d2x_ds2, window_length=self.window_len, polyorder=3)
            d2y_ds2 = savgol_filter(d2y_ds2, window_length=self.window_len, polyorder=3)

        # Heading angle psi(s)
        heading = np.arctan2(dy_ds, dx_ds)

        # Signed Curvature kappa(s) = (x' y'' - y' x'') / (x'^2 + y'^2)^(3/2)
        denom = (dx_ds**2 + dy_ds**2) ** 1.5
        denom = np.maximum(denom, 1e-6)
        kappa = (dx_ds * d2y_ds2 - dy_ds * d2x_ds2) / denom

        # Kinematic Curvature Consistency Clamp:
        # GPS discretization can cause artificial derivative spikes.
        # True path curvature cannot exceed physical cornering limits (ay_peak <= 45 m/s^2)
        max_phys_ay = 45.0  # m/s^2 (~4.6g)
        max_phys_kappa = max_phys_ay / np.maximum(v ** 2, 10.0)
        kappa = np.sign(kappa) * np.minimum(np.abs(kappa), max_phys_kappa)

        # Lateral acceleration: a_y = v^2 * kappa
        ay = (v ** 2) * kappa

        # Radius of curvature: R = 1 / |kappa|
        abs_kappa = np.abs(kappa)
        radius = np.where(abs_kappa > 1e-5, 1.0 / np.maximum(abs_kappa, 1e-5), 10_000.0)

        df["Heading_rad"] = heading
        df["Curvature_kappa"] = kappa
        df["Abs_Curvature"] = abs_kappa
        df["Radius_m"] = radius
        df["Accel_y_mps2"] = ay
        df["Accel_y_g"] = ay / 9.80665

        return df

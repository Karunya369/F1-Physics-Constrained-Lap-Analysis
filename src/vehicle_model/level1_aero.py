"""
Level 1 Vehicle Dynamics Model: Longitudinal + Aerodynamic Drag & Downforce.
Incorporates speed-squared aerodynamic downforce F_z(v) and drag F_drag(v).
"""

import numpy as np
from src.vehicle_model.base import BaseVehicleModel
from src.config import GRAVITY, DEFAULT_PARAMS


class Level1AeroModel(BaseVehicleModel):
    """
    Level 1: Longitudinal model with aerodynamic drag and downforce.
    - Normal load F_z(v) = m * g + k_down * v^2
    - Aerodynamic drag F_drag(v) = k_drag * v^2 (DRS-dependent)
    - Aero-assisted braking deceleration
    - Scalar cornering speed cap derived from total normal load
    """

    def __init__(self, params: dict = None):
        merged = DEFAULT_PARAMS.copy()
        if params:
            merged.update(params)
        super().__init__(merged)
        self.mass = self.params["mass"]
        self.power_max = self.params["power_max"]
        self.k_drag_drs_off = self.params["k_drag_drs_off"]
        self.k_drag_drs_on = self.params["k_drag_drs_on"]
        self.k_down = self.params["k_down"]
        self.mu_x = self.params["mu_x"]
        self.mu_y = self.params["mu_y"]
        self.mu_brake = self.params["mu_brake"]
        self.f_rr = self.params["f_rr"]

    @property
    def model_level(self) -> int:
        return 1

    @property
    def name(self) -> str:
        return "Level 1: Longitudinal + Aero Drag & Downforce (Decoupled Grip)"

    def normal_force(self, v: float) -> float:
        """Total vertical force: F_z = m * g + k_down * v^2."""
        return self.mass * GRAVITY + self.k_down * (v ** 2)

    def drag_force(self, v: float, drs: int = 0) -> float:
        """Aerodynamic drag: F_drag = k_drag * v^2."""
        k_d = self.k_drag_drs_on if drs == 1 else self.k_drag_drs_off
        return k_d * (v ** 2)

    def corner_speed_limit(self, kappa: float) -> float:
        """
        Corner speed limit with aero downforce:
        m * v^2 * kappa <= mu_y * (m * g + k_down * v^2)
        v^2 * (kappa - mu_y * k_down / m) <= mu_y * g
        """
        abs_k = abs(kappa)
        if abs_k < 1e-5:
            return 115.0  # high bound

        denom = abs_k - (self.mu_y * self.k_down / self.mass)
        if denom <= 1e-6:
            # Downforce exceeds centrifugal demand at all speeds; bounded by top speed
            return 115.0
        return float(np.sqrt(max(0.0, self.mu_y * GRAVITY / denom)))

    def max_acceleration(self, v: float, kappa: float = 0.0, drs: int = 0) -> float:
        """
        Maximum achievable longitudinal acceleration (m/s^2) during the drive phase.

        Physical interpretation:
        - Drive force F_drive = min(mu_x * F_z, P_max / v) [traction- or power-limited]
        - Net propulsive force = F_drive - F_drag - F_rr
        - When F_drag + F_rr >= F_drive, the car is at or beyond terminal velocity.
          The physically correct driver action is to hold throttle (a_net = 0).
          Returning a negative value here would cause the forward-pass integrator to
          actively decelerate the car during the acceleration phase — which is wrong.
          Braking is handled exclusively by max_deceleration().
        """
        v_eff = max(v, 1.0)
        fz = self.normal_force(v_eff)
        f_trac_limit = self.mu_x * fz
        f_power_limit = self.power_max / v_eff

        f_drive = min(f_trac_limit, f_power_limit)
        f_drag = self.drag_force(v_eff, drs=drs)

        a_net = (f_drive - f_drag - self.f_rr) / self.mass
        # Clamp to zero: the acceleration phase cannot produce net deceleration.
        # Terminal velocity (a_net < 0) is handled by holding throttle, not braking.
        return float(max(0.0, a_net))

    def max_deceleration(self, v: float, kappa: float = 0.0, drs: int = 0) -> float:
        """
        Braking deceleration assisted by aero drag and aero downforce.
        """
        v_eff = max(v, 0.0)
        fz = self.normal_force(v_eff)
        f_brake_max = self.mu_brake * fz
        f_drag = self.drag_force(v_eff, drs=0)  # DRS always closes under braking

        a_brake = (f_brake_max + f_drag + self.f_rr) / self.mass
        return float(a_brake)

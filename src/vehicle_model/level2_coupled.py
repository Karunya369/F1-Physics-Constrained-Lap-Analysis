"""
Level 2 Vehicle Dynamics Model: Coupled Longitudinal-Lateral Point-Mass + Friction Ellipse.
Couples lateral cornering demand directly with available longitudinal traction/braking grip.
"""

import numpy as np
from src.vehicle_model.base import BaseVehicleModel
from src.config import GRAVITY, DEFAULT_PARAMS


class Level2CoupledModel(BaseVehicleModel):
    """
    Level 2: Longitudinal-lateral coupled model with friction ellipse.
    - Normal load F_z(v) = m * g + k_down * v^2
    - Aerodynamic drag F_drag(v) = k_drag * v^2
    - Coupled tyre friction ellipse: (F_x / (mu_x * F_z))^2 + (F_y / (mu_y * F_z))^2 <= 1
    - Directly limits acceleration out of corners and trail-braking into corners.
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
        return 2

    @property
    def name(self) -> str:
        return "Level 2: Coupled Longitudinal-Lateral + Friction Ellipse"

    def normal_force(self, v: float) -> float:
        return self.mass * GRAVITY + self.k_down * (v ** 2)

    def drag_force(self, v: float, drs: int = 0) -> float:
        k_d = self.k_drag_drs_on if drs == 1 else self.k_drag_drs_off
        return k_d * (v ** 2)

    def corner_speed_limit(self, kappa: float) -> float:
        abs_k = abs(kappa)
        if abs_k < 1e-5:
            return 115.0

        denom = abs_k - (self.mu_y * self.k_down / self.mass)
        if denom <= 1e-6:
            return 115.0
        return float(np.sqrt(max(0.0, self.mu_y * GRAVITY / denom)))

    def remaining_longitudinal_grip(self, v: float, kappa: float, mu_longitudinal: float) -> float:
        """
        Calculate maximum longitudinal force capacity |F_x|_max using the friction ellipse.
        """
        v_eff = max(v, 0.5)
        fz = self.normal_force(v_eff)
        # Required lateral force: F_y = m * v^2 * |kappa|
        fy_demand = self.mass * (v_eff ** 2) * abs(kappa)
        fy_max = self.mu_y * fz

        lateral_ratio_sq = (fy_demand / fy_max) ** 2
        if lateral_ratio_sq >= 1.0:
            return 0.0  # 100% of grip consumed by lateral cornering

        fx_max = mu_longitudinal * fz * np.sqrt(max(0.0, 1.0 - lateral_ratio_sq))
        return float(fx_max)

    def max_acceleration(self, v: float, kappa: float = 0.0, drs: int = 0) -> float:
        """
        Maximum achievable longitudinal acceleration (m/s^2) during the drive phase.

        Physical interpretation:
        - F_drive is limited by the friction ellipse (lateral cornering load reduces
          available longitudinal traction) and by engine power output.
        - When F_drag + F_rr >= F_drive, the car is at or beyond terminal velocity.
          The physically correct driver action is to hold throttle (a_net = 0).
          Returning a negative value here would cause the forward-pass integrator to
          actively decelerate the car during the acceleration phase — which is wrong.
          Braking is handled exclusively by max_deceleration().
        """
        v_eff = max(v, 1.0)
        fx_grip = self.remaining_longitudinal_grip(v_eff, kappa, self.mu_x)
        f_power = self.power_max / v_eff

        f_drive = min(fx_grip, f_power)
        f_drag = self.drag_force(v_eff, drs=drs)

        a_net = (f_drive - f_drag - self.f_rr) / self.mass
        # Clamp to zero: the acceleration phase cannot produce net deceleration.
        # Terminal velocity (a_net < 0) is handled by holding throttle, not braking.
        return float(max(0.0, a_net))

    def max_deceleration(self, v: float, kappa: float = 0.0, drs: int = 0) -> float:
        """
        Braking deceleration limited by friction ellipse (trail-braking) and assisted by aero drag.
        """
        v_eff = max(v, 0.0)
        fx_brake_grip = self.remaining_longitudinal_grip(v_eff, kappa, self.mu_brake)
        f_drag = self.drag_force(v_eff, drs=0)

        a_brake = (fx_brake_grip + f_drag + self.f_rr) / self.mass
        return float(a_brake)

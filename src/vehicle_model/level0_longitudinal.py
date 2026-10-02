"""
Level 0 Vehicle Dynamics Model: Pure Longitudinal Point-Mass.
Assumes constant normal load (no aero downforce) and no aerodynamic drag.
"""

import numpy as np
from src.vehicle_model.base import BaseVehicleModel
from src.config import GRAVITY, DEFAULT_PARAMS


class Level0LongitudinalModel(BaseVehicleModel):
    """
    Level 0: Pure longitudinal vehicle model.
    - Constant vertical load F_z = m * g (no downforce)
    - Zero aerodynamic drag (F_drag = 0)
    - Power and friction-limited tractive force
    - Constant friction braking deceleration
    """

    def __init__(self, params: dict = None):
        merged = DEFAULT_PARAMS.copy()
        if params:
            merged.update(params)
        super().__init__(merged)
        self.mass = self.params["mass"]
        self.power_max = self.params["power_max"]
        self.mu_x = self.params["mu_x"]
        self.mu_y = self.params["mu_y"]
        self.mu_brake = self.params["mu_brake"]
        self.f_rr = self.params["f_rr"]

    @property
    def model_level(self) -> int:
        return 0

    @property
    def name(self) -> str:
        return "Level 0: Pure Longitudinal Point-Mass (No Aero, No Ellipse)"

    def corner_speed_limit(self, kappa: float) -> float:
        """
        Corner speed limit without downforce:
        m * v^2 * kappa <= mu_y * m * g  ==>  v <= sqrt(mu_y * g / kappa)
        """
        abs_k = abs(kappa)
        if abs_k < 1e-5:
            return 115.0  # ~414 km/h high unconstrained bound
        return float(np.sqrt(self.mu_y * GRAVITY / abs_k))

    def max_acceleration(self, v: float, kappa: float = 0.0, drs: int = 0) -> float:
        """
        Longitudinal acceleration limited by tyre traction and engine power.
        Zero aerodynamic drag.
        """
        v_eff = max(v, 1.0)
        # Traction force limit: F_trac <= mu_x * m * g
        f_trac_limit = self.mu_x * self.mass * GRAVITY
        # Power limit: F_power = P / v
        f_power_limit = self.power_max / v_eff

        f_x = min(f_trac_limit, f_power_limit)
        # Net acceleration: a_x = (F_x - F_rr) / m
        a_net = (f_x - self.f_rr) / self.mass
        return max(0.0, float(a_net))

    def max_deceleration(self, v: float, kappa: float = 0.0, drs: int = 0) -> float:
        """
        Braking deceleration magnitude.
        Constant friction, no aero assistance: a_brake = mu_brake * g
        """
        a_brake = (self.mu_brake * self.mass * GRAVITY + self.f_rr) / self.mass
        return float(a_brake)

"""
Unit tests for vehicle dynamics models across the hierarchy.
Verifies Level 0, Level 1, and Level 2 physical limits, acceleration boundaries,
and equations of motion under power, drag, downforce, and tire friction limits.
"""

import unittest
import numpy as np
from src.vehicle_model.level0_longitudinal import Level0LongitudinalModel
from src.vehicle_model.level1_aero import Level1AeroModel
from src.vehicle_model.level2_coupled import Level2CoupledModel


class TestVehicleModels(unittest.TestCase):

    def setUp(self):
        self.m0 = Level0LongitudinalModel()
        self.m1 = Level1AeroModel()
        self.m2 = Level2CoupledModel()

    def test_level_identifiers(self):
        self.assertEqual(self.m0.model_level, 0)
        self.assertEqual(self.m1.model_level, 1)
        self.assertEqual(self.m2.model_level, 2)

    def test_positive_available_acceleration(self):
        """At moderate racing speeds (20-50 m/s), positive acceleration is available."""
        for v in [20.0, 35.0, 50.0]:
            a0 = self.m0.max_acceleration(v)
            a1 = self.m1.max_acceleration(v)
            a2 = self.m2.max_acceleration(v, kappa=0.0)

            self.assertGreater(a0, 0.0, f"L0 accel at v={v} should be positive")
            self.assertGreater(a1, 0.0, f"L1 accel at v={v} should be positive")
            self.assertGreater(a2, 0.0, f"L2 accel at v={v} should be positive")

            # Must not exceed physical tire grip (~2.0g ~ 20 m/s^2)
            self.assertLess(a0, 25.0)
            self.assertLess(a1, 25.0)
            self.assertLess(a2, 25.0)

    def test_high_speed_drag_limited_operation(self):
        """
        When aerodynamic drag exceeds available engine tractive force at or above
        terminal velocity, max_acceleration() must return 0.0, NOT negative acceleration.
        (Holding full throttle at terminal velocity produces a_net = 0, not active braking).
        """
        v_hypothetical_supersonic = 150.0  # Drag ~ 1.15 * 150^2 = 25,875 N >> Power/v ~ 740,000/150 = 4,933 N

        a1_drag_limited = self.m1.max_acceleration(v_hypothetical_supersonic)
        a2_drag_limited = self.m2.max_acceleration(v_hypothetical_supersonic, kappa=0.0)

        self.assertEqual(a1_drag_limited, 0.0, "L1 acceleration must be capped at 0.0 when drag > drive force")
        self.assertEqual(a2_drag_limited, 0.0, "L2 acceleration must be capped at 0.0 when drag > drive force")

    def test_braking_deceleration_behavior(self):
        """
        Braking deceleration must always be positive across all speeds and models.
        In aero-equipped models (L1 and L2), high-speed braking must exceed low-speed
        braking due to aerodynamic downforce (increasing normal load) and aero drag.
        """
        for v in [10.0, 30.0, 60.0, 90.0]:
            d0 = self.m0.max_deceleration(v)
            d1 = self.m1.max_deceleration(v)
            d2 = self.m2.max_deceleration(v, kappa=0.0)

            self.assertGreater(d0, 0.0, f"L0 decel at v={v} must be positive")
            self.assertGreater(d1, 0.0, f"L1 decel at v={v} must be positive")
            self.assertGreater(d2, 0.0, f"L2 decel at v={v} must be positive")

        # Aero scaling: at 80 m/s, downforce and drag should increase deceleration by > 50%
        d1_low = self.m1.max_deceleration(20.0)
        d1_high = self.m1.max_deceleration(80.0)
        self.assertGreater(d1_high, d1_low * 1.5)

        d2_low = self.m2.max_deceleration(20.0, kappa=0.0)
        d2_high = self.m2.max_deceleration(80.0, kappa=0.0)
        self.assertGreater(d2_high, d2_low * 1.5)

    def test_level2_coupled_friction_ellipse(self):
        """
        In Level 2, lateral cornering demand consumes tire adhesion capacity,
        reducing available longitudinal acceleration and deceleration.
        """
        v = 40.0
        # On a straight (kappa = 0), full longitudinal grip available
        a_straight = self.m2.max_acceleration(v, kappa=0.0)
        # In a sharp corner (kappa = 0.015), available longitudinal acceleration must decrease
        a_corner = self.m2.max_acceleration(v, kappa=0.015)
        self.assertLess(a_corner, a_straight)

        # Similarly for braking
        d_straight = self.m2.max_deceleration(v, kappa=0.0)
        d_corner = self.m2.max_deceleration(v, kappa=0.015)
        self.assertLess(d_corner, d_straight)


if __name__ == "__main__":
    unittest.main()

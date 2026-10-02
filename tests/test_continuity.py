"""
Unit tests for state continuity and the forward-backward solver.
Verifies C^0 speed continuity, apex capping, and absence of energy teleportation.
"""

import unittest
import numpy as np
from src.vehicle_model.level2_coupled import Level2CoupledModel
from src.vehicle_model.forward_backward_solver import ForwardBackwardSolver


class TestStateContinuity(unittest.TestCase):

    def setUp(self):
        self.model = Level2CoupledModel()
        self.solver = ForwardBackwardSolver(self.model, step_ds=1.0)
        self.s = np.arange(0.0, 1000.0, 1.0)
        self.curvatures = np.zeros_like(self.s)
        # Inject an acute corner at s = 500m
        self.curvatures[480:520] = 0.02  # R = 50m
        self.drs = np.zeros_like(self.s, dtype=int)

    def test_c0_continuity_no_jumps(self):
        # Forward-backward profile
        sim = self.solver.solve_lap(self.s, self.curvatures, self.drs, v_initial=70.0)
        v = sim["Speed_mps"].values

        # Maximum change in speed between consecutive 1m steps
        # Given maximum braking deceleration ~ 50 m/s^2, dv across 1m cannot exceed ~1.5 m/s at 50 m/s
        dv_max = np.max(np.abs(np.diff(v)))
        self.assertLess(dv_max, 2.5)  # Strict continuity check

    def test_apex_speed_cap_respected(self):
        sim = self.solver.solve_lap(self.s, self.curvatures, self.drs, v_initial=70.0)
        v = sim["Speed_mps"].values
        # Inside the corner [480:520], speed must drop to meet corner speed limit
        corner_limit = self.model.corner_speed_limit(0.02)
        min_speed_in_corner = np.min(v[480:520])
        self.assertLessEqual(min_speed_in_corner, corner_limit + 1e-3)

    def test_strictly_monotonic_time(self):
        sim = self.solver.solve_lap(self.s, self.curvatures, self.drs, v_initial=70.0)
        t = sim["Time_s"].values
        self.assertTrue((np.diff(t) > 0).all())


class TestPeriodicLapSolver(unittest.TestCase):
    """
    Unit tests for the bounded root-finding periodic lap solver.
    Verifies bracket detection, convergence, error bounds, failure handling,
    parameter immutability, and numerical determinism.
    """

    def setUp(self):
        self.model = Level2CoupledModel()
        self.solver = ForwardBackwardSolver(self.model, step_ds=1.0)
        self.s = np.arange(0.0, 1000.0, 1.0)
        self.curvatures = np.zeros_like(self.s)
        self.curvatures[480:520] = 0.02  # R = 50m apex
        self.drs = np.zeros_like(self.s, dtype=int)

    def test_valid_bracket_detected(self):
        """Verify solver establishes or accepts a sign-changing bracket."""
        sim, diag = self.solver.solve_periodic_lap(
            self.s, self.curvatures, self.drs, tol=0.01, raise_on_failure=True
        )
        v_low, v_high = diag["bracket"]
        self.assertLess(v_low, v_high)
        # Residual at endpoints must bracket zero
        sim_low = self.solver.solve_lap(self.s, self.curvatures, self.drs, v_initial=v_low)
        sim_high = self.solver.solve_lap(self.s, self.curvatures, self.drs, v_initial=v_high)
        g_low = sim_low["Speed_mps"].iloc[-1] - v_low
        g_high = sim_high["Speed_mps"].iloc[-1] - v_high
        self.assertLessEqual(g_low * g_high, 0.0)

    def test_root_finding_converges_when_bracket_exists(self):
        """Verify bisection converges to a valid solution."""
        sim, diag = self.solver.solve_periodic_lap(
            self.s, self.curvatures, self.drs, tol=0.01
        )
        self.assertTrue(diag["converged"])
        self.assertIsNotNone(sim)
        self.assertGreater(diag["iterations"], 0)
        self.assertLessEqual(diag["iterations"], 40)

    def test_periodicity_error_below_tolerance(self):
        """Verify realized periodicity error |v(S) - v(0)| <= tol."""
        tol = 0.01
        sim, diag = self.solver.solve_periodic_lap(
            self.s, self.curvatures, self.drs, tol=tol
        )
        v0 = sim["Speed_mps"].iloc[0]
        v_final = sim["Speed_mps"].iloc[-1]
        error = abs(v_final - v0)
        self.assertLessEqual(error, tol)
        self.assertLessEqual(diag["periodicity_error"], tol)

    def test_solver_fails_cleanly_when_no_bracket_exists(self):
        """Verify clean failure when bounds do not enclose a sign change."""
        # On this track, root is ~82.4 m/s. Interval [30, 50] has g > 0 everywhere.
        with self.assertRaises(ValueError) as ctx:
            self.solver.solve_periodic_lap(
                self.s, self.curvatures, self.drs, v_bounds=(30.0, 50.0), raise_on_failure=True
            )
        self.assertIn("No sign-changing bracket exists", str(ctx.exception))

        # Test raise_on_failure=False returns (None, diag) with converged=False
        sim, diag = self.solver.solve_periodic_lap(
            self.s, self.curvatures, self.drs, v_bounds=(30.0, 50.0), raise_on_failure=False
        )
        self.assertIsNone(sim)
        self.assertFalse(diag["converged"])
        self.assertIn("failure_reason", diag)

    def test_vehicle_parameters_unmodified_by_periodic_solve(self):
        """Verify that periodic root-finding does not mutate vehicle parameters."""
        params_before = dict(self.model.params)
        self.solver.solve_periodic_lap(self.s, self.curvatures, self.drs, tol=0.01)
        params_after = dict(self.model.params)
        self.assertEqual(params_before, params_after)

    def test_deterministic_repeated_runs(self):
        """Verify repeated executions produce bitwise identical results."""
        sim1, diag1 = self.solver.solve_periodic_lap(self.s, self.curvatures, self.drs, tol=0.01)
        sim2, diag2 = self.solver.solve_periodic_lap(self.s, self.curvatures, self.drs, tol=0.01)

        self.assertEqual(diag1["v0"], diag2["v0"])
        self.assertEqual(diag1["v_final"], diag2["v_final"])
        self.assertEqual(diag1["periodicity_error"], diag2["periodicity_error"])
        self.assertEqual(diag1["iterations"], diag2["iterations"])
        np.testing.assert_array_equal(sim1["Speed_mps"].values, sim2["Speed_mps"].values)


if __name__ == "__main__":
    unittest.main()


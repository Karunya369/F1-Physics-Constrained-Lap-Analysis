"""
Forward-Backward Velocity Profile Solver (Two-Pass Integration Algorithm).
Enforces exact C^0 velocity continuity and dynamic feasibility across the entire lap.
"""

from typing import Optional, Dict, Any, Tuple
import numpy as np
import pandas as pd
from src.vehicle_model.base import BaseVehicleModel
from src.config import SPATIAL_STEP_DS


class ForwardBackwardSolver:
    """Solves the continuous, dynamically feasible velocity profile across a trajectory."""

    def __init__(self, vehicle_model: BaseVehicleModel, step_ds: float = SPATIAL_STEP_DS):
        self.model = vehicle_model
        self.step_ds = step_ds

    def solve_lap(
        self,
        distances: np.ndarray,
        curvatures: np.ndarray,
        drs_active: np.ndarray,
        v_initial: Optional[float] = None,
        v_donor_caps: Optional[np.ndarray] = None,
        periodic: bool = False,
        tol: float = 0.01,
        max_iters: int = 40,
        v_bounds: Optional[Tuple[float, float]] = None,
    ) -> pd.DataFrame:
        """
        Integrate the forward-backward velocity profile along distance vector s.

        Args:
            distances: 1D array of spatial positions s (m), step size self.step_ds.
            curvatures: 1D array of signed curvature kappa(s) (1/m).
            drs_active: 1D array of DRS flags (0 or 1).
            v_initial: Starting speed at s = 0 (m/s). If None, uses apex limit or top speed.
            v_donor_caps: Optional array of speed caps transferred from donor telemetry.
            periodic: If True, uses bounded bisection root finding on v_initial to enforce v(S) ≈ v(0).
            tol: Tolerance on periodicity |v(S) - v(0)| (m/s) when periodic=True.
            max_iters: Maximum bisection iterations when periodic=True.
            v_bounds: Optional (v_low, v_high) speed bracket for root finding.

        Returns:
            DataFrame containing Distance, Speed_mps, Speed_kmh, Time_s, Accel_x_mps2.
        """
        if periodic:
            sim_df, diag = self.solve_periodic_lap(
                distances=distances,
                curvatures=curvatures,
                drs_active=drs_active,
                v_bounds=v_bounds,
                tol=tol,
                max_iters=max_iters,
                v_donor_caps=v_donor_caps,
                raise_on_failure=True,
            )
            sim_df.attrs["periodic_diagnostics"] = diag
            return sim_df

        n = len(distances)
        if n == 0:
            raise ValueError("Empty distance array provided to solver.")

        # Step 1: Compute corner apex limits
        v_apex_limits = np.zeros(n)
        for i in range(n):
            v_apex_limits[i] = self.model.corner_speed_limit(curvatures[i])

        # Combined upper bound envelope
        if v_donor_caps is not None:
            v_upper_bound = np.minimum(v_apex_limits, v_donor_caps)
        else:
            v_upper_bound = v_apex_limits

        # Initialize forward profile
        v_fwd = np.zeros(n)
        if v_initial is not None:
            v_fwd[0] = min(v_initial, v_upper_bound[0])
        else:
            v_fwd[0] = min(70.0, v_upper_bound[0])  # ~250 km/h start/finish speed

        # Step 2: Forward acceleration pass
        for i in range(n - 1):
            v_curr = v_fwd[i]
            k_curr = curvatures[i]
            drs_curr = drs_active[i]

            ax_accel = self.model.max_acceleration(v_curr, kappa=k_curr, drs=drs_curr)
            # v^2 = v0^2 + 2 * a * ds
            v_next_sq = (v_curr ** 2) + 2.0 * ax_accel * self.step_ds
            v_next = np.sqrt(max(0.0, v_next_sq))

            # Bound by upper limit at next point
            v_fwd[i + 1] = min(v_next, v_upper_bound[i + 1])

        # Step 3: Backward deceleration pass
        v_bwd = np.copy(v_fwd)
        for i in range(n - 1, 0, -1):
            v_curr = v_bwd[i]
            k_curr = curvatures[i]

            ax_decel = self.model.max_deceleration(v_curr, kappa=k_curr, drs=0)
            # v_prev^2 = v_curr^2 + 2 * a_decel * ds
            v_prev_sq = (v_curr ** 2) + 2.0 * ax_decel * self.step_ds
            v_prev = np.sqrt(max(0.0, v_prev_sq))

            # Take minimum with forward pass and upper bound
            v_bwd[i - 1] = min(v_bwd[i - 1], v_prev)

        v_final = np.maximum(v_bwd, 1.0)  # enforce non-zero speed

        # Step 4: Time integration t(s) = integral (1 / v) ds
        dt = np.zeros(n)
        dt[1:] = (self.step_ds / (0.5 * (v_final[:-1] + v_final[1:])))
        t_cum = np.cumsum(dt)

        # Step 5: Derive realized longitudinal acceleration
        v_sq = v_final ** 2
        ax_realized = 0.5 * np.gradient(v_sq, self.step_ds)

        result_df = pd.DataFrame({
            "Distance": distances,
            "Speed_mps": v_final,
            "Speed_kmh": v_final * 3.6,
            "Time_s": t_cum,
            "Accel_x_mps2": ax_realized,
            "Corner_Cap_mps": v_upper_bound,
        })

        return result_df

    def solve_periodic_lap(
        self,
        distances: np.ndarray,
        curvatures: np.ndarray,
        drs_active: np.ndarray,
        v_bounds: Optional[Tuple[float, float]] = None,
        tol: float = 0.01,
        max_iters: int = 40,
        v_donor_caps: Optional[np.ndarray] = None,
        raise_on_failure: bool = True,
    ) -> Tuple[Optional[pd.DataFrame], Dict[str, Any]]:
        """
        Solve the periodic velocity profile such that v(S) ≈ v(0) on a closed circuit.

        Finds the initial speed v0* that satisfies:
            g(v0) = v_sim(S; v0) - v0 = 0
        using bounded bisection root finding over a physically defensible interval [v_low, v_high].

        Why Bisection Root Finding is Appropriate:
            Fixed-point iteration v0^(k+1) = v_sim(S; v0^(k)) relies on the Banach fixed-point
            theorem, requiring the mapping to be a contraction (|dg/dv0 + 1| < 1). On general tracks
            or segmentations, this is not guaranteed a priori.
            In contrast, bisection on the scalar residual g(v0) = v_sim(S; v0) - v0 requires ONLY
            that g is continuous on [v_low, v_high] and has a sign change (g(v_low) * g(v_high) <= 0).
            By the Intermediate Value Theorem, a root is guaranteed to exist and bisection converges
            unconditionally at a deterministic rate of 1 bit (interval halving) per iteration.

        Args:
            distances: 1D array of spatial positions s (m).
            curvatures: 1D array of signed curvature kappa(s) (1/m).
            drs_active: 1D array of DRS flags (0 or 1).
            v_bounds: Optional (v_low, v_high) speed bracket. If None, uses physically defensible
                      defaults derived from apex limits and straight terminal speed.
            tol: Convergence tolerance for periodicity error |v(S) - v(0)| in m/s (default 0.01 m/s).
            max_iters: Maximum bisection iterations (default 40).
            v_donor_caps: Optional array of speed caps transferred from donor telemetry.
            raise_on_failure: If True, raises ValueError/RuntimeError on failure. If False, returns (None, diag).

        Returns:
            Tuple of (DataFrame of final simulation, diagnostic dict).
            Diagnostic dict contains:
                - converged (bool): True if |g(v0)| <= tol within max_iters
                - v0 (float): Realized initial speed v(0) in m/s
                - v_final (float): Realized final speed v(S) in m/s
                - periodicity_error (float): |v(S) - v(0)| in m/s
                - bracket (Tuple[float, float]): (v_low, v_high) bracket used
                - iterations (int): Number of bisection iterations performed
                - final_g (float): Residual g(v0) = v_final - v0
                - lap_time (float): Lap time t(S) in seconds
        """
        n = len(distances)
        if n == 0:
            raise ValueError("Empty distance array provided to solver.")

        # Establish bounds
        if v_bounds is not None:
            v_low, v_high = float(v_bounds[0]), float(v_bounds[1])
            if v_low >= v_high:
                raise ValueError(f"Invalid v_bounds: v_low ({v_low}) must be strictly less than v_high ({v_high})")
        else:
            v_apex_0 = self.model.corner_speed_limit(curvatures[0])
            if v_donor_caps is not None:
                v_cap_0 = min(v_apex_0, float(v_donor_caps[0]))
            else:
                v_cap_0 = v_apex_0
            v_high = min(100.0, v_cap_0)
            v_low = min(20.0, 0.5 * v_high)

        # Evaluate endpoints
        sim_low = self.solve_lap(distances, curvatures, drs_active, v_initial=v_low, v_donor_caps=v_donor_caps)
        vf_low = float(sim_low["Speed_mps"].iloc[-1])
        g_low = vf_low - v_low

        if abs(g_low) <= tol:
            v0_res = float(sim_low["Speed_mps"].iloc[0])
            diag = {
                "converged": True,
                "v0": v0_res,
                "v_final": vf_low,
                "periodicity_error": abs(vf_low - v0_res),
                "bracket": (v_low, v_high),
                "iterations": 1,
                "final_g": g_low,
                "lap_time": float(sim_low["Time_s"].iloc[-1]),
            }
            return sim_low, diag

        sim_high = self.solve_lap(distances, curvatures, drs_active, v_initial=v_high, v_donor_caps=v_donor_caps)
        vf_high = float(sim_high["Speed_mps"].iloc[-1])
        g_high = vf_high - v_high

        if abs(g_high) <= tol:
            v0_res = float(sim_high["Speed_mps"].iloc[0])
            diag = {
                "converged": True,
                "v0": v0_res,
                "v_final": vf_high,
                "periodicity_error": abs(vf_high - v0_res),
                "bracket": (v_low, v_high),
                "iterations": 1,
                "final_g": g_high,
                "lap_time": float(sim_high["Time_s"].iloc[-1]),
            }
            return sim_high, diag

        # Verify sign-changing bracket
        if g_low * g_high > 0:
            diag = {
                "converged": False,
                "v0": None,
                "v_final": None,
                "periodicity_error": None,
                "bracket": (v_low, v_high),
                "iterations": 2,
                "final_g": None,
                "lap_time": None,
                "failure_reason": f"No sign-changing bracket exists on [{v_low:.2f}, {v_high:.2f}]: g({v_low:.2f})={g_low:+.4f}, g({v_high:.2f})={g_high:+.4f}",
            }
            if raise_on_failure:
                raise ValueError(
                    f"Periodic solver failed: No sign-changing bracket exists on [{v_low:.2f}, {v_high:.2f}]. "
                    f"g(v_low)={g_low:+.4f}, g(v_high)={g_high:+.4f} (both have same sign)."
                )
            return None, diag

        # Bisection loop
        v_a, v_b = v_low, v_high
        g_a, g_b = g_low, g_high

        iteration = 0
        converged = False
        last_sim = None
        v_mid = 0.5 * (v_a + v_b)
        g_mid = 0.0

        while iteration < max_iters:
            iteration += 1
            v_mid = 0.5 * (v_a + v_b)
            last_sim = self.solve_lap(distances, curvatures, drs_active, v_initial=v_mid, v_donor_caps=v_donor_caps)
            v_final = float(last_sim["Speed_mps"].iloc[-1])
            g_mid = v_final - v_mid

            if abs(g_mid) <= tol or 0.5 * (v_b - v_a) <= tol:
                converged = True
                break

            if (g_a > 0 and g_mid > 0) or (g_a < 0 and g_mid < 0):
                v_a = v_mid
                g_a = g_mid
            else:
                v_b = v_mid
                g_b = g_mid

        v0_realized = float(last_sim["Speed_mps"].iloc[0]) if last_sim is not None else v_mid
        vf_realized = float(last_sim["Speed_mps"].iloc[-1]) if last_sim is not None else v_final
        periodicity_error = abs(vf_realized - v0_realized)
        lap_time = float(last_sim["Time_s"].iloc[-1]) if last_sim is not None else None

        diag = {
            "converged": converged,
            "v0": v0_realized,
            "v_final": vf_realized,
            "periodicity_error": periodicity_error,
            "bracket": (v_low, v_high),
            "iterations": iteration,
            "final_g": g_mid,
            "lap_time": lap_time,
        }

        if not converged:
            diag["failure_reason"] = f"Maximum iterations ({max_iters}) reached without reaching tol={tol}."
            if raise_on_failure:
                raise RuntimeError(
                    f"Periodic solver did not converge within {max_iters} iterations: final |g|={abs(g_mid):.4f}, tol={tol}."
                )

        return last_sim, diag


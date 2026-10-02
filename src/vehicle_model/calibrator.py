"""
Model calibration, validation, and error auditing module.
Enforces Section I validation criteria against real empirical single-driver laps.
"""

from typing import Dict, Any, Tuple, Optional
import numpy as np
import pandas as pd
from scipy.optimize import minimize
from src.vehicle_model.base import BaseVehicleModel
from src.vehicle_model.forward_backward_solver import ForwardBackwardSolver
from src.config import VALIDATION_THRESHOLDS, PARAM_BOUNDS, DEFAULT_PARAMS


class ModelValidator:
    """Evaluates simulation fidelity against real empirical single-driver telemetry."""

    @staticmethod
    def compute_validation_metrics(
        sim_df: pd.DataFrame, ref_df: pd.DataFrame
    ) -> Dict[str, Any]:
        """
        Compute objective validation metrics comparing simulated vs measured lap.
        """
        v_sim = sim_df["Speed_mps"].values
        v_ref = ref_df["Speed_mps"].values
        s = sim_df["Distance"].values

        # Velocity RMSE
        v_rmse = float(np.sqrt(np.mean((v_sim - v_ref) ** 2)))
        v_mae = float(np.mean(np.abs(v_sim - v_ref)))
        v_max_err = float(np.max(np.abs(v_sim - v_ref)))

        # Total lap time error
        t_sim = float(sim_df["Time_s"].iloc[-1])
        t_ref = float(ref_df["Time_s"].iloc[-1])
        lap_time_error = abs(t_sim - t_ref)

        # Top speed error
        v_top_sim = float(np.max(v_sim))
        v_top_ref = float(np.max(v_ref))
        top_speed_err = abs(v_top_sim - v_top_ref)

        # Acceleration error
        ax_sim = sim_df["Accel_x_mps2"].values
        ax_ref = ref_df["Accel_x_mps2"].values
        ax_rmse = float(np.sqrt(np.mean((ax_sim - ax_ref) ** 2)))

        # Status against thresholds
        thresh = VALIDATION_THRESHOLDS
        if lap_time_error <= thresh["lap_time_error_target"] and v_rmse <= thresh["velocity_rmse_target"]:
            verdict = "TARGET_PASS"
        elif lap_time_error <= thresh["lap_time_error_inadequate"] and v_rmse <= thresh["velocity_rmse_inadequate"]:
            verdict = "INADEQUATE"
        else:
            verdict = "FAILED_UNTRUSTABLE"

        return {
            "verdict": verdict,
            "lap_time_sim_s": round(t_sim, 3),
            "lap_time_ref_s": round(t_ref, 3),
            "lap_time_error_s": round(lap_time_error, 3),
            "velocity_rmse_mps": round(v_rmse, 3),
            "velocity_mae_mps": round(v_mae, 3),
            "velocity_max_error_mps": round(v_max_err, 3),
            "top_speed_error_mps": round(top_speed_err, 3),
            "accel_rmse_mps2": round(ax_rmse, 3),
        }


class ModelCalibrator:
    """Calibrates vehicle model parameters against a single-driver reference lap."""

    def __init__(self, model_class, initial_params: Optional[dict] = None):
        self.model_class = model_class
        self.params = DEFAULT_PARAMS.copy()
        if initial_params:
            self.params.update(initial_params)

    def calibrate(self, ref_df: pd.DataFrame, max_iters: int = 15) -> Tuple[BaseVehicleModel, Dict[str, Any]]:
        """
        Fit model parameters to minimize velocity RMSE on training telemetry.
        """
        s = ref_df["Distance"].values
        curvatures = ref_df["Curvature_kappa"].values if "Curvature_kappa" in ref_df.columns else np.zeros_like(s)
        drs = ref_df["DRS_active"].values
        v_ref = ref_df["Speed_mps"].values
        v_init = float(v_ref[0])

        # Optimize key parameters depending on model level
        temp_model = self.model_class(self.params)
        level = temp_model.model_level

        if level == 0:
            # Level 0: fit power and friction
            param_names = ["power_max", "mu_x", "mu_brake"]
            x0 = [self.params["power_max"], self.params["mu_x"], self.params["mu_brake"]]
            bounds = [PARAM_BOUNDS["power_max"], PARAM_BOUNDS["mu_x"], PARAM_BOUNDS["mu_brake"]]
        elif level == 1:
            # Level 1: fit power, drag, downforce, friction
            param_names = ["k_drag_drs_off", "k_down", "mu_x", "mu_y"]
            x0 = [self.params["k_drag_drs_off"], self.params["k_down"], self.params["mu_x"], self.params["mu_y"]]
            bounds = [PARAM_BOUNDS["k_drag_drs_off"], PARAM_BOUNDS["k_down"], PARAM_BOUNDS["mu_x"], PARAM_BOUNDS["mu_y"]]
        else:
            # Level 2: coupled model -- Policy A: mu_x locked at 1.700 literature reference
            param_names = ["k_drag_drs_off", "k_down", "mu_y"]
            x0 = [self.params["k_drag_drs_off"], self.params["k_down"], self.params["mu_y"]]
            bounds = [PARAM_BOUNDS["k_drag_drs_off"], PARAM_BOUNDS["k_down"], PARAM_BOUNDS["mu_y"]]

        def loss_fn(x):
            test_params = self.params.copy()
            if level == 2:
                # Strictly enforce mu_x = 1.700 across all loss evaluations
                test_params["mu_x"] = 1.700
            for name, val in zip(param_names, x):
                test_params[name] = float(val)
            # Enforce DRS on scale proportionally
            if "k_drag_drs_off" in test_params:
                test_params["k_drag_drs_on"] = test_params["k_drag_drs_off"] * 0.70

            model = self.model_class(test_params)
            solver = ForwardBackwardSolver(model, step_ds=ref_df["Distance"].iloc[1] - ref_df["Distance"].iloc[0])
            sim = solver.solve_lap(s, curvatures, drs, v_initial=v_init)
            v_sim = sim["Speed_mps"].values
            return np.mean((v_sim - v_ref) ** 2)

        # Optimize within declared bounds
        if level == 2:
            res = minimize(loss_fn, x0, method="L-BFGS-B", bounds=bounds, options={"maxiter": max_iters})
        else:
            res = minimize(loss_fn, x0, method="Nelder-Mead", options={"maxiter": max_iters, "disp": False})

        calibrated_params = self.params.copy()
        if level == 2:
            calibrated_params["mu_x"] = 1.700
        for name, val in zip(param_names, res.x):
            calibrated_params[name] = float(val)
        if "k_drag_drs_off" in calibrated_params:
            calibrated_params["k_drag_drs_on"] = calibrated_params["k_drag_drs_off"] * 0.70

        calibrated_model = self.model_class(calibrated_params)
        return calibrated_model, calibrated_params

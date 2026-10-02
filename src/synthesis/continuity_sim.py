"""
Physics-constrained continuity simulation engine.
Generates the dynamically feasible composite lap with exact C^0 continuity across donor segments.
"""

from typing import Dict, Any, List
import numpy as np
import pandas as pd
from src.vehicle_model.base import BaseVehicleModel
from src.vehicle_model.forward_backward_solver import ForwardBackwardSolver


class ContinuitySimulator:
    """Simulates the achievable composite lap enforcing state continuity and physical bounds."""

    def __init__(self, vehicle_model: BaseVehicleModel, step_ds: float = 1.0):
        self.model = vehicle_model
        self.solver = ForwardBackwardSolver(vehicle_model, step_ds=step_ds)
        self.step_ds = step_ds

    def simulate_achievable_lap(
        self,
        df_d1: pd.DataFrame,
        df_d2: pd.DataFrame,
        segments_df: pd.DataFrame,
        driver1_name: str = "Driver1",
        driver2_name: str = "Driver2",
        baseline_time: float = 0.0,
        theoretical_time: float = 0.0,
    ) -> Dict[str, Any]:
        """
        Synthesize the achievable composite lap across segments.
        Transfers donor curvature and apex speed caps, but propagates dynamic state continuously.
        """
        s = df_d1["Distance"].values
        n = len(s)

        # Assemble donor caps and curvatures along the track
        v_donor_caps = np.zeros(n)
        curvatures = np.zeros(n)
        drs = np.zeros(n, dtype=int)
        donor_driver_tags = []

        for i in range(n):
            dist = s[i]
            # Find corresponding segment
            seg_match = segments_df[(segments_df["s_start"] <= dist) & (dist <= segments_df["s_end"])]
            if seg_match.empty:
                seg = segments_df.iloc[-1]
            else:
                seg = seg_match.iloc[0]

            winner = seg["winner"]
            donor_driver_tags.append(winner)

            if winner == driver1_name:
                v_donor_caps[i] = df_d1["Speed_mps"].iloc[i]
                curvatures[i] = df_d1["Curvature_kappa"].iloc[i] if "Curvature_kappa" in df_d1.columns else 0.0
                drs[i] = int(df_d1["DRS_active"].iloc[i])
            else:
                v_donor_caps[i] = df_d2["Speed_mps"].iloc[i]
                curvatures[i] = df_d2["Curvature_kappa"].iloc[i] if "Curvature_kappa" in df_d2.columns else 0.0
                drs[i] = int(df_d2["DRS_active"].iloc[i])

        # Initial speed at lap start
        v0 = v_donor_caps[0]

        # Solve continuous profile via forward-backward two-pass integration
        sim_result = self.solver.solve_lap(
            distances=s,
            curvatures=curvatures,
            drs_active=drs,
            v_initial=v0,
            v_donor_caps=v_donor_caps,
        )

        sim_result["Donor_Driver"] = donor_driver_tags
        sim_result["Donor_Speed_mps"] = v_donor_caps
        sim_result["Curvature_kappa"] = curvatures

        t_achievable = float(sim_result["Time_s"].iloc[-1])
        theoretical_gain = baseline_time - theoretical_time
        achievable_gain = baseline_time - t_achievable
        physics_gap = t_achievable - theoretical_time

        # Retained fraction eta
        if theoretical_gain > 1e-4:
            eta = achievable_gain / theoretical_gain
        else:
            eta = 0.0

        summary = {
            "t_baseline_s": baseline_time,
            "t_theoretical_s": theoretical_time,
            "t_achievable_s": t_achievable,
            "theoretical_gain_s": theoretical_gain,
            "achievable_gain_s": achievable_gain,
            "gap_s": physics_gap,
            "retained_fraction_eta": eta,
            "retained_percentage": round(eta * 100.0, 1),
            "model_used": self.model.name,
        }

        return {
            "summary": summary,
            "telemetry_df": sim_result,
        }

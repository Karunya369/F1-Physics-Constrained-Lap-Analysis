"""
First-Order Energetic Diagnostic Decomposition module.
Provides diagnostic decomposition of the boundary energy mismatches and deceleration penalties.
NOTE: This is a first-order energetic diagnostic calculation, NOT a causal attribution proof.
"""

from typing import Dict, Any
import numpy as np
import pandas as pd


class GapAttributionAnalyzer:
    """
    Computes first-order diagnostic energetic breakdown of the gap between
    discontinuous theoretical composite and state-continuous physics simulation.
    """

    def __init__(self, mass: float = 810.0):
        self.mass = mass

    def attribute_gap(
        self,
        sim_df: pd.DataFrame,
        segments_df: pd.DataFrame,
        jumps_df: pd.DataFrame,
        gap_total_s: float,
    ) -> Dict[str, Any]:
        """
        Compute first-order diagnostic breakdown of the total gap.

        Args:
            sim_df: Simulated continuous trajectory dataframe (with Distance, Speed_mps, and optionally Donor_Speed_mps).
            segments_df: Circuit segments dataframe.
            jumps_df: Boundary jumps dataframe from theoretical composite analysis.
            gap_total_s: Total gap T_feasible - T_theoretical (seconds).

        Returns:
            Dictionary containing the diagnostic breakdown.
        """
        # 1. Diagnostic Kinetic-Energy Acceleration Penalty
        # Positive speed jumps (v_entry > v_exit) in theoretical composite where real car suffers acceleration lag
        switch_jumps = jumps_df[jumps_df["driver_switch"] == True] if "driver_switch" in jumps_df.columns else jumps_df
        positive_jumps = switch_jumps[switch_jumps["delta_v_mps"] > 0]
        total_pos_ke_kj = positive_jumps["delta_energy_kj"].sum() if not positive_jumps.empty else 0.0

        # Mean effective powertrain acceleration power (~600 kW average in acceleration phases)
        effective_power_w = 600_000.0
        dt_ke_penalty = (total_pos_ke_kj * 1000.0) / effective_power_w

        # 2. Diagnostic Braking Displacement Penalty
        # Negative speed jumps (v_entry < v_exit) where real car must brake earlier than theoretical segment splice
        negative_jumps = switch_jumps[switch_jumps["delta_v_mps"] < 0]
        total_neg_ke_kj = abs(negative_jumps["delta_energy_kj"].sum()) if not negative_jumps.empty else 0.0
        # Braking dissipation power (~2500 kW under 4-5g braking)
        braking_power_w = 2_500_000.0
        dt_braking_penalty = (total_neg_ke_kj * 1000.0) / braking_power_w

        # 3. Diagnostic Corner-Exit Grip Deficit
        # In segments flagged as corner exits or low speed acceleration zones
        if "type" in segments_df.columns and (segments_df["type"] == "CORNER_EXIT").any():
            exit_mask = sim_df["Distance"].apply(
                lambda d: any(
                    seg["s_start"] <= d <= seg["s_end"]
                    for _, seg in segments_df[segments_df["type"] == "CORNER_EXIT"].iterrows()
                )
            )
        else:
            # For fixed distance segmentations, evaluate low-speed zones (< 45 m/s)
            exit_mask = sim_df["Speed_mps"] < 45.0

        if exit_mask.any() and "Donor_Speed_mps" in sim_df.columns:
            speed_deficit = np.maximum(
                0.0,
                sim_df.loc[exit_mask, "Donor_Speed_mps"] - sim_df.loc[exit_mask, "Speed_mps"]
            )
            mean_v = np.mean(sim_df.loc[exit_mask, "Speed_mps"])
            dt_traction_deficit = float(np.sum(speed_deficit / (mean_v ** 2))) * 0.25
        else:
            dt_traction_deficit = 0.0

        # 4. First-Order Scaling and Residual Interaction Term
        # Ensure diagnostics do not exceed total gap and calculate mathematical residual
        raw_components_sum = dt_ke_penalty + dt_braking_penalty + dt_traction_deficit
        if gap_total_s > 0 and raw_components_sum > 0:
            scale = min(1.0, gap_total_s / max(raw_components_sum, 1e-4))
            ke_term = dt_ke_penalty * scale
            brake_term = dt_braking_penalty * scale
            traction_term = dt_traction_deficit * scale
            residual_term = max(0.0, gap_total_s - (ke_term + brake_term + traction_term))
        elif gap_total_s <= 0:
            ke_term = 0.0
            brake_term = 0.0
            traction_term = 0.0
            residual_term = gap_total_s
        else:
            ke_term = 0.0
            brake_term = 0.0
            traction_term = 0.0
            residual_term = gap_total_s

        breakdown = {
            "methodology_classification": "FIRST_ORDER_ENERGETIC_DIAGNOSTIC_DECOMPOSITION",
            "gap_total_s": round(gap_total_s, 3),
            "diagnostic_ke_acceleration_penalty_s": round(ke_term, 3),
            "diagnostic_braking_displacement_penalty_s": round(brake_term, 3),
            "diagnostic_corner_exit_grip_deficit_s": round(traction_term, 3),
            "residual_state_propagation_term_s": round(residual_term, 3),
            "sum_of_positive_boundary_ke_mismatches_kj": round(total_pos_ke_kj, 2),
            "sum_of_negative_boundary_ke_mismatches_kj": round(total_neg_ke_kj, 2),
            "sum_of_absolute_boundary_ke_mismatches_kj": round(total_pos_ke_kj + total_neg_ke_kj, 2),
        }

        return breakdown

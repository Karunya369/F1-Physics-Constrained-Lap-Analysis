"""
Theoretical composite lap generator and boundary jump auditor.
Constructs the naive sector-stitching baseline and rigorously flags unphysical state jumps.
"""

from typing import List, Dict, Any, Tuple
import numpy as np
import pandas as pd


class TheoreticalCompositeAnalyzer:
    """Evaluates the naive theoretical composite lap and audits boundary state mismatches."""

    def __init__(self, mass: float = 810.0):
        self.mass = mass

    @staticmethod
    def compute_driver_baseline(df: pd.DataFrame, driver_name: str) -> Dict[str, Any]:
        """
        Compute baseline telemetry statistics for a single driver's lap.
        Uses spatially integrated time T = integral (1 / v) ds as the unified reference.
        """
        # Cross-version numpy trapezoidal integration
        trapz = getattr(np, "trapezoid", getattr(np, "trapz", None))
        t_integrated = float(trapz(1.0 / v, s))

        return {
            "driver": driver_name,
            "lap_time_s": t_integrated,
            "sample_count": len(df),
            "track_length_m": float(s[-1]),
            "v_min_mps": float(np.min(v)),
            "v_min_kmh": float(np.min(v) * 3.6),
            "v_max_mps": float(np.max(v)),
            "v_max_kmh": float(np.max(v) * 3.6),
            "v_mean_mps": float(np.mean(v)),
            "v_mean_kmh": float(np.mean(v) * 3.6),
        }

    def analyze_composite(
        self,
        df_d1: pd.DataFrame,
        df_d2: pd.DataFrame,
        segments: List[Dict[str, Any]],
        driver1_name: str = "Driver1",
        driver2_name: str = "Driver2",
    ) -> Dict[str, Any]:
        """
        Evaluate empirical segment times, select fastest candidates, and quantify boundary jumps.
        """
        segment_results = []
        theoretical_lap_time = 0.0

        for seg in segments:
            s_start = seg["s_start"]
            s_end = seg["s_end"]

            # Slice telemetry within segment
            mask1 = (df_d1["Distance"] >= s_start) & (df_d1["Distance"] <= s_end)
            mask2 = (df_d2["Distance"] >= s_start) & (df_d2["Distance"] <= s_end)

            sub1 = df_d1[mask1]
            sub2 = df_d2[mask2]

            # Calculate elapsed time via spatial integral: dt = integral ds / v
            v1 = sub1["Speed_mps"].values
            v2 = sub2["Speed_mps"].values
            s1 = sub1["Distance"].values
            s2 = sub2["Distance"].values

            if len(v1) == 0 or len(v2) == 0:
                continue

            trapz = getattr(np, "trapezoid", getattr(np, "trapz", None))
            dt1 = float(trapz(1.0 / v1, s1)) if len(v1) > 1 else (s_end - s_start) / max(1.0, float(v1[0]))
            dt2 = float(trapz(1.0 / v2, s2)) if len(v2) > 1 else (s_end - s_start) / max(1.0, float(v2[0]))

            # Determine donor
            if dt1 <= dt2:
                winner = driver1_name
                dt_win = dt1
                v_entry_win = float(v1[0])
                v_exit_win = float(v1[-1])
            else:
                winner = driver2_name
                dt_win = dt2
                v_entry_win = float(v2[0])
                v_exit_win = float(v2[-1])

            theoretical_lap_time += dt_win

            segment_results.append({
                "segment_id": seg["segment_id"],
                "name": seg.get("name", f"Segment_{seg['segment_id']:03d}"),
                "type": seg.get("type", "FIXED"),
                "s_start": s_start,
                "s_end": s_end,
                "length_m": s_end - s_start,
                "dt_d1": dt1,
                "dt_d2": dt2,
                "winner": winner,
                "dt_winner": dt_win,
                "delta_dt": abs(dt1 - dt2),
                "v_entry_winner": v_entry_win,
                "v_exit_winner": v_exit_win,
                "v_entry_d1": float(v1[0]) if len(v1) > 0 else 0.0,
                "v_exit_d1": float(v1[-1]) if len(v1) > 0 else 0.0,
                "v_entry_d2": float(v2[0]) if len(v2) > 0 else 0.0,
                "v_exit_d2": float(v2[-1]) if len(v2) > 0 else 0.0,
            })

        df_segs = pd.DataFrame(segment_results)

        # Audit boundary jumps between segment k and segment k+1
        boundary_jumps = []
        for i in range(len(df_segs) - 1):
            curr_seg = df_segs.iloc[i]
            next_seg = df_segs.iloc[i + 1]

            v_exit_curr = curr_seg["v_exit_winner"]
            v_entry_next = next_seg["v_entry_winner"]
            delta_v = v_entry_next - v_exit_curr
            delta_energy = 0.5 * self.mass * (v_entry_next**2 - v_exit_curr**2)
            driver_switch = curr_seg["winner"] != next_seg["winner"]

            boundary_jumps.append({
                "boundary_s": curr_seg["s_end"],
                "from_segment": curr_seg["name"],
                "to_segment": next_seg["name"],
                "driver_from": curr_seg["winner"],
                "driver_to": next_seg["winner"],
                "driver_switch": driver_switch,
                "v_exit": v_exit_curr,
                "v_entry": v_entry_next,
                "delta_v_mps": delta_v,
                "abs_delta_v_mps": abs(delta_v),
                "delta_v_kmh": delta_v * 3.6,
                "abs_delta_v_kmh": abs(delta_v) * 3.6,
                "delta_energy_kj": delta_energy / 1000.0,
                "abs_delta_energy_kj": abs(delta_energy) / 1000.0,
            })

        df_jumps = pd.DataFrame(boundary_jumps)

        # Ground truth total lap times
        trapz = getattr(np, "trapezoid", getattr(np, "trapz", None))
        t_d1_total = float(trapz(1.0 / df_d1["Speed_mps"].values, df_d1["Distance"].values))
        t_d2_total = float(trapz(1.0 / df_d2["Speed_mps"].values, df_d2["Distance"].values))
        t_best_single = min(t_d1_total, t_d2_total)

        gain_d1 = t_d1_total - theoretical_lap_time
        gain_d2 = t_d2_total - theoretical_lap_time
        theoretical_gain = t_best_single - theoretical_lap_time

        # Driver selection distribution
        d1_mask = df_segs["winner"] == driver1_name
        d2_mask = df_segs["winner"] == driver2_name

        d1_segs_count = int(d1_mask.sum())
        d2_segs_count = int(d2_mask.sum())

        d1_dist_m = float(df_segs.loc[d1_mask, "length_m"].sum())
        d2_dist_m = float(df_segs.loc[d2_mask, "length_m"].sum())
        total_dist_m = d1_dist_m + d2_dist_m

        d1_pct = (d1_dist_m / total_dist_m) * 100.0 if total_dist_m > 0 else 0.0
        d2_pct = (d2_dist_m / total_dist_m) * 100.0 if total_dist_m > 0 else 0.0

        # Switch statistics (transitions between different drivers)
        switches = df_jumps[df_jumps["driver_switch"] == True]
        max_jump_mps = float(switches["abs_delta_v_mps"].max()) if not switches.empty else 0.0
        mean_jump_mps = float(switches["abs_delta_v_mps"].mean()) if not switches.empty else 0.0
        max_jump_kmh = float(max_jump_mps * 3.6)
        mean_jump_kmh = float(mean_jump_mps * 3.6)

        max_energy_jump_kj = float(switches["abs_delta_energy_kj"].max()) if not switches.empty else 0.0
        mean_energy_jump_kj = float(switches["abs_delta_energy_kj"].mean()) if not switches.empty else 0.0
        total_energy_discontinuity_kj = float(switches["abs_delta_energy_kj"].sum()) if not switches.empty else 0.0

        summary = {
            "driver1": driver1_name,
            "driver2": driver2_name,
            "t_driver1": t_d1_total,
            "t_driver2": t_d2_total,
            "t_best_single": t_best_single,
            "t_theoretical": theoretical_lap_time,
            "theoretical_gain_s": theoretical_gain,
            "gain_vs_d1_s": gain_d1,
            "gain_vs_d2_s": gain_d2,
            "pct_gain_vs_d1": (gain_d1 / t_d1_total) * 100.0,
            "pct_gain_vs_d2": (gain_d2 / t_d2_total) * 100.0,
            "total_segments": len(df_segs),
            "d1_segments_count": d1_segs_count,
            "d2_segments_count": d2_segs_count,
            "d1_distance_m": d1_dist_m,
            "d2_distance_m": d2_dist_m,
            "d1_pct_distance": d1_pct,
            "d2_pct_distance": d2_pct,
            "driver_switch_count": int(switches.shape[0]),
            "max_abs_delta_v_mps": max_jump_mps,
            "mean_abs_delta_v_mps": mean_jump_mps,
            "max_abs_delta_v_kmh": max_jump_kmh,
            "mean_abs_delta_v_kmh": mean_jump_kmh,
            "max_abs_delta_energy_kj": max_energy_jump_kj,
            "mean_abs_delta_energy_kj": mean_energy_jump_kj,
            "total_abs_energy_jump_kj": total_energy_discontinuity_kj,
        }

        return {
            "summary": summary,
            "segments_df": df_segs,
            "jumps_df": df_jumps,
        }


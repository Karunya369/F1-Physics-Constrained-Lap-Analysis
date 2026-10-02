"""
Circuit segmentation module.
Implements both the primary hybrid corner-phase segmentation and fixed-distance mini-sectors.
"""

from typing import List, Dict, Any, Optional
import numpy as np
import pandas as pd
from scipy.signal import find_peaks


class CircuitSegmenter:
    """Partitions a circuit into discrete, physically meaningful segments."""

    def __init__(self, step_ds: float = 1.0):
        self.step_ds = step_ds

    def segment_by_fixed_distance(
        self, total_distance: float, segment_length_m: float = 100.0
    ) -> List[Dict[str, Any]]:
        """
        Partition circuit into equal fixed-length mini-sectors.

        Coverage guarantee: the final sector is always clipped to total_distance
        so that covered distance == total_distance exactly.
        """
        segments = []
        s_current = 0.0
        seg_idx = 0

        while s_current < total_distance:
            s_next = min(s_current + segment_length_m, total_distance)
            segments.append({
                "segment_id": seg_idx,
                "name": f"MiniSector_{seg_idx:02d}",
                "type": "FIXED_MINISECTOR",
                "s_start": s_current,
                "s_end": s_next,
                "length_m": s_next - s_current,
            })
            s_current = s_next
            seg_idx += 1

        return segments

    def segment_by_hybrid_corners(
        self,
        df_geometry: pd.DataFrame,
        circuit_info: Optional[Any] = None,
        min_corner_curvature: float = 0.003,
    ) -> List[Dict[str, Any]]:
        """
        Hybrid segmentation: Decomposes circuit into Straights and Corner Complexes
        (Entry, Apex, Exit).

        Coverage guarantee
        ------------------
        Returns a list that starts at s=0.0 and ends at s=total_distance with
        no gaps and no overlaps between consecutive segments.  Achieved by:

        1.  Pre-corner straight segments fill any uncovered gap before a corner entry.
        2.  Corner zone starts are clipped to max(zone_start, current_s) to prevent
            overlapping the previous segment.
        3.  A Tail_Straight is appended after the last corner if any distance remains.
        4.  Segments shorter than 2 m are merged into their predecessor rather than
            dropped -- dropping them would introduce coverage gaps.

        Scientific note: this scheme exploits causal coupling between corner phases.
        Use segment_by_fixed_distance for the primary analysis.
        """
        s = df_geometry["Distance"].values
        total_distance = float(s[-1])
        if "Abs_Curvature" in df_geometry.columns:
            abs_kappa = df_geometry["Abs_Curvature"].values
        elif "Curvature_kappa" in df_geometry.columns:
            abs_kappa = np.abs(df_geometry["Curvature_kappa"].values)
        else:
            abs_kappa = np.zeros_like(s)

        apex_distances: list = []
        if circuit_info is not None and hasattr(circuit_info, "corners"):
            corners_df = circuit_info.corners
            if not corners_df.empty and "Distance" in corners_df.columns:
                apex_distances = sorted(corners_df["Distance"].tolist())

        if len(apex_distances) == 0:
            peaks, _ = find_peaks(
                abs_kappa,
                height=min_corner_curvature,
                distance=int(80 / self.step_ds),
            )
            apex_distances = sorted(s[peaks].tolist())

        corner_zones = []
        for i, s_apex in enumerate(apex_distances):
            corner_zones.append({
                "corner_idx": i + 1,
                "s_apex": s_apex,
                "entry": (max(0.0, s_apex - 70.0), max(0.0, s_apex - 15.0)),
                "apex":  (max(0.0, s_apex - 15.0),  min(total_distance, s_apex + 20.0)),
                "exit":  (min(total_distance, s_apex + 20.0), min(total_distance, s_apex + 70.0)),
            })

        segments: List[Dict[str, Any]] = []
        current_s = 0.0
        seg_id = 0

        for cz in corner_zones:
            c_num = cz["corner_idx"]
            entry_start, entry_end = cz["entry"]
            _apex_start, apex_end  = cz["apex"]
            _exit_start,  exit_end  = cz["exit"]

            clipped_entry_start = max(entry_start, current_s)
            clipped_entry_end   = max(entry_end,   current_s)
            clipped_apex_end    = max(apex_end,    current_s)
            clipped_exit_end    = max(exit_end,    current_s)

            if clipped_entry_start > current_s + 1e-3:
                segments.append({
                    "segment_id": seg_id, "name": f"Straight_before_T{c_num}",
                    "type": "STRAIGHT",
                    "s_start": current_s, "s_end": clipped_entry_start,
                    "length_m": clipped_entry_start - current_s,
                })
                seg_id += 1
                current_s = clipped_entry_start

            if clipped_entry_end > current_s + 1e-3:
                segments.append({
                    "segment_id": seg_id, "name": f"T{c_num}_Entry",
                    "type": "CORNER_ENTRY",
                    "s_start": current_s, "s_end": clipped_entry_end,
                    "length_m": clipped_entry_end - current_s,
                })
                seg_id += 1
                current_s = clipped_entry_end

            if clipped_apex_end > current_s + 1e-3:
                segments.append({
                    "segment_id": seg_id, "name": f"T{c_num}_Apex",
                    "type": "CORNER_APEX",
                    "s_start": current_s, "s_end": clipped_apex_end,
                    "length_m": clipped_apex_end - current_s,
                })
                seg_id += 1
                current_s = clipped_apex_end

            if clipped_exit_end > current_s + 1e-3:
                segments.append({
                    "segment_id": seg_id, "name": f"T{c_num}_Exit",
                    "type": "CORNER_EXIT",
                    "s_start": current_s, "s_end": clipped_exit_end,
                    "length_m": clipped_exit_end - current_s,
                })
                seg_id += 1
                current_s = clipped_exit_end

        if total_distance - current_s > 1e-3:
            segments.append({
                "segment_id": seg_id, "name": "Tail_Straight",
                "type": "STRAIGHT",
                "s_start": current_s, "s_end": total_distance,
                "length_m": total_distance - current_s,
            })

        MIN_LEN = 2.0
        merged: List[Dict[str, Any]] = []
        for seg in segments:
            if seg["length_m"] < MIN_LEN and merged:
                prev = merged[-1]
                prev["s_end"] = seg["s_end"]
                prev["length_m"] = prev["s_end"] - prev["s_start"]
            else:
                merged.append(seg)

        for i, seg in enumerate(merged):
            seg["segment_id"] = i

        return merged

    @staticmethod
    def validate_coverage(
        segments: List[Dict[str, Any]],
        total_distance: float,
        tolerance_m: float = 1e-3,
    ) -> dict:
        """
        Verify that segments cover [0, total_distance] exactly once.

        Returns a dict with:
            ok                   - True if all checks pass
            covered_distance_m   - sum of all segment lengths
            uncovered_distance_m - |total_distance - covered| (target: 0.0)
            n_gaps               - count of inter-segment gaps > tolerance
            n_overlaps           - count of inter-segment overlaps > tolerance
            max_gap_m            - largest gap in metres (target: 0.0)
            max_overlap_m        - largest overlap in metres (target: 0.0)
            starts_at_zero       - True if first segment begins at 0.0
            ends_at_total        - True if last segment ends at total_distance
        """
        if not segments:
            return {"ok": False, "error": "Empty segment list"}

        covered = sum(seg["length_m"] for seg in segments)
        gaps, overlaps = [], []
        for i in range(len(segments) - 1):
            gap = segments[i + 1]["s_start"] - segments[i]["s_end"]
            if gap > tolerance_m:
                gaps.append(gap)
            elif gap < -tolerance_m:
                overlaps.append(-gap)

        starts_at_zero = abs(segments[0]["s_start"]) <= tolerance_m
        ends_at_total  = abs(segments[-1]["s_end"] - total_distance) <= tolerance_m
        ok = (len(gaps) == 0 and len(overlaps) == 0
              and starts_at_zero and ends_at_total)

        return {
            "ok": ok,
            "covered_distance_m":   round(covered, 4),
            "uncovered_distance_m": round(abs(total_distance - covered), 4),
            "n_gaps":               len(gaps),
            "n_overlaps":           len(overlaps),
            "max_gap_m":            round(max(gaps), 4) if gaps else 0.0,
            "max_overlap_m":        round(max(overlaps), 4) if overlaps else 0.0,
            "starts_at_zero":       starts_at_zero,
            "ends_at_total":        ends_at_total,
        }

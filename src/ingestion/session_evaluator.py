"""
Automated session evaluation against objective criteria for MVP dataset selection.
"""

from typing import List, Dict, Any
import numpy as np
import pandas as pd
from fastf1.core import Session
from src.ingestion.fetcher import FastF1Fetcher
from src.ingestion.lap_curator import LapCurator


class SessionEvaluator:
    """Evaluates candidate Grand Prix qualifying sessions against objective criteria."""

    def __init__(self, fetcher: FastF1Fetcher):
        self.fetcher = fetcher

    def evaluate_candidate(
        self, year: int, race: str, driver1: str, driver2: str
    ) -> Dict[str, Any]:
        """
        Evaluate a candidate session for a specific teammate pair.
        """
        print(f"Evaluating: {year} {race} | {driver1} vs {driver2}...")
        try:
            session = self.fetcher.get_session(year, race, "Q", load_telemetry=True)
        except Exception as e:
            return {
                "year": year,
                "race": race,
                "driver1": driver1,
                "driver2": driver2,
                "status": "FAILED_LOAD",
                "error": str(e),
                "score": -1.0,
            }

        # Check weather conditions
        weather = session.weather_data
        dry_session = True
        temp_stability = 1.0  # Normalized score
        if weather is not None and not weather.empty:
            rainfall = weather["Rainfall"].any()
            if rainfall:
                dry_session = False
            track_temp_std = weather["TrackTemp"].std()
            temp_stability = max(0.0, 1.0 - (track_temp_std / 5.0))
        else:
            rainfall = False

        # Check laps
        try:
            lap1, lap2, meta = LapCurator.get_fastest_teammate_laps(session, driver1, driver2)
        except Exception as e:
            return {
                "year": year,
                "race": race,
                "driver1": driver1,
                "driver2": driver2,
                "status": "FAILED_LAPS",
                "error": str(e),
                "score": -1.0,
            }

        # Check telemetry channels and sampling regularity
        try:
            tel1 = LapCurator.extract_raw_telemetry(lap1)
            tel2 = LapCurator.extract_raw_telemetry(lap2)
        except Exception as e:
            return {
                "year": year,
                "race": race,
                "driver1": driver1,
                "driver2": driver2,
                "status": "FAILED_TELEMETRY",
                "error": str(e),
                "score": -1.0,
            }

        # Calculate telemetry dropouts (gaps > 0.2s)
        dt1 = np.diff(tel1["Time_s"].values)
        dt2 = np.diff(tel2["Time_s"].values)
        max_dropout1 = float(np.max(dt1)) if len(dt1) > 0 else 0.0
        max_dropout2 = float(np.max(dt2)) if len(dt2) > 0 else 0.0
        dropouts_clean = (max_dropout1 <= 0.25) and (max_dropout2 <= 0.25)

        # Delta time proximity check (ideal is between 0.05s and 0.35s)
        delta_t = meta["time_delta"]
        if 0.05 <= delta_t <= 0.35:
            proximity_score = 1.0
        elif delta_t < 0.05:
            proximity_score = 0.9  # very close, acceptable
        elif delta_t <= 0.60:
            proximity_score = max(0.0, 1.0 - (delta_t - 0.35) / 0.5)
        else:
            proximity_score = 0.2

        # Compound parity check
        compound_ok = meta["compound_match"]

        # Composite score
        # 40% proximity, 30% telemetry health, 20% weather stability, 10% compound match
        tel_score = 1.0 if dropouts_clean else 0.5
        weather_score = 1.0 if dry_session else 0.0
        compound_score = 1.0 if compound_ok else 0.0

        overall_score = (
            0.40 * proximity_score
            + 0.30 * tel_score
            + 0.20 * (weather_score * temp_stability)
            + 0.10 * compound_score
        )

        return {
            "year": year,
            "race": race,
            "driver1": driver1,
            "driver2": driver2,
            "status": "VALID",
            "score": round(overall_score, 3),
            "lap_time_d1": round(meta["lap_time_d1"], 3),
            "lap_time_d2": round(meta["lap_time_d2"], 3),
            "time_delta_s": round(delta_t, 3),
            "compound_d1": meta["compound_d1"],
            "compound_d2": meta["compound_d2"],
            "dry": dry_session,
            "max_telemetry_gap_s": round(max(max_dropout1, max_dropout2), 3),
        }

    def rank_candidates(self, candidates: List[Dict[str, Any]]) -> pd.DataFrame:
        """Evaluate and rank all candidates in descending order of quality score."""
        results = []
        for c in candidates:
            res = self.evaluate_candidate(c["year"], c["race"], c["driver1"], c["driver2"])
            results.append(res)
        df = pd.DataFrame(results).sort_values(by="score", ascending=False).reset_index(drop=True)
        return df

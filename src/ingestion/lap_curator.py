"""
Lap selection, validation, and curation for clean teammate comparison.
"""

from typing import Tuple, Dict, Any
import pandas as pd
import numpy as np
from fastf1.core import Session, Lap


class LapCurator:
    """Selects and audits clean, competitive flying laps for teammate comparisons."""

    @staticmethod
    def get_clean_q3_flying_laps(session: Session, driver: str) -> pd.DataFrame:
        """
        Filter session for clean flying laps belonging to the driver.
        Prefers Q3 / final qualifying segment with fresh soft tyres.
        """
        driver_laps = session.laps.pick_drivers(driver)
        if driver_laps.empty:
            raise ValueError(f"No laps found for driver {driver} in session {session.event['EventName']}.")

        # Filter for valid, non-in/out laps
        clean = driver_laps.pick_quicklaps()
        clean = clean[clean["IsAccurate"] == True]
        
        # Check deleted lap times (track limits) if available
        if "Deleted" in clean.columns:
            clean = clean[clean["Deleted"] == False]

        if clean.empty:
            # Fallback to quicklaps if IsAccurate filter is too strict in some sessions
            clean = driver_laps.pick_quicklaps()

        return clean

    @classmethod
    def get_fastest_teammate_laps(
        cls, session: Session, driver1: str, driver2: str
    ) -> Tuple[Lap, Lap, Dict[str, Any]]:
        """
        Extract the fastest valid flying lap for each teammate and audit comparability.
        """
        laps_d1 = cls.get_clean_q3_flying_laps(session, driver1)
        laps_d2 = cls.get_clean_q3_flying_laps(session, driver2)

        fastest_d1 = laps_d1.pick_fastest()
        fastest_d2 = laps_d2.pick_fastest()

        t1 = fastest_d1["LapTime"].total_seconds()
        t2 = fastest_d2["LapTime"].total_seconds()

        # Audit conditions
        compound_match = fastest_d1.get("Compound") == fastest_d2.get("Compound")
        time_delta = abs(t1 - t2)

        event_date = session.event.get("EventDate")
        year = event_date.year if event_date is not None else 2023

        metadata = {
            "driver1": driver1,
            "driver2": driver2,
            "lap_time_d1": t1,
            "lap_time_d2": t2,
            "time_delta": time_delta,
            "compound_d1": fastest_d1.get("Compound", "UNKNOWN"),
            "compound_d2": fastest_d2.get("Compound", "UNKNOWN"),
            "compound_match": compound_match,
            "session_name": session.event.get("EventName", "Unknown"),
            "session_year": year,
        }

        return fastest_d1, fastest_d2, metadata

    @staticmethod
    def extract_raw_telemetry(lap: Lap) -> pd.DataFrame:
        """
        Extract essential telemetry channels from a lap and perform initial sanity checks.
        """
        telemetry = lap.get_telemetry()
        
        required_cols = ["Distance", "Time", "Speed", "Throttle", "Brake", "DRS", "X", "Y"]
        for col in required_cols:
            if col not in telemetry.columns:
                raise KeyError(f"Critical telemetry column '{col}' missing from lap.")

        # Clean dataframe
        df = telemetry[required_cols].copy()
        
        # Convert Time timedelta to elapsed seconds from lap start
        if pd.api.types.is_timedelta64_dtype(df["Time"]):
            df["Time_s"] = (df["Time"] - df["Time"].iloc[0]).dt.total_seconds()
        else:
            df["Time_s"] = df["Time"]

        # Convert speed from km/h to m/s
        df["Speed_mps"] = df["Speed"] / 3.6
        
        # Ensure DRS is integer 0/1 (FastF1 uses various integer flags, 8, 10, 12, 14 mean DRS active)
        if "DRS" in df.columns:
            # In FastF1: 10, 12, 14 indicates DRS on; 0, 1, 8 indicates off/available
            df["DRS_active"] = df["DRS"].apply(lambda x: 1 if x in [10, 12, 14] else 0)
        else:
            df["DRS_active"] = 0

        # Convert coordinates from FastF1 decimeters (0.1m) to SI meters
        df["X"] = df["X"] / 10.0
        df["Y"] = df["Y"] / 10.0

        # Drop any nulls
        df = df.dropna().sort_values(by="Distance").reset_index(drop=True)
        
        return df

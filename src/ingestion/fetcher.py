"""
FastF1 session retrieval and caching layer.
"""

from typing import Optional
import fastf1
from fastf1.core import Session
from src.config import CACHE_DIR


class FastF1Fetcher:
    """Wrapper around FastF1 API with persistent local disk caching."""

    def __init__(self, cache_dir: Optional[str] = None):
        target_cache = str(cache_dir) if cache_dir else str(CACHE_DIR)
        fastf1.Cache.enable_cache(target_cache)

    def get_session(self, year: int, race: str | int, session_type: str = "Q", load_telemetry: bool = True) -> Session:
        """
        Load a specific session (default Qualifying).

        Args:
            year: Championship year (e.g. 2023)
            race: Circuit/Grand Prix name or round number (e.g. 'Bahrain' or 1)
            session_type: 'Q' (Qualifying), 'FP1', 'R', etc.
            load_telemetry: If True, loads laps and telemetry data.

        Returns:
            fastf1.core.Session object.
        """
        session = fastf1.get_session(year, race, session_type)
        if load_telemetry:
            # Load telemetry, weather, and lap data
            session.load(telemetry=True, weather=True, laps=True)
        return session

    def get_circuit_info(self, session: Session):
        """Retrieve circuit metadata including corner positions and DRS zones."""
        try:
            return session.get_circuit_info()
        except Exception as e:
            print(f"Warning: Could not extract circuit info: {e}")
            return None

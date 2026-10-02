import sys
from pathlib import Path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from src.ingestion.fetcher import FastF1Fetcher
from src.ingestion.lap_curator import LapCurator

fetcher = FastF1Fetcher()
session = fetcher.get_session(2023, "Bahrain", "Q")

print("Session loaded successfully:", session.event["EventName"])

try:
    laps_ver = LapCurator.get_clean_q3_flying_laps(session, "VER")
    print(f"VER laps count: {len(laps_ver)}")
    fastest_ver = laps_ver.pick_fastest()
    print("VER fastest lap:", fastest_ver["LapTime"], "Compound:", fastest_ver["Compound"])
except Exception as e:
    print("Error fetching VER laps:", e)

try:
    laps_per = LapCurator.get_clean_q3_flying_laps(session, "PER")
    print(f"PER laps count: {len(laps_per)}")
    fastest_per = laps_per.pick_fastest()
    print("PER fastest lap:", fastest_per["LapTime"], "Compound:", fastest_per["Compound"])
except Exception as e:
    print("Error fetching PER laps:", e)

try:
    lap_ver, lap_per, meta = LapCurator.get_fastest_teammate_laps(session, "VER", "PER")
    print("Metadata:", meta)
    
    tel_ver = LapCurator.extract_raw_telemetry(lap_ver)
    tel_per = LapCurator.extract_raw_telemetry(lap_per)
    print(f"VER telemetry rows: {len(tel_ver)}, dist max: {tel_ver['Distance'].max()}")
    print(f"PER telemetry rows: {len(tel_per)}, dist max: {tel_per['Distance'].max()}")
except Exception as e:
    print("Error in teammate laps extraction:", e)

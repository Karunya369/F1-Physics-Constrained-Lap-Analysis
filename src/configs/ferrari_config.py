"""
Configuration for Scuderia Ferrari SF-23 analysis (Leclerc vs. Sainz, 2023 Bahrain Q3).
"""

from pathlib import Path
from src.config import PROJECT_ROOT, PARAM_BOUNDS, DEFAULT_PARAMS, VALIDATION_THRESHOLDS

TEAM_NAME = "Scuderia Ferrari"
CAR_NAME = "Ferrari SF-23"
YEAR = 2023
RACE = "Bahrain"
SESSION_TYPE = "Q"

DRIVER_1_CODE = "LEC"
DRIVER_1_NAME = "Leclerc"
DRIVER_2_CODE = "SAI"
DRIVER_2_NAME = "Sainz"

PRIMARY_COLOR_D1 = "#C83E36"  # Ferrari Racing Red
PRIMARY_COLOR_D2 = "#D97706"  # Amber / Gold

# Calibrated parameters under Policy A (mu_x = 1.700 locked)
CALIBRATED_PARAMS = {
    "mass": 810.0,
    "power_max": 740_000.0,
    "k_drag_drs_off": 1.2500,
    "k_drag_drs_on": 0.8750,
    "k_down": 2.6185,
    "mu_x": 1.7000,
    "mu_y": 1.9500,
    "mu_brake": 2.00,
    "f_rr": 120.0,
}

OUTPUT_PROCESSED_DIR = PROJECT_ROOT / "data" / "processed"
OUTPUT_PLOTS_DIR = PROJECT_ROOT / "outputs" / "plots"

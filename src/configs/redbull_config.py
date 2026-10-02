"""
Configuration for Red Bull Racing RB19 analysis (Verstappen vs. Perez, 2023 Bahrain Q3).
"""

from pathlib import Path
from src.config import PROJECT_ROOT, PARAM_BOUNDS, DEFAULT_PARAMS, VALIDATION_THRESHOLDS

TEAM_NAME = "Red Bull Racing"
CAR_NAME = "Red Bull RB19"
YEAR = 2023
RACE = "Bahrain"
SESSION_TYPE = "Q"

DRIVER_1_CODE = "VER"
DRIVER_1_NAME = "Verstappen"
DRIVER_2_CODE = "PER"
DRIVER_2_NAME = "Perez"

PRIMARY_COLOR_D1 = "#1E41FF"  # Red Bull Navy / Royal Blue
PRIMARY_COLOR_D2 = "#FF1801"  # Bull Red / Yellow Accent

# Independent calibration targets and directories
OUTPUT_PROCESSED_DIR = PROJECT_ROOT / "data" / "processed" / "redbull"
OUTPUT_PLOTS_DIR = PROJECT_ROOT / "outputs" / "plots" / "redbull"

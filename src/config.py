"""
Configuration and constants for the F1 physics-constrained lap analysis project.
All physical constants, literature-backed parameter bounds, validation thresholds,
and file path definitions are centralized here.
"""

from pathlib import Path

# Base Paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data"
CACHE_DIR = DATA_DIR / "cache"
PROCESSED_DIR = DATA_DIR / "processed"
OUTPUTS_DIR = PROJECT_ROOT / "outputs"
PLOTS_DIR = OUTPUTS_DIR / "plots"

# Ensure essential directories exist
CACHE_DIR.mkdir(parents=True, exist_ok=True)
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
PLOTS_DIR.mkdir(parents=True, exist_ok=True)

# Physical Constants
GRAVITY: float = 9.80665  # m/s^2
AIR_DENSITY_STANDARD: float = 1.225  # kg/m^3 (sea level, 15°C)

# FIA Regulation & Benchmark Literature Parameters (Modern Ground-Effect F1 Era: 2022+)
VEHICLE_MASS_NOMINAL: float = 810.0  # kg (798 kg minimum dry car + ~12 kg fuel & ballast)
ROLLING_RESISTANCE_COEFF: float = 0.015  # Dimensionless

# Literature-Constrained Parameter Search Bounds
PARAM_BOUNDS = {
    "mass": (798.0, 830.0),                     # kg
    "power_max": (700_000.0, 770_000.0),         # Watts (700 - 770 kW, approx 950 - 1050 hp)
    "k_drag_drs_off": (0.80, 1.25),             # N*s^2/m^2 (0.5 * rho * C_D * A)
    "k_drag_drs_on": (0.55, 0.85),              # N*s^2/m^2 (~25-35% drag reduction with DRS)
    "k_down": (2.20, 4.20),                     # N*s^2/m^2 (0.5 * rho * C_L * A)
    "mu_x": (1.35, 1.85),                       # Longitudinal peak friction
    "mu_y": (1.45, 1.95),                       # Lateral peak friction
    "mu_brake": (1.60, 2.20),                   # Longitudinal braking friction
    "aero_lift_drag_ratio": (2.6, 3.6),         # L/D aerodynamic efficiency ratio
}

# Default Nominal Benchmark Parameters (for baseline point-mass models)
# All values must lie within PARAM_BOUNDS to ensure the calibration optimizer
# starts from a feasible point. If a default lies outside its declared bound,
# Nelder-Mead will start from an infeasible region and produce unpredictable results.
DEFAULT_PARAMS = {
    "mass": VEHICLE_MASS_NOMINAL,
    "power_max": 740_000.0,                     # ~1000 hp modern hybrid
    "k_drag_drs_off": 1.15,
    "k_drag_drs_on": 1.01,
    "k_down": 3.20,
    # mu_x = 1.700: Policy A fixed literature value for modern F1 qualifying slicks
    # on high-macrotexture asphalt (Milliken & Milliken). Not treated as an optimization variable.
    "mu_x": 1.700,
    "mu_y": 1.85,
    # mu_brake = 2.00: mid-range within PARAM_BOUNDS mu_brake = (1.60, 2.20).
    # Literature: peak longitudinal braking friction on modern F1 compounds is
    # typically 1.7-2.0 at representative downforce levels (Milliken & Milliken, 2002).
    # Previous default of 2.30 was outside the declared upper bound of 2.20.
    "mu_brake": 2.00,
    "f_rr": 120.0,
}

# Discretization Resolution
SPATIAL_STEP_DS: float = 1.0  # meters

# Validation Standards (Objective acceptance & failure thresholds)
VALIDATION_THRESHOLDS = {
    "lap_time_error_target": 1.50,      # seconds (~1.5% of lap)
    "lap_time_error_inadequate": 3.50,  # seconds (~3.8% of lap)
    "velocity_rmse_target": 3.0,        # m/s (~4.5% of mean speed)
    "velocity_rmse_inadequate": 5.0,    # m/s
    "braking_offset_target": 5.0,       # meters
    "braking_offset_inadequate": 12.0,  # meters
    "apex_speed_error_target": 2.5,     # m/s
    "top_speed_error_target": 1.5,      # m/s
}

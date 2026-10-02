import sys
from pathlib import Path
PROJECT_ROOT = Path(r"c:\Users\pamar\OneDrive\Documents\Desktop\F1-Physics-Constrained-Lap-Analysis")
sys.path.insert(0, str(PROJECT_ROOT))

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from src.ingestion.fetcher import FastF1Fetcher
from src.ingestion.lap_curator import LapCurator
from src.preprocessing.spatial_resampler import SpatialResampler
from src.preprocessing.geometry import TrajectoryGeometry
from src.preprocessing.segmentation import CircuitSegmenter
from src.vehicle_model.level2_coupled import Level2CoupledModel
from src.vehicle_model.forward_backward_solver import ForwardBackwardSolver
from src.vehicle_model.calibrator import ModelCalibrator, ModelValidator
from src.config import DEFAULT_PARAMS, GRAVITY

# --- 1. Load telemetry & run Level 2 calibration and simulation ---
fetcher = FastF1Fetcher()
session = fetcher.get_session(2023, "Bahrain", "Q")
circuit_info = fetcher.get_circuit_info(session)

lap_lec, lap_sai, meta = LapCurator.get_fastest_teammate_laps(session, "LEC", "SAI")
raw_lec = LapCurator.extract_raw_telemetry(lap_lec)
raw_sai = LapCurator.extract_raw_telemetry(lap_sai)

resampler = SpatialResampler(step_ds=1.0)
df_lec, df_sai = SpatialResampler.align_teammates(
    resampler.resample_lap(raw_lec),
    resampler.resample_lap(raw_sai),
    step_ds=1.0
)

geom = TrajectoryGeometry(step_ds=1.0)
df_lec = geom.compute_geometry(df_lec)
df_sai = geom.compute_geometry(df_sai)

# Unify Time_s to spatial integration
dt_lec = np.zeros(len(df_lec))
dt_lec[1:] = 1.0 / (0.5 * (df_lec["Speed_mps"].values[:-1] + df_lec["Speed_mps"].values[1:]))
df_lec["Time_s"] = np.cumsum(dt_lec)

dt_sai = np.zeros(len(df_sai))
dt_sai[1:] = 1.0 / (0.5 * (df_sai["Speed_mps"].values[:-1] + df_sai["Speed_mps"].values[1:]))
df_sai["Time_s"] = np.cumsum(dt_sai)

s = df_lec["Distance"].values
curv_lec = df_lec["Curvature_kappa"].values
drs_lec = df_lec["DRS_active"].values
v_init_lec = float(df_lec["Speed_mps"].iloc[0])

curv_sai = df_sai["Curvature_kappa"].values
drs_sai = df_sai["DRS_active"].values
v_init_sai = float(df_sai["Speed_mps"].iloc[0])

# Calibrate Level 2 on LEC
calibrator = ModelCalibrator(Level2CoupledModel)
calibrated_model, cal_params = calibrator.calibrate(df_lec, max_iters=25)
print("=== CALIBRATED LEVEL 2 PARAMETERS (from LEC) ===")
for k, v in cal_params.items():
    print(f"  {k}: {v}")

# Solve unconstrained laps
solver = ForwardBackwardSolver(calibrated_model, step_ds=1.0)
sim_lec = solver.solve_lap(s, curv_lec, drs_lec, v_initial=v_init_lec)
sim_sai = solver.solve_lap(s, curv_sai, drs_sai, v_initial=v_init_sai)

# --- 2. Speed-Profile Error Analysis ---
print("\n=== SPEED PROFILE ERROR ANALYSIS ===")
segmenter = CircuitSegmenter(step_ds=1.0)
segments = segmenter.segment_by_hybrid_corners(df_lec, circuit_info=circuit_info)

for driver_name, df_ref, df_sim in [("LEC", df_lec, sim_lec), ("SAI", df_sai, sim_sai)]:
    v_ref = df_ref["Speed_mps"].values
    v_sim = df_sim["Speed_mps"].values
    err = v_sim - v_ref
    abs_err = np.abs(err)

    rmse = np.sqrt(np.mean(err ** 2))
    mae = np.mean(abs_err)
    max_err = np.max(abs_err)
    max_idx = np.argmax(abs_err)
    max_s = s[max_idx]

    print(f"\nDriver {driver_name}:")
    print(f"  Max Absolute Speed Error: {max_err:.3f} m/s ({max_err*3.6:.2f} km/h) at s = {max_s:.1f} m")
    print(f"  Mean Absolute Speed Error: {mae:.3f} m/s ({mae*3.6:.2f} km/h)")
    print(f"  Velocity RMSE: {rmse:.3f} m/s ({rmse*3.6:.2f} km/h)")

    # Find top 5 error peaks (at least 50m apart)
    sorted_indices = np.argsort(-abs_err)
    top_peaks = []
    for idx in sorted_indices:
        s_pos = s[idx]
        if all(abs(s_pos - p[0]) > 50.0 for p in top_peaks):
            top_peaks.append((s_pos, abs_err[idx], err[idx], v_ref[idx], v_sim[idx]))
            if len(top_peaks) >= 5:
                break
    print(f"  Top 5 Discrepancy Peaks:")
    for p in top_peaks:
        print(f"    s={p[0]:6.1f}m: |err|={p[1]:5.2f} m/s (sim={p[4]*3.6:5.1f} km/h, ref={p[3]*3.6:5.1f} km/h, diff={p[2]:+5.2f} m/s)")

    # Break down error by segment type
    seg_errors = {"STRAIGHT": [], "ENTRY": [], "APEX": [], "EXIT": []}
    for seg in segments:
        m = (s >= seg["s_start"]) & (s <= seg["s_end"])
        if np.any(m):
            stype = seg["type"]
            matched_key = None
            for k in seg_errors:
                if k in stype:
                    matched_key = k
                    break
            if matched_key:
                seg_errors[matched_key].extend(abs_err[m])

    print("  Mean Absolute Error by Segment Type:")
    for stype, errs in seg_errors.items():
        if errs:
            print(f"    {stype:8s}: {np.mean(errs):.3f} m/s (RMSE: {np.sqrt(np.mean(np.array(errs)**2)):.3f} m/s, n={len(errs)})")

# --- 3. Periodicity Analysis ---
print("\n=== PERIODICITY ANALYSIS ===")
for driver_name, df_ref, df_sim in [("LEC", df_lec, sim_lec), ("SAI", df_sai, sim_sai)]:
    v_sim_start = df_sim["Speed_mps"].iloc[0]
    v_sim_end = df_sim["Speed_mps"].iloc[-1]
    v_ref_start = df_ref["Speed_mps"].iloc[0]
    v_ref_end = df_ref["Speed_mps"].iloc[-1]
    print(f"Driver {driver_name}:")
    print(f"  Simulated v(0): {v_sim_start:.3f} m/s ({v_sim_start*3.6:.2f} km/h)")
    print(f"  Simulated v(S): {v_sim_end:.3f} m/s ({v_sim_end*3.6:.2f} km/h)")
    print(f"  Simulated Delta_v (end - start): {v_sim_end - v_sim_start:+.3f} m/s ({(v_sim_end - v_sim_start)*3.6:+.2f} km/h)")
    print(f"  Empirical v(0): {v_ref_start:.3f} m/s ({v_ref_start*3.6:.2f} km/h)")
    print(f"  Empirical v(S): {v_ref_end:.3f} m/s ({v_ref_end*3.6:.2f} km/h)")
    print(f"  Empirical Delta_v (end - start): {v_ref_end - v_ref_start:+.3f} m/s ({(v_ref_end - v_ref_start)*3.6:+.2f} km/h)")

# --- 4. Physics Consistency Tests ---
print("\n=== PHYSICS CONSISTENCY TESTS ===")
m_base = Level2CoupledModel()

# Test 1: Increasing downforce should not increase braking distance
# Simulate braking from 80 m/s to 30 m/s on a straight
v_seq = np.linspace(80.0, 30.0, 100)
# Integral of v / a_decel dv = distance
def calc_braking_dist(model):
    ds_tot = 0.0
    for v in np.linspace(80.0, 30.0, 500):
        a_dec = model.max_deceleration(v, kappa=0.0)
        # ds = v / a_dec * dv
        ds_tot += (v / a_dec) * (50.0 / 500)
    return ds_tot

d_base = calc_braking_dist(m_base)
m_high_down = Level2CoupledModel({"k_down": m_base.k_down * 1.3})
d_high_down = calc_braking_dist(m_high_down)
t1_pass = d_high_down <= d_base
print(f"Test 1 (Downforce -> Braking Distance): Base={d_base:.2f}m, HighDown={d_high_down:.2f}m -> {'PASS' if t1_pass else 'FAIL'}")

# Test 2: Increasing power should not reduce straight-line acceleration
a_base = m_base.max_acceleration(50.0, kappa=0.0)
m_high_pow = Level2CoupledModel({"power_max": m_base.power_max * 1.1})
a_high_pow = m_high_pow.max_acceleration(50.0, kappa=0.0)
t2_pass = a_high_pow >= a_base
print(f"Test 2 (Power -> Straight-Line Accel): Base={a_base:.3f} m/s^2, HighPow={a_high_pow:.3f} m/s^2 -> {'PASS' if t2_pass else 'FAIL'}")

# Test 3: Increasing grip should not reduce maximum corner speed
v_c_base = m_base.corner_speed_limit(0.015)
m_high_grip = Level2CoupledModel({"mu_y": m_base.mu_y * 1.1})
v_c_high = m_high_grip.corner_speed_limit(0.015)
t3_pass = v_c_high >= v_c_base
print(f"Test 3 (Grip -> Corner Speed Limit): Base={v_c_base:.2f} m/s, HighGrip={v_c_high:.2f} m/s -> {'PASS' if t3_pass else 'FAIL'}")

# Test 4: Increasing drag should not increase terminal speed
# Terminal speed where max_acceleration == 0
def get_terminal_speed(model, drs=0):
    for v in np.linspace(60.0, 120.0, 6000):
        if model.max_acceleration(v, kappa=0.0, drs=drs) <= 1e-4:
            return v
    return 120.0

v_term_base = get_terminal_speed(m_base, drs=0)
m_high_drag = Level2CoupledModel({"k_drag_drs_off": m_base.k_drag_drs_off * 1.2})
v_term_high_drag = get_terminal_speed(m_high_drag, drs=0)
t4_pass = v_term_high_drag <= v_term_base
print(f"Test 4 (Drag -> Terminal Speed): Base={v_term_base*3.6:.2f} km/h, HighDrag={v_term_high_drag*3.6:.2f} km/h -> {'PASS' if t4_pass else 'FAIL'}")

# Test 5: Removing DRS should not increase top speed
v_term_drs_on = get_terminal_speed(m_base, drs=1)
v_term_drs_off = get_terminal_speed(m_base, drs=0)
t5_pass = v_term_drs_on >= v_term_drs_off
print(f"Test 5 (DRS -> Top Speed): DRS_ON={v_term_drs_on*3.6:.2f} km/h, DRS_OFF={v_term_drs_off*3.6:.2f} km/h -> {'PASS' if t5_pass else 'FAIL'}")

# Test 6: Increasing mass should not improve acceleration for the same force
m_high_mass = Level2CoupledModel({"mass": m_base.mass * 1.1})
a_high_mass = m_high_mass.max_acceleration(50.0, kappa=0.0)
t6_pass = a_high_mass <= a_base
print(f"Test 6 (Mass -> Accel): Base={a_base:.3f} m/s^2, HighMass={a_high_mass:.3f} m/s^2 -> {'PASS' if t6_pass else 'FAIL'}")

# --- 5. Generate Diagnostic Plot ---
fig, axes = plt.subplots(2, 1, figsize=(14, 8), sharex=True)

axes[0].plot(s, df_lec["Speed_mps"] * 3.6, label="LEC Observed Telemetry", color="#E10600", linewidth=1.5)
axes[0].plot(s, sim_lec["Speed_mps"] * 3.6, label="Level 2 Simulated (Calibrated)", color="#1E90FF", linestyle="--", linewidth=1.5)
axes[0].set_ylabel("Speed (km/h)", fontsize=11)
axes[0].set_title("Charles Leclerc: Observed Telemetry vs Level-2 Coupled Simulation", fontsize=12, fontweight="bold")
axes[0].grid(True, alpha=0.3)
axes[0].legend(loc="lower right")

err_lec_kmh = (sim_lec["Speed_mps"].values - df_lec["Speed_mps"].values) * 3.6
axes[1].plot(s, err_lec_kmh, label="Simulation Error (v_sim - v_obs)", color="#8A2BE2", linewidth=1.0)
axes[1].axhline(0, color="black", linestyle=":", alpha=0.7)
axes[1].set_ylabel("Speed Error (km/h)", fontsize=11)
axes[1].set_xlabel("Track Distance s (m)", fontsize=11)
axes[1].set_title("Discrepancy Profile across Lap", fontsize=11)
axes[1].grid(True, alpha=0.3)
axes[1].legend(loc="lower right")

plot_path = PROJECT_ROOT / "outputs" / "plots" / "level2_diagnostic_error_profile.png"
plt.tight_layout()
plt.savefig(plot_path, dpi=150)
print(f"\nSaved diagnostic plot to: {plot_path}")

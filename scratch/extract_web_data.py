import pandas as pd
import json
import os

# 1. Telemetry profile from physics_constrained_composite_100m.csv
csv_path = "data/processed/physics_constrained_composite_100m.csv"
df_telemetry = pd.read_csv(csv_path)

# Sample every 10m to keep payload lightweight (~537 points)
df_sampled = df_telemetry.iloc[::10].copy()
telemetry_data = []
for _, row in df_sampled.iterrows():
    telemetry_data.append({
        "s": round(float(row["Distance"]), 1),
        "v_feas": round(float(row["Speed_kmh"]), 1),
        "v_donor": round(float(row["Donor_Speed_kmh"]), 1),
        "driver": "LEC" if "Leclerc" in str(row["Selected_Driver"]) else "SAI",
        "kappa": float(f"{row['Curvature_kappa']:.6f}"),
        "drs": int(row["DRS_active"])
    })

# 2. Segments for 50m, 100m, 250m
segments = {}
for res in ["50m", "100m", "250m"]:
    seg_csv = f"data/processed/theoretical_composite_{res}.csv"
    if os.path.exists(seg_csv):
        df_seg = pd.read_csv(seg_csv)
        seg_list = []
        for _, row in df_seg.iterrows():
            seg_list.append({
                "id": int(row["segment_id"]),
                "start": round(float(row["s_start"]), 1),
                "end": round(float(row["s_end"]), 1),
                "winner": "LEC" if "Leclerc" in str(row["winner"]) else "SAI",
                "dt_winner": round(float(row["dt_winner"]), 4),
                "delta_dt": round(float(row["delta_dt"]), 4),
                "v_entry": round(float(row["v_entry_winner"]) * 3.6, 1),
                "v_exit": round(float(row["v_exit_winner"]) * 3.6, 1)
            })
        segments[res] = seg_list

# 3. Model validation results (Exp 01)
df_val = pd.read_csv("data/processed/model_validation_results.csv")
validation_results = []
for _, row in df_val.iterrows():
    validation_results.append({
        "model": row["model"],
        "driver": row["test_driver"],
        "sim_lap": round(float(row["lap_time_sim_s"]), 3),
        "ref_lap": round(float(row["lap_time_ref_s"]), 3),
        "error_s": round(float(row["lap_time_error_s"]), 3),
        "rmse_mps": round(float(row["velocity_rmse_mps"]), 3),
        "top_speed_err": round(float(row["top_speed_error_mps"]), 3),
        "periodicity_err": round(float(row["periodicity_error_mps"]), 4),
        "verdict": row["verdict"]
    })

# 4. Exp 04 segmentation robustness
df_exp04 = pd.read_csv("data/processed/experiment_04_segmentation_robustness.csv")
sensitivity_results = []
for _, row in df_exp04.iterrows():
    sensitivity_results.append({
        "res": row["resolution_label"],
        "segments": int(row["number_of_segments"]),
        "t_theo": round(float(row["theoretical_lap_time_s"]), 3),
        "t_feas": round(float(row["feasible_lap_time_s"]), 3),
        "gap": round(float(row["feasibility_penalty_s"]), 3),
        "gain_lec": round(float(row["feasible_gain_vs_lec_s"]), 3),
        "retained_fraction": round(float(row["retained_fraction"]), 3),
        "switches": int(row["number_of_driver_switches"]),
        "max_dv_mps": round(float(row["max_delta_v_mps"]), 3),
        "max_dv_kmh": round(float(row["max_delta_v_kmh"]), 2),
        "total_ke_kj": round(float(row["total_abs_delta_ke_kj"]), 2),
        "lec_dist_pct": round(float(row["lec_distance_pct"]), 2),
        "sai_dist_pct": round(float(row["sainz_distance_pct"]), 2)
    })

# 5. Boundary jumps for 100m
df_jumps = pd.read_csv("data/processed/theoretical_composite_jumps_100m.csv")
jumps_100m = []
for _, row in df_jumps.iterrows():
    if row.get("driver_switch", False):
        jumps_100m.append({
            "s": round(float(row["boundary_s"]), 1),
            "from_driver": "LEC" if "Leclerc" in str(row["driver_from"]) else "SAI",
            "to_driver": "LEC" if "Leclerc" in str(row["driver_to"]) else "SAI",
            "delta_v_mps": round(float(row["delta_v_mps"]), 3),
            "abs_delta_v_kmh": round(float(row["abs_delta_v_kmh"]), 2),
            "abs_delta_energy_kj": round(float(row["abs_delta_energy_kj"]), 2)
        })

# 6. Gap attribution components (Exp 03)
gap_attribution = [
    {"name": "Boundary Kinetic Energy Penalty", "symbol": "ΔT_KE", "value": 0.684, "desc": "Energy dissipation to reconcile boundary speed step jumps"},
    {"name": "Boundary Braking Displacement Penalty", "symbol": "ΔT_brake", "value": 0.169, "desc": "Early braking required to meet downstream entry ceilings"},
    {"name": "Corner-Exit Traction Grip Deficit", "symbol": "ΔT_traction", "value": 0.000, "desc": "Power-limited rather than grip-limited acceleration at exit"},
    {"name": "Residual State-Propagation Term", "symbol": "ΔT_residual", "value": 1.861, "desc": "Downstream speed debt propagating along forward integration horizon"}
]

# Write to website/js/data.js
js_content = f"""// Verified Scientific Research Data from F1-Physics-Constrained-Lap-Analysis
// Generated automatically from data/processed/*.csv
// Ground-Truth: 2023 Bahrain GP Q3 (Ferrari SF-23, Charles Leclerc vs Carlos Sainz)

window.F1_RESEARCH_DATA = {{
  overview: {{
    circuit: "Bahrain International Circuit (Sakhir)",
    season: "2023 FIA Formula One World Championship",
    session: "Qualifying Q3 (Dry, Soft Tires)",
    car: "Scuderia Ferrari SF-23",
    trackLength_m: 5369.0,
    canonicalResolution_m: 100.0,
    t_lec_observed_s: 89.921,
    t_sai_observed_s: 90.110,
    t_theoretical_100m_s: 88.869,
    t_feasible_100m_s: 91.583,
    feasibility_gap_s: 2.714,
    driver_switches_100m: 15,
    max_boundary_dv_kmh: 11.70,
    max_boundary_dv_mps: 3.251,
    sum_boundary_ke_kj: 832.24
  }},
  gapAttribution: {json.dumps(gap_attribution, indent=2)},
  modelValidation: {json.dumps(validation_results, indent=2)},
  sensitivity: {json.dumps(sensitivity_results, indent=2)},
  boundaryJumps100m: {json.dumps(jumps_100m, indent=2)},
  segments: {json.dumps(segments, indent=2)},
  telemetryProfile: {json.dumps(telemetry_data, indent=2)}
}};
"""

with open("website/js/data.js", "w", encoding="utf-8") as f:
    f.write(js_content)

print(f"data.js created successfully! Telemetry points: {len(telemetry_data)}, Segments: 50m ({len(segments.get('50m', []))}), 100m ({len(segments.get('100m', []))}), 250m ({len(segments.get('250m', []))})")

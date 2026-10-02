// Verified Scientific Research Data from F1-Physics-Constrained-Lap-Analysis
// Generated automatically from data/processed/redbull/*.csv
// Ground-Truth: 2023 Bahrain GP Q3 (Oracle Red Bull Racing RB19, Verstappen vs Perez)

window.RBR_RESEARCH_DATA = {
  overview: {
  "circuit": "Bahrain International Circuit (Sakhir)",
  "season": "2023 FIA Formula One World Championship",
  "session": "Qualifying Q3 (Dry, Soft Tires)",
  "car": "Oracle Red Bull Racing RB19",
  "trackLength_m": 5358.0,
  "canonicalResolution_m": 100.0,
  "t_ver_observed_s": 89.59,
  "t_per_observed_s": 89.623,
  "t_theoretical_100m_s": 88.674,
  "t_feasible_100m_s": 92.81,
  "feasibility_gap_s": 4.136,
  "driver_switches_100m": 13,
  "max_boundary_dv_kmh": 8.28,
  "max_boundary_dv_mps": 2.299,
  "sum_boundary_ke_kj": 316.59
},
  gapAttribution: [
  {
    "name": "Boundary Kinetic Energy Penalty",
    "symbol": "\u0394T_KE",
    "value": 0.265,
    "desc": "Energy dissipation to reconcile boundary speed step jumps"
  },
  {
    "name": "Boundary Braking Displacement Penalty",
    "symbol": "\u0394T_brake",
    "value": 0.063,
    "desc": "Early braking required to meet downstream entry ceilings"
  },
  {
    "name": "Corner-Exit Traction Grip Deficit",
    "symbol": "\u0394T_traction",
    "value": 0.0,
    "desc": "Power-limited rather than grip-limited acceleration at exit"
  },
  {
    "name": "Residual State-Propagation Term",
    "symbol": "\u0394T_residual",
    "value": 3.808,
    "desc": "Downstream speed debt propagating along forward integration horizon"
  }
],
  modelValidation: [
  {
    "model": "Level 0: Pure Longitudinal",
    "driver": "VER (Training)",
    "sim_lap": 101.35,
    "ref_lap": 89.59,
    "error_s": 11.76,
    "rmse_mps": 11.369,
    "top_speed_err": 15.278,
    "periodicity_err": 4.0266,
    "verdict": "FAILED_UNTRUSTABLE"
  },
  {
    "model": "Level 0: Pure Longitudinal",
    "driver": "PER (Cross-Validation)",
    "sim_lap": 101.336,
    "ref_lap": 89.623,
    "error_s": 11.713,
    "rmse_mps": 11.707,
    "top_speed_err": 14.901,
    "periodicity_err": 3.6989,
    "verdict": "FAILED_UNTRUSTABLE"
  },
  {
    "model": "Level 1: Longitudinal + Aero",
    "driver": "VER (Training)",
    "sim_lap": 88.737,
    "ref_lap": 89.59,
    "error_s": 0.853,
    "rmse_mps": 3.846,
    "top_speed_err": 4.96,
    "periodicity_err": 3.1334,
    "verdict": "INADEQUATE"
  },
  {
    "model": "Level 1: Longitudinal + Aero",
    "driver": "PER (Cross-Validation)",
    "sim_lap": 88.727,
    "ref_lap": 89.623,
    "error_s": 0.896,
    "rmse_mps": 4.119,
    "top_speed_err": 5.493,
    "periodicity_err": 3.4611,
    "verdict": "INADEQUATE"
  },
  {
    "model": "Level 2: Coupled (Policy A)",
    "driver": "VER (Training)",
    "sim_lap": 88.152,
    "ref_lap": 89.59,
    "error_s": 1.438,
    "rmse_mps": 4.908,
    "top_speed_err": 2.679,
    "periodicity_err": 2.5836,
    "verdict": "INADEQUATE"
  },
  {
    "model": "Level 2: Coupled (Policy A)",
    "driver": "PER (Cross-Validation)",
    "sim_lap": 88.142,
    "ref_lap": 89.623,
    "error_s": 1.481,
    "rmse_mps": 5.453,
    "top_speed_err": 2.161,
    "periodicity_err": 2.2558,
    "verdict": "FAILED_UNTRUSTABLE"
  }
],
  sensitivity: [
  {
    "res": "50m",
    "segments": 108,
    "t_theo": 88.638,
    "t_feas": 92.799,
    "gap": 4.162,
    "gain_ver": 0.953,
    "gain_per": 0.986,
    "switches": 21,
    "max_dv_mps": 2.299,
    "max_dv_kmh": 8.276,
    "total_ke_kj": 319.85,
    "ver_dist_pct": 44.0,
    "per_dist_pct": 56.0
  },
  {
    "res": "100m",
    "segments": 54,
    "t_theo": 88.674,
    "t_feas": 92.81,
    "gap": 4.136,
    "gain_ver": 0.916,
    "gain_per": 0.949,
    "switches": 13,
    "max_dv_mps": 2.299,
    "max_dv_kmh": 8.276,
    "total_ke_kj": 316.59,
    "ver_dist_pct": 45.9,
    "per_dist_pct": 54.1
  },
  {
    "res": "250m",
    "segments": 22,
    "t_theo": 88.988,
    "t_feas": 93.164,
    "gap": 4.177,
    "gain_ver": 0.602,
    "gain_per": 0.635,
    "switches": 9,
    "max_dv_mps": 5.9,
    "max_dv_kmh": 21.239,
    "total_ke_kj": 325.46,
    "ver_dist_pct": 53.3,
    "per_dist_pct": 46.7
  }
],
  telemetryProfile: [
  {
    "s": 0.0,
    "v_feas": 292.02888,
    "v_donor": 293.48889,
    "driver": "PER",
    "kappa": 0.000632,
    "drs": 0
  },
  {
    "s": 10.0,
    "v_feas": 293.640967,
    "v_donor": 295.479452,
    "driver": "PER",
    "kappa": 8.3e-05,
    "drs": 1
  },
  {
    "s": 20.0,
    "v_feas": 295.312979,
    "v_donor": 296.611234,
    "driver": "PER",
    "kappa": 5.4e-05,
    "drs": 1
  },
  {
    "s": 30.0,
    "v_feas": 296.913361,
    "v_donor": 297.617999,
    "driver": "PER",
    "kappa": 8.9e-05,
    "drs": 1
  },
  {
    "s": 40.0,
    "v_feas": 298.445997,
    "v_donor": 298.566123,
    "driver": "PER",
    "kappa": 0.000209,
    "drs": 1
  },
  {
    "s": 50.0,
    "v_feas": 299.409765,
    "v_donor": 299.409765,
    "driver": "PER",
    "kappa": 0.000181,
    "drs": 1
  },
  {
    "s": 60.0,
    "v_feas": 300.279607,
    "v_donor": 300.279607,
    "driver": "PER",
    "kappa": 7.3e-05,
    "drs": 1
  },
  {
    "s": 70.0,
    "v_feas": 301.341082,
    "v_donor": 301.341082,
    "driver": "PER",
    "kappa": 8.3e-05,
    "drs": 1
  },
  {
    "s": 80.0,
    "v_feas": 302.61137,
    "v_donor": 302.61137,
    "driver": "PER",
    "kappa": 9.2e-05,
    "drs": 1
  },
  {
    "s": 90.0,
    "v_feas": 303.377176,
    "v_donor": 303.377176,
    "driver": "PER",
    "kappa": 4.2e-05,
    "drs": 1
  },
  {
    "s": 100.0,
    "v_feas": 303.927041,
    "v_donor": 303.927041,
    "driver": "PER",
    "kappa": 1.9e-05,
    "drs": 1
  },
  {
    "s": 110.0,
    "v_feas": 305.018988,
    "v_donor": 305.04391,
    "driver": "PER",
    "kappa": -1.2e-05,
    "drs": 1
  },
  {
    "s": 120.0,
    "v_feas": 306.220202,
    "v_donor": 306.45173,
    "driver": "PER",
    "kappa": -0.00021,
    "drs": 1
  },
  {
    "s": 130.0,
    "v_feas": 307.373888,
    "v_donor": 307.758596,
    "driver": "PER",
    "kappa": -0.00058,
    "drs": 1
  },
  {
    "s": 140.0,
    "v_feas": 308.0,
    "v_donor": 308.0,
    "driver": "PER",
    "kappa": -0.000255,
    "drs": 1
  },
  {
    "s": 150.0,
    "v_feas": 308.050259,
    "v_donor": 308.050259,
    "driver": "PER",
    "kappa": -4.2e-05,
    "drs": 1
  },
  {
    "s": 160.0,
    "v_feas": 309.098401,
    "v_donor": 309.098401,
    "driver": "PER",
    "kappa": 3e-05,
    "drs": 1
  },
  {
    "s": 170.0,
    "v_feas": 310.029155,
    "v_donor": 310.029155,
    "driver": "PER",
    "kappa": 0.00012,
    "drs": 1
  },
  {
    "s": 180.0,
    "v_feas": 310.759076,
    "v_donor": 310.759076,
    "driver": "PER",
    "kappa": 0.000512,
    "drs": 1
  },
  {
    "s": 190.0,
    "v_feas": 311.384776,
    "v_donor": 311.384776,
    "driver": "PER",
    "kappa": 0.000758,
    "drs": 1
  },
  {
    "s": 200.0,
    "v_feas": 311.949419,
    "v_donor": 311.949419,
    "driver": "PER",
    "kappa": 0.000174,
    "drs": 1
  },
  {
    "s": 210.0,
    "v_feas": 312.664185,
    "v_donor": 312.664185,
    "driver": "PER",
    "kappa": -0.0,
    "drs": 1
  },
  {
    "s": 220.0,
    "v_feas": 313.350302,
    "v_donor": 313.350302,
    "driver": "PER",
    "kappa": -3.1e-05,
    "drs": 1
  },
  {
    "s": 230.0,
    "v_feas": 313.978426,
    "v_donor": 313.978426,
    "driver": "PER",
    "kappa": -5.8e-05,
    "drs": 1
  },
  {
    "s": 240.0,
    "v_feas": 314.60627,
    "v_donor": 314.60627,
    "driver": "PER",
    "kappa": 3e-06,
    "drs": 1
  },
  {
    "s": 250.0,
    "v_feas": 315.269337,
    "v_donor": 315.269337,
    "driver": "PER",
    "kappa": 0.000172,
    "drs": 1
  },
  {
    "s": 260.0,
    "v_feas": 315.991255,
    "v_donor": 315.991255,
    "driver": "PER",
    "kappa": 0.000285,
    "drs": 1
  },
  {
    "s": 270.0,
    "v_feas": 316.357082,
    "v_donor": 316.357082,
    "driver": "PER",
    "kappa": 0.000189,
    "drs": 1
  },
  {
    "s": 280.0,
    "v_feas": 316.678188,
    "v_donor": 316.678188,
    "driver": "PER",
    "kappa": -1.4e-05,
    "drs": 1
  },
  {
    "s": 290.0,
    "v_feas": 317.10463,
    "v_donor": 317.10463,
    "driver": "PER",
    "kappa": -0.000132,
    "drs": 1
  },
  {
    "s": 300.0,
    "v_feas": 317.732493,
    "v_donor": 317.732493,
    "driver": "PER",
    "kappa": -8.5e-05,
    "drs": 1
  },
  {
    "s": 310.0,
    "v_feas": 318.37567,
    "v_donor": 318.37567,
    "driver": "PER",
    "kappa": 3.5e-05,
    "drs": 1
  },
  {
    "s": 320.0,
    "v_feas": 318.990245,
    "v_donor": 318.990245,
    "driver": "PER",
    "kappa": 7.8e-05,
    "drs": 1
  },
  {
    "s": 330.0,
    "v_feas": 319.305986,
    "v_donor": 319.305986,
    "driver": "PER",
    "kappa": 5.4e-05,
    "drs": 1
  },
  {
    "s": 340.0,
    "v_feas": 319.701022,
    "v_donor": 319.701022,
    "driver": "PER",
    "kappa": 1.3e-05,
    "drs": 1
  },
  {
    "s": 350.0,
    "v_feas": 319.987056,
    "v_donor": 319.987056,
    "driver": "PER",
    "kappa": -0.0,
    "drs": 1
  },
  {
    "s": 360.0,
    "v_feas": 320.0,
    "v_donor": 320.0,
    "driver": "PER",
    "kappa": -1e-05,
    "drs": 1
  },
  {
    "s": 370.0,
    "v_feas": 320.0,
    "v_donor": 320.0,
    "driver": "PER",
    "kappa": -5.7e-05,
    "drs": 1
  },
  {
    "s": 380.0,
    "v_feas": 320.0,
    "v_donor": 320.0,
    "driver": "PER",
    "kappa": -8e-05,
    "drs": 1
  },
  {
    "s": 390.0,
    "v_feas": 320.0,
    "v_donor": 320.0,
    "driver": "PER",
    "kappa": -1.3e-05,
    "drs": 1
  },
  {
    "s": 400.0,
    "v_feas": 320.538201,
    "v_donor": 320.732746,
    "driver": "PER",
    "kappa": 0.000111,
    "drs": 1
  },
  {
    "s": 410.0,
    "v_feas": 321.154003,
    "v_donor": 321.58888,
    "driver": "PER",
    "kappa": 0.000218,
    "drs": 1
  },
  {
    "s": 420.0,
    "v_feas": 321.747781,
    "v_donor": 322.153499,
    "driver": "PER",
    "kappa": 0.000152,
    "drs": 1
  },
  {
    "s": 430.0,
    "v_feas": 322.320404,
    "v_donor": 322.598644,
    "driver": "PER",
    "kappa": -4.8e-05,
    "drs": 1
  },
  {
    "s": 440.0,
    "v_feas": 322.872701,
    "v_donor": 322.990183,
    "driver": "PER",
    "kappa": -0.000157,
    "drs": 1
  },
  {
    "s": 450.0,
    "v_feas": 323.0,
    "v_donor": 323.0,
    "driver": "PER",
    "kappa": -0.000112,
    "drs": 1
  },
  {
    "s": 460.0,
    "v_feas": 323.00267,
    "v_donor": 323.00267,
    "driver": "PER",
    "kappa": 9.9e-05,
    "drs": 1
  },
  {
    "s": 470.0,
    "v_feas": 323.47022,
    "v_donor": 323.627283,
    "driver": "PER",
    "kappa": 0.000241,
    "drs": 1
  },
  {
    "s": 480.0,
    "v_feas": 323.951801,
    "v_donor": 323.951801,
    "driver": "PER",
    "kappa": 0.000155,
    "drs": 1
  },
  {
    "s": 490.0,
    "v_feas": 323.408608,
    "v_donor": 323.408608,
    "driver": "PER",
    "kappa": 4.6e-05,
    "drs": 1
  },
  {
    "s": 500.0,
    "v_feas": 323.050754,
    "v_donor": 323.050754,
    "driver": "PER",
    "kappa": 3.5e-05,
    "drs": 1
  },
  {
    "s": 510.0,
    "v_feas": 323.577232,
    "v_donor": 324.219443,
    "driver": "PER",
    "kappa": 0.000144,
    "drs": 1
  },
  {
    "s": 520.0,
    "v_feas": 324.085173,
    "v_donor": 324.891046,
    "driver": "PER",
    "kappa": 0.000276,
    "drs": 1
  },
  {
    "s": 530.0,
    "v_feas": 324.02824,
    "v_donor": 324.02824,
    "driver": "PER",
    "kappa": 8.8e-05,
    "drs": 1
  },
  {
    "s": 540.0,
    "v_feas": 324.0,
    "v_donor": 324.0,
    "driver": "PER",
    "kappa": -0.000168,
    "drs": 1
  },
  {
    "s": 550.0,
    "v_feas": 324.0,
    "v_donor": 324.0,
    "driver": "PER",
    "kappa": -0.000178,
    "drs": 1
  },
  {
    "s": 560.0,
    "v_feas": 324.0,
    "v_donor": 324.0,
    "driver": "PER",
    "kappa": -0.000144,
    "drs": 1
  },
  {
    "s": 570.0,
    "v_feas": 324.034304,
    "v_donor": 324.034304,
    "driver": "PER",
    "kappa": -0.00015,
    "drs": 1
  },
  {
    "s": 580.0,
    "v_feas": 324.482407,
    "v_donor": 324.484942,
    "driver": "PER",
    "kappa": -0.000164,
    "drs": 1
  },
  {
    "s": 590.0,
    "v_feas": 324.809681,
    "v_donor": 324.955577,
    "driver": "PER",
    "kappa": -0.000163,
    "drs": 0
  },
  {
    "s": 600.0,
    "v_feas": 312.824192,
    "v_donor": 312.824192,
    "driver": "PER",
    "kappa": -0.000271,
    "drs": 0
  },
  {
    "s": 610.0,
    "v_feas": 282.9629,
    "v_donor": 282.9629,
    "driver": "PER",
    "kappa": -0.000184,
    "drs": 0
  },
  {
    "s": 620.0,
    "v_feas": 256.674706,
    "v_donor": 256.674706,
    "driver": "PER",
    "kappa": 0.000189,
    "drs": 0
  },
  {
    "s": 630.0,
    "v_feas": 230.484072,
    "v_donor": 236.571377,
    "driver": "PER",
    "kappa": -0.000506,
    "drs": 0
  },
  {
    "s": 640.0,
    "v_feas": 202.108473,
    "v_donor": 213.932358,
    "driver": "PER",
    "kappa": -0.001315,
    "drs": 0
  },
  {
    "s": 650.0,
    "v_feas": 174.153312,
    "v_donor": 189.636845,
    "driver": "PER",
    "kappa": -0.001394,
    "drs": 0
  },
  {
    "s": 660.0,
    "v_feas": 146.074379,
    "v_donor": 163.94155,
    "driver": "PER",
    "kappa": -0.003034,
    "drs": 0
  },
  {
    "s": 670.0,
    "v_feas": 117.819006,
    "v_donor": 135.153444,
    "driver": "PER",
    "kappa": -0.009457,
    "drs": 0
  },
  {
    "s": 680.0,
    "v_feas": 91.793939,
    "v_donor": 115.428181,
    "driver": "PER",
    "kappa": -0.02665,
    "drs": 0
  },
  {
    "s": 690.0,
    "v_feas": 74.592162,
    "v_donor": 98.083723,
    "driver": "PER",
    "kappa": -0.049777,
    "drs": 0
  },
  {
    "s": 700.0,
    "v_feas": 74.557564,
    "v_donor": 86.659555,
    "driver": "PER",
    "kappa": -0.04822,
    "drs": 0
  },
  {
    "s": 710.0,
    "v_feas": 76.541241,
    "v_donor": 76.541241,
    "driver": "PER",
    "kappa": -0.04296,
    "drs": 0
  },
  {
    "s": 720.0,
    "v_feas": 70.850795,
    "v_donor": 70.850795,
    "driver": "PER",
    "kappa": -0.031491,
    "drs": 0
  },
  {
    "s": 730.0,
    "v_feas": 72.610016,
    "v_donor": 72.610016,
    "driver": "PER",
    "kappa": -0.022386,
    "drs": 0
  },
  {
    "s": 740.0,
    "v_feas": 84.277132,
    "v_donor": 84.277132,
    "driver": "PER",
    "kappa": -0.011637,
    "drs": 0
  },
  {
    "s": 750.0,
    "v_feas": 97.220401,
    "v_donor": 97.220401,
    "driver": "PER",
    "kappa": 0.000343,
    "drs": 0
  },
  {
    "s": 760.0,
    "v_feas": 112.253495,
    "v_donor": 112.253495,
    "driver": "PER",
    "kappa": 0.011596,
    "drs": 0
  },
  {
    "s": 770.0,
    "v_feas": 124.128657,
    "v_donor": 124.128657,
    "driver": "PER",
    "kappa": 0.011339,
    "drs": 0
  },
  {
    "s": 780.0,
    "v_feas": 137.683759,
    "v_donor": 139.992105,
    "driver": "PER",
    "kappa": 0.012806,
    "drs": 0
  },
  {
    "s": 790.0,
    "v_feas": 145.625573,
    "v_donor": 147.217855,
    "driver": "PER",
    "kappa": 0.013921,
    "drs": 0
  },
  {
    "s": 800.0,
    "v_feas": 131.245714,
    "v_donor": 157.166278,
    "driver": "PER",
    "kappa": 0.019973,
    "drs": 0
  },
  {
    "s": 810.0,
    "v_feas": 128.77791,
    "v_donor": 163.586782,
    "driver": "PER",
    "kappa": 0.020148,
    "drs": 0
  },
  {
    "s": 820.0,
    "v_feas": 140.339197,
    "v_donor": 174.104113,
    "driver": "PER",
    "kappa": 0.009623,
    "drs": 0
  },
  {
    "s": 830.0,
    "v_feas": 156.994047,
    "v_donor": 178.797829,
    "driver": "PER",
    "kappa": 0.005443,
    "drs": 0
  },
  {
    "s": 840.0,
    "v_feas": 170.327828,
    "v_donor": 186.360508,
    "driver": "PER",
    "kappa": 0.005083,
    "drs": 0
  },
  {
    "s": 850.0,
    "v_feas": 181.338339,
    "v_donor": 192.758092,
    "driver": "PER",
    "kappa": 0.003239,
    "drs": 0
  },
  {
    "s": 860.0,
    "v_feas": 190.717564,
    "v_donor": 198.123971,
    "driver": "PER",
    "kappa": 0.002943,
    "drs": 0
  },
  {
    "s": 870.0,
    "v_feas": 198.875324,
    "v_donor": 202.842795,
    "driver": "PER",
    "kappa": 0.00455,
    "drs": 0
  },
  {
    "s": 880.0,
    "v_feas": 206.077414,
    "v_donor": 207.77984,
    "driver": "PER",
    "kappa": 0.00434,
    "drs": 0
  },
  {
    "s": 890.0,
    "v_feas": 200.780061,
    "v_donor": 212.054353,
    "driver": "PER",
    "kappa": -0.005606,
    "drs": 0
  },
  {
    "s": 900.0,
    "v_feas": 190.508039,
    "v_donor": 216.11234,
    "driver": "PER",
    "kappa": -0.012768,
    "drs": 0
  },
  {
    "s": 910.0,
    "v_feas": 197.147295,
    "v_donor": 220.153738,
    "driver": "PER",
    "kappa": -0.007296,
    "drs": 0
  },
  {
    "s": 920.0,
    "v_feas": 204.544252,
    "v_donor": 224.114341,
    "driver": "PER",
    "kappa": -0.004674,
    "drs": 0
  },
  {
    "s": 930.0,
    "v_feas": 211.13351,
    "v_donor": 226.163462,
    "driver": "PER",
    "kappa": -0.004057,
    "drs": 0
  },
  {
    "s": 940.0,
    "v_feas": 217.057624,
    "v_donor": 228.033139,
    "driver": "PER",
    "kappa": -0.004459,
    "drs": 0
  },
  {
    "s": 950.0,
    "v_feas": 222.422956,
    "v_donor": 231.88675,
    "driver": "PER",
    "kappa": -0.005277,
    "drs": 0
  },
  {
    "s": 960.0,
    "v_feas": 227.311322,
    "v_donor": 235.745683,
    "driver": "PER",
    "kappa": -0.003373,
    "drs": 0
  },
  {
    "s": 970.0,
    "v_feas": 231.787237,
    "v_donor": 238.982972,
    "driver": "PER",
    "kappa": -0.002406,
    "drs": 0
  },
  {
    "s": 980.0,
    "v_feas": 236.226076,
    "v_donor": 241.894007,
    "driver": "PER",
    "kappa": -0.002067,
    "drs": 1
  },
  {
    "s": 990.0,
    "v_feas": 241.063387,
    "v_donor": 244.810055,
    "driver": "PER",
    "kappa": -0.002118,
    "drs": 1
  },
  {
    "s": 1000.0,
    "v_feas": 245.566154,
    "v_donor": 247.698508,
    "driver": "PER",
    "kappa": -0.001791,
    "drs": 1
  },
  {
    "s": 1010.0,
    "v_feas": 249.771422,
    "v_donor": 250.511098,
    "driver": "PER",
    "kappa": -0.001156,
    "drs": 1
  },
  {
    "s": 1020.0,
    "v_feas": 253.246117,
    "v_donor": 253.246117,
    "driver": "PER",
    "kappa": -0.000404,
    "drs": 1
  },
  {
    "s": 1030.0,
    "v_feas": 255.95869,
    "v_donor": 255.95869,
    "driver": "PER",
    "kappa": 0.000572,
    "drs": 1
  },
  {
    "s": 1040.0,
    "v_feas": 258.547656,
    "v_donor": 258.547656,
    "driver": "PER",
    "kappa": 0.000454,
    "drs": 1
  },
  {
    "s": 1050.0,
    "v_feas": 261.14336,
    "v_donor": 261.14336,
    "driver": "PER",
    "kappa": 0.000183,
    "drs": 1
  },
  {
    "s": 1060.0,
    "v_feas": 263.167733,
    "v_donor": 263.167733,
    "driver": "PER",
    "kappa": -4.5e-05,
    "drs": 1
  },
  {
    "s": 1070.0,
    "v_feas": 264.80295,
    "v_donor": 264.80295,
    "driver": "PER",
    "kappa": -0.000341,
    "drs": 1
  },
  {
    "s": 1080.0,
    "v_feas": 266.703384,
    "v_donor": 266.703384,
    "driver": "PER",
    "kappa": -0.000572,
    "drs": 1
  },
  {
    "s": 1090.0,
    "v_feas": 269.005169,
    "v_donor": 269.005169,
    "driver": "PER",
    "kappa": 0.000191,
    "drs": 1
  },
  {
    "s": 1100.0,
    "v_feas": 271.621858,
    "v_donor": 271.621858,
    "driver": "PER",
    "kappa": 0.00028,
    "drs": 1
  },
  {
    "s": 1110.0,
    "v_feas": 274.177087,
    "v_donor": 274.177087,
    "driver": "PER",
    "kappa": 0.000131,
    "drs": 1
  },
  {
    "s": 1120.0,
    "v_feas": 276.396742,
    "v_donor": 276.396742,
    "driver": "PER",
    "kappa": 3.4e-05,
    "drs": 1
  },
  {
    "s": 1130.0,
    "v_feas": 278.622927,
    "v_donor": 278.622927,
    "driver": "PER",
    "kappa": -1.6e-05,
    "drs": 1
  },
  {
    "s": 1140.0,
    "v_feas": 280.73258,
    "v_donor": 280.73258,
    "driver": "PER",
    "kappa": -3.6e-05,
    "drs": 1
  },
  {
    "s": 1150.0,
    "v_feas": 282.390717,
    "v_donor": 282.390717,
    "driver": "PER",
    "kappa": 1.7e-05,
    "drs": 1
  },
  {
    "s": 1160.0,
    "v_feas": 283.0,
    "v_donor": 283.0,
    "driver": "PER",
    "kappa": 0.000168,
    "drs": 1
  },
  {
    "s": 1170.0,
    "v_feas": 283.000451,
    "v_donor": 283.000451,
    "driver": "PER",
    "kappa": 0.000125,
    "drs": 1
  },
  {
    "s": 1180.0,
    "v_feas": 284.883037,
    "v_donor": 285.601645,
    "driver": "PER",
    "kappa": -0.000127,
    "drs": 1
  },
  {
    "s": 1190.0,
    "v_feas": 286.945246,
    "v_donor": 288.06934,
    "driver": "PER",
    "kappa": -6.1e-05,
    "drs": 1
  },
  {
    "s": 1200.0,
    "v_feas": 288.817941,
    "v_donor": 288.817941,
    "driver": "PER",
    "kappa": 1.5e-05,
    "drs": 1
  },
  {
    "s": 1210.0,
    "v_feas": 290.068025,
    "v_donor": 290.068025,
    "driver": "PER",
    "kappa": 7.3e-05,
    "drs": 1
  },
  {
    "s": 1220.0,
    "v_feas": 291.397802,
    "v_donor": 291.397802,
    "driver": "PER",
    "kappa": 0.000187,
    "drs": 1
  },
  {
    "s": 1230.0,
    "v_feas": 292.658247,
    "v_donor": 292.658247,
    "driver": "PER",
    "kappa": 0.00041,
    "drs": 1
  },
  {
    "s": 1240.0,
    "v_feas": 293.886568,
    "v_donor": 293.886568,
    "driver": "PER",
    "kappa": 0.000449,
    "drs": 1
  },
  {
    "s": 1250.0,
    "v_feas": 294.943232,
    "v_donor": 294.943232,
    "driver": "PER",
    "kappa": -4.1e-05,
    "drs": 1
  },
  {
    "s": 1260.0,
    "v_feas": 295.927261,
    "v_donor": 295.927261,
    "driver": "PER",
    "kappa": 2.3e-05,
    "drs": 1
  },
  {
    "s": 1270.0,
    "v_feas": 296.933619,
    "v_donor": 296.933619,
    "driver": "PER",
    "kappa": 8.8e-05,
    "drs": 1
  },
  {
    "s": 1280.0,
    "v_feas": 297.936132,
    "v_donor": 297.936132,
    "driver": "PER",
    "kappa": 8.2e-05,
    "drs": 1
  },
  {
    "s": 1290.0,
    "v_feas": 298.954058,
    "v_donor": 298.954058,
    "driver": "PER",
    "kappa": 6.6e-05,
    "drs": 1
  },
  {
    "s": 1300.0,
    "v_feas": 299.467907,
    "v_donor": 299.467907,
    "driver": "PER",
    "kappa": 7.3e-05,
    "drs": 1
  },
  {
    "s": 1310.0,
    "v_feas": 299.956405,
    "v_donor": 299.956405,
    "driver": "PER",
    "kappa": 0.000114,
    "drs": 1
  },
  {
    "s": 1320.0,
    "v_feas": 300.933022,
    "v_donor": 300.933022,
    "driver": "PER",
    "kappa": 0.000223,
    "drs": 1
  },
  {
    "s": 1330.0,
    "v_feas": 301.928543,
    "v_donor": 301.928543,
    "driver": "PER",
    "kappa": 0.000272,
    "drs": 1
  },
  {
    "s": 1340.0,
    "v_feas": 302.805959,
    "v_donor": 302.805959,
    "driver": "PER",
    "kappa": 0.00017,
    "drs": 1
  },
  {
    "s": 1350.0,
    "v_feas": 303.625438,
    "v_donor": 303.625438,
    "driver": "PER",
    "kappa": 2.9e-05,
    "drs": 1
  },
  {
    "s": 1360.0,
    "v_feas": 304.286386,
    "v_donor": 304.286386,
    "driver": "PER",
    "kappa": -4.3e-05,
    "drs": 1
  },
  {
    "s": 1370.0,
    "v_feas": 304.662143,
    "v_donor": 304.662143,
    "driver": "PER",
    "kappa": -3e-05,
    "drs": 1
  },
  {
    "s": 1380.0,
    "v_feas": 304.884055,
    "v_donor": 304.884055,
    "driver": "PER",
    "kappa": 1e-05,
    "drs": 1
  },
  {
    "s": 1390.0,
    "v_feas": 300.615712,
    "v_donor": 300.615712,
    "driver": "PER",
    "kappa": 2.8e-05,
    "drs": 1
  },
  {
    "s": 1400.0,
    "v_feas": 271.989503,
    "v_donor": 287.247476,
    "driver": "PER",
    "kappa": -8.4e-05,
    "drs": 0
  },
  {
    "s": 1410.0,
    "v_feas": 242.220275,
    "v_donor": 265.66226,
    "driver": "VER",
    "kappa": -0.000402,
    "drs": 0
  },
  {
    "s": 1420.0,
    "v_feas": 213.491418,
    "v_donor": 244.83397,
    "driver": "VER",
    "kappa": -0.00118,
    "drs": 0
  },
  {
    "s": 1430.0,
    "v_feas": 185.899287,
    "v_donor": 220.742492,
    "driver": "VER",
    "kappa": -0.004515,
    "drs": 0
  },
  {
    "s": 1440.0,
    "v_feas": 164.731196,
    "v_donor": 200.595188,
    "driver": "VER",
    "kappa": -0.013919,
    "drs": 0
  },
  {
    "s": 1450.0,
    "v_feas": 161.800392,
    "v_donor": 189.290358,
    "driver": "VER",
    "kappa": -0.013608,
    "drs": 0
  },
  {
    "s": 1460.0,
    "v_feas": 149.712847,
    "v_donor": 180.660499,
    "driver": "VER",
    "kappa": -0.013883,
    "drs": 0
  },
  {
    "s": 1470.0,
    "v_feas": 133.463907,
    "v_donor": 168.112343,
    "driver": "VER",
    "kappa": -0.01561,
    "drs": 0
  },
  {
    "s": 1480.0,
    "v_feas": 113.759842,
    "v_donor": 150.068771,
    "driver": "VER",
    "kappa": -0.021077,
    "drs": 0
  },
  {
    "s": 1490.0,
    "v_feas": 102.464175,
    "v_donor": 141.161096,
    "driver": "VER",
    "kappa": -0.029268,
    "drs": 0
  },
  {
    "s": 1500.0,
    "v_feas": 98.793974,
    "v_donor": 135.668208,
    "driver": "VER",
    "kappa": -0.031241,
    "drs": 0
  },
  {
    "s": 1510.0,
    "v_feas": 111.959394,
    "v_donor": 129.519165,
    "driver": "VER",
    "kappa": -0.015466,
    "drs": 0
  },
  {
    "s": 1520.0,
    "v_feas": 126.101591,
    "v_donor": 126.101591,
    "driver": "VER",
    "kappa": -0.010888,
    "drs": 0
  },
  {
    "s": 1530.0,
    "v_feas": 124.739312,
    "v_donor": 127.97078,
    "driver": "VER",
    "kappa": -0.01012,
    "drs": 0
  },
  {
    "s": 1540.0,
    "v_feas": 99.393719,
    "v_donor": 131.208476,
    "driver": "VER",
    "kappa": -0.024521,
    "drs": 0
  },
  {
    "s": 1550.0,
    "v_feas": 98.898333,
    "v_donor": 138.622112,
    "driver": "VER",
    "kappa": -0.03035,
    "drs": 0
  },
  {
    "s": 1560.0,
    "v_feas": 112.909725,
    "v_donor": 146.091159,
    "driver": "VER",
    "kappa": -0.006475,
    "drs": 0
  },
  {
    "s": 1570.0,
    "v_feas": 134.549148,
    "v_donor": 156.057839,
    "driver": "VER",
    "kappa": -0.001245,
    "drs": 0
  },
  {
    "s": 1580.0,
    "v_feas": 152.903898,
    "v_donor": 165.482634,
    "driver": "VER",
    "kappa": -0.003607,
    "drs": 0
  },
  {
    "s": 1590.0,
    "v_feas": 167.040461,
    "v_donor": 173.91457,
    "driver": "VER",
    "kappa": -0.007843,
    "drs": 0
  },
  {
    "s": 1600.0,
    "v_feas": 178.585377,
    "v_donor": 180.863536,
    "driver": "VER",
    "kappa": -0.006145,
    "drs": 0
  },
  {
    "s": 1610.0,
    "v_feas": 188.351073,
    "v_donor": 189.681376,
    "driver": "PER",
    "kappa": -0.000784,
    "drs": 0
  },
  {
    "s": 1620.0,
    "v_feas": 194.705235,
    "v_donor": 194.705235,
    "driver": "PER",
    "kappa": 0.001002,
    "drs": 0
  },
  {
    "s": 1630.0,
    "v_feas": 200.258958,
    "v_donor": 200.258958,
    "driver": "PER",
    "kappa": 0.001543,
    "drs": 0
  },
  {
    "s": 1640.0,
    "v_feas": 206.303781,
    "v_donor": 206.329221,
    "driver": "PER",
    "kappa": 0.002146,
    "drs": 0
  },
  {
    "s": 1650.0,
    "v_feas": 211.401586,
    "v_donor": 211.401586,
    "driver": "PER",
    "kappa": 0.001233,
    "drs": 0
  },
  {
    "s": 1660.0,
    "v_feas": 215.518292,
    "v_donor": 215.518292,
    "driver": "PER",
    "kappa": 0.000857,
    "drs": 0
  },
  {
    "s": 1670.0,
    "v_feas": 219.939214,
    "v_donor": 219.939214,
    "driver": "PER",
    "kappa": 0.00205,
    "drs": 0
  },
  {
    "s": 1680.0,
    "v_feas": 224.592556,
    "v_donor": 224.592556,
    "driver": "PER",
    "kappa": 0.005369,
    "drs": 0
  },
  {
    "s": 1690.0,
    "v_feas": 227.298176,
    "v_donor": 227.298176,
    "driver": "PER",
    "kappa": 0.005994,
    "drs": 0
  },
  {
    "s": 1700.0,
    "v_feas": 230.325175,
    "v_donor": 230.325175,
    "driver": "PER",
    "kappa": 0.003126,
    "drs": 0
  },
  {
    "s": 1710.0,
    "v_feas": 234.308408,
    "v_donor": 234.308408,
    "driver": "PER",
    "kappa": 0.001831,
    "drs": 0
  },
  {
    "s": 1720.0,
    "v_feas": 237.431434,
    "v_donor": 237.431434,
    "driver": "PER",
    "kappa": 0.002619,
    "drs": 0
  },
  {
    "s": 1730.0,
    "v_feas": 239.923824,
    "v_donor": 239.923824,
    "driver": "PER",
    "kappa": 0.006766,
    "drs": 0
  },
  {
    "s": 1740.0,
    "v_feas": 242.47128,
    "v_donor": 242.47128,
    "driver": "PER",
    "kappa": 0.007292,
    "drs": 0
  },
  {
    "s": 1750.0,
    "v_feas": 245.688293,
    "v_donor": 245.984473,
    "driver": "PER",
    "kappa": 0.002902,
    "drs": 0
  },
  {
    "s": 1760.0,
    "v_feas": 248.090172,
    "v_donor": 248.090172,
    "driver": "PER",
    "kappa": 0.001705,
    "drs": 0
  },
  {
    "s": 1770.0,
    "v_feas": 249.578736,
    "v_donor": 249.578736,
    "driver": "PER",
    "kappa": 0.001744,
    "drs": 0
  },
  {
    "s": 1780.0,
    "v_feas": 251.384881,
    "v_donor": 251.384881,
    "driver": "PER",
    "kappa": 0.00114,
    "drs": 0
  },
  {
    "s": 1790.0,
    "v_feas": 253.667347,
    "v_donor": 253.707884,
    "driver": "PER",
    "kappa": -0.003137,
    "drs": 0
  },
  {
    "s": 1800.0,
    "v_feas": 253.725715,
    "v_donor": 253.725715,
    "driver": "PER",
    "kappa": -0.008637,
    "drs": 0
  },
  {
    "s": 1810.0,
    "v_feas": 249.209076,
    "v_donor": 249.209076,
    "driver": "VER",
    "kappa": -0.006514,
    "drs": 0
  },
  {
    "s": 1820.0,
    "v_feas": 241.023816,
    "v_donor": 241.023816,
    "driver": "VER",
    "kappa": -0.005471,
    "drs": 0
  },
  {
    "s": 1830.0,
    "v_feas": 234.542605,
    "v_donor": 234.542605,
    "driver": "VER",
    "kappa": -0.006572,
    "drs": 0
  },
  {
    "s": 1840.0,
    "v_feas": 216.663802,
    "v_donor": 227.755454,
    "driver": "VER",
    "kappa": -0.011243,
    "drs": 0
  },
  {
    "s": 1850.0,
    "v_feas": 209.619459,
    "v_donor": 224.351104,
    "driver": "VER",
    "kappa": -0.011587,
    "drs": 0
  },
  {
    "s": 1860.0,
    "v_feas": 202.368441,
    "v_donor": 220.113546,
    "driver": "VER",
    "kappa": -0.012037,
    "drs": 0
  },
  {
    "s": 1870.0,
    "v_feas": 202.047587,
    "v_donor": 215.190503,
    "driver": "VER",
    "kappa": -0.008779,
    "drs": 0
  },
  {
    "s": 1880.0,
    "v_feas": 208.901884,
    "v_donor": 210.003786,
    "driver": "VER",
    "kappa": -0.006782,
    "drs": 0
  },
  {
    "s": 1890.0,
    "v_feas": 210.733766,
    "v_donor": 210.733766,
    "driver": "VER",
    "kappa": -0.006057,
    "drs": 0
  },
  {
    "s": 1900.0,
    "v_feas": 213.248973,
    "v_donor": 213.248973,
    "driver": "VER",
    "kappa": -0.004319,
    "drs": 0
  },
  {
    "s": 1910.0,
    "v_feas": 216.2451,
    "v_donor": 216.2451,
    "driver": "VER",
    "kappa": -0.000279,
    "drs": 0
  },
  {
    "s": 1920.0,
    "v_feas": 219.410298,
    "v_donor": 219.410298,
    "driver": "VER",
    "kappa": 0.002894,
    "drs": 0
  },
  {
    "s": 1930.0,
    "v_feas": 222.592632,
    "v_donor": 222.592632,
    "driver": "VER",
    "kappa": 0.004048,
    "drs": 0
  },
  {
    "s": 1940.0,
    "v_feas": 226.551682,
    "v_donor": 226.551682,
    "driver": "VER",
    "kappa": 0.00693,
    "drs": 0
  },
  {
    "s": 1950.0,
    "v_feas": 230.380791,
    "v_donor": 230.380791,
    "driver": "VER",
    "kappa": 0.010041,
    "drs": 0
  },
  {
    "s": 1960.0,
    "v_feas": 232.885565,
    "v_donor": 232.885565,
    "driver": "VER",
    "kappa": 0.008695,
    "drs": 0
  },
  {
    "s": 1970.0,
    "v_feas": 232.195397,
    "v_donor": 232.195397,
    "driver": "VER",
    "kappa": 0.0064,
    "drs": 0
  },
  {
    "s": 1980.0,
    "v_feas": 232.71912,
    "v_donor": 232.71912,
    "driver": "VER",
    "kappa": 0.00748,
    "drs": 0
  },
  {
    "s": 1990.0,
    "v_feas": 234.097587,
    "v_donor": 234.097587,
    "driver": "VER",
    "kappa": 0.010404,
    "drs": 0
  },
  {
    "s": 2000.0,
    "v_feas": 235.685043,
    "v_donor": 235.798272,
    "driver": "VER",
    "kappa": 0.008984,
    "drs": 0
  },
  {
    "s": 2010.0,
    "v_feas": 239.498924,
    "v_donor": 240.681372,
    "driver": "PER",
    "kappa": 0.006391,
    "drs": 0
  },
  {
    "s": 2020.0,
    "v_feas": 242.577541,
    "v_donor": 242.577541,
    "driver": "PER",
    "kappa": 0.006006,
    "drs": 0
  },
  {
    "s": 2030.0,
    "v_feas": 244.721132,
    "v_donor": 244.721132,
    "driver": "PER",
    "kappa": 0.008063,
    "drs": 0
  },
  {
    "s": 2040.0,
    "v_feas": 246.776472,
    "v_donor": 246.87609,
    "driver": "PER",
    "kappa": 0.00983,
    "drs": 0
  },
  {
    "s": 2050.0,
    "v_feas": 248.941407,
    "v_donor": 248.941407,
    "driver": "PER",
    "kappa": 0.005793,
    "drs": 0
  },
  {
    "s": 2060.0,
    "v_feas": 250.564012,
    "v_donor": 250.564012,
    "driver": "PER",
    "kappa": 0.001933,
    "drs": 0
  },
  {
    "s": 2070.0,
    "v_feas": 252.172037,
    "v_donor": 252.172037,
    "driver": "PER",
    "kappa": 0.001811,
    "drs": 0
  },
  {
    "s": 2080.0,
    "v_feas": 253.831616,
    "v_donor": 253.831616,
    "driver": "PER",
    "kappa": 0.002182,
    "drs": 0
  },
  {
    "s": 2090.0,
    "v_feas": 254.640268,
    "v_donor": 254.640268,
    "driver": "PER",
    "kappa": 0.000961,
    "drs": 0
  },
  {
    "s": 2100.0,
    "v_feas": 255.728159,
    "v_donor": 255.728159,
    "driver": "PER",
    "kappa": 0.000112,
    "drs": 0
  },
  {
    "s": 2110.0,
    "v_feas": 257.999198,
    "v_donor": 257.999198,
    "driver": "PER",
    "kappa": -0.000385,
    "drs": 0
  },
  {
    "s": 2120.0,
    "v_feas": 248.577879,
    "v_donor": 248.577879,
    "driver": "PER",
    "kappa": -0.001151,
    "drs": 0
  },
  {
    "s": 2130.0,
    "v_feas": 235.659964,
    "v_donor": 238.054902,
    "driver": "PER",
    "kappa": -0.008266,
    "drs": 0
  },
  {
    "s": 2140.0,
    "v_feas": 220.518187,
    "v_donor": 220.518187,
    "driver": "PER",
    "kappa": -0.004355,
    "drs": 0
  },
  {
    "s": 2150.0,
    "v_feas": 194.974342,
    "v_donor": 196.316862,
    "driver": "PER",
    "kappa": -0.002394,
    "drs": 0
  },
  {
    "s": 2160.0,
    "v_feas": 167.523115,
    "v_donor": 177.973985,
    "driver": "PER",
    "kappa": -0.003076,
    "drs": 0
  },
  {
    "s": 2170.0,
    "v_feas": 140.428501,
    "v_donor": 161.699564,
    "driver": "PER",
    "kappa": -0.007216,
    "drs": 0
  },
  {
    "s": 2180.0,
    "v_feas": 115.02538,
    "v_donor": 138.319549,
    "driver": "PER",
    "kappa": -0.0173,
    "drs": 0
  },
  {
    "s": 2190.0,
    "v_feas": 96.979963,
    "v_donor": 118.336301,
    "driver": "PER",
    "kappa": -0.028934,
    "drs": 0
  },
  {
    "s": 2200.0,
    "v_feas": 85.622646,
    "v_donor": 104.812612,
    "driver": "PER",
    "kappa": -0.039765,
    "drs": 0
  },
  {
    "s": 2210.0,
    "v_feas": 80.530358,
    "v_donor": 93.459482,
    "driver": "VER",
    "kappa": -0.043838,
    "drs": 0
  },
  {
    "s": 2220.0,
    "v_feas": 80.520004,
    "v_donor": 87.0,
    "driver": "VER",
    "kappa": -0.040987,
    "drs": 0
  },
  {
    "s": 2230.0,
    "v_feas": 79.035231,
    "v_donor": 79.035231,
    "driver": "VER",
    "kappa": -0.027469,
    "drs": 0
  },
  {
    "s": 2240.0,
    "v_feas": 84.229116,
    "v_donor": 84.229116,
    "driver": "VER",
    "kappa": -0.019956,
    "drs": 0
  },
  {
    "s": 2250.0,
    "v_feas": 93.32139,
    "v_donor": 93.32139,
    "driver": "VER",
    "kappa": -0.015111,
    "drs": 0
  },
  {
    "s": 2260.0,
    "v_feas": 101.337096,
    "v_donor": 101.337096,
    "driver": "VER",
    "kappa": -0.008662,
    "drs": 0
  },
  {
    "s": 2270.0,
    "v_feas": 113.434048,
    "v_donor": 113.434048,
    "driver": "VER",
    "kappa": -0.009269,
    "drs": 0
  },
  {
    "s": 2280.0,
    "v_feas": 128.466713,
    "v_donor": 128.466713,
    "driver": "VER",
    "kappa": -0.005735,
    "drs": 0
  },
  {
    "s": 2290.0,
    "v_feas": 139.215825,
    "v_donor": 139.215825,
    "driver": "VER",
    "kappa": -0.004551,
    "drs": 0
  },
  {
    "s": 2300.0,
    "v_feas": 145.331155,
    "v_donor": 145.331155,
    "driver": "VER",
    "kappa": -0.002637,
    "drs": 0
  },
  {
    "s": 2310.0,
    "v_feas": 155.654136,
    "v_donor": 156.090834,
    "driver": "VER",
    "kappa": -0.001537,
    "drs": 0
  },
  {
    "s": 2320.0,
    "v_feas": 169.245833,
    "v_donor": 171.264874,
    "driver": "VER",
    "kappa": -0.001338,
    "drs": 0
  },
  {
    "s": 2330.0,
    "v_feas": 180.429659,
    "v_donor": 181.076662,
    "driver": "VER",
    "kappa": -0.00097,
    "drs": 0
  },
  {
    "s": 2340.0,
    "v_feas": 188.393986,
    "v_donor": 188.393986,
    "driver": "VER",
    "kappa": -0.000202,
    "drs": 0
  },
  {
    "s": 2350.0,
    "v_feas": 194.733241,
    "v_donor": 194.733241,
    "driver": "VER",
    "kappa": 0.000183,
    "drs": 0
  },
  {
    "s": 2360.0,
    "v_feas": 199.901318,
    "v_donor": 199.901318,
    "driver": "VER",
    "kappa": 0.000278,
    "drs": 0
  },
  {
    "s": 2370.0,
    "v_feas": 205.34201,
    "v_donor": 205.34201,
    "driver": "VER",
    "kappa": -8e-06,
    "drs": 0
  },
  {
    "s": 2380.0,
    "v_feas": 210.779452,
    "v_donor": 210.779452,
    "driver": "VER",
    "kappa": -0.001029,
    "drs": 0
  },
  {
    "s": 2390.0,
    "v_feas": 215.539309,
    "v_donor": 215.539309,
    "driver": "VER",
    "kappa": -0.000755,
    "drs": 0
  },
  {
    "s": 2400.0,
    "v_feas": 219.549836,
    "v_donor": 219.549836,
    "driver": "VER",
    "kappa": -0.000289,
    "drs": 0
  },
  {
    "s": 2410.0,
    "v_feas": 222.365007,
    "v_donor": 222.365007,
    "driver": "PER",
    "kappa": -8.8e-05,
    "drs": 0
  },
  {
    "s": 2420.0,
    "v_feas": 226.475354,
    "v_donor": 226.475354,
    "driver": "PER",
    "kappa": 0.000837,
    "drs": 0
  },
  {
    "s": 2430.0,
    "v_feas": 229.815258,
    "v_donor": 229.815258,
    "driver": "PER",
    "kappa": 0.00255,
    "drs": 0
  },
  {
    "s": 2440.0,
    "v_feas": 232.920014,
    "v_donor": 232.920014,
    "driver": "PER",
    "kappa": 0.001215,
    "drs": 0
  },
  {
    "s": 2450.0,
    "v_feas": 236.019342,
    "v_donor": 236.019342,
    "driver": "PER",
    "kappa": 0.000523,
    "drs": 0
  },
  {
    "s": 2460.0,
    "v_feas": 239.087271,
    "v_donor": 239.087271,
    "driver": "PER",
    "kappa": 0.000562,
    "drs": 0
  },
  {
    "s": 2470.0,
    "v_feas": 241.966363,
    "v_donor": 241.966363,
    "driver": "PER",
    "kappa": 0.001061,
    "drs": 0
  },
  {
    "s": 2480.0,
    "v_feas": 244.772833,
    "v_donor": 244.772833,
    "driver": "PER",
    "kappa": 0.001931,
    "drs": 0
  },
  {
    "s": 2490.0,
    "v_feas": 247.638358,
    "v_donor": 247.638358,
    "driver": "PER",
    "kappa": 0.002171,
    "drs": 0
  },
  {
    "s": 2500.0,
    "v_feas": 250.478808,
    "v_donor": 250.478808,
    "driver": "PER",
    "kappa": 0.001873,
    "drs": 0
  },
  {
    "s": 2510.0,
    "v_feas": 252.463031,
    "v_donor": 252.463031,
    "driver": "PER",
    "kappa": 0.001576,
    "drs": 0
  },
  {
    "s": 2520.0,
    "v_feas": 253.841773,
    "v_donor": 253.90002,
    "driver": "PER",
    "kappa": 0.002235,
    "drs": 0
  },
  {
    "s": 2530.0,
    "v_feas": 256.385183,
    "v_donor": 256.526563,
    "driver": "PER",
    "kappa": 0.004211,
    "drs": 0
  },
  {
    "s": 2540.0,
    "v_feas": 258.76623,
    "v_donor": 259.043788,
    "driver": "PER",
    "kappa": 0.007238,
    "drs": 0
  },
  {
    "s": 2550.0,
    "v_feas": 259.578158,
    "v_donor": 259.578158,
    "driver": "PER",
    "kappa": 0.0077,
    "drs": 0
  },
  {
    "s": 2560.0,
    "v_feas": 259.997272,
    "v_donor": 259.997272,
    "driver": "PER",
    "kappa": 0.00711,
    "drs": 0
  },
  {
    "s": 2570.0,
    "v_feas": 240.774233,
    "v_donor": 255.906863,
    "driver": "PER",
    "kappa": 0.007332,
    "drs": 0
  },
  {
    "s": 2580.0,
    "v_feas": 217.555772,
    "v_donor": 247.305789,
    "driver": "PER",
    "kappa": 0.006234,
    "drs": 0
  },
  {
    "s": 2590.0,
    "v_feas": 192.403003,
    "v_donor": 234.526533,
    "driver": "PER",
    "kappa": 0.005833,
    "drs": 0
  },
  {
    "s": 2600.0,
    "v_feas": 166.911436,
    "v_donor": 221.14232,
    "driver": "PER",
    "kappa": 0.006641,
    "drs": 0
  },
  {
    "s": 2610.0,
    "v_feas": 143.66949,
    "v_donor": 202.702372,
    "driver": "PER",
    "kappa": 0.01372,
    "drs": 0
  },
  {
    "s": 2620.0,
    "v_feas": 130.43338,
    "v_donor": 182.985718,
    "driver": "PER",
    "kappa": 0.020194,
    "drs": 0
  },
  {
    "s": 2630.0,
    "v_feas": 132.251596,
    "v_donor": 161.136998,
    "driver": "PER",
    "kappa": 0.015742,
    "drs": 0
  },
  {
    "s": 2640.0,
    "v_feas": 121.251711,
    "v_donor": 142.667907,
    "driver": "PER",
    "kappa": 0.013567,
    "drs": 0
  },
  {
    "s": 2650.0,
    "v_feas": 95.902894,
    "v_donor": 127.308601,
    "driver": "PER",
    "kappa": 0.022472,
    "drs": 0
  },
  {
    "s": 2660.0,
    "v_feas": 75.418075,
    "v_donor": 111.858825,
    "driver": "PER",
    "kappa": 0.046887,
    "drs": 0
  },
  {
    "s": 2670.0,
    "v_feas": 72.424114,
    "v_donor": 98.612707,
    "driver": "PER",
    "kappa": 0.050518,
    "drs": 0
  },
  {
    "s": 2680.0,
    "v_feas": 86.457577,
    "v_donor": 92.02113,
    "driver": "PER",
    "kappa": 0.03021,
    "drs": 0
  },
  {
    "s": 2690.0,
    "v_feas": 84.72787,
    "v_donor": 84.72787,
    "driver": "PER",
    "kappa": 0.018011,
    "drs": 0
  },
  {
    "s": 2700.0,
    "v_feas": 76.211115,
    "v_donor": 76.211115,
    "driver": "PER",
    "kappa": 0.012881,
    "drs": 0
  },
  {
    "s": 2710.0,
    "v_feas": 97.528984,
    "v_donor": 97.528984,
    "driver": "VER",
    "kappa": 0.008708,
    "drs": 0
  },
  {
    "s": 2720.0,
    "v_feas": 109.294191,
    "v_donor": 109.294191,
    "driver": "VER",
    "kappa": 0.000426,
    "drs": 0
  },
  {
    "s": 2730.0,
    "v_feas": 121.591839,
    "v_donor": 121.591839,
    "driver": "VER",
    "kappa": 0.001953,
    "drs": 0
  },
  {
    "s": 2740.0,
    "v_feas": 137.946464,
    "v_donor": 142.528796,
    "driver": "VER",
    "kappa": 0.000503,
    "drs": 0
  },
  {
    "s": 2750.0,
    "v_feas": 155.094886,
    "v_donor": 155.094886,
    "driver": "VER",
    "kappa": 0.000568,
    "drs": 0
  },
  {
    "s": 2760.0,
    "v_feas": 165.76136,
    "v_donor": 165.76136,
    "driver": "VER",
    "kappa": 0.000622,
    "drs": 1
  },
  {
    "s": 2770.0,
    "v_feas": 175.807946,
    "v_donor": 175.807946,
    "driver": "VER",
    "kappa": 0.001055,
    "drs": 1
  },
  {
    "s": 2780.0,
    "v_feas": 183.079771,
    "v_donor": 183.079771,
    "driver": "VER",
    "kappa": 0.000886,
    "drs": 1
  },
  {
    "s": 2790.0,
    "v_feas": 189.849603,
    "v_donor": 189.849603,
    "driver": "VER",
    "kappa": 0.000786,
    "drs": 1
  },
  {
    "s": 2800.0,
    "v_feas": 196.320548,
    "v_donor": 196.320548,
    "driver": "VER",
    "kappa": 0.000605,
    "drs": 1
  },
  {
    "s": 2810.0,
    "v_feas": 204.194674,
    "v_donor": 204.490032,
    "driver": "VER",
    "kappa": 0.000342,
    "drs": 1
  },
  {
    "s": 2820.0,
    "v_feas": 211.247147,
    "v_donor": 211.247147,
    "driver": "VER",
    "kappa": 0.000217,
    "drs": 1
  },
  {
    "s": 2830.0,
    "v_feas": 215.784997,
    "v_donor": 215.784997,
    "driver": "VER",
    "kappa": -1e-05,
    "drs": 1
  },
  {
    "s": 2840.0,
    "v_feas": 220.251823,
    "v_donor": 220.251823,
    "driver": "VER",
    "kappa": -7.6e-05,
    "drs": 1
  },
  {
    "s": 2850.0,
    "v_feas": 223.498231,
    "v_donor": 223.498231,
    "driver": "VER",
    "kappa": 0.000115,
    "drs": 1
  },
  {
    "s": 2860.0,
    "v_feas": 227.574967,
    "v_donor": 227.574967,
    "driver": "VER",
    "kappa": 0.000104,
    "drs": 1
  },
  {
    "s": 2870.0,
    "v_feas": 232.864078,
    "v_donor": 232.864078,
    "driver": "VER",
    "kappa": 5.5e-05,
    "drs": 1
  },
  {
    "s": 2880.0,
    "v_feas": 237.852017,
    "v_donor": 237.852017,
    "driver": "VER",
    "kappa": 6.6e-05,
    "drs": 1
  },
  {
    "s": 2890.0,
    "v_feas": 241.500201,
    "v_donor": 241.500201,
    "driver": "VER",
    "kappa": 0.000312,
    "drs": 1
  },
  {
    "s": 2900.0,
    "v_feas": 244.806975,
    "v_donor": 244.806975,
    "driver": "VER",
    "kappa": 0.000492,
    "drs": 1
  },
  {
    "s": 2910.0,
    "v_feas": 248.031139,
    "v_donor": 248.031139,
    "driver": "VER",
    "kappa": 0.000312,
    "drs": 1
  },
  {
    "s": 2920.0,
    "v_feas": 251.208401,
    "v_donor": 251.208401,
    "driver": "VER",
    "kappa": 0.000166,
    "drs": 1
  },
  {
    "s": 2930.0,
    "v_feas": 254.315983,
    "v_donor": 254.315983,
    "driver": "VER",
    "kappa": -1e-05,
    "drs": 1
  },
  {
    "s": 2940.0,
    "v_feas": 257.417697,
    "v_donor": 257.417697,
    "driver": "VER",
    "kappa": -0.000105,
    "drs": 1
  },
  {
    "s": 2950.0,
    "v_feas": 260.042521,
    "v_donor": 260.042521,
    "driver": "VER",
    "kappa": -8.3e-05,
    "drs": 1
  },
  {
    "s": 2960.0,
    "v_feas": 262.535303,
    "v_donor": 262.535303,
    "driver": "VER",
    "kappa": -6.6e-05,
    "drs": 1
  },
  {
    "s": 2970.0,
    "v_feas": 264.0,
    "v_donor": 264.0,
    "driver": "VER",
    "kappa": 7e-06,
    "drs": 1
  },
  {
    "s": 2980.0,
    "v_feas": 264.0,
    "v_donor": 264.0,
    "driver": "VER",
    "kappa": 2.9e-05,
    "drs": 1
  },
  {
    "s": 2990.0,
    "v_feas": 265.119686,
    "v_donor": 265.119686,
    "driver": "VER",
    "kappa": 4.1e-05,
    "drs": 1
  },
  {
    "s": 3000.0,
    "v_feas": 268.168421,
    "v_donor": 269.510032,
    "driver": "VER",
    "kappa": 0.000161,
    "drs": 1
  },
  {
    "s": 3010.0,
    "v_feas": 271.054247,
    "v_donor": 273.985095,
    "driver": "VER",
    "kappa": 0.000218,
    "drs": 1
  },
  {
    "s": 3020.0,
    "v_feas": 273.789703,
    "v_donor": 275.759599,
    "driver": "VER",
    "kappa": 0.000165,
    "drs": 1
  },
  {
    "s": 3030.0,
    "v_feas": 276.385931,
    "v_donor": 277.08854,
    "driver": "VER",
    "kappa": 0.00011,
    "drs": 1
  },
  {
    "s": 3040.0,
    "v_feas": 278.662973,
    "v_donor": 278.662973,
    "driver": "VER",
    "kappa": 5.8e-05,
    "drs": 1
  },
  {
    "s": 3050.0,
    "v_feas": 280.887772,
    "v_donor": 280.890879,
    "driver": "VER",
    "kappa": -1e-05,
    "drs": 1
  },
  {
    "s": 3060.0,
    "v_feas": 283.136895,
    "v_donor": 283.182211,
    "driver": "VER",
    "kappa": -5.2e-05,
    "drs": 1
  },
  {
    "s": 3070.0,
    "v_feas": 285.155189,
    "v_donor": 285.155189,
    "driver": "VER",
    "kappa": 3e-06,
    "drs": 1
  },
  {
    "s": 3080.0,
    "v_feas": 287.026232,
    "v_donor": 287.026232,
    "driver": "VER",
    "kappa": -5.3e-05,
    "drs": 1
  },
  {
    "s": 3090.0,
    "v_feas": 288.229655,
    "v_donor": 288.229655,
    "driver": "VER",
    "kappa": -0.000193,
    "drs": 1
  },
  {
    "s": 3100.0,
    "v_feas": 289.357469,
    "v_donor": 289.357469,
    "driver": "VER",
    "kappa": -0.000275,
    "drs": 1
  },
  {
    "s": 3110.0,
    "v_feas": 290.461485,
    "v_donor": 290.461485,
    "driver": "VER",
    "kappa": -0.000228,
    "drs": 1
  },
  {
    "s": 3120.0,
    "v_feas": 291.45438,
    "v_donor": 291.45438,
    "driver": "VER",
    "kappa": -4.3e-05,
    "drs": 1
  },
  {
    "s": 3130.0,
    "v_feas": 292.75639,
    "v_donor": 292.75639,
    "driver": "VER",
    "kappa": 0.000118,
    "drs": 1
  },
  {
    "s": 3140.0,
    "v_feas": 294.101109,
    "v_donor": 294.101109,
    "driver": "VER",
    "kappa": 5.4e-05,
    "drs": 1
  },
  {
    "s": 3150.0,
    "v_feas": 294.453229,
    "v_donor": 294.453229,
    "driver": "VER",
    "kappa": -6.9e-05,
    "drs": 1
  },
  {
    "s": 3160.0,
    "v_feas": 294.834401,
    "v_donor": 294.834401,
    "driver": "VER",
    "kappa": -5.1e-05,
    "drs": 1
  },
  {
    "s": 3170.0,
    "v_feas": 295.391437,
    "v_donor": 295.391437,
    "driver": "VER",
    "kappa": 2.2e-05,
    "drs": 1
  },
  {
    "s": 3180.0,
    "v_feas": 296.474872,
    "v_donor": 296.474872,
    "driver": "VER",
    "kappa": 5.5e-05,
    "drs": 1
  },
  {
    "s": 3190.0,
    "v_feas": 297.890371,
    "v_donor": 297.894169,
    "driver": "VER",
    "kappa": 6.4e-05,
    "drs": 1
  },
  {
    "s": 3200.0,
    "v_feas": 299.330989,
    "v_donor": 299.330989,
    "driver": "VER",
    "kappa": 2e-05,
    "drs": 1
  },
  {
    "s": 3210.0,
    "v_feas": 300.74322,
    "v_donor": 300.76934,
    "driver": "VER",
    "kappa": -0.000124,
    "drs": 1
  },
  {
    "s": 3220.0,
    "v_feas": 301.937141,
    "v_donor": 301.937141,
    "driver": "VER",
    "kappa": -0.000477,
    "drs": 1
  },
  {
    "s": 3230.0,
    "v_feas": 302.483244,
    "v_donor": 302.483244,
    "driver": "VER",
    "kappa": -0.000344,
    "drs": 1
  },
  {
    "s": 3240.0,
    "v_feas": 302.939284,
    "v_donor": 302.939284,
    "driver": "VER",
    "kappa": -5.2e-05,
    "drs": 1
  },
  {
    "s": 3250.0,
    "v_feas": 303.662476,
    "v_donor": 303.662476,
    "driver": "VER",
    "kappa": 6.9e-05,
    "drs": 1
  },
  {
    "s": 3260.0,
    "v_feas": 304.400686,
    "v_donor": 304.400686,
    "driver": "VER",
    "kappa": -4.7e-05,
    "drs": 1
  },
  {
    "s": 3270.0,
    "v_feas": 305.145843,
    "v_donor": 305.145843,
    "driver": "VER",
    "kappa": 0.000175,
    "drs": 1
  },
  {
    "s": 3280.0,
    "v_feas": 305.987989,
    "v_donor": 305.987989,
    "driver": "VER",
    "kappa": 0.000391,
    "drs": 1
  },
  {
    "s": 3290.0,
    "v_feas": 306.945575,
    "v_donor": 306.945575,
    "driver": "VER",
    "kappa": 0.000523,
    "drs": 1
  },
  {
    "s": 3300.0,
    "v_feas": 301.090865,
    "v_donor": 301.090865,
    "driver": "VER",
    "kappa": 0.000942,
    "drs": 1
  },
  {
    "s": 3310.0,
    "v_feas": 300.507275,
    "v_donor": 300.507275,
    "driver": "PER",
    "kappa": 0.00219,
    "drs": 0
  },
  {
    "s": 3320.0,
    "v_feas": 275.391444,
    "v_donor": 289.694401,
    "driver": "PER",
    "kappa": 0.005123,
    "drs": 0
  },
  {
    "s": 3330.0,
    "v_feas": 252.559502,
    "v_donor": 276.371914,
    "driver": "PER",
    "kappa": 0.007238,
    "drs": 0
  },
  {
    "s": 3340.0,
    "v_feas": 228.956748,
    "v_donor": 260.332722,
    "driver": "PER",
    "kappa": 0.005599,
    "drs": 0
  },
  {
    "s": 3350.0,
    "v_feas": 202.488021,
    "v_donor": 242.367284,
    "driver": "PER",
    "kappa": 0.003924,
    "drs": 0
  },
  {
    "s": 3360.0,
    "v_feas": 176.869516,
    "v_donor": 223.599737,
    "driver": "PER",
    "kappa": 0.008415,
    "drs": 0
  },
  {
    "s": 3370.0,
    "v_feas": 164.901405,
    "v_donor": 205.154218,
    "driver": "PER",
    "kappa": 0.01496,
    "drs": 0
  },
  {
    "s": 3380.0,
    "v_feas": 157.732397,
    "v_donor": 189.81354,
    "driver": "PER",
    "kappa": 0.015852,
    "drs": 0
  },
  {
    "s": 3390.0,
    "v_feas": 152.604768,
    "v_donor": 183.527614,
    "driver": "PER",
    "kappa": 0.016738,
    "drs": 0
  },
  {
    "s": 3400.0,
    "v_feas": 160.534449,
    "v_donor": 176.748737,
    "driver": "PER",
    "kappa": 0.011332,
    "drs": 0
  },
  {
    "s": 3410.0,
    "v_feas": 163.371684,
    "v_donor": 171.018996,
    "driver": "PER",
    "kappa": 0.011168,
    "drs": 0
  },
  {
    "s": 3420.0,
    "v_feas": 144.081703,
    "v_donor": 171.936652,
    "driver": "PER",
    "kappa": 0.014786,
    "drs": 0
  },
  {
    "s": 3430.0,
    "v_feas": 131.917927,
    "v_donor": 173.570002,
    "driver": "PER",
    "kappa": 0.020033,
    "drs": 0
  },
  {
    "s": 3440.0,
    "v_feas": 132.736614,
    "v_donor": 176.479816,
    "driver": "PER",
    "kappa": 0.019412,
    "drs": 0
  },
  {
    "s": 3450.0,
    "v_feas": 143.810701,
    "v_donor": 179.704223,
    "driver": "PER",
    "kappa": 0.011118,
    "drs": 0
  },
  {
    "s": 3460.0,
    "v_feas": 159.327982,
    "v_donor": 183.371725,
    "driver": "PER",
    "kappa": 0.008525,
    "drs": 0
  },
  {
    "s": 3470.0,
    "v_feas": 172.223872,
    "v_donor": 186.619446,
    "driver": "PER",
    "kappa": 0.009572,
    "drs": 0
  },
  {
    "s": 3480.0,
    "v_feas": 182.936587,
    "v_donor": 189.562267,
    "driver": "PER",
    "kappa": 0.010374,
    "drs": 0
  },
  {
    "s": 3490.0,
    "v_feas": 192.097525,
    "v_donor": 196.366881,
    "driver": "PER",
    "kappa": 0.008433,
    "drs": 0
  },
  {
    "s": 3500.0,
    "v_feas": 200.087069,
    "v_donor": 201.245364,
    "driver": "PER",
    "kappa": 0.006255,
    "drs": 0
  },
  {
    "s": 3510.0,
    "v_feas": 194.466768,
    "v_donor": 206.482747,
    "driver": "PER",
    "kappa": 0.006974,
    "drs": 0
  },
  {
    "s": 3520.0,
    "v_feas": 183.041482,
    "v_donor": 210.597143,
    "driver": "PER",
    "kappa": 0.01327,
    "drs": 0
  },
  {
    "s": 3530.0,
    "v_feas": 185.628257,
    "v_donor": 214.190782,
    "driver": "PER",
    "kappa": 0.012039,
    "drs": 0
  },
  {
    "s": 3540.0,
    "v_feas": 194.115953,
    "v_donor": 218.240843,
    "driver": "PER",
    "kappa": 0.004931,
    "drs": 0
  },
  {
    "s": 3550.0,
    "v_feas": 201.86439,
    "v_donor": 222.283066,
    "driver": "PER",
    "kappa": 0.003534,
    "drs": 0
  },
  {
    "s": 3560.0,
    "v_feas": 208.738431,
    "v_donor": 226.093313,
    "driver": "PER",
    "kappa": 0.004963,
    "drs": 0
  },
  {
    "s": 3570.0,
    "v_feas": 214.898757,
    "v_donor": 229.451167,
    "driver": "PER",
    "kappa": 0.011054,
    "drs": 0
  },
  {
    "s": 3580.0,
    "v_feas": 216.950305,
    "v_donor": 232.515188,
    "driver": "PER",
    "kappa": 0.010856,
    "drs": 0
  },
  {
    "s": 3590.0,
    "v_feas": 222.076634,
    "v_donor": 235.358088,
    "driver": "PER",
    "kappa": 0.003466,
    "drs": 0
  },
  {
    "s": 3600.0,
    "v_feas": 226.995,
    "v_donor": 238.105068,
    "driver": "PER",
    "kappa": 0.002254,
    "drs": 0
  },
  {
    "s": 3610.0,
    "v_feas": 231.496998,
    "v_donor": 240.866184,
    "driver": "PER",
    "kappa": 0.002433,
    "drs": 0
  },
  {
    "s": 3620.0,
    "v_feas": 235.635291,
    "v_donor": 242.73706,
    "driver": "PER",
    "kappa": 0.001735,
    "drs": 0
  },
  {
    "s": 3630.0,
    "v_feas": 239.45295,
    "v_donor": 244.117653,
    "driver": "PER",
    "kappa": 0.000486,
    "drs": 0
  },
  {
    "s": 3640.0,
    "v_feas": 242.985734,
    "v_donor": 245.848941,
    "driver": "PER",
    "kappa": -0.001398,
    "drs": 0
  },
  {
    "s": 3650.0,
    "v_feas": 246.263707,
    "v_donor": 249.355884,
    "driver": "PER",
    "kappa": -0.003569,
    "drs": 0
  },
  {
    "s": 3660.0,
    "v_feas": 249.312431,
    "v_donor": 252.924117,
    "driver": "PER",
    "kappa": -0.005123,
    "drs": 0
  },
  {
    "s": 3670.0,
    "v_feas": 252.153849,
    "v_donor": 254.516194,
    "driver": "PER",
    "kappa": -0.005733,
    "drs": 0
  },
  {
    "s": 3680.0,
    "v_feas": 254.806961,
    "v_donor": 255.47276,
    "driver": "PER",
    "kappa": -0.005731,
    "drs": 0
  },
  {
    "s": 3690.0,
    "v_feas": 256.426695,
    "v_donor": 256.426695,
    "driver": "PER",
    "kappa": -0.005303,
    "drs": 0
  },
  {
    "s": 3700.0,
    "v_feas": 257.376835,
    "v_donor": 257.376835,
    "driver": "PER",
    "kappa": -0.004581,
    "drs": 0
  },
  {
    "s": 3710.0,
    "v_feas": 258.322108,
    "v_donor": 258.322108,
    "driver": "PER",
    "kappa": -0.004242,
    "drs": 0
  },
  {
    "s": 3720.0,
    "v_feas": 259.317151,
    "v_donor": 259.317151,
    "driver": "PER",
    "kappa": -0.00729,
    "drs": 0
  },
  {
    "s": 3730.0,
    "v_feas": 260.119739,
    "v_donor": 260.119739,
    "driver": "PER",
    "kappa": -0.008662,
    "drs": 0
  },
  {
    "s": 3740.0,
    "v_feas": 260.578264,
    "v_donor": 260.578264,
    "driver": "PER",
    "kappa": -0.008473,
    "drs": 0
  },
  {
    "s": 3750.0,
    "v_feas": 261.140063,
    "v_donor": 261.140063,
    "driver": "PER",
    "kappa": -0.005447,
    "drs": 0
  },
  {
    "s": 3760.0,
    "v_feas": 262.094125,
    "v_donor": 262.094125,
    "driver": "PER",
    "kappa": -0.00427,
    "drs": 0
  },
  {
    "s": 3770.0,
    "v_feas": 262.97752,
    "v_donor": 262.97752,
    "driver": "PER",
    "kappa": -0.006025,
    "drs": 0
  },
  {
    "s": 3780.0,
    "v_feas": 263.0,
    "v_donor": 263.0,
    "driver": "PER",
    "kappa": -0.008432,
    "drs": 0
  },
  {
    "s": 3790.0,
    "v_feas": 263.622905,
    "v_donor": 263.622905,
    "driver": "PER",
    "kappa": -0.008424,
    "drs": 0
  },
  {
    "s": 3800.0,
    "v_feas": 264.0,
    "v_donor": 264.0,
    "driver": "PER",
    "kappa": -0.005543,
    "drs": 0
  },
  {
    "s": 3810.0,
    "v_feas": 264.0,
    "v_donor": 264.0,
    "driver": "PER",
    "kappa": -0.005206,
    "drs": 0
  },
  {
    "s": 3820.0,
    "v_feas": 264.476638,
    "v_donor": 264.476638,
    "driver": "PER",
    "kappa": -0.007314,
    "drs": 0
  },
  {
    "s": 3830.0,
    "v_feas": 265.497883,
    "v_donor": 265.497883,
    "driver": "PER",
    "kappa": -0.008281,
    "drs": 0
  },
  {
    "s": 3840.0,
    "v_feas": 266.163272,
    "v_donor": 266.163272,
    "driver": "PER",
    "kappa": -0.008302,
    "drs": 0
  },
  {
    "s": 3850.0,
    "v_feas": 266.519392,
    "v_donor": 266.519392,
    "driver": "PER",
    "kappa": -0.008156,
    "drs": 0
  },
  {
    "s": 3860.0,
    "v_feas": 266.891044,
    "v_donor": 266.891044,
    "driver": "PER",
    "kappa": -0.007858,
    "drs": 0
  },
  {
    "s": 3870.0,
    "v_feas": 267.455037,
    "v_donor": 267.455037,
    "driver": "PER",
    "kappa": -0.007442,
    "drs": 0
  },
  {
    "s": 3880.0,
    "v_feas": 268.150119,
    "v_donor": 268.150119,
    "driver": "PER",
    "kappa": -0.006115,
    "drs": 0
  },
  {
    "s": 3890.0,
    "v_feas": 268.8098,
    "v_donor": 268.8098,
    "driver": "PER",
    "kappa": -0.004415,
    "drs": 0
  },
  {
    "s": 3900.0,
    "v_feas": 269.674008,
    "v_donor": 269.674008,
    "driver": "PER",
    "kappa": -0.002723,
    "drs": 0
  },
  {
    "s": 3910.0,
    "v_feas": 270.0,
    "v_donor": 270.0,
    "driver": "VER",
    "kappa": -0.00103,
    "drs": 0
  },
  {
    "s": 3920.0,
    "v_feas": 270.0,
    "v_donor": 270.0,
    "driver": "VER",
    "kappa": 0.000331,
    "drs": 0
  },
  {
    "s": 3930.0,
    "v_feas": 270.951234,
    "v_donor": 271.28977,
    "driver": "VER",
    "kappa": 0.000952,
    "drs": 0
  },
  {
    "s": 3940.0,
    "v_feas": 272.464753,
    "v_donor": 273.068066,
    "driver": "VER",
    "kappa": 0.001006,
    "drs": 0
  },
  {
    "s": 3950.0,
    "v_feas": 273.893708,
    "v_donor": 273.963785,
    "driver": "VER",
    "kappa": 0.000332,
    "drs": 0
  },
  {
    "s": 3960.0,
    "v_feas": 267.76076,
    "v_donor": 267.76076,
    "driver": "VER",
    "kappa": -0.001101,
    "drs": 0
  },
  {
    "s": 3970.0,
    "v_feas": 257.160671,
    "v_donor": 258.694035,
    "driver": "VER",
    "kappa": -0.003125,
    "drs": 0
  },
  {
    "s": 3980.0,
    "v_feas": 230.265752,
    "v_donor": 257.0,
    "driver": "VER",
    "kappa": -0.005344,
    "drs": 0
  },
  {
    "s": 3990.0,
    "v_feas": 206.139773,
    "v_donor": 255.028513,
    "driver": "VER",
    "kappa": -0.007331,
    "drs": 0
  },
  {
    "s": 4000.0,
    "v_feas": 184.321169,
    "v_donor": 214.062719,
    "driver": "VER",
    "kappa": -0.009433,
    "drs": 0
  },
  {
    "s": 4010.0,
    "v_feas": 165.037431,
    "v_donor": 197.283087,
    "driver": "VER",
    "kappa": -0.012333,
    "drs": 0
  },
  {
    "s": 4020.0,
    "v_feas": 151.038384,
    "v_donor": 183.312833,
    "driver": "VER",
    "kappa": -0.016175,
    "drs": 0
  },
  {
    "s": 4030.0,
    "v_feas": 144.571849,
    "v_donor": 171.296928,
    "driver": "VER",
    "kappa": -0.01789,
    "drs": 0
  },
  {
    "s": 4040.0,
    "v_feas": 145.239838,
    "v_donor": 163.138655,
    "driver": "VER",
    "kappa": -0.015965,
    "drs": 0
  },
  {
    "s": 4050.0,
    "v_feas": 152.382644,
    "v_donor": 157.373713,
    "driver": "VER",
    "kappa": -0.013062,
    "drs": 0
  },
  {
    "s": 4060.0,
    "v_feas": 134.36682,
    "v_donor": 152.834888,
    "driver": "VER",
    "kappa": -0.016847,
    "drs": 0
  },
  {
    "s": 4070.0,
    "v_feas": 125.648466,
    "v_donor": 149.566945,
    "driver": "VER",
    "kappa": -0.021555,
    "drs": 0
  },
  {
    "s": 4080.0,
    "v_feas": 134.24314,
    "v_donor": 149.0,
    "driver": "VER",
    "kappa": -0.014919,
    "drs": 0
  },
  {
    "s": 4090.0,
    "v_feas": 147.611624,
    "v_donor": 149.0,
    "driver": "VER",
    "kappa": -0.012801,
    "drs": 0
  },
  {
    "s": 4100.0,
    "v_feas": 154.021757,
    "v_donor": 154.021757,
    "driver": "VER",
    "kappa": -0.011786,
    "drs": 0
  },
  {
    "s": 4110.0,
    "v_feas": 159.45904,
    "v_donor": 159.45904,
    "driver": "VER",
    "kappa": -0.011546,
    "drs": 0
  },
  {
    "s": 4120.0,
    "v_feas": 167.686641,
    "v_donor": 167.686641,
    "driver": "VER",
    "kappa": -0.011641,
    "drs": 0
  },
  {
    "s": 4130.0,
    "v_feas": 175.424121,
    "v_donor": 175.424121,
    "driver": "VER",
    "kappa": -0.006823,
    "drs": 0
  },
  {
    "s": 4140.0,
    "v_feas": 182.748412,
    "v_donor": 182.748412,
    "driver": "VER",
    "kappa": -0.00388,
    "drs": 0
  },
  {
    "s": 4150.0,
    "v_feas": 188.861324,
    "v_donor": 188.861324,
    "driver": "VER",
    "kappa": -0.004142,
    "drs": 0
  },
  {
    "s": 4160.0,
    "v_feas": 195.784081,
    "v_donor": 195.784081,
    "driver": "VER",
    "kappa": -0.003263,
    "drs": 0
  },
  {
    "s": 4170.0,
    "v_feas": 202.413528,
    "v_donor": 202.413528,
    "driver": "VER",
    "kappa": -0.000877,
    "drs": 0
  },
  {
    "s": 4180.0,
    "v_feas": 206.520787,
    "v_donor": 206.520787,
    "driver": "VER",
    "kappa": -0.000263,
    "drs": 0
  },
  {
    "s": 4190.0,
    "v_feas": 210.212569,
    "v_donor": 210.212569,
    "driver": "VER",
    "kappa": -1.1e-05,
    "drs": 0
  },
  {
    "s": 4200.0,
    "v_feas": 216.137546,
    "v_donor": 216.628907,
    "driver": "VER",
    "kappa": -0.000105,
    "drs": 0
  },
  {
    "s": 4210.0,
    "v_feas": 221.587375,
    "v_donor": 222.851242,
    "driver": "VER",
    "kappa": -0.000255,
    "drs": 0
  },
  {
    "s": 4220.0,
    "v_feas": 226.548303,
    "v_donor": 227.16656,
    "driver": "VER",
    "kappa": 1e-05,
    "drs": 0
  },
  {
    "s": 4230.0,
    "v_feas": 230.959493,
    "v_donor": 230.959493,
    "driver": "VER",
    "kappa": 0.000201,
    "drs": 0
  },
  {
    "s": 4240.0,
    "v_feas": 234.424948,
    "v_donor": 234.424948,
    "driver": "VER",
    "kappa": 0.000234,
    "drs": 0
  },
  {
    "s": 4250.0,
    "v_feas": 235.919866,
    "v_donor": 235.919866,
    "driver": "VER",
    "kappa": 0.000268,
    "drs": 0
  },
  {
    "s": 4260.0,
    "v_feas": 238.15227,
    "v_donor": 238.158279,
    "driver": "VER",
    "kappa": 0.000269,
    "drs": 0
  },
  {
    "s": 4270.0,
    "v_feas": 241.780973,
    "v_donor": 242.034594,
    "driver": "VER",
    "kappa": 0.000347,
    "drs": 0
  },
  {
    "s": 4280.0,
    "v_feas": 245.14492,
    "v_donor": 245.72702,
    "driver": "VER",
    "kappa": 0.000407,
    "drs": 0
  },
  {
    "s": 4290.0,
    "v_feas": 248.271132,
    "v_donor": 248.628356,
    "driver": "VER",
    "kappa": 0.000193,
    "drs": 0
  },
  {
    "s": 4300.0,
    "v_feas": 251.182732,
    "v_donor": 251.459671,
    "driver": "VER",
    "kappa": -3.2e-05,
    "drs": 0
  },
  {
    "s": 4310.0,
    "v_feas": 253.899682,
    "v_donor": 254.168301,
    "driver": "VER",
    "kappa": 2.6e-05,
    "drs": 0
  },
  {
    "s": 4320.0,
    "v_feas": 255.912344,
    "v_donor": 255.912344,
    "driver": "VER",
    "kappa": 0.000165,
    "drs": 0
  },
  {
    "s": 4330.0,
    "v_feas": 257.654001,
    "v_donor": 257.654001,
    "driver": "VER",
    "kappa": 0.000336,
    "drs": 0
  },
  {
    "s": 4340.0,
    "v_feas": 259.650531,
    "v_donor": 259.650531,
    "driver": "VER",
    "kappa": 0.000319,
    "drs": 0
  },
  {
    "s": 4350.0,
    "v_feas": 261.632182,
    "v_donor": 261.632182,
    "driver": "VER",
    "kappa": 0.000167,
    "drs": 0
  },
  {
    "s": 4360.0,
    "v_feas": 263.308992,
    "v_donor": 263.308992,
    "driver": "VER",
    "kappa": 8.1e-05,
    "drs": 0
  },
  {
    "s": 4370.0,
    "v_feas": 264.926512,
    "v_donor": 264.926512,
    "driver": "VER",
    "kappa": -9e-06,
    "drs": 0
  },
  {
    "s": 4380.0,
    "v_feas": 266.734081,
    "v_donor": 266.911226,
    "driver": "VER",
    "kappa": -5.3e-05,
    "drs": 0
  },
  {
    "s": 4390.0,
    "v_feas": 268.488496,
    "v_donor": 269.135431,
    "driver": "VER",
    "kappa": -2.3e-05,
    "drs": 0
  },
  {
    "s": 4400.0,
    "v_feas": 270.141733,
    "v_donor": 270.866967,
    "driver": "VER",
    "kappa": 4.7e-05,
    "drs": 0
  },
  {
    "s": 4410.0,
    "v_feas": 271.700884,
    "v_donor": 272.12429,
    "driver": "VER",
    "kappa": 0.00014,
    "drs": 0
  },
  {
    "s": 4420.0,
    "v_feas": 273.172396,
    "v_donor": 273.364734,
    "driver": "VER",
    "kappa": 0.000191,
    "drs": 0
  },
  {
    "s": 4430.0,
    "v_feas": 274.562147,
    "v_donor": 274.576071,
    "driver": "VER",
    "kappa": -0.000199,
    "drs": 0
  },
  {
    "s": 4440.0,
    "v_feas": 275.8416,
    "v_donor": 275.859573,
    "driver": "VER",
    "kappa": 4.1e-05,
    "drs": 0
  },
  {
    "s": 4450.0,
    "v_feas": 277.085342,
    "v_donor": 277.128171,
    "driver": "VER",
    "kappa": 5.9e-05,
    "drs": 0
  },
  {
    "s": 4460.0,
    "v_feas": 278.158086,
    "v_donor": 278.158086,
    "driver": "VER",
    "kappa": 4.8e-05,
    "drs": 0
  },
  {
    "s": 4470.0,
    "v_feas": 279.243649,
    "v_donor": 279.392941,
    "driver": "VER",
    "kappa": 1.8e-05,
    "drs": 0
  },
  {
    "s": 4480.0,
    "v_feas": 280.305448,
    "v_donor": 281.166239,
    "driver": "VER",
    "kappa": -0.000117,
    "drs": 0
  },
  {
    "s": 4490.0,
    "v_feas": 281.311385,
    "v_donor": 282.251307,
    "driver": "VER",
    "kappa": -0.000211,
    "drs": 0
  },
  {
    "s": 4500.0,
    "v_feas": 282.264793,
    "v_donor": 282.73027,
    "driver": "VER",
    "kappa": -1.9e-05,
    "drs": 0
  },
  {
    "s": 4510.0,
    "v_feas": 283.168767,
    "v_donor": 283.511551,
    "driver": "VER",
    "kappa": -3.5e-05,
    "drs": 0
  },
  {
    "s": 4520.0,
    "v_feas": 284.02618,
    "v_donor": 284.811572,
    "driver": "VER",
    "kappa": -3.9e-05,
    "drs": 0
  },
  {
    "s": 4530.0,
    "v_feas": 284.839706,
    "v_donor": 285.971882,
    "driver": "VER",
    "kappa": 3.7e-05,
    "drs": 0
  },
  {
    "s": 4540.0,
    "v_feas": 285.611837,
    "v_donor": 286.373982,
    "driver": "VER",
    "kappa": 0.000101,
    "drs": 0
  },
  {
    "s": 4550.0,
    "v_feas": 286.3449,
    "v_donor": 286.765936,
    "driver": "VER",
    "kappa": 3.6e-05,
    "drs": 0
  },
  {
    "s": 4560.0,
    "v_feas": 287.041066,
    "v_donor": 287.479765,
    "driver": "VER",
    "kappa": -8e-05,
    "drs": 0
  },
  {
    "s": 4570.0,
    "v_feas": 287.702367,
    "v_donor": 289.122958,
    "driver": "VER",
    "kappa": -0.000131,
    "drs": 0
  },
  {
    "s": 4580.0,
    "v_feas": 288.330705,
    "v_donor": 290.028844,
    "driver": "VER",
    "kappa": -2.4e-05,
    "drs": 0
  },
  {
    "s": 4590.0,
    "v_feas": 288.927863,
    "v_donor": 290.975042,
    "driver": "VER",
    "kappa": 0.000159,
    "drs": 0
  },
  {
    "s": 4600.0,
    "v_feas": 289.495513,
    "v_donor": 291.0,
    "driver": "VER",
    "kappa": 0.00023,
    "drs": 0
  },
  {
    "s": 4610.0,
    "v_feas": 290.035225,
    "v_donor": 292.006102,
    "driver": "PER",
    "kappa": 0.000138,
    "drs": 0
  },
  {
    "s": 4620.0,
    "v_feas": 290.548475,
    "v_donor": 292.366994,
    "driver": "PER",
    "kappa": 1.6e-05,
    "drs": 0
  },
  {
    "s": 4630.0,
    "v_feas": 291.036651,
    "v_donor": 292.732431,
    "driver": "PER",
    "kappa": 6.1e-05,
    "drs": 0
  },
  {
    "s": 4640.0,
    "v_feas": 291.501059,
    "v_donor": 293.254484,
    "driver": "PER",
    "kappa": 0.000168,
    "drs": 0
  },
  {
    "s": 4650.0,
    "v_feas": 291.942929,
    "v_donor": 293.88275,
    "driver": "PER",
    "kappa": 0.000251,
    "drs": 0
  },
  {
    "s": 4660.0,
    "v_feas": 292.36342,
    "v_donor": 294.338487,
    "driver": "PER",
    "kappa": 0.000247,
    "drs": 0
  },
  {
    "s": 4670.0,
    "v_feas": 292.763627,
    "v_donor": 294.774151,
    "driver": "PER",
    "kappa": 0.000154,
    "drs": 0
  },
  {
    "s": 4680.0,
    "v_feas": 293.14458,
    "v_donor": 295.0,
    "driver": "PER",
    "kappa": 5.7e-05,
    "drs": 0
  },
  {
    "s": 4690.0,
    "v_feas": 293.507255,
    "v_donor": 295.0,
    "driver": "PER",
    "kappa": 1.7e-05,
    "drs": 0
  },
  {
    "s": 4700.0,
    "v_feas": 293.852571,
    "v_donor": 295.048281,
    "driver": "PER",
    "kappa": -7.7e-05,
    "drs": 0
  },
  {
    "s": 4710.0,
    "v_feas": 294.181399,
    "v_donor": 294.28489,
    "driver": "VER",
    "kappa": -0.000167,
    "drs": 0
  },
  {
    "s": 4720.0,
    "v_feas": 294.49456,
    "v_donor": 294.574917,
    "driver": "VER",
    "kappa": -0.00013,
    "drs": 0
  },
  {
    "s": 4730.0,
    "v_feas": 294.792834,
    "v_donor": 294.926218,
    "driver": "VER",
    "kappa": -7.1e-05,
    "drs": 0
  },
  {
    "s": 4740.0,
    "v_feas": 295.076956,
    "v_donor": 295.489774,
    "driver": "VER",
    "kappa": -2.1e-05,
    "drs": 0
  },
  {
    "s": 4750.0,
    "v_feas": 295.347625,
    "v_donor": 295.758569,
    "driver": "VER",
    "kappa": 7.8e-05,
    "drs": 0
  },
  {
    "s": 4760.0,
    "v_feas": 286.594206,
    "v_donor": 286.594206,
    "driver": "VER",
    "kappa": 0.000248,
    "drs": 0
  },
  {
    "s": 4770.0,
    "v_feas": 271.263982,
    "v_donor": 271.263982,
    "driver": "VER",
    "kappa": -0.00015,
    "drs": 0
  },
  {
    "s": 4780.0,
    "v_feas": 257.871579,
    "v_donor": 257.871579,
    "driver": "VER",
    "kappa": -6.4e-05,
    "drs": 0
  },
  {
    "s": 4790.0,
    "v_feas": 235.760721,
    "v_donor": 235.760721,
    "driver": "VER",
    "kappa": -0.000805,
    "drs": 0
  },
  {
    "s": 4800.0,
    "v_feas": 212.26567,
    "v_donor": 216.519216,
    "driver": "VER",
    "kappa": -0.004484,
    "drs": 0
  },
  {
    "s": 4810.0,
    "v_feas": 195.906179,
    "v_donor": 195.906179,
    "driver": "PER",
    "kappa": -0.007998,
    "drs": 0
  },
  {
    "s": 4820.0,
    "v_feas": 177.455901,
    "v_donor": 178.693111,
    "driver": "PER",
    "kappa": -0.007214,
    "drs": 0
  },
  {
    "s": 4830.0,
    "v_feas": 152.067466,
    "v_donor": 159.432508,
    "driver": "PER",
    "kappa": -0.007718,
    "drs": 0
  },
  {
    "s": 4840.0,
    "v_feas": 127.339152,
    "v_donor": 149.095234,
    "driver": "PER",
    "kappa": -0.013467,
    "drs": 0
  },
  {
    "s": 4850.0,
    "v_feas": 107.581056,
    "v_donor": 142.544468,
    "driver": "PER",
    "kappa": -0.024685,
    "drs": 0
  },
  {
    "s": 4860.0,
    "v_feas": 100.374333,
    "v_donor": 135.854229,
    "driver": "PER",
    "kappa": -0.030556,
    "drs": 0
  },
  {
    "s": 4870.0,
    "v_feas": 108.521675,
    "v_donor": 131.695459,
    "driver": "PER",
    "kappa": -0.020942,
    "drs": 0
  },
  {
    "s": 4880.0,
    "v_feas": 124.158675,
    "v_donor": 126.214276,
    "driver": "PER",
    "kappa": -0.014817,
    "drs": 0
  },
  {
    "s": 4890.0,
    "v_feas": 128.440905,
    "v_donor": 128.440905,
    "driver": "PER",
    "kappa": -0.016334,
    "drs": 0
  },
  {
    "s": 4900.0,
    "v_feas": 134.020903,
    "v_donor": 134.020903,
    "driver": "PER",
    "kappa": -0.012414,
    "drs": 0
  },
  {
    "s": 4910.0,
    "v_feas": 140.812054,
    "v_donor": 140.812054,
    "driver": "VER",
    "kappa": -0.006118,
    "drs": 0
  },
  {
    "s": 4920.0,
    "v_feas": 151.076861,
    "v_donor": 151.076861,
    "driver": "VER",
    "kappa": -0.007851,
    "drs": 0
  },
  {
    "s": 4930.0,
    "v_feas": 161.446492,
    "v_donor": 161.446492,
    "driver": "VER",
    "kappa": -0.011585,
    "drs": 0
  },
  {
    "s": 4940.0,
    "v_feas": 170.887179,
    "v_donor": 170.887179,
    "driver": "VER",
    "kappa": -0.009612,
    "drs": 0
  },
  {
    "s": 4950.0,
    "v_feas": 177.628117,
    "v_donor": 177.628117,
    "driver": "VER",
    "kappa": -0.005902,
    "drs": 0
  },
  {
    "s": 4960.0,
    "v_feas": 181.536922,
    "v_donor": 181.536922,
    "driver": "VER",
    "kappa": -0.004417,
    "drs": 0
  },
  {
    "s": 4970.0,
    "v_feas": 190.532961,
    "v_donor": 191.017982,
    "driver": "VER",
    "kappa": -0.004759,
    "drs": 0
  },
  {
    "s": 4980.0,
    "v_feas": 198.713436,
    "v_donor": 198.856781,
    "driver": "VER",
    "kappa": -0.005617,
    "drs": 0
  },
  {
    "s": 4990.0,
    "v_feas": 204.137684,
    "v_donor": 204.137684,
    "driver": "VER",
    "kappa": -0.002939,
    "drs": 0
  },
  {
    "s": 5000.0,
    "v_feas": 209.016436,
    "v_donor": 209.016436,
    "driver": "VER",
    "kappa": -0.001415,
    "drs": 0
  },
  {
    "s": 5010.0,
    "v_feas": 213.794001,
    "v_donor": 213.794001,
    "driver": "VER",
    "kappa": -0.001278,
    "drs": 0
  },
  {
    "s": 5020.0,
    "v_feas": 218.468073,
    "v_donor": 218.468073,
    "driver": "VER",
    "kappa": -0.000986,
    "drs": 0
  },
  {
    "s": 5030.0,
    "v_feas": 223.137988,
    "v_donor": 223.145927,
    "driver": "VER",
    "kappa": -0.000362,
    "drs": 0
  },
  {
    "s": 5040.0,
    "v_feas": 227.760342,
    "v_donor": 227.760342,
    "driver": "VER",
    "kappa": -3e-06,
    "drs": 0
  },
  {
    "s": 5050.0,
    "v_feas": 229.081295,
    "v_donor": 229.081295,
    "driver": "VER",
    "kappa": 4.2e-05,
    "drs": 0
  },
  {
    "s": 5060.0,
    "v_feas": 231.509536,
    "v_donor": 232.065381,
    "driver": "VER",
    "kappa": 4.2e-05,
    "drs": 0
  },
  {
    "s": 5070.0,
    "v_feas": 235.646838,
    "v_donor": 237.034692,
    "driver": "VER",
    "kappa": 3.4e-05,
    "drs": 0
  },
  {
    "s": 5080.0,
    "v_feas": 239.46362,
    "v_donor": 240.539405,
    "driver": "VER",
    "kappa": 0.000154,
    "drs": 0
  },
  {
    "s": 5090.0,
    "v_feas": 242.995622,
    "v_donor": 243.323882,
    "driver": "VER",
    "kappa": 0.000652,
    "drs": 0
  },
  {
    "s": 5100.0,
    "v_feas": 245.0,
    "v_donor": 245.0,
    "driver": "VER",
    "kappa": 0.000373,
    "drs": 0
  },
  {
    "s": 5110.0,
    "v_feas": 245.0,
    "v_donor": 245.0,
    "driver": "VER",
    "kappa": 0.000124,
    "drs": 0
  },
  {
    "s": 5120.0,
    "v_feas": 247.021496,
    "v_donor": 247.769887,
    "driver": "VER",
    "kappa": 2.6e-05,
    "drs": 0
  },
  {
    "s": 5130.0,
    "v_feas": 250.01817,
    "v_donor": 251.675603,
    "driver": "VER",
    "kappa": -0.000135,
    "drs": 0
  },
  {
    "s": 5140.0,
    "v_feas": 252.812384,
    "v_donor": 255.318449,
    "driver": "VER",
    "kappa": -0.000231,
    "drs": 0
  },
  {
    "s": 5150.0,
    "v_feas": 255.422509,
    "v_donor": 256.986187,
    "driver": "VER",
    "kappa": -9.9e-05,
    "drs": 0
  },
  {
    "s": 5160.0,
    "v_feas": 257.864601,
    "v_donor": 258.84022,
    "driver": "VER",
    "kappa": -3.5e-05,
    "drs": 0
  },
  {
    "s": 5170.0,
    "v_feas": 260.152787,
    "v_donor": 260.803528,
    "driver": "VER",
    "kappa": 9e-06,
    "drs": 0
  },
  {
    "s": 5180.0,
    "v_feas": 262.29957,
    "v_donor": 262.696949,
    "driver": "VER",
    "kappa": 7.7e-05,
    "drs": 0
  },
  {
    "s": 5190.0,
    "v_feas": 264.316074,
    "v_donor": 264.381175,
    "driver": "VER",
    "kappa": 0.000291,
    "drs": 0
  },
  {
    "s": 5200.0,
    "v_feas": 266.028058,
    "v_donor": 266.028058,
    "driver": "VER",
    "kappa": 0.000185,
    "drs": 0
  },
  {
    "s": 5210.0,
    "v_feas": 267.719536,
    "v_donor": 267.719536,
    "driver": "VER",
    "kappa": -3.7e-05,
    "drs": 0
  },
  {
    "s": 5220.0,
    "v_feas": 269.320954,
    "v_donor": 269.320954,
    "driver": "VER",
    "kappa": -7.7e-05,
    "drs": 0
  },
  {
    "s": 5230.0,
    "v_feas": 270.741154,
    "v_donor": 270.741154,
    "driver": "VER",
    "kappa": -2.3e-05,
    "drs": 0
  },
  {
    "s": 5240.0,
    "v_feas": 272.163998,
    "v_donor": 272.179448,
    "driver": "VER",
    "kappa": 5.2e-05,
    "drs": 0
  },
  {
    "s": 5250.0,
    "v_feas": 273.987042,
    "v_donor": 274.161192,
    "driver": "VER",
    "kappa": 7.2e-05,
    "drs": 1
  },
  {
    "s": 5260.0,
    "v_feas": 276.078505,
    "v_donor": 276.078505,
    "driver": "VER",
    "kappa": 3.5e-05,
    "drs": 1
  },
  {
    "s": 5270.0,
    "v_feas": 277.920842,
    "v_donor": 277.920842,
    "driver": "VER",
    "kappa": -2.3e-05,
    "drs": 1
  },
  {
    "s": 5280.0,
    "v_feas": 279.690317,
    "v_donor": 279.690317,
    "driver": "VER",
    "kappa": -2.5e-05,
    "drs": 1
  },
  {
    "s": 5290.0,
    "v_feas": 281.255003,
    "v_donor": 281.255003,
    "driver": "VER",
    "kappa": 3.6e-05,
    "drs": 1
  },
  {
    "s": 5300.0,
    "v_feas": 282.82967,
    "v_donor": 282.82967,
    "driver": "VER",
    "kappa": 5e-05,
    "drs": 1
  },
  {
    "s": 5310.0,
    "v_feas": 284.486193,
    "v_donor": 284.486193,
    "driver": "VER",
    "kappa": 6.4e-05,
    "drs": 1
  },
  {
    "s": 5320.0,
    "v_feas": 286.557953,
    "v_donor": 286.629017,
    "driver": "VER",
    "kappa": 0.00011,
    "drs": 1
  },
  {
    "s": 5330.0,
    "v_feas": 288.490345,
    "v_donor": 288.490345,
    "driver": "VER",
    "kappa": 0.000214,
    "drs": 1
  },
  {
    "s": 5340.0,
    "v_feas": 289.664509,
    "v_donor": 289.664509,
    "driver": "VER",
    "kappa": 0.000312,
    "drs": 1
  },
  {
    "s": 5350.0,
    "v_feas": 290.956771,
    "v_donor": 290.956771,
    "driver": "VER",
    "kappa": -0.000342,
    "drs": 1
  }
],
  segments: {
  "50m": [
    {
      "id": 0,
      "start": 0.0,
      "end": 50.0,
      "winner": "PER",
      "dt_winner": 0.6061,
      "delta_dt": 0.0028,
      "v_entry": 293.5,
      "v_exit": 299.4
    },
    {
      "id": 1,
      "start": 50.0,
      "end": 100.0,
      "winner": "PER",
      "dt_winner": 0.5963,
      "delta_dt": 0.0021,
      "v_entry": 299.4,
      "v_exit": 303.9
    },
    {
      "id": 2,
      "start": 100.0,
      "end": 150.0,
      "winner": "PER",
      "dt_winner": 0.587,
      "delta_dt": 0.0019,
      "v_entry": 303.9,
      "v_exit": 308.1
    },
    {
      "id": 3,
      "start": 150.0,
      "end": 200.0,
      "winner": "PER",
      "dt_winner": 0.5802,
      "delta_dt": 0.0026,
      "v_entry": 308.1,
      "v_exit": 311.9
    },
    {
      "id": 4,
      "start": 200.0,
      "end": 250.0,
      "winner": "PER",
      "dt_winner": 0.5739,
      "delta_dt": 0.0025,
      "v_entry": 311.9,
      "v_exit": 315.3
    },
    {
      "id": 5,
      "start": 250.0,
      "end": 300.0,
      "winner": "PER",
      "dt_winner": 0.5687,
      "delta_dt": 0.0017,
      "v_entry": 315.3,
      "v_exit": 317.7
    },
    {
      "id": 6,
      "start": 300.0,
      "end": 350.0,
      "winner": "PER",
      "dt_winner": 0.5642,
      "delta_dt": 0.0022,
      "v_entry": 317.7,
      "v_exit": 320.0
    },
    {
      "id": 7,
      "start": 350.0,
      "end": 400.0,
      "winner": "PER",
      "dt_winner": 0.5624,
      "delta_dt": 0.0011,
      "v_entry": 320.0,
      "v_exit": 320.7
    },
    {
      "id": 8,
      "start": 400.0,
      "end": 450.0,
      "winner": "PER",
      "dt_winner": 0.5586,
      "delta_dt": 0.0014,
      "v_entry": 320.7,
      "v_exit": 323.0
    },
    {
      "id": 9,
      "start": 450.0,
      "end": 500.0,
      "winner": "PER",
      "dt_winner": 0.5566,
      "delta_dt": 0.0015,
      "v_entry": 323.0,
      "v_exit": 323.1
    },
    {
      "id": 10,
      "start": 500.0,
      "end": 550.0,
      "winner": "PER",
      "dt_winner": 0.5553,
      "delta_dt": 0.002,
      "v_entry": 323.1,
      "v_exit": 324.0
    },
    {
      "id": 11,
      "start": 550.0,
      "end": 600.0,
      "winner": "PER",
      "dt_winner": 0.556,
      "delta_dt": 0.0072,
      "v_entry": 324.0,
      "v_exit": 312.8
    },
    {
      "id": 12,
      "start": 600.0,
      "end": 650.0,
      "winner": "PER",
      "dt_winner": 0.7395,
      "delta_dt": 0.0309,
      "v_entry": 312.8,
      "v_exit": 189.6
    },
    {
      "id": 13,
      "start": 650.0,
      "end": 700.0,
      "winner": "PER",
      "dt_winner": 1.4623,
      "delta_dt": 0.0365,
      "v_entry": 189.6,
      "v_exit": 86.7
    },
    {
      "id": 14,
      "start": 700.0,
      "end": 750.0,
      "winner": "PER",
      "dt_winner": 2.3015,
      "delta_dt": 0.0646,
      "v_entry": 86.7,
      "v_exit": 97.2
    },
    {
      "id": 15,
      "start": 750.0,
      "end": 800.0,
      "winner": "VER",
      "dt_winner": 1.3858,
      "delta_dt": 0.024,
      "v_entry": 98.2,
      "v_exit": 158.0
    },
    {
      "id": 16,
      "start": 800.0,
      "end": 850.0,
      "winner": "PER",
      "dt_winner": 1.0291,
      "delta_dt": 0.0264,
      "v_entry": 157.2,
      "v_exit": 192.8
    },
    {
      "id": 17,
      "start": 850.0,
      "end": 900.0,
      "winner": "PER",
      "dt_winner": 0.8786,
      "delta_dt": 0.0044,
      "v_entry": 192.8,
      "v_exit": 216.1
    },
    {
      "id": 18,
      "start": 900.0,
      "end": 950.0,
      "winner": "PER",
      "dt_winner": 0.8021,
      "delta_dt": 0.0002,
      "v_entry": 216.1,
      "v_exit": 231.9
    },
    {
      "id": 19,
      "start": 950.0,
      "end": 1000.0,
      "winner": "PER",
      "dt_winner": 0.7494,
      "delta_dt": 0.0033,
      "v_entry": 231.9,
      "v_exit": 247.7
    },
    {
      "id": 20,
      "start": 1000.0,
      "end": 1050.0,
      "winner": "PER",
      "dt_winner": 0.7073,
      "delta_dt": 0.0032,
      "v_entry": 247.7,
      "v_exit": 261.1
    },
    {
      "id": 21,
      "start": 1050.0,
      "end": 1100.0,
      "winner": "PER",
      "dt_winner": 0.6767,
      "delta_dt": 0.0006,
      "v_entry": 261.1,
      "v_exit": 271.6
    },
    {
      "id": 22,
      "start": 1100.0,
      "end": 1150.0,
      "winner": "PER",
      "dt_winner": 0.649,
      "delta_dt": 0.0029,
      "v_entry": 271.6,
      "v_exit": 282.4
    },
    {
      "id": 23,
      "start": 1150.0,
      "end": 1200.0,
      "winner": "PER",
      "dt_winner": 0.6315,
      "delta_dt": 0.001,
      "v_entry": 282.4,
      "v_exit": 288.8
    },
    {
      "id": 24,
      "start": 1200.0,
      "end": 1250.0,
      "winner": "PER",
      "dt_winner": 0.6165,
      "delta_dt": 0.0025,
      "v_entry": 288.8,
      "v_exit": 294.9
    },
    {
      "id": 25,
      "start": 1250.0,
      "end": 1300.0,
      "winner": "PER",
      "dt_winner": 0.6053,
      "delta_dt": 0.0021,
      "v_entry": 294.9,
      "v_exit": 299.5
    },
    {
      "id": 26,
      "start": 1300.0,
      "end": 1350.0,
      "winner": "PER",
      "dt_winner": 0.5972,
      "delta_dt": 0.0023,
      "v_entry": 299.5,
      "v_exit": 303.6
    },
    {
      "id": 27,
      "start": 1350.0,
      "end": 1400.0,
      "winner": "PER",
      "dt_winner": 0.5953,
      "delta_dt": 0.0043,
      "v_entry": 303.6,
      "v_exit": 287.2
    },
    {
      "id": 28,
      "start": 1400.0,
      "end": 1450.0,
      "winner": "VER",
      "dt_winner": 0.783,
      "delta_dt": 0.0075,
      "v_entry": 287.5,
      "v_exit": 189.3
    },
    {
      "id": 29,
      "start": 1450.0,
      "end": 1500.0,
      "winner": "VER",
      "dt_winner": 1.1352,
      "delta_dt": 0.0601,
      "v_entry": 189.3,
      "v_exit": 135.7
    },
    {
      "id": 30,
      "start": 1500.0,
      "end": 1550.0,
      "winner": "VER",
      "dt_winner": 1.3825,
      "delta_dt": 0.0288,
      "v_entry": 135.7,
      "v_exit": 138.6
    },
    {
      "id": 31,
      "start": 1550.0,
      "end": 1600.0,
      "winner": "PER",
      "dt_winner": 1.1285,
      "delta_dt": 0.0025,
      "v_entry": 138.9,
      "v_exit": 183.5
    },
    {
      "id": 32,
      "start": 1600.0,
      "end": 1650.0,
      "winner": "PER",
      "dt_winner": 0.9115,
      "delta_dt": 0.0042,
      "v_entry": 183.5,
      "v_exit": 211.4
    },
    {
      "id": 33,
      "start": 1650.0,
      "end": 1700.0,
      "winner": "PER",
      "dt_winner": 0.8127,
      "delta_dt": 0.0047,
      "v_entry": 211.4,
      "v_exit": 230.3
    },
    {
      "id": 34,
      "start": 1700.0,
      "end": 1750.0,
      "winner": "PER",
      "dt_winner": 0.7551,
      "delta_dt": 0.0006,
      "v_entry": 230.3,
      "v_exit": 246.0
    },
    {
      "id": 35,
      "start": 1750.0,
      "end": 1800.0,
      "winner": "PER",
      "dt_winner": 0.7181,
      "delta_dt": 0.0,
      "v_entry": 246.0,
      "v_exit": 253.7
    },
    {
      "id": 36,
      "start": 1800.0,
      "end": 1850.0,
      "winner": "VER",
      "dt_winner": 0.7567,
      "delta_dt": 0.0104,
      "v_entry": 252.4,
      "v_exit": 224.4
    },
    {
      "id": 37,
      "start": 1850.0,
      "end": 1900.0,
      "winner": "VER",
      "dt_winner": 0.8377,
      "delta_dt": 0.0233,
      "v_entry": 224.4,
      "v_exit": 213.2
    },
    {
      "id": 38,
      "start": 1900.0,
      "end": 1950.0,
      "winner": "VER",
      "dt_winner": 0.8138,
      "delta_dt": 0.009,
      "v_entry": 213.2,
      "v_exit": 230.4
    },
    {
      "id": 39,
      "start": 1950.0,
      "end": 2000.0,
      "winner": "PER",
      "dt_winner": 0.7711,
      "delta_dt": 0.0013,
      "v_entry": 228.3,
      "v_exit": 238.8
    },
    {
      "id": 40,
      "start": 2000.0,
      "end": 2050.0,
      "winner": "PER",
      "dt_winner": 0.7386,
      "delta_dt": 0.0089,
      "v_entry": 238.8,
      "v_exit": 248.9
    },
    {
      "id": 41,
      "start": 2050.0,
      "end": 2100.0,
      "winner": "PER",
      "dt_winner": 0.7124,
      "delta_dt": 0.0011,
      "v_entry": 248.9,
      "v_exit": 255.7
    },
    {
      "id": 42,
      "start": 2100.0,
      "end": 2150.0,
      "winner": "PER",
      "dt_winner": 0.7592,
      "delta_dt": 0.071,
      "v_entry": 255.7,
      "v_exit": 196.3
    },
    {
      "id": 43,
      "start": 2150.0,
      "end": 2200.0,
      "winner": "PER",
      "dt_winner": 1.254,
      "delta_dt": 0.1514,
      "v_entry": 196.3,
      "v_exit": 104.8
    },
    {
      "id": 44,
      "start": 2200.0,
      "end": 2250.0,
      "winner": "VER",
      "dt_winner": 2.0608,
      "delta_dt": 0.0121,
      "v_entry": 100.5,
      "v_exit": 93.3
    },
    {
      "id": 45,
      "start": 2250.0,
      "end": 2300.0,
      "winner": "VER",
      "dt_winner": 1.5239,
      "delta_dt": 0.0997,
      "v_entry": 93.3,
      "v_exit": 145.3
    },
    {
      "id": 46,
      "start": 2300.0,
      "end": 2350.0,
      "winner": "VER",
      "dt_winner": 1.047,
      "delta_dt": 0.0257,
      "v_entry": 145.3,
      "v_exit": 194.7
    },
    {
      "id": 47,
      "start": 2350.0,
      "end": 2400.0,
      "winner": "VER",
      "dt_winner": 0.8674,
      "delta_dt": 0.0093,
      "v_entry": 194.7,
      "v_exit": 219.5
    },
    {
      "id": 48,
      "start": 2400.0,
      "end": 2450.0,
      "winner": "VER",
      "dt_winner": 0.7895,
      "delta_dt": 0.001,
      "v_entry": 219.5,
      "v_exit": 236.2
    },
    {
      "id": 49,
      "start": 2450.0,
      "end": 2500.0,
      "winner": "PER",
      "dt_winner": 0.7399,
      "delta_dt": 0.0019,
      "v_entry": 236.0,
      "v_exit": 250.5
    },
    {
      "id": 50,
      "start": 2500.0,
      "end": 2550.0,
      "winner": "PER",
      "dt_winner": 0.7048,
      "delta_dt": 0.0006,
      "v_entry": 250.5,
      "v_exit": 259.6
    },
    {
      "id": 51,
      "start": 2550.0,
      "end": 2600.0,
      "winner": "PER",
      "dt_winner": 0.7281,
      "delta_dt": 0.0848,
      "v_entry": 259.6,
      "v_exit": 221.1
    },
    {
      "id": 52,
      "start": 2600.0,
      "end": 2650.0,
      "winner": "PER",
      "dt_winner": 1.0705,
      "delta_dt": 0.1312,
      "v_entry": 221.1,
      "v_exit": 127.3
    },
    {
      "id": 53,
      "start": 2650.0,
      "end": 2700.0,
      "winner": "PER",
      "dt_winner": 1.883,
      "delta_dt": 0.1887,
      "v_entry": 127.3,
      "v_exit": 76.2
    },
    {
      "id": 54,
      "start": 2700.0,
      "end": 2750.0,
      "winner": "VER",
      "dt_winner": 1.5776,
      "delta_dt": 0.2768,
      "v_entry": 84.5,
      "v_exit": 155.1
    },
    {
      "id": 55,
      "start": 2750.0,
      "end": 2800.0,
      "winner": "VER",
      "dt_winner": 1.0151,
      "delta_dt": 0.1128,
      "v_entry": 155.1,
      "v_exit": 196.3
    },
    {
      "id": 56,
      "start": 2800.0,
      "end": 2850.0,
      "winner": "VER",
      "dt_winner": 0.8486,
      "delta_dt": 0.0311,
      "v_entry": 196.3,
      "v_exit": 223.5
    },
    {
      "id": 57,
      "start": 2850.0,
      "end": 2900.0,
      "winner": "VER",
      "dt_winner": 0.7673,
      "delta_dt": 0.0104,
      "v_entry": 223.5,
      "v_exit": 244.8
    },
    {
      "id": 58,
      "start": 2900.0,
      "end": 2950.0,
      "winner": "VER",
      "dt_winner": 0.7125,
      "delta_dt": 0.0106,
      "v_entry": 244.8,
      "v_exit": 260.0
    },
    {
      "id": 59,
      "start": 2950.0,
      "end": 3000.0,
      "winner": "VER",
      "dt_winner": 0.6818,
      "delta_dt": 0.0009,
      "v_entry": 260.0,
      "v_exit": 269.5
    },
    {
      "id": 60,
      "start": 3000.0,
      "end": 3050.0,
      "winner": "VER",
      "dt_winner": 0.6518,
      "delta_dt": 0.0041,
      "v_entry": 269.5,
      "v_exit": 280.9
    },
    {
      "id": 61,
      "start": 3050.0,
      "end": 3100.0,
      "winner": "VER",
      "dt_winner": 0.6299,
      "delta_dt": 0.0045,
      "v_entry": 280.9,
      "v_exit": 289.4
    },
    {
      "id": 62,
      "start": 3100.0,
      "end": 3150.0,
      "winner": "VER",
      "dt_winner": 0.6161,
      "delta_dt": 0.0031,
      "v_entry": 289.4,
      "v_exit": 294.5
    },
    {
      "id": 63,
      "start": 3150.0,
      "end": 3200.0,
      "winner": "VER",
      "dt_winner": 0.6075,
      "delta_dt": 0.0,
      "v_entry": 294.5,
      "v_exit": 299.3
    },
    {
      "id": 64,
      "start": 3200.0,
      "end": 3250.0,
      "winner": "VER",
      "dt_winner": 0.5962,
      "delta_dt": 0.0012,
      "v_entry": 299.3,
      "v_exit": 303.7
    },
    {
      "id": 65,
      "start": 3250.0,
      "end": 3300.0,
      "winner": "VER",
      "dt_winner": 0.5898,
      "delta_dt": 0.0007,
      "v_entry": 303.7,
      "v_exit": 301.1
    },
    {
      "id": 66,
      "start": 3300.0,
      "end": 3350.0,
      "winner": "PER",
      "dt_winner": 0.6455,
      "delta_dt": 0.0298,
      "v_entry": 302.7,
      "v_exit": 242.4
    },
    {
      "id": 67,
      "start": 3350.0,
      "end": 3400.0,
      "winner": "PER",
      "dt_winner": 0.8988,
      "delta_dt": 0.0145,
      "v_entry": 242.4,
      "v_exit": 176.7
    },
    {
      "id": 68,
      "start": 3400.0,
      "end": 3450.0,
      "winner": "PER",
      "dt_winner": 1.034,
      "delta_dt": 0.01,
      "v_entry": 176.7,
      "v_exit": 179.7
    },
    {
      "id": 69,
      "start": 3450.0,
      "end": 3500.0,
      "winner": "PER",
      "dt_winner": 0.9522,
      "delta_dt": 0.0038,
      "v_entry": 179.7,
      "v_exit": 201.2
    },
    {
      "id": 70,
      "start": 3500.0,
      "end": 3550.0,
      "winner": "PER",
      "dt_winner": 0.8487,
      "delta_dt": 0.0021,
      "v_entry": 201.2,
      "v_exit": 222.3
    },
    {
      "id": 71,
      "start": 3550.0,
      "end": 3600.0,
      "winner": "PER",
      "dt_winner": 0.7804,
      "delta_dt": 0.0037,
      "v_entry": 222.3,
      "v_exit": 238.1
    },
    {
      "id": 72,
      "start": 3600.0,
      "end": 3650.0,
      "winner": "PER",
      "dt_winner": 0.7395,
      "delta_dt": 0.0011,
      "v_entry": 238.1,
      "v_exit": 249.4
    },
    {
      "id": 73,
      "start": 3650.0,
      "end": 3700.0,
      "winner": "PER",
      "dt_winner": 0.7071,
      "delta_dt": 0.0023,
      "v_entry": 249.4,
      "v_exit": 257.4
    },
    {
      "id": 74,
      "start": 3700.0,
      "end": 3750.0,
      "winner": "PER",
      "dt_winner": 0.6936,
      "delta_dt": 0.0014,
      "v_entry": 257.4,
      "v_exit": 261.1
    },
    {
      "id": 75,
      "start": 3750.0,
      "end": 3800.0,
      "winner": "PER",
      "dt_winner": 0.6848,
      "delta_dt": 0.0,
      "v_entry": 261.1,
      "v_exit": 264.0
    },
    {
      "id": 76,
      "start": 3800.0,
      "end": 3850.0,
      "winner": "VER",
      "dt_winner": 0.6788,
      "delta_dt": 0.0003,
      "v_entry": 263.8,
      "v_exit": 265.5
    },
    {
      "id": 77,
      "start": 3850.0,
      "end": 3900.0,
      "winner": "PER",
      "dt_winner": 0.672,
      "delta_dt": 0.0017,
      "v_entry": 266.5,
      "v_exit": 269.7
    },
    {
      "id": 78,
      "start": 3900.0,
      "end": 3950.0,
      "winner": "VER",
      "dt_winner": 0.6638,
      "delta_dt": 0.0001,
      "v_entry": 269.2,
      "v_exit": 274.0
    },
    {
      "id": 79,
      "start": 3950.0,
      "end": 4000.0,
      "winner": "VER",
      "dt_winner": 0.7034,
      "delta_dt": 0.0401,
      "v_entry": 274.0,
      "v_exit": 214.1
    },
    {
      "id": 80,
      "start": 4000.0,
      "end": 4050.0,
      "winner": "VER",
      "dt_winner": 1.0087,
      "delta_dt": 0.0181,
      "v_entry": 214.1,
      "v_exit": 157.4
    },
    {
      "id": 81,
      "start": 4050.0,
      "end": 4100.0,
      "winner": "VER",
      "dt_winner": 1.1916,
      "delta_dt": 0.0171,
      "v_entry": 157.4,
      "v_exit": 154.0
    },
    {
      "id": 82,
      "start": 4100.0,
      "end": 4150.0,
      "winner": "VER",
      "dt_winner": 1.0545,
      "delta_dt": 0.0205,
      "v_entry": 154.0,
      "v_exit": 188.9
    },
    {
      "id": 83,
      "start": 4150.0,
      "end": 4200.0,
      "winner": "VER",
      "dt_winner": 0.8854,
      "delta_dt": 0.0029,
      "v_entry": 188.9,
      "v_exit": 216.6
    },
    {
      "id": 84,
      "start": 4200.0,
      "end": 4250.0,
      "winner": "VER",
      "dt_winner": 0.7885,
      "delta_dt": 0.0122,
      "v_entry": 216.6,
      "v_exit": 235.9
    },
    {
      "id": 85,
      "start": 4250.0,
      "end": 4300.0,
      "winner": "VER",
      "dt_winner": 0.7391,
      "delta_dt": 0.0021,
      "v_entry": 235.9,
      "v_exit": 251.5
    },
    {
      "id": 86,
      "start": 4300.0,
      "end": 4350.0,
      "winner": "VER",
      "dt_winner": 0.701,
      "delta_dt": 0.0026,
      "v_entry": 251.5,
      "v_exit": 261.6
    },
    {
      "id": 87,
      "start": 4350.0,
      "end": 4400.0,
      "winner": "VER",
      "dt_winner": 0.6765,
      "delta_dt": 0.0021,
      "v_entry": 261.6,
      "v_exit": 270.9
    },
    {
      "id": 88,
      "start": 4400.0,
      "end": 4450.0,
      "winner": "VER",
      "dt_winner": 0.657,
      "delta_dt": 0.0013,
      "v_entry": 270.9,
      "v_exit": 277.1
    },
    {
      "id": 89,
      "start": 4450.0,
      "end": 4500.0,
      "winner": "PER",
      "dt_winner": 0.6421,
      "delta_dt": 0.0004,
      "v_entry": 277.4,
      "v_exit": 283.3
    },
    {
      "id": 90,
      "start": 4500.0,
      "end": 4550.0,
      "winner": "VER",
      "dt_winner": 0.6314,
      "delta_dt": 0.0006,
      "v_entry": 282.7,
      "v_exit": 286.8
    },
    {
      "id": 91,
      "start": 4550.0,
      "end": 4600.0,
      "winner": "PER",
      "dt_winner": 0.6222,
      "delta_dt": 0.0,
      "v_entry": 287.6,
      "v_exit": 291.5
    },
    {
      "id": 92,
      "start": 4600.0,
      "end": 4650.0,
      "winner": "PER",
      "dt_winner": 0.6152,
      "delta_dt": 0.0012,
      "v_entry": 291.5,
      "v_exit": 293.9
    },
    {
      "id": 93,
      "start": 4650.0,
      "end": 4700.0,
      "winner": "PER",
      "dt_winner": 0.6107,
      "delta_dt": 0.0025,
      "v_entry": 293.9,
      "v_exit": 295.0
    },
    {
      "id": 94,
      "start": 4700.0,
      "end": 4750.0,
      "winner": "PER",
      "dt_winner": 0.6086,
      "delta_dt": 0.0019,
      "v_entry": 295.0,
      "v_exit": 295.4
    },
    {
      "id": 95,
      "start": 4750.0,
      "end": 4800.0,
      "winner": "VER",
      "dt_winner": 0.6938,
      "delta_dt": 0.0063,
      "v_entry": 295.8,
      "v_exit": 216.5
    },
    {
      "id": 96,
      "start": 4800.0,
      "end": 4850.0,
      "winner": "VER",
      "dt_winner": 1.0601,
      "delta_dt": 0.0037,
      "v_entry": 216.5,
      "v_exit": 144.5
    },
    {
      "id": 97,
      "start": 4850.0,
      "end": 4900.0,
      "winner": "PER",
      "dt_winner": 1.3653,
      "delta_dt": 0.0083,
      "v_entry": 142.5,
      "v_exit": 134.0
    },
    {
      "id": 98,
      "start": 4900.0,
      "end": 4950.0,
      "winner": "VER",
      "dt_winner": 1.1624,
      "delta_dt": 0.0426,
      "v_entry": 133.8,
      "v_exit": 177.6
    },
    {
      "id": 99,
      "start": 4950.0,
      "end": 5000.0,
      "winner": "VER",
      "dt_winner": 0.9312,
      "delta_dt": 0.0249,
      "v_entry": 177.6,
      "v_exit": 209.0
    },
    {
      "id": 100,
      "start": 5000.0,
      "end": 5050.0,
      "winner": "VER",
      "dt_winner": 0.817,
      "delta_dt": 0.0082,
      "v_entry": 209.0,
      "v_exit": 229.1
    },
    {
      "id": 101,
      "start": 5050.0,
      "end": 5100.0,
      "winner": "VER",
      "dt_winner": 0.7567,
      "delta_dt": 0.0053,
      "v_entry": 229.1,
      "v_exit": 245.0
    },
    {
      "id": 102,
      "start": 5100.0,
      "end": 5150.0,
      "winner": "PER",
      "dt_winner": 0.7184,
      "delta_dt": 0.0016,
      "v_entry": 243.3,
      "v_exit": 254.6
    },
    {
      "id": 103,
      "start": 5150.0,
      "end": 5200.0,
      "winner": "VER",
      "dt_winner": 0.688,
      "delta_dt": 0.0034,
      "v_entry": 257.0,
      "v_exit": 266.0
    },
    {
      "id": 104,
      "start": 5200.0,
      "end": 5250.0,
      "winner": "VER",
      "dt_winner": 0.6667,
      "delta_dt": 0.0031,
      "v_entry": 266.0,
      "v_exit": 274.2
    },
    {
      "id": 105,
      "start": 5250.0,
      "end": 5300.0,
      "winner": "VER",
      "dt_winner": 0.6459,
      "delta_dt": 0.0008,
      "v_entry": 274.2,
      "v_exit": 282.8
    },
    {
      "id": 106,
      "start": 5300.0,
      "end": 5350.0,
      "winner": "VER",
      "dt_winner": 0.6267,
      "delta_dt": 0.0008,
      "v_entry": 282.8,
      "v_exit": 291.0
    },
    {
      "id": 107,
      "start": 5350.0,
      "end": 5358.0,
      "winner": "VER",
      "dt_winner": 0.0988,
      "delta_dt": 0.0,
      "v_entry": 291.0,
      "v_exit": 292.0
    }
  ],
  "100m": [
    {
      "id": 0,
      "start": 0.0,
      "end": 100.0,
      "winner": "PER",
      "dt_winner": 1.2024,
      "delta_dt": 0.0049,
      "v_entry": 293.5,
      "v_exit": 303.9
    },
    {
      "id": 1,
      "start": 100.0,
      "end": 200.0,
      "winner": "PER",
      "dt_winner": 1.1672,
      "delta_dt": 0.0045,
      "v_entry": 303.9,
      "v_exit": 311.9
    },
    {
      "id": 2,
      "start": 200.0,
      "end": 300.0,
      "winner": "PER",
      "dt_winner": 1.1426,
      "delta_dt": 0.0042,
      "v_entry": 311.9,
      "v_exit": 317.7
    },
    {
      "id": 3,
      "start": 300.0,
      "end": 400.0,
      "winner": "PER",
      "dt_winner": 1.1266,
      "delta_dt": 0.0033,
      "v_entry": 317.7,
      "v_exit": 320.7
    },
    {
      "id": 4,
      "start": 400.0,
      "end": 500.0,
      "winner": "PER",
      "dt_winner": 1.1152,
      "delta_dt": 0.0029,
      "v_entry": 320.7,
      "v_exit": 323.1
    },
    {
      "id": 5,
      "start": 500.0,
      "end": 600.0,
      "winner": "PER",
      "dt_winner": 1.1113,
      "delta_dt": 0.0092,
      "v_entry": 323.1,
      "v_exit": 312.8
    },
    {
      "id": 6,
      "start": 600.0,
      "end": 700.0,
      "winner": "PER",
      "dt_winner": 2.2018,
      "delta_dt": 0.0674,
      "v_entry": 312.8,
      "v_exit": 86.7
    },
    {
      "id": 7,
      "start": 700.0,
      "end": 800.0,
      "winner": "PER",
      "dt_winner": 3.7113,
      "delta_dt": 0.0406,
      "v_entry": 86.7,
      "v_exit": 157.2
    },
    {
      "id": 8,
      "start": 800.0,
      "end": 900.0,
      "winner": "PER",
      "dt_winner": 1.9077,
      "delta_dt": 0.0308,
      "v_entry": 157.2,
      "v_exit": 216.1
    },
    {
      "id": 9,
      "start": 900.0,
      "end": 1000.0,
      "winner": "PER",
      "dt_winner": 1.5515,
      "delta_dt": 0.0035,
      "v_entry": 216.1,
      "v_exit": 247.7
    },
    {
      "id": 10,
      "start": 1000.0,
      "end": 1100.0,
      "winner": "PER",
      "dt_winner": 1.3841,
      "delta_dt": 0.0038,
      "v_entry": 247.7,
      "v_exit": 271.6
    },
    {
      "id": 11,
      "start": 1100.0,
      "end": 1200.0,
      "winner": "PER",
      "dt_winner": 1.2804,
      "delta_dt": 0.0039,
      "v_entry": 271.6,
      "v_exit": 288.8
    },
    {
      "id": 12,
      "start": 1200.0,
      "end": 1300.0,
      "winner": "PER",
      "dt_winner": 1.2218,
      "delta_dt": 0.0046,
      "v_entry": 288.8,
      "v_exit": 299.5
    },
    {
      "id": 13,
      "start": 1300.0,
      "end": 1400.0,
      "winner": "PER",
      "dt_winner": 1.1925,
      "delta_dt": 0.0067,
      "v_entry": 299.5,
      "v_exit": 287.2
    },
    {
      "id": 14,
      "start": 1400.0,
      "end": 1500.0,
      "winner": "VER",
      "dt_winner": 1.9183,
      "delta_dt": 0.0676,
      "v_entry": 287.5,
      "v_exit": 135.7
    },
    {
      "id": 15,
      "start": 1500.0,
      "end": 1600.0,
      "winner": "VER",
      "dt_winner": 2.5136,
      "delta_dt": 0.0263,
      "v_entry": 135.7,
      "v_exit": 180.9
    },
    {
      "id": 16,
      "start": 1600.0,
      "end": 1700.0,
      "winner": "PER",
      "dt_winner": 1.7242,
      "delta_dt": 0.0089,
      "v_entry": 183.5,
      "v_exit": 230.3
    },
    {
      "id": 17,
      "start": 1700.0,
      "end": 1800.0,
      "winner": "PER",
      "dt_winner": 1.4731,
      "delta_dt": 0.0006,
      "v_entry": 230.3,
      "v_exit": 253.7
    },
    {
      "id": 18,
      "start": 1800.0,
      "end": 1900.0,
      "winner": "VER",
      "dt_winner": 1.5944,
      "delta_dt": 0.0337,
      "v_entry": 252.4,
      "v_exit": 213.2
    },
    {
      "id": 19,
      "start": 1900.0,
      "end": 2000.0,
      "winner": "VER",
      "dt_winner": 1.5861,
      "delta_dt": 0.0077,
      "v_entry": 213.2,
      "v_exit": 235.8
    },
    {
      "id": 20,
      "start": 2000.0,
      "end": 2100.0,
      "winner": "PER",
      "dt_winner": 1.451,
      "delta_dt": 0.0101,
      "v_entry": 238.8,
      "v_exit": 255.7
    },
    {
      "id": 21,
      "start": 2100.0,
      "end": 2200.0,
      "winner": "PER",
      "dt_winner": 2.0132,
      "delta_dt": 0.2224,
      "v_entry": 255.7,
      "v_exit": 104.8
    },
    {
      "id": 22,
      "start": 2200.0,
      "end": 2300.0,
      "winner": "VER",
      "dt_winner": 3.5846,
      "delta_dt": 0.1119,
      "v_entry": 100.5,
      "v_exit": 145.3
    },
    {
      "id": 23,
      "start": 2300.0,
      "end": 2400.0,
      "winner": "VER",
      "dt_winner": 1.9144,
      "delta_dt": 0.0349,
      "v_entry": 145.3,
      "v_exit": 219.5
    },
    {
      "id": 24,
      "start": 2400.0,
      "end": 2500.0,
      "winner": "PER",
      "dt_winner": 1.5304,
      "delta_dt": 0.0009,
      "v_entry": 218.8,
      "v_exit": 250.5
    },
    {
      "id": 25,
      "start": 2500.0,
      "end": 2600.0,
      "winner": "PER",
      "dt_winner": 1.433,
      "delta_dt": 0.0854,
      "v_entry": 250.5,
      "v_exit": 221.1
    },
    {
      "id": 26,
      "start": 2600.0,
      "end": 2700.0,
      "winner": "PER",
      "dt_winner": 2.9535,
      "delta_dt": 0.3199,
      "v_entry": 221.1,
      "v_exit": 76.2
    },
    {
      "id": 27,
      "start": 2700.0,
      "end": 2800.0,
      "winner": "VER",
      "dt_winner": 2.5928,
      "delta_dt": 0.3896,
      "v_entry": 84.5,
      "v_exit": 196.3
    },
    {
      "id": 28,
      "start": 2800.0,
      "end": 2900.0,
      "winner": "VER",
      "dt_winner": 1.6159,
      "delta_dt": 0.0415,
      "v_entry": 196.3,
      "v_exit": 244.8
    },
    {
      "id": 29,
      "start": 2900.0,
      "end": 3000.0,
      "winner": "VER",
      "dt_winner": 1.3943,
      "delta_dt": 0.0115,
      "v_entry": 244.8,
      "v_exit": 269.5
    },
    {
      "id": 30,
      "start": 3000.0,
      "end": 3100.0,
      "winner": "VER",
      "dt_winner": 1.2817,
      "delta_dt": 0.0086,
      "v_entry": 269.5,
      "v_exit": 289.4
    },
    {
      "id": 31,
      "start": 3100.0,
      "end": 3200.0,
      "winner": "VER",
      "dt_winner": 1.2237,
      "delta_dt": 0.0031,
      "v_entry": 289.4,
      "v_exit": 299.3
    },
    {
      "id": 32,
      "start": 3200.0,
      "end": 3300.0,
      "winner": "VER",
      "dt_winner": 1.1859,
      "delta_dt": 0.0019,
      "v_entry": 299.3,
      "v_exit": 301.1
    },
    {
      "id": 33,
      "start": 3300.0,
      "end": 3400.0,
      "winner": "PER",
      "dt_winner": 1.5443,
      "delta_dt": 0.0443,
      "v_entry": 302.7,
      "v_exit": 176.7
    },
    {
      "id": 34,
      "start": 3400.0,
      "end": 3500.0,
      "winner": "PER",
      "dt_winner": 1.9862,
      "delta_dt": 0.0138,
      "v_entry": 176.7,
      "v_exit": 201.2
    },
    {
      "id": 35,
      "start": 3500.0,
      "end": 3600.0,
      "winner": "PER",
      "dt_winner": 1.629,
      "delta_dt": 0.0057,
      "v_entry": 201.2,
      "v_exit": 238.1
    },
    {
      "id": 36,
      "start": 3600.0,
      "end": 3700.0,
      "winner": "PER",
      "dt_winner": 1.4466,
      "delta_dt": 0.0034,
      "v_entry": 238.1,
      "v_exit": 257.4
    },
    {
      "id": 37,
      "start": 3700.0,
      "end": 3800.0,
      "winner": "PER",
      "dt_winner": 1.3784,
      "delta_dt": 0.0015,
      "v_entry": 257.4,
      "v_exit": 264.0
    },
    {
      "id": 38,
      "start": 3800.0,
      "end": 3900.0,
      "winner": "PER",
      "dt_winner": 1.351,
      "delta_dt": 0.0014,
      "v_entry": 264.0,
      "v_exit": 269.7
    },
    {
      "id": 39,
      "start": 3900.0,
      "end": 4000.0,
      "winner": "VER",
      "dt_winner": 1.3672,
      "delta_dt": 0.0402,
      "v_entry": 269.2,
      "v_exit": 214.1
    },
    {
      "id": 40,
      "start": 4000.0,
      "end": 4100.0,
      "winner": "VER",
      "dt_winner": 2.2002,
      "delta_dt": 0.0352,
      "v_entry": 214.1,
      "v_exit": 154.0
    },
    {
      "id": 41,
      "start": 4100.0,
      "end": 4200.0,
      "winner": "VER",
      "dt_winner": 1.9399,
      "delta_dt": 0.0235,
      "v_entry": 154.0,
      "v_exit": 216.6
    },
    {
      "id": 42,
      "start": 4200.0,
      "end": 4300.0,
      "winner": "VER",
      "dt_winner": 1.5277,
      "delta_dt": 0.0142,
      "v_entry": 216.6,
      "v_exit": 251.5
    },
    {
      "id": 43,
      "start": 4300.0,
      "end": 4400.0,
      "winner": "VER",
      "dt_winner": 1.3775,
      "delta_dt": 0.0047,
      "v_entry": 251.5,
      "v_exit": 270.9
    },
    {
      "id": 44,
      "start": 4400.0,
      "end": 4500.0,
      "winner": "VER",
      "dt_winner": 1.2995,
      "delta_dt": 0.0009,
      "v_entry": 270.9,
      "v_exit": 282.7
    },
    {
      "id": 45,
      "start": 4500.0,
      "end": 4600.0,
      "winner": "VER",
      "dt_winner": 1.2536,
      "delta_dt": 0.0006,
      "v_entry": 282.7,
      "v_exit": 291.0
    },
    {
      "id": 46,
      "start": 4600.0,
      "end": 4700.0,
      "winner": "PER",
      "dt_winner": 1.2259,
      "delta_dt": 0.0037,
      "v_entry": 291.5,
      "v_exit": 295.0
    },
    {
      "id": 47,
      "start": 4700.0,
      "end": 4800.0,
      "winner": "VER",
      "dt_winner": 1.3043,
      "delta_dt": 0.0044,
      "v_entry": 294.0,
      "v_exit": 216.5
    },
    {
      "id": 48,
      "start": 4800.0,
      "end": 4900.0,
      "winner": "PER",
      "dt_winner": 2.429,
      "delta_dt": 0.0046,
      "v_entry": 211.2,
      "v_exit": 134.0
    },
    {
      "id": 49,
      "start": 4900.0,
      "end": 5000.0,
      "winner": "VER",
      "dt_winner": 2.0936,
      "delta_dt": 0.0674,
      "v_entry": 133.8,
      "v_exit": 209.0
    },
    {
      "id": 50,
      "start": 5000.0,
      "end": 5100.0,
      "winner": "VER",
      "dt_winner": 1.5737,
      "delta_dt": 0.0136,
      "v_entry": 209.0,
      "v_exit": 245.0
    },
    {
      "id": 51,
      "start": 5100.0,
      "end": 5200.0,
      "winner": "VER",
      "dt_winner": 1.408,
      "delta_dt": 0.0018,
      "v_entry": 245.0,
      "v_exit": 266.0
    },
    {
      "id": 52,
      "start": 5200.0,
      "end": 5300.0,
      "winner": "VER",
      "dt_winner": 1.3126,
      "delta_dt": 0.0039,
      "v_entry": 266.0,
      "v_exit": 282.8
    },
    {
      "id": 53,
      "start": 5300.0,
      "end": 5358.0,
      "winner": "VER",
      "dt_winner": 0.7255,
      "delta_dt": 0.0008,
      "v_entry": 282.8,
      "v_exit": 292.0
    }
  ],
  "250m": [
    {
      "id": 0,
      "start": 0.0,
      "end": 250.0,
      "winner": "PER",
      "dt_winner": 2.9435,
      "delta_dt": 0.0119,
      "v_entry": 293.5,
      "v_exit": 315.3
    },
    {
      "id": 1,
      "start": 250.0,
      "end": 500.0,
      "winner": "PER",
      "dt_winner": 2.8104,
      "delta_dt": 0.0079,
      "v_entry": 315.3,
      "v_exit": 323.1
    },
    {
      "id": 2,
      "start": 500.0,
      "end": 750.0,
      "winner": "PER",
      "dt_winner": 5.6146,
      "delta_dt": 0.1412,
      "v_entry": 323.1,
      "v_exit": 97.2
    },
    {
      "id": 3,
      "start": 750.0,
      "end": 1000.0,
      "winner": "PER",
      "dt_winner": 4.869,
      "delta_dt": 0.0104,
      "v_entry": 97.2,
      "v_exit": 247.7
    },
    {
      "id": 4,
      "start": 1000.0,
      "end": 1250.0,
      "winner": "PER",
      "dt_winner": 3.281,
      "delta_dt": 0.0102,
      "v_entry": 247.7,
      "v_exit": 294.9
    },
    {
      "id": 5,
      "start": 1250.0,
      "end": 1500.0,
      "winner": "VER",
      "dt_winner": 3.7248,
      "delta_dt": 0.0588,
      "v_entry": 293.9,
      "v_exit": 135.7
    },
    {
      "id": 6,
      "start": 1500.0,
      "end": 1750.0,
      "winner": "VER",
      "dt_winner": 5.0023,
      "delta_dt": 0.0168,
      "v_entry": 135.7,
      "v_exit": 245.6
    },
    {
      "id": 7,
      "start": 1750.0,
      "end": 2000.0,
      "winner": "VER",
      "dt_winner": 3.8986,
      "delta_dt": 0.0414,
      "v_entry": 245.6,
      "v_exit": 235.8
    },
    {
      "id": 8,
      "start": 2000.0,
      "end": 2250.0,
      "winner": "PER",
      "dt_winner": 5.5371,
      "delta_dt": 0.2203,
      "v_entry": 238.8,
      "v_exit": 88.7
    },
    {
      "id": 9,
      "start": 2250.0,
      "end": 2500.0,
      "winner": "VER",
      "dt_winner": 4.9696,
      "delta_dt": 0.1338,
      "v_entry": 93.3,
      "v_exit": 249.8
    },
    {
      "id": 10,
      "start": 2500.0,
      "end": 2750.0,
      "winner": "PER",
      "dt_winner": 6.241,
      "delta_dt": 0.1285,
      "v_entry": 250.5,
      "v_exit": 133.9
    },
    {
      "id": 11,
      "start": 2750.0,
      "end": 3000.0,
      "winner": "VER",
      "dt_winner": 4.0253,
      "delta_dt": 0.1658,
      "v_entry": 155.1,
      "v_exit": 269.5
    },
    {
      "id": 12,
      "start": 3000.0,
      "end": 3250.0,
      "winner": "VER",
      "dt_winner": 3.1016,
      "delta_dt": 0.013,
      "v_entry": 269.5,
      "v_exit": 303.7
    },
    {
      "id": 13,
      "start": 3250.0,
      "end": 3500.0,
      "winner": "PER",
      "dt_winner": 4.1209,
      "delta_dt": 0.0574,
      "v_entry": 304.2,
      "v_exit": 201.2
    },
    {
      "id": 14,
      "start": 3500.0,
      "end": 3750.0,
      "winner": "PER",
      "dt_winner": 3.7692,
      "delta_dt": 0.0105,
      "v_entry": 201.2,
      "v_exit": 261.1
    },
    {
      "id": 15,
      "start": 3750.0,
      "end": 4000.0,
      "winner": "VER",
      "dt_winner": 3.4045,
      "delta_dt": 0.0387,
      "v_entry": 261.5,
      "v_exit": 214.1
    },
    {
      "id": 16,
      "start": 4000.0,
      "end": 4250.0,
      "winner": "VER",
      "dt_winner": 4.9287,
      "delta_dt": 0.0709,
      "v_entry": 214.1,
      "v_exit": 235.9
    },
    {
      "id": 17,
      "start": 4250.0,
      "end": 4500.0,
      "winner": "VER",
      "dt_winner": 3.4161,
      "delta_dt": 0.0077,
      "v_entry": 235.9,
      "v_exit": 282.7
    },
    {
      "id": 18,
      "start": 4500.0,
      "end": 4750.0,
      "winner": "PER",
      "dt_winner": 3.0887,
      "delta_dt": 0.0049,
      "v_entry": 283.3,
      "v_exit": 295.4
    },
    {
      "id": 19,
      "start": 4750.0,
      "end": 5000.0,
      "winner": "VER",
      "dt_winner": 5.221,
      "delta_dt": 0.0691,
      "v_entry": 295.8,
      "v_exit": 209.0
    },
    {
      "id": 20,
      "start": 5000.0,
      "end": 5250.0,
      "winner": "VER",
      "dt_winner": 3.6484,
      "delta_dt": 0.0185,
      "v_entry": 209.0,
      "v_exit": 274.2
    },
    {
      "id": 21,
      "start": 5250.0,
      "end": 5358.0,
      "winner": "VER",
      "dt_winner": 1.3714,
      "delta_dt": 0.0016,
      "v_entry": 274.2,
      "v_exit": 292.0
    }
  ]
},
  boundaryJumps100m: [
  {
    "s": 1400.0,
    "from_driver": "PER",
    "to_driver": "VER",
    "delta_v_mps": 0.073,
    "abs_delta_v_kmh": 0.26,
    "abs_delta_energy_kj": 4.75
  },
  {
    "s": 1600.0,
    "from_driver": "VER",
    "to_driver": "PER",
    "delta_v_mps": 0.728,
    "abs_delta_v_kmh": 2.62,
    "abs_delta_energy_kj": 29.86
  },
  {
    "s": 1800.0,
    "from_driver": "PER",
    "to_driver": "VER",
    "delta_v_mps": -0.369,
    "abs_delta_v_kmh": 1.33,
    "abs_delta_energy_kj": 20.99
  },
  {
    "s": 2000.0,
    "from_driver": "VER",
    "to_driver": "PER",
    "delta_v_mps": 0.834,
    "abs_delta_v_kmh": 3.0,
    "abs_delta_energy_kj": 44.53
  },
  {
    "s": 2200.0,
    "from_driver": "PER",
    "to_driver": "VER",
    "delta_v_mps": -1.202,
    "abs_delta_v_kmh": 4.33,
    "abs_delta_energy_kj": 27.77
  },
  {
    "s": 2400.0,
    "from_driver": "VER",
    "to_driver": "PER",
    "delta_v_mps": -0.199,
    "abs_delta_v_kmh": 0.72,
    "abs_delta_energy_kj": 9.8
  },
  {
    "s": 2700.0,
    "from_driver": "PER",
    "to_driver": "VER",
    "delta_v_mps": 2.299,
    "abs_delta_v_kmh": 8.28,
    "abs_delta_energy_kj": 41.56
  },
  {
    "s": 3300.0,
    "from_driver": "VER",
    "to_driver": "PER",
    "delta_v_mps": 0.44,
    "abs_delta_v_kmh": 1.58,
    "abs_delta_energy_kj": 29.89
  },
  {
    "s": 3900.0,
    "from_driver": "PER",
    "to_driver": "VER",
    "delta_v_mps": -0.121,
    "abs_delta_v_kmh": 0.43,
    "abs_delta_energy_kj": 7.31
  },
  {
    "s": 4600.0,
    "from_driver": "VER",
    "to_driver": "PER",
    "delta_v_mps": 0.127,
    "abs_delta_v_kmh": 0.46,
    "abs_delta_energy_kj": 8.34
  },
  {
    "s": 4700.0,
    "from_driver": "PER",
    "to_driver": "VER",
    "delta_v_mps": -0.28,
    "abs_delta_v_kmh": 1.01,
    "abs_delta_energy_kj": 18.54
  },
  {
    "s": 4800.0,
    "from_driver": "VER",
    "to_driver": "PER",
    "delta_v_mps": -1.487,
    "abs_delta_v_kmh": 5.35,
    "abs_delta_energy_kj": 71.53
  },
  {
    "s": 4900.0,
    "from_driver": "PER",
    "to_driver": "VER",
    "delta_v_mps": -0.057,
    "abs_delta_v_kmh": 0.21,
    "abs_delta_energy_kj": 1.72
  }
],
};

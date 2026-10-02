// Verified Scientific Research Data from F1-Physics-Constrained-Lap-Analysis
// Generated automatically from data/processed/*.csv
// Ground-Truth: 2023 Bahrain GP Q3 (Ferrari SF-23, Charles Leclerc vs Carlos Sainz)

window.F1_RESEARCH_DATA = {
  overview: {
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
  },
  gapAttribution: [
  {
    "name": "Boundary Kinetic Energy Penalty",
    "symbol": "\u0394T_KE",
    "value": 0.684,
    "desc": "Energy dissipation to reconcile boundary speed step jumps"
  },
  {
    "name": "Boundary Braking Displacement Penalty",
    "symbol": "\u0394T_brake",
    "value": 0.169,
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
    "value": 1.861,
    "desc": "Downstream speed debt propagating along forward integration horizon"
  }
],
  modelValidation: [
  {
    "model": "Level 0: Pure Longitudinal",
    "driver": "LEC (Training)",
    "sim_lap": 101.597,
    "ref_lap": 89.921,
    "error_s": 11.675,
    "rmse_mps": 10.975,
    "top_speed_err": 15.151,
    "periodicity_err": 0.1577,
    "verdict": "FAILED_UNTRUSTABLE"
  },
  {
    "model": "Level 0: Pure Longitudinal",
    "driver": "SAI (Cross-Validation)",
    "sim_lap": 101.185,
    "ref_lap": 90.11,
    "error_s": 11.075,
    "rmse_mps": 10.872,
    "top_speed_err": 15.008,
    "periodicity_err": 1.8064,
    "verdict": "FAILED_UNTRUSTABLE"
  },
  {
    "model": "Level 1: Longitudinal + Aero",
    "driver": "LEC (Training)",
    "sim_lap": 88.26,
    "ref_lap": 89.921,
    "error_s": 1.662,
    "rmse_mps": 3.616,
    "top_speed_err": 4.103,
    "periodicity_err": 2.9721,
    "verdict": "INADEQUATE"
  },
  {
    "model": "Level 1: Longitudinal + Aero",
    "driver": "SAI (Cross-Validation)",
    "sim_lap": 87.593,
    "ref_lap": 90.11,
    "error_s": 2.517,
    "rmse_mps": 3.45,
    "top_speed_err": 4.382,
    "periodicity_err": 3.2785,
    "verdict": "INADEQUATE"
  },
  {
    "model": "Level 2: Coupled + Friction Ellipse",
    "driver": "LEC (Training)",
    "sim_lap": 88.393,
    "ref_lap": 89.921,
    "error_s": 1.529,
    "rmse_mps": 4.289,
    "top_speed_err": 2.415,
    "periodicity_err": 0.0024,
    "verdict": "INADEQUATE"
  },
  {
    "model": "Level 2: Coupled + Friction Ellipse",
    "driver": "SAI (Cross-Validation)",
    "sim_lap": 87.738,
    "ref_lap": 90.11,
    "error_s": 2.371,
    "rmse_mps": 4.699,
    "top_speed_err": 2.111,
    "periodicity_err": 0.0063,
    "verdict": "INADEQUATE"
  }
],
  sensitivity: [
  {
    "res": "50m",
    "segments": 108,
    "t_theo": 88.815,
    "t_feas": 91.269,
    "gap": 2.454,
    "gain_lec": -1.348,
    "retained_fraction": -1.218,
    "switches": 20,
    "max_dv_mps": 3.083,
    "max_dv_kmh": 11.1,
    "total_ke_kj": 673.03,
    "lec_dist_pct": 64.61,
    "sai_dist_pct": 35.39
  },
  {
    "res": "100m",
    "segments": 54,
    "t_theo": 88.869,
    "t_feas": 91.583,
    "gap": 2.714,
    "gain_lec": -1.661,
    "retained_fraction": -1.578,
    "switches": 15,
    "max_dv_mps": 3.251,
    "max_dv_kmh": 11.7,
    "total_ke_kj": 832.24,
    "lec_dist_pct": 64.61,
    "sai_dist_pct": 35.39
  },
  {
    "res": "250m",
    "segments": 22,
    "t_theo": 89.327,
    "t_feas": 92.233,
    "gap": 2.906,
    "gain_lec": -2.312,
    "retained_fraction": -3.89,
    "switches": 11,
    "max_dv_mps": 2.927,
    "max_dv_kmh": 10.54,
    "total_ke_kj": 623.44,
    "lec_dist_pct": 58.09,
    "sai_dist_pct": 41.91
  }
],
  boundaryJumps100m: [
  {
    "s": 700.0,
    "from_driver": "SAI",
    "to_driver": "LEC",
    "delta_v_mps": -3.109,
    "abs_delta_v_kmh": 11.19,
    "abs_delta_energy_kj": 52.07
  },
  {
    "s": 1100.0,
    "from_driver": "LEC",
    "to_driver": "SAI",
    "delta_v_mps": 0.025,
    "abs_delta_v_kmh": 0.09,
    "abs_delta_energy_kj": 1.52
  },
  {
    "s": 1200.0,
    "from_driver": "SAI",
    "to_driver": "LEC",
    "delta_v_mps": -0.156,
    "abs_delta_v_kmh": 0.56,
    "abs_delta_energy_kj": 10.15
  },
  {
    "s": 1400.0,
    "from_driver": "LEC",
    "to_driver": "SAI",
    "delta_v_mps": 3.251,
    "abs_delta_v_kmh": 11.7,
    "abs_delta_energy_kj": 205.95
  },
  {
    "s": 1500.0,
    "from_driver": "SAI",
    "to_driver": "LEC",
    "delta_v_mps": -1.968,
    "abs_delta_v_kmh": 7.08,
    "abs_delta_energy_kj": 56.09
  },
  {
    "s": 2100.0,
    "from_driver": "LEC",
    "to_driver": "SAI",
    "delta_v_mps": -1.862,
    "abs_delta_v_kmh": 6.7,
    "abs_delta_energy_kj": 106.8
  },
  {
    "s": 2200.0,
    "from_driver": "SAI",
    "to_driver": "LEC",
    "delta_v_mps": 0.864,
    "abs_delta_v_kmh": 3.11,
    "abs_delta_energy_kj": 17.93
  },
  {
    "s": 2300.0,
    "from_driver": "LEC",
    "to_driver": "SAI",
    "delta_v_mps": 0.052,
    "abs_delta_v_kmh": 0.19,
    "abs_delta_energy_kj": 1.82
  },
  {
    "s": 2700.0,
    "from_driver": "SAI",
    "to_driver": "LEC",
    "delta_v_mps": 0.746,
    "abs_delta_v_kmh": 2.69,
    "abs_delta_energy_kj": 14.02
  },
  {
    "s": 3300.0,
    "from_driver": "LEC",
    "to_driver": "SAI",
    "delta_v_mps": 0.686,
    "abs_delta_v_kmh": 2.47,
    "abs_delta_energy_kj": 46.86
  },
  {
    "s": 3400.0,
    "from_driver": "SAI",
    "to_driver": "LEC",
    "delta_v_mps": -3.087,
    "abs_delta_v_kmh": 11.11,
    "abs_delta_energy_kj": 122.23
  },
  {
    "s": 3900.0,
    "from_driver": "LEC",
    "to_driver": "SAI",
    "delta_v_mps": -0.459,
    "abs_delta_v_kmh": 1.65,
    "abs_delta_energy_kj": 27.98
  },
  {
    "s": 4100.0,
    "from_driver": "SAI",
    "to_driver": "LEC",
    "delta_v_mps": 3.083,
    "abs_delta_v_kmh": 11.1,
    "abs_delta_energy_kj": 101.55
  },
  {
    "s": 4700.0,
    "from_driver": "LEC",
    "to_driver": "SAI",
    "delta_v_mps": -0.695,
    "abs_delta_v_kmh": 2.5,
    "abs_delta_energy_kj": 46.55
  },
  {
    "s": 4900.0,
    "from_driver": "SAI",
    "to_driver": "LEC",
    "delta_v_mps": 0.714,
    "abs_delta_v_kmh": 2.57,
    "abs_delta_energy_kj": 20.71
  }
],
  segments: {
  "50m": [
    {
      "id": 0,
      "start": 0.0,
      "end": 50.0,
      "winner": "LEC",
      "dt_winner": 0.6054,
      "delta_dt": 0.0006,
      "v_entry": 294.0,
      "v_exit": 300.6
    },
    {
      "id": 1,
      "start": 50.0,
      "end": 100.0,
      "winner": "SAI",
      "dt_winner": 0.5934,
      "delta_dt": 0.0018,
      "v_entry": 301.1,
      "v_exit": 305.0
    },
    {
      "id": 2,
      "start": 100.0,
      "end": 150.0,
      "winner": "SAI",
      "dt_winner": 0.5844,
      "delta_dt": 0.0016,
      "v_entry": 305.0,
      "v_exit": 309.5
    },
    {
      "id": 3,
      "start": 150.0,
      "end": 200.0,
      "winner": "SAI",
      "dt_winner": 0.5793,
      "delta_dt": 0.0003,
      "v_entry": 309.5,
      "v_exit": 313.0
    },
    {
      "id": 4,
      "start": 200.0,
      "end": 250.0,
      "winner": "SAI",
      "dt_winner": 0.571,
      "delta_dt": 0.0019,
      "v_entry": 313.0,
      "v_exit": 316.7
    },
    {
      "id": 5,
      "start": 250.0,
      "end": 300.0,
      "winner": "SAI",
      "dt_winner": 0.5651,
      "delta_dt": 0.0036,
      "v_entry": 316.7,
      "v_exit": 320.5
    },
    {
      "id": 6,
      "start": 300.0,
      "end": 350.0,
      "winner": "SAI",
      "dt_winner": 0.5615,
      "delta_dt": 0.001,
      "v_entry": 320.5,
      "v_exit": 321.0
    },
    {
      "id": 7,
      "start": 350.0,
      "end": 400.0,
      "winner": "SAI",
      "dt_winner": 0.5589,
      "delta_dt": 0.0007,
      "v_entry": 321.0,
      "v_exit": 323.0
    },
    {
      "id": 8,
      "start": 400.0,
      "end": 450.0,
      "winner": "SAI",
      "dt_winner": 0.5555,
      "delta_dt": 0.002,
      "v_entry": 323.0,
      "v_exit": 325.9
    },
    {
      "id": 9,
      "start": 450.0,
      "end": 500.0,
      "winner": "SAI",
      "dt_winner": 0.5536,
      "delta_dt": 0.0015,
      "v_entry": 325.9,
      "v_exit": 325.0
    },
    {
      "id": 10,
      "start": 500.0,
      "end": 550.0,
      "winner": "SAI",
      "dt_winner": 0.5532,
      "delta_dt": 0.0012,
      "v_entry": 325.0,
      "v_exit": 324.8
    },
    {
      "id": 11,
      "start": 550.0,
      "end": 600.0,
      "winner": "SAI",
      "dt_winner": 0.5589,
      "delta_dt": 0.0016,
      "v_entry": 324.8,
      "v_exit": 313.0
    },
    {
      "id": 12,
      "start": 600.0,
      "end": 650.0,
      "winner": "SAI",
      "dt_winner": 0.7046,
      "delta_dt": 0.0074,
      "v_entry": 313.0,
      "v_exit": 190.5
    },
    {
      "id": 13,
      "start": 650.0,
      "end": 700.0,
      "winner": "SAI",
      "dt_winner": 1.488,
      "delta_dt": 0.1495,
      "v_entry": 190.5,
      "v_exit": 80.0
    },
    {
      "id": 14,
      "start": 700.0,
      "end": 750.0,
      "winner": "SAI",
      "dt_winner": 2.4039,
      "delta_dt": 0.0269,
      "v_entry": 80.0,
      "v_exit": 94.5
    },
    {
      "id": 15,
      "start": 750.0,
      "end": 800.0,
      "winner": "LEC",
      "dt_winner": 1.3233,
      "delta_dt": 0.07,
      "v_entry": 101.3,
      "v_exit": 162.7
    },
    {
      "id": 16,
      "start": 800.0,
      "end": 850.0,
      "winner": "LEC",
      "dt_winner": 1.0013,
      "delta_dt": 0.0118,
      "v_entry": 162.7,
      "v_exit": 196.2
    },
    {
      "id": 17,
      "start": 850.0,
      "end": 900.0,
      "winner": "LEC",
      "dt_winner": 0.8615,
      "delta_dt": 0.0113,
      "v_entry": 196.2,
      "v_exit": 221.0
    },
    {
      "id": 18,
      "start": 900.0,
      "end": 950.0,
      "winner": "LEC",
      "dt_winner": 0.7872,
      "delta_dt": 0.0088,
      "v_entry": 221.0,
      "v_exit": 235.8
    },
    {
      "id": 19,
      "start": 950.0,
      "end": 1000.0,
      "winner": "LEC",
      "dt_winner": 0.7442,
      "delta_dt": 0.0102,
      "v_entry": 235.8,
      "v_exit": 248.2
    },
    {
      "id": 20,
      "start": 1000.0,
      "end": 1050.0,
      "winner": "LEC",
      "dt_winner": 0.7069,
      "delta_dt": 0.001,
      "v_entry": 248.2,
      "v_exit": 261.4
    },
    {
      "id": 21,
      "start": 1050.0,
      "end": 1100.0,
      "winner": "LEC",
      "dt_winner": 0.6729,
      "delta_dt": 0.0012,
      "v_entry": 261.4,
      "v_exit": 272.6
    },
    {
      "id": 22,
      "start": 1100.0,
      "end": 1150.0,
      "winner": "SAI",
      "dt_winner": 0.6494,
      "delta_dt": 0.0006,
      "v_entry": 272.7,
      "v_exit": 281.8
    },
    {
      "id": 23,
      "start": 1150.0,
      "end": 1200.0,
      "winner": "SAI",
      "dt_winner": 0.6299,
      "delta_dt": 0.002,
      "v_entry": 281.8,
      "v_exit": 289.3
    },
    {
      "id": 24,
      "start": 1200.0,
      "end": 1250.0,
      "winner": "LEC",
      "dt_winner": 0.6158,
      "delta_dt": 0.0017,
      "v_entry": 288.8,
      "v_exit": 295.7
    },
    {
      "id": 25,
      "start": 1250.0,
      "end": 1300.0,
      "winner": "LEC",
      "dt_winner": 0.6029,
      "delta_dt": 0.0023,
      "v_entry": 295.7,
      "v_exit": 300.8
    },
    {
      "id": 26,
      "start": 1300.0,
      "end": 1350.0,
      "winner": "LEC",
      "dt_winner": 0.5946,
      "delta_dt": 0.0009,
      "v_entry": 300.8,
      "v_exit": 304.0
    },
    {
      "id": 27,
      "start": 1350.0,
      "end": 1400.0,
      "winner": "SAI",
      "dt_winner": 0.5991,
      "delta_dt": 0.0006,
      "v_entry": 304.0,
      "v_exit": 287.4
    },
    {
      "id": 28,
      "start": 1400.0,
      "end": 1450.0,
      "winner": "SAI",
      "dt_winner": 0.7794,
      "delta_dt": 0.0316,
      "v_entry": 287.4,
      "v_exit": 182.6
    },
    {
      "id": 29,
      "start": 1450.0,
      "end": 1500.0,
      "winner": "SAI",
      "dt_winner": 1.2171,
      "delta_dt": 0.0721,
      "v_entry": 182.6,
      "v_exit": 130.2
    },
    {
      "id": 30,
      "start": 1500.0,
      "end": 1550.0,
      "winner": "SAI",
      "dt_winner": 1.3612,
      "delta_dt": 0.0057,
      "v_entry": 130.2,
      "v_exit": 139.7
    },
    {
      "id": 31,
      "start": 1550.0,
      "end": 1600.0,
      "winner": "LEC",
      "dt_winner": 1.1058,
      "delta_dt": 0.0476,
      "v_entry": 146.4,
      "v_exit": 180.5
    },
    {
      "id": 32,
      "start": 1600.0,
      "end": 1650.0,
      "winner": "LEC",
      "dt_winner": 0.9022,
      "delta_dt": 0.0236,
      "v_entry": 180.5,
      "v_exit": 216.9
    },
    {
      "id": 33,
      "start": 1650.0,
      "end": 1700.0,
      "winner": "LEC",
      "dt_winner": 0.794,
      "delta_dt": 0.0262,
      "v_entry": 216.9,
      "v_exit": 236.2
    },
    {
      "id": 34,
      "start": 1700.0,
      "end": 1750.0,
      "winner": "LEC",
      "dt_winner": 0.7461,
      "delta_dt": 0.0069,
      "v_entry": 236.2,
      "v_exit": 247.8
    },
    {
      "id": 35,
      "start": 1750.0,
      "end": 1800.0,
      "winner": "LEC",
      "dt_winner": 0.7203,
      "delta_dt": 0.0123,
      "v_entry": 247.8,
      "v_exit": 246.2
    },
    {
      "id": 36,
      "start": 1800.0,
      "end": 1850.0,
      "winner": "LEC",
      "dt_winner": 0.7841,
      "delta_dt": 0.0084,
      "v_entry": 246.2,
      "v_exit": 215.1
    },
    {
      "id": 37,
      "start": 1850.0,
      "end": 1900.0,
      "winner": "LEC",
      "dt_winner": 0.8393,
      "delta_dt": 0.0195,
      "v_entry": 215.1,
      "v_exit": 217.9
    },
    {
      "id": 38,
      "start": 1900.0,
      "end": 1950.0,
      "winner": "LEC",
      "dt_winner": 0.7978,
      "delta_dt": 0.0251,
      "v_entry": 217.9,
      "v_exit": 234.5
    },
    {
      "id": 39,
      "start": 1950.0,
      "end": 2000.0,
      "winner": "LEC",
      "dt_winner": 0.7579,
      "delta_dt": 0.0245,
      "v_entry": 234.5,
      "v_exit": 241.5
    },
    {
      "id": 40,
      "start": 2000.0,
      "end": 2050.0,
      "winner": "LEC",
      "dt_winner": 0.7315,
      "delta_dt": 0.0207,
      "v_entry": 241.5,
      "v_exit": 251.0
    },
    {
      "id": 41,
      "start": 2050.0,
      "end": 2100.0,
      "winner": "LEC",
      "dt_winner": 0.7074,
      "delta_dt": 0.0165,
      "v_entry": 251.0,
      "v_exit": 258.3
    },
    {
      "id": 42,
      "start": 2100.0,
      "end": 2150.0,
      "winner": "SAI",
      "dt_winner": 0.7831,
      "delta_dt": 0.0252,
      "v_entry": 251.6,
      "v_exit": 190.3
    },
    {
      "id": 43,
      "start": 2150.0,
      "end": 2200.0,
      "winner": "SAI",
      "dt_winner": 1.4159,
      "delta_dt": 0.0468,
      "v_entry": 190.3,
      "v_exit": 90.7
    },
    {
      "id": 44,
      "start": 2200.0,
      "end": 2250.0,
      "winner": "LEC",
      "dt_winner": 2.0788,
      "delta_dt": 0.0656,
      "v_entry": 93.9,
      "v_exit": 96.5
    },
    {
      "id": 45,
      "start": 2250.0,
      "end": 2300.0,
      "winner": "LEC",
      "dt_winner": 1.4703,
      "delta_dt": 0.0257,
      "v_entry": 96.5,
      "v_exit": 155.1
    },
    {
      "id": 46,
      "start": 2300.0,
      "end": 2350.0,
      "winner": "LEC",
      "dt_winner": 1.0204,
      "delta_dt": 0.0013,
      "v_entry": 155.1,
      "v_exit": 196.9
    },
    {
      "id": 47,
      "start": 2350.0,
      "end": 2400.0,
      "winner": "SAI",
      "dt_winner": 0.8571,
      "delta_dt": 0.002,
      "v_entry": 199.5,
      "v_exit": 222.8
    },
    {
      "id": 48,
      "start": 2400.0,
      "end": 2450.0,
      "winner": "SAI",
      "dt_winner": 0.7761,
      "delta_dt": 0.004,
      "v_entry": 222.8,
      "v_exit": 240.5
    },
    {
      "id": 49,
      "start": 2450.0,
      "end": 2500.0,
      "winner": "SAI",
      "dt_winner": 0.7302,
      "delta_dt": 0.0002,
      "v_entry": 240.5,
      "v_exit": 253.7
    },
    {
      "id": 50,
      "start": 2500.0,
      "end": 2550.0,
      "winner": "LEC",
      "dt_winner": 0.6982,
      "delta_dt": 0.0029,
      "v_entry": 252.9,
      "v_exit": 261.0
    },
    {
      "id": 51,
      "start": 2550.0,
      "end": 2600.0,
      "winner": "SAI",
      "dt_winner": 0.7291,
      "delta_dt": 0.005,
      "v_entry": 259.4,
      "v_exit": 217.7
    },
    {
      "id": 52,
      "start": 2600.0,
      "end": 2650.0,
      "winner": "SAI",
      "dt_winner": 1.1008,
      "delta_dt": 0.1046,
      "v_entry": 217.7,
      "v_exit": 116.9
    },
    {
      "id": 53,
      "start": 2650.0,
      "end": 2700.0,
      "winner": "SAI",
      "dt_winner": 2.1812,
      "delta_dt": 0.0355,
      "v_entry": 116.9,
      "v_exit": 82.1
    },
    {
      "id": 54,
      "start": 2700.0,
      "end": 2750.0,
      "winner": "LEC",
      "dt_winner": 1.5955,
      "delta_dt": 0.0294,
      "v_entry": 84.8,
      "v_exit": 151.0
    },
    {
      "id": 55,
      "start": 2750.0,
      "end": 2800.0,
      "winner": "LEC",
      "dt_winner": 1.0253,
      "delta_dt": 0.0778,
      "v_entry": 151.0,
      "v_exit": 197.6
    },
    {
      "id": 56,
      "start": 2800.0,
      "end": 2850.0,
      "winner": "LEC",
      "dt_winner": 0.8559,
      "delta_dt": 0.0301,
      "v_entry": 197.6,
      "v_exit": 223.6
    },
    {
      "id": 57,
      "start": 2850.0,
      "end": 2900.0,
      "winner": "LEC",
      "dt_winner": 0.7689,
      "delta_dt": 0.0126,
      "v_entry": 223.6,
      "v_exit": 240.9
    },
    {
      "id": 58,
      "start": 2900.0,
      "end": 2950.0,
      "winner": "LEC",
      "dt_winner": 0.714,
      "delta_dt": 0.0107,
      "v_entry": 240.9,
      "v_exit": 260.9
    },
    {
      "id": 59,
      "start": 2950.0,
      "end": 3000.0,
      "winner": "LEC",
      "dt_winner": 0.6756,
      "delta_dt": 0.0048,
      "v_entry": 260.9,
      "v_exit": 271.6
    },
    {
      "id": 60,
      "start": 3000.0,
      "end": 3050.0,
      "winner": "LEC",
      "dt_winner": 0.6517,
      "delta_dt": 0.0055,
      "v_entry": 271.6,
      "v_exit": 281.2
    },
    {
      "id": 61,
      "start": 3050.0,
      "end": 3100.0,
      "winner": "LEC",
      "dt_winner": 0.6302,
      "delta_dt": 0.0037,
      "v_entry": 281.2,
      "v_exit": 290.0
    },
    {
      "id": 62,
      "start": 3100.0,
      "end": 3150.0,
      "winner": "LEC",
      "dt_winner": 0.6158,
      "delta_dt": 0.0057,
      "v_entry": 290.0,
      "v_exit": 295.9
    },
    {
      "id": 63,
      "start": 3150.0,
      "end": 3200.0,
      "winner": "LEC",
      "dt_winner": 0.6029,
      "delta_dt": 0.0042,
      "v_entry": 295.9,
      "v_exit": 300.8
    },
    {
      "id": 64,
      "start": 3200.0,
      "end": 3250.0,
      "winner": "LEC",
      "dt_winner": 0.5942,
      "delta_dt": 0.002,
      "v_entry": 300.8,
      "v_exit": 305.9
    },
    {
      "id": 65,
      "start": 3250.0,
      "end": 3300.0,
      "winner": "LEC",
      "dt_winner": 0.5892,
      "delta_dt": 0.0009,
      "v_entry": 305.9,
      "v_exit": 302.5
    },
    {
      "id": 66,
      "start": 3300.0,
      "end": 3350.0,
      "winner": "SAI",
      "dt_winner": 0.612,
      "delta_dt": 0.0697,
      "v_entry": 305.0,
      "v_exit": 259.9
    },
    {
      "id": 67,
      "start": 3350.0,
      "end": 3400.0,
      "winner": "SAI",
      "dt_winner": 0.8527,
      "delta_dt": 0.0887,
      "v_entry": 259.9,
      "v_exit": 181.5
    },
    {
      "id": 68,
      "start": 3400.0,
      "end": 3450.0,
      "winner": "SAI",
      "dt_winner": 1.0556,
      "delta_dt": 0.0059,
      "v_entry": 181.5,
      "v_exit": 167.7
    },
    {
      "id": 69,
      "start": 3450.0,
      "end": 3500.0,
      "winner": "LEC",
      "dt_winner": 0.9589,
      "delta_dt": 0.0491,
      "v_entry": 176.0,
      "v_exit": 200.1
    },
    {
      "id": 70,
      "start": 3500.0,
      "end": 3550.0,
      "winner": "LEC",
      "dt_winner": 0.8489,
      "delta_dt": 0.0251,
      "v_entry": 200.1,
      "v_exit": 219.7
    },
    {
      "id": 71,
      "start": 3550.0,
      "end": 3600.0,
      "winner": "LEC",
      "dt_winner": 0.7859,
      "delta_dt": 0.0164,
      "v_entry": 219.7,
      "v_exit": 236.2
    },
    {
      "id": 72,
      "start": 3600.0,
      "end": 3650.0,
      "winner": "LEC",
      "dt_winner": 0.743,
      "delta_dt": 0.014,
      "v_entry": 236.2,
      "v_exit": 248.7
    },
    {
      "id": 73,
      "start": 3650.0,
      "end": 3700.0,
      "winner": "LEC",
      "dt_winner": 0.7076,
      "delta_dt": 0.0152,
      "v_entry": 248.7,
      "v_exit": 258.0
    },
    {
      "id": 74,
      "start": 3700.0,
      "end": 3750.0,
      "winner": "LEC",
      "dt_winner": 0.6939,
      "delta_dt": 0.0088,
      "v_entry": 258.0,
      "v_exit": 262.2
    },
    {
      "id": 75,
      "start": 3750.0,
      "end": 3800.0,
      "winner": "LEC",
      "dt_winner": 0.6829,
      "delta_dt": 0.0035,
      "v_entry": 262.2,
      "v_exit": 265.2
    },
    {
      "id": 76,
      "start": 3800.0,
      "end": 3850.0,
      "winner": "SAI",
      "dt_winner": 0.6736,
      "delta_dt": 0.0011,
      "v_entry": 264.7,
      "v_exit": 269.0
    },
    {
      "id": 77,
      "start": 3850.0,
      "end": 3900.0,
      "winner": "LEC",
      "dt_winner": 0.6668,
      "delta_dt": 0.0015,
      "v_entry": 268.6,
      "v_exit": 272.0
    },
    {
      "id": 78,
      "start": 3900.0,
      "end": 3950.0,
      "winner": "LEC",
      "dt_winner": 0.6604,
      "delta_dt": 0.0041,
      "v_entry": 272.0,
      "v_exit": 273.0
    },
    {
      "id": 79,
      "start": 3950.0,
      "end": 4000.0,
      "winner": "SAI",
      "dt_winner": 0.6755,
      "delta_dt": 0.0363,
      "v_entry": 271.4,
      "v_exit": 247.7
    },
    {
      "id": 80,
      "start": 4000.0,
      "end": 4050.0,
      "winner": "SAI",
      "dt_winner": 0.9196,
      "delta_dt": 0.1449,
      "v_entry": 247.7,
      "v_exit": 164.0
    },
    {
      "id": 81,
      "start": 4050.0,
      "end": 4100.0,
      "winner": "SAI",
      "dt_winner": 1.2228,
      "delta_dt": 0.034,
      "v_entry": 164.0,
      "v_exit": 140.9
    },
    {
      "id": 82,
      "start": 4100.0,
      "end": 4150.0,
      "winner": "LEC",
      "dt_winner": 1.0844,
      "delta_dt": 0.0791,
      "v_entry": 152.0,
      "v_exit": 185.4
    },
    {
      "id": 83,
      "start": 4150.0,
      "end": 4200.0,
      "winner": "LEC",
      "dt_winner": 0.9021,
      "delta_dt": 0.0438,
      "v_entry": 185.4,
      "v_exit": 214.1
    },
    {
      "id": 84,
      "start": 4200.0,
      "end": 4250.0,
      "winner": "LEC",
      "dt_winner": 0.7989,
      "delta_dt": 0.0299,
      "v_entry": 214.1,
      "v_exit": 234.9
    },
    {
      "id": 85,
      "start": 4250.0,
      "end": 4300.0,
      "winner": "LEC",
      "dt_winner": 0.7421,
      "delta_dt": 0.0187,
      "v_entry": 234.9,
      "v_exit": 250.7
    },
    {
      "id": 86,
      "start": 4300.0,
      "end": 4350.0,
      "winner": "LEC",
      "dt_winner": 0.704,
      "delta_dt": 0.0118,
      "v_entry": 250.7,
      "v_exit": 260.6
    },
    {
      "id": 87,
      "start": 4350.0,
      "end": 4400.0,
      "winner": "LEC",
      "dt_winner": 0.6777,
      "delta_dt": 0.0079,
      "v_entry": 260.6,
      "v_exit": 269.6
    },
    {
      "id": 88,
      "start": 4400.0,
      "end": 4450.0,
      "winner": "LEC",
      "dt_winner": 0.6551,
      "delta_dt": 0.0105,
      "v_entry": 269.6,
      "v_exit": 277.9
    },
    {
      "id": 89,
      "start": 4450.0,
      "end": 4500.0,
      "winner": "LEC",
      "dt_winner": 0.6392,
      "delta_dt": 0.0087,
      "v_entry": 277.9,
      "v_exit": 284.7
    },
    {
      "id": 90,
      "start": 4500.0,
      "end": 4550.0,
      "winner": "LEC",
      "dt_winner": 0.6269,
      "delta_dt": 0.0072,
      "v_entry": 284.7,
      "v_exit": 289.9
    },
    {
      "id": 91,
      "start": 4550.0,
      "end": 4600.0,
      "winner": "LEC",
      "dt_winner": 0.6165,
      "delta_dt": 0.0063,
      "v_entry": 289.9,
      "v_exit": 293.8
    },
    {
      "id": 92,
      "start": 4600.0,
      "end": 4650.0,
      "winner": "LEC",
      "dt_winner": 0.6103,
      "delta_dt": 0.0053,
      "v_entry": 293.8,
      "v_exit": 296.9
    },
    {
      "id": 93,
      "start": 4650.0,
      "end": 4700.0,
      "winner": "LEC",
      "dt_winner": 0.605,
      "delta_dt": 0.0042,
      "v_entry": 296.9,
      "v_exit": 299.0
    },
    {
      "id": 94,
      "start": 4700.0,
      "end": 4750.0,
      "winner": "LEC",
      "dt_winner": 0.6025,
      "delta_dt": 0.0044,
      "v_entry": 299.0,
      "v_exit": 297.7
    },
    {
      "id": 95,
      "start": 4750.0,
      "end": 4800.0,
      "winner": "SAI",
      "dt_winner": 0.6259,
      "delta_dt": 0.0225,
      "v_entry": 295.7,
      "v_exit": 265.9
    },
    {
      "id": 96,
      "start": 4800.0,
      "end": 4850.0,
      "winner": "SAI",
      "dt_winner": 0.8874,
      "delta_dt": 0.1325,
      "v_entry": 265.9,
      "v_exit": 153.6
    },
    {
      "id": 97,
      "start": 4850.0,
      "end": 4900.0,
      "winner": "SAI",
      "dt_winner": 1.3283,
      "delta_dt": 0.0346,
      "v_entry": 153.6,
      "v_exit": 127.7
    },
    {
      "id": 98,
      "start": 4900.0,
      "end": 4950.0,
      "winner": "LEC",
      "dt_winner": 1.2254,
      "delta_dt": 0.0948,
      "v_entry": 130.3,
      "v_exit": 171.2
    },
    {
      "id": 99,
      "start": 4950.0,
      "end": 5000.0,
      "winner": "LEC",
      "dt_winner": 0.952,
      "delta_dt": 0.0824,
      "v_entry": 171.2,
      "v_exit": 204.3
    },
    {
      "id": 100,
      "start": 5000.0,
      "end": 5050.0,
      "winner": "LEC",
      "dt_winner": 0.8278,
      "delta_dt": 0.0352,
      "v_entry": 204.3,
      "v_exit": 229.0
    },
    {
      "id": 101,
      "start": 5050.0,
      "end": 5100.0,
      "winner": "LEC",
      "dt_winner": 0.7556,
      "delta_dt": 0.023,
      "v_entry": 229.0,
      "v_exit": 246.3
    },
    {
      "id": 102,
      "start": 5100.0,
      "end": 5150.0,
      "winner": "LEC",
      "dt_winner": 0.7145,
      "delta_dt": 0.0156,
      "v_entry": 246.3,
      "v_exit": 260.6
    },
    {
      "id": 103,
      "start": 5150.0,
      "end": 5200.0,
      "winner": "LEC",
      "dt_winner": 0.6798,
      "delta_dt": 0.0126,
      "v_entry": 260.6,
      "v_exit": 269.2
    },
    {
      "id": 104,
      "start": 5200.0,
      "end": 5250.0,
      "winner": "LEC",
      "dt_winner": 0.6598,
      "delta_dt": 0.0103,
      "v_entry": 269.2,
      "v_exit": 275.0
    },
    {
      "id": 105,
      "start": 5250.0,
      "end": 5300.0,
      "winner": "LEC",
      "dt_winner": 0.6435,
      "delta_dt": 0.0074,
      "v_entry": 275.0,
      "v_exit": 284.3
    },
    {
      "id": 106,
      "start": 5300.0,
      "end": 5350.0,
      "winner": "LEC",
      "dt_winner": 0.626,
      "delta_dt": 0.0036,
      "v_entry": 284.3,
      "v_exit": 291.2
    },
    {
      "id": 107,
      "start": 5350.0,
      "end": 5369.0,
      "winner": "LEC",
      "dt_winner": 0.2344,
      "delta_dt": 0.0012,
      "v_entry": 291.2,
      "v_exit": 292.4
    }
  ],
  "100m": [
    {
      "id": 0,
      "start": 0.0,
      "end": 100.0,
      "winner": "SAI",
      "dt_winner": 1.1994,
      "delta_dt": 0.0011,
      "v_entry": 294.6,
      "v_exit": 305.0
    },
    {
      "id": 1,
      "start": 100.0,
      "end": 200.0,
      "winner": "SAI",
      "dt_winner": 1.1637,
      "delta_dt": 0.0019,
      "v_entry": 305.0,
      "v_exit": 313.0
    },
    {
      "id": 2,
      "start": 200.0,
      "end": 300.0,
      "winner": "SAI",
      "dt_winner": 1.136,
      "delta_dt": 0.0055,
      "v_entry": 313.0,
      "v_exit": 320.5
    },
    {
      "id": 3,
      "start": 300.0,
      "end": 400.0,
      "winner": "SAI",
      "dt_winner": 1.1204,
      "delta_dt": 0.0017,
      "v_entry": 320.5,
      "v_exit": 323.0
    },
    {
      "id": 4,
      "start": 400.0,
      "end": 500.0,
      "winner": "SAI",
      "dt_winner": 1.1092,
      "delta_dt": 0.0035,
      "v_entry": 323.0,
      "v_exit": 325.0
    },
    {
      "id": 5,
      "start": 500.0,
      "end": 600.0,
      "winner": "SAI",
      "dt_winner": 1.1121,
      "delta_dt": 0.0028,
      "v_entry": 325.0,
      "v_exit": 313.0
    },
    {
      "id": 6,
      "start": 600.0,
      "end": 700.0,
      "winner": "SAI",
      "dt_winner": 2.1925,
      "delta_dt": 0.1569,
      "v_entry": 313.0,
      "v_exit": 80.0
    },
    {
      "id": 7,
      "start": 700.0,
      "end": 800.0,
      "winner": "LEC",
      "dt_winner": 3.7542,
      "delta_dt": 0.0431,
      "v_entry": 68.8,
      "v_exit": 162.7
    },
    {
      "id": 8,
      "start": 800.0,
      "end": 900.0,
      "winner": "LEC",
      "dt_winner": 1.8628,
      "delta_dt": 0.0231,
      "v_entry": 162.7,
      "v_exit": 221.0
    },
    {
      "id": 9,
      "start": 900.0,
      "end": 1000.0,
      "winner": "LEC",
      "dt_winner": 1.5313,
      "delta_dt": 0.019,
      "v_entry": 221.0,
      "v_exit": 248.2
    },
    {
      "id": 10,
      "start": 1000.0,
      "end": 1100.0,
      "winner": "LEC",
      "dt_winner": 1.3798,
      "delta_dt": 0.0021,
      "v_entry": 248.2,
      "v_exit": 272.6
    },
    {
      "id": 11,
      "start": 1100.0,
      "end": 1200.0,
      "winner": "SAI",
      "dt_winner": 1.2794,
      "delta_dt": 0.0026,
      "v_entry": 272.7,
      "v_exit": 289.3
    },
    {
      "id": 12,
      "start": 1200.0,
      "end": 1300.0,
      "winner": "LEC",
      "dt_winner": 1.2187,
      "delta_dt": 0.004,
      "v_entry": 288.8,
      "v_exit": 300.8
    },
    {
      "id": 13,
      "start": 1300.0,
      "end": 1400.0,
      "winner": "LEC",
      "dt_winner": 1.1943,
      "delta_dt": 0.0003,
      "v_entry": 300.8,
      "v_exit": 275.7
    },
    {
      "id": 14,
      "start": 1400.0,
      "end": 1500.0,
      "winner": "SAI",
      "dt_winner": 1.9965,
      "delta_dt": 0.1037,
      "v_entry": 287.4,
      "v_exit": 130.2
    },
    {
      "id": 15,
      "start": 1500.0,
      "end": 1600.0,
      "winner": "LEC",
      "dt_winner": 2.4727,
      "delta_dt": 0.0419,
      "v_entry": 123.2,
      "v_exit": 180.5
    },
    {
      "id": 16,
      "start": 1600.0,
      "end": 1700.0,
      "winner": "LEC",
      "dt_winner": 1.6962,
      "delta_dt": 0.0498,
      "v_entry": 180.5,
      "v_exit": 236.2
    },
    {
      "id": 17,
      "start": 1700.0,
      "end": 1800.0,
      "winner": "LEC",
      "dt_winner": 1.4664,
      "delta_dt": 0.0192,
      "v_entry": 236.2,
      "v_exit": 246.2
    },
    {
      "id": 18,
      "start": 1800.0,
      "end": 1900.0,
      "winner": "LEC",
      "dt_winner": 1.6234,
      "delta_dt": 0.0279,
      "v_entry": 246.2,
      "v_exit": 217.9
    },
    {
      "id": 19,
      "start": 1900.0,
      "end": 2000.0,
      "winner": "LEC",
      "dt_winner": 1.5557,
      "delta_dt": 0.0496,
      "v_entry": 217.9,
      "v_exit": 241.5
    },
    {
      "id": 20,
      "start": 2000.0,
      "end": 2100.0,
      "winner": "LEC",
      "dt_winner": 1.4388,
      "delta_dt": 0.0372,
      "v_entry": 241.5,
      "v_exit": 258.3
    },
    {
      "id": 21,
      "start": 2100.0,
      "end": 2200.0,
      "winner": "SAI",
      "dt_winner": 2.199,
      "delta_dt": 0.072,
      "v_entry": 251.6,
      "v_exit": 90.7
    },
    {
      "id": 22,
      "start": 2200.0,
      "end": 2300.0,
      "winner": "LEC",
      "dt_winner": 3.5492,
      "delta_dt": 0.0913,
      "v_entry": 93.9,
      "v_exit": 155.1
    },
    {
      "id": 23,
      "start": 2300.0,
      "end": 2400.0,
      "winner": "SAI",
      "dt_winner": 1.8787,
      "delta_dt": 0.0008,
      "v_entry": 155.3,
      "v_exit": 222.8
    },
    {
      "id": 24,
      "start": 2400.0,
      "end": 2500.0,
      "winner": "SAI",
      "dt_winner": 1.5063,
      "delta_dt": 0.0042,
      "v_entry": 222.8,
      "v_exit": 253.7
    },
    {
      "id": 25,
      "start": 2500.0,
      "end": 2600.0,
      "winner": "SAI",
      "dt_winner": 1.4301,
      "delta_dt": 0.0021,
      "v_entry": 253.7,
      "v_exit": 217.7
    },
    {
      "id": 26,
      "start": 2600.0,
      "end": 2700.0,
      "winner": "SAI",
      "dt_winner": 3.282,
      "delta_dt": 0.1401,
      "v_entry": 217.7,
      "v_exit": 82.1
    },
    {
      "id": 27,
      "start": 2700.0,
      "end": 2800.0,
      "winner": "LEC",
      "dt_winner": 2.6208,
      "delta_dt": 0.1072,
      "v_entry": 84.8,
      "v_exit": 197.6
    },
    {
      "id": 28,
      "start": 2800.0,
      "end": 2900.0,
      "winner": "LEC",
      "dt_winner": 1.6247,
      "delta_dt": 0.0427,
      "v_entry": 197.6,
      "v_exit": 240.9
    },
    {
      "id": 29,
      "start": 2900.0,
      "end": 3000.0,
      "winner": "LEC",
      "dt_winner": 1.3896,
      "delta_dt": 0.0155,
      "v_entry": 240.9,
      "v_exit": 271.6
    },
    {
      "id": 30,
      "start": 3000.0,
      "end": 3100.0,
      "winner": "LEC",
      "dt_winner": 1.2819,
      "delta_dt": 0.0092,
      "v_entry": 271.6,
      "v_exit": 290.0
    },
    {
      "id": 31,
      "start": 3100.0,
      "end": 3200.0,
      "winner": "LEC",
      "dt_winner": 1.2188,
      "delta_dt": 0.0098,
      "v_entry": 290.0,
      "v_exit": 300.8
    },
    {
      "id": 32,
      "start": 3200.0,
      "end": 3300.0,
      "winner": "LEC",
      "dt_winner": 1.1835,
      "delta_dt": 0.0029,
      "v_entry": 300.8,
      "v_exit": 302.5
    },
    {
      "id": 33,
      "start": 3300.0,
      "end": 3400.0,
      "winner": "SAI",
      "dt_winner": 1.4646,
      "delta_dt": 0.1584,
      "v_entry": 305.0,
      "v_exit": 181.5
    },
    {
      "id": 34,
      "start": 3400.0,
      "end": 3500.0,
      "winner": "LEC",
      "dt_winner": 2.0204,
      "delta_dt": 0.0433,
      "v_entry": 170.4,
      "v_exit": 200.1
    },
    {
      "id": 35,
      "start": 3500.0,
      "end": 3600.0,
      "winner": "LEC",
      "dt_winner": 1.6348,
      "delta_dt": 0.0415,
      "v_entry": 200.1,
      "v_exit": 236.2
    },
    {
      "id": 36,
      "start": 3600.0,
      "end": 3700.0,
      "winner": "LEC",
      "dt_winner": 1.4506,
      "delta_dt": 0.0292,
      "v_entry": 236.2,
      "v_exit": 258.0
    },
    {
      "id": 37,
      "start": 3700.0,
      "end": 3800.0,
      "winner": "LEC",
      "dt_winner": 1.3768,
      "delta_dt": 0.0122,
      "v_entry": 258.0,
      "v_exit": 265.2
    },
    {
      "id": 38,
      "start": 3800.0,
      "end": 3900.0,
      "winner": "LEC",
      "dt_winner": 1.3416,
      "delta_dt": 0.0004,
      "v_entry": 265.2,
      "v_exit": 272.0
    },
    {
      "id": 39,
      "start": 3900.0,
      "end": 4000.0,
      "winner": "SAI",
      "dt_winner": 1.3399,
      "delta_dt": 0.0323,
      "v_entry": 270.3,
      "v_exit": 247.7
    },
    {
      "id": 40,
      "start": 4000.0,
      "end": 4100.0,
      "winner": "SAI",
      "dt_winner": 2.1424,
      "delta_dt": 0.1789,
      "v_entry": 247.7,
      "v_exit": 140.9
    },
    {
      "id": 41,
      "start": 4100.0,
      "end": 4200.0,
      "winner": "LEC",
      "dt_winner": 1.9865,
      "delta_dt": 0.1229,
      "v_entry": 152.0,
      "v_exit": 214.1
    },
    {
      "id": 42,
      "start": 4200.0,
      "end": 4300.0,
      "winner": "LEC",
      "dt_winner": 1.5409,
      "delta_dt": 0.0486,
      "v_entry": 214.1,
      "v_exit": 250.7
    },
    {
      "id": 43,
      "start": 4300.0,
      "end": 4400.0,
      "winner": "LEC",
      "dt_winner": 1.3817,
      "delta_dt": 0.0197,
      "v_entry": 250.7,
      "v_exit": 269.6
    },
    {
      "id": 44,
      "start": 4400.0,
      "end": 4500.0,
      "winner": "LEC",
      "dt_winner": 1.2943,
      "delta_dt": 0.0192,
      "v_entry": 269.6,
      "v_exit": 284.7
    },
    {
      "id": 45,
      "start": 4500.0,
      "end": 4600.0,
      "winner": "LEC",
      "dt_winner": 1.2434,
      "delta_dt": 0.0135,
      "v_entry": 284.7,
      "v_exit": 293.8
    },
    {
      "id": 46,
      "start": 4600.0,
      "end": 4700.0,
      "winner": "LEC",
      "dt_winner": 1.2152,
      "delta_dt": 0.0095,
      "v_entry": 293.8,
      "v_exit": 299.0
    },
    {
      "id": 47,
      "start": 4700.0,
      "end": 4800.0,
      "winner": "SAI",
      "dt_winner": 1.2329,
      "delta_dt": 0.0181,
      "v_entry": 296.5,
      "v_exit": 265.9
    },
    {
      "id": 48,
      "start": 4800.0,
      "end": 4900.0,
      "winner": "SAI",
      "dt_winner": 2.2157,
      "delta_dt": 0.1671,
      "v_entry": 265.9,
      "v_exit": 127.7
    },
    {
      "id": 49,
      "start": 4900.0,
      "end": 5000.0,
      "winner": "LEC",
      "dt_winner": 2.1774,
      "delta_dt": 0.1772,
      "v_entry": 130.3,
      "v_exit": 204.3
    },
    {
      "id": 50,
      "start": 5000.0,
      "end": 5100.0,
      "winner": "LEC",
      "dt_winner": 1.5834,
      "delta_dt": 0.0583,
      "v_entry": 204.3,
      "v_exit": 246.3
    },
    {
      "id": 51,
      "start": 5100.0,
      "end": 5200.0,
      "winner": "LEC",
      "dt_winner": 1.3944,
      "delta_dt": 0.0282,
      "v_entry": 246.3,
      "v_exit": 269.2
    },
    {
      "id": 52,
      "start": 5200.0,
      "end": 5300.0,
      "winner": "LEC",
      "dt_winner": 1.3033,
      "delta_dt": 0.0177,
      "v_entry": 269.2,
      "v_exit": 284.3
    },
    {
      "id": 53,
      "start": 5300.0,
      "end": 5369.0,
      "winner": "LEC",
      "dt_winner": 0.8604,
      "delta_dt": 0.0047,
      "v_entry": 284.3,
      "v_exit": 292.4
    }
  ],
  "250m": [
    {
      "id": 0,
      "start": 0.0,
      "end": 250.0,
      "winner": "SAI",
      "dt_winner": 2.9341,
      "delta_dt": 0.0049,
      "v_entry": 294.6,
      "v_exit": 316.7
    },
    {
      "id": 1,
      "start": 250.0,
      "end": 500.0,
      "winner": "SAI",
      "dt_winner": 2.7946,
      "delta_dt": 0.0087,
      "v_entry": 316.7,
      "v_exit": 325.0
    },
    {
      "id": 2,
      "start": 500.0,
      "end": 750.0,
      "winner": "SAI",
      "dt_winner": 5.7086,
      "delta_dt": 0.1866,
      "v_entry": 325.0,
      "v_exit": 94.5
    },
    {
      "id": 3,
      "start": 750.0,
      "end": 1000.0,
      "winner": "LEC",
      "dt_winner": 4.7174,
      "delta_dt": 0.1122,
      "v_entry": 101.3,
      "v_exit": 248.2
    },
    {
      "id": 4,
      "start": 1000.0,
      "end": 1250.0,
      "winner": "LEC",
      "dt_winner": 3.2776,
      "delta_dt": 0.0012,
      "v_entry": 248.2,
      "v_exit": 295.7
    },
    {
      "id": 5,
      "start": 1250.0,
      "end": 1500.0,
      "winner": "SAI",
      "dt_winner": 3.7963,
      "delta_dt": 0.1011,
      "v_entry": 293.8,
      "v_exit": 130.2
    },
    {
      "id": 6,
      "start": 1500.0,
      "end": 1750.0,
      "winner": "LEC",
      "dt_winner": 4.915,
      "delta_dt": 0.0986,
      "v_entry": 123.2,
      "v_exit": 247.8
    },
    {
      "id": 7,
      "start": 1750.0,
      "end": 2000.0,
      "winner": "LEC",
      "dt_winner": 3.8994,
      "delta_dt": 0.0898,
      "v_entry": 247.8,
      "v_exit": 241.5
    },
    {
      "id": 8,
      "start": 2000.0,
      "end": 2250.0,
      "winner": "LEC",
      "dt_winner": 5.7887,
      "delta_dt": 0.0308,
      "v_entry": 241.5,
      "v_exit": 96.5
    },
    {
      "id": 9,
      "start": 2250.0,
      "end": 2500.0,
      "winner": "LEC",
      "dt_winner": 4.8603,
      "delta_dt": 0.0207,
      "v_entry": 96.5,
      "v_exit": 252.9
    },
    {
      "id": 10,
      "start": 2500.0,
      "end": 2750.0,
      "winner": "SAI",
      "dt_winner": 6.337,
      "delta_dt": 0.1128,
      "v_entry": 253.7,
      "v_exit": 140.5
    },
    {
      "id": 11,
      "start": 2750.0,
      "end": 3000.0,
      "winner": "LEC",
      "dt_winner": 4.0397,
      "delta_dt": 0.136,
      "v_entry": 151.0,
      "v_exit": 271.6
    },
    {
      "id": 12,
      "start": 3000.0,
      "end": 3250.0,
      "winner": "LEC",
      "dt_winner": 3.0949,
      "delta_dt": 0.0209,
      "v_entry": 271.6,
      "v_exit": 305.9
    },
    {
      "id": 13,
      "start": 3250.0,
      "end": 3500.0,
      "winner": "SAI",
      "dt_winner": 4.1185,
      "delta_dt": 0.1142,
      "v_entry": 305.0,
      "v_exit": 193.3
    },
    {
      "id": 14,
      "start": 3500.0,
      "end": 3750.0,
      "winner": "LEC",
      "dt_winner": 3.7793,
      "delta_dt": 0.0795,
      "v_entry": 200.1,
      "v_exit": 262.2
    },
    {
      "id": 15,
      "start": 3750.0,
      "end": 4000.0,
      "winner": "SAI",
      "dt_winner": 3.3682,
      "delta_dt": 0.0284,
      "v_entry": 260.5,
      "v_exit": 247.7
    },
    {
      "id": 16,
      "start": 4000.0,
      "end": 4250.0,
      "winner": "SAI",
      "dt_winner": 5.0806,
      "delta_dt": 0.0261,
      "v_entry": 247.7,
      "v_exit": 228.7
    },
    {
      "id": 17,
      "start": 4250.0,
      "end": 4500.0,
      "winner": "LEC",
      "dt_winner": 3.418,
      "delta_dt": 0.0576,
      "v_entry": 234.9,
      "v_exit": 284.7
    },
    {
      "id": 18,
      "start": 4500.0,
      "end": 4750.0,
      "winner": "LEC",
      "dt_winner": 3.0612,
      "delta_dt": 0.0274,
      "v_entry": 284.7,
      "v_exit": 297.7
    },
    {
      "id": 19,
      "start": 4750.0,
      "end": 5000.0,
      "winner": "SAI",
      "dt_winner": 5.1963,
      "delta_dt": 0.0124,
      "v_entry": 295.7,
      "v_exit": 194.5
    },
    {
      "id": 20,
      "start": 5000.0,
      "end": 5250.0,
      "winner": "LEC",
      "dt_winner": 3.6375,
      "delta_dt": 0.0967,
      "v_entry": 204.3,
      "v_exit": 275.0
    },
    {
      "id": 21,
      "start": 5250.0,
      "end": 5369.0,
      "winner": "LEC",
      "dt_winner": 1.5039,
      "delta_dt": 0.0122,
      "v_entry": 275.0,
      "v_exit": 292.4
    }
  ]
},
  telemetryProfile: [
  {
    "s": 0.0,
    "v_feas": 292.3,
    "v_donor": 294.6,
    "driver": "SAI",
    "kappa": 5.6e-05,
    "drs": 0
  },
  {
    "s": 10.0,
    "v_feas": 293.9,
    "v_donor": 295.2,
    "driver": "SAI",
    "kappa": 0.000231,
    "drs": 1
  },
  {
    "s": 20.0,
    "v_feas": 295.6,
    "v_donor": 295.8,
    "driver": "SAI",
    "kappa": 0.000137,
    "drs": 1
  },
  {
    "s": 30.0,
    "v_feas": 297.0,
    "v_donor": 297.1,
    "driver": "SAI",
    "kappa": 7.3e-05,
    "drs": 1
  },
  {
    "s": 40.0,
    "v_feas": 298.5,
    "v_donor": 299.2,
    "driver": "SAI",
    "kappa": 8.7e-05,
    "drs": 1
  },
  {
    "s": 50.0,
    "v_feas": 300.0,
    "v_donor": 301.1,
    "driver": "SAI",
    "kappa": 0.000295,
    "drs": 1
  },
  {
    "s": 60.0,
    "v_feas": 301.4,
    "v_donor": 302.1,
    "driver": "SAI",
    "kappa": 0.000858,
    "drs": 1
  },
  {
    "s": 70.0,
    "v_feas": 302.8,
    "v_donor": 303.0,
    "driver": "SAI",
    "kappa": 0.000364,
    "drs": 1
  },
  {
    "s": 80.0,
    "v_feas": 304.0,
    "v_donor": 304.0,
    "driver": "SAI",
    "kappa": -7.5e-05,
    "drs": 1
  },
  {
    "s": 90.0,
    "v_feas": 304.5,
    "v_donor": 304.5,
    "driver": "SAI",
    "kappa": -0.00026,
    "drs": 1
  },
  {
    "s": 100.0,
    "v_feas": 305.0,
    "v_donor": 305.0,
    "driver": "SAI",
    "kappa": -0.00026,
    "drs": 1
  },
  {
    "s": 110.0,
    "v_feas": 306.1,
    "v_donor": 306.4,
    "driver": "SAI",
    "kappa": -0.000145,
    "drs": 1
  },
  {
    "s": 120.0,
    "v_feas": 307.3,
    "v_donor": 308.0,
    "driver": "SAI",
    "kappa": -3.9e-05,
    "drs": 1
  },
  {
    "s": 130.0,
    "v_feas": 308.4,
    "v_donor": 309.1,
    "driver": "SAI",
    "kappa": 0.0,
    "drs": 1
  },
  {
    "s": 140.0,
    "v_feas": 309.3,
    "v_donor": 309.3,
    "driver": "SAI",
    "kappa": -7.8e-05,
    "drs": 1
  },
  {
    "s": 150.0,
    "v_feas": 309.5,
    "v_donor": 309.5,
    "driver": "SAI",
    "kappa": -0.000231,
    "drs": 1
  },
  {
    "s": 160.0,
    "v_feas": 309.8,
    "v_donor": 309.8,
    "driver": "SAI",
    "kappa": -0.000103,
    "drs": 1
  },
  {
    "s": 170.0,
    "v_feas": 310.3,
    "v_donor": 310.3,
    "driver": "SAI",
    "kappa": 9.4e-05,
    "drs": 1
  },
  {
    "s": 180.0,
    "v_feas": 310.8,
    "v_donor": 310.8,
    "driver": "SAI",
    "kappa": 0.000134,
    "drs": 1
  },
  {
    "s": 190.0,
    "v_feas": 311.7,
    "v_donor": 311.7,
    "driver": "SAI",
    "kappa": 0.00014,
    "drs": 1
  },
  {
    "s": 200.0,
    "v_feas": 312.6,
    "v_donor": 313.0,
    "driver": "SAI",
    "kappa": 0.000177,
    "drs": 1
  },
  {
    "s": 210.0,
    "v_feas": 313.5,
    "v_donor": 314.2,
    "driver": "SAI",
    "kappa": 0.000195,
    "drs": 1
  },
  {
    "s": 220.0,
    "v_feas": 314.4,
    "v_donor": 315.2,
    "driver": "SAI",
    "kappa": -8e-06,
    "drs": 1
  },
  {
    "s": 230.0,
    "v_feas": 315.2,
    "v_donor": 315.7,
    "driver": "SAI",
    "kappa": -9.2e-05,
    "drs": 1
  },
  {
    "s": 240.0,
    "v_feas": 316.0,
    "v_donor": 316.2,
    "driver": "SAI",
    "kappa": 0.000101,
    "drs": 1
  },
  {
    "s": 250.0,
    "v_feas": 316.7,
    "v_donor": 316.7,
    "driver": "SAI",
    "kappa": 0.00014,
    "drs": 1
  },
  {
    "s": 260.0,
    "v_feas": 317.2,
    "v_donor": 317.2,
    "driver": "SAI",
    "kappa": 0.000103,
    "drs": 1
  },
  {
    "s": 270.0,
    "v_feas": 318.0,
    "v_donor": 318.1,
    "driver": "SAI",
    "kappa": 4.1e-05,
    "drs": 1
  },
  {
    "s": 280.0,
    "v_feas": 318.7,
    "v_donor": 319.0,
    "driver": "SAI",
    "kappa": -9e-06,
    "drs": 1
  },
  {
    "s": 290.0,
    "v_feas": 319.4,
    "v_donor": 319.9,
    "driver": "SAI",
    "kappa": -4.2e-05,
    "drs": 1
  },
  {
    "s": 300.0,
    "v_feas": 320.0,
    "v_donor": 320.5,
    "driver": "SAI",
    "kappa": 6.3e-05,
    "drs": 1
  },
  {
    "s": 310.0,
    "v_feas": 320.7,
    "v_donor": 321.0,
    "driver": "SAI",
    "kappa": 0.000253,
    "drs": 1
  },
  {
    "s": 320.0,
    "v_feas": 320.2,
    "v_donor": 320.2,
    "driver": "SAI",
    "kappa": 0.000174,
    "drs": 1
  },
  {
    "s": 330.0,
    "v_feas": 320.2,
    "v_donor": 320.2,
    "driver": "SAI",
    "kappa": -8.5e-05,
    "drs": 1
  },
  {
    "s": 340.0,
    "v_feas": 320.7,
    "v_donor": 320.7,
    "driver": "SAI",
    "kappa": -1.4e-05,
    "drs": 1
  },
  {
    "s": 350.0,
    "v_feas": 321.0,
    "v_donor": 321.0,
    "driver": "SAI",
    "kappa": 4.4e-05,
    "drs": 1
  },
  {
    "s": 360.0,
    "v_feas": 321.0,
    "v_donor": 321.0,
    "driver": "SAI",
    "kappa": 2.7e-05,
    "drs": 1
  },
  {
    "s": 370.0,
    "v_feas": 321.5,
    "v_donor": 321.6,
    "driver": "SAI",
    "kappa": -1.6e-05,
    "drs": 1
  },
  {
    "s": 380.0,
    "v_feas": 322.1,
    "v_donor": 322.6,
    "driver": "SAI",
    "kappa": -9.9e-05,
    "drs": 1
  },
  {
    "s": 390.0,
    "v_feas": 322.6,
    "v_donor": 323.0,
    "driver": "SAI",
    "kappa": -0.000251,
    "drs": 1
  },
  {
    "s": 400.0,
    "v_feas": 323.0,
    "v_donor": 323.0,
    "driver": "SAI",
    "kappa": -0.000106,
    "drs": 1
  },
  {
    "s": 410.0,
    "v_feas": 323.0,
    "v_donor": 323.0,
    "driver": "SAI",
    "kappa": 0.000443,
    "drs": 1
  },
  {
    "s": 420.0,
    "v_feas": 323.0,
    "v_donor": 323.0,
    "driver": "SAI",
    "kappa": 0.000223,
    "drs": 1
  },
  {
    "s": 430.0,
    "v_feas": 323.5,
    "v_donor": 324.1,
    "driver": "SAI",
    "kappa": 2.1e-05,
    "drs": 1
  },
  {
    "s": 440.0,
    "v_feas": 324.0,
    "v_donor": 325.3,
    "driver": "SAI",
    "kappa": -4e-06,
    "drs": 1
  },
  {
    "s": 450.0,
    "v_feas": 324.5,
    "v_donor": 325.9,
    "driver": "SAI",
    "kappa": 3e-05,
    "drs": 1
  },
  {
    "s": 460.0,
    "v_feas": 325.0,
    "v_donor": 325.3,
    "driver": "SAI",
    "kappa": 7.6e-05,
    "drs": 1
  },
  {
    "s": 470.0,
    "v_feas": 325.0,
    "v_donor": 325.0,
    "driver": "SAI",
    "kappa": 0.000139,
    "drs": 1
  },
  {
    "s": 480.0,
    "v_feas": 325.0,
    "v_donor": 325.0,
    "driver": "SAI",
    "kappa": 9.7e-05,
    "drs": 1
  },
  {
    "s": 490.0,
    "v_feas": 325.0,
    "v_donor": 325.0,
    "driver": "SAI",
    "kappa": -0.000109,
    "drs": 1
  },
  {
    "s": 500.0,
    "v_feas": 325.0,
    "v_donor": 325.0,
    "driver": "SAI",
    "kappa": -4e-05,
    "drs": 1
  },
  {
    "s": 510.0,
    "v_feas": 325.0,
    "v_donor": 325.0,
    "driver": "SAI",
    "kappa": 0.000298,
    "drs": 1
  },
  {
    "s": 520.0,
    "v_feas": 325.3,
    "v_donor": 325.3,
    "driver": "SAI",
    "kappa": 0.000389,
    "drs": 1
  },
  {
    "s": 530.0,
    "v_feas": 325.7,
    "v_donor": 325.7,
    "driver": "SAI",
    "kappa": 0.000162,
    "drs": 1
  },
  {
    "s": 540.0,
    "v_feas": 326.0,
    "v_donor": 326.0,
    "driver": "SAI",
    "kappa": -8e-05,
    "drs": 1
  },
  {
    "s": 550.0,
    "v_feas": 324.8,
    "v_donor": 324.8,
    "driver": "SAI",
    "kappa": -0.000187,
    "drs": 1
  },
  {
    "s": 560.0,
    "v_feas": 323.6,
    "v_donor": 323.6,
    "driver": "SAI",
    "kappa": -0.000249,
    "drs": 1
  },
  {
    "s": 570.0,
    "v_feas": 322.6,
    "v_donor": 322.6,
    "driver": "SAI",
    "kappa": -0.000232,
    "drs": 1
  },
  {
    "s": 580.0,
    "v_feas": 322.0,
    "v_donor": 322.0,
    "driver": "SAI",
    "kappa": -0.000127,
    "drs": 1
  },
  {
    "s": 590.0,
    "v_feas": 321.3,
    "v_donor": 321.3,
    "driver": "SAI",
    "kappa": -0.000113,
    "drs": 1
  },
  {
    "s": 600.0,
    "v_feas": 313.0,
    "v_donor": 313.0,
    "driver": "SAI",
    "kappa": -0.000176,
    "drs": 0
  },
  {
    "s": 610.0,
    "v_feas": 294.5,
    "v_donor": 294.5,
    "driver": "SAI",
    "kappa": -0.000341,
    "drs": 0
  },
  {
    "s": 620.0,
    "v_feas": 274.4,
    "v_donor": 276.5,
    "driver": "SAI",
    "kappa": -0.000735,
    "drs": 0
  },
  {
    "s": 630.0,
    "v_feas": 244.0,
    "v_donor": 253.1,
    "driver": "SAI",
    "kappa": 0.000506,
    "drs": 0
  },
  {
    "s": 640.0,
    "v_feas": 214.8,
    "v_donor": 224.6,
    "driver": "SAI",
    "kappa": -0.001698,
    "drs": 0
  },
  {
    "s": 650.0,
    "v_feas": 186.2,
    "v_donor": 190.5,
    "driver": "SAI",
    "kappa": 0.001274,
    "drs": 0
  },
  {
    "s": 660.0,
    "v_feas": 158.6,
    "v_donor": 159.5,
    "driver": "SAI",
    "kappa": -0.003391,
    "drs": 0
  },
  {
    "s": 670.0,
    "v_feas": 134.9,
    "v_donor": 134.9,
    "driver": "SAI",
    "kappa": -0.009803,
    "drs": 0
  },
  {
    "s": 680.0,
    "v_feas": 115.9,
    "v_donor": 118.8,
    "driver": "SAI",
    "kappa": -0.014194,
    "drs": 0
  },
  {
    "s": 690.0,
    "v_feas": 94.5,
    "v_donor": 97.9,
    "driver": "SAI",
    "kappa": -0.025426,
    "drs": 0
  },
  {
    "s": 700.0,
    "v_feas": 70.0,
    "v_donor": 80.0,
    "driver": "SAI",
    "kappa": -0.041288,
    "drs": 0
  },
  {
    "s": 710.0,
    "v_feas": 63.0,
    "v_donor": 63.0,
    "driver": "LEC",
    "kappa": -0.046491,
    "drs": 0
  },
  {
    "s": 720.0,
    "v_feas": 65.9,
    "v_donor": 65.9,
    "driver": "LEC",
    "kappa": -0.035477,
    "drs": 0
  },
  {
    "s": 730.0,
    "v_feas": 77.5,
    "v_donor": 77.5,
    "driver": "LEC",
    "kappa": -0.025013,
    "drs": 0
  },
  {
    "s": 740.0,
    "v_feas": 88.8,
    "v_donor": 88.8,
    "driver": "LEC",
    "kappa": -0.012971,
    "drs": 0
  },
  {
    "s": 750.0,
    "v_feas": 101.3,
    "v_donor": 101.3,
    "driver": "LEC",
    "kappa": 0.001024,
    "drs": 0
  },
  {
    "s": 760.0,
    "v_feas": 120.8,
    "v_donor": 123.7,
    "driver": "LEC",
    "kappa": 0.011727,
    "drs": 0
  },
  {
    "s": 770.0,
    "v_feas": 134.6,
    "v_donor": 134.6,
    "driver": "LEC",
    "kappa": 0.012354,
    "drs": 0
  },
  {
    "s": 780.0,
    "v_feas": 147.4,
    "v_donor": 147.4,
    "driver": "LEC",
    "kappa": 0.01145,
    "drs": 0
  },
  {
    "s": 790.0,
    "v_feas": 155.3,
    "v_donor": 155.4,
    "driver": "LEC",
    "kappa": 0.013335,
    "drs": 0
  },
  {
    "s": 800.0,
    "v_feas": 137.5,
    "v_donor": 162.7,
    "driver": "LEC",
    "kappa": 0.01641,
    "drs": 0
  },
  {
    "s": 810.0,
    "v_feas": 132.8,
    "v_donor": 172.1,
    "driver": "LEC",
    "kappa": 0.019679,
    "drs": 0
  },
  {
    "s": 820.0,
    "v_feas": 138.3,
    "v_donor": 177.7,
    "driver": "LEC",
    "kappa": 0.014978,
    "drs": 0
  },
  {
    "s": 830.0,
    "v_feas": 154.1,
    "v_donor": 181.9,
    "driver": "LEC",
    "kappa": 0.003579,
    "drs": 0
  },
  {
    "s": 840.0,
    "v_feas": 168.0,
    "v_donor": 188.9,
    "driver": "LEC",
    "kappa": 0.002179,
    "drs": 0
  },
  {
    "s": 850.0,
    "v_feas": 179.4,
    "v_donor": 196.2,
    "driver": "LEC",
    "kappa": 0.002858,
    "drs": 0
  },
  {
    "s": 860.0,
    "v_feas": 189.0,
    "v_donor": 203.5,
    "driver": "LEC",
    "kappa": 0.00481,
    "drs": 0
  },
  {
    "s": 870.0,
    "v_feas": 197.4,
    "v_donor": 205.9,
    "driver": "LEC",
    "kappa": 0.006079,
    "drs": 0
  },
  {
    "s": 880.0,
    "v_feas": 204.8,
    "v_donor": 211.2,
    "driver": "LEC",
    "kappa": -0.003827,
    "drs": 0
  },
  {
    "s": 890.0,
    "v_feas": 211.3,
    "v_donor": 216.3,
    "driver": "LEC",
    "kappa": -0.00794,
    "drs": 0
  },
  {
    "s": 900.0,
    "v_feas": 217.2,
    "v_donor": 221.0,
    "driver": "LEC",
    "kappa": -0.006054,
    "drs": 0
  },
  {
    "s": 910.0,
    "v_feas": 222.6,
    "v_donor": 224.1,
    "driver": "LEC",
    "kappa": -0.005942,
    "drs": 0
  },
  {
    "s": 920.0,
    "v_feas": 227.1,
    "v_donor": 227.1,
    "driver": "LEC",
    "kappa": -0.007015,
    "drs": 0
  },
  {
    "s": 930.0,
    "v_feas": 230.5,
    "v_donor": 230.5,
    "driver": "LEC",
    "kappa": -0.007864,
    "drs": 0
  },
  {
    "s": 940.0,
    "v_feas": 233.6,
    "v_donor": 233.6,
    "driver": "LEC",
    "kappa": -0.00415,
    "drs": 0
  },
  {
    "s": 950.0,
    "v_feas": 235.8,
    "v_donor": 235.8,
    "driver": "LEC",
    "kappa": -0.001258,
    "drs": 0
  },
  {
    "s": 960.0,
    "v_feas": 239.4,
    "v_donor": 239.6,
    "driver": "LEC",
    "kappa": -0.000992,
    "drs": 0
  },
  {
    "s": 970.0,
    "v_feas": 241.2,
    "v_donor": 241.2,
    "driver": "LEC",
    "kappa": -0.002383,
    "drs": 0
  },
  {
    "s": 980.0,
    "v_feas": 242.5,
    "v_donor": 242.5,
    "driver": "LEC",
    "kappa": -0.005811,
    "drs": 0
  },
  {
    "s": 990.0,
    "v_feas": 244.4,
    "v_donor": 244.4,
    "driver": "LEC",
    "kappa": -0.004068,
    "drs": 0
  },
  {
    "s": 1000.0,
    "v_feas": 247.6,
    "v_donor": 248.2,
    "driver": "LEC",
    "kappa": -0.000711,
    "drs": 0
  },
  {
    "s": 1010.0,
    "v_feas": 250.5,
    "v_donor": 250.7,
    "driver": "LEC",
    "kappa": 0.000161,
    "drs": 0
  },
  {
    "s": 1020.0,
    "v_feas": 253.2,
    "v_donor": 253.2,
    "driver": "LEC",
    "kappa": 0.000121,
    "drs": 1
  },
  {
    "s": 1030.0,
    "v_feas": 256.0,
    "v_donor": 256.0,
    "driver": "LEC",
    "kappa": 0.000164,
    "drs": 1
  },
  {
    "s": 1040.0,
    "v_feas": 258.7,
    "v_donor": 258.7,
    "driver": "LEC",
    "kappa": 9.5e-05,
    "drs": 1
  },
  {
    "s": 1050.0,
    "v_feas": 261.4,
    "v_donor": 261.4,
    "driver": "LEC",
    "kappa": -0.000152,
    "drs": 1
  },
  {
    "s": 1060.0,
    "v_feas": 264.3,
    "v_donor": 264.3,
    "driver": "LEC",
    "kappa": -0.000207,
    "drs": 1
  },
  {
    "s": 1070.0,
    "v_feas": 267.0,
    "v_donor": 267.0,
    "driver": "LEC",
    "kappa": -1.3e-05,
    "drs": 1
  },
  {
    "s": 1080.0,
    "v_feas": 269.2,
    "v_donor": 269.2,
    "driver": "LEC",
    "kappa": 8.3e-05,
    "drs": 1
  },
  {
    "s": 1090.0,
    "v_feas": 270.0,
    "v_donor": 270.0,
    "driver": "LEC",
    "kappa": 0.000104,
    "drs": 1
  },
  {
    "s": 1100.0,
    "v_feas": 272.4,
    "v_donor": 272.6,
    "driver": "LEC",
    "kappa": 4.4e-05,
    "drs": 1
  },
  {
    "s": 1110.0,
    "v_feas": 275.1,
    "v_donor": 275.1,
    "driver": "SAI",
    "kappa": -6e-06,
    "drs": 1
  },
  {
    "s": 1120.0,
    "v_feas": 277.0,
    "v_donor": 277.0,
    "driver": "SAI",
    "kappa": -6.8e-05,
    "drs": 1
  },
  {
    "s": 1130.0,
    "v_feas": 277.0,
    "v_donor": 277.0,
    "driver": "SAI",
    "kappa": 1.5e-05,
    "drs": 1
  },
  {
    "s": 1140.0,
    "v_feas": 279.1,
    "v_donor": 279.4,
    "driver": "SAI",
    "kappa": 0.000149,
    "drs": 1
  },
  {
    "s": 1150.0,
    "v_feas": 281.5,
    "v_donor": 281.8,
    "driver": "SAI",
    "kappa": 0.000111,
    "drs": 1
  },
  {
    "s": 1160.0,
    "v_feas": 283.7,
    "v_donor": 283.7,
    "driver": "SAI",
    "kappa": -9.2e-05,
    "drs": 1
  },
  {
    "s": 1170.0,
    "v_feas": 285.0,
    "v_donor": 285.0,
    "driver": "SAI",
    "kappa": -6.2e-05,
    "drs": 1
  },
  {
    "s": 1180.0,
    "v_feas": 286.4,
    "v_donor": 286.4,
    "driver": "SAI",
    "kappa": 0.000123,
    "drs": 1
  },
  {
    "s": 1190.0,
    "v_feas": 288.0,
    "v_donor": 288.0,
    "driver": "SAI",
    "kappa": 0.000142,
    "drs": 1
  },
  {
    "s": 1200.0,
    "v_feas": 289.3,
    "v_donor": 289.3,
    "driver": "SAI",
    "kappa": 0.000132,
    "drs": 1
  },
  {
    "s": 1210.0,
    "v_feas": 290.5,
    "v_donor": 290.5,
    "driver": "LEC",
    "kappa": 2.9e-05,
    "drs": 1
  },
  {
    "s": 1220.0,
    "v_feas": 292.1,
    "v_donor": 292.1,
    "driver": "LEC",
    "kappa": 0.000156,
    "drs": 1
  },
  {
    "s": 1230.0,
    "v_feas": 292.8,
    "v_donor": 292.8,
    "driver": "LEC",
    "kappa": 0.000195,
    "drs": 1
  },
  {
    "s": 1240.0,
    "v_feas": 294.1,
    "v_donor": 294.1,
    "driver": "LEC",
    "kappa": 0.000107,
    "drs": 1
  },
  {
    "s": 1250.0,
    "v_feas": 295.7,
    "v_donor": 295.7,
    "driver": "LEC",
    "kappa": 4.8e-05,
    "drs": 1
  },
  {
    "s": 1260.0,
    "v_feas": 297.1,
    "v_donor": 297.1,
    "driver": "LEC",
    "kappa": 3.4e-05,
    "drs": 1
  },
  {
    "s": 1270.0,
    "v_feas": 298.1,
    "v_donor": 298.1,
    "driver": "LEC",
    "kappa": 0.000144,
    "drs": 1
  },
  {
    "s": 1280.0,
    "v_feas": 299.1,
    "v_donor": 299.1,
    "driver": "LEC",
    "kappa": 0.000539,
    "drs": 1
  },
  {
    "s": 1290.0,
    "v_feas": 300.0,
    "v_donor": 300.0,
    "driver": "LEC",
    "kappa": 0.000577,
    "drs": 1
  },
  {
    "s": 1300.0,
    "v_feas": 300.8,
    "v_donor": 300.8,
    "driver": "LEC",
    "kappa": 2.8e-05,
    "drs": 1
  },
  {
    "s": 1310.0,
    "v_feas": 301.7,
    "v_donor": 301.7,
    "driver": "LEC",
    "kappa": -0.000183,
    "drs": 1
  },
  {
    "s": 1320.0,
    "v_feas": 302.5,
    "v_donor": 302.5,
    "driver": "LEC",
    "kappa": -0.000178,
    "drs": 1
  },
  {
    "s": 1330.0,
    "v_feas": 303.2,
    "v_donor": 303.2,
    "driver": "LEC",
    "kappa": -7.1e-05,
    "drs": 1
  },
  {
    "s": 1340.0,
    "v_feas": 303.8,
    "v_donor": 303.8,
    "driver": "LEC",
    "kappa": 0.000111,
    "drs": 1
  },
  {
    "s": 1350.0,
    "v_feas": 304.0,
    "v_donor": 304.0,
    "driver": "LEC",
    "kappa": 0.0003,
    "drs": 1
  },
  {
    "s": 1360.0,
    "v_feas": 304.0,
    "v_donor": 304.0,
    "driver": "LEC",
    "kappa": 0.000292,
    "drs": 1
  },
  {
    "s": 1370.0,
    "v_feas": 303.9,
    "v_donor": 303.9,
    "driver": "LEC",
    "kappa": 8.5e-05,
    "drs": 1
  },
  {
    "s": 1380.0,
    "v_feas": 303.3,
    "v_donor": 303.3,
    "driver": "LEC",
    "kappa": 1.9e-05,
    "drs": 1
  },
  {
    "s": 1390.0,
    "v_feas": 299.3,
    "v_donor": 299.3,
    "driver": "LEC",
    "kappa": 0.000169,
    "drs": 1
  },
  {
    "s": 1400.0,
    "v_feas": 275.7,
    "v_donor": 275.7,
    "driver": "LEC",
    "kappa": -0.000158,
    "drs": 1
  },
  {
    "s": 1410.0,
    "v_feas": 253.6,
    "v_donor": 270.1,
    "driver": "SAI",
    "kappa": -5.9e-05,
    "drs": 0
  },
  {
    "s": 1420.0,
    "v_feas": 224.0,
    "v_donor": 249.8,
    "driver": "SAI",
    "kappa": -0.000532,
    "drs": 0
  },
  {
    "s": 1430.0,
    "v_feas": 195.4,
    "v_donor": 225.4,
    "driver": "SAI",
    "kappa": -0.002271,
    "drs": 0
  },
  {
    "s": 1440.0,
    "v_feas": 169.1,
    "v_donor": 198.2,
    "driver": "SAI",
    "kappa": -0.008722,
    "drs": 0
  },
  {
    "s": 1450.0,
    "v_feas": 153.8,
    "v_donor": 182.6,
    "driver": "SAI",
    "kappa": -0.016706,
    "drs": 0
  },
  {
    "s": 1460.0,
    "v_feas": 153.6,
    "v_donor": 162.8,
    "driver": "SAI",
    "kappa": -0.012113,
    "drs": 0
  },
  {
    "s": 1470.0,
    "v_feas": 128.8,
    "v_donor": 150.5,
    "driver": "SAI",
    "kappa": -0.010849,
    "drs": 0
  },
  {
    "s": 1480.0,
    "v_feas": 105.4,
    "v_donor": 142.7,
    "driver": "SAI",
    "kappa": -0.024195,
    "drs": 0
  },
  {
    "s": 1490.0,
    "v_feas": 97.6,
    "v_donor": 135.0,
    "driver": "SAI",
    "kappa": -0.032007,
    "drs": 0
  },
  {
    "s": 1500.0,
    "v_feas": 99.7,
    "v_donor": 130.2,
    "driver": "SAI",
    "kappa": -0.025916,
    "drs": 0
  },
  {
    "s": 1510.0,
    "v_feas": 120.2,
    "v_donor": 125.8,
    "driver": "LEC",
    "kappa": -0.010932,
    "drs": 0
  },
  {
    "s": 1520.0,
    "v_feas": 126.4,
    "v_donor": 129.7,
    "driver": "LEC",
    "kappa": -0.014952,
    "drs": 0
  },
  {
    "s": 1530.0,
    "v_feas": 104.6,
    "v_donor": 132.1,
    "driver": "LEC",
    "kappa": -0.022668,
    "drs": 0
  },
  {
    "s": 1540.0,
    "v_feas": 100.5,
    "v_donor": 138.0,
    "driver": "LEC",
    "kappa": -0.025687,
    "drs": 0
  },
  {
    "s": 1550.0,
    "v_feas": 119.0,
    "v_donor": 146.4,
    "driver": "LEC",
    "kappa": -0.007972,
    "drs": 0
  },
  {
    "s": 1560.0,
    "v_feas": 139.8,
    "v_donor": 153.8,
    "driver": "LEC",
    "kappa": -0.004197,
    "drs": 0
  },
  {
    "s": 1570.0,
    "v_feas": 156.8,
    "v_donor": 160.0,
    "driver": "LEC",
    "kappa": -0.007055,
    "drs": 0
  },
  {
    "s": 1580.0,
    "v_feas": 166.3,
    "v_donor": 166.3,
    "driver": "LEC",
    "kappa": -0.00573,
    "drs": 0
  },
  {
    "s": 1590.0,
    "v_feas": 173.1,
    "v_donor": 173.1,
    "driver": "LEC",
    "kappa": -0.003738,
    "drs": 0
  },
  {
    "s": 1600.0,
    "v_feas": 180.5,
    "v_donor": 180.5,
    "driver": "LEC",
    "kappa": -0.001149,
    "drs": 0
  },
  {
    "s": 1610.0,
    "v_feas": 187.7,
    "v_donor": 187.7,
    "driver": "LEC",
    "kappa": 3e-06,
    "drs": 0
  },
  {
    "s": 1620.0,
    "v_feas": 195.1,
    "v_donor": 196.0,
    "driver": "LEC",
    "kappa": 0.000619,
    "drs": 0
  },
  {
    "s": 1630.0,
    "v_feas": 202.8,
    "v_donor": 206.2,
    "driver": "LEC",
    "kappa": 0.002615,
    "drs": 0
  },
  {
    "s": 1640.0,
    "v_feas": 209.5,
    "v_donor": 212.2,
    "driver": "LEC",
    "kappa": 0.003464,
    "drs": 0
  },
  {
    "s": 1650.0,
    "v_feas": 215.6,
    "v_donor": 216.9,
    "driver": "LEC",
    "kappa": 0.000685,
    "drs": 0
  },
  {
    "s": 1660.0,
    "v_feas": 221.1,
    "v_donor": 221.7,
    "driver": "LEC",
    "kappa": 0.000189,
    "drs": 0
  },
  {
    "s": 1670.0,
    "v_feas": 224.8,
    "v_donor": 224.8,
    "driver": "LEC",
    "kappa": 0.001644,
    "drs": 0
  },
  {
    "s": 1680.0,
    "v_feas": 225.7,
    "v_donor": 228.5,
    "driver": "LEC",
    "kappa": 0.011169,
    "drs": 0
  },
  {
    "s": 1690.0,
    "v_feas": 226.3,
    "v_donor": 232.6,
    "driver": "LEC",
    "kappa": 0.010783,
    "drs": 0
  },
  {
    "s": 1700.0,
    "v_feas": 230.4,
    "v_donor": 236.2,
    "driver": "LEC",
    "kappa": 0.001958,
    "drs": 0
  },
  {
    "s": 1710.0,
    "v_feas": 234.6,
    "v_donor": 238.2,
    "driver": "LEC",
    "kappa": 0.000337,
    "drs": 0
  },
  {
    "s": 1720.0,
    "v_feas": 238.5,
    "v_donor": 240.3,
    "driver": "LEC",
    "kappa": 0.002046,
    "drs": 0
  },
  {
    "s": 1730.0,
    "v_feas": 241.9,
    "v_donor": 241.9,
    "driver": "LEC",
    "kappa": 0.009968,
    "drs": 0
  },
  {
    "s": 1740.0,
    "v_feas": 244.0,
    "v_donor": 244.2,
    "driver": "LEC",
    "kappa": 0.006143,
    "drs": 0
  },
  {
    "s": 1750.0,
    "v_feas": 247.2,
    "v_donor": 247.8,
    "driver": "LEC",
    "kappa": 0.001352,
    "drs": 0
  },
  {
    "s": 1760.0,
    "v_feas": 250.0,
    "v_donor": 250.0,
    "driver": "LEC",
    "kappa": 0.000689,
    "drs": 0
  },
  {
    "s": 1770.0,
    "v_feas": 250.8,
    "v_donor": 250.8,
    "driver": "LEC",
    "kappa": 0.001012,
    "drs": 0
  },
  {
    "s": 1780.0,
    "v_feas": 250.0,
    "v_donor": 250.0,
    "driver": "LEC",
    "kappa": -0.000624,
    "drs": 0
  },
  {
    "s": 1790.0,
    "v_feas": 250.9,
    "v_donor": 250.9,
    "driver": "LEC",
    "kappa": -0.00473,
    "drs": 0
  },
  {
    "s": 1800.0,
    "v_feas": 246.2,
    "v_donor": 246.2,
    "driver": "LEC",
    "kappa": -0.006233,
    "drs": 0
  },
  {
    "s": 1810.0,
    "v_feas": 239.6,
    "v_donor": 239.6,
    "driver": "LEC",
    "kappa": -0.010077,
    "drs": 0
  },
  {
    "s": 1820.0,
    "v_feas": 229.5,
    "v_donor": 232.7,
    "driver": "LEC",
    "kappa": -0.010771,
    "drs": 0
  },
  {
    "s": 1830.0,
    "v_feas": 225.1,
    "v_donor": 226.4,
    "driver": "LEC",
    "kappa": -0.01038,
    "drs": 0
  },
  {
    "s": 1840.0,
    "v_feas": 220.5,
    "v_donor": 220.5,
    "driver": "LEC",
    "kappa": -0.007304,
    "drs": 0
  },
  {
    "s": 1850.0,
    "v_feas": 200.7,
    "v_donor": 215.1,
    "driver": "LEC",
    "kappa": -0.009665,
    "drs": 0
  },
  {
    "s": 1860.0,
    "v_feas": 194.8,
    "v_donor": 213.2,
    "driver": "LEC",
    "kappa": -0.012836,
    "drs": 0
  },
  {
    "s": 1870.0,
    "v_feas": 194.5,
    "v_donor": 213.0,
    "driver": "LEC",
    "kappa": -0.012855,
    "drs": 0
  },
  {
    "s": 1880.0,
    "v_feas": 198.2,
    "v_donor": 214.1,
    "driver": "LEC",
    "kappa": -0.004866,
    "drs": 0
  },
  {
    "s": 1890.0,
    "v_feas": 205.5,
    "v_donor": 216.0,
    "driver": "LEC",
    "kappa": -0.000421,
    "drs": 0
  },
  {
    "s": 1900.0,
    "v_feas": 212.0,
    "v_donor": 217.9,
    "driver": "LEC",
    "kappa": 0.00163,
    "drs": 0
  },
  {
    "s": 1910.0,
    "v_feas": 217.8,
    "v_donor": 218.9,
    "driver": "LEC",
    "kappa": 0.005157,
    "drs": 0
  },
  {
    "s": 1920.0,
    "v_feas": 223.0,
    "v_donor": 223.2,
    "driver": "LEC",
    "kappa": 0.004758,
    "drs": 0
  },
  {
    "s": 1930.0,
    "v_feas": 227.9,
    "v_donor": 228.3,
    "driver": "LEC",
    "kappa": 0.003228,
    "drs": 0
  },
  {
    "s": 1940.0,
    "v_feas": 232.1,
    "v_donor": 232.1,
    "driver": "LEC",
    "kappa": 0.004569,
    "drs": 0
  },
  {
    "s": 1950.0,
    "v_feas": 234.4,
    "v_donor": 234.5,
    "driver": "LEC",
    "kappa": 0.010606,
    "drs": 0
  },
  {
    "s": 1960.0,
    "v_feas": 235.3,
    "v_donor": 235.5,
    "driver": "LEC",
    "kappa": 0.010518,
    "drs": 0
  },
  {
    "s": 1970.0,
    "v_feas": 236.6,
    "v_donor": 236.6,
    "driver": "LEC",
    "kappa": 0.007544,
    "drs": 0
  },
  {
    "s": 1980.0,
    "v_feas": 237.9,
    "v_donor": 237.9,
    "driver": "LEC",
    "kappa": 0.004617,
    "drs": 0
  },
  {
    "s": 1990.0,
    "v_feas": 239.7,
    "v_donor": 239.7,
    "driver": "LEC",
    "kappa": 0.007346,
    "drs": 0
  },
  {
    "s": 2000.0,
    "v_feas": 241.5,
    "v_donor": 241.5,
    "driver": "LEC",
    "kappa": 0.009825,
    "drs": 0
  },
  {
    "s": 2010.0,
    "v_feas": 243.4,
    "v_donor": 243.4,
    "driver": "LEC",
    "kappa": 0.008266,
    "drs": 0
  },
  {
    "s": 2020.0,
    "v_feas": 245.2,
    "v_donor": 245.2,
    "driver": "LEC",
    "kappa": 0.006987,
    "drs": 0
  },
  {
    "s": 2030.0,
    "v_feas": 247.0,
    "v_donor": 247.0,
    "driver": "LEC",
    "kappa": 0.006876,
    "drs": 0
  },
  {
    "s": 2040.0,
    "v_feas": 248.8,
    "v_donor": 248.8,
    "driver": "LEC",
    "kappa": 0.005556,
    "drs": 0
  },
  {
    "s": 2050.0,
    "v_feas": 251.0,
    "v_donor": 251.0,
    "driver": "LEC",
    "kappa": 0.003945,
    "drs": 0
  },
  {
    "s": 2060.0,
    "v_feas": 253.2,
    "v_donor": 253.3,
    "driver": "LEC",
    "kappa": 0.002894,
    "drs": 0
  },
  {
    "s": 2070.0,
    "v_feas": 254.0,
    "v_donor": 254.0,
    "driver": "LEC",
    "kappa": 0.002092,
    "drs": 0
  },
  {
    "s": 2080.0,
    "v_feas": 254.1,
    "v_donor": 254.1,
    "driver": "LEC",
    "kappa": 0.001218,
    "drs": 0
  },
  {
    "s": 2090.0,
    "v_feas": 256.1,
    "v_donor": 256.1,
    "driver": "LEC",
    "kappa": 0.000608,
    "drs": 0
  },
  {
    "s": 2100.0,
    "v_feas": 254.0,
    "v_donor": 258.3,
    "driver": "LEC",
    "kappa": 7.6e-05,
    "drs": 0
  },
  {
    "s": 2110.0,
    "v_feas": 246.2,
    "v_donor": 246.2,
    "driver": "SAI",
    "kappa": 0.000437,
    "drs": 0
  },
  {
    "s": 2120.0,
    "v_feas": 240.9,
    "v_donor": 240.9,
    "driver": "SAI",
    "kappa": -0.004141,
    "drs": 0
  },
  {
    "s": 2130.0,
    "v_feas": 232.6,
    "v_donor": 232.6,
    "driver": "SAI",
    "kappa": -0.00365,
    "drs": 0
  },
  {
    "s": 2140.0,
    "v_feas": 208.7,
    "v_donor": 213.9,
    "driver": "SAI",
    "kappa": -0.001771,
    "drs": 0
  },
  {
    "s": 2150.0,
    "v_feas": 180.4,
    "v_donor": 190.3,
    "driver": "SAI",
    "kappa": -0.003179,
    "drs": 0
  },
  {
    "s": 2160.0,
    "v_feas": 152.7,
    "v_donor": 164.2,
    "driver": "SAI",
    "kappa": -0.004388,
    "drs": 0
  },
  {
    "s": 2170.0,
    "v_feas": 126.7,
    "v_donor": 142.2,
    "driver": "SAI",
    "kappa": -0.014059,
    "drs": 0
  },
  {
    "s": 2180.0,
    "v_feas": 107.3,
    "v_donor": 120.7,
    "driver": "SAI",
    "kappa": -0.025347,
    "drs": 0
  },
  {
    "s": 2190.0,
    "v_feas": 102.0,
    "v_donor": 102.0,
    "driver": "SAI",
    "kappa": -0.026007,
    "drs": 0
  },
  {
    "s": 2200.0,
    "v_feas": 87.9,
    "v_donor": 90.7,
    "driver": "SAI",
    "kappa": -0.036303,
    "drs": 0
  },
  {
    "s": 2210.0,
    "v_feas": 85.5,
    "v_donor": 86.4,
    "driver": "LEC",
    "kappa": -0.040205,
    "drs": 0
  },
  {
    "s": 2220.0,
    "v_feas": 82.0,
    "v_donor": 82.0,
    "driver": "LEC",
    "kappa": -0.034139,
    "drs": 0
  },
  {
    "s": 2230.0,
    "v_feas": 84.3,
    "v_donor": 84.3,
    "driver": "LEC",
    "kappa": -0.026719,
    "drs": 0
  },
  {
    "s": 2240.0,
    "v_feas": 88.3,
    "v_donor": 88.3,
    "driver": "LEC",
    "kappa": -0.015215,
    "drs": 0
  },
  {
    "s": 2250.0,
    "v_feas": 96.5,
    "v_donor": 96.5,
    "driver": "LEC",
    "kappa": -0.009894,
    "drs": 0
  },
  {
    "s": 2260.0,
    "v_feas": 106.9,
    "v_donor": 106.9,
    "driver": "LEC",
    "kappa": -0.007142,
    "drs": 0
  },
  {
    "s": 2270.0,
    "v_feas": 117.9,
    "v_donor": 117.9,
    "driver": "LEC",
    "kappa": -0.00971,
    "drs": 0
  },
  {
    "s": 2280.0,
    "v_feas": 127.7,
    "v_donor": 127.7,
    "driver": "LEC",
    "kappa": -0.008585,
    "drs": 0
  },
  {
    "s": 2290.0,
    "v_feas": 145.5,
    "v_donor": 145.5,
    "driver": "LEC",
    "kappa": -0.001495,
    "drs": 0
  },
  {
    "s": 2300.0,
    "v_feas": 155.1,
    "v_donor": 155.1,
    "driver": "LEC",
    "kappa": -0.000661,
    "drs": 0
  },
  {
    "s": 2310.0,
    "v_feas": 164.8,
    "v_donor": 164.8,
    "driver": "SAI",
    "kappa": -0.001503,
    "drs": 0
  },
  {
    "s": 2320.0,
    "v_feas": 172.1,
    "v_donor": 172.1,
    "driver": "SAI",
    "kappa": -0.001219,
    "drs": 0
  },
  {
    "s": 2330.0,
    "v_feas": 180.3,
    "v_donor": 180.5,
    "driver": "SAI",
    "kappa": -0.000525,
    "drs": 0
  },
  {
    "s": 2340.0,
    "v_feas": 189.8,
    "v_donor": 190.4,
    "driver": "SAI",
    "kappa": 0.000445,
    "drs": 0
  },
  {
    "s": 2350.0,
    "v_feas": 198.1,
    "v_donor": 199.5,
    "driver": "SAI",
    "kappa": 0.000377,
    "drs": 0
  },
  {
    "s": 2360.0,
    "v_feas": 201.0,
    "v_donor": 201.0,
    "driver": "SAI",
    "kappa": 2e-05,
    "drs": 0
  },
  {
    "s": 2370.0,
    "v_feas": 206.0,
    "v_donor": 206.9,
    "driver": "SAI",
    "kappa": -0.000584,
    "drs": 0
  },
  {
    "s": 2380.0,
    "v_feas": 212.4,
    "v_donor": 214.2,
    "driver": "SAI",
    "kappa": -0.001502,
    "drs": 0
  },
  {
    "s": 2390.0,
    "v_feas": 218.2,
    "v_donor": 218.3,
    "driver": "SAI",
    "kappa": -0.001206,
    "drs": 0
  },
  {
    "s": 2400.0,
    "v_feas": 222.8,
    "v_donor": 222.8,
    "driver": "SAI",
    "kappa": 0.000211,
    "drs": 0
  },
  {
    "s": 2410.0,
    "v_feas": 227.7,
    "v_donor": 227.7,
    "driver": "SAI",
    "kappa": 0.000852,
    "drs": 0
  },
  {
    "s": 2420.0,
    "v_feas": 231.0,
    "v_donor": 231.0,
    "driver": "SAI",
    "kappa": 0.00083,
    "drs": 0
  },
  {
    "s": 2430.0,
    "v_feas": 232.4,
    "v_donor": 232.4,
    "driver": "SAI",
    "kappa": 0.000677,
    "drs": 0
  },
  {
    "s": 2440.0,
    "v_feas": 235.8,
    "v_donor": 236.9,
    "driver": "SAI",
    "kappa": 0.000697,
    "drs": 0
  },
  {
    "s": 2450.0,
    "v_feas": 239.6,
    "v_donor": 240.5,
    "driver": "SAI",
    "kappa": 0.001095,
    "drs": 0
  },
  {
    "s": 2460.0,
    "v_feas": 242.1,
    "v_donor": 242.1,
    "driver": "SAI",
    "kappa": 0.001742,
    "drs": 0
  },
  {
    "s": 2470.0,
    "v_feas": 245.0,
    "v_donor": 245.0,
    "driver": "SAI",
    "kappa": 0.001746,
    "drs": 0
  },
  {
    "s": 2480.0,
    "v_feas": 248.0,
    "v_donor": 248.0,
    "driver": "SAI",
    "kappa": 0.001227,
    "drs": 0
  },
  {
    "s": 2490.0,
    "v_feas": 250.8,
    "v_donor": 250.8,
    "driver": "SAI",
    "kappa": 0.001276,
    "drs": 0
  },
  {
    "s": 2500.0,
    "v_feas": 253.6,
    "v_donor": 253.7,
    "driver": "SAI",
    "kappa": 0.001482,
    "drs": 0
  },
  {
    "s": 2510.0,
    "v_feas": 255.6,
    "v_donor": 255.6,
    "driver": "SAI",
    "kappa": 0.002037,
    "drs": 0
  },
  {
    "s": 2520.0,
    "v_feas": 256.3,
    "v_donor": 256.3,
    "driver": "SAI",
    "kappa": 0.004472,
    "drs": 0
  },
  {
    "s": 2530.0,
    "v_feas": 257.0,
    "v_donor": 257.0,
    "driver": "SAI",
    "kappa": 0.007829,
    "drs": 0
  },
  {
    "s": 2540.0,
    "v_feas": 258.1,
    "v_donor": 258.1,
    "driver": "SAI",
    "kappa": 0.007496,
    "drs": 0
  },
  {
    "s": 2550.0,
    "v_feas": 259.4,
    "v_donor": 259.4,
    "driver": "SAI",
    "kappa": 0.00631,
    "drs": 0
  },
  {
    "s": 2560.0,
    "v_feas": 258.2,
    "v_donor": 258.2,
    "driver": "SAI",
    "kappa": 0.005375,
    "drs": 0
  },
  {
    "s": 2570.0,
    "v_feas": 253.5,
    "v_donor": 253.5,
    "driver": "SAI",
    "kappa": 0.0058,
    "drs": 0
  },
  {
    "s": 2580.0,
    "v_feas": 230.7,
    "v_donor": 248.7,
    "driver": "SAI",
    "kappa": 0.008283,
    "drs": 0
  },
  {
    "s": 2590.0,
    "v_feas": 213.7,
    "v_donor": 236.5,
    "driver": "SAI",
    "kappa": 0.010426,
    "drs": 0
  },
  {
    "s": 2600.0,
    "v_feas": 202.6,
    "v_donor": 217.7,
    "driver": "SAI",
    "kappa": 0.012309,
    "drs": 0
  },
  {
    "s": 2610.0,
    "v_feas": 196.4,
    "v_donor": 201.9,
    "driver": "SAI",
    "kappa": 0.012251,
    "drs": 0
  },
  {
    "s": 2620.0,
    "v_feas": 177.2,
    "v_donor": 184.6,
    "driver": "SAI",
    "kappa": 0.007536,
    "drs": 0
  },
  {
    "s": 2630.0,
    "v_feas": 151.3,
    "v_donor": 155.7,
    "driver": "SAI",
    "kappa": 0.007566,
    "drs": 0
  },
  {
    "s": 2640.0,
    "v_feas": 126.2,
    "v_donor": 136.4,
    "driver": "SAI",
    "kappa": 0.013969,
    "drs": 0
  },
  {
    "s": 2650.0,
    "v_feas": 105.1,
    "v_donor": 116.9,
    "driver": "SAI",
    "kappa": 0.023182,
    "drs": 0
  },
  {
    "s": 2660.0,
    "v_feas": 87.9,
    "v_donor": 95.6,
    "driver": "SAI",
    "kappa": 0.036172,
    "drs": 0
  },
  {
    "s": 2670.0,
    "v_feas": 80.5,
    "v_donor": 81.5,
    "driver": "SAI",
    "kappa": 0.044219,
    "drs": 0
  },
  {
    "s": 2680.0,
    "v_feas": 74.8,
    "v_donor": 74.8,
    "driver": "SAI",
    "kappa": 0.043573,
    "drs": 0
  },
  {
    "s": 2690.0,
    "v_feas": 74.0,
    "v_donor": 74.0,
    "driver": "SAI",
    "kappa": 0.031923,
    "drs": 0
  },
  {
    "s": 2700.0,
    "v_feas": 82.1,
    "v_donor": 82.1,
    "driver": "SAI",
    "kappa": 0.0218,
    "drs": 0
  },
  {
    "s": 2710.0,
    "v_feas": 95.9,
    "v_donor": 95.9,
    "driver": "LEC",
    "kappa": 0.00621,
    "drs": 0
  },
  {
    "s": 2720.0,
    "v_feas": 107.4,
    "v_donor": 107.4,
    "driver": "LEC",
    "kappa": 0.003709,
    "drs": 0
  },
  {
    "s": 2730.0,
    "v_feas": 122.8,
    "v_donor": 122.8,
    "driver": "LEC",
    "kappa": 0.001836,
    "drs": 0
  },
  {
    "s": 2740.0,
    "v_feas": 137.0,
    "v_donor": 137.0,
    "driver": "LEC",
    "kappa": 0.001619,
    "drs": 0
  },
  {
    "s": 2750.0,
    "v_feas": 151.0,
    "v_donor": 151.0,
    "driver": "LEC",
    "kappa": 0.000902,
    "drs": 0
  },
  {
    "s": 2760.0,
    "v_feas": 162.3,
    "v_donor": 162.3,
    "driver": "LEC",
    "kappa": 0.00031,
    "drs": 0
  },
  {
    "s": 2770.0,
    "v_feas": 172.7,
    "v_donor": 172.7,
    "driver": "LEC",
    "kappa": 0.000505,
    "drs": 1
  },
  {
    "s": 2780.0,
    "v_feas": 182.2,
    "v_donor": 182.2,
    "driver": "LEC",
    "kappa": 0.000769,
    "drs": 1
  },
  {
    "s": 2790.0,
    "v_feas": 191.5,
    "v_donor": 191.5,
    "driver": "LEC",
    "kappa": 0.000959,
    "drs": 1
  },
  {
    "s": 2800.0,
    "v_feas": 197.6,
    "v_donor": 197.6,
    "driver": "LEC",
    "kappa": 0.000767,
    "drs": 1
  },
  {
    "s": 2810.0,
    "v_feas": 203.5,
    "v_donor": 203.5,
    "driver": "LEC",
    "kappa": 0.000545,
    "drs": 1
  },
  {
    "s": 2820.0,
    "v_feas": 208.7,
    "v_donor": 208.7,
    "driver": "LEC",
    "kappa": 0.000523,
    "drs": 1
  },
  {
    "s": 2830.0,
    "v_feas": 212.9,
    "v_donor": 212.9,
    "driver": "LEC",
    "kappa": 0.000132,
    "drs": 1
  },
  {
    "s": 2840.0,
    "v_feas": 216.9,
    "v_donor": 216.9,
    "driver": "LEC",
    "kappa": -0.000115,
    "drs": 1
  },
  {
    "s": 2850.0,
    "v_feas": 223.1,
    "v_donor": 223.6,
    "driver": "LEC",
    "kappa": -2.9e-05,
    "drs": 1
  },
  {
    "s": 2860.0,
    "v_feas": 228.9,
    "v_donor": 229.0,
    "driver": "LEC",
    "kappa": 8e-06,
    "drs": 1
  },
  {
    "s": 2870.0,
    "v_feas": 233.2,
    "v_donor": 233.2,
    "driver": "LEC",
    "kappa": 0.00013,
    "drs": 1
  },
  {
    "s": 2880.0,
    "v_feas": 237.3,
    "v_donor": 237.3,
    "driver": "LEC",
    "kappa": 0.000359,
    "drs": 1
  },
  {
    "s": 2890.0,
    "v_feas": 239.0,
    "v_donor": 239.0,
    "driver": "LEC",
    "kappa": 0.000442,
    "drs": 1
  },
  {
    "s": 2900.0,
    "v_feas": 240.9,
    "v_donor": 240.9,
    "driver": "LEC",
    "kappa": 0.000193,
    "drs": 1
  },
  {
    "s": 2910.0,
    "v_feas": 245.4,
    "v_donor": 246.5,
    "driver": "LEC",
    "kappa": 6.3e-05,
    "drs": 1
  },
  {
    "s": 2920.0,
    "v_feas": 249.6,
    "v_donor": 251.1,
    "driver": "LEC",
    "kappa": 5.2e-05,
    "drs": 1
  },
  {
    "s": 2930.0,
    "v_feas": 253.6,
    "v_donor": 254.5,
    "driver": "LEC",
    "kappa": 8.1e-05,
    "drs": 1
  },
  {
    "s": 2940.0,
    "v_feas": 257.3,
    "v_donor": 257.9,
    "driver": "LEC",
    "kappa": -0.00011,
    "drs": 1
  },
  {
    "s": 2950.0,
    "v_feas": 260.8,
    "v_donor": 260.9,
    "driver": "LEC",
    "kappa": -9.7e-05,
    "drs": 1
  },
  {
    "s": 2960.0,
    "v_feas": 263.9,
    "v_donor": 263.9,
    "driver": "LEC",
    "kappa": -3.7e-05,
    "drs": 1
  },
  {
    "s": 2970.0,
    "v_feas": 265.6,
    "v_donor": 265.6,
    "driver": "LEC",
    "kappa": 1.6e-05,
    "drs": 1
  },
  {
    "s": 2980.0,
    "v_feas": 267.3,
    "v_donor": 267.3,
    "driver": "LEC",
    "kappa": 0.000101,
    "drs": 1
  },
  {
    "s": 2990.0,
    "v_feas": 269.3,
    "v_donor": 269.3,
    "driver": "LEC",
    "kappa": -2.2e-05,
    "drs": 1
  },
  {
    "s": 3000.0,
    "v_feas": 271.6,
    "v_donor": 271.6,
    "driver": "LEC",
    "kappa": -7.1e-05,
    "drs": 1
  },
  {
    "s": 3010.0,
    "v_feas": 274.1,
    "v_donor": 274.1,
    "driver": "LEC",
    "kappa": -1e-05,
    "drs": 1
  },
  {
    "s": 3020.0,
    "v_feas": 275.6,
    "v_donor": 275.6,
    "driver": "LEC",
    "kappa": 0.00017,
    "drs": 1
  },
  {
    "s": 3030.0,
    "v_feas": 276.6,
    "v_donor": 276.6,
    "driver": "LEC",
    "kappa": 0.000356,
    "drs": 1
  },
  {
    "s": 3040.0,
    "v_feas": 278.4,
    "v_donor": 278.5,
    "driver": "LEC",
    "kappa": 0.000145,
    "drs": 1
  },
  {
    "s": 3050.0,
    "v_feas": 280.8,
    "v_donor": 281.2,
    "driver": "LEC",
    "kappa": 2.1e-05,
    "drs": 1
  },
  {
    "s": 3060.0,
    "v_feas": 283.0,
    "v_donor": 283.7,
    "driver": "LEC",
    "kappa": -5.6e-05,
    "drs": 1
  },
  {
    "s": 3070.0,
    "v_feas": 284.8,
    "v_donor": 284.8,
    "driver": "LEC",
    "kappa": -0.000172,
    "drs": 1
  },
  {
    "s": 3080.0,
    "v_feas": 285.9,
    "v_donor": 285.9,
    "driver": "LEC",
    "kappa": -0.000256,
    "drs": 1
  },
  {
    "s": 3090.0,
    "v_feas": 287.8,
    "v_donor": 288.0,
    "driver": "LEC",
    "kappa": -4.4e-05,
    "drs": 1
  },
  {
    "s": 3100.0,
    "v_feas": 289.7,
    "v_donor": 290.0,
    "driver": "LEC",
    "kappa": -7.2e-05,
    "drs": 1
  },
  {
    "s": 3110.0,
    "v_feas": 290.6,
    "v_donor": 290.6,
    "driver": "LEC",
    "kappa": -9.8e-05,
    "drs": 1
  },
  {
    "s": 3120.0,
    "v_feas": 291.1,
    "v_donor": 291.1,
    "driver": "LEC",
    "kappa": -0.000153,
    "drs": 1
  },
  {
    "s": 3130.0,
    "v_feas": 292.1,
    "v_donor": 292.2,
    "driver": "LEC",
    "kappa": -0.000162,
    "drs": 1
  },
  {
    "s": 3140.0,
    "v_feas": 293.9,
    "v_donor": 294.6,
    "driver": "LEC",
    "kappa": 3e-05,
    "drs": 1
  },
  {
    "s": 3150.0,
    "v_feas": 295.5,
    "v_donor": 295.9,
    "driver": "LEC",
    "kappa": 0.000225,
    "drs": 1
  },
  {
    "s": 3160.0,
    "v_feas": 297.0,
    "v_donor": 297.0,
    "driver": "LEC",
    "kappa": 0.000115,
    "drs": 1
  },
  {
    "s": 3170.0,
    "v_feas": 298.1,
    "v_donor": 298.1,
    "driver": "LEC",
    "kappa": -7e-05,
    "drs": 1
  },
  {
    "s": 3180.0,
    "v_feas": 299.1,
    "v_donor": 299.1,
    "driver": "LEC",
    "kappa": -0.000146,
    "drs": 1
  },
  {
    "s": 3190.0,
    "v_feas": 300.1,
    "v_donor": 300.1,
    "driver": "LEC",
    "kappa": -9.5e-05,
    "drs": 1
  },
  {
    "s": 3200.0,
    "v_feas": 300.8,
    "v_donor": 300.8,
    "driver": "LEC",
    "kappa": 0.0,
    "drs": 1
  },
  {
    "s": 3210.0,
    "v_feas": 301.4,
    "v_donor": 301.4,
    "driver": "LEC",
    "kappa": 0.000124,
    "drs": 1
  },
  {
    "s": 3220.0,
    "v_feas": 302.1,
    "v_donor": 302.1,
    "driver": "LEC",
    "kappa": 0.000202,
    "drs": 1
  },
  {
    "s": 3230.0,
    "v_feas": 303.2,
    "v_donor": 303.2,
    "driver": "LEC",
    "kappa": -0.000202,
    "drs": 1
  },
  {
    "s": 3240.0,
    "v_feas": 304.5,
    "v_donor": 304.5,
    "driver": "LEC",
    "kappa": -0.000482,
    "drs": 1
  },
  {
    "s": 3250.0,
    "v_feas": 305.7,
    "v_donor": 305.9,
    "driver": "LEC",
    "kappa": -0.000308,
    "drs": 1
  },
  {
    "s": 3260.0,
    "v_feas": 306.0,
    "v_donor": 306.0,
    "driver": "LEC",
    "kappa": -0.000122,
    "drs": 1
  },
  {
    "s": 3270.0,
    "v_feas": 305.9,
    "v_donor": 305.9,
    "driver": "LEC",
    "kappa": 3.4e-05,
    "drs": 1
  },
  {
    "s": 3280.0,
    "v_feas": 305.5,
    "v_donor": 305.5,
    "driver": "LEC",
    "kappa": 0.000196,
    "drs": 1
  },
  {
    "s": 3290.0,
    "v_feas": 305.1,
    "v_donor": 305.1,
    "driver": "LEC",
    "kappa": 0.000291,
    "drs": 1
  },
  {
    "s": 3300.0,
    "v_feas": 302.5,
    "v_donor": 302.5,
    "driver": "LEC",
    "kappa": 0.00011,
    "drs": 1
  },
  {
    "s": 3310.0,
    "v_feas": 303.8,
    "v_donor": 305.0,
    "driver": "SAI",
    "kappa": 0.000331,
    "drs": 1
  },
  {
    "s": 3320.0,
    "v_feas": 305.0,
    "v_donor": 305.0,
    "driver": "SAI",
    "kappa": 0.001005,
    "drs": 1
  },
  {
    "s": 3330.0,
    "v_feas": 300.9,
    "v_donor": 300.9,
    "driver": "SAI",
    "kappa": 0.001817,
    "drs": 0
  },
  {
    "s": 3340.0,
    "v_feas": 279.7,
    "v_donor": 279.7,
    "driver": "SAI",
    "kappa": 0.002783,
    "drs": 0
  },
  {
    "s": 3350.0,
    "v_feas": 254.0,
    "v_donor": 259.9,
    "driver": "SAI",
    "kappa": 0.004196,
    "drs": 0
  },
  {
    "s": 3360.0,
    "v_feas": 227.3,
    "v_donor": 238.8,
    "driver": "SAI",
    "kappa": 0.005555,
    "drs": 0
  },
  {
    "s": 3370.0,
    "v_feas": 202.4,
    "v_donor": 216.0,
    "driver": "SAI",
    "kappa": 0.00711,
    "drs": 0
  },
  {
    "s": 3380.0,
    "v_feas": 179.2,
    "v_donor": 203.3,
    "driver": "SAI",
    "kappa": 0.009075,
    "drs": 0
  },
  {
    "s": 3390.0,
    "v_feas": 158.8,
    "v_donor": 189.2,
    "driver": "SAI",
    "kappa": 0.012981,
    "drs": 0
  },
  {
    "s": 3400.0,
    "v_feas": 147.5,
    "v_donor": 181.5,
    "driver": "SAI",
    "kappa": 0.0177,
    "drs": 0
  },
  {
    "s": 3410.0,
    "v_feas": 159.7,
    "v_donor": 167.2,
    "driver": "LEC",
    "kappa": 0.009715,
    "drs": 0
  },
  {
    "s": 3420.0,
    "v_feas": 160.0,
    "v_donor": 167.8,
    "driver": "LEC",
    "kappa": 0.009787,
    "drs": 0
  },
  {
    "s": 3430.0,
    "v_feas": 139.6,
    "v_donor": 168.8,
    "driver": "LEC",
    "kappa": 0.016258,
    "drs": 0
  },
  {
    "s": 3440.0,
    "v_feas": 134.0,
    "v_donor": 171.5,
    "driver": "LEC",
    "kappa": 0.01982,
    "drs": 0
  },
  {
    "s": 3450.0,
    "v_feas": 144.3,
    "v_donor": 176.0,
    "driver": "LEC",
    "kappa": 0.010105,
    "drs": 0
  },
  {
    "s": 3460.0,
    "v_feas": 160.2,
    "v_donor": 180.4,
    "driver": "LEC",
    "kappa": 0.008929,
    "drs": 0
  },
  {
    "s": 3470.0,
    "v_feas": 172.2,
    "v_donor": 186.6,
    "driver": "LEC",
    "kappa": 0.013053,
    "drs": 0
  },
  {
    "s": 3480.0,
    "v_feas": 178.1,
    "v_donor": 191.2,
    "driver": "LEC",
    "kappa": 0.011299,
    "drs": 0
  },
  {
    "s": 3490.0,
    "v_feas": 187.9,
    "v_donor": 194.0,
    "driver": "LEC",
    "kappa": 0.007819,
    "drs": 0
  },
  {
    "s": 3500.0,
    "v_feas": 196.4,
    "v_donor": 200.1,
    "driver": "LEC",
    "kappa": 0.008351,
    "drs": 0
  },
  {
    "s": 3510.0,
    "v_feas": 203.9,
    "v_donor": 206.7,
    "driver": "LEC",
    "kappa": 0.009255,
    "drs": 0
  },
  {
    "s": 3520.0,
    "v_feas": 210.5,
    "v_donor": 211.4,
    "driver": "LEC",
    "kappa": 0.008442,
    "drs": 0
  },
  {
    "s": 3530.0,
    "v_feas": 214.8,
    "v_donor": 214.8,
    "driver": "LEC",
    "kappa": 0.006066,
    "drs": 0
  },
  {
    "s": 3540.0,
    "v_feas": 217.4,
    "v_donor": 217.4,
    "driver": "LEC",
    "kappa": 0.003462,
    "drs": 0
  },
  {
    "s": 3550.0,
    "v_feas": 209.9,
    "v_donor": 219.7,
    "driver": "LEC",
    "kappa": 0.00913,
    "drs": 0
  },
  {
    "s": 3560.0,
    "v_feas": 208.2,
    "v_donor": 223.0,
    "driver": "LEC",
    "kappa": 0.011728,
    "drs": 0
  },
  {
    "s": 3570.0,
    "v_feas": 211.6,
    "v_donor": 228.8,
    "driver": "LEC",
    "kappa": 0.006931,
    "drs": 0
  },
  {
    "s": 3580.0,
    "v_feas": 217.5,
    "v_donor": 231.4,
    "driver": "LEC",
    "kappa": 0.002332,
    "drs": 0
  },
  {
    "s": 3590.0,
    "v_feas": 222.8,
    "v_donor": 234.4,
    "driver": "LEC",
    "kappa": 0.002898,
    "drs": 0
  },
  {
    "s": 3600.0,
    "v_feas": 227.7,
    "v_donor": 236.2,
    "driver": "LEC",
    "kappa": 0.005093,
    "drs": 0
  },
  {
    "s": 3610.0,
    "v_feas": 232.1,
    "v_donor": 237.0,
    "driver": "LEC",
    "kappa": 0.005949,
    "drs": 0
  },
  {
    "s": 3620.0,
    "v_feas": 236.2,
    "v_donor": 242.6,
    "driver": "LEC",
    "kappa": 0.0021,
    "drs": 0
  },
  {
    "s": 3630.0,
    "v_feas": 240.0,
    "v_donor": 244.2,
    "driver": "LEC",
    "kappa": -9.5e-05,
    "drs": 0
  },
  {
    "s": 3640.0,
    "v_feas": 243.5,
    "v_donor": 245.8,
    "driver": "LEC",
    "kappa": -0.001268,
    "drs": 0
  },
  {
    "s": 3650.0,
    "v_feas": 246.7,
    "v_donor": 248.7,
    "driver": "LEC",
    "kappa": -0.003517,
    "drs": 0
  },
  {
    "s": 3660.0,
    "v_feas": 249.7,
    "v_donor": 251.4,
    "driver": "LEC",
    "kappa": -0.00606,
    "drs": 0
  },
  {
    "s": 3670.0,
    "v_feas": 252.6,
    "v_donor": 253.7,
    "driver": "LEC",
    "kappa": -0.005342,
    "drs": 0
  },
  {
    "s": 3680.0,
    "v_feas": 255.2,
    "v_donor": 256.0,
    "driver": "LEC",
    "kappa": -0.004499,
    "drs": 0
  },
  {
    "s": 3690.0,
    "v_feas": 257.3,
    "v_donor": 257.3,
    "driver": "LEC",
    "kappa": -0.004696,
    "drs": 0
  },
  {
    "s": 3700.0,
    "v_feas": 258.0,
    "v_donor": 258.0,
    "driver": "LEC",
    "kappa": -0.005113,
    "drs": 0
  },
  {
    "s": 3710.0,
    "v_feas": 258.8,
    "v_donor": 258.8,
    "driver": "LEC",
    "kappa": -0.005673,
    "drs": 0
  },
  {
    "s": 3720.0,
    "v_feas": 258.5,
    "v_donor": 258.5,
    "driver": "LEC",
    "kappa": -0.006817,
    "drs": 0
  },
  {
    "s": 3730.0,
    "v_feas": 258.9,
    "v_donor": 259.0,
    "driver": "LEC",
    "kappa": -0.008245,
    "drs": 0
  },
  {
    "s": 3740.0,
    "v_feas": 261.0,
    "v_donor": 261.0,
    "driver": "LEC",
    "kappa": -0.00856,
    "drs": 0
  },
  {
    "s": 3750.0,
    "v_feas": 262.2,
    "v_donor": 262.2,
    "driver": "LEC",
    "kappa": -0.008021,
    "drs": 0
  },
  {
    "s": 3760.0,
    "v_feas": 263.4,
    "v_donor": 263.4,
    "driver": "LEC",
    "kappa": -0.006931,
    "drs": 0
  },
  {
    "s": 3770.0,
    "v_feas": 263.7,
    "v_donor": 263.7,
    "driver": "LEC",
    "kappa": -0.006047,
    "drs": 0
  },
  {
    "s": 3780.0,
    "v_feas": 263.0,
    "v_donor": 263.0,
    "driver": "LEC",
    "kappa": -0.005602,
    "drs": 0
  },
  {
    "s": 3790.0,
    "v_feas": 264.0,
    "v_donor": 264.0,
    "driver": "LEC",
    "kappa": -0.005132,
    "drs": 0
  },
  {
    "s": 3800.0,
    "v_feas": 265.2,
    "v_donor": 265.2,
    "driver": "LEC",
    "kappa": -0.006053,
    "drs": 0
  },
  {
    "s": 3810.0,
    "v_feas": 266.1,
    "v_donor": 266.1,
    "driver": "LEC",
    "kappa": -0.008235,
    "drs": 0
  },
  {
    "s": 3820.0,
    "v_feas": 266.5,
    "v_donor": 266.5,
    "driver": "LEC",
    "kappa": -0.008213,
    "drs": 0
  },
  {
    "s": 3830.0,
    "v_feas": 266.8,
    "v_donor": 266.8,
    "driver": "LEC",
    "kappa": -0.007988,
    "drs": 0
  },
  {
    "s": 3840.0,
    "v_feas": 267.5,
    "v_donor": 267.5,
    "driver": "LEC",
    "kappa": -0.006162,
    "drs": 0
  },
  {
    "s": 3850.0,
    "v_feas": 268.6,
    "v_donor": 268.6,
    "driver": "LEC",
    "kappa": -0.006512,
    "drs": 0
  },
  {
    "s": 3860.0,
    "v_feas": 269.2,
    "v_donor": 269.2,
    "driver": "LEC",
    "kappa": -0.00805,
    "drs": 0
  },
  {
    "s": 3870.0,
    "v_feas": 269.5,
    "v_donor": 269.5,
    "driver": "LEC",
    "kappa": -0.00803,
    "drs": 0
  },
  {
    "s": 3880.0,
    "v_feas": 269.8,
    "v_donor": 269.8,
    "driver": "LEC",
    "kappa": -0.006401,
    "drs": 0
  },
  {
    "s": 3890.0,
    "v_feas": 270.7,
    "v_donor": 270.8,
    "driver": "LEC",
    "kappa": -0.003204,
    "drs": 0
  },
  {
    "s": 3900.0,
    "v_feas": 272.0,
    "v_donor": 272.0,
    "driver": "LEC",
    "kappa": -0.002252,
    "drs": 0
  },
  {
    "s": 3910.0,
    "v_feas": 270.7,
    "v_donor": 270.7,
    "driver": "SAI",
    "kappa": -0.001719,
    "drs": 0
  },
  {
    "s": 3920.0,
    "v_feas": 271.0,
    "v_donor": 271.0,
    "driver": "SAI",
    "kappa": -0.00124,
    "drs": 0
  },
  {
    "s": 3930.0,
    "v_feas": 271.0,
    "v_donor": 271.0,
    "driver": "SAI",
    "kappa": -0.000618,
    "drs": 0
  },
  {
    "s": 3940.0,
    "v_feas": 271.0,
    "v_donor": 271.0,
    "driver": "SAI",
    "kappa": 0.000236,
    "drs": 0
  },
  {
    "s": 3950.0,
    "v_feas": 271.4,
    "v_donor": 271.4,
    "driver": "SAI",
    "kappa": 0.000993,
    "drs": 0
  },
  {
    "s": 3960.0,
    "v_feas": 272.0,
    "v_donor": 272.0,
    "driver": "SAI",
    "kappa": 0.001228,
    "drs": 0
  },
  {
    "s": 3970.0,
    "v_feas": 271.6,
    "v_donor": 271.6,
    "driver": "SAI",
    "kappa": 0.001314,
    "drs": 0
  },
  {
    "s": 3980.0,
    "v_feas": 267.4,
    "v_donor": 270.4,
    "driver": "SAI",
    "kappa": -0.002093,
    "drs": 0
  },
  {
    "s": 3990.0,
    "v_feas": 240.2,
    "v_donor": 259.3,
    "driver": "SAI",
    "kappa": -0.006322,
    "drs": 0
  },
  {
    "s": 4000.0,
    "v_feas": 215.5,
    "v_donor": 247.7,
    "driver": "SAI",
    "kappa": -0.005371,
    "drs": 0
  },
  {
    "s": 4010.0,
    "v_feas": 189.3,
    "v_donor": 231.5,
    "driver": "SAI",
    "kappa": -0.005826,
    "drs": 0
  },
  {
    "s": 4020.0,
    "v_feas": 164.6,
    "v_donor": 202.0,
    "driver": "SAI",
    "kappa": -0.009281,
    "drs": 0
  },
  {
    "s": 4030.0,
    "v_feas": 144.3,
    "v_donor": 186.1,
    "driver": "SAI",
    "kappa": -0.015082,
    "drs": 0
  },
  {
    "s": 4040.0,
    "v_feas": 133.4,
    "v_donor": 171.1,
    "driver": "SAI",
    "kappa": -0.019913,
    "drs": 0
  },
  {
    "s": 4050.0,
    "v_feas": 128.3,
    "v_donor": 164.0,
    "driver": "SAI",
    "kappa": -0.020526,
    "drs": 0
  },
  {
    "s": 4060.0,
    "v_feas": 140.2,
    "v_donor": 156.3,
    "driver": "SAI",
    "kappa": -0.011852,
    "drs": 0
  },
  {
    "s": 4070.0,
    "v_feas": 149.5,
    "v_donor": 149.5,
    "driver": "SAI",
    "kappa": -0.013366,
    "drs": 0
  },
  {
    "s": 4080.0,
    "v_feas": 142.4,
    "v_donor": 142.4,
    "driver": "SAI",
    "kappa": -0.0168,
    "drs": 0
  },
  {
    "s": 4090.0,
    "v_feas": 132.6,
    "v_donor": 138.0,
    "driver": "SAI",
    "kappa": -0.016664,
    "drs": 0
  },
  {
    "s": 4100.0,
    "v_feas": 120.4,
    "v_donor": 140.9,
    "driver": "SAI",
    "kappa": -0.023125,
    "drs": 0
  },
  {
    "s": 4110.0,
    "v_feas": 136.5,
    "v_donor": 157.1,
    "driver": "LEC",
    "kappa": -0.010715,
    "drs": 0
  },
  {
    "s": 4120.0,
    "v_feas": 153.4,
    "v_donor": 162.0,
    "driver": "LEC",
    "kappa": -0.009173,
    "drs": 0
  },
  {
    "s": 4130.0,
    "v_feas": 167.4,
    "v_donor": 167.9,
    "driver": "LEC",
    "kappa": -0.008721,
    "drs": 0
  },
  {
    "s": 4140.0,
    "v_feas": 177.1,
    "v_donor": 177.1,
    "driver": "LEC",
    "kappa": -0.007952,
    "drs": 0
  },
  {
    "s": 4150.0,
    "v_feas": 185.4,
    "v_donor": 185.4,
    "driver": "LEC",
    "kappa": -0.005688,
    "drs": 0
  },
  {
    "s": 4160.0,
    "v_feas": 190.0,
    "v_donor": 190.0,
    "driver": "LEC",
    "kappa": -0.002912,
    "drs": 0
  },
  {
    "s": 4170.0,
    "v_feas": 197.7,
    "v_donor": 197.7,
    "driver": "LEC",
    "kappa": -0.001428,
    "drs": 0
  },
  {
    "s": 4180.0,
    "v_feas": 202.9,
    "v_donor": 202.9,
    "driver": "LEC",
    "kappa": -0.000671,
    "drs": 0
  },
  {
    "s": 4190.0,
    "v_feas": 208.9,
    "v_donor": 208.9,
    "driver": "LEC",
    "kappa": -0.000106,
    "drs": 0
  },
  {
    "s": 4200.0,
    "v_feas": 214.1,
    "v_donor": 214.1,
    "driver": "LEC",
    "kappa": -0.000183,
    "drs": 0
  },
  {
    "s": 4210.0,
    "v_feas": 218.8,
    "v_donor": 218.8,
    "driver": "LEC",
    "kappa": -0.000213,
    "drs": 0
  },
  {
    "s": 4220.0,
    "v_feas": 223.7,
    "v_donor": 223.7,
    "driver": "LEC",
    "kappa": -7.7e-05,
    "drs": 0
  },
  {
    "s": 4230.0,
    "v_feas": 228.4,
    "v_donor": 228.4,
    "driver": "LEC",
    "kappa": 9e-05,
    "drs": 0
  },
  {
    "s": 4240.0,
    "v_feas": 231.9,
    "v_donor": 231.9,
    "driver": "LEC",
    "kappa": 0.000373,
    "drs": 0
  },
  {
    "s": 4250.0,
    "v_feas": 234.9,
    "v_donor": 234.9,
    "driver": "LEC",
    "kappa": 0.000263,
    "drs": 0
  },
  {
    "s": 4260.0,
    "v_feas": 237.7,
    "v_donor": 237.7,
    "driver": "LEC",
    "kappa": 0.000161,
    "drs": 0
  },
  {
    "s": 4270.0,
    "v_feas": 240.6,
    "v_donor": 240.6,
    "driver": "LEC",
    "kappa": 0.00023,
    "drs": 0
  },
  {
    "s": 4280.0,
    "v_feas": 244.1,
    "v_donor": 244.4,
    "driver": "LEC",
    "kappa": 0.000379,
    "drs": 0
  },
  {
    "s": 4290.0,
    "v_feas": 247.3,
    "v_donor": 247.8,
    "driver": "LEC",
    "kappa": 0.000372,
    "drs": 0
  },
  {
    "s": 4300.0,
    "v_feas": 250.3,
    "v_donor": 250.7,
    "driver": "LEC",
    "kappa": 0.000145,
    "drs": 0
  },
  {
    "s": 4310.0,
    "v_feas": 252.2,
    "v_donor": 252.2,
    "driver": "LEC",
    "kappa": 7.7e-05,
    "drs": 0
  },
  {
    "s": 4320.0,
    "v_feas": 254.2,
    "v_donor": 254.3,
    "driver": "LEC",
    "kappa": 0.000202,
    "drs": 0
  },
  {
    "s": 4330.0,
    "v_feas": 256.7,
    "v_donor": 257.4,
    "driver": "LEC",
    "kappa": 0.000487,
    "drs": 0
  },
  {
    "s": 4340.0,
    "v_feas": 259.0,
    "v_donor": 259.0,
    "driver": "LEC",
    "kappa": 0.000215,
    "drs": 0
  },
  {
    "s": 4350.0,
    "v_feas": 260.6,
    "v_donor": 260.6,
    "driver": "LEC",
    "kappa": -6.6e-05,
    "drs": 0
  },
  {
    "s": 4360.0,
    "v_feas": 262.7,
    "v_donor": 263.1,
    "driver": "LEC",
    "kappa": -1.2e-05,
    "drs": 0
  },
  {
    "s": 4370.0,
    "v_feas": 264.7,
    "v_donor": 265.3,
    "driver": "LEC",
    "kappa": 0.000113,
    "drs": 0
  },
  {
    "s": 4380.0,
    "v_feas": 266.6,
    "v_donor": 266.7,
    "driver": "LEC",
    "kappa": 0.000171,
    "drs": 0
  },
  {
    "s": 4390.0,
    "v_feas": 268.0,
    "v_donor": 268.0,
    "driver": "LEC",
    "kappa": 0.000111,
    "drs": 0
  },
  {
    "s": 4400.0,
    "v_feas": 269.4,
    "v_donor": 269.6,
    "driver": "LEC",
    "kappa": -3.3e-05,
    "drs": 0
  },
  {
    "s": 4410.0,
    "v_feas": 271.0,
    "v_donor": 273.1,
    "driver": "LEC",
    "kappa": -0.000182,
    "drs": 0
  },
  {
    "s": 4420.0,
    "v_feas": 272.5,
    "v_donor": 274.4,
    "driver": "LEC",
    "kappa": 2e-06,
    "drs": 0
  },
  {
    "s": 4430.0,
    "v_feas": 274.0,
    "v_donor": 275.6,
    "driver": "LEC",
    "kappa": 0.000162,
    "drs": 0
  },
  {
    "s": 4440.0,
    "v_feas": 275.3,
    "v_donor": 276.8,
    "driver": "LEC",
    "kappa": 0.000121,
    "drs": 0
  },
  {
    "s": 4450.0,
    "v_feas": 276.6,
    "v_donor": 277.9,
    "driver": "LEC",
    "kappa": -0.000128,
    "drs": 0
  },
  {
    "s": 4460.0,
    "v_feas": 277.8,
    "v_donor": 279.1,
    "driver": "LEC",
    "kappa": -0.000189,
    "drs": 0
  },
  {
    "s": 4470.0,
    "v_feas": 278.9,
    "v_donor": 281.0,
    "driver": "LEC",
    "kappa": -6.9e-05,
    "drs": 0
  },
  {
    "s": 4480.0,
    "v_feas": 280.0,
    "v_donor": 282.9,
    "driver": "LEC",
    "kappa": 0.000111,
    "drs": 0
  },
  {
    "s": 4490.0,
    "v_feas": 281.0,
    "v_donor": 283.8,
    "driver": "LEC",
    "kappa": 0.000261,
    "drs": 0
  },
  {
    "s": 4500.0,
    "v_feas": 282.0,
    "v_donor": 284.7,
    "driver": "LEC",
    "kappa": 0.000178,
    "drs": 0
  },
  {
    "s": 4510.0,
    "v_feas": 282.9,
    "v_donor": 285.6,
    "driver": "LEC",
    "kappa": -2.8e-05,
    "drs": 0
  },
  {
    "s": 4520.0,
    "v_feas": 283.8,
    "v_donor": 286.5,
    "driver": "LEC",
    "kappa": -0.000197,
    "drs": 0
  },
  {
    "s": 4530.0,
    "v_feas": 284.6,
    "v_donor": 287.5,
    "driver": "LEC",
    "kappa": -0.000193,
    "drs": 0
  },
  {
    "s": 4540.0,
    "v_feas": 285.4,
    "v_donor": 288.7,
    "driver": "LEC",
    "kappa": 3.9e-05,
    "drs": 0
  },
  {
    "s": 4550.0,
    "v_feas": 286.1,
    "v_donor": 289.9,
    "driver": "LEC",
    "kappa": 0.000139,
    "drs": 0
  },
  {
    "s": 4560.0,
    "v_feas": 286.8,
    "v_donor": 290.8,
    "driver": "LEC",
    "kappa": 7.1e-05,
    "drs": 0
  },
  {
    "s": 4570.0,
    "v_feas": 287.5,
    "v_donor": 291.6,
    "driver": "LEC",
    "kappa": -6.7e-05,
    "drs": 0
  },
  {
    "s": 4580.0,
    "v_feas": 288.1,
    "v_donor": 292.5,
    "driver": "LEC",
    "kappa": -0.00026,
    "drs": 0
  },
  {
    "s": 4590.0,
    "v_feas": 288.8,
    "v_donor": 293.1,
    "driver": "LEC",
    "kappa": -9.1e-05,
    "drs": 0
  },
  {
    "s": 4600.0,
    "v_feas": 289.3,
    "v_donor": 293.8,
    "driver": "LEC",
    "kappa": 0.000196,
    "drs": 0
  },
  {
    "s": 4610.0,
    "v_feas": 289.9,
    "v_donor": 294.0,
    "driver": "LEC",
    "kappa": 0.000159,
    "drs": 0
  },
  {
    "s": 4620.0,
    "v_feas": 290.4,
    "v_donor": 294.0,
    "driver": "LEC",
    "kappa": 0.000123,
    "drs": 0
  },
  {
    "s": 4630.0,
    "v_feas": 290.9,
    "v_donor": 295.1,
    "driver": "LEC",
    "kappa": 0.000143,
    "drs": 0
  },
  {
    "s": 4640.0,
    "v_feas": 291.4,
    "v_donor": 296.3,
    "driver": "LEC",
    "kappa": 0.000178,
    "drs": 0
  },
  {
    "s": 4650.0,
    "v_feas": 291.8,
    "v_donor": 296.9,
    "driver": "LEC",
    "kappa": 0.000101,
    "drs": 0
  },
  {
    "s": 4660.0,
    "v_feas": 292.2,
    "v_donor": 297.0,
    "driver": "LEC",
    "kappa": 0.000104,
    "drs": 0
  },
  {
    "s": 4670.0,
    "v_feas": 292.6,
    "v_donor": 297.0,
    "driver": "LEC",
    "kappa": 0.000164,
    "drs": 0
  },
  {
    "s": 4680.0,
    "v_feas": 293.0,
    "v_donor": 297.2,
    "driver": "LEC",
    "kappa": 0.000116,
    "drs": 0
  },
  {
    "s": 4690.0,
    "v_feas": 293.4,
    "v_donor": 298.4,
    "driver": "LEC",
    "kappa": 3.9e-05,
    "drs": 0
  },
  {
    "s": 4700.0,
    "v_feas": 293.8,
    "v_donor": 299.0,
    "driver": "LEC",
    "kappa": 0.0,
    "drs": 0
  },
  {
    "s": 4710.0,
    "v_feas": 294.1,
    "v_donor": 296.8,
    "driver": "SAI",
    "kappa": 2e-05,
    "drs": 0
  },
  {
    "s": 4720.0,
    "v_feas": 294.4,
    "v_donor": 297.0,
    "driver": "SAI",
    "kappa": -4.9e-05,
    "drs": 0
  },
  {
    "s": 4730.0,
    "v_feas": 294.7,
    "v_donor": 296.7,
    "driver": "SAI",
    "kappa": -0.000103,
    "drs": 0
  },
  {
    "s": 4740.0,
    "v_feas": 295.0,
    "v_donor": 296.2,
    "driver": "SAI",
    "kappa": -0.000149,
    "drs": 0
  },
  {
    "s": 4750.0,
    "v_feas": 295.3,
    "v_donor": 295.7,
    "driver": "SAI",
    "kappa": -3.9e-05,
    "drs": 0
  },
  {
    "s": 4760.0,
    "v_feas": 295.1,
    "v_donor": 295.1,
    "driver": "SAI",
    "kappa": 0.00018,
    "drs": 0
  },
  {
    "s": 4770.0,
    "v_feas": 293.1,
    "v_donor": 293.1,
    "driver": "SAI",
    "kappa": -0.000118,
    "drs": 0
  },
  {
    "s": 4780.0,
    "v_feas": 288.5,
    "v_donor": 288.5,
    "driver": "SAI",
    "kappa": -0.000353,
    "drs": 0
  },
  {
    "s": 4790.0,
    "v_feas": 280.7,
    "v_donor": 280.7,
    "driver": "SAI",
    "kappa": -0.000255,
    "drs": 0
  },
  {
    "s": 4800.0,
    "v_feas": 259.9,
    "v_donor": 265.9,
    "driver": "SAI",
    "kappa": -0.00027,
    "drs": 0
  },
  {
    "s": 4810.0,
    "v_feas": 230.1,
    "v_donor": 249.2,
    "driver": "SAI",
    "kappa": -0.000987,
    "drs": 0
  },
  {
    "s": 4820.0,
    "v_feas": 202.3,
    "v_donor": 219.1,
    "driver": "SAI",
    "kappa": -0.006293,
    "drs": 0
  },
  {
    "s": 4830.0,
    "v_feas": 189.0,
    "v_donor": 193.9,
    "driver": "SAI",
    "kappa": -0.013164,
    "drs": 0
  },
  {
    "s": 4840.0,
    "v_feas": 172.5,
    "v_donor": 172.5,
    "driver": "SAI",
    "kappa": -0.009075,
    "drs": 0
  },
  {
    "s": 4850.0,
    "v_feas": 153.6,
    "v_donor": 153.6,
    "driver": "SAI",
    "kappa": -0.008329,
    "drs": 0
  },
  {
    "s": 4860.0,
    "v_feas": 144.7,
    "v_donor": 144.7,
    "driver": "SAI",
    "kappa": -0.010659,
    "drs": 0
  },
  {
    "s": 4870.0,
    "v_feas": 129.0,
    "v_donor": 137.4,
    "driver": "SAI",
    "kappa": -0.016269,
    "drs": 0
  },
  {
    "s": 4880.0,
    "v_feas": 113.4,
    "v_donor": 130.3,
    "driver": "SAI",
    "kappa": -0.024144,
    "drs": 0
  },
  {
    "s": 4890.0,
    "v_feas": 108.3,
    "v_donor": 127.5,
    "driver": "SAI",
    "kappa": -0.027259,
    "drs": 0
  },
  {
    "s": 4900.0,
    "v_feas": 114.2,
    "v_donor": 127.7,
    "driver": "SAI",
    "kappa": -0.021943,
    "drs": 0
  },
  {
    "s": 4910.0,
    "v_feas": 133.4,
    "v_donor": 135.4,
    "driver": "LEC",
    "kappa": -0.00549,
    "drs": 0
  },
  {
    "s": 4920.0,
    "v_feas": 141.7,
    "v_donor": 141.7,
    "driver": "LEC",
    "kappa": -0.00253,
    "drs": 0
  },
  {
    "s": 4930.0,
    "v_feas": 149.1,
    "v_donor": 150.3,
    "driver": "LEC",
    "kappa": -0.010522,
    "drs": 0
  },
  {
    "s": 4940.0,
    "v_feas": 133.6,
    "v_donor": 161.9,
    "driver": "LEC",
    "kappa": -0.01999,
    "drs": 0
  },
  {
    "s": 4950.0,
    "v_feas": 140.2,
    "v_donor": 171.2,
    "driver": "LEC",
    "kappa": -0.011263,
    "drs": 0
  },
  {
    "s": 4960.0,
    "v_feas": 156.7,
    "v_donor": 179.2,
    "driver": "LEC",
    "kappa": -0.003807,
    "drs": 0
  },
  {
    "s": 4970.0,
    "v_feas": 170.1,
    "v_donor": 186.7,
    "driver": "LEC",
    "kappa": -0.003105,
    "drs": 0
  },
  {
    "s": 4980.0,
    "v_feas": 181.1,
    "v_donor": 193.9,
    "driver": "LEC",
    "kappa": -0.004521,
    "drs": 0
  },
  {
    "s": 4990.0,
    "v_feas": 190.5,
    "v_donor": 200.1,
    "driver": "LEC",
    "kappa": -0.005585,
    "drs": 0
  },
  {
    "s": 5000.0,
    "v_feas": 198.7,
    "v_donor": 204.3,
    "driver": "LEC",
    "kappa": -0.00438,
    "drs": 0
  },
  {
    "s": 5010.0,
    "v_feas": 205.9,
    "v_donor": 209.5,
    "driver": "LEC",
    "kappa": -0.001114,
    "drs": 0
  },
  {
    "s": 5020.0,
    "v_feas": 212.4,
    "v_donor": 215.4,
    "driver": "LEC",
    "kappa": -1e-06,
    "drs": 0
  },
  {
    "s": 5030.0,
    "v_feas": 218.2,
    "v_donor": 221.2,
    "driver": "LEC",
    "kappa": -0.00015,
    "drs": 0
  },
  {
    "s": 5040.0,
    "v_feas": 223.5,
    "v_donor": 225.8,
    "driver": "LEC",
    "kappa": -0.00076,
    "drs": 0
  },
  {
    "s": 5050.0,
    "v_feas": 228.3,
    "v_donor": 229.0,
    "driver": "LEC",
    "kappa": -0.000443,
    "drs": 0
  },
  {
    "s": 5060.0,
    "v_feas": 232.7,
    "v_donor": 232.9,
    "driver": "LEC",
    "kappa": 8.2e-05,
    "drs": 0
  },
  {
    "s": 5070.0,
    "v_feas": 236.7,
    "v_donor": 237.2,
    "driver": "LEC",
    "kappa": 0.000511,
    "drs": 0
  },
  {
    "s": 5080.0,
    "v_feas": 240.4,
    "v_donor": 240.7,
    "driver": "LEC",
    "kappa": 0.000453,
    "drs": 0
  },
  {
    "s": 5090.0,
    "v_feas": 243.2,
    "v_donor": 243.2,
    "driver": "LEC",
    "kappa": 0.000229,
    "drs": 0
  },
  {
    "s": 5100.0,
    "v_feas": 246.3,
    "v_donor": 246.3,
    "driver": "LEC",
    "kappa": 4.4e-05,
    "drs": 0
  },
  {
    "s": 5110.0,
    "v_feas": 247.0,
    "v_donor": 247.0,
    "driver": "LEC",
    "kappa": -0.000122,
    "drs": 0
  },
  {
    "s": 5120.0,
    "v_feas": 248.2,
    "v_donor": 248.8,
    "driver": "LEC",
    "kappa": -7.7e-05,
    "drs": 0
  },
  {
    "s": 5130.0,
    "v_feas": 251.1,
    "v_donor": 253.4,
    "driver": "LEC",
    "kappa": -7.7e-05,
    "drs": 0
  },
  {
    "s": 5140.0,
    "v_feas": 253.8,
    "v_donor": 257.3,
    "driver": "LEC",
    "kappa": -0.000116,
    "drs": 0
  },
  {
    "s": 5150.0,
    "v_feas": 256.4,
    "v_donor": 260.6,
    "driver": "LEC",
    "kappa": 4e-06,
    "drs": 0
  },
  {
    "s": 5160.0,
    "v_feas": 258.7,
    "v_donor": 261.8,
    "driver": "LEC",
    "kappa": 0.000168,
    "drs": 0
  },
  {
    "s": 5170.0,
    "v_feas": 261.0,
    "v_donor": 263.7,
    "driver": "LEC",
    "kappa": 0.000171,
    "drs": 0
  },
  {
    "s": 5180.0,
    "v_feas": 263.1,
    "v_donor": 265.8,
    "driver": "LEC",
    "kappa": 1.1e-05,
    "drs": 0
  },
  {
    "s": 5190.0,
    "v_feas": 265.0,
    "v_donor": 267.8,
    "driver": "LEC",
    "kappa": -0.000119,
    "drs": 0
  },
  {
    "s": 5200.0,
    "v_feas": 266.9,
    "v_donor": 269.2,
    "driver": "LEC",
    "kappa": -0.000123,
    "drs": 0
  },
  {
    "s": 5210.0,
    "v_feas": 268.6,
    "v_donor": 270.7,
    "driver": "LEC",
    "kappa": -3.1e-05,
    "drs": 0
  },
  {
    "s": 5220.0,
    "v_feas": 270.3,
    "v_donor": 272.3,
    "driver": "LEC",
    "kappa": 5.4e-05,
    "drs": 0
  },
  {
    "s": 5230.0,
    "v_feas": 271.8,
    "v_donor": 273.9,
    "driver": "LEC",
    "kappa": 1.6e-05,
    "drs": 0
  },
  {
    "s": 5240.0,
    "v_feas": 273.3,
    "v_donor": 275.0,
    "driver": "LEC",
    "kappa": 6.5e-05,
    "drs": 0
  },
  {
    "s": 5250.0,
    "v_feas": 274.7,
    "v_donor": 275.0,
    "driver": "LEC",
    "kappa": 0.000203,
    "drs": 0
  },
  {
    "s": 5260.0,
    "v_feas": 276.0,
    "v_donor": 276.1,
    "driver": "LEC",
    "kappa": 0.000182,
    "drs": 1
  },
  {
    "s": 5270.0,
    "v_feas": 278.5,
    "v_donor": 278.8,
    "driver": "LEC",
    "kappa": 1.6e-05,
    "drs": 1
  },
  {
    "s": 5280.0,
    "v_feas": 280.9,
    "v_donor": 281.3,
    "driver": "LEC",
    "kappa": -6.6e-05,
    "drs": 1
  },
  {
    "s": 5290.0,
    "v_feas": 283.0,
    "v_donor": 283.0,
    "driver": "LEC",
    "kappa": -0.000115,
    "drs": 1
  },
  {
    "s": 5300.0,
    "v_feas": 284.3,
    "v_donor": 284.3,
    "driver": "LEC",
    "kappa": -0.000159,
    "drs": 1
  },
  {
    "s": 5310.0,
    "v_feas": 285.6,
    "v_donor": 285.6,
    "driver": "LEC",
    "kappa": -0.000141,
    "drs": 1
  },
  {
    "s": 5320.0,
    "v_feas": 286.6,
    "v_donor": 286.6,
    "driver": "LEC",
    "kappa": 0.000496,
    "drs": 1
  },
  {
    "s": 5330.0,
    "v_feas": 287.9,
    "v_donor": 287.9,
    "driver": "LEC",
    "kappa": 0.000217,
    "drs": 1
  },
  {
    "s": 5340.0,
    "v_feas": 289.8,
    "v_donor": 289.9,
    "driver": "LEC",
    "kappa": 8.2e-05,
    "drs": 1
  },
  {
    "s": 5350.0,
    "v_feas": 291.2,
    "v_donor": 291.2,
    "driver": "LEC",
    "kappa": 5.1e-05,
    "drs": 1
  },
  {
    "s": 5360.0,
    "v_feas": 291.8,
    "v_donor": 291.8,
    "driver": "LEC",
    "kappa": 7.7e-05,
    "drs": 1
  }
]
};

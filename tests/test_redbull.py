"""
Unit test suite for Red Bull Racing (VER vs PER) Extension.
Tests data validation, model calibration parameters, theoretical composite,
physics-constrained feasibility, and segmentation robustness.
"""

from pathlib import Path
import numpy as np
import pandas as pd
import pytest

from src.configs.redbull_config import OUTPUT_PROCESSED_DIR, DEFAULT_PARAMS


@pytest.fixture(scope="module")
def rbr_telemetry():
    path = OUTPUT_PROCESSED_DIR / "redbull_aligned_telemetry.csv"
    assert path.exists(), f"Missing {path}"
    return pd.read_csv(path)


@pytest.fixture(scope="module")
def rbr_exp03_summary():
    path = OUTPUT_PROCESSED_DIR / "redbull_experiment_03_summary.csv"
    assert path.exists(), f"Missing {path}"
    return pd.read_csv(path).iloc[0].to_dict()


@pytest.fixture(scope="module")
def rbr_composite_100m():
    path = OUTPUT_PROCESSED_DIR / "redbull_physics_constrained_composite_100m.csv"
    assert path.exists(), f"Missing {path}"
    return pd.read_csv(path)


@pytest.fixture(scope="module")
def rbr_robustness():
    path = OUTPUT_PROCESSED_DIR / "redbull_experiment_04_segmentation_robustness.csv"
    assert path.exists(), f"Missing {path}"
    return pd.read_csv(path)


class TestRedBullTelemetry:
    """Verifies RB19 telemetry integrity, spatial alignment, and physical limits."""

    def test_spatial_grid_properties(self, rbr_telemetry):
        dist = rbr_telemetry["Distance"].values
        assert dist[0] == 0.0
        assert np.isclose(dist[-1], 5358.0, atol=1e-3)
        assert np.all(np.diff(dist) > 0), "Distance must be strictly monotonic"
        assert np.allclose(np.diff(dist), 1.0, atol=1e-4), "Spatial step must be 1.0 m"

    def test_speed_values_within_bounds(self, rbr_telemetry):
        for col in ["Speed_VER_mps", "Speed_PER_mps"]:
            v = rbr_telemetry[col].values
            assert not np.any(np.isnan(v))
            assert np.all(v > 15.0), f"{col} speed must exceed 15 m/s (~54 km/h)"
            assert np.all(v < 100.0), f"{col} speed must be below 100 m/s (~360 km/h)"

    def test_drs_binary(self, rbr_telemetry):
        drs = rbr_telemetry["DRS_active"].values
        unique_vals = set(np.unique(drs))
        assert unique_vals.issubset({0, 1})


class TestRedBullModelCalibration:
    """Verifies RB19 vehicle model parameters adhere to Policy A."""

    def test_policy_a_parameters(self):
        params_path = OUTPUT_PROCESSED_DIR / "redbull_calibrated_parameters.csv"
        assert params_path.exists()
        params = pd.read_csv(params_path).iloc[0].to_dict()

        assert np.isclose(params["mu_x"], 1.700, atol=1e-4), "Policy A requires fixed mu_x = 1.700"
        assert np.isclose(params["mass"], 810.0, atol=1e-1), "Vehicle mass must be 810 kg"
        assert params["k_drag_drs_off"] > 0.5
        assert params["k_down"] > 1.0
        assert params["mu_y"] > 1.0


class TestRedBullFeasibilityConstraints:
    """Verifies periodic boundary conditions, continuity, and decomposition balance."""

    def test_periodicity_error(self, rbr_exp03_summary, rbr_composite_100m):
        v_start = rbr_composite_100m["Speed_mps"].iloc[0]
        v_end = rbr_composite_100m["Speed_mps"].iloc[-1]
        periodicity_err = abs(v_end - v_start)

        assert periodicity_err < 0.01, f"Periodicity error {periodicity_err:.5f} exceeds 0.01 m/s"
        assert np.isclose(periodicity_err, rbr_exp03_summary["Periodicity_Error_Feasible_mps"], atol=1e-4)

    def test_no_nan_or_inf(self, rbr_composite_100m):
        assert not rbr_composite_100m.isna().any().any()
        numeric_df = rbr_composite_100m.select_dtypes(include=np.number)
        assert not np.isinf(numeric_df.values).any()

    def test_feasibility_gap_decomposition(self, rbr_exp03_summary):
        t_theo = rbr_exp03_summary["T_theoretical_s"]
        t_feas = rbr_exp03_summary["T_feasible_donor_capped_s"]
        gap = rbr_exp03_summary["Theoretical_to_Feasible_Gap_s"]

        assert np.isclose(t_feas - t_theo, gap, atol=1e-3)

        # Decomposition balance
        d_ke = rbr_exp03_summary["Diagnostic_KE_Penalty_s"]
        d_brk = rbr_exp03_summary["Diagnostic_Braking_Penalty_s"]
        d_trac = rbr_exp03_summary["Diagnostic_Corner_Exit_Grip_Deficit_s"]
        d_res = rbr_exp03_summary["Residual_State_Propagation_Term_s"]

        sum_components = d_ke + d_brk + d_trac + d_res
        assert np.isclose(sum_components, gap, atol=1e-3), "Attribution components must sum to total gap"


class TestRedBullSegmentationRobustness:
    """Verifies 50m, 100m, and 250m robustness metrics and persistent feasibility penalty."""

    def test_all_resolutions_present(self, rbr_robustness):
        expected_resolutions = [50.0, 100.0, 250.0]
        actual_resolutions = rbr_robustness["segment_length_m"].tolist()
        assert np.allclose(sorted(actual_resolutions), sorted(expected_resolutions))

    def test_feasibility_penalty_persists(self, rbr_robustness):
        for _, row in rbr_robustness.iterrows():
            pen = row["feasibility_penalty_s"]
            gain_ver = row["theoretical_gain_vs_ver_s"]
            assert pen > 3.0, f"Feasibility penalty {pen}s too low at {row['segment_length_m']}m"
            assert pen > gain_ver, "Feasibility penalty must exceed theoretical gain"

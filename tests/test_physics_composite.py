"""
Unit test suite for Experiment 03: Physics-Constrained Composite Module.
Tests composite array assembly, state continuity, periodic boundary conditions,
donor speed cap inequality constraints, and diagnostic balance.
"""

import pytest
import numpy as np
import pandas as pd
from src.composite.physics_composite import PhysicsConstrainedCompositeBuilder
from src.vehicle_model.level2_coupled import Level2CoupledModel
from src.vehicle_model.forward_backward_solver import ForwardBackwardSolver
from src.synthesis.gap_attribution import GapAttributionAnalyzer


@pytest.fixture
def synthetic_driver_data():
    """Generates synthetic 1000m closed-circuit track data for two drivers."""
    s = np.arange(0.0, 1001.0, 1.0)
    n = len(s)

    # Both drivers have periodic boundary at start/finish (e.g. 60 m/s at s=0 and s=1000)
    # Driver 1 is faster in sector 1 (s in [0, 500]), Driver 2 is faster in sector 2 (s in [500, 1000])
    v1 = np.full(n, 60.0)
    v1[100:400] = 70.0  # D1 fast in middle of sector 1
    k1 = np.full(n, 0.003)
    k1[450:550] = 0.015  # Corner at midpoint
    k1[900:1000] = 0.015 # Corner before start/finish line
    drs1 = np.zeros(n, dtype=int)
    drs1[150:350] = 1

    df_d1 = pd.DataFrame({
        "Distance": s,
        "Speed_mps": v1,
        "Speed_kmh": v1 * 3.6,
        "Curvature_kappa": k1,
        "DRS_active": drs1,
        "X": s,
        "Y": np.zeros(n),
    })

    v2 = np.full(n, 60.0)
    v2[600:900] = 72.0  # D2 fast in middle of sector 2
    k2 = np.full(n, 0.003)
    k2[450:550] = 0.015
    k2[900:1000] = 0.015
    drs2 = np.zeros(n, dtype=int)
    drs2[650:850] = 1

    df_d2 = pd.DataFrame({
        "Distance": s,
        "Speed_mps": v2,
        "Speed_kmh": v2 * 3.6,
        "Curvature_kappa": k2,
        "DRS_active": drs2,
        "X": s,
        "Y": np.zeros(n),
    })

    # 100m segmentation (10 segments)
    segments = []
    for seg_id in range(10):
        s_st = seg_id * 100.0
        s_en = (seg_id + 1) * 100.0
        # Winner alternates: D1 wins seg 1-3, D2 wins seg 6-8, D1 wins elsewhere
        winner = "Driver2" if seg_id in [6, 7, 8] else "Driver1"
        segments.append({
            "segment_id": seg_id,
            "s_start": s_st,
            "s_end": s_en,
            "length_m": 100.0,
            "winner": winner,
            "dt_winner": 100.0 / (72.0 if winner == "Driver2" else 65.0),
        })
    segments_df = pd.DataFrame(segments)

    return df_d1, df_d2, segments_df


def test_composite_array_integrity(synthetic_driver_data):
    """Test 1: Assembled composite arrays strictly inherit properties from winning drivers."""
    df_d1, df_d2, segments_df = synthetic_driver_data
    builder = PhysicsConstrainedCompositeBuilder(step_ds=1.0)
    comp_df = builder.build_composite_arrays(df_d1, df_d2, segments_df, "Driver1", "Driver2")

    # In segments 0-5 (0-600m), winner is Driver1
    first_part = comp_df[(comp_df["Distance"] >= 0.0) & (comp_df["Distance"] < 600.0)]
    assert (first_part["Donor_Driver"] == "Driver1").all()
    assert np.allclose(first_part["Curvature_kappa"].values, df_d1["Curvature_kappa"].iloc[:600].values)
    assert np.allclose(first_part["Donor_Speed_mps"].values, df_d1["Speed_mps"].iloc[:600].values)

    # In segments 6-8 (601-900m), winner is Driver2
    second_part = comp_df[(comp_df["Distance"] > 600.0) & (comp_df["Distance"] <= 900.0)]
    assert (second_part["Donor_Driver"] == "Driver2").all()
    assert np.allclose(second_part["Curvature_kappa"].values, df_d2["Curvature_kappa"].iloc[601:901].values)
    assert np.allclose(second_part["Donor_Speed_mps"].values, df_d2["Speed_mps"].iloc[601:901].values)


def test_c0_velocity_continuity(synthetic_driver_data):
    """Test 2: Feasible trajectory exhibits exact C^0 continuity with physical acceleration bounds."""
    df_d1, df_d2, segments_df = synthetic_driver_data
    builder = PhysicsConstrainedCompositeBuilder(step_ds=1.0)
    comp_df = builder.build_composite_arrays(df_d1, df_d2, segments_df, "Driver1", "Driver2")

    model = Level2CoupledModel()
    solver = ForwardBackwardSolver(model, step_ds=1.0)

    sim_df, diag = solver.solve_periodic_lap(
        distances=comp_df["Distance"].values,
        curvatures=comp_df["Curvature_kappa"].values,
        drs_active=comp_df["DRS_active"].values,
        v_donor_caps=comp_df["Donor_Speed_mps"].values,
        tol=0.01,
    )

    v = sim_df["Speed_mps"].values
    dv = np.abs(np.diff(v))
    # For ds=1m, dv cannot exceed ~0.5 m/s even under 20 m/s^2 deceleration
    assert np.max(dv) < 1.0, f"Max adjacent dv too large: {np.max(dv):.4f} m/s"


def test_periodic_boundary_condition(synthetic_driver_data):
    """Test 3: Periodic solver enforces closed-circuit boundary condition |v(S) - v(0)| <= tol."""
    df_d1, df_d2, segments_df = synthetic_driver_data
    builder = PhysicsConstrainedCompositeBuilder(step_ds=1.0)
    comp_df = builder.build_composite_arrays(df_d1, df_d2, segments_df, "Driver1", "Driver2")

    model = Level2CoupledModel()
    solver = ForwardBackwardSolver(model, step_ds=1.0)

    sim_df, diag = solver.solve_periodic_lap(
        distances=comp_df["Distance"].values,
        curvatures=comp_df["Curvature_kappa"].values,
        drs_active=comp_df["DRS_active"].values,
        v_donor_caps=comp_df["Donor_Speed_mps"].values,
        tol=0.01,
    )

    assert diag["converged"] is True
    assert diag["periodicity_error"] <= 0.01
    assert abs(sim_df["Speed_mps"].iloc[-1] - sim_df["Speed_mps"].iloc[0]) <= 0.01


def test_donor_speed_envelope_respected(synthetic_driver_data):
    """Test 4: Case B speed profile strictly satisfies v(s) <= v_donor_cap(s) everywhere."""
    df_d1, df_d2, segments_df = synthetic_driver_data
    builder = PhysicsConstrainedCompositeBuilder(step_ds=1.0)
    comp_df = builder.build_composite_arrays(df_d1, df_d2, segments_df, "Driver1", "Driver2")

    model = Level2CoupledModel()
    solver = ForwardBackwardSolver(model, step_ds=1.0)

    sim_df, diag = solver.solve_periodic_lap(
        distances=comp_df["Distance"].values,
        curvatures=comp_df["Curvature_kappa"].values,
        drs_active=comp_df["DRS_active"].values,
        v_donor_caps=comp_df["Donor_Speed_mps"].values,
        tol=0.01,
    )

    v_sim = sim_df["Speed_mps"].values
    v_cap = comp_df["Donor_Speed_mps"].values

    assert np.all(v_sim <= v_cap + 1e-4), "Feasible speed exceeded donor speed ceiling."


def test_physical_acceleration_limits(synthetic_driver_data):
    """Test 5: Derived longitudinal acceleration ax remains within engine and tire friction capacity."""
    df_d1, df_d2, segments_df = synthetic_driver_data
    builder = PhysicsConstrainedCompositeBuilder(step_ds=1.0)
    comp_df = builder.build_composite_arrays(df_d1, df_d2, segments_df, "Driver1", "Driver2")

    model = Level2CoupledModel()
    solver = ForwardBackwardSolver(model, step_ds=1.0)

    sim_df, _ = solver.solve_periodic_lap(
        distances=comp_df["Distance"].values,
        curvatures=comp_df["Curvature_kappa"].values,
        drs_active=comp_df["DRS_active"].values,
        v_donor_caps=comp_df["Donor_Speed_mps"].values,
        tol=0.01,
    )

    ax = sim_df["Accel_x_mps2"].values
    # Max engine power acceleration is ~15-20 m/s^2 at low speed, max high-downforce braking reaches 6-7g (~65 m/s^2)
    assert np.max(ax) <= 25.0
    assert np.min(ax) >= -80.0


def test_no_unphysical_values(synthetic_driver_data):
    """Test 6: Simulated trajectory contains no NaN, Inf, or negative speeds."""
    df_d1, df_d2, segments_df = synthetic_driver_data
    builder = PhysicsConstrainedCompositeBuilder(step_ds=1.0)
    comp_df = builder.build_composite_arrays(df_d1, df_d2, segments_df, "Driver1", "Driver2")

    model = Level2CoupledModel()
    solver = ForwardBackwardSolver(model, step_ds=1.0)

    sim_df, _ = solver.solve_periodic_lap(
        distances=comp_df["Distance"].values,
        curvatures=comp_df["Curvature_kappa"].values,
        drs_active=comp_df["DRS_active"].values,
        v_donor_caps=comp_df["Donor_Speed_mps"].values,
        tol=0.01,
    )

    v = sim_df["Speed_mps"].values
    t = sim_df["Time_s"].values

    assert not np.isnan(v).any()
    assert not np.isinf(v).any()
    assert (v > 0.0).all()
    assert np.all(np.diff(t) > 0.0), "Time array is not strictly monotonic."


def test_deterministic_reproducibility(synthetic_driver_data):
    """Test 7: Successive solves produce bitwise identical output."""
    df_d1, df_d2, segments_df = synthetic_driver_data
    builder = PhysicsConstrainedCompositeBuilder(step_ds=1.0)
    comp_df = builder.build_composite_arrays(df_d1, df_d2, segments_df, "Driver1", "Driver2")

    model = Level2CoupledModel()
    solver = ForwardBackwardSolver(model, step_ds=1.0)

    sim1, _ = solver.solve_periodic_lap(
        distances=comp_df["Distance"].values,
        curvatures=comp_df["Curvature_kappa"].values,
        drs_active=comp_df["DRS_active"].values,
        v_donor_caps=comp_df["Donor_Speed_mps"].values,
        tol=0.01,
    )

    sim2, _ = solver.solve_periodic_lap(
        distances=comp_df["Distance"].values,
        curvatures=comp_df["Curvature_kappa"].values,
        drs_active=comp_df["DRS_active"].values,
        v_donor_caps=comp_df["Donor_Speed_mps"].values,
        tol=0.01,
    )

    np.testing.assert_array_equal(sim1["Speed_mps"].values, sim2["Speed_mps"].values)
    np.testing.assert_array_equal(sim1["Time_s"].values, sim2["Time_s"].values)


def test_diagnostic_balance(synthetic_driver_data):
    """Test 8: First-order energetic diagnostic decomposition components sum exactly to total gap."""
    df_d1, df_d2, segments_df = synthetic_driver_data
    builder = PhysicsConstrainedCompositeBuilder(step_ds=1.0)
    comp_df = builder.build_composite_arrays(df_d1, df_d2, segments_df, "Driver1", "Driver2")

    model = Level2CoupledModel()
    solver = ForwardBackwardSolver(model, step_ds=1.0)

    sim_df, _ = solver.solve_periodic_lap(
        distances=comp_df["Distance"].values,
        curvatures=comp_df["Curvature_kappa"].values,
        drs_active=comp_df["DRS_active"].values,
        v_donor_caps=comp_df["Donor_Speed_mps"].values,
        tol=0.01,
    )

    jumps_df = pd.DataFrame([{
        "boundary_s": 500.0,
        "driver_switch": True,
        "delta_v_mps": 5.0,
        "delta_energy_kj": 50.0,
    }])

    gap_total = 1.500
    analyzer = GapAttributionAnalyzer(mass=810.0)
    diag = analyzer.attribute_gap(sim_df, segments_df, jumps_df, gap_total_s=gap_total)

    sum_terms = (
        diag["diagnostic_ke_acceleration_penalty_s"]
        + diag["diagnostic_braking_displacement_penalty_s"]
        + diag["diagnostic_corner_exit_grip_deficit_s"]
        + diag["residual_state_propagation_term_s"]
    )

    assert abs(sum_terms - gap_total) < 1e-3
    assert diag["methodology_classification"] == "FIRST_ORDER_ENERGETIC_DIAGNOSTIC_DECOMPOSITION"

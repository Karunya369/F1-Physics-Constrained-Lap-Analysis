"""
Test suite for Experiment 04: Segmentation Sensitivity of the
Theoretical-to-Feasible Cross-Driver Lap-Time Gap.

Tests cover:
  - Exact [0, 5369.0 m] track coverage for all three resolutions (50, 100, 250 m)
  - No gaps, no overlaps at any resolution
  - Correct expected segment counts
  - Correct final partial segment for each resolution
  - Deterministic and finite driver selection / theoretical composite
  - Finite feasibility lap times from the physics solver
  - Periodicity residual <= 0.01 m/s for all resolutions
  - Zero significant donor-cap violations (v <= v_donor + 1e-3)
  - All three resolutions present in the output CSV
  - Canonical 100 m values reproduce Experiments 02/03 within 5 ms

All tests are READ-ONLY with respect to Experiments 01–03:
  - No source files or canonical CSVs are modified.
  - Experiment 02/03 canonical values are verified against the locked
    experiment_03_summary.csv artefact.
"""

import sys
from pathlib import Path
import pytest
import numpy as np
import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from src.preprocessing.segmentation import CircuitSegmenter
from src.baseline.theoretical_composite import TheoreticalCompositeAnalyzer
from src.composite.physics_composite import PhysicsConstrainedCompositeBuilder
from src.vehicle_model.level2_coupled import Level2CoupledModel
from src.vehicle_model.forward_backward_solver import ForwardBackwardSolver
from src.config import PROCESSED_DIR


# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
CANONICAL_TRACK_LENGTH_M = 5369.0
RESOLUTIONS_M = [50.0, 100.0, 250.0]

# Expected segment counts:  floor(5369 / L) full + 1 partial if remainder > 0
# 50 m:  5369 / 50 = 107.38  → 107 full + 1 partial = 108 segments
# 100 m: 5369 / 100 = 53.69  → 53 full + 1 partial = 54 segments
# 250 m: 5369 / 250 = 21.476 → 21 full + 1 partial = 22 segments
EXPECTED_SEGMENT_COUNTS = {50: 108, 100: 54, 250: 22}

# Final partial segment lengths (S - floor(S/L)*L)
EXPECTED_FINAL_LENGTHS = {50: 19.0, 100: 69.0, 250: 119.0}

# Canonical 100 m reference values (scientifically locked from Experiments 02/03)
# Active Policy A baseline: mu_x = 1.700 fixed literature reference
CANON_T_THEORETICAL_100M = 88.869   # seconds
CANON_T_FEASIBLE_100M    = 91.583   # seconds (Policy A literature baseline)
CANON_GAP_100M           = 2.714    # seconds (Policy A literature baseline)
CANON_TOLERANCE_S        = 0.005    # 5 ms tolerance for floating-point accumulation

# Historical unconstrained optimizer reference values (mu_x = 0.9356)
HISTORICAL_T_FEASIBLE_100M = 91.805
HISTORICAL_GAP_100M        = 2.937

# Periodicity / solver tolerances
PERIODICITY_TOL_MPS = 0.01
DONOR_CAP_TOL_MPS   = 1e-3


# ---------------------------------------------------------------------------
# Fixture: synthetic two-driver telemetry on a 5369 m straight-ish track
# ---------------------------------------------------------------------------

@pytest.fixture(scope="module")
def synthetic_track():
    """
    Minimal synthetic telemetry that replicates the canonical track length
    S = 5369.0 m with realistic speeds and gentle curvature.

    Two drivers are synthesised so that each wins different segments:
      - Driver 1 (Leclerc) is faster in [0, 2700) m
      - Driver 2 (Sainz)   is faster in [2700, 5369] m

    Speed profiles are deliberately simple constants so that segment integral
    times are analytically verifiable.
    """
    s = np.arange(0.0, CANONICAL_TRACK_LENGTH_M + 1.0, 1.0)
    n = len(s)

    # Driver 1: 70 m/s in first half, 62 m/s in second half
    v1 = np.where(s < 2700.0, 70.0, 62.0).astype(float)
    # Driver 2: 62 m/s in first half, 70 m/s in second half
    v2 = np.where(s < 2700.0, 62.0, 70.0).astype(float)

    kappa = np.full(n, 0.001)   # nearly straight; avoids solver stalling
    drs   = np.zeros(n, dtype=int)

    df_d1 = pd.DataFrame({
        "Distance":        s,
        "Speed_mps":       v1,
        "Speed_kmh":       v1 * 3.6,
        "Curvature_kappa": kappa,
        "DRS_active":      drs,
        "X": s, "Y": np.zeros(n),
    })
    df_d2 = pd.DataFrame({
        "Distance":        s,
        "Speed_mps":       v2,
        "Speed_kmh":       v2 * 3.6,
        "Curvature_kappa": kappa,
        "DRS_active":      drs,
        "X": s, "Y": np.zeros(n),
    })
    return df_d1, df_d2


# ---------------------------------------------------------------------------
# Section 1: Coverage — all three resolutions
# ---------------------------------------------------------------------------

class TestTrackCoverage:
    """Verify exact [0, 5369.0 m] coverage for all three resolutions."""

    @pytest.mark.parametrize("res_m", RESOLUTIONS_M)
    def test_starts_at_zero(self, res_m):
        segmenter = CircuitSegmenter(step_ds=1.0)
        segs = segmenter.segment_by_fixed_distance(CANONICAL_TRACK_LENGTH_M, segment_length_m=res_m)
        assert segs[0]["s_start"] == 0.0, f"[{res_m}m] First segment does not start at 0.0"

    @pytest.mark.parametrize("res_m", RESOLUTIONS_M)
    def test_ends_at_canonical_domain(self, res_m):
        segmenter = CircuitSegmenter(step_ds=1.0)
        segs = segmenter.segment_by_fixed_distance(CANONICAL_TRACK_LENGTH_M, segment_length_m=res_m)
        assert abs(segs[-1]["s_end"] - CANONICAL_TRACK_LENGTH_M) < 1e-6, (
            f"[{res_m}m] Last segment ends at {segs[-1]['s_end']} not {CANONICAL_TRACK_LENGTH_M}"
        )

    @pytest.mark.parametrize("res_m", RESOLUTIONS_M)
    def test_no_gaps(self, res_m):
        segmenter = CircuitSegmenter(step_ds=1.0)
        segs = segmenter.segment_by_fixed_distance(CANONICAL_TRACK_LENGTH_M, segment_length_m=res_m)
        report = CircuitSegmenter.validate_coverage(segs, CANONICAL_TRACK_LENGTH_M)
        assert report["n_gaps"] == 0, f"[{res_m}m] Coverage has {report['n_gaps']} gap(s): {report}"

    @pytest.mark.parametrize("res_m", RESOLUTIONS_M)
    def test_no_overlaps(self, res_m):
        segmenter = CircuitSegmenter(step_ds=1.0)
        segs = segmenter.segment_by_fixed_distance(CANONICAL_TRACK_LENGTH_M, segment_length_m=res_m)
        report = CircuitSegmenter.validate_coverage(segs, CANONICAL_TRACK_LENGTH_M)
        assert report["n_overlaps"] == 0, f"[{res_m}m] Coverage has {report['n_overlaps']} overlap(s)"

    @pytest.mark.parametrize("res_m", RESOLUTIONS_M)
    def test_full_coverage_distance(self, res_m):
        segmenter = CircuitSegmenter(step_ds=1.0)
        segs = segmenter.segment_by_fixed_distance(CANONICAL_TRACK_LENGTH_M, segment_length_m=res_m)
        covered = sum(s["length_m"] for s in segs)
        assert abs(covered - CANONICAL_TRACK_LENGTH_M) < 1e-4, (
            f"[{res_m}m] Total covered distance = {covered} m ≠ {CANONICAL_TRACK_LENGTH_M} m"
        )


# ---------------------------------------------------------------------------
# Section 2: Segment counts and final partial segment
# ---------------------------------------------------------------------------

class TestSegmentCounts:
    """Verify correct number of segments and correct final partial length."""

    @pytest.mark.parametrize("res_m", RESOLUTIONS_M)
    def test_expected_segment_count(self, res_m):
        segmenter = CircuitSegmenter(step_ds=1.0)
        segs = segmenter.segment_by_fixed_distance(CANONICAL_TRACK_LENGTH_M, segment_length_m=res_m)
        expected = EXPECTED_SEGMENT_COUNTS[int(res_m)]
        assert len(segs) == expected, (
            f"[{res_m}m] Expected {expected} segments, got {len(segs)}"
        )

    @pytest.mark.parametrize("res_m", RESOLUTIONS_M)
    def test_final_partial_segment_length(self, res_m):
        segmenter = CircuitSegmenter(step_ds=1.0)
        segs = segmenter.segment_by_fixed_distance(CANONICAL_TRACK_LENGTH_M, segment_length_m=res_m)
        expected_final = EXPECTED_FINAL_LENGTHS[int(res_m)]
        actual_final = segs[-1]["length_m"]
        assert abs(actual_final - expected_final) < 1e-4, (
            f"[{res_m}m] Final segment length = {actual_final:.4f} m, expected {expected_final:.1f} m"
        )

    @pytest.mark.parametrize("res_m", RESOLUTIONS_M)
    def test_all_full_segments_have_correct_length(self, res_m):
        """All segments except the final one must be exactly res_m long."""
        segmenter = CircuitSegmenter(step_ds=1.0)
        segs = segmenter.segment_by_fixed_distance(CANONICAL_TRACK_LENGTH_M, segment_length_m=res_m)
        for seg in segs[:-1]:
            assert abs(seg["length_m"] - res_m) < 1e-6, (
                f"[{res_m}m] Non-final segment {seg['segment_id']} has "
                f"length {seg['length_m']:.6f} m, expected {res_m} m"
            )


# ---------------------------------------------------------------------------
# Section 3: Deterministic driver selection and finite theoretical composite
# ---------------------------------------------------------------------------

class TestTheoreticalComposite:
    """Verify driver-selection determinism and finite output."""

    @pytest.mark.parametrize("res_m", RESOLUTIONS_M)
    def test_driver_selection_is_deterministic(self, res_m, synthetic_track):
        df_d1, df_d2 = synthetic_track
        segmenter = CircuitSegmenter(step_ds=1.0)
        segs = segmenter.segment_by_fixed_distance(CANONICAL_TRACK_LENGTH_M, segment_length_m=res_m)
        analyzer = TheoreticalCompositeAnalyzer(mass=810.0)

        result1 = analyzer.analyze_composite(df_d1, df_d2, segs, "D1", "D2")
        result2 = analyzer.analyze_composite(df_d1, df_d2, segs, "D1", "D2")

        winners1 = result1["segments_df"]["winner"].tolist()
        winners2 = result2["segments_df"]["winner"].tolist()
        assert winners1 == winners2, f"[{res_m}m] Driver selection is not deterministic."

    @pytest.mark.parametrize("res_m", RESOLUTIONS_M)
    def test_theoretical_time_is_finite(self, res_m, synthetic_track):
        df_d1, df_d2 = synthetic_track
        segmenter = CircuitSegmenter(step_ds=1.0)
        segs = segmenter.segment_by_fixed_distance(CANONICAL_TRACK_LENGTH_M, segment_length_m=res_m)
        analyzer = TheoreticalCompositeAnalyzer(mass=810.0)
        result = analyzer.analyze_composite(df_d1, df_d2, segs, "D1", "D2")
        t_theo = float(result["segments_df"]["dt_winner"].sum())
        assert np.isfinite(t_theo), f"[{res_m}m] Theoretical lap time is not finite: {t_theo}"
        assert t_theo > 0.0, f"[{res_m}m] Theoretical lap time is non-positive: {t_theo}"

    @pytest.mark.parametrize("res_m", RESOLUTIONS_M)
    def test_composite_not_slower_than_faster_individual(self, res_m, synthetic_track):
        df_d1, df_d2 = synthetic_track
        segmenter = CircuitSegmenter(step_ds=1.0)
        segs = segmenter.segment_by_fixed_distance(CANONICAL_TRACK_LENGTH_M, segment_length_m=res_m)
        analyzer = TheoreticalCompositeAnalyzer(mass=810.0)
        result = analyzer.analyze_composite(df_d1, df_d2, segs, "D1", "D2")

        trapz = getattr(np, "trapezoid", getattr(np, "trapz", None))
        t1 = trapz(1.0 / df_d1["Speed_mps"].values, df_d1["Distance"].values)
        t2 = trapz(1.0 / df_d2["Speed_mps"].values, df_d2["Distance"].values)
        t_best = min(t1, t2)
        t_theo = float(result["segments_df"]["dt_winner"].sum())

        assert t_theo <= t_best + 1e-4, (
            f"[{res_m}m] Theoretical composite ({t_theo:.4f} s) exceeds "
            f"fastest individual ({t_best:.4f} s)."
        )


# ---------------------------------------------------------------------------
# Section 4: Periodicity and donor-cap constraints (synthetic)
# ---------------------------------------------------------------------------

class TestFeasibilityConstraints:
    """Verify physics-solver periodicity and donor-cap inequality on synthetic data."""

    @pytest.fixture
    def simple_segments(self):
        """A minimal two-segment winner map compatible with synthetic_track."""
        # 50 m resolution on 100 m synthetic track → just enough to test mechanics
        s_total = 200.0
        return [
            {"segment_id": 0, "s_start": 0.0,   "s_end": 100.0, "length_m": 100.0, "name": "S0", "type": "FIXED"},
            {"segment_id": 1, "s_start": 100.0,  "s_end": 200.0, "length_m": 100.0, "name": "S1", "type": "FIXED"},
        ]

    def test_periodicity_below_tolerance(self):
        """Solver must achieve periodicity residual <= 0.01 m/s on synthetic closed track."""
        s = np.arange(0.0, 1001.0, 1.0)
        n = len(s)
        kappa = np.full(n, 0.001)
        drs = np.zeros(n, dtype=int)
        v_caps = np.full(n, 70.0)

        model = Level2CoupledModel()
        solver = ForwardBackwardSolver(model, step_ds=1.0)
        sim_df, diag = solver.solve_periodic_lap(
            distances=s, curvatures=kappa, drs_active=drs,
            v_donor_caps=v_caps, tol=PERIODICITY_TOL_MPS,
        )
        assert diag["converged"], "Periodic solver did not converge on simple synthetic track."
        assert diag["periodicity_error"] <= PERIODICITY_TOL_MPS, (
            f"Periodicity error {diag['periodicity_error']:.5f} > tolerance {PERIODICITY_TOL_MPS}"
        )

    def test_donor_cap_not_exceeded(self):
        """Feasible speed must not exceed donor cap anywhere (v <= v_cap + 1e-3)."""
        s = np.arange(0.0, 1001.0, 1.0)
        n = len(s)
        kappa = np.full(n, 0.001)
        drs = np.zeros(n, dtype=int)
        v_caps = np.full(n, 50.0)  # tight cap

        model = Level2CoupledModel()
        solver = ForwardBackwardSolver(model, step_ds=1.0)
        sim_df, _ = solver.solve_periodic_lap(
            distances=s, curvatures=kappa, drs_active=drs,
            v_donor_caps=v_caps, tol=PERIODICITY_TOL_MPS,
        )
        v_feas = sim_df["Speed_mps"].values
        violations = v_feas > v_caps + DONOR_CAP_TOL_MPS
        assert not np.any(violations), (
            f"Donor cap violated at {violations.sum()} points; "
            f"max excess = {np.max(v_feas - v_caps):.6f} m/s"
        )

    def test_no_nan_inf_in_feasible_output(self):
        """Feasible trajectory must be free of NaN and Inf."""
        s = np.arange(0.0, 1001.0, 1.0)
        n = len(s)
        kappa = np.full(n, 0.002)
        drs = np.zeros(n, dtype=int)
        v_caps = np.full(n, 60.0)

        model = Level2CoupledModel()
        solver = ForwardBackwardSolver(model, step_ds=1.0)
        sim_df, _ = solver.solve_periodic_lap(
            distances=s, curvatures=kappa, drs_active=drs,
            v_donor_caps=v_caps, tol=PERIODICITY_TOL_MPS,
        )
        assert not sim_df["Speed_mps"].isna().any()
        assert not np.isinf(sim_df["Speed_mps"].values).any()
        assert not sim_df["Time_s"].isna().any()


# ---------------------------------------------------------------------------
# Section 5: Output CSV verification
# ---------------------------------------------------------------------------

class TestOutputCSV:
    """Verify that the Experiment 04 output CSV is present and structurally correct."""

    @pytest.fixture(scope="class")
    def summary_df(self):
        csv_path = PROCESSED_DIR / "experiment_04_segmentation_robustness.csv"
        if not csv_path.exists():
            pytest.skip(
                f"Experiment 04 output CSV not found at {csv_path}. "
                "Run experiments/04_segmentation_robustness.py first."
            )
        return pd.read_csv(csv_path)

    def test_all_three_resolutions_present(self, summary_df):
        expected = {50, 100, 250}
        actual = set(summary_df["segment_length_m"].tolist())
        assert expected == actual, (
            f"Expected resolutions {expected}, found {actual}"
        )

    def test_no_nan_in_summary(self, summary_df):
        # retained_fraction is allowed to be NaN if denominator is degenerate,
        # but all other numeric columns must be finite
        numeric_cols = [c for c in summary_df.columns if c not in
                        ("retained_fraction", "resolution_label")]
        for col in numeric_cols:
            if pd.api.types.is_numeric_dtype(summary_df[col]):
                assert not summary_df[col].isna().any(), (
                    f"Column '{col}' contains NaN values."
                )

    def test_segment_counts_correct(self, summary_df):
        for res_m, expected_count in EXPECTED_SEGMENT_COUNTS.items():
            row = summary_df[summary_df["segment_length_m"] == res_m]
            assert len(row) == 1, f"Missing or duplicate row for {res_m}m"
            actual = int(row["number_of_segments"].iloc[0])
            assert actual == expected_count, (
                f"[{res_m}m] Expected {expected_count} segments, got {actual}"
            )

    def test_feasible_times_positive(self, summary_df):
        assert (summary_df["feasible_lap_time_s"] > 0.0).all(), (
            "One or more feasible lap times are non-positive."
        )

    def test_theoretical_times_positive(self, summary_df):
        assert (summary_df["theoretical_lap_time_s"] > 0.0).all(), (
            "One or more theoretical lap times are non-positive."
        )

    def test_periodicity_within_tolerance(self, summary_df):
        violations = summary_df[summary_df["periodicity_residual_mps"] > PERIODICITY_TOL_MPS]
        assert violations.empty, (
            f"Periodicity exceeded tolerance for:\n{violations[['resolution_label', 'periodicity_residual_mps']]}"
        )

    def test_no_donor_cap_violations(self, summary_df):
        violations = summary_df[summary_df["max_donor_cap_violation_mps"] > DONOR_CAP_TOL_MPS]
        assert violations.empty, (
            f"Donor-cap violated for:\n{violations[['resolution_label', 'max_donor_cap_violation_mps']]}"
        )

    def test_feasibility_penalty_positive(self, summary_df):
        """Feasible time must be >= theoretical time (penalty is non-negative)."""
        assert (summary_df["feasibility_penalty_s"] >= -1e-4).all(), (
            "Feasibility penalty is negative, meaning feasible < theoretical (physically impossible)."
        )

    # ----- Canonical 100 m control -----

    def test_100m_theoretical_canonical(self, summary_df):
        row = summary_df[summary_df["segment_length_m"] == 100]
        assert len(row) == 1
        t_theo = float(row["theoretical_lap_time_s"].iloc[0])
        diff = abs(t_theo - CANON_T_THEORETICAL_100M)
        assert diff <= CANON_TOLERANCE_S, (
            f"100 m T_theoretical = {t_theo:.3f} s; "
            f"canonical = {CANON_T_THEORETICAL_100M:.3f} s; "
            f"diff = {diff:.4f} s > tolerance {CANON_TOLERANCE_S} s"
        )

    def test_100m_feasible_canonical(self, summary_df):
        row = summary_df[summary_df["segment_length_m"] == 100]
        assert len(row) == 1
        t_feas = float(row["feasible_lap_time_s"].iloc[0])
        diff = abs(t_feas - CANON_T_FEASIBLE_100M)
        assert diff <= CANON_TOLERANCE_S, (
            f"100 m T_feasible = {t_feas:.3f} s; "
            f"canonical = {CANON_T_FEASIBLE_100M:.3f} s; "
            f"diff = {diff:.4f} s > tolerance {CANON_TOLERANCE_S} s"
        )

    def test_100m_gap_canonical(self, summary_df):
        row = summary_df[summary_df["segment_length_m"] == 100]
        assert len(row) == 1
        gap = float(row["feasibility_penalty_s"].iloc[0])
        diff = abs(gap - CANON_GAP_100M)
        assert diff <= CANON_TOLERANCE_S, (
            f"100 m gap = {gap:.3f} s; "
            f"canonical = {CANON_GAP_100M:.3f} s; "
            f"diff = {diff:.4f} s > tolerance {CANON_TOLERANCE_S} s"
        )


# ---------------------------------------------------------------------------
# Section 6: Experiments 01–03 canonical artefacts remain untouched
# ---------------------------------------------------------------------------

class TestCanonicalArtifactsIntact:
    """
    Read-only regression guard: Confirm the locked Experiments 01–03 output
    files have NOT been modified by any Experiment 04 code path.
    """

    def test_exp03_summary_canonical_theoretical(self):
        csv_path = PROCESSED_DIR / "experiment_03_summary.csv"
        assert csv_path.exists(), "experiment_03_summary.csv is missing — Experiment 03 artefact lost."
        df = pd.read_csv(csv_path)
        t_theo = float(df["T_theoretical_s"].iloc[0])
        assert abs(t_theo - 88.869) < 0.001, (
            f"Experiment 03 canonical T_theoretical changed: {t_theo:.3f} s"
        )

    def test_exp03_summary_canonical_feasible(self):
        csv_path = PROCESSED_DIR / "experiment_03_summary.csv"
        df = pd.read_csv(csv_path)
        t_feas = float(df["T_feasible_donor_capped_s"].iloc[0])
        assert abs(t_feas - 91.583) < 0.001, (
            f"Experiment 03 canonical T_feasible changed: {t_feas:.3f} s"
        )

    def test_exp03_summary_canonical_gap(self):
        csv_path = PROCESSED_DIR / "experiment_03_summary.csv"
        df = pd.read_csv(csv_path)
        gap = float(df["Theoretical_to_Feasible_Gap_s"].iloc[0])
        assert abs(gap - 2.714) < 0.001, (
            f"Experiment 03 canonical gap changed: {gap:.3f} s"
        )

    def test_historical_unconstrained_summary_intact(self):
        csv_path = PROCESSED_DIR / "historical_unconstrained_experiment_03_summary.csv"
        assert csv_path.exists(), "Historical unconstrained Exp03 summary artifact missing."
        df = pd.read_csv(csv_path)
        t_feas = float(df["T_feasible_donor_capped_s"].iloc[0])
        gap = float(df["Theoretical_to_Feasible_Gap_s"].iloc[0])
        assert abs(t_feas - 91.805) < 0.001, f"Historical T_feasible changed: {t_feas:.3f}"
        assert abs(gap - 2.937) < 0.001, f"Historical gap changed: {gap:.3f}"

    def test_exp02_canonical_100m_segments_file_exists(self):
        assert (PROCESSED_DIR / "theoretical_composite_100m.csv").exists(), (
            "theoretical_composite_100m.csv is missing — Experiment 02 canonical artefact lost."
        )

    def test_exp02_canonical_100m_segment_count(self):
        df = pd.read_csv(PROCESSED_DIR / "theoretical_composite_100m.csv")
        assert len(df) == 54, (
            f"Experiment 02 100m CSV has {len(df)} rows, expected 54."
        )

    def test_exp02_canonical_100m_theoretical_time(self):
        df = pd.read_csv(PROCESSED_DIR / "theoretical_composite_100m.csv")
        t_theo = float(df["dt_winner"].sum())
        assert abs(t_theo - 88.869) < 0.001, (
            f"Experiment 02 theoretical composite recalculated as {t_theo:.3f} s; expected 88.869 s"
        )

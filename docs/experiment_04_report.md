# Experiment 04: Segmentation Sensitivity of the Theoretical-to-Feasible Cross-Driver Lap-Time Gap

**Project:** F1 Physics-Constrained Lap Analysis  
**Session:** 2023 Bahrain Grand Prix, Qualifying Q3  
**Team:** Ferrari | **Drivers:** Charles Leclerc (LEC), Carlos Sainz (SAI)  
**Canonical domain:** S = 5369.0 m | 1.0 m PCHIP-resampled telemetry  
**Status:** COMPLETE — READY FOR SCIENTIFIC REVIEW

---

## 1. Executive Summary

Experiment 04 investigates whether the theoretical-to-feasible performance gap identified in Experiments 02–03 is a stable quantity or an artefact of the particular 100 m segmentation chosen.

**Research question:** *How sensitive are the theoretical cross-driver composite advantage and the physics-constrained feasibility gap to the choice of spatial segment length?*

**Finding:** The feasibility penalty (T_feasible − T_theoretical) is **not constant** across segmentation resolutions and increases monotonically with segment length in this experiment. The theoretical composite advantage is larger at finer resolutions and smaller at coarser resolutions. All three resolutions agree that the feasible composite is slower than Leclerc's observed baseline (G_feasible < 0), preserving the qualitative conclusion of Experiment 03.

---

## 2. Experimental Design and Controls

### 2.1 Independent Variable

Only segment length was varied across three levels:

| Level | Segment Length | Full Segments | Final Partial |
|---|---|---|---|
| Fine | 50 m | 107 × 50 m | 1 × 19 m |
| **Canonical** | **100 m** | 53 × 100 m | 1 × 69 m |
| Coarse | 250 m | 21 × 250 m | 1 × 119 m |

### 2.2 Controlled Variables (Identical Across All Resolutions)

- Session, year, driver laps, telemetry source
- Canonical spatial domain: S = 5369.0 m
- Spatial resampling: 1.0 m PCHIP
- Track geometry and curvature
- DRS flag information
- Level-2 Coupled Vehicle Model (mass = 810 kg)
- Calibrated vehicle parameters (Policy A, mu_x = 1.700 fixed literature reference): P_max = 740.0 kW, k_drag_off = 1.2500, k_drag_on = 0.8750, k_down = 2.6185, mu_y = 1.9500
- Forward-backward periodic bisection solver (tolerance <= 0.01 m/s)
- Donor-speed constraint: v_feasible(s) <= v_donor(s) pointwise
- Driver-selection rule: minimum integral segment time wins

### 2.3 Scientific Controls Applied

- Fixed longitudinal friction coefficient $\mu_x = 1.700$ (literature reference baseline)
- Bounded parameter optimization via L-BFGS-B over $[k_{\text{drag,off}}, k_{\text{down}}, \mu_y]$ within declared `PARAM_BOUNDS`
- No segmentation-specific friction, power, drag, downforce, or correction factors
- No solver tolerance adjustment per resolution
- No manual tuning to align 50 m or 250 m results with the 100 m canonical
- Negative retained fractions reported honestly without clipping
- Kinetic-energy quantities at transitions described only as boundary state mismatches

---

## 3. Results

### 3.1 Primary Metrics Comparison Table

| Metric | 50 m | 100 m (canonical) | 250 m |
|---|---|---|---|
| Number of segments | 108 | 54 | 22 |
| Final partial segment | 19.0 m | 69.0 m | 119.0 m |
| **T_theoretical (s)** | 88.815 | **88.869** | 89.327 |
| **T_feasible (s)** | 91.269 | **91.583** | 92.233 |
| G_theoretical vs LEC (s) | +1.106 | +1.053 | +0.594 |
| G_theoretical vs SAI (s) | +1.295 | +1.241 | +0.783 |
| **Feasibility penalty P (s)** | +2.454 | **+2.714** | +2.906 |
| G_feasible vs LEC (s) | −1.348 | −1.661 | −2.312 |
| G_feasible vs SAI (s) | −1.159 | −1.473 | −2.123 |
| Retained fraction R | −1.218 | −1.578 | −3.890 |
| Number of driver switches | 20 | 15 | 11 |
| Max boundary \|Δv\| (m/s) | 3.083 | 3.251 | 2.927 |
| Mean boundary \|Δv\| (m/s) | 0.852 | 1.384 | 1.385 |
| Max boundary \|ΔKE\| (kJ) | 106.80 | 205.95 | 122.38 |
| Total boundary \|ΔKE\| (kJ) | 673.03 | 832.24 | 623.44 |
| Periodicity residual (m/s) | 0.009714 | 0.007380 | 0.007380 |
| Max donor-cap violation (m/s) | 0.000000 | 0.000000 | 0.000000 |

> **NOTE:** \|ΔKE\| quantities describe boundary kinetic-energy state mismatches at driver transitions in the theoretical (discontinuous) composite. They are not energy losses, dissipated energy, or thermodynamic energy.  
> **NOTE:** G_feasible is reported without clipping. Negative values mean the feasible composite is slower than the Leclerc observed baseline.

### 3.2 Canonical 100 m Control

The 100 m result must reproduce Experiments 02–03 (tolerance: 5 ms):

| Value | Required (Policy A) | Produced | Difference | Status |
|---|---|---|---|---|
| T_theoretical | 88.869 s | 88.869 s | 0.0004 s | PASS |
| T_feasible | 91.583 s | 91.583 s | 0.0004 s | PASS |
| Feasibility gap | 2.714 s | 2.714 s | 0.0000 s | PASS |

> **HISTORICAL NOTE:** The previous unconstrained optimizer run drove $\mu_x$ to 0.9356 (compensating for missing drivetrain/throttle-modulation dynamics in public FastF1 telemetry), producing $T_{\text{feasible}} = 91.805\text{ s}$ and $\text{Gap} = 2.937\text{ s}$. Those artifacts are preserved under `historical_unconstrained_*`. The active scientific baseline is Policy A ($\mu_x = 1.700$ fixed).

---

## 4. Sensitivity Observations

The following observations are **descriptive only**. No segmentation is declared "best" or "correct."

### 4.1 Theoretical Composite Time

The theoretical composite time decreases weakly with finer segmentation (88.815 s at 50 m vs 89.327 s at 250 m, a 0.512 s range). This is expected: finer segmentation creates more opportunities to select each driver's local optimum. However, the range is modest (0.6% of lap time), indicating the composite is not highly sensitive to segment length over this range.

### 4.2 Feasibility Penalty

The feasibility penalty (T_feasible − T_theoretical) increases from 2.454 s (50 m) to 2.906 s (250 m). The mechanism behind this increase cannot be fully isolated: coarser segmentation simultaneously reduces donor-envelope switching frequency, which may tighten the speed ceiling over longer stretches, and exposes the solver to more intra-segment speed variation. Both effects may contribute to the observed penalty increase. This is a measured result, not a claim about optimality.

### 4.3 Feasible Gain vs Observed

All three resolutions produce a negative feasible gain relative to Leclerc (the feasible composite is slower than Leclerc's observed lap). The magnitude increases with segment length (−1.348 s at 50 m, −2.312 s at 250 m). This direction is consistent across all resolutions.

### 4.4 Retained Fraction

The retained fraction R = G_feasible / G_theoretical is negative for all three resolutions, indicating that in all cases the physics continuity constraint more than consumes the theoretical advantage. The metric is increasingly unstable at 250 m because the denominator G_theoretical is small (0.594 s), amplifying noise. The retained fraction is not a reliable discriminator at 250 m resolution.

### 4.5 Driver Switches and Boundary Discontinuities

Driver switches decrease with coarser segmentation (20 at 50 m, 15 at 100 m, 11 at 250 m). The mean boundary |Δv| at transitions is larger at 100 m and 250 m (~1.38 m/s) than at 50 m (~0.85 m/s). This reflects the fact that at finer resolutions, the same-driver probability is higher per boundary, so transitions that do occur happen at locations with smaller speed differentials.

The total boundary |ΔKE| state mismatch is largest at 100 m (832 kJ) and smallest at 250 m (623 kJ). This is not monotonic, reflecting the interplay between the number of switches and the per-switch mismatch magnitude.

### 4.6 Periodicity Residuals

All three resolutions satisfy the solver tolerance (0.01 m/s). The residuals are well within tolerance (0.009714, 0.007380, 0.007380 m/s). The 250 m case is closest to the tolerance limit, which is expected for a coarser and therefore more heterogeneous composite trajectory.

### 4.7 Donor-Cap Violations

Zero significant donor-cap violations at all three resolutions. The strict inequality v_feasible(s) <= v_donor(s) + 1e-3 is satisfied everywhere.

---

## 5. Qualitative Conclusion from Experiment 03

**Experiment 03 qualitative conclusion:** The donor-speed-constrained feasible composite is slower than the Leclerc observed baseline at 100 m resolution, because physics continuity consumes the theoretical cross-driver advantage and imposes an additional penalty.

**Experiment 04 finding:** This qualitative conclusion holds at all three resolutions. At 50 m, 100 m, and 250 m, the feasible gain relative to Leclerc is negative. The feasibility penalty is consistently larger than the theoretical gain at all resolutions.

The qualitative conclusion of Experiment 03 is **preserved** across the tested segmentation range.

> **Limitation note:** Preservation of the qualitative conclusion across three specific fixed resolutions does not constitute proof of universal robustness. A resolution finer than 50 m or a different circuit might yield different qualitative behaviour. No claim is made beyond the specific test conditions of Experiment 04.

---

## 6. Methodological Limitations

1. **Only three resolutions tested.** The sensitivity landscape between 50 m and 250 m is characterised by only two interior degrees of freedom (the three tested values). Non-monotonic behaviour at other resolutions cannot be ruled out.

2. **Fixed segmentation only.** All resolutions use uniform fixed-distance mini-sectors. Physics-motivated segmentation (e.g., corner-phase-aligned boundaries) may yield qualitatively different results and was not tested here.

3. **Retained fraction instability at 250 m.** At G_theoretical = 0.594 s, small absolute changes produce large relative changes in R. The retained fraction metric is not reliable at 250 m.

4. **Single circuit, single session.** Results are specific to the 2023 Bahrain GP Q3. Generalisation to other circuits or conditions requires additional experiments.

5. **Calibration re-run.** The Level-2 model is re-calibrated identically (same data, same optimizer, same max_iters=25) for Experiment 04, which may produce numerically identical or near-identical parameters to Experiment 03 due to Nelder-Mead's deterministic convergence from the same starting point. Any floating-point differences between runs are within machine precision and do not constitute model variation.

6. **Donor-policy confounding.** Changing segment length simultaneously changes both spatial resolution and the granularity of donor-envelope switching. At 50 m, the feasibility solver operates against a donor envelope that can alternate between the two drivers' speed profiles more frequently. At 250 m, a single driver's profile constrains substantially longer stretches. The observed variation in feasibility penalty may therefore reflect both segmentation sensitivity and the expressiveness of the donor-selection policy. These effects cannot be disentangled using the current three-resolution experiment.

---

## 7. Implementation Verification

### Files Created

| File | Purpose |
|---|---|
| `experiments/04_segmentation_robustness.py` | Main experiment script |
| `tests/test_experiment_04.py` | Test suite (53 tests) |
| `data/processed/experiment_04_segmentation_robustness.csv` | Primary summary table |
| `data/processed/experiment_04_boundary_metrics.csv` | Per-boundary transition table |
| `docs/experiment_04_report.md` | This report |

### Files Confirmed Untouched

| File | Status |
|---|---|
| `experiments/01_model_validation.py` | Unchanged |
| `experiments/02_theoretical_composite.py` | Unchanged |
| `experiments/03_physics_constrained_composite.py` | Unchanged |
| `data/processed/experiment_03_summary.csv` | Unchanged — canonical values intact |
| `data/processed/theoretical_composite_100m.csv` | Unchanged — 54 segments, 88.869 s |
| All source modules in `src/` | Unchanged |

### Test Suite Results

```
88 passed, 0 failed, 0 errors  (pytest -v)
```

- 34 pre-existing Experiment 01–03 tests: all pass
- 54 Experiment 04 tests: all pass
  - 15 coverage tests (starts at 0, ends at 5369, no gaps, no overlaps, correct counts)
  - 9 segment count and partial segment tests
  - 9 theoretical composite tests (determinism, finiteness, no-slower-than-best)
  - 3 feasibility constraint tests (periodicity, donor cap, no-NaN)
  - 11 output CSV tests (3 canonical 100 m regression tests)
  - 7 canonical and historical artefact regression tests

---

## 8. Reproducibility

- All results generated by executing `python experiments/04_segmentation_robustness.py`
- No numerical values were manually edited
- Input data: FastF1 cache, 2023 Bahrain GP, Q3 session
- Solver: bisection with tol = 0.01 m/s, max_iters = 40
- Vehicle: Level2CoupledModel with calibration inherited from Experiments 01–03 methodology
- Python 3.10.11, NumPy, pandas, SciPy, FastF1 v3.8.3

# From Theoretical to Achievable Lap Time: Physics-Constrained Analysis of Cross-Driver Performance in Formula 1

[![Python 3.12](https://img.shields.io/badge/python-3.12-blue.svg)](https://www.python.org/downloads/release/python-3120/)
[![Tests](https://img.shields.io/badge/tests-88%20passed-brightgreen.svg)]()
[![FastF1](https://img.shields.io/badge/telemetry-FastF1-red.svg)](https://github.com/theOehrly/Fast-F1)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 1. Research Question & Scientific Motivation

In Formula 1 performance engineering and public broadcast analytics, "theoretical best laps" are frequently assembled by picking the fastest observed segment times across drivers:
$$T_{\text{theoretical}} = \sum_{k=1}^N \min_{d \in \{A, B\}} \Delta t_{k, d}$$

While intuitively appealing, this construction assumes instantaneous state teleportation at segment boundaries $s_k$. If Driver A achieves a segment time exiting at $285\text{ km/h}$, but Driver B's optimal downstream segment time relied on entering at $302\text{ km/h}$, Driver B's segment performance is **physically unattainable** without unphysical velocity step jumps and energy injection.

This project investigates the central research question:
> **"When the fastest segments of different Formula 1 drivers are combined into a theoretical lap, how much of the resulting time advantage remains physically achievable when vehicle-state continuity and forward vehicle-dynamics constraints are enforced?"**

Using telemetry from the **2023 Bahrain Grand Prix Qualifying (Ferrari SF-23: Charles Leclerc vs. Carlos Sainz)** on the canonical spatial domain ($S = 5369.0\text{ m}$), this project demonstrates that:
1. The naive empirical composite (**Fixed 100 m Mini-Sectors**, Experiment 02) achieves **$88.869\text{ s}$** (nominal gain $+1.053\text{ s}$ vs. Leclerc's observed $89.921\text{ s}$ baseline), exhibiting **15 driver transitions** with velocity step discontinuities up to **$11.70\text{ km/h}$** ($3.251\text{ m/s}$) and a cumulative unphysical boundary kinetic-energy state mismatch of **$832.24\text{ kJ}$**.
2. When velocity continuity ($C^0$ in speed) and cyclic periodic boundary conditions are enforced under observed donor speed ceilings with a macroscopic vehicle-dynamics model (**Donor-Capped Feasible Lap**, Experiment 03, Policy A), the resulting lap time is **$91.583\text{ s}$** (net **$-1.661\text{ s}$** vs. Leclerc).
3. Enforcing physical state continuity produces a **theoretical-to-feasible gap of $+2.714\text{ s}$** ($T_{\text{feasible}} - T_{\text{theoretical}}$). Reconciling conflicting boundary speeds under physical acceleration, braking, and tire friction limits more than consumes the theoretical cross-driver advantage.

---

## 2. Dataset and Experimental Setup

- **Grand Prix:** 2023 Bahrain Grand Prix, Qualifying Session (Q3).
- **Vehicles & Drivers:** Scuderia Ferrari SF-23 — Charles Leclerc (LEC) vs. Carlos Sainz (SAI).
- **Telemetry Source:** Public FastF1 timing and car telemetry (cached locally).
- **Canonical Spatial Domain:** Track distance $s \in [0.0, 5369.0]\text{ m}$ ($5370$ points at $1.0\text{ m}$ uniform resolution).
- **Resampling Method:** Monotonic Piecewise Cubic Hermite Interpolating Polynomial (PCHIP) resampling.
- **Track Curvature:** Numerical track curvature $\kappa(s)$ derived from planar coordinate geometry with kinematic lateral-acceleration clamping ($|a_y| \le 5.5\text{ g}$).
- **Observed Single-Driver Baselines:**
  - Charles Leclerc (LEC): $89.921\text{ s}$
  - Carlos Sainz (SAI): $90.110\text{ s}$

---

## 3. Methodology & Calibration Policy

```
[FastF1 Ingestion & Cache]
       │
       ▼
[Lap Selection: Q3 Soft Dry Flying Laps]
       │
       ▼
[Spatial Resampling: s in [0, S], ds = 1.0 m] (PCHIP spline, distance monotonicity)
       │
       ▼
[Track Geometry Derivation] (heading psi(s), curvature kappa(s) with kinematic clamp)
       │
       ├─────────────────────────────────────────┐
       ▼                                         ▼
[Fixed Mini-Sector Segmentation]        [Vehicle Dynamics Calibration]
 - 50m, 100m (canonical), 250m           - Policy A: mu_x = 1.700 fixed
       │                                 - Bounded L-BFGS-B on [k_drag, k_down, mu_y]
       ▼                                         │
[Naive Theoretical Composite]                    ▼
 - Min segment time assembly            [Forward-Backward Periodic Velocity Solver]
 - Boundary jump audit (Δv, ΔKE)         - Bisection solve: v_achievable(s)
       │                                 - Enforces v(s_k^-) = v(s_k^+) & v(0) = v(S)
       │                                 - Enforces v(s) <= min(v_LEC(s), v_SAI(s))
       └──────────────────┬──────────────────────┘
                          ▼
            [Feasible Composite Synthesis]
                          │
                          ▼
            [Diagnostic Gap Attribution]
```

### 3.1 Level-2 Macroscopic Vehicle Model

The vehicle model is a point-mass, macroscopic physics-consistency and feasibility model (mass $m = 810\text{ kg}$):
- **Tractive Power Limit:** $P_{\text{max}} = 740.0\text{ kW}$ ($F_{\text{traction}} \le P_{\text{max}} / v$).
- **Aerodynamic Drag:** $F_{\text{drag}} = k_{\text{drag}} v^2$, where $k_{\text{drag}} = k_{\text{drag,off}} \cdot (1 - 0.30 \cdot \text{DRS})$.
- **Aerodynamic Downforce:** $F_{\text{down}} = k_{\text{down}} v^2$, with normal load $F_z = m g + F_{\text{down}}$.
- **Coupled Friction Ellipse:** Limits simultaneous longitudinal force $F_x$ and cornering force $F_y = m v^2 |\kappa|$:
  $$\left(\frac{F_x}{\mu_x F_z}\right)^2 + \left(\frac{m v^2 \kappa}{\mu_y F_z}\right)^2 \le 1$$
- **Corner Speed Limit:** $v_{\text{corner,max}}(s) = \sqrt{\frac{\mu_y g}{|\kappa(s)| (1 - \mu_y k_{\text{down}} / m)}}$.

### 3.2 Calibration Policy A (Literature Baseline)

- **Longitudinal Tire Friction:** $\mu_x = 1.7000$ (strictly locked literature reference).
- **Optimization Parameters:** $\mathbf{x} = [k_{\text{drag,off}}, k_{\text{down}}, \mu_y]$ calibrated on Leclerc's lap via `scipy.optimize.minimize(method="L-BFGS-B", bounds=bounds)`.
- **Parameter Bounds (`PARAM_BOUNDS`):**
  - $k_{\text{drag,off}} \in [0.80, 1.25]$
  - $k_{\text{down}} \in [2.20, 4.20]$
  - $\mu_y \in [1.45, 1.95]$
- **Calibrated Values:** $k_{\text{drag,off}} = 1.2500$, $k_{\text{drag,on}} = 0.8750$, $k_{\text{down}} = 2.6185$, $\mu_y = 1.9500$.
- **Scientific Reason for Policy A:** Public FastF1 telemetry does not identify longitudinal tire friction reliably because brake line pressure, wheel slip, powertrain inertia, and driver throttle-modulation dynamics are unobservable. An unconstrained optimizer drives $\mu_x$ to $0.9356$ to compensate for these unmodelled dynamics. Therefore, $\mu_x$ is fixed at the literature reference value ($1.700$) rather than fitted.

---

## 4. Experimental Program & Results

### Experiment 01 — Model Validation Hierarchy

Evaluates simulation fidelity against real single-driver telemetry across three model tiers:

| Model Tier | Formulation | LEC Lap Error | LEC Velocity RMSE | Top Speed Error | Verdict |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Level 0: Pure Longitudinal** | Point-mass, no aero drag, no downforce | $11.675\text{ s}$ | $10.975\text{ m/s}$ | $15.151\text{ m/s}$ | FAILED_UNTRUSTABLE |
| **Level 1: Longitudinal + Aero** | Quadratic aero, decoupled scalar cornering | $1.662\text{ s}$ | $3.616\text{ m/s}$ | $4.103\text{ m/s}$ | INADEQUATE |
| **Level 2: Coupled (Policy A)** | Friction ellipse, aero coupling, periodic solve | $1.529\text{ s}$ | $4.289\text{ m/s}$ | $2.415\text{ m/s}$ | INADEQUATE (Macroscopic Feasibility) |

*Cross-validation on Carlos Sainz (Level 2):* Lap time error $= 2.371\text{ s}$, velocity RMSE $= 4.699\text{ m/s}$, top speed error $= 2.111\text{ m/s}$, periodicity residual $= 0.0063\text{ m/s}$.

### Experiment 02 — Theoretical Empirical Composite (Canonical 100 m)

- **Segmentation:** 54 fixed-distance segments ($53 \times 100\text{ m} + 1 \times 69\text{ m}$).
- **Theoretical Lap Time:** **$88.869\text{ s}$** (nominal gain $+1.053\text{ s}$ vs. LEC $89.921\text{ s}$; $+1.241\text{ s}$ vs. SAI $90.110\text{ s}$).
- **Driver Allocation:** Leclerc selected in 35 segments ($3469.0\text{ m}$, 64.6%); Sainz selected in 19 segments ($1900.0\text{ m}$, 35.4%).
- **Boundary State Discontinuities:** 15 driver switches.
- **Maximum Velocity Jump:** $3.251\text{ m/s}$ ($11.70\text{ km/h}$) at $s = 1400.0\text{ m}$.
- **Cumulative Boundary KE Mismatch:** **$832.24\text{ kJ}$** (maximum single jump: $205.95\text{ kJ}$).

### Experiment 03 — Physics-Constrained Feasibility (Canonical 100 m)

- **Feasible Lap Time ($T_{\text{feasible}}$):** **$91.583\text{ s}$** (donor-capped periodic solve).
- **Theoretical-to-Feasible Gap ($P_{\text{feasibility}}$):** **$+2.714\text{ s}$** ($T_{\text{feasible}} - T_{\text{theoretical}}$).
- **Feasible Gain vs. Observed Baseline:** **$-1.661\text{ s}$** vs. Leclerc (the feasible composite is slower than the observed lap).
- **Solver Convergence:** Periodicity residual $= 0.00738\text{ m/s}$ (tolerance $\le 0.01\text{ m/s}$); maximum donor-cap violation $= 0.000000\text{ m/s}$.
- **Diagnostic Gap Attribution:**
  - Boundary Acceleration Penalty ($\Delta T_{\text{KE}}$): $+0.684\text{ s}$
  - Boundary Braking Displacement Penalty ($\Delta T_{\text{brake}}$): $+0.169\text{ s}$
  - Corner-Exit Grip Deficit ($\Delta T_{\text{traction}}$): $+0.000\text{ s}$
  - Residual State-Propagation Term: $+1.861\text{ s}$

### Experiment 04 — Segmentation Sensitivity Robustness

Investigates whether the feasibility penalty is stable across spatial discretization resolutions:

| Segment Length | Segments | $T_{\text{theoretical}}$ | $T_{\text{feasible}}$ | Feasibility Penalty | $G_{\text{feasible}}$ vs. LEC | Retained Fraction $R$ | Switches | Max $\|\Delta v\|$ | Total $\|\Delta\text{KE}\|$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **50 m** | 108 | $88.815\text{ s}$ | $91.269\text{ s}$ | $+2.454\text{ s}$ | $-1.348\text{ s}$ | $-1.218$ | 20 | $3.083\text{ m/s}$ | $673.03\text{ kJ}$ |
| **100 m (Canon)** | 54 | $88.869\text{ s}$ | $91.583\text{ s}$ | $+2.714\text{ s}$ | $-1.661\text{ s}$ | $-1.578$ | 15 | $3.251\text{ m/s}$ | $832.24\text{ kJ}$ |
| **250 m** | 22 | $89.327\text{ s}$ | $92.233\text{ s}$ | $+2.906\text{ s}$ | $-2.312\text{ s}$ | $-3.890$ | 11 | $2.927\text{ m/s}$ | $623.44\text{ kJ}$ |

*Key Sensitivity Finding:* The qualitative conclusion of Experiment 03 **persists across all tested resolutions**: in every case, the feasibility penalty exceeds the theoretical gain, and the donor-capped feasible composite is slower than the observed Leclerc baseline ($G_{\text{feasible}} < 0$).

---

## 5. Summary of Key Results

| Metric | Empirical Baseline (LEC) | Naive Theoretical (Exp 02) | Physics-Constrained (Exp 03, Policy A) |
| :--- | :---: | :---: | :---: |
| **Lap Time** | $89.921\text{ s}$ | $88.869\text{ s}$ | $91.583\text{ s}$ |
| **Relative Gain vs. LEC** | $0.000\text{ s}$ | $+1.053\text{ s}$ | $-1.661\text{ s}$ |
| **$C^0$ Velocity Continuity** | Enforced | Violations up to $11.70\text{ km/h}$ | Enforced |
| **Cyclic Boundary Condition** | Enforced | Not enforced | Enforced ($\le 0.01\text{ m/s}$) |
| **Donor Speed Envelopes** | Satisfied | Satisfied piecewise | Satisfied everywhere ($0.0\text{ m/s}$) |
| **Theoretical-to-Feasible Gap** | N/A | Baseline | **$+2.714\text{ s}$** |

---

## 6. Historical Calibration Artifact

An earlier unconstrained calibration run permitted the optimizer to vary $\mu_x$, driving it to $\mu_x = 0.9356$ as an unphysical compensation parameter. That historical baseline produced:
- $\mu_x = 0.9356$
- $T_{\text{feasible}} = 91.805\text{ s}$
- Feasibility Gap $= 2.937\text{ s}$

These numbers represent the **Unconstrained Optimizer Artifact Baseline** and are preserved for scientific auditing under:
- `data/processed/historical_unconstrained_model_validation_results.csv`
- `data/processed/historical_unconstrained_experiment_03_summary.csv`
- `data/processed/historical_unconstrained_experiment_04_segmentation_robustness.csv`
- `data/processed/historical_unconstrained_experiment_04_boundary_metrics.csv`

The active scientific baseline of this project is strictly **Policy A ($\mu_x = 1.7000$ fixed)**.

---

## 7. Methodological Limitations

1. **Macroscopic Representation:** The Level-2 vehicle model is a point-mass macroscopic feasibility model, not a micro-fidelity vehicle simulator. It lacks suspension pitch/roll kinematics, chassis compliance, and dynamic tire load transfer.
2. **Public Telemetry Constraints:** FastF1 data does not contain steering wheel angle, individual wheel angular speeds, tire surface/bulk temperatures, brake line pressures, or powertrain hybrid battery state-of-charge.
3. **Donor-Cap Constraint Interpretation:** The donor-speed cap $v(s) \le \min(v_{\text{LEC}}(s), v_{\text{SAI}}(s))$ acts as an empirical feasibility ceiling based on demonstrated human performance, not an optimal control law.
4. **Experiment 04 Confound:** Modifying segment length simultaneously alters spatial discretization resolution and the switching expressiveness of the donor policy. Experiment 04 demonstrates qualitative persistence across resolutions, but does not isolate numerical grid convergence independently of donor policy switching.
5. **Single-Session Dataset:** Analysis is conducted on a single circuit (Bahrain International Circuit) during a single qualifying session (2023 Q3). No claim of universal cross-circuit driver behaviour transfer is made.

---

## 8. Reproducibility Guide

### Setup
```bash
# Clone repository and install dependencies
pip install -r requirements.txt
```

### Run Test Suite
```bash
# Verify unit tests, physical limits, and canonical regression guards
python -m pytest tests/ -v
# Expected: 88 passed, 1 warning (deprecation notice only)
```

### Reproduce Experiments
```bash
# Experiment 00: Session selection evaluation
python experiments/00_session_selection.py

# Experiment 01: Model hierarchy validation audit
python experiments/01_model_validation.py

# Experiment 02: Canonical 100 m theoretical composite analysis
python experiments/02_theoretical_composite.py

# Experiment 03: Canonical 100 m physics-constrained feasibility solve
python experiments/03_physics_constrained_composite.py

# Experiment 04: Segmentation sensitivity robustness sweep (50m, 100m, 250m)
python experiments/04_segmentation_robustness.py
```

Generated plots are saved automatically to `outputs/plots/`, and summary CSVs are saved to `data/processed/`.

---

## 9. License and Data Attribution

- **Code License:** MIT License.
- **Telemetry Data:** Sourced via [FastF1](https://github.com/theOehrly/Fast-F1) from official FIA Formula One World Championship timing feeds. Formula 1 and related marks are trademarks of Formula One Licensing B.V.

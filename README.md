# From Theoretical to Achievable Lap Time

## Physics-Constrained Analysis of Cross-Driver Performance in Formula 1

[![Python
3.12](https://img.shields.io/badge/python-3.12-blue.svg)](https://www.python.org/downloads/release/python-3120/)
[![Tests](https://img.shields.io/badge/tests-97%20passed-brightgreen.svg)]()
[![Telemetry](https://img.shields.io/badge/telemetry-FastF1-red.svg)](https://github.com/theOehrly/Fast-F1)
[![License:
MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Live
Website](https://img.shields.io/badge/Live%20Website-Vercel-black?logo=vercel)](https://f1-physics-constrained-lap-analysis.vercel.app)

**[Explore the live interactive research
website](https://f1-physics-constrained-lap-analysis.vercel.app)**

A physics-constrained study of whether the fastest observed segments
from different Formula 1 drivers can be combined into a dynamically
feasible lap, and how much of the theoretical lap-time advantage remains
after accounting for vehicle dynamics and segment-boundary continuity.

------------------------------------------------------------------------

## 1. Research Question & Scientific Motivation

In Formula 1 performance analysis, a theoretical composite lap can be
constructed by selecting the fastest observed segment time from multiple
drivers:

$$
T_{\text{theoretical}} = \sum_{k=1}^{N} \min_{d \in \{A,B\}} \Delta t_{k,d}
$$

However, this construction can combine segment performances achieved
from different entry and exit states. A driver leaving one segment at a
particular speed cannot instantaneously adopt the entry speed associated
with another driver's fastest downstream segment. Such state
discontinuities can make the theoretical composite dynamically
infeasible.

**Research question:** When the fastest observed segments of different
Formula 1 drivers are combined into a theoretical lap, how much of the
resulting time advantage remains feasible when vehicle-state continuity
and vehicle-dynamics constraints are enforced?

The study analyzes the 2023 Bahrain Grand Prix Q3 Ferrari
pairing---Charles Leclerc and Carlos Sainz---and extends the analysis
independently to the Red Bull pairing---Max Verstappen and Sergio Pérez.
Each team is calibrated and evaluated separately; their telemetry
segments are not mixed.

## 2. Dataset and Experimental Setup

-   **Event:** 2023 Bahrain Grand Prix, Qualifying Q3
-   **Ferrari:** Scuderia Ferrari SF-23 --- Charles Leclerc (LEC) and
    Carlos Sainz (SAI)
-   **Red Bull:** Oracle Red Bull Racing RB19 --- Max Verstappen (VER)
    and Sergio Pérez (PER)
-   **Telemetry:** Public Formula 1 timing and car telemetry accessed
    through FastF1
-   **Spatial processing:** Monotonic Piecewise Cubic Hermite
    Interpolating Polynomial (PCHIP) resampling
-   **Ferrari spatial domain:** 5,369 m
-   **Red Bull spatial domain:** 5,358 m

The 11 m difference between the processed spatial domains is retained
rather than forcing the two teams onto an assumed identical trajectory
length.

## 3. Methodology & Calibration Policy

``` text
FastF1 telemetry ingestion and local cache
                  |
                  v
          Lap selection and curation
                  |
                  v
      Spatial resampling and alignment
                  |
                  v
       Track geometry and curvature
                  |
          +-------+--------+
          |                |
          v                v
 Fixed-distance segment   Vehicle model
      selection           calibration
          |                |
          v                v
 Theoretical composite   Model validation
          |                |
          +-------+--------+
                  |
                  v
     Physics-constrained feasibility
                  |
                  v
       Gap and sensitivity analysis
```

### 3.1 Level-2 Macroscopic Vehicle Model

The selected formulation is a macroscopic point-mass feasibility model.
Its principal components include longitudinal acceleration and braking
limits, aerodynamic drag and downforce, a power-limited tractive-force
model, coupled longitudinal and lateral tyre-force limits represented
using a friction ellipse, forward-backward velocity-profile integration,
segment-boundary speed continuity and cyclic lap-boundary conditions.

The coupled friction constraint is represented as:

$$
\left(\frac{F_x}{\mu_x F_z}\right)^2 +
\left(\frac{m v^2 \kappa}{\mu_y F_z}\right)^2 \leq 1
$$

where (F_x) is longitudinal tyre force, (F_z) is normal load,
(`\mu`{=tex}\_x) and (`\mu`{=tex}\_y) are effective longitudinal and
lateral friction coefficients, (m) is vehicle mass, (v) is speed, and
(`\kappa`{=tex}) is path curvature. The Ferrari configuration uses a
nominal mass of 810 kg and maximum power of 740 kW.

### 3.2 Calibration Policy A

For the Ferrari analysis, Policy A fixes the longitudinal friction
coefficient at (`\mu`{=tex}\_x = 1.700) and calibrates selected
aerodynamic and lateral-grip parameters using bounded L-BFGS-B
optimization.

Public telemetry does not directly identify tyre friction independently
of unobserved effects such as brake pressure, wheel slip, drivetrain
response and driver throttle modulation. An unconstrained fit had driven
this coefficient to a compensating value; that earlier result is
retained as a historical calibration artifact rather than the active
baseline.

The Red Bull analysis uses a separate team-specific calibration and
analysis pipeline. Cross-team results are not produced by combining
Ferrari and Red Bull segment data.

## 4. Experimental Results

### 4.1 Cross-Team Comparison --- Canonical 100 m Segmentation

  Metric                               Ferrari: Leclerc vs Sainz   Red Bull: Verstappen vs Pérez
  ---------------------------------- --------------------------- -------------------------------
  Spatial domain                                         5,369 m                         5,358 m
  Faster observed driver lap                            89.921 s                        89.590 s
  Other observed driver lap                             90.110 s                        89.623 s
  Theoretical composite                                 88.869 s                        88.674 s
  Physics-constrained feasible lap                      91.583 s                        92.810 s
  Theoretical-to-feasible gap                            2.714 s                         4.136 s
  Donor switches                                              15                              13
  Periodicity residual                               0.00738 m/s                     0.00180 m/s
  Donor-cap violations                                         0                               0

The theoretical-to-feasible gap is:

$$
\Delta T_{\text{gap}} = T_{\text{feasible}} - T_{\text{theoretical}}
$$

For both studied pairings, the physics-constrained feasible lap is
slower than the theoretical composite and the faster observed driver
lap. This result is specific to the studied datasets and modelling
assumptions, not a universal conclusion about Formula 1 teams or
drivers.

### 4.2 Ferrari: Theoretical Composite and Boundary Mismatch

For the canonical 100 m Ferrari analysis:

-   Theoretical composite lap time: **88.869 s**
-   Driver transitions: **15**
-   Maximum reported boundary-speed mismatch: **3.251 m/s**
    (approximately 11.70 km/h)
-   Cumulative absolute boundary kinetic-energy mismatch: **832.24 kJ**

These mismatches illustrate why independently fastest segment times
cannot simply be concatenated as a continuous vehicle trajectory.

### 4.3 Ferrari: Diagnostic Gap Attribution

  Diagnostic component                                   Time
  --------------------------------------------- -------------
  Boundary acceleration / kinetic-energy term         0.684 s
  Boundary braking-displacement term                  0.169 s
  Corner-exit grip-deficit term                       0.000 s
  Residual state-propagation term                     1.861 s
  **Total gap**                                   **2.714 s**

The residual state-propagation term is a model-dependent numerical
diagnostic of the solver and its interactions. These terms should not be
interpreted as four independent physical forces or definitive causal
measurements.

## 5. Ferrari Segment-Length Sensitivity

  ---------------------------------------------------------------------------
  Segment       Segments   Theoretical Feasible lap          Gap        Donor
  length                           lap                               switches
  --------- ------------ ------------- ------------ ------------ ------------
  50 m               108      88.815 s     91.269 s      2.454 s           20

  100 m               54      88.869 s     91.583 s      2.714 s           15

  250 m               22      89.327 s     92.233 s      2.906 s           11
  ---------------------------------------------------------------------------

The gap changes with segment length. Changing segment length affects
both spatial discretization and how frequently the selected donor can
switch. This experiment shows resolution-dependent results across the
tested settings; it does not independently establish numerical grid
convergence.

## 6. Model Validation and Interpretation

A validation hierarchy compared increasingly detailed formulations
against observed telemetry. The simpler Level 0 and Level 1 models were
not retained as the basis for the coupled feasibility analysis because
they omit important aerodynamic and combined-force effects.

  ------------------------------------------------------------------------------
  Model tier   Formulation        LEC lap-time   LEC speed RMSE Interpretation
                                         error                  
  ------------ -------------- ---------------- ---------------- ----------------
  Level 0      Pure                   11.675 s       10.975 m/s Failed /
               longitudinal                                     untrustworthy
               point-mass                                       

  Level 1      Longitudinal            1.662 s        3.616 m/s Inadequate
               with aero,                                       
               decoupled                                        
               cornering                                        

  Level 2      Coupled                 1.529 s        4.289 m/s Macroscopic
               dynamics with                                    feasibility use
               friction                                         only
               ellipse                                          
  ------------------------------------------------------------------------------

The Level 2 model supports a qualified macroscopic feasibility analysis,
but its validation errors do not support treating it as a high-fidelity
simulator or precise reconstruction of actual car behaviour.

## 7. Historical Calibration Artifact

An earlier unconstrained calibration allowed (`\mu`{=tex}\_x) to vary
and produced (`\mu`{=tex}\_x = 0.9356), with a Ferrari 100 m feasible
lap time of 91.805 s and a gap of 2.937 s.

These are historical exploratory results, not the active Policy A
headline values. They are retained in historical processed artifacts for
traceability. The active Ferrari reference uses fixed (`\mu`{=tex}\_x =
1.700), yielding a 91.583 s feasible lap time and a 2.714 s gap.

## 8. Methodological Limitations

1.  **Macroscopic vehicle representation:** The point-mass model does
    not explicitly simulate suspension kinematics, chassis compliance,
    pitch and roll moments, dynamic load transfer or detailed transient
    vehicle response.
2.  **Public telemetry constraints:** Public FastF1 telemetry does not
    expose all proprietary channels, including steering-wheel angle,
    individual wheel speeds, tyre temperatures, brake-line pressure or
    full powertrain state.
3.  **Empirical donor-speed cap:** The donor-speed ceiling is an
    empirical constraint based on observed driver speeds, not an
    optimal-control law.
4.  **Single event and circuit:** The analysis covers the 2023 Bahrain
    Grand Prix Q3 session and two driver pairings. It does not establish
    cross-circuit generalization.
5.  **Resolution and switching confound:** Segment length affects both
    discretization and donor-switching expressiveness, so sensitivity
    results must be interpreted accordingly.
6.  **Model-dependent diagnostics:** The feasibility gap and its
    diagnostic decomposition depend on modelling assumptions,
    calibration policy and solver formulation.
7.  **Trajectory-domain differences:** Ferrari and Red Bull have
    slightly different processed spatial domains; comparisons retain
    each team's domain rather than implying exact geometric identity.

## 9. Reproducibility

### Requirements and Setup

``` bash
git clone https://github.com/Karunya369/F1-Physics-Constrained-Lap-Analysis.git
cd F1-Physics-Constrained-Lap-Analysis
pip install -r requirements.txt
```

### Run the Test Suite

``` bash
python -m pytest tests/ -q
```

The latest reported project test run completed with **97 passed and 0
failed**. This refers to the test suite at the time of that run.

### Run Experiments

The repository contains experiment scripts for model validation,
theoretical-composite construction, physics-constrained feasibility and
segmentation sensitivity. Refer to the `experiments/` directory and
corresponding processed results in `data/processed/` for the exact
current script names and outputs.

Reproduction depends on the availability of the relevant public
telemetry, compatible dependencies, cached data where applicable, and
the code version used for the reported results.

## 10. Interactive Research Website

The companion website presents the project as an interactive research
and engineering portfolio, including methodology, telemetry
visualizations, experiments, results, cross-team comparison and
limitations.

**[Open Physics-Constrained F1 Lap
Analysis](https://f1-physics-constrained-lap-analysis.vercel.app)**

## Technologies

-   **Python** --- research implementation and numerical analysis
-   **FastF1** --- public Formula 1 telemetry access
-   **NumPy / Pandas** --- numerical computing and data processing
-   **SciPy** --- bounded optimization and numerical methods
-   **Matplotlib** --- scientific visualization
-   **pytest** --- automated testing
-   **HTML / CSS / JavaScript** --- interactive website
-   **Vercel** --- deployment
-   **Git / GitHub** --- version control and source hosting

## Repository Structure

``` text
F1-Physics-Constrained-Lap-Analysis/
├── data/             # Telemetry-derived and processed research data
├── docs/             # Project documentation
├── experiments/      # Research experiments and analysis scripts
├── outputs/          # Generated research outputs and plots
├── scratch/          # Auxiliary audit and development materials
├── src/              # Research implementation
├── tests/            # Automated tests
├── website/          # Interactive research website
├── requirements.txt
└── README.md
```

## Author

**Karunya Pamarthi**\
B.Tech, Computer Science and Engineering (Artificial Intelligence)\
Amrita Vishwa Vidyapeetham, Bengaluru

-   **GitHub:** [Karunya369](https://github.com/Karunya369)
-   **LinkedIn:** [Karunya
    Pamarthi](https://www.linkedin.com/in/karunya-pamarthi-aaa970376)
-   **Live Website:** [Physics-Constrained F1 Lap
    Analysis](https://f1-physics-constrained-lap-analysis.vercel.app)

## License and Data Attribution

The repository indicates an MIT code license. Telemetry is accessed
through [FastF1](https://github.com/theOehrly/Fast-F1) from publicly
available Formula 1 timing feeds. Formula 1 and related marks are
trademarks of their respective owners.

------------------------------------------------------------------------

*This is a research-oriented engineering analysis. The reported results
are model-dependent and are not official Formula 1 team performance
measurements.*

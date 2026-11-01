# CURRICULUM.md — Learning Program and Assessment Specification

**Status:** Structured release curriculum based on approved Q62–Q72 and Q141–Q150. Actual lesson prose, sourced calculations, illustrations and exercises require authoring and validation during implementation. 15 introductory topic outlines and self-check prompts now exist, but **no comprehensive source-verified full course is claimed completed**.

## Teaching contract
Intended for engineering students, developers and aviation enthusiasts from foundations to advanced concepts. All modules accessible without gates; recommended order and prerequisite chips. Each substantial module includes: learning objectives, explanation, one original diagram / accessible 2D alternative, at least one interactive experiment, a worked example with units and assumptions, concept and/or numerical assessment, feedback, glossary links and attributed sources. Scientific confidence is model-bounded: simulated data must be generated from the active validated model and trace back to versioned inputs.

## Proposed 15-module sequence
| # | ID | Theme / learning outcome | Interactive experiment | Assessment evidence |
|---|---|---|---|---|
| 01 | `foundations-energy` | Distinguish energy, force, power and momentum; dimensional analysis | Inspect thrust equation terms at zero and nonzero Mach | Identify terms and units correctly |
| 02 | `foundations-fluids` | Static/stagnation states; temperature, pressure and Mach | Change altitude/Mach and chart total vs static states | Solve inlet state transformation |
| 03 | `brayton-cycle` | Ideal vs real Brayton process and efficiency losses | Sweep pressure ratio at fixed declared assumptions | Interpret T–s / P–v and losses |
| 04 | `architecture-comparison` | Recognize turbojet vs separate-exhaust turbofan structure | Switch models and isolate matching flow branches | Label spool, branch, nozzle |
| 05 | `intake-diffuser` | Pressure recovery and airflow capture | Vary Mach and inlet loss | Explain pressure recovery vs flight speed |
| 06 | `compressor` | Axial rotor/stator work, pressure ratio and efficiency | Vary compressor ratio and efficiency | Calculate compressor work and station change |
| 07 | `combustor` | Heat addition, fuel flow, turbine inlet temperature and constraints | Sweep TIT and burner pressure loss | Calculate simplified fuel-air ratio |
| 08 | `turbine-spools` | Shaft work; TJ single spool and TF independent HP/LP balances | Toggle engine and inspect turbine/compressor matching | Identify power producer/consumer pairs |
| 09 | `nozzle-thrust` | Choking, exit momentum, pressure thrust and ram drag | Move across valid choking boundary | Compute positive thrust/undefined TSFC case |
| 10 | `fan-bypass` | Fan/LPC/HPC, mass split and separate exhaust thrust | Change bypass ratio at matched ambient conditions | Calculate core/bypass mass partition |
| 11 | `thermal-propulsive` | Thermal, propulsive and overall efficiency definitions and domains | Compare static/cruise cases | Explain static flight propulsive efficiency context |
| 12 | `operating-envelope` | Realistic limits, invalid states, convergence and scientific trust | Deliberately request invalid cases | Diagnose rejected input vs solver failure |
| 13 | `aero-blades` | Rotor velocity triangles, turning, stage work and limitations | Interactive blade/velocity triangle | Solve conceptual stage work relation |
| 14 | `design-tradeoffs` | Compare thrust/fuel, mass flow, bypass, spool performance and losses | Matched-condition twin-engine comparison | Defend design choice with quantified evidence |
| 15 | `faults-limitations` | Recognize inlet distortion, stall/surge concepts, hot-section limits and misleading extrapolation | Explore qualitative fault stories with safe simulation constraints | Distinguish claims model can/cannot make |

Optional math/physics refreshers: logarithms, dimensional analysis, energy conservation, ideal gas, entropy, station notation and unit conversion. Provide accessible non-3D diagrams for every component lesson, not an inaccessible fallback after rendering fails.

## Content packaging (proposed)
Structured authored content, not generic runtime AI generation: `moduleId, version, title, prerequisites[], outcomes[], sections[], citations[], experimentId, assessmentIds[], glossaryIds[]`. Chapter sections support plain prose, equations, engineering diagrams (SVG), 3D part focus, parameter sweep, numerical solution, source and summary. All content is readable offline when shell cache is warm. Reference links open to the original source when online; internal bibliography is usable offline.

## Experiment contract
`experimentId` defines `engineId, baselineConfigVersion, lockedInputs, editableFields, bounds, hypothesis, expectedQualitativeTrend, targetPlots, expectedInvariants, failureCases, sourceRefs`. Activate a reproducible working copy of simulator state; never silently overwrite user's exploration. Reset experiment to its exact versioned baseline. Every experiment includes expected independent reasoning, not merely instructing 'move the slider'.

Example tasks: calculate the compressor enthalpy rise when efficiency changes at fixed ratio; compare the fuel-flow impact of increasing turbine inlet temperature in bounds; quantify the bypass mass split when `BPR=6` in a hypothetical case; calculate gross and net thrust contributions at a prescribed flight velocity; interpret nozzle choking with `pe != p0`. Numerical example values are *illustrative until independently validated*.

## Assessment contract
- **Concept:** multiple choice, ordering, select component/station, interpret graph. Provide why each common misconception fails; no coercive score gating.
- **Numerical:** solution evaluated in canonical SI after parse; accept common units and conversion, scientific notation and appropriate rounding. Each question has independently verified expected result and a tolerance justified by model/input precision, not hardcoded broad allowance. Intermediate partial feedback identifies wrong units vs arithmetic vs physical interpretation. Guard NaN/Infinity, overflow, invalid dimensional expression and malformed input.
- **Scenario:** compare operating points, highlight invalid assumptions and demand explicit justification; open narrative assessed by structured worked-example rubric, not false fully-automatic correctness.
- Attempts local only; progress stored with module/schema revision. Completion requires meaningful interaction or assessment, not merely page visit. Users can revisit any module freely.

## Progress / import/export
Local record `schemaVersion, userProgressVersion, completedModules, attemptHistory, lastVisited, localPreferences`. No personal account. Export/download JSON with version and checksum, import with schema validation and dry-run preview, explicit reset of progress. Migration must preserve completed work when module IDs are stable and avoid falsely marking changed assessments complete. No server analytics without consent and separate decision.

## Equations, diagrams, accessibility
KaTeX semantic source + accessible plain-language equation, variable definitions and selectable raw LaTeX where helpful; explanation includes sign conventions, units, reference state, domain, approximation. SVG 2D airflow diagrams are keyboard-readable and labeled; fall back from 3D automatically if WebGL unavailable. For printed reports and charts, use embedded legends and color-independent labels. Each source record includes author/organization, title, page section/URL, access date, equation adaptation note.

## Source and editorial quality
NASA Glenn, FAA turbine familiarization material, standard openly accessible thermodynamics reference materials and appropriate academic/public-domain source data as individually verified. Don't copy protected large text/diagrams into the application; write original explanations and diagrams, cite facts. Do not represent a classroom demonstration as OEM performance data. Editorial acceptance: every equation checkable, captions accurate, all references resolve, glossary names consistent with `PHYSICS_SPEC.md`, accessibility pass and each lesson's experiment reproduces its prescribed outcome.

## Verification to release
15 unique module IDs, each with objectives, content, diagrams, active working exercise, reproducible baseline, feedback, citations and accessible alternative. Numeric quizzes require independent answer fixture; every experiment must have a known expected trend and a declared model validity domain. Course progress/units/theme persist and import/export migration cases pass. Test on keyboard, mobile and reduced motion.

## Mandatory D01/B and D02/B teaching updates

Module 06 (Compressor) introduces corrected mass flow, corrected speed, operating-line/R-line, map pressure ratio/efficiency, interpolation boundaries and their limitations. Module 08 (Turbine Spools) requires **calibrated, map-based model-predicted RPM**, separate HP and LP power/mass matching, map-scaling assumptions and a lab exercise where changing throttle changes solved operating points; label these simulated predictions, not OEM measurements. Module 09 (Nozzle and Thrust) must include variable effective vs geometric throat area, discharge coefficient, separate core/bypass nozzle actuation, choked/unchoked transitions, and coupled area/flow/shaft behavior. Module 10 (Fan/Bypass) uses independent TF nozzle area as an experimentally controlled variable while holding a valid flight condition and documenting the conditions of feasible convergence. Module 12 (Operating Envelope) teaches map domain, convergence failure and why design-point mass flow/pressure ratio cannot be held as arbitrary off-design independent inputs.

Numerical assessments must use verified map/source datasets and reference-calibrated RPM, and geometry-area consistency tests. If map validation is not achieved, these lessons and assessed claims cannot be marked complete; no illustrative RPM is a substitute. Curriculum still has **15** modules, not additional ones. References and prerequisites remain versioned.

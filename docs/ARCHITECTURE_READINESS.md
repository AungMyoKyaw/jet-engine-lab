File: projects/jet-engine-lab/docs/ARCHITECTURE_READINESS.md
Lines: 1-77 of 77
SHA-256: 5344d382c84f48a4bb9c6c8d2c61cd1f6e82c8919992e34c1f0421727106db4a

# ARCHITECTURE_READINESS.md — Final Reconciled Review

**Reviewed:** 2026-11-01. **Authority:** Q01–Q200 plus explicitly locked **D01=B** and **D02=B**. **Scope:** this document originally reviewed the planning baseline. After 2026-11-01 implementation authorization, a partial preview was implemented on an isolated feature branch; see `IMPLEMENTATION_STATUS.md` for current evidence. Production has not been deployed. **Architecture review:** **COMPLETE — conditionally ready for implementation authorization**, with scientific/source evidence gates listed below. **Implementation authorization:** GRANTED 2026-11-01; feature-branch preview in progress. **Release readiness:** NOT READY.

## 1. Final decisions — CLOSED
- **D01=B: map-based off-design actual shaft RPM prediction.** Require source-traceable, redistributable, independently validated compressor and turbine maps with corrected-flow/corrected-speed characteristics; calibrated physical RPM, turbine/compressor matching, LP/HP torque/power closure and source-domain checks. TJ one shaft, TF two shafts. Accept no merely illustrative RPM as fulfillment. Do not conflate a generic-engine model prediction with actual OEM engine performance.
- **D02=B: adjustable effective nozzle throat area.** TJ A8 and separate TF core A8 and bypass A18, with discharge-coefficient and physical area relation, coupled nozzle flow/mass capacity and influence on thrust/shaft matching; corresponding parametric rendered throat geometry, area labels and safety ranges must update from same valid solver result. Not a UI-only graphic slider.
- Q01–Q200 preserved exactly; D01/D02 supplement, not change them. No further genuinely unresolved **user-choice** questions remain. Any missing data remain documented engineering verification dependencies. User explicitly forbids implementation, commit and deployment until subsequent explicit authorization.

## 2. Contradictions and compatibility matrix
| ID | Interacting approvals | Final resolution | Remaining evidence |
|---|---|---|---|
| R01 | Q43 illustrative startup vs D01 model-predicted RPM | Steady-state **off-design mapped RPM** is quantitatively solved; startup/shutdown speed trajectories are still illustrative unless transients are separately developed | Mapped speed calibration and UI disclaimer |
| R02 | Q51 shaft energy match vs D01 actual speeds | Couple maps + mass continuity + shaft balances; shaft work alone cannot uniquely determine N1/N2 | Source maps, design scaling, independent reference points |
| R03 | Q115 design mass flow slider vs D01 map-matched off-design flow | **Design vs Off-design** modes: mass flow/PR/efficiency are configurable at design point and coupled outputs in off-design; avoid overspecification | Rank/unknown-residual derivation and UI validation |
| R04 | Q109 mass flow nozzle match vs D02 variable area | Explicit user `A_eff` with discharge coefficient, physical throat and exit area; nozzle capacity is part of matching; solver may reject infeasible area | Geometry constraints, choking and mass closure fixture |
| R05 | Q29 high fidelity vs Q30 progressive/offline and Q87 mobile LOD | High-quality desktop GLB/HDR/LOD, lower-detail mobile and 2D fallback, measured resource budgets | Actual asset pilot, browser GPU benchmarks |
| R06 | Q08 engine-dominant sparse UI vs Q23 always-visible full telemetry | Permanent compact dock with grouped metrics, independent analysis workspace | Desktop/mobile layout and accessibility captures |
| R07 | Q12 permissive asset license vs Q88/Q172 public redistribution rights | Only admitted after full right-to-modify/redistribute evidence, provenance and credit; applies equally to **map data**, 3D assets and fonts | Asset/map license file by file |
| R08 | Q03 separate engine types vs Q42 two-spool TF vs Q36 one-spool TJ | Independent station, performance maps, solver, shaft and nozzle config; shared rendering/presentation primitives only | Both model diagrams and physics fixtures |
| R09 | Q05 multi-page vs Q161 hash routing/Q34 GitHub Pages | Static hash routing, validated hosted project subpath and service-worker scope | Real GitHub Pages base-path smoke test |
| R10 | Q102 variable gas properties vs imported map thermodynamics | Normalize property conventions, corrected-speed bases and reference maps; independent cross-check using explicitly aligned assumptions | Gas tables, map ref basis, interpolation tests |
| R11 | Q138 rotor visual speed vs D01 calibrated numeric RPM | Display **computed model RPM** and intentionally slowed anti-alias-safe playback, clearly distinguished | Model-to-scene speed mapping tests |
| R12 | D02 variable geometry vs Q129 realistic structure / Q178 3D LOD | Parametric nozzle walls/rings with clearance-safe full-range actuation; all LODs match accepted area | Mesh area, interference and rendering QA |
| R13 | Q61 public educational reference vs predictive generic engine claims | Model validation proves predicted values within **bounded generic reference model**, not measured production-engine truth | Reproducible design/off-design cases and qualifications |
| R14 | Q198 legal release gate vs public sample maps | NASA T-MATS and OpenMDAO pyCycle are candidate references, not audited/accepted maps; don't rely on restricted C-MAPSS40k | Raw datasets, source/license and calibration |

**Finding:** No unresolved contradictions in the *stated functional requirements* after design/off-design distinction and D01/D02 contract. Real-world map coverage and calibration are a high-severity **feasibility dependency**, not permission to silently downgrade D01.

## 3. Source investigation (candidates, NOT validated data)
1. **NASA T-MATS:** https://github.com/nasa/T-MATS — openly released simulation framework, nonproprietary default maps and examples; source contains a dual-spool high-bypass JT9D example. Licenses, specific maps, speed scales and reference-accuracy claims **not yet audited**. Some T-MATS authoring workflows use MATLAB/Simulink; those tools cannot be required by the free public browser product. Use only legally extractable/reproducible data in a Bun/TypeScript runtime.
2. **OpenMDAO pyCycle:** https://github.com/OpenMDAO/pyCycle/blob/master/example_cycles/high_bypass_turbofan.py — separate-exhaust fan/LPC/HPC/HPT/LPT and two-shaft structure; can function as independent reference baseline once version, maps and units are fixed. Do not treat a framework simulation as a verified empirical engine dataset without calibration checks.
3. **NASA C-MAPSS40k:** https://software.nasa.gov/software/LEW-18624-1 — restricted distribution per current catalog; **not an admissible dependency** absent a separately verified free grant.
4. Map-derived physical RPM requires independent absolute design shaft-speed reference and proper corrected-speed scaling. Relative speed curves alone do not meet D01.

## 4. Critical evidence and phase gates
| Evidence | Minimum completion condition | When required | Classification |
|---|---|---|---|
| E01 Map data licensing and provenance | Raw compressor/turbine maps for TJ C/T and TF fan/LPC/HPC/HPT/LPT; source/license/hashes; permitted redistribution in the public site | Before committed map imports | **P0** scientific/legal |
| E02 Absolute RPM map calibration | Verified design RPM scaling and design + at least 3 off-design reference points per engine, under matching gas properties | Before accepting solver/published speed | **P0** scientific |
| E03 Fully specified off-design equations | Explicit unknown count, residual/Jacobian rank, corrected values, interpolation domain, loss/bleed matching, robust convergence | Before off-design implementation acceptance | **P0** numerical |
| E04 Variable area actuation and geometry | A_eff / Cd / A_geom relationship, separate TF nozzles, feasible actuation range, simultaneous solver/mesh update and rejection behavior | Before nozzle/scene feature acceptance | **P0** numerical/3D |
| E05 Thermodynamics | Independently referenced gas correlations and property validity, atmosphere, nozzle choking, conservation | Before numerical release | P0 scientific |
| E06 Licensed 3D donor or authored geometry | Mechanical hierarchy, normalized scale, topology, LOD and rights | Before asset inclusion | P0 legal/3D |
| E07 Free frontend/toolchain feasibility | React/R3F/Three/Zustand/KaTeX/Bun compatible pinned versions, build and base-path smoke | During authorized initial build | P1 integration |
| E08 Adaptive performance/offline | Measured desktop/mobile memory, frame pacing, cache and WebGL failure handling | Before release | P1 operational |
| E09 Complete learning program | All 15 modules, examples, citations, verified numeric assessments, accessible diagrams | Before course release | P1 content |
| E10 Browser/a11y/video/deployment | Q194–Q200 full checks, recorded walkthrough, curated film, GH Pages smoke and rollback | Before publishing | P0/P1 release |

**Hard blocker:** E01–E04 are not currently evidenced. The system may be implementation-planned and experimental prototypes may eventually be authorized, but **D01 model-predicted actual RPM cannot be declared complete or published until independent map/speed validation succeeds**. Do not invent exact OEM speed data, maps, nozzle areas, coefficients or precision.

## 5. Reconciled technical contract
- **Architecture:** React 19, strict TypeScript, Vite, R3F/Three, Bun, typed small Zustand stores, KaTeX, CSS tokens/modules, dedicated off-design solver Web Worker, model-specific independent configuration and 3D assembly graphs, versioned map registry and progress/cache. Static GitHub Pages hash routes.
- **User controls:** design/calibration mode permits design mass flow, compressor/turbine design efficiencies/pressure ratios, BPR and geometry as feasible; off-design mode treats map PR, efficiencies, shaft RPM and solved mass flow as dependent outputs, controls flight state, throttle/TIT schedule and independently adjustable core/bypass effective nozzles. Preserve Q55 advanced editability without overconstraining the off-design solver.
- **Nozzles:** physical A_eff and A_geom are distinct; Cd and outlet area documented. Area controls change actual model capacity and real displayed throat geometry through an atomic accepted result. TF has independent core/bypass actuators; TJ one core actuator. No silent geometry changes or mismatched stale telemetry.
- **Credibility:** show map source, date/version, calibration, bounds, solver convergence and uncertainty caveats; reference-generic results not OEM certification. No calculated surge margin without explicit validated surge maps. Steady-state speed prediction does not imply transient start dynamics.
- **User-facing fallback:** if map unavailable, UI gives explanatory blocked/invalid state; does not label normalized visualization as computed RPM. Browser 2D fallback remains functional where data exists, but missing map validation remains a release blocker.

## 6. Dependency-aware execution plan — ONLY AFTER USER APPROVAL
**Phase 0:** accept implementation authorization, create isolated feature branch, investigate/verify map assets + license, initial numerical property and design-speed calibration, source mechanical dimensions, 3D candidate licenses. Early terminate/raise evidence issue if P0 impossible; do not downgrade requirements.
**Phase 1:** React architecture, strict TS domain, service worker strategy, base-path and hash route harness, accessible CAD shell and visual tokens; create typed map/power/nozzle contracts.
**Phase 2:** variable-property gas, station graphs, map interpolation/scaling, bounded shaft/map/nozzle nonlinear solver, independent reference fixtures, robust worker protocol and map source display.
**Phase 3:** physically distinct TJ/TF assets, full mechanical groups, deformable nozzle meshes, clipping/measurement, true scene/numeric state synchronization and calibrated shaft displays.
**Phase 4:** 15-module curriculum, experiments, reports, glossary, progress and accessible diagrams.
**Phase 5:** numerical/geometry/asset-license/a11y/browser/performance/offline QA, all recording coverage, visual regression and editorial review.
**Phase 6:** explicit approved integration into master, GitHub Pages gh-pages deployment, public live checks, rollback evidence.

## 7. Verdict and sign-off boundaries
- **Requirements completeness:** PASS — Q01–Q200 and D01=B/D02=B captured, all architectural user decisions closed.
- **Cross-document design coherence:** PASS *at specification level*, subject to actual map/nozzle feasibility testing in E01–E04.
- **Architecture-definition readiness:** **CONDITIONAL PASS**, not claim of tested engineering feasibility. Core interfaces, state, source policies, degrees-of-freedom strategy, visuals and QA gates specified. Map source and absolute rpm calibration are the critical unresolved *data evidence*.
- **Implementation authorization:** **GRANTED 2026-11-01**. Work proceeds on the isolated implementation feature branch; merge and public deployment remain contingent on passing final gates and review.
- **Technical implementation completeness:** PARTIAL. React migration, initial engine scenes, optional CC0 reference model, preliminary thermodynamics, reference map imports, and limited QA exist; calibrated off-design RPM, fully coupled nozzle physics and other release requirements are incomplete. See `IMPLEMENTATION_STATUS.md`.
- **Production release readiness:** FAIL / NOT READY until all G1–G14 acceptance checks pass and user approves publish.

For full details refer to `../PRODUCT.md`, `../DESIGN.md`, `REDESIGN_DECISIONS.md`, `PHYSICS_SPEC.md`, `OFF_DESIGN_MAPS_AND_NOZZLES.md`, `ENGINE_ASSEMBLIES.md`, `CURRICULUM.md`, `ASSET_PROVENANCE.md`, and `VERIFICATION_RELEASE.md`. This verdict records the final **planning** review, not a fabricated successful implementation test or independent aerodynamic validation.

## Publication update — 2026-11-01

The earlier review and audit statements describing an unmerged feature branch and prohibiting deployment reflect the **planning period**, before the user's subsequent explicit implementation and deployment authorizations. The visual redesign was fast-forward merged into `master` (`2ef9ec9`) and the educational preview published from `gh-pages` (`1cdf6f6`). The GitHub Pages deployment workflow completed successfully. This publication **does not** close the documented D01/D02 scientific and full-release acceptance gates. See `IMPLEMENTATION_STATUS.md` for current verification status.

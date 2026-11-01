# Jet Engine Lab — Product and Architecture Specification

**Status:** Q01–Q200 plus D01=B and D02=B locked; architecture specification reconciled. **Implementation authorized 2026-11-01; an incomplete engineering preview exists on `feature/jet-engine-lab-redesign`.** Component-map calibration and independent scientific evidence remain release gates.
**Product date:** 2026-11-01. **Decision authority:** `docs/REDESIGN_DECISIONS.md` (Q01–Q200 plus D01/D02). Where a proposal below is not an approved Q-item, it is marked *engineering proposal* and may change when evidence demands it.

## Product intent
Jet Engine Lab is a free, public, technically serious and approachable aerospace-engineering learning platform. Its centerpiece is interactive, inspectable, high-fidelity 3D models of **two different physical architectures**: a generic single-spool axial **turbojet** and a generic two-spool **high-bypass turbofan** with separate core and bypass nozzles. Teach mechanisms and quantify thermodynamic behavior with an honest bounded steady-state model. The models are educational references, not real aircraft-engine design/certification tools.

**People:** engineering students from beginner to advanced, developers, aviation enthusiasts. **Primary jobs:** understand the flow path; inspect machinery; operate each engine within a declared envelope; trace equations, stations and conservation; test hypotheses; compare architectures; complete guided courses; export a reproducible analysis. English at release, readable on mobile but optimized for desktop.

## Non-negotiable experience
1. Large, fully navigable 3D engineering viewport. Realistic PBR metals, selective CAD measurement guides, true perspective/orthographic views, viewport controls, cutaway, continuous exploded assembly control, hide/ghost/isolate, component tree, contextual inspection and clickable educational references.
2. Two distinct scene and solver configurations. Turbojet rotor/stator and shared shaft must not accidentally present turbofan features; turbofan fan, LPC, HPC, HPT, LPT, HP/LP shaft affiliation, core and bypass flow, distinct nozzles must agree with the numerical model.
3. Persistent **compact** instrument dock (thrust, fuel, spool speeds, then other readings), prominently visible without competing with the model. Dedicated expandable cycle-analysis workspace, consistent units and charts.
4. Full lessons: accessible prerequisite refreshers, approximately 12–16 substantive modules, interactive experiments, worked examples, numeric assessment, feedback, glossary, citations, tracked local progress with import/export.
5. Transparent equations, boundary conditions and residuals. Invalid input never silently clamps. Convergence failures do not masquerade as new results. Both engines compared at matched flight conditions, with different design assumptions reported.
6. Dark graphite/navy blueprint/CAD default and complete accessible light mode. High-quality free models plus custom mechanically necessary parts; progressive loading, managed local cache and graceful WebGL/3D fallback.
7. Reduced-motion, keyboard navigation, semantics and accessible 2D technical alternatives. Optional muted-by-default mechanical audio. Full-site walkthrough recording and separately produced curated film.

## Site map / static routes
Use **hash routing** because production is a static GitHub Pages project path. Example logical routes (exact slugs proposed):
- `#/` — home, hero engine and curriculum entry.
- `#/engines/turbojet`, `#/engines/turbofan` — isolated simulator experiences and selectable assemblies.
- `#/courses`, `#/courses/:moduleId` — structured learning.
- `#/analysis` — single-engine cycle and paired comparison; reproducible report export.
- `#/reference` — glossary, station map, equations and source notes.
- `#/credits` — asset provenance, licenses, acknowledgments.
- `#/not-found` — in-app route fallback.

**URL state design:** hash path plus encoded query/state with schema version, engine ID and validated operating conditions. Reject unknown keys/oversized payloads; treat URL state as untrusted input; never include cached user progress in a shared URL. Avoid leaking state into route segments. Hash-router compatibility with tab/back/forward navigation and GitHub Pages subpath must be tested, not presumed.

## Feature domains / boundaries
`app/shell`: routes, navigation, theme, responsive layout, accessibility, error recovery. `engines/catalog`: typed config and part hierarchy with units, rotations, annotations and cross references. `engines/viewer`: R3F/Three render world, GPU asset managers, camera and sectioning. `physics/core`: pure SI numeric models and property tables, solver, validators, diagnostics. `physics/worker`: request versioning/cancellation and independent result worker. `labs/analysis`: charts, exports and comparisons. `learning/content`: typed authored chapters, experiments, questions, citations. `local/persistence`: versioned settings/progress and cache migration. `assets/registry`: provenance, validation and reproducible build metadata. `quality/recording`: browser capture and promotional video workflows.

**Proposed technology baseline:** React 19, strict TypeScript, Vite, React Three Fiber/Three, typed small Zustand stores, CSS modules and CSS custom properties, accessible headless primitives, KaTeX with readable text alternative, pure TS numerical solver in Web Worker, Bun for package manager/scripts. Static GitHub Pages `gh-pages` build; `master` source. Pin tested compatible versions; perform a current dependency compatibility and security audit at implementation start.

## Simulation product contract
- Each engine has a versioned design-point preset with documented assumptions, parameters, bounds and calculation references. Separate mass/energy/shaft accounting and cooling/bleed handling. Expose changing compressor efficiencies, temperature, altitude, Mach, mass flow, bypass ratio, losses and spool-related terms according to model support.
- **Map-based steady-state off-design numerical analysis:** predict TJ single-shaft and TF independent LP/HP model RPM through licensed, source-traced, quantitatively validated compressor/turbine performance maps and corrected-speed/flow matching. Startup/shutdown tours remain *illustrative*, not transient predictions. Distinguish model-predicted calibrated RPM from measured production-engine RPM; without validated map speed scales, D01 is not satisfied and RPM remains unavailable. Quantitative surge margin requires separate validated boundaries.
- Off-design user inputs, pressure ratios, map calibration and mass flow are differentiated by **Design vs Off-design** control modes to avoid overspecifying the equation system. Turbojet effective core nozzle area and turbofan independently adjustable core/bypass nozzle areas drive flow capacity and matched RPM/thrust, and are synchronized with parametric 3D throat geometry. Reject infeasible states atomically without visual/numeric disagreement. See `docs/OFF_DESIGN_MAPS_AND_NOZZLES.md`.
- Equations, feasible envelope, numerical residuals, map source/calibration and limitations linked next to the numbers; display assumptions explicitly. Expanded specifications: `docs/PHYSICS_SPEC.md`.

## Graphics and animation contract
- Shared longitudinal +X engine-axis and SI meters; coordinate orientations, part IDs, shaft grouping and flow paths in `docs/ENGINE_ASSEMBLIES.md`.
- Three-quarter cutaway initial view; optional external shell, hierarchical explosion, clipping/sectioning, measured reference features, focus targets, fixed camera presets, first-class keyboard and touch interactions. Perspective and orthographic modes; no fabricated 'CAD dimension' derived from an unscaled downloaded model.
- Realistic selective wear and heat discoloration, neutral/HDR studio lighting, dynamic LODs, flow visual from *numeric* station states but not CFD. Interactive tour with user interruption and resume, always obey reduced motion.
- Visual contract and screen-by-screen states: `DESIGN.md`.

## Data model sketch (conceptual, not application code)
`EngineConfig`: `engineId, version, referenceEnvelope, stationGraph, validatedCompressorAndTurbineMaps, mapScaling, shaftMap, variableNozzleGeometry, geometryManifest, designPointInputs, offDesignControls, inputConstraints, sourceReferences`.
`Inputs`: typed SI quantities; explicit enum discriminants for turbojet/turbofan; units are display-only transformations. `CycleResult`: station states, branch mass flow, spool power/residuals, thrust components, fuel flow, efficiency metrics, validity flags, assumptions and provenance. `SceneState`: selected part, camera preset, projection, shell/explosion/clip/visibility/LOD, tour progress. `LearningState`: versioned module progress, attempts and settings; no account. `AssetManifest`: source/license evidence, hash, transforms, derived formats, scene roles, budget.

## UX rules / exceptional states
- Invalid input: field-level issue + range context, solver not called; last valid output remains labelled as such. Worker timeout/convergence: diagnostic, retry/reset; stale worker responses never overwrite fresh state.
- New model selection preserves altitude/Mach/ambient conditions when valid, resets engine-exclusive settings and states exactly which values changed.
- WebGL unavailable or reduced motion: accessible 2D component diagrams, equations, data tables and manual inspection; never a blank page.
- Cache update: versioned shell + course content; load and evict engine assets according to bounded policy; recover from storage quota/external asset failure.
- Export: printable analysis with engine/config version, time, units, validated inputs, station states, plots, assumptions, residuals, model warnings and bibliography. CSV available for table data. No fabricated experimental data.

## Out of scope for release
Actual CFD, full compressor/turbine maps without data, transient controls/start sequences, engine certification or safety advice, real engine OEM performance claims, user accounts/cloud sync, paid asset subscriptions, advanced CAD manufacturing tolerances, multiple engine variants per type, multiplayer collaboration.

## Documentation and gates
- `docs/REDESIGN_DECISIONS.md`: all 200 user-locked decisions.
- `DESIGN.md`: graphic language, flows, interaction and visual states.
- `docs/PHYSICS_SPEC.md`: equations, operating boundaries, solver and validation.
- `docs/OFF_DESIGN_MAPS_AND_NOZZLES.md`: approved map-based RPM prediction and variable-area nozzle implementation contract.
- `docs/ENGINE_ASSEMBLIES.md`: geometry tree, transforms, rigging, station linkage.
- `docs/CURRICULUM.md`: module outlines, experiments, quizzes, references.
- `docs/ASSET_PROVENANCE.md`: sourcing, license acceptance and pipeline.
- `docs/VERIFICATION_RELEASE.md`: executable test matrix and delivery evidence.
- `docs/ARCHITECTURE_READINESS.md`: contradiction review, risk register and final approval requirements.

## Authority and release condition
Q01–Q200 are accepted requirements, not proof of implementation feasibility. Engineering proposals/tolerances and unselected third-party assets are **not verified or approved data**. Implementation authorization was granted on 2026-11-01. A reviewable feature-branch implementation may proceed, but neither `master` merge nor public deployment is authorized while scientific, legal and G1–G14 release evidence remains incomplete.

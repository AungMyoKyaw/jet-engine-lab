# VERIFICATION_RELEASE.md — QA, Acceptance and Publishing Plan

**Status:** Release-verification plan and criteria, **not evidence of complete acceptance**. Limited implementation evidence (34 Bun tests, strict TypeScript, Chromium/WebKit route checks, production offline shell/Reference and desktop/mobile screenshots) exists in `IMPLEMENTATION_STATUS.md`; most G1–G14 gates remain incomplete. Covers Q31, Q33–Q35, Q61, Q87–Q100, Q117–Q120, Q170–Q200.

## Quality principle
A check is complete only when a reproducible command/fixture, environment, measured output and pass/fail result are recorded. Do not label an unchecked requirement green. Fail on numerical inconsistency, incorrect 3D mechanical relationships, missing third-party rights, broken accessibility, false scientific claims, production route failure or major rendering defects. Preserve existing working app and historical branch until a verified replacement is reviewed.

## Proposed implementation/testing toolchain
- Bun for dependency scripts, package installs and CI commands; frozen lockfile and pinned compatible versions.
- TypeScript strict compiler, lint and formatting; pure physics tests with property-based cases; React Testing Library for accessible UI and keyboard interaction; Playwright Chromium/Firefox/WebKit; screenshots at preselected viewport sizes; axe accessibility audits + manual checks; Blender/glTF asset validators; optional glTF-Transform tools if free and license-compatible.
- Source `master`, isolated `feature/jet-engine-lab-redesign` branch created **after implementation approval**, `gh-pages` only via existing deployment script after explicit release approval. Verify original `scripts/deploy-pages.sh` semantics before replacing it. No force-push and no history rewrite.

## Requirements traceability and formal gates
| Gate | Scope | Test evidence | Release criterion |
|---|---|---|---|
| G1 Numerical baseline | TJ-1, TF-2 | Independently computed fixtures, equation/source annotation, numeric error summary | Baselines physically and numerically valid in declared envelopes |
| G2 Conservation | Every valid input variant | Mass/energy/spool/nozzle residual fixtures and seeded property tests | Residuals meet reviewer-approved tolerances; failures clearly classified |
| G3 Solver errors | Invalid and extreme inputs | Validation tests, worker stale-race tests, cancellation/error retry logs | Never NaN/uncaught hang/silent clamp or false 'valid' values |
| G4 Geometry | Both assemblies, every LOD | Semantic part inventory, transform map, mesh/topology checks, close-up captures | No missing parts, wrong shafts, inverted normals, significant interpenetrations |
| G5 Scene/physics linkage | Both engines | Spool/station/flow mapping tests, flow and numeric state updates | Visualized branches/rotation affiliation match computed state |
| G6 UX | Routes, part inspection, charts, tours, export | E2E and unit tests, manual usability checks | All primary user journeys complete without blocker |
| G7 Visual & responsive | Themes, desktop/tablet/mobile, zoom | Screenshot regression and cross-browser captures | High-quality layout, no clipping/unreadability, 3D scene remains main focus |
| G8 Accessibility | Keyboard, screen reader, reduced motion, 2D fallback | Automated + manual checks | No critical accessibility blockers; accessible non-3D learning path works |
| G9 Assets/legal | Fonts, materials, 3D scenes, HDR, code | Registry and original license evidence, hash match, public credits | Every distributed asset has compatible rights and credits |
| G10 Performance/offline | Cold/warm, GPU, low-detail | Real device measurements, cache/update/recovery | Meets documented per-device budgets; no severe memory/thermal degradation |
| G11 Recording | Complete website + curated film | Page-coverage report, browser console, sampled keyframes, MP4 inspection | Every route/key state covered, videos playable and representative |
| G12 Deployment | GitHub Pages | Build artifact integrity, routes, assets, service worker scope, release smoke | Verified public URL serves complete release; easy rollback |

## Additional mandatory locked D01=B / D02=B gates

| Gate | Scope | Test evidence | Release criterion |
|---|---|---|---|
| G13 Map-based off-design speed | TJ mapped compressor+turbine; TF mapped fan/LPC/HPC/HPT/LPT | Source rights + raw hashes, corrected speed calibration, reference design & off-design points, independent rpm cross-check, map-domain tests | **Model-predicted physical RPM independently corroborated**, no guessed/normalized substitute; fail closed if data unavailable |
| G14 Adjustable nozzle geometry | TJ A8, TF core A8 and bypass A18 | Nozzle mass/area/pressure residual tests, choked/unchoked boundary sweep, 3D throat measurement/LOD screenshots, stale-worker atomic update test | Solver `A_eff` and displayed geometric throat agree via approved `Cd`; independent TF core/bypass controls work; infeasible states rejected without mismatched mesh/readouts |

These are hard release gates, not optional visual enhancements. Candidate maps (NASA T-MATS / pyCycle) must be independently evaluated, not assumed verified. Publish the map source/license/calibration evidence, speed reference comparisons, nozzle geometry accuracy and solver residuals. Test design-point input/config mode against off-design solved pressure ratio/efficiency/flow to prevent an overdetermined UI. The Worker response must version map/calibration ID and nozzle area, and scene/telemetry commit atomically.

## Physics test design
- Independently calculate reference points under matching assumptions; do not compare mismatched ideal vs nonideal gas models with false precision. Record methods, parameter tables, source versions and analyst.
- Test monotonicity only where physically predicted in a documented constrained regime; **do not assert all throttle/pressure ratio sweeps monotonic** under arbitrary settings. Validate specific boundary transition behavior (choked/unchoked; static/cruise) and component energy power matching. For TF-2 verify `mdot_0=mdot_core+mdot_bypass` and fuel addition downstream in appropriate core equation.
- Use relative plus absolute tolerance for mass/power/energy residuals; proposed starting targets in `PHYSICS_SPEC.md` require actual solver convergence benchmark. Test cross-engine comparison for matched altitude, Mach and known different design parameters.
- Property-based generation from valid parameter bounds; record accepted/rejected count and shrink failure examples. Invalid-range tests verify clear input errors, last-valid result retention and no hidden clamping. Stale worker response must never overwrite newer state.
- No claim of 'actual RPM,' 'surge margin,' 'engine certified thrust' or 'CFD flow' without corresponding substantiated model. Snapshot text warnings and exported report caveats.

## Geometry and asset acceptance
Test geometry bounding boxes (meters), normal orientation, UV continuity, no impossible shaft/duct intersections, scene transforms at u=0/u=0.5/u=1, cutter/clipping boundaries, meaningful part pick and focused camera. Capture closeups of fan, LPC/HPC, annular combustor, HPT/LPT, both shafts, the separate bypass/core nozzles and the corresponding turbojet components. No detached decorative parts should be labeled as functional without physical connection. Component ID stable between mobile/desktop LODs. Compare GPU metrics and cold-load bytes per asset. License check blocks release for unknown provenance.

## Browser and accessibility matrix (proposed)
| Environment | Viewports / states | Essential interactions |
|---|---|---|
| Chromium desktop | 1600×900, 1440×900, 1280×720; dark/light | Both engines, full controls, comparison, sections, tour, export |
| Firefox desktop | 1440×900; both themes | Worker calculation, WebGL geometry, cache and keyboard |
| WebKit desktop | 1440×900 | Canvas, material variants, navigation and print report |
| Tablet emulation | 820×1180, 1024×768 | Touch orbit, responsive telemetry and inspector |
| Mobile emulation | 390×844, 360×740 | Low-detail scene or 2D fallback, interactive analysis and chapters |
| Accessibility | 200% zoom, reduced motion, no WebGL | Keyboard, role labels, feedback, equations, noncolor information |
| Network | Offline warm cache, simulated slow network, failed GLB | Progressive display, retry, no blank route, service worker update |

Test the real hosting base path (project-name prefix) rather than localhost root only; hash routes and asset URLs must work under GitHub Pages. Manual screen reader checks should include VoiceOver or equivalent, and chart tables accessible without interpreting color alone.

## Proposed measurable budgets — not yet calibrated
1. Record cold first meaningful interactive shell, first low-detail 3D image, high-detail load, p50/p95 frame time and interaction latency. Select final pass thresholds after asset pilot, across representative high-end laptop and a mid-range mobile device.
2. High fidelity remains a priority (Q29/Q99), but sustained catastrophic stutter, memory leaks and unusable mobile rendering fail. Adaptive renderer may reduce quality while preserving semantic component inspection.
3. Monitor WebGL context loss/recreation, GPU texture allocations, draw calls, animation paused in background, 5-minute scene switching endurance, warm-cache eviction and update recovery. Record metrics with browser/device, OS and engine model revision.
4. Do not claim a mandated 60 FPS; user explicitly chose measured quality and adaptive rendering. An empirically determined acceptable quality/fps envelope becomes an implementation acceptance threshold.

## Learning/content acceptance
15 planned chapters from `CURRICULUM.md`; each has lesson, original diagram, accessible alternative, at least one working experiment, valid exercise, feedback, sources and glossary. Import/export progress round-trip and migration tested with representative stored versions. Math units, source links, chart data and exported reports verified. No fictional textbook citations.

## Videos and recordings
1. **Complete site recording:** Adapt original recording script to visit every route, both engines, 3D cutaway/explosion/tour/sectioning, control changes, analysis, representative chapters, reference, credits and both themes. Record console errors, per-route coverage and timestamped sample frames. Output H.264 playable MP4 and coverage log; no claims of full coverage until verified.
2. **Curated film:** Storyboard and edit deliberate 90–120s proposal (duration is a *proposal*, not a new locked requirement), original permissible audio if used, visual excerpts demonstrating both engines, mechanics, equations and chapters. Source recording rights and credit assets. Include horizontal and optional vertical framing as an implementation proposal.
3. User sees screen capture without private paths, usernames, personal identifiers or credentials. Confirm video typography legible after compression.

## Deployment runbook (no steps executed now)
- Preconditions: implementation approved, branch isolated, all G1–G11 pass, dependencies pinned, asset rights proven, docs and source notices correct; independent review findings resolved.
- On approved branch: frozen install -> compiler/lint -> physics test -> component tests -> E2E three browsers -> screenshots -> asset manifest and legal audit -> optimized build -> GitHub Pages base-path preview -> recording checks.
- Review diff and evidence. Explicitly approved integration then merge/push to `master`; publish `dist` to `gh-pages` through script after verifying it cannot rewrite `master`. Validate actual public website: both engine routes, JSON and GLB assets, KTX2/meshopt decoders, source maps policy, worker paths, service-worker scope, accessible fallback and cache-refresh behavior.
- Rollback: retain verified previous `gh-pages` commit/release artifact, do not mutate git history, restore previous artifact if blocking post-release defect. Retest cache update after rollback.

## Evidence bundle for final implementation review
`validation/physics-fixtures.md`, `validation/physics-results.json`, `validation/geometry-review.md`, `validation/asset-rights.md`, `validation/performance.md`, `validation/accessibility.md`, `validation/visual-regression/`, `validation/route-smoke.md`, `validation/recording-coverage.md`, `validation/release-manifest.md`. Paths are future outputs only; no evidence exists yet.

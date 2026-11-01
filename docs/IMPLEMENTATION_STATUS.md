# Jet Engine Lab — Implementation Progress and Validation Report

**Date:** 2026-11-01. **Branch:** `feature/jet-engine-lab-redesign` (isolated from `master`). **Release status:** INCOMPLETE; no production deployment. **Status classification:** source and browser working as an engineering preview, not all Q01–Q200 + D01=B/D02=B acceptance gates satisfied.

## What was implemented and tested

| Workstream | Current implementation | Evidence | Acceptance |
|---|---|---|---|
| Frontend migration | React 19, TypeScript strict, Vite, Bun, R3F 9, Three.js, CSS tokens, responsive dark/light theme | `bun run typecheck`, `bun run build` | Preview working; full UX QA pending |
| Two distinct engines | Procedural single-spool turbojet and two-spool separated-flow turbofan with selectable assemblies, shell, orbit, explosion | Playwright route screenshots and no browser page errors | Partial; many detailed mechanical features pending |
| Quality of 3D | Custom instanced cambered blades, PBR materials, optional CC0 Innerscene model, CC0 studio HDRI, mobile camera and view presets | Browser captures | Partial; scale, topological and visual inspection still required |
| Preliminary thermodynamics | Bounded ISA, variable heat-capacity approximation, steady-state flow/shaft energy and nozzle-capacity approximations | Bun unit tests | **NOT an independently validated mapped engine solver** |
| D01=B source maps | Five derived tables (Fan/LPC/HPC/HPT/LPT) pinned to pyCycle commit, with original SHA-256 and Apache-2.0 provenance | `src/app/maps.test.ts`: interpolation and bounds tests | Partial; absolute RPM and independent off-design closure **not delivered** |
| D02=B variable nozzle | Adjustable turbojet core and turbofan independent core/bypass areas; preliminary nozzle flow calculation and parametric mesh updates | Unit tests for area changes, Playwright viewport | Partial; coupled mapped solver, discharge coefficient proof and physical clearance validation pending |
| Analysis/reference | Stations, pressure/temperature plots, source equations, CSV, map explorer, credits | Playwright routes | Working preview; export/report verification partial |
| Learning | 15 topical outlines, lesson modal, experiment idea, self-check, local reviewed progress | Playwright courses route | Partial; substantive curriculum/assessed exercises absent |
| Offline/asset path | Self-hosted fonts/HDRI/GLB, hash routes, build-generated shell/reference precache and runtime 3D cache | Production-subpath preview and Chromium offline Reference smoke | Preview confirmed; public GitHub Pages and long-term cache upgrade/rollback not tested |
| QA | 34 Bun tests, strict TypeScript, production bundling, Chromium route/interaction smoke, production offline check, WebKit Reference pass and Impeccable detector | `bun run test`, `bun run smoke`, `bun run smoke:production`, screenshots | Partial; Firefox launcher blocked locally and full G1–G14 release gate not complete |

## Current test evidence

- Unit suites run using Bun: legacy `src/physics.test.js` 14 tests; preview `src/app/physics.test.ts` 14 tests; public map interpolation `src/app/maps.test.ts` 6 tests. **34 passed, 0 failed, 144 assertions in last recorded full run**.
- TypeScript strict passes; Vite production build succeeds with lazy 3D chunk and dedicated reference map chunk. Main/3D chunk size remains a performance concern.
- Playwright Chromium smoke visits `#/engines/turbojet`, `#/engines/turbofan`, `#/courses`, `#/analysis`, `#/reference`, `#/credits`; confirms canvas where appropriate, model switch and HPC map viewer; zero caught JavaScript page errors.
- Impeccable detector on changed UI targets returned `[]` on the recorded run. Manual screenshot review led to corrections for KaTeX escaping, mobile camera, control wrap and rotor blade profiles.
- Screenshot evidence: `docs/redesign-desktop.png`, `docs/redesign-turbofan.png`, `docs/redesign-mobile.png`, `docs/redesign-cc0-reference.png`, `docs/redesign-2d-fallback.png` and production browser captures. Desktop and mobile updated after the old blank-canvas defect was fixed.

## Critical remaining work and blockers

**G13 — D01=B actual physical RPM:** maps alone are insufficient. Need independent design-point calibration, corrected-speed/flow formulation, multi-equation off-design matching (TJ shaft, TF LP/HP shafts), validated reference test cases and operating domain. Current results intentionally use `n1=null,n2=null`; UI displays `— RPM`. Do not assume the current map inspector makes the model predictive.

**G14 — D02=B:** the current area slider influences preliminary area and mesh. Full coupled physical nozzle–compressor–turbine matching, geometry actuation constraints, area measurements across LOD and verification against the validated solver are outstanding.

**Geometry and curriculum:** incomplete reference-dimension provenance, internal supports/shafts, accurate clipping planes, true orthographic CAD projection, LOD optimization, full chapter-by-chapter accessible diagrams (a basic labeled 2D engine fallback now exists), full guided tours, graded numerical lessons, complete course and progress import/export. Current rotor animation is illustrative in the absence of calibrated RPM.

**Release and reliability:** hardware-specific performance measurements, accessibility and keyboard test matrix, Firefox (local Playwright launch failed: could not find profile folder), full WebKit engine/interaction coverage, service-worker version migration/rollback, complete site/video recording, full legal/asset gate and independent scientific review are not complete. Chromium production-offline Reference passed; WebKit Reference route loaded. Do not merge to master or deploy to `gh-pages` as though approved.

## Reproduction

```bash
bun install --frozen-lockfile
bun run typecheck
bun run test
bun run build
bun run dev
bun run smoke
bun run smoke:production
```

Use `bun run preview` to serve a production build. The local Vite preview was tested at `/jet-engine-lab/`, including offline Reference navigation after service-worker warm-up. The actual public GitHub Pages domain and update/rollback path still require release-stage validation.

## Source/data rights

- Pinned pyCycle SHA: `ee7e16126a7a54b5fe35292c53b7eb4e9572620b`; see `scripts/import-pycycle-maps.py` and each derived `src/app/data/maps/*.json`. pyCycle Apache-2.0. Raw map values are research data and not validated model-derived RPM.
- CC0 HDRI: Studio Small 08 by Sergej Majboroda; `public/assets/studio_small_08_1k.hdr` and SHA-256 recorded in `ASSET_PROVENANCE.md`.
- IBM Plex fonts: imported from Fontsource under SIL OFL.
- One optional CC0 Innerscene turbofan GLB is installed for separately labeled visual study only; it lacks mechanical assemblies and is not solver geometry. Procedural engine scene meshes are original local source.

## Next acceptance order

1. Pin independent published design/off-design reference cases and solve/validate G13 correctly; fail closed on missing data.
2. Reconcile G14 nozzle actuator geometry with the converged maps, mass flow, RPM and thrust.
3. Complete engine geometry, sections, camera states, accessibility and 15 substantive modules.
4. Run full G1–G14 test/release matrix, review and fix defects, then obtain separate final approval before publishing.

**No claim of complete implementation or production readiness is made.** No production deployment should occur based solely on the current successful preview tests.

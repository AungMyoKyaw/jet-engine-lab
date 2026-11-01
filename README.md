# Jet Engine Lab

**Interactive 3D engineering preview · React 19 + TypeScript + React Three Fiber + Three.js**

Jet Engine Lab investigates how an axial turbojet and a separate-flow, two-spool high-bypass turbofan exchange shaft work, add fuel energy, and generate thrust. It combines an interactive CAD-inspired viewport, a compact instrument panel, preliminary station-cycle calculations, technical reference maps, and an introductory 15-topic learning index.

**Development status: engineering preview, not a release-ready or validated engine simulator.** The current model does **not** predict independently validated N1/N2 RPM, and its mapped off-design closure is not complete. The public data tables are available for inspection but are not yet coupled to the thermodynamic solver. Do not use its output for real-engine design, operation or safety decisions.

![Redesign desktop workbench](docs/redesign-desktop.png)

## Run on macOS/Linux

Requires **Bun** and a WebGL-capable browser. No paid tools.

```bash
bun install --frozen-lockfile
bun run dev
# http://127.0.0.1:4173/#/engines/turbojet

bun run typecheck
bun run test
bun run build
bun run preview
bun run smoke
bun run smoke:production
```

The Vite production build is in `dist/`, configured for a GitHub Pages project subpath `/jet-engine-lab/`. A versioned service worker precaches the shell, worker and Reference modules, then caches recently requested large 3D assets at runtime. A local production-subpath/offline smoke test is available. Hash routes avoid server-side rewrite requirements.

**No deployment is performed by any build or test command.** The existing `bun run deploy` script publishes to `gh-pages`; do not use it until the verified release is explicitly approved.

## What works in this preview

- **Two distinct scenes:** single-spool turbojet and separate-flow two-spool turbofan, clickable assemblies, cutaway shells, exploded view and orbit navigation; mobile camera adjustments, self-hosted CC0 Poly Haven studio HDRI and procedural instanced airfoil-like rotor blade meshes.
- **Preliminary numerical model:** temperature-dependent heat-capacity approximation, ISA atmosphere, compressor and turbine work, core/bypass nozzle capacity, effective/throat area distinction, choked flow indication, thrust and fuel flow. Inputs are range-validated, worker calculations are versioned, and the last accepted result remains on failed input.
- **Engineering workspace:** dark/light CAD theme, persistent compact telemetry, SI/aviation input display, station plots, CSV export, paired-engine analysis, source-backed equations and Credits.
- **Learning:** a 15-topic curriculum index with introductory explanations, experiment prompts, self-check explanations and locally stored reviewed status. The complete source-verified chapter text/assessments are **not** yet implemented.
- **Public map research:** five pinned Apache-2.0 pyCycle reference tables (Fan, LPC, HPC, HPT, LPT), bilinear interpolation with no extrapolation, original source SHA-256 hashes, and an interactive map explorer under Reference.
- **Build/test:** strict TypeScript, Bun unit tests, browser route screenshots and smoke automation, Impeccable detector, preview-specific provenance records.

## Scientific gaps that block final acceptance

1. **D01=B — mapped off-design RPM:** acquire and independently calibrate each map with a reference design point, solve component map working lines, shaft matching, mass and nozzle closure as one nonlinear system, and validate physical RPM against independent model reference cases. Current N1/N2 readouts intentionally display **—**.
2. **D02=B — complete coupled variable nozzle:** the preview changes effective area, preliminary flow capacity and a corresponding parametric 3D throat, but does not yet close all mapped off-design equations with varying core/bypass nozzles and shaft speed.
3. **Geometry:** major assemblies are mechanically distinct but still procedural. Detailed reference dimensions, bearings/supports, accurate independent shaft rigging, section-plane tools, LODs, and licensed imported high-resolution model components require further implementation and independent quality evidence.
4. **Curriculum and accessibility:** full substantive modules, fully assessed numerical answers, 2D technical fallback, robust progress migration and reports are not complete.
5. **Release:** multi-browser, measured GPU performance, independent physics reference fixtures, accessibility audit, offline update/rollback tests and complete recording must pass before GitHub Pages deployment.

See [implementation status](docs/IMPLEMENTATION_STATUS.md), [approved decisions](docs/REDESIGN_DECISIONS.md), [product specification](PRODUCT.md), [design system](DESIGN.md), [map/nozzle contract](docs/OFF_DESIGN_MAPS_AND_NOZZLES.md), [physics specification](docs/PHYSICS_SPEC.md) and [release criteria](docs/VERIFICATION_RELEASE.md).

## Source structure

| Path | Responsibility |
|---|---|
| `src/app/ui/` | React application, routes, CAD interface and CSS |
| `src/app/engine/` | R3F/Three procedural engine scenes and animation |
| `src/app/physics/` | Preliminary cycle solver, map interpolation and Web Worker |
| `src/app/data/maps/` | Reproducible derived public pyCycle tabular map datasets |
| `src/app/components/MapExplorer.tsx` | Interactive reference map inspector |
| `scripts/import-pycycle-maps.py` | Source-pinned, AST-only public table extraction |
| `scripts/smoke-redesign.mjs` | Browser route and interaction test |
| `src/physics.js` / `src/scene.js` | Preserved original engine implementation for comparison |
| `docs/` | Engineering, design, provenance and verification evidence |

## Assets, credits and licensing

- **Procedural engine geometry:** original code in this repository; see project [MIT LICENSE](LICENSE) for the project source.
- **Turbofan cutaway visual study:** [Innerscene original CC0 mesh](https://www.innerscene.com/tools/library/3d-parts/turbofan-quarter-cutaway-e0184203); optional visual reference only, missing many mechanical assemblies, not used in the solver. Source hash and omissions in `docs/ASSET_PROVENANCE.md`.
- **Studio Small 08 HDRI:** Sergej Majboroda, [Poly Haven](https://polyhaven.com/a/studio_small_08), CC0. Local 1K HDR; its exact SHA-256 and direct source are recorded in `docs/ASSET_PROVENANCE.md`.
- **pyCycle map source:** [OpenMDAO/pyCycle](https://github.com/OpenMDAO/pyCycle), Apache-2.0; pinned commit and raw source hashes embedded in each derived JSON table. Open numerical map data are **not** evidence of an independently validated physical engine RPM prediction.
- **Typography:** IBM Plex Sans/Mono, self-hosted through Fontsource under the SIL Open Font License.
- **Reference physics:** [NASA Glenn](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/turbine-engines/) and the linked documents in the engineering specification.

No proprietary engine manufacturer identity or logo is implied. Separate licenses apply to external assets; the MIT source license does not relicense independently authored third-party material.

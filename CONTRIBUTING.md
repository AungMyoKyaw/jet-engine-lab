# Contributing to Jet Engine Lab

Jet Engine Lab is an **educational engineering preview**. Changes should improve technical clarity, accessibility and implementation quality without overstating the scientific validity of the underlying simulation.

## Development setup

Install [Bun](https://bun.sh/), clone the repository and run:

```bash
bun install --frozen-lockfile
bun run dev
# http://127.0.0.1:4173/#/engines/turbojet
```

The current application is React 19 + strict TypeScript + Vite + React Three Fiber + Three.js. **New simulation calculations belong in `src/app/physics/`, not the preserved legacy `src/physics.js`.** UI components consume typed numerical results; they must not independently invent engineering output.

| Area | Primary locations |
|---|---|
| Solver, input validation and worker | `src/app/physics/cycle.ts`, `worker.ts` |
| Calibrated-map research | `src/app/physics/maps.ts`, `src/app/data/maps/`, `scripts/import-pycycle-maps.py` |
| 3D component hierarchy and geometry | `src/app/data/parts.ts`, `src/app/engine/` |
| UI, responsive views and courses | `src/app/ui/`, `src/app/data/course.ts` |
| Engineering assumptions and limitations | `docs/ENGINEERING.md`, `docs/PHYSICS_SPEC.md` |
| Scientific acceptance requirements | `docs/OFF_DESIGN_MAPS_AND_NOZZLES.md`, `docs/VERIFICATION_RELEASE.md` |

## Quality checks

Before opening or merging a change, run:

```bash
bun run docs:check
bun run typecheck
bun run test
bun run build
bun run smoke
bun run smoke:visual
bun run smoke:production
```

The browser smoke scripts use Playwright; install the required browser binaries for your environment. Also inspect the actual desktop and mobile screenshots after any scene/layout change, including both engine models, light/dark modes, WebGL fallback, viewport-fitting, camera reset and fully exploded parts.

For changes to physics or reference maps, additionally provide:

- A documented numerical assumption, supported operating range and source provenance.
- Reference tests for valid/invalid inputs, conservation and feasibility checks.
- A clear distinction between **published input assumptions**, **numerically computed preview estimates**, **source map tables**, and **independently calibrated results**.
- Explicit unavailable values instead of fabricated physical RPM, OEM performance or compressor surge margins.
- Third-party source license evidence, hashes, redistribution permission and [asset provenance](docs/ASSET_PROVENANCE.md).

No source map may be claimed to have produced validated engine RPM until its scale, calibration and off-design matching have independent supporting evidence. See [current engineering documentation](docs/ENGINEERING.md).

## Branches and release

- `master`: source of the published educational preview.
- `gh-pages`: compiled static website, **not** a source-development branch.
- Use a feature branch for substantial changes, then merge validated source into `master`.
- `bun run deploy` builds, tests and pushes `dist/` to `gh-pages`. **Do not run deployment as part of routine tests.** Verify the resulting public site at [GitHub Pages](https://aungmyokyaw.github.io/jet-engine-lab/).

Publishing the educational preview **does not** mean the final D01/D02 numerical validation and all release gates are complete. Maintain clear limitations and source-specific credits.

## Public repository hygiene

Never commit credentials, internal endpoints, private local paths, account identifiers or personal contact information. Preserve license notices and original author credit for all third-party material. Prefer small, evidence-backed PRs with reproduction steps and before/after screenshots where relevant.

For a useful bug report, include the route/engine, browser and viewport size, operating inputs, steps to reproduce, observed result and expected result. Avoid posting personal or sensitive data.

# Five-Engine 3D Gallery — Release Evidence

**Release target:** Jet Engine Lab browser application, 2026-11-01.

## Product result

A five-engine collection with a single interactive WebGL scene active at a time, preserving a visually simple learning experience. Five original engine preview images are rendered from the actual live procedural Three.js geometries; the gallery does not load five simultaneous WebGL contexts.

| Engine | Characteristic newly authored 3D geometry | Demonstration |
|---|---|---|
| Turbojet | Existing axial compressor, combustor, turbine and nozzle | Preliminary bounded cycle + 3D stages |
| High-bypass turbofan | Existing high-bypass fan, two spools and separate ducts | Preliminary bounded cycle + 3D stages |
| Afterburning turbofan | Lower-bypass arrangement, afterburner rings and spray bars, illustrative flame, sixteen variable nozzle petals | Afterburner on/off and visual nozzle opening; **no numerical performance output** |
| Centrifugal turbojet | Rotating radial impeller, stationary diffuser guide vanes, compact core | Isolated radial motion and flow illustration; **no numerical performance output** |
| Geared turbofan | Large geared fan, rotating sun/planet gears, carrier, visible power path | Gear focus and shaft/gear visual study; **no numerical performance output** |

## Shared behavior

- Full-engine orbit/zoom, reset, component selection and isolated close-up with return.
- Casing reveal, exploded view, heat/ghost/power-path overlays and animated 3D flow particles.
- Five-stage interactive pictogram journey; concise contextual part descriptions.
- Explore/Understand/Experiment interface; gallery and stage strip adapted for desktop and mobile.
- Backward-compatible local `.jetlab.json` study format, with optional persisted `visualEngine` identifier validated against the catalog.
- Existing reference, courses and analysis routes retained; existing preliminary solver untouched.

## Evidence and commands

```bash
bun install --frozen-lockfile
bun run docs:check
bun run typecheck
bun run test
bun run build
bun run smoke
bun run smoke:production
```

The dedicated `smoke:engines` test checks all five gallery thumbnails, selects three distinct new architectures, exercises afterburner/nozzle/gear controls, verifies that visual-only models never receive fabricated physical outputs, confirms local project selection persistence and checks mobile gallery clipping at 390px and 768px. Browser smoke also verifies the original numerical engine and the static offline Reference route.

The gallery image generation is reproducible using `bun run dev` and `bun run previews:engines` (Playwright screenshots of the isolated WebGL stage). Preview PNGs are shipped as static assets.

## Not implemented / not validated

- No physically calibrated afterburning, centrifugal or geared numerical engine model.
- No real-afterburner-specific thrust, fuel flow, core-temperature or nozzle-pressure solutions.
- No mechanical gear tooth interference or manufactured gearbox design validation. Gear ratios/motion are illustrative, not calibrated gearbox dynamics.
- No calibrated physical N1/N2 speed for any engine. D01 and D02 scientific acceptance remain unmet.
- No computational fluid dynamics. Airflow particles, flame and thermal lights are illustrations.
- No OEM-authored component dimensions, manufacturing tolerances or certification.

The gallery and interactive learning visuals are releaseable as an **educational preview** only; do not label them mechanically or scientifically validated.

## Visual references

- [Five-engine desktop gallery](engine-gallery-audit/gallery-desktop.png)
- [Mobile engine gallery](engine-gallery-audit/gallery-mobile.png)
- [Afterburner and nozzle demonstration](engine-gallery-audit/afterburner-on.png)
- [Isolated centrifugal impeller](engine-gallery-audit/radial-focus-delayed.png)
- [Gearbox power-path visualization](engine-gallery-audit/geared-power.png)

## Operational deployment

GitHub repository source branch: `master`. Static production branch: `gh-pages`. Deploy using the existing `bun run deploy` script after tests, then verify GitHub Pages deployment status, public assets and real Chromium navigation to every engine route.

# Visual-First Experience — Release Notes

**Release classification:** public **educational preview**, not validated engine-design software.

## Product direction

The user explicitly superseded the permanent CAD-dashboard interface with a **visual-first, single-engine experience**. The interactive 3D turbofan/turbojet is the main content; all other information appears as short stage cues, pictograms or optional controls. The earlier Q201–Q572 native-CAD defaults remain as historical design exploration and long-term possibilities, **not an assertion that each requirement ships in this release**. The existing Q01–Q200 and D01=B/D02=B physics constraints remain in force.

## Delivered

- Full-window single interactive React Three Fiber 3D engine.
- Desktop and mobile visual layouts, with the engine centered and the model fully in frame.
- Five-step guided engine journey; component selection connects 3D picking and stage descriptions.
- Explore, Understand, Experiment modes, short captions and SVG/icon-based navigation.
- Separate turbofan and turbojet architectures, shell/explode toggles, orbit/reset and camera-angle option.
- Real bounded numerical input sliders and provisional thrust/fuel feedback, derived from the existing worker.
- Mobile experiment controls start with Power; secondary parameters expand on request.
- Optional local .jetlab.json project import/export, browser recovery, optional standalone PWA metadata.
- Browser screenshots, responsive/interaction smoke tests, production/offline smoke checks and preserved scientific disclaimers.

## Acceptance evidence

Run `bun run docs:check && bun run typecheck && bun run test && bun run build && bun run smoke && bun run smoke:production`.

The browser smoke test covers six viewport sizes, component-stage selection, guided step navigation, slider updates, engine switching, modal, project download, themes, canvas mounting and horizontal overflow. The production test exercises the static `/jet-engine-lab/` route and offline Reference cache.

## Scientific and engineering boundaries

No calibrated N1/N2 RPM. No independently validated off-design compressor/turbine map matching, complete core/bypass nozzle closure or measured aerodynamic field simulation. No validated dimensions suitable for manufacturing. Visual airflow is labeled illustrative. Scene animation does not determine numerical results. The complete advanced CAD toolset and fully reviewed curriculum are not part of this visual-first release.

## Verification screenshots

- [Desktop visual experience](visual-first-release/desktop.png)
- [Guided stage](visual-first-release/understand.png)
- [Experiment controls](visual-first-release/experiment.png)
- [Mobile](visual-first-release/mobile.png)
- [Mobile experiment](visual-first-release/mobile-experiment.png)
- [Light theme](visual-first-release/light.png)

## Publication

Source: `master`. Static deployment: `gh-pages`, GitHub Pages. Complete smoke tests before publishing; verify the live site assets and rendered controls after publishing.

## Browser verification detail

Chromium and WebKit production checks passed for the immersive 3D scene and Reference. Chromium service-worker offline Reference check passed. The local Playwright Firefox launcher did not start (`Could not find profile folder`), so Firefox compatibility is not yet independently verified. This is an environment-level test blockage, not evidence that the application works or fails in Firefox.

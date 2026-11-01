# Native-Feeling Web CAD Workspace — Implementation Evidence

**Date:** 2026-11-01. **Branch:** `feature/native-web-cad-workspace`. **Status:** working, tested **partial implementation** of the approved native-feeling web architecture. This is not a statement that Q01–Q572 or D01/D02 are fully implemented.

## Implemented and verified

| Workstream | Actual delivered behavior | Evidence |
|---|---|---|
| CAD-style application shell | Full-viewport engineering studio, compact title/menu/ribbon, no document scrolling in studio, scene-first layout | Desktop and mobile Playwright screenshots |
| Tool/menu infrastructure | File/View/Tools/Navigate menus, searchable `Cmd/Ctrl+K` palette, mouse and keyboard tool selection | Chromium studio smoke |
| Workspace modes | Inspection, Simulation, Analysis and Learning mode selection, with advanced controls dock | Toolbar interaction; **not** fully differentiated/dockable window layouts |
| Local projects | Validated, versioned JSON project export/import, input restoration, recovery after reload, safe rejection of invalid files | 7 unit tests, Playwright round-trip |
| Undo/redo | Bounded undo/redo of operating input changes | Manual code review; advanced view-history and cross-file undo **not** built |
| 3D inspection | One actual shader clipping plane with offset control; two picked world-space points with illustrative distance readout and markers | Section screenshot and Chromium interaction; not dimension-certified CAD |
| Instrument panel | Keyboard/pointer-resizable desktop telemetry dock with persisted width | Manual implementation; dedicated resize regression check pending |
| Responsive & themes | Full-width native-inspired shell; mobile priority ribbon; refined engine camera fit; purpose-built light/dark chrome and scene | Responsive 6-size smoke + light/mobile screenshots |
| Installable web app | Standalone PWA manifest, 192/512px icons; existing versioned service-worker offline shell | Production path build and offline Reference smoke |
| Source & requirements | Q201–Q572 approved A; detailed Q321–Q572 descriptions in main grill plus continuation | Document validation and decision archive |

### Reproduce

```bash
bun install --frozen-lockfile
bun run docs:check
bun run typecheck
bun run test
bun run build
bun run smoke
bun run smoke:visual
bun run smoke:studio
bun run smoke:production
```

Latest tests: **41 passing unit tests / 155 expectations**, TypeScript strict, Vite build, Chromium workspace interactions, project import/export/recovery, six viewport visual checks without horizontal overflow, production offline shell/Reference smoke.

## Not complete

- **D01**: Independently calibrated compressor/turbine operating maps and actual, source-validated N1/N2 RPM predictions are **not implemented**.
- **D02**: True fully coupled off-design nozzle/shaft/flow matching is **not implemented**; current effective-area and 3D geometry features are preliminary.
- Arbitrary drag docking, saved custom layouts, floating/undocked window layouts, resizable left and bottom docks are **not implemented**.
- Certified geometry, multi-plane section caps, true orthographic CAD precision, angle/snapping/constraint tools, full annotation persistence/export and measured geometry dimensions are **not implemented**.
- Full versioned project migration/automatic conflict resolution, indexed archives and rollback-safe offline package management are **not implemented**.
- The complete 15-chapter source-reviewed course, screen-reader certification and the full multi-browser performance/accessibility matrix are **not complete**.

The approved Q01–Q572 specification is a **target contract**. Unsupported capabilities must not be labeled ready or represented with fabricated values. Production publication of a visual preview does not imply scientific acceptance.

## Screenshot evidence

- [Desktop dark studio](native-workspace-preview/desktop.png)
- [Mobile studio](native-workspace-preview/mobile-final.png)
- [Desktop light theme and section plane](native-workspace-preview/desktop-light.png)

## Architecture and privacy notes

- React and Three.js remain client-side; source changes are isolated from the existing legacy solver.
- Local file imports validate schema, input domains and file size. Recovery uses same-origin browser storage; no account or remote project upload is introduced.
- Project data, telemetry and geometry derive from accepted bounded inputs, with separate view-only controls.
- All measured distances on unvalidated procedural geometry are labeled *illustrative*; physical RPM remains unavailable.
- PWA installation is optional. Storage and offline behavior depend on browser support.
- No GitHub Pages deployment is implicit in merely running the code; production publishing requires the release command.

## Future completion order

1. Complete source-backed off-design matching and nozzle conservation gates D01/D02 with independent evidence.
2. Implement verified, precise CAD tools, saved docking and project schema migrations with comprehensive testing.
3. Finish course modules and accessible technical equivalents.
4. Complete cross-browser, security/privacy, performance and full acceptance matrix before a scientific production claim.

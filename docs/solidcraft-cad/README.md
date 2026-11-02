# SolidCraft CAD — Full-Engine Integration

**Implementation:** 2026-11-02. This document supersedes the first focused-component-only integration. The default full-engine scenes of all five engine architectures now use SolidCraft-originated component geometry, and focused views reuse the same CAD assets.

## Assembly coverage

| Original SolidCraft design | Categories in assembled scene | Geometry |
|---|---|---|
| `rotor-stage` | fan, axial compressor and turbine | Lofted and patterned 24-blade rotor, hub, disk, seals and fasteners |
| `combustor-manifold` | burner | Annular fuel manifold, 12 injectors, collars and atomizer tips |
| `planetary-reducer` | gearbox | Four planetary wheels, teeth, carrier, sun gear and annular housing |
| `intake-duct` | inlet | Cutaway converging annular intake housing and flanges |
| `bypass-lattice` | bypass | Longitudinal supports and annular structural frames |
| `nozzle-housing` | nozzle | Cutaway converging support housing |
| `radial-impeller` | impeller | Centrifugal disk with patterned radial vanes |
| `radial-diffuser` | diffuser | Diffuser shroud with stationary guide vanes |
| `afterburner-assembly` | afterburner | Annular flameholders, spray bars and injector tips |

All nine B-rep designs were generated with **SolidCraft CLI**, each retained as a reproducible `.json` command timeline and editable `.sc` model in `assets/solidcraft/`. Blender only converts the exported OBJ files into efficient web `.glb` meshes with shared materials; originals remain independently editable.

All **11 component categories** across the five engine configurations now have a SolidCraft CAD source. A given design family is scaled across configurations according to the illustration's part hierarchy and is not a real engine's measured geometry. Multiple stages use the same rotor family; specific rotor airfoils and turbine cooling features are **not** independently modeled or validated.

## Viewer integration

- The *assembled* view loads the CAD mesh for each part by default. The selected component is independently pickable through its enclosing part group.
- The five-stage journey focuses the **same CAD geometry**; **Show full engine** returns to the assembled model.
- Three.js caches each distinct GLB per session. Each scene placement clones the loaded scene while sharing geometry/material resources.
- Converter output batches original CAD bodies into about 1–4 web render meshes per source, greatly reducing the draw calls for repeated compressor stages.
- Fan, compressor, turbine and centrifugal impeller animate as grouped rotors (respecting reduced-motion). Dynamic core/bypass nozzle throat geometry, variable afterburner nozzle petals, afterburner flames, flow markers, optional casing and gearbox power-path demonstration remain procedural *interactive overlays* to preserve existing controls.
- While assets load, or on a failed request, the earlier procedural part remains visible as fallback; this is not the permanent assembled geometry.
- The separately selected **legacy CC0 reference mode** in the advanced studio remains an optional external visual-reference artifact, not the default integrated engine.

**Engineering limits:** All original SolidCraft CAD is illustrative, not production-certified, OEM-measured, CFD, aeroelastic analysis or material engineering. Design-point/physical RPM/nozzle model calibration remain independent scientific release gates.

## Reproduction

From the Jet Engine Lab project root:

```bash
bun run cad:generate       # solidcraft-cli -> nine .sc design files + OBJ intermediates -> nine .glb files
bun run build
bun run dev                # or preview on port 4173
bun run smoke:cad          # focus mode + mobile
bun run smoke:cad:full     # all five complete CAD scenes, real asset requests, screenshots
bun run previews:engines   # recapture and crop all five gallery images from assembled CAD scenes
```

`cad:generate` requires `solidcraft-cli` and Blender. Preview cropping requires Python Pillow. OBJ intermediates and SolidCraft backup files are ignored by Git; the source timelines, editable SolidCraft containers and GLBs are retained.

## Full-engine evidence

| Turbojet | High-bypass turbofan |
|:---:|:---:|
| ![CAD turbojet assembly](full-turbojet.png) | ![CAD high-bypass turbofan assembly](full-turbofan.png) |

| Afterburning turbofan | Centrifugal turbojet | Geared turbofan |
|:---:|:---:|:---:|
| ![CAD afterburning turbofan](full-afterburning-turbofan.png) | ![CAD centrifugal turbojet](full-centrifugal-turbojet.png) | ![CAD geared turbofan](full-geared-turbofan.png) |

## Detail evidence

| Rotor | Annular manifold | Reduction gearbox |
|:---:|:---:|:---:|
| ![SolidCraft rotor focus](compressor.png) | ![SolidCraft combustor focus](combustor.png) | ![SolidCraft gearbox focus](gearbox.png) |

![Mobile CAD focus](mobile.png)

The Playwright `smoke:cad:full` verifies real HTTP 200 requests for the required source GLBs on each of the five engines and saves full-scene screenshots. The focused `smoke:cad` covers CAD isolation and return navigation on desktop and a 390px mobile viewport. Project unit tests, TypeScript and production build must also pass before a release.

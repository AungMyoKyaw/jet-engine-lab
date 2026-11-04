# ASSET_PROVENANCE.md — Free 3D Assets, Rights and Production Pipeline

**Status:** Active source/asset provenance and admission policy. An original SolidCraft-only 3D mechanical viewer uses a CC0 Poly Haven HDRI for studio lighting. Pinned Apache-2.0 pyCycle map tables are also present. Numerically validated engine calibration remains pending.

## Original SolidCraft component models — integrated 2026-11-02

Twenty-four original CAD designs were authored for Jet Engine Lab using SolidCraft CLI (B-rep sketches, lofts, primitives, booleans and circular patterns): `rotor-stage`, `planetary-reducer`, `combustor-manifold`, `intake-duct`, `bypass-lattice`, `nozzle-housing`, `radial-impeller`, `radial-diffuser`, `afterburner-assembly`, `fan-blisk`, `compressor-cassette`, `turbine-wheel`, `turbine-shroud`, `stator-vane-ring`, `combustor-liner`, `nozzle-actuators`, `fan-outlet-guides`, `compressor-case-detail`, `turbine-nozzle-guide`, `bearing-cartridge`, `combustor-dome`, `nozzle-petals`, `shaft-single-spool` and `shaft-dual-spool`. Each design has an editable `.sc` file and replayable `.json` command timeline in `assets/solidcraft/`. These are **not downloaded or adapted third-party engine models**. Blender converts the SolidCraft-exported geometry to batched web GLBs in `public/assets/solidcraft/`; material colors are original artwork. All five assembled engines and focused parts use these CAD assets. No OEM dimensions, sensor-calibrated digital-twin status or aerospace certification are claimed. See `docs/solidcraft-cad/README.md` for exact sources, conversion commands and verification evidence. The third-party HDRI has its own source and license.

## Admission policy
Asset must be free of acquisition and ongoing licensing cost, technically usable for this site, suitable for mechanical adaptation, self-hostable on public GitHub Pages, and legally redistributable as shipped (including binary derivative source distribution in a public repository). Accept an asset only with **documented affirmative evidence** of right to download, adapt/transform, redistribute and display publicly. A site's visible 'free' label, unauthenticated 3D preview or download button is not sufficient evidence.

Prefer CC0 and properly attributed CC BY 4.0 where their original license evidence is verifiable and provenance is reliable. Other licenses require individual compatibility review. Exclude NC-only where future portfolio/commercial use is not clearly allowed and ND for adapted mesh derivatives; do not imply all CC model formats have the same license. CC BY-SA may impose separate ShareAlike obligations on derivatives; evaluate before acceptance. Carefully distinguish source code's MIT license from each independent 3D model license; never blanket-license unrelated assets as MIT. Do not add restrictions in conflict with Creative Commons terms. Preserve creator/modification credits. License rights may be separate for geometry, textures, decals, environment maps and fonts.

### Verified legal references for policy
- CC BY 4.0 allows sharing/adapting, requires credit/license/modification indication: https://creativecommons.org/licenses/by/4.0/deed.en
- CC BY 4.0 license text: https://creativecommons.org/licenses/by/4.0/legalcode
- CC BY-SA 4.0 requires ShareAlike for adapted material: https://creativecommons.org/licenses/by-sa/4.0/deed.en
- Khronos glTF 2.0 extension list: https://github.com/KhronosGroup/glTF/blob/main/extensions/README.md
- Khronos BasisU texture extension: https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_texture_basisu/README.md

## Source candidate queue (NOT accepted assets)
| Candidate source | Requested use | Status / reason |
|---|---|---|
| https://www.innerscene.com/tools/library/3d-parts/turbofan-quarter-cutaway-e0184203 | Generic turbofan reference, major structure | RESEARCH: verify actual rights, dimensions, hierarchy, missing rotor/stator/spool details |
| https://sketchfab.com/3d-models/jet-turbine-engine-a84d4f2efbbd4e13b475eebf2b4b225d | Jet-engine geometry reference | RESEARCH: independently confirm current licensing/derivative rights and engineering suitability |
| https://sketchfab.com/3d-models/turbine-turbofan-engine-jet-engine-74c6aceed86b4a41aaad3b93afc3e262 | Alternative turbofan component donor | RESEARCH: source/license and mechanical split unverified |
| https://polyhaven.com/ | HDRI / environment materials | RESEARCH: choose individual assets and confirm their current asset-level license and packaging |
| Self-authored geometry via Blender/TypeScript | Reference-informed missing assemblies | Planned; independently original meshes and materials |

No external model is marked APPROVED, and no project should assume those exact URLs will remain available. If source rights are ambiguous, use a licensed alternative or original geometry without inventing provenance. Existing `src/scene.js` procedural model is a project-owned starting reference; inspect original project's MIT and all vendored dependencies before reuse.

## Asset selection rubric (proposed)
Score 0–5 individually: **mechanical correctness** (weight 30%), **mesh separability & editability** (25%), **visual quality** (20%), **performance/LOD suitability** (15%), **source evidence and attribution clarity** (10%). Copyright/license compliance is a **hard gate**, not weighted. Engineering suitability for the relevant turbojet or turbofan is also a hard gate. Record score, notes, reviewer and date. A photoreal but unsplittable model that invents the wrong spool layout fails.

## Machine-readable registry contract (planned artifact during implementation)
Use versioned `assets/manifest.json` (or YAML) in the project. Each artifact record includes:
`assetId, displayName, creator, creatorURL, assetPageURL, downloadURL, retrievedAtUTC, licenseId, licenseURL, licenseTextSnapshot, licenseEvidencePath, allowsModification, allowsPublicRedistribution, attributionText, originalFileSHA256, sourceFormat, sourceSizeBytes, sourceScaleUnit, importAxis, currentTransform, derivedFilePaths, derivedSHA256, nodeMappings, dependencies, triangleCount, materials, textureFormats, decodedGPUBytes, LODLevels, optimizationRecipe, modifications, QAStatus, licenseApprovalStatus, reviewedBy, reviewDate`.

Where attribution or license status cannot be proved, `licenseApprovalStatus=blocked` and the asset must not enter release. Preserve provenance evidence within rights-compatible documentation; do not store secrets, personal account tokens, private account screenshots or access credentials in this public repo. Asset source snapshots are evidence, not redistribution rights. Asset-level CC license and adaptation notices must remain with derivatives.

## Production pipeline stages
1. **Discover:** source candidate, available original mesh and usable license terms. Verify download accessibility and whether it is actually free, note file format and authored coordinate system.
2. **Quarantine/review:** scan file metadata, topology and obvious issue sources; inspect major assembly grouping, absent stators/spools, normals, UVs, texture rights and mesh complexity before import into public project.
3. **Engineer:** map geometry to `ENGINE_ASSEMBLIES.md` hierarchy and physical coordinate frame; reconstruct necessary internal geometry in Blender via reproducible scripts, split independent shaft groups, correct scales/normals/pivots, keep authored derivation notes.
4. **Optimize:** compare candidate `meshopt` vs Draco for load speed, size and visual degradation; evaluate KTX2/BasisU for textures with tested R3F/Three decoders, appropriate mipmaps. Package GLB variants at multiple LODs, preserving semantic part IDs and camera focus points.
5. **Validate:** glTF compliance, extension compatibility, load failure fallback, bounds and pivot identity, exploded assembly noninterference, visually checked closeups, decoded GPU budget, cold-cache and warm-cache load measures.
6. **Ship:** commit only licensed, validated distribution assets and permitted source files; credits page, license manifest, integrity manifest and build-time CI gate. Cache only assets known by version/hash.

## Budget/profiles (proposed, not yet measured)
Treat performance as **measurement-driven** rather than blindly assuming size equals runtime cost. Candidate target: interactive first meaningful controls within ~3s on good desktop connection with shell/cache; 3D proxy before full detailed render; surface GPU and memory-pressure diagnostics. Define size ceilings after asset pilot using one representative desktop and mobile browser; if required mesh detail is too expensive, implement progressive LOD and mobile fallback rather than flattening mechanical detail. An external asset HTTP response should not be required after successful offline cache warm-up.

## Public Credits and Licenses page
For every used asset: creator / exact work title / direct origin URL / license identifier and URL / modification summary / link to appropriate project asset or source notices. Distinguish third-party asset license from MIT source code. Credit open references used for factual teaching separately. Preserve acknowledgments for Three.js and other vendor packages according to their licenses. Include date accessed when an external link could later change.

## Blocking release conditions
- Any production 3D file, environmental HDR, font or bundled texture lacking verified affirmative redistribution and modification rights.
- Any accepted model with wrong engine architecture/shaft grouping that is not repaired and documented.
- Missing SHA-256, required license notice, creator/URL, unrecorded derivative modifications, untested decoder extension or unreadable viewport.
- Asset manifest and public Credits page out of sync, or public source LICENSE incorrectly claiming ownership of third-party assets.

## Current inventory
At 2026-11-01 planning time: **0 approved new downloaded 3D assets, 0 verified transformed derivatives, 0 verified LOD exports**. This document supplies release admission criteria, not evidence of asset audit completion.

## Scientific map-data provenance — mandatory for D01=B

In addition to visual assets, raw compressor and turbine performance maps require source identity, license and redistributability, SHA-256, map axes/units (corrected speed/flow, pressure ratio, efficiency, speed-line/R-line), design point and scaling, validity envelope, interpolation policy, independent reference runs and calibrated RPM source. NASA T-MATS (https://github.com/nasa/T-MATS) and OpenMDAO pyCycle (https://github.com/OpenMDAO/pyCycle) are public **candidates**, not accepted and validated map datasets. Different authorship/licensing for data and framework source must be tracked separately. Do not assume NASA C-MAPSS40k is free to redistribute; NASA's software catalog lists restricted release: https://software.nasa.gov/software/LEW-18624-1 . No model-predicted RPM can pass QA before the map validation tier passes in `OFF_DESIGN_MAPS_AND_NOZZLES.md`.

**Nozzle geometry source gate:** selected free 3D engine models must admit independently deformable core/bypass throat surfaces with robust part IDs, clearance and selected area mapping at all LODs, or approved original replacement geometry must be authored. Record procedural geometry script, effective/geometric area formula and hashes as derivatives. Unmodified static nozzle donor meshes do not satisfy D02.

## Implemented, checked asset: studio lighting probe (2026-11-01)

- **Asset:** Studio Small 08, 1K Radiance HDR, authored by Sergej Majboroda; source https://polyhaven.com/a/studio_small_08 ; direct origin https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_08_1k.hdr .
- **License:** CC0 as explicitly stated on its source page; modification, public redistribution and commercial reuse permitted; attribution not legally required but retained here and on Credits.
- **Installed:** `public/assets/studio_small_08_1k.hdr` (~2.1 MB). SHA-256 `f6a989f89432eb4eee3191364a9c1ceed195c4ec3544173a3c04fd96cb91d0ba`. Used only as the scene reflection/environment source; not as background photograph.
- **Fonts:** IBM Plex Sans/Mono via `@fontsource` npm packages, self-hosted at Vite build time. Their SIL OFL notices must be included in the deployed third-party licenses manifest.
- **Engine 3D meshes:** the engine assemblies use 24 original SolidCraft CAD families, including two coaxial-drive-shaft variants (introduced November 2–5). Procedural visualization is limited to light, power-path and airflow effects; missing CAD produces a visible error.

## Removed legacy CC0 3D reference mesh (historical record, 2026-11-01)

- **Asset title:** Turbofan quarter cutaway, Innerscene original model; source: https://www.innerscene.com/tools/library/3d-parts/turbofan-quarter-cutaway-e0184203 ; direct GLB retrieved via https://www.innerscene.com/api/library/turbofan-quarter-cutaway-e0184203/download .
- **Right-to-use evidence:** source page explicitly states public domain CC0, free to modify/rehost/redistribute and commercial use; **glTF binary embedded asset.copyright also explicitly states authored by Innerscene Corp, dedicated to CC0 1.0 Universal**. Source model has no external glTF extensions.
- **Former installation:** `public/assets/turbofan-cutaway-instudy.glb` (3,512,616 bytes); SHA-256 `65ce366afd7fd46f254fef43363f7d4cd39b2cc75899e59c3933fc1dcbe02f88`. Removed from the site and repository on 2026-11-05. This remains a historical provenance note, not a runtime dependency.
- **Former integration:** loaded through `ReferenceCutaway.tsx` only when selecting the legacy reference mode. The component was deleted; the current viewer offers only original SolidCraft engine hardware.
- **Known omissions:** stators, independent concentric HP/LP spools, bearings, mounts, fuel plumbing, variable-geometry nozzle and several structural supports. For those reasons the optional CC0 reference model is **not admitted as a mechanically complete model for Q42/D01/D02**; default viewer assemblies use the separate SolidCraft component families documented above. Attribution included voluntarily despite CC0 status.
- **Performance note:** deleting the optional GLB removes the old ~3.5 MB file from the published asset set. The SolidCraft assemblies remain scientifically illustrative only.

## Additional original 3D gallery previews — refreshed 2026-11-04

The five PNG files under `public/assets/engine-previews/` are cropped Playwright screenshots of the assembled **original SolidCraft CAD components** in this repository's Three.js scenes. `scripts/smoke-solidcraft-full.mjs` captures both complete interface evidence (`full-*.png`) and clean, interface-free machine views (`gallery-*.png`); `scripts/crop-engine-previews.py` derives the gallery previews from the latter. The images introduce no additional third-party model license, stock photography, remote image host or S3 dependency. Existing environment HDRI and font license notices above still apply. The assemblies remain educational illustrations, not OEM-measured digital twins.

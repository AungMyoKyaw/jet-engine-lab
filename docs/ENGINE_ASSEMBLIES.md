# ENGINE_ASSEMBLIES.md — Mechanical Scene and Bill of Materials

**Status:** Authoring-ready assembly specification, derived from Q36–Q46, Q121–Q140. Reference-specific dimensions, actual mesh sources and camera transforms remain pending measured asset selection. An optional CC0 cutaway model has been imported as an explicitly visual-only reference; source-verified mechanically complete models, calibration and dimensioned assembly QA remain pending.

## Common mechanical coordinate contract
Right-handed local coordinates: **+X** points inlet → exhaust, **+Y** upward, **+Z** viewer-right by engineering convention; all positions in SI meters, angles in radians, shaft rotation around +X with signed direction defined per engine. Scene up vector +Y; normalize each imported asset's axes and units offline; never adapt its source transform invisibly at runtime. Part ID stable across LODs. `engine/assembly/subassembly/part` is the unique semantic path. Mesh names are not identities. Material IDs are independent of material appearance.

Define typed `AssemblyNode` conceptual fields: `id, parentId, engine, role, geometryAsset, boundsMeters, pivot, restTransform, explodeVector, explodeOrder, selectable, occlusionGroup, rotatorShaft, flowBranch, stationLinks, lessonLinks, caption, citationRefs, sourceAssetId`. Every selected part must resolve to one description and must be available in the accessible 2D tree.

**Geometry fidelity hierarchy:** (1) mechanically correct architecture, airflow paths and shaft affiliations; (2) readable inspectable components, plausible clearance and blade profiles; (3) finish materials/high-detail fasteners. Do not trade tier 1 for tier 3.

## TJ-1 generic single-spool turbojet
| Stable group | Principal visible / selectable components | Shaft / flow coupling | Technical check |
|---|---|---|---|
| `tj/inlet` | Intake lip, diffuser duct, spinner, optional inlet guides | Inlet air -> 2 | Continuous duct and realistic annulus |
| `tj/compressor` | Staged axial rotor rows, stators, hubs and casing | One common spool, 2 -> 3 | Rotors rotate together, stators fixed; no bypass |
| `tj/combustor` | Diffuser, annular combustor outer/inner liner, representative fuel injectors, flame visualization | Core fuel mixing, 3 -> 4 | Clearly distinguish air/gas path from metal |
| `tj/turbine` | Nozzle guide vanes, rotor blade rows, disks and turbine case | Same spool drives compressor, 4 -> 5 | No independent speed or HP/LP split |
| `tj/shaft` | Continuous shared shaft, hubs, bearings and support frames | TJ single spool | No shaft intersections with static structures |
| `tj/nozzle` | Exit duct, convergent nozzle, nozzle lips | Hot core stream, 5 -> 8 | Appropriate nozzle section geometry |
| `tj/casing` | Separate removable outer panels, internal half-cutaway and support rings | Static exterior | Shell may ghost/hide without removing internal geometry |

The incumbent `src/scene.js` has a five-stage procedural model and a shared shaft; it is a **reference only**, not a model to be mechanically misrepresented as the new two-spool turbofan. Preserve useful source explanations as evidence but rebuild visualization under the new model schema.

## TF-2 two-spool high-bypass turbofan
| Stable group | Principal visible / selectable components | Shaft / flow coupling | Technical check |
|---|---|---|---|
| `tf/inlet` | Nacelle intake lip, spinner, bifurcation geometry | Inlet -> 2 | Both core and bypass receive inlet air |
| `tf/fan` | Fan rotor disk and blades, optional fan stators, fan hub and case | LP spool drives fan (core + bypass), 2 -> 13/21 | Fan not accidentally assigned to HP spool |
| `tf/bypass` | Annular bypass duct, structural outlet guide vanes, distinct bypass nozzle | Bypass 13 -> 18 | Core and bypass visibly separated throughout |
| `tf/lpc` | Booster/LPC rotor and stator rows, casing | LP spool, core 21 -> 25 | Physically downstream of fan |
| `tf/hpc` | HPC multi-row rotor/stator, case and core duct | HP spool, core 25 -> 3 | Appropriate radial compression/taper |
| `tf/combustor` | Core diffuser, annular liner, fuel system indications | Core fuel mixing, 3 -> 4 | No fuel combustion in bypass duct |
| `tf/hpt` | HP nozzle guides, rotors, case | HP turbine powers HPC, 4 -> 45 | Distinct HP shaft continuity |
| `tf/lpt` | LP nozzle guides, larger staged rotors, case | LP turbine powers fan/LPC, 45 -> 5 | LP shaft mechanically distinct/coaxial |
| `tf/shafts` | Coaxial HP and LP shafts, representative bearings, supports, clearance rings | Independent normalized speed groups | No accidental shaft intersections or swapped rotating groups |
| `tf/core-nozzle` | Core convergent nozzle, exit lip, aft cone | Hot core 5 -> 8 | Separate from bypass exit and pressure term |
| `tf/nacelle` | Upper/lower external cases, removable panels, pylons only if justified | Static shell | Shell reveal/recompose without tearing duct topology |

## Mechanical modeling details
1. Axial blade rows: define blade count, radial envelope, twist/camber conventions, hub/tip radius and spacing per stage. Values are from model-specific dimensional reference or marked **artistically inferred**. Distinguish visualized blade shape from computational compressor/turbine aerodynamics.
2. Annular combustor: physically continuous hot-core path, liner shell thickness, injector representation, temperature visuals that do not imply high-resolution reacting flow.
3. Support/bearing location: geometric interference test and anchored reference; illustrative non-serviceable details labeled. Show realistic shaft concentricity and separation.
4. Compressor/turbine section cuts: capped geometry where physically plausible; don't render false structural caps blocking airflow. Prevent clipping-plane intersections from producing exploded fragments or holes that look like a manufacturing defect.
5. LOD: preserve exact anchor, semantic part IDs and pivot across all versions. No loss of selectable assembly semantics in mobile/proxy LOD. Exports under documented GLB coordinate transform, validate normals/UV/tangents and bounds.
6. Scale: each engine's reference lengths/radii and stage proportions must be explicitly documented after asset selection. **Not selected yet**, so no physical dimensions, RPM or blade counts here are claimed as verified. Render measurement callouts only after scale verification.

## Three-dimensional interaction contract
- **Default:** yawed 3/4 upper-side cutaway showing sufficient internals with clear flow direction. Frame full asset plus 5–10% breathing room on initial viewport. Camera near/far planes based on verified bounds, not arbitrary imported asset scale.
- **Selection:** hierarchy-first picking through raycast from mesh -> semantic part ID; hover highlight with reduced saturation; click focus uses conservative orbit target and camera travel. Selecting 'fan rotor' reports LP shaft, links to station 2/13/21 and its learning module. Role-based consistent color accents.
- **Explosion:** per-node local explode vector, hierarchy transform composition and order so parent motion does not double-separate children. Staged axial groups plus offset for annular shell sections; slider parameter `u∈[0,1]` with presets 0/0.5/1 (values proposed); never allow unbounded movement. Validate minimum separation envelopes and camera focus throughout. Return to exact rest transforms at u=0.
- **Clipping:** axial/radial plane constraints, optional local cap/stencil where supported; precision and performance acceptance in verification doc. No geometry slicing operation should destroy the source mesh.
- **Camera presets:** 3/4 cutaway, external, front/axial, side-orthographic, top, selected part, section view, exploded overview. Store author-defined camera state in normalized engine bounding-box units then resolve to actual world coordinates after asset selection.
- **Rotors:** assign `TJ` all rotors to TJ shaft; `TF` fan/LPC/LPT to LP group, HPC/HPT to HP group; stators never rotate. Visual angular velocity is bounded and frame-rate-independent; **numerical RPM must come from the independently validated map-based off-design solver**. Failing/unavailable solver result should freeze or label motion illustration, not animate as if validated.
- **Flow:** sample station-based trajectories with core/bypass channel differentiation and speed/temperature legend. Keep particle effects behind readability; reduced-motion converts moving traces to static arrows. Flow rates/temperature are sourced from last valid solver result. No false CFD field.
- **Tour events:** `focusCamera`, `setClip`, `selectPart`, `setExplode`, `showStation`, `caption`, `pauseForQuestion`, `resume` as a serializable narrative sequence; preserve manual interruption.

## Proposed camera/input map
Mouse drag orbit, mouse wheel zoom when canvas active, click select, right drag pan only where discoverable. Touch one-finger orbit, pinch zoom and two-finger pan; key tab navigation among assembly tree and toolbar, arrows for focused part tree, Escape to leave isolated view, Home/reset camera, plus/minus bounded zoom, `?` show shortcuts. Do not hijack typing in numeric fields.

## Mechanical and numerical cross-verification
- Machine-readable scene graph defines `shaftId`, `stationIn`, `stationOut`, `branchId` on each assembly. Solver manifest uses same stable names and rejects missing/unexpected station connections at build/test time.
- At zero explosion, verify all parts return to original transform (within Float32 graphics tolerance). At full explosion and relevant camera positions, verify panels, nozzles, fan and shafts remain visually identifiable.
- Confirm noninterference of major moving/stationary parts, no inverted faces, z-fighting, missing normals, transparent sort artifacts or camera clipping at all LODs.
- Every inspectable part: source license verified, 3D visual present, accessible 2D description present, related station and course link present or explicitly N/A.

## Asset implementation and evidence
Potential third-party engines are **candidates only** pending license and actual scene analysis. Prefer mechanically semantically correct components, not one pretty but unsplittable mesh. Asset criteria and pipeline in `ASSET_PROVENANCE.md`. No external model should be downloaded into the public repository until provenance and redistribution clearance passes.

## Approved mechanical contract — D01=B and D02=B

**Map-speed coupling:** Each rotating component ID binds to a solver shaft ID and a validated, calibrated **model-predicted absolute speed** in RPM. TJ: shared compressor/turbine shaft; TF: fan/LPC/LPT LP (N1) and HPC/HPT HP (N2). Keep camera/animation rate bounded to avoid sampling aliasing but never mislabel it as physical RPM. If source map validation is absent, the numerical speed control/status is blocked, not silently substituted with an arbitrary normalized indicator.

**Parametric nozzle geometry:** TJ core nozzle has explicit `A8_eff` -> `A8_geom` throat relationship; TF core and bypass nozzles independently accept `A8_eff` / `A18_eff` and model appropriate `Cd`. Author replaceable deformable wall/ring sections, not a rigid decorative GLB scaled as one object. Keep centerbody, nozzle support, shell and turbine/exhaust attachment mechanically plausible across all allowed actuation positions. For an annular circular throat measure `A_geom = π(r_outer²-r_inner²)`; geometric exit area separately if not a convergent nozzle throat. Map the solver's **accepted** area snapshot into mesh deformation and 2D measurement overlay with exact shared result ID. Nozzle inputs violating physical travel, area limits, clearance or solver map domain are rejected with previous geometry retained.

**Asset acceptance extension:** Imported models with noneditable nozzle lips or inseparable core/bypass exhaust must be rebuilt or rejected for D02. Component map datasets are **non-visual scientific assets** with their own provenance, source rights, hashes, units, calibration and validation gates. Mechanical quality checks must test full travel, normals/caps, ring clearance, scene picking and LOD correspondence for nozzle area states.

See `docs/OFF_DESIGN_MAPS_AND_NOZZLES.md`. Prior statements treating spool speeds as exclusively illustrative are superseded by this locked contract.

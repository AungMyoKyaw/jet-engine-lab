# SolidCraft assembly realism upgrade — November 5, 2026

The user approved the previously presented realism questionnaire defaults R001–R036=A and explicitly authorized implementation, source control publication and updating GitHub Pages. The existing Q01–Q572 and D01=B/D02=B decisions remain the design authority. This record documents the implemented scope and observable verification, without reconstructing the unavailable question text.

## Assembly decisions

- The integrated full-engine model is the sole mechanical geometry source for each learning stage. Focused stage inspection reuses its SolidCraft components in the same assembly coordinate frame; no alternative or fallback mechanical meshes are loaded.
- Six additional SolidCraft CLI component families enhance existing parts: fan blade-root retention, compressor variable-stator linkage, turbine thermal service ports, nozzle hinge hardware, afterburner flameholder details and centrifugal diffuser instrumentation.
- These six details are separate stationary supplemental meshes; the original fan, compressor and turbine rotors retain their individual rotation. The fixed nozzle hinge ring remains independent of the deformable nozzle petal geometry.
- Three further SolidCraft families add removable cutaway nacelle panels with access door hardware, bypass structural attachments and inlet lip / anti-icing hardware. Nacelle panels appear on demand when casing is enabled; the exposed core remains inspectable when casing is hidden.
- Export the complete 40-family set with a coherent physically based metal palette, retaining the original SolidCraft `.sc` and JSON timelines. Blender only batches meshes and applies materials; the geometry is authored by SolidCraft.
- Use live browser renders from the exact assembled GLBs as the gallery source; maintain desktop/mobile focus inspection and all 25 learning stages.

## Limits and release evidence

The additional parts are representative educational geometry. Neither the shape dimensions nor the turbine materials, nozzle kinematics or cycle response are calibrated against a measured engine. A physically validated digital twin would require OEM or measured geometry, calibrated pressure/temperature/flow/spool data and independent aero-thermomechanical validation. These prerequisites cannot be established by visual CAD improvement alone.

Verification is performed using the project unit tests, geometry validation, production build, assembled GLB asset requests, focus/learning-stage synchronization, casing on/off behavior and actual browser screenshots. Publication requires a clean production verification after deployment. The outputs are stored in the existing `docs/solidcraft-cad/` gallery and the release commit.

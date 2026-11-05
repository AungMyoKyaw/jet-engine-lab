# Digital twin evidence and scientific release gates

**Audit date:** 2026-11-05
**Release status:** Educational CAD and numerically self-consistent simplified cycles. **Physical digital twin validation: not established.**

## Evidence boundary

The repository contains original, mechanically expressive SolidCraft designs. They are **not dimensionally traced to a measured aircraft engine**. The gas-path solver has an approximate dry atmosphere, assumed efficiencies, temperature-dependent approximate heat capacity, convergent nozzle capacity, and coupled turbojet or two-spool turbofan **work** balances. This is a useful simulation of an idealized hypothetical engine. It is **not** an independently verified prediction for a specific manufactured engine.

`bun run physics:validate` produces [`physics-numerical-audit.json`](physics-numerical-audit.json), checking algebraic conservation of momentum-force decomposition, fuel and air mass flow, modeled shaft work, effective/geometric nozzle area, nozzle Mach state and static backpressure across a bounded set of cases. These checks are **internal numerical consistency checks**, not independent experimental validation. Infeasible boundary conditions are recorded, not silently extrapolated. Reference numerical cases are *model-generated*, not measured. No validation report may label them experimental or OEM data.

`bun run cad:validate` produces [`nozzle-geometry-audit.json`](nozzle-geometry-audit.json), independently reading the exported binary SolidCraft GLB positions and reproducing the visible petal-tip/lip aperture transforms in 12 core and five bypass cases. It checks nominal mesh dimensions, throat area, petal-tip alignment and bypass exit fairing clearance. It is **bounded hypothetical-CAD geometry verification**, not a surveyed engine, a complete actuator collision analysis, or a measured discharge coefficient.

## Acceptance gates and required primary evidence

| Gate | Concrete acceptance evidence | Current state |
| --- | --- | --- |
| G-01: Original 3D CAD | Source `.sc` and exported meshes for all five assemblies; test every asset request with no alternate mesh | Implemented; visual inspection and dimensional metrology are separate |
| G-02: Geometric fidelity | Engine identity and revision; native units; scale traceability; measurement certificates/drawings of inlet, annulus, ducts, nozzle, shafts, blade row dimensions and clearances; CAD-vs-source deviation report | **Blocked: no surveyed geometry** |
| G-03: Working-line data | Identified core/fan/turbine maps with reference corrected speed, corrected flow, PR, efficiency, surge domain, design-point scale factors, units, licensing and verifiable original source | Five pyCycle tables imported, **not calibrated to a specific engine** |
| G-04: RPM and performance | Absolute design LP/HP RPM reference with inlet conditions; 3+ independent off-design points per engine with uncertainty, measured fuel flow, thrust, pressures and spool speeds | **Blocked: no traceable operating observations** |
| G-05: Coupled off-design model | Rank-checked multi-component system of corrected mass flow, HP/LP shaft power, nozzle flow and compressor/turbine maps; numerical residuals and convergence/branch continuation | Approximate shaft/nozzle **work and flow** matching only; full maps not coupled |
| G-06: Parametric nozzle mesh | Validate rendered throat cross-section against `A_geom = A_eff / C_d`, preserve centerbody/casing bounds, independent core/bypass actuators, test at multiple areas and view resolutions | **Partial:** valid solver snapshots set original SolidCraft core/bypass aperture meshes; GLB vertex audit passes 17 cases. Full assembly collision, LOD/view-resolution checks and physical dimensional validation remain open |
| G-07: Independent verification | Reproduce a cited external cycle and engine benchmark at design + 3+ off-design points; error bars, documented tolerances, independent implementation review | Internal invariants pass; **external benchmark absent** |
| G-08: Application QA | Tests, static build, all original CAD loads, desktop/mobile screenshot inspection, production navigation and deployment verification | Verify with release commands; does not substitute for G-02–G-07 |

## Required calibration input format

To complete the scientific gates, obtain a permitted reference data package for **one explicitly named engine configuration** (or clearly identified open, non-OEM reference engine). Each measured row must provide the operating condition (`altitude_m`, `mach`, ambient `T_K`, `P_Pa`); nozzle effective and surveyed geometric throat areas (`m2`, with discharge coefficient/uncertainty); component pressure ratios, corrected-flow values and map definitions; observed shaft RPM; thrust and fuel mass flow with instrument accuracy; engine serial/revision/reference information and measurement method. At least one design and three independent off-design points are needed, preferably with holdout data. Measurement conditions must be sufficient to distinguish HP and LP roots; compare within tolerances set **before** tuning the model.

For geometry, supply native CAD or engineering drawings/scan with datum coordinate frame, dimensions, calibration instrument resolution, materials and thermal state (cold or hot). Scaling arbitrary meshes to match hypothetical numerical square-metre nozzle areas would create *false precision*; do not do that. Physical RPM is deliberately returned as `null` until source calibration and off-design matching are complete.

## Exact current solver contract

- **Effective nozzle area** is a user input in m²; **geometric throat area** is the computed `A_eff / 0.97`, assuming a convergent nozzle. Original SolidCraft throat mesh vertices are checked against these **hypothetical** computed areas; neither the dimensions nor the assumed coefficient were measured from a real engine.
- **Convergent choking** is based on variable-heat-capacity sonic energy balance; for a choked flow the exit is the throat and reaches Mach 1. Unchoked exit expands to ambient static pressure.
- **Turbojet shaft** is constrained by assumed compressor demand and mechanical/turbine efficiency; mass flow follows nozzle capacity.
- **Turbofan LP work** is root-matched against actual nozzle-derived core/bypass mass flows, with HP compressor work balanced by HPT work; multiple mathematical roots are possible. The selected branch uses proximity to a *reference bypass ratio*, not a validated stability criterion or engine-specific map.
- **3D nozzle petal animation** for the turbojet and turbofan now follows the last accepted solver's computed square-metre geometric throat area, with independently tested lip/petal-tip alignment. It does not represent a measured or physically validated real-engine throat. Visual-only engines' nozzle animations remain illustrative.
- **Rotor animation** is slowed for demonstration and has no real-world RPM relationship.

## Reproduction

```sh
bun run physics:validate
bun run cad:validate
bun run test
bun run typecheck
bun run build
```

The generated JSON includes all accepted and rejected numerical cases, exact numerical outputs and gates. It cannot be used as an OEM acceptance certificate. Scientific acceptance is **blocked until the independent physical evidence above exists**, even when every software check passes.

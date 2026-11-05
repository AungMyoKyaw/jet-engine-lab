# Engineering model — current application

## Additional 3D-only architecture studies (2026-11-01)

The public interface now offers five interactive architectural models. **Only the original turbojet and high-bypass turbofan are inputs to the numerical 0D cycle described below.** Afterburning turbofan, centrifugal turbojet and geared turbofan have independently authored SolidCraft-originated CAD assemblies and illustrative animations, **without numerical thrust/fuel-flow/RPM models**. Their 3D visuals and educational stage captions must not be treated as calibrated physical quantities. Details: [Five-Engine 3D Gallery](ENGINE_COLLECTION_RELEASE.md).


**Status:** Published educational preview. This document describes the **React/TypeScript implementation actually running on the site**, not the final solver specified by [PHYSICS_SPEC.md](PHYSICS_SPEC.md) or [OFF_DESIGN_MAPS_AND_NOZZLES.md](OFF_DESIGN_MAPS_AND_NOZZLES.md).

Jet Engine Lab currently supports a generic **single-spool turbojet** and a generic **two-spool, separate-flow high-bypass turbofan**. The scenes are educational assemblies, not dimension-verified production engines. The simplified steady-state model produces informative tendencies but does **not** supply calibrated off-design shaft RPM or an independently verified real-engine operating line.

## Sources of truth

| Responsibility | Current source |
|---|---|
| Numerical inputs, bounds, atmosphere and cycle | `src/app/physics/cycle.ts` |
| Worker request processing | `src/app/physics/worker.ts` |
| Reference component-map lookup | `src/app/physics/maps.ts` |
| Pinned Fan/LPC/HPC/HPT/LPT table data | `src/app/data/maps/*.json` |
| Model components, selection and shaft identity | `src/app/data/parts.ts` |
| 3D SolidCraft assembly and scene controls | `src/app/engine/EngineViewport.tsx` and `src/app/engine/SolidCraftDetail.tsx` |
| CAD source and reproducible conversion | `assets/solidcraft/` and `scripts/solidcraft-obj-to-glb.py` |
| Engine switching, controls, readouts and equations | `src/app/ui/App.tsx` |

The former `turbojetCycle()` in `src/physics.js` is **legacy code**, not the source of the current React telemetry. Its original detailed description is preserved in [ENGINEERING_LEGACY.md](ENGINEERING_LEGACY.md).

## Input envelope

Inputs are checked by `validate()` before `compute()`. The published UI has no unrestricted extrapolation:

| Input | Current allowed range | Notes |
|---|---|---|
| Throttle fraction | 0–1 | Maps to a provisional turbine-inlet-temperature schedule |
| Altitude | 0–12,000 m | Approximate dry ISA |
| Flight Mach | 0–0.85 | Subsonic only |
| Design compressor PR parameter | 4–24 | Not a solved compressor-map working point |
| Reference bypass ratio | 2–10 | Turbofan only; selects among mathematical LP balance roots, not a guaranteed solved ratio |
| Core effective nozzle area | 0.06–0.9 m² | Distinct from geometric throat area |
| Bypass effective nozzle area | 0.25–5 m² | Turbofan only |

**Initial teaching presets:** turbojet throttle 0.68 / Mach 0.20 / pressure ratio 13 / core area 0.28 m²; turbofan throttle 0.72 / Mach 0.28 / HPC PR parameter 9.2 / reference bypass ratio 5.2 / core area 0.20 m² / bypass area 0.80 m². These are model-feasible demonstration points, not matched-thrust or independently calibrated real-engine comparison points.

A rejected numerical input or infeasible operating point generates an error; the UI retains the last accepted result rather than reporting a fabricated new solution.

## Simplified thermodynamic implementation

### Atmosphere and total inlet conditions

The dry ISA approximation starts from `T₀ = 288.15 K` and `P₀ = 101325 Pa`. The code uses a standard lapse-rate troposphere to 11 km and an exponential isothermal layer above that to 12 km.

Freestream velocity is approximated with `V₀ = M·sqrt(1.4·R·T₀)`, `R = 287.05287 J/(kg·K)`; diffuser inlet total temperature uses the freestream kinetic-energy increment. A Mach-dependent inlet pressure-recovery factor, `0.99 − 0.02·M²`, then reduces the idealized inlet total pressure.

### Gas-property approximation

Specific heats are **temperature-dependent approximations**, not a verified gas-property database:

```text
cp_air(T) ≈ 1005 + 0.12 (T − 300)             J/(kg·K)
cp_hot(T) ≈ 1150 + 0.16 (T − 300)             J/(kg·K)
h(T) − h(300 K) = c0 (T − 300) + 0.5 b (T − 300)^2
```

The code integrates these curves analytically for enthalpy and uses bounded bisection to invert enthalpy and idealized entropy relationships. Mixing and composition changes are simplified.

### Turbojet core

- Stations: **0** freestream (static); **2** inlet; **3** compressor; **4** combustor/turbine entry; **5** turbine exit; **8** nozzle exit (static).
- Compressor actual enthalpy rise is calculated from a variable-`cp` isentropic target with a fixed assumed efficiency of **0.87**.
- The throttle sets `Tt4 = 1060 + 590·throttle K`. The burner has total-pressure ratio **0.95**, burner efficiency **0.99**, and a fuel lower heating value of **43 MJ/kg**.
- A single turbine extracts the estimated work required by the compressor. Turbine isentropic efficiency is assumed **0.89**, with **0.99** shaft/mechanical factor.
- Compressor mass flow is inferred from the **selected nozzle capacity**, not from measured compressor maps.

### Turbofan core and bypass

The educational turbofan adds separate assemblies for the **fan, LPC, HPC, combustor, HPT and LPT**, with separate core and bypass nozzles. Station identifiers include **13** (fan), **25** (LPC), **3** (HPC), **4** (combustor), **45** (HPT), **5** (LPT), **8** (core exit) and **18** (bypass exit).

The fan and LPC use fixed approximate pressure ratios (**1.58** and **1.7**). The HPC uses the user-selected pressure-ratio parameter. The HPT work balance drives the HPC. The LPT work and core-nozzle flow are solved simultaneously with the independent bypass nozzle capacity: each candidate LPT expansion produces a core mass flow and turbine power, and a bracketed root solve finds the core flow and LP work that match fan/LPC demand (including bypass fan work). The chosen mathematical root is the one nearest the user-selected *reference* bypass ratio. More than one root may exist; no stability or engine operating-line selection is yet verified.

**Important:** core/bypass mass flows and shaft work are closed together under the **assumed constant component pressure ratios/efficiencies**. They are **not** closed against validated coupled fan/compressor/turbine operating maps. The displayed actual bypass ratio can therefore differ from the reference bypass parameter. Actual N1 and N2 remain unavailable.

### Nozzle and thrust

Both engines solve an approximate convergent-nozzle choking threshold using variable-heat-capacity enthalpy, entropy and local sound speed. Choked throats enforce Mach 1 and a pressure above ambient; unchoked exits expand to ambient pressure and remain subsonic. An assumed discharge coefficient `Cd = 0.97` relates effective flow area to *modeled* geometric throat area:

```text
A_effective = Cd × A_geometric
F_net ≈ Σ(exhaust mass flow × jet velocity + pressure thrust) − inlet mass flow × V₀
```

For the turbofan the exhaust sum includes **both core and bypass** streams. Fuel is included in the core exhaust mass. TSFC is displayed only for positive net thrust with the applicable unit normalization.

The Experiment view exposes net thrust as momentum force plus pressure force, the relative shaft-work residual, modeled nozzle Mach and choke status, solved bypass ratio and any multiple LP work-balance roots. The internal shaft-work residual is small because the model explicitly solves it, **not** because its compressor/turbine assumptions match a physical engine.

The nozzle sliders change nozzle mass capacity and shaft-work solutions. Accepted solver results drive the original SolidCraft metering lips and petal vertices: the core circular bore and independent turbofan bypass annulus reproduce `A_geometric = A_effective / 0.97` within the tested cases. `bun run cad:validate` reads exported GLB vertex positions and independently checks lip/petal alignment and the nominal bypass fairing's exit clearance at 12 core and five bypass settings. This verifies a **hypothetical internal mesh model**, not an engine survey, full moving-component interference/thermal analysis or independent physical calibration. The solver does **not** yet provide a fully coupled **map-matched** off-design solution with calibrated shaft speeds and flow conservation against component characteristic maps. The scene's visible rotor animation is illustrative, not RPM telemetry.

## Public reference maps are not yet solver inputs

Five map files, pinned by original upstream commit and hash, are derived from [OpenMDAO pyCycle](https://github.com/OpenMDAO/pyCycle) under its Apache-2.0 license. `maps.ts` performs bounded bilinear lookup and rejects requests outside the source axes. The Reference UI exposes these data directly.

The current cycle solver does **not** invoke these maps. Map data alone cannot establish an absolute shaft RPM; independent source calibration, corrected speed/flow conventions, feasible working-line solving and external reference cases are required.

## Visual and accessibility scope

- Interactive React Three Fiber scenes load 32 original SolidCraft CAD design families, independently selected part IDs, cutaway casing and adjustable exploded view. They are **representative**, not OEM dimensioned drawings.
- The active engine viewer uses the original SolidCraft geometry throughout. Failed CAD assets surface an explicit error without substituting other geometry.
- A WebGL or CAD asset failure is surfaced explicitly to the user. The CAD viewer does not substitute alternative engine geometry.
- User-selected camera presets, reduced-motion handling and a responsive inspector support inspection; final accessibility and multi-browser acceptance is outstanding.

## How this model can and cannot be used

Use it to understand **station thermodynamics, qualitative architecture differences, approximate thrust accounting, basic rotor/shaft work and what must be validated for an off-design model**.

Do **not** treat the resulting numerical values as measured or certified engine performance; use them to predict real OEM engine RPM, surge margin, thermal life or flight safety; or claim that independently calibrated **mapped** nozzle/shaft matching has been implemented. See [Digital Twin Evidence and Gates](../validation/DIGITAL_TWIN_EVIDENCE.md), run `bun run physics:validate` for numerical invariants and `bun run cad:validate` for bounded SolidCraft mesh geometry checks.

For the full approved scientific design, see [PHYSICS_SPEC.md](PHYSICS_SPEC.md), [OFF_DESIGN_MAPS_AND_NOZZLES.md](OFF_DESIGN_MAPS_AND_NOZZLES.md) and [VERIFICATION_RELEASE.md](VERIFICATION_RELEASE.md). For the current implementation and known release gaps see [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md).

## Further reading

- [NASA Glenn — Turbine engines](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/turbine-engines/)
- [NASA Glenn — Thrust force](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/thrust-force/)
- [OpenMDAO pyCycle](https://github.com/OpenMDAO/pyCycle)
- [NASA T-MATS](https://github.com/nasa/T-MATS)

All numeric constants above describe **source-code assumptions** verified against `src/app/physics/cycle.ts`, not experimentally calibrated engine parameters.

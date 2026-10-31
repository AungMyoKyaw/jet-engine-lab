# Engineering notes

Jet Engine Lab represents an **idealized single-spool, non-afterburning turbojet** with an axial compressor, constant-pressure-style burner, turbine, and convergent exhaust nozzle. The goal is to make the thermodynamics inspectable, not to reproduce a particular engine's performance.

The program uses one pure calculation, `turbojetCycle()` in `src/physics.js`, to supply all numbers shown in the instrument panel and cycle plots. No performance numbers are hard-coded into the UI.

## Station numbering

| Station | Location | Properties plotted |
| --- | --- | --- |
| 0 | Freestream | Static pressure and temperature |
| 2 | Diffuser exit | Stagnation pressure and temperature |
| 3 | Compressor exit | Stagnation pressure and temperature |
| 4 | Combustor exit / turbine inlet | Stagnation pressure and temperature |
| 5 | Turbine exit / nozzle inlet | Stagnation pressure and temperature |
| 8 | Exhaust exit | Static pressure and temperature |

The combined chart is deliberately a *station comparison*, not a physically consistent graph of static pressure along the whole duct. Stagnation and static quantities are identified explicitly in the table.

## Inputs and constants

The default state is throttle 68%, compressor total-pressure ratio 13:1, air mass flow 62 kg/s, sea-level altitude, and flight Mach 0.20. These are teaching settings, not measurements of an existing engine.

| Assumption | Value |
| --- | --- |
| Air: specific heat ratio, specific heat | 1.40; 1004 J/(kg·K) |
| Hot gas: specific heat ratio, specific heat | 1.33; 1150 J/(kg·K) |
| Gas constant | 287.05287 J/(kg·K) |
| Fuel lower heating value | 43 MJ/kg |
| Compressor / turbine efficiencies | 0.86 / 0.89 |
| Shaft / burner efficiencies | 0.99 / 0.99 |
| Inlet / burner total-pressure recovery | 0.985 / 0.95 |
| Nozzle efficiency | 0.96 |
| Turbine inlet total temperature | 1020–1700 K, linearly controlled by the throttle slider |

The International Standard Atmosphere is approximated from sea level through 16 km. The model holds component efficiencies constant and does not account for real compressor-map behavior, cooling-air bleeds, blade tip leakage, transient spool inertia, variable-area nozzles, or changes in gas composition.

### 0 → 2: Inlet

Flight Mach and ambient conditions determine freestream velocity and inlet total temperature. An ideal isentropic ram-pressure rise is calculated, followed by the assumed inlet pressure-recovery loss. Inlet flow distortion is discussed but not simulated.

### 2 → 3: Compressor

For total-pressure ratio `πc` and compressor isentropic efficiency `ηc`:

```text
Tt3 / Tt2 = 1 + (πc^((γa−1)/γa) − 1) / ηc
Wcompressor = m_air · cp_air · (Tt3 − Tt2)
```

The rotor does work on the flow; its stator rows straighten and diffuse the flow. The visual blades are not a solved compressor cascade.

### 3 → 4: Combustor

The combustor raises total temperature while losing a small fraction of total pressure. Fuel–air ratio is obtained from a steady energy balance:

```text
f = (cp_gas·Tt4 − cp_air·Tt3)
    / (ηburner·LHV − cp_gas·Tt4)
m_fuel = f · m_air
```

The implementation limits fuel flow to nonnegative values. If a selected combination is outside the model's valid regime, it flags the result rather than treating it as an achievable operating point.

### 4 → 5: Turbine

Turbine work powers the compressor through a shared shaft:

```text
(m_air + m_fuel)·cp_gas·(Tt4 − Tt5)·ηshaft = Wcompressor
```

The turbine exit total pressure is calculated from its specified isentropic efficiency, using the resulting ideal expansion temperature. The rotor animation is illustrative; it is not an RPM solver.

### 5 → 8: Nozzle and thrust

For a convergent nozzle, the critical static-to-stagnation pressure ratio is:

```text
Pcritical / Pt5 = (2 / (γg + 1))^(γg / (γg − 1))
```

For sufficiently low back pressure, the exit is treated as choked. Otherwise the exit expands to ambient pressure. With the selected exit pressure, nozzle velocity comes from the available total-to-static enthalpy drop and nozzle efficiency.

Thrust includes ram drag and pressure thrust, not just jet momentum:

```text
F = (m_air + m_fuel)·Ve − m_air·V0 + (Pe − P0)·Ae
```

The exit area is estimated from steady continuity. This is a simplified convergent-nozzle estimate, not a geometrically matched nozzle design.

## Aerodynamics lab

The standalone airfoil widget uses a finite-wing-inspired teaching polar. Its lift-curve slope depends on aspect ratio, and its post-stall response rolls off past an **illustrative** 13° incidence. Dynamic pressure is `q = ½ρV²`; lift and drag are `qSC_L` and `qSC_D`. Real compressor blades operate in cascades with three-dimensional, compressible, viscous flow. No compressor cascade coefficients have been measured or inferred here.

The velocity-triangle widget begins with axial inlet flow and zero absolute inlet swirl. At blade radius `r` and rotor speed `N`:

```text
U = 2πrN / 60
W = sqrt(Vx² + U²)
β = atan(U / Vx)
Δh₀ = U · (Vθ,out − Vθ,in)
```

The swirl increment is independently adjustable for intuition. This calculation does **not** attempt to solve flow deviation or stall, and its RPM control is not coupled to the main engine-cycle controls.

## Where this model stops

- **Not an engine map.** Pressure ratio, air flow, and turbine inlet temperature are independent UI inputs. In real hardware they are strongly coupled to spool speed, altitude, component maps, limits, and control laws.
- **Not CFD.** Particles show direction and qualitative flow, not streamlines derived from Navier–Stokes equations.
- **Not a scale model.** Blade counts, proportions, cutaways, shaft speed, and rendering are chosen for readability.
- **Not a surge model.** Local blade stall and full-engine compressor surge are different phenomena; neither is numerically predicted.
- **Not a turbofan.** The bypass stream, fan, and multiple spools of modern transport engines are not represented.
- **Not a certified calculation.** Values should not be used for design, operation, maintenance, or performance prediction.

## Reading

- [NASA Glenn: Turbine engines](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/turbine-engines/)
- [NASA Glenn: Brayton cycle](https://www.grc.nasa.gov/www/k-12/BGP/brayton.html)
- [NASA Glenn: Thrust equation](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/thrust-force/)
- [NASA Glenn: Axial compressors](https://www.grc.nasa.gov/www/k-12/airplane/caxial.html)
- [FAA: Engine operation and malfunction familiarization](https://www.faa.gov/sites/faa.gov/files/aircraft/air_cert/design_approvals/engine_prop/engine_malf_famil.pdf)

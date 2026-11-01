# Engineering Specification — Turbojet and Turbofan Thermodynamic Models

**Status:** Engineering implementation specification derived from approved Q03, Q04, Q22, Q36–Q61, Q101–Q120 and Q191–Q193. Source-backed equations and proposed numerical policies are differentiated; **a preliminary station-cycle solver now exists but the approved map-coupled off-design models remain unimplemented and independently unvalidated**. Scientific review required before engine-specific numerical claims.

## 1. Scope, naming and nonclaims
- Two standalone, reference-informed generic models: **TJ-1**, single-spool axial turbojet; **TF-2**, two-spool high-bypass separate-exhaust turbofan. No afterburner. Steady-state design-point / bounded operating-point analyses, not transient engine-control models. Model station state and shaft work explicitly, with independent air and hot gas property functions.
- Use consistent SI internally (K, Pa, kg/s, J/kg, m/s, W, m², m); unit switching transforms display only. All inputs are typed, validated and documented with physical units.
- State assumptions prominently: ideal-gas mixture; quasi-1D station balance; **source-traced compressor/turbine maps calibrated and independently validated before use**; approximate combustor gas and cooling; no certified OEM engine-performance claims. Visual animation does not itself prove RPM; displayed model-predicted shaft RPM must come from the map-coupled converged solution with valid absolute-speed scaling.

## 2. Stations and branch graph
Adopt a **project-defined explicit station mapping aligned with common gas-turbine conventions**. Manufacturer/numerical source schemes vary; provide cross-reference in UI, do not claim it universally standard.

| Station | Turbojet | Two-spool turbofan |
|---|---|---|
| 0 | Freestream static state | Freestream static state |
| 2 | Diffuser exit / compressor entry total | Inlet diffuser / fan entry total |
| 13 | N/A | Fan discharge into bypass duct total |
| 21 | N/A | Fan discharge into core path total |
| 25 | N/A | LPC discharge / HPC entry total |
| 3 | Compressor discharge total | HPC discharge total |
| 4 | Combustor discharge / turbine entry total | Combustor discharge / HPT entry total |
| 45 | N/A | HPT exit / LPT entry total |
| 5 | Turbine exit total | LPT exit total |
| 8 | Core nozzle exhaust static | Core nozzle exhaust static |
| 18 | N/A | Bypass nozzle exhaust static |

Define separate nozzle geometric reference areas `A8` and `A18` when physically meaningful. Internal shaft maps: `TJ-1: turbine ↔ compressor`; `TF-2: HPT ↔ HPC (HP spool); LPT ↔ fan + LPC (LP spool)`. Fan acts on both core and bypass air; LPC acts on core only. No bypass flow goes through combustor. Numerically and visually differentiate station **static** vs **total** values; never plot unlike measurements without labeling. Define and document the mixed fuel/hot-gas mass-flow conventions.

## 3. Gas thermodynamics and atmosphere
**Proposed engineering baseline:** dry-air temperature-dependent ideal-gas property representation using appropriately sourced piecewise polynomial or tables (NASA polynomials/NIST-type data, with validity intervals), `c_p(T)>0`, `h(T)=h(T_ref)+∫c_p(T)dT`, `s°(T)=s°(T_ref)+∫[c_p(T)/T]dT`. For specified composition, `s(T,p)=s°(T)−R ln(p/p_ref)`. Hot gas uses explicitly documented approximate composition and effective gas constant; do not merely reuse air correlation at very high turbine entry temperatures without a limitation notice. Numerically integrate/solve analytically according to chosen correlation, check continuity at polynomial intervals and document reference enthalpy (e.g. `h(T_ref)=0` convention applied consistently). Pressure-independent ideal gas is an approximation.

ISA dry-air baseline: troposphere lapse and continuous isothermal layer as needed, derived `T0,p0,rho0,a0` from altitude; clearly expose layer transitions and accepted envelope. Freestream speed `V0=M0 sqrt(gamma(T0) R T0)` under selected approximate composition. `Tt0` and `Pt0` computed via variable-property entropy + stagnation enthalpy (not an unannounced constant-gamma formula). Recovery `Pt2=pi_d(M0) Pt0`, `Tt2=Tt0` under adiabatic diffuser approximation.

**Proposed initial operating domain (not an approved numeric limit):** 0–12 km, 0–0.85 Mach, dry air; scientific validation may narrow this. Restrict environment inputs to domain where selected correlations and model assumptions hold. Nonstandard conditions require explicit approved extensions.

## 4. Compressor, fan and turbine relations
For each compression element: prescribed pressure ratio `pi_c=Pt_out/Pt_in>1`; compute isentropic `T_out,s` from `s°(T_out,s)−s°(T_in)=R ln(pi_c)`. Isentropic efficiency `eta_c=(h_out,s−h_in)/(h_out−h_in)`; then invert `h(T)` for actual `T_out`. For each turbine: prescribed extracted work or exit pressure; compute ideal exit enthalpy at equal exit pressure and `eta_t=(h_in−h_out)/(h_in−h_out,s)`. Include mechanical efficiencies, bleed and separate flow paths.

TF-2 fan pressure ratio applies to core and bypass with documented fan flow/work accounting. LPC/HPC are separate core compressors. Proposed `LP_power_demand = fan_all_air_power + LPC_core_power + LP_accessories`, `HP_power_demand=HPC_core_power + HP_accessories`. Net shaft matching, for each spool, checks mechanical-transferred turbine extraction equals its associated demand; report residual in W and as normalized fraction. For TJ-1 turbine extraction balances compressor plus accessories. Parameter schedule (temperature, pressure ratios, efficiencies) must be feasible simultaneously; infeasible cases **rejected** rather than hidden-corrected.

**Approved D01=B:** Both engines require actual model-predicted off-design shaft RPM from validated corrected-speed/flow compressor and turbine performance maps, with reproducible design-point scaling, source provenance and independent off-design reference checks. Solve actual shaft speed and map working lines jointly with flow, nozzle and spool power residuals. **If calibrated RPM evidence is unavailable, do not publish RPM as a validated result or claim D01 complete.** Numerical surge-margin claims require separate reliable stall-boundary data and remain outside this specification. See `OFF_DESIGN_MAPS_AND_NOZZLES.md`.

## 5. Combustor, cooling and flow network
Combustor total pressure ratio `pi_b<1`, thermal efficiency `eta_b`, fuel lower heating value `LHV` and target `Tt4` per throttle schedule. Solve fuel mass flow `mdot_f` using fuel/air enthalpy balance, e.g. for simple one-stream equal-reference enthalpy model: `mdot_air h3 + eta_b mdot_f LHV = (mdot_air+mdot_f) h4` and `mdot_f=mdot_air (h4−h3)/(eta_b LHV−h4)`, with fuel reference enthalpy and hot gas property corrections in the final solver. Reject nonpositive denominator, negative fuel or impossible temperature schedule. Stated formulation is a reference simplification; final mixture property choice must be verified.

Configurable cooling/bleed splits must conserve mass before/after extraction and reinjection; report associated enthalpy mixing at join stations. Distinguish compressor bleed not returned to the core from cooling flow reintroduced downstream. Accessory and gearbox losses are explicit power sinks. All branch flow sums are audited; avoid double counting fan work for the core path.

## 6. Separate nozzles and thrust
For a nozzle, use upstream `Pt,Tt`, ambient `p0`, nozzle efficiency, gas properties and **effective** exit/throat area. Determine choking from physically consistent critical pressure/sonic-state equations, not a hardcoded Mach=1 check at arbitrary static pressure. Choked convergent nozzle has sonic throat; unchoked case expands to ambient under baseline assumptions. Compute `Ve`, `pe`, `mdot_e`, `Ae`; audit nozzle capacity and mass. Beware prescribed mass flow and fixed nozzle area can be mutually infeasible at off-design conditions.

General stream thrust `F_j=mdot_exit,j V_exit,j + (p_exit,j−p0) A_exit,j`. Net engine thrust `F_net=ΣF_j−mdot_inlet V0` (separate core and bypass exits), with fuel addition handled in exit mass. Gross thrust is sum of exhaust momentum + pressure terms. Ram drag is inlet-air momentum. TSFC is `mdot_f/F_net` only for sufficiently positive thrust; otherwise explicit undefined. Propulsive efficiency `eta_p=F_net V0 / (rate of useful jet kinetic-energy increase)` as defined in model, requires positive meaningful denominators; at static `V0=0`, display 0 where formally defined and **not** claim useful flight propulsive efficiency. Thermal and overall efficiencies must document fuel energy, jet kinetic energy and mechanical term conventions. Specific thrust, bypass ratio, station pressure ratio, corrected flow only where physically valid.

**Approved D02=B:** Provide explicit user-adjustable effective throat areas for the turbojet core nozzle (`A8_eff`) and the turbofan core (`A8_eff`) and bypass (`A18_eff`) nozzles. For each, document flow coefficient, `A_eff = Cd * A_geom`, geometric throat and exit-area conventions; solve choked/unchoked mass capacity, match flow and shaft operating point, and update parametric 3D nozzle area from the accepted solver state. Changes in area are not merely cosmetic. Reject infeasible states; preserve prior accepted geometry and numerical outputs together. See `OFF_DESIGN_MAPS_AND_NOZZLES.md`.

## 6A. Mapped off-design closure — final binding contract

Design mode calibrates physically sourced maps and permits editing baseline mass flow, efficiency and pressure ratios within model constraints. Off-design mode uses throttle/TIT schedule, Mach, altitude and explicit core/bypass throat-area controls to solve the coupled mass, map working-line, shaft-power, choking and fuel equations. Off-design PR, component efficiency, inlet flow and actual shaft RPM generally become coupled **outputs**; do not simultaneously prescribe them all as free independent controls. Corrected speed `Ncorr = N / sqrt(Tt_in/Tref)`, corrected flow `Wcorr = mdot*sqrt(Tt_in/Tref)/(Pt_in/Pref)`, with source-specific correction convention and calibration. Each mapped component stores source hash, operating line, interpolation domain and scale factors. Record the square equation/unknown dependency, Jacobian conditioning and continuation policy for each architecture. Refuse unsupported extrapolation. See `OFF_DESIGN_MAPS_AND_NOZZLES.md` for precise solver/interface/geometry acceptance.

## 7. Solver and worker contract
- Pure deterministic functions, no UI dependencies or randomized state. Input schema identifies engine and version. Iterative thermodynamic solves bounded by temperature/pressure brackets, monotone residual checks and maximum iteration counts. A bracketed method (e.g. bisection/Brent-like) for inversion; warm starts only if numerically safe.
- Input validators ensure positive absolute temperature, pressure and flow, `pi>1` for compressor, `0<eta≤1`, `0≤bleed<1`, appropriate bypass and temperature bounds, finite output and property range. Never clamp a result invisibly.
- Worker receives request ID, engine/config version, validated canonical SI input; responds with versioned result, warnings, residuals, iteration counts and execution status. Debounce candidate 120–200 ms. Late worker result discarded by version/ID. Last valid result persists visibly as stale if later inputs rejected/failed.
- **Proposed numerical acceptance policy**, subject to validation pilot: normalized mass residual ≤1e-8, shaft power ≤1e-6, energy ≤1e-6 for well-scaled verified cases; use absolute floors near zero rather than divide by zero. Float64, deterministic reference cases; none of these targets have been experimentally validated yet. Reference agreement measured only on the same assumptions/parameters, with separately sourced independent calculations. Numeric precision of display follows actual physical and model fidelity, not solver floating-point precision.

## 8. Baseline datasets and test fixtures
Two baselines must be documented with version tags `TJ-1/v1` and `TF-2/v1`, with **validated and independently reproducible mapped component data and calibrated design RPM**. Each requires reference dimensions, design PR/efficiency, fan bypass ratio, design mass flow, TIT, cooling/bleed, mechanical losses, variable-nozzle actuation geometry, property coefficients and citations. **No verified numerical or map-calibrated baseline exists yet.** Proposed validation: ground static, subsonic cruise, higher-altitude cruise, low/high throttle, map-boundary and nozzle choking transitions, independently varied core/bypass nozzle areas, and rejected infeasible points.

## 9. Required charts / outputs
For both engines: static vs total station `T/P`, enthalpy, corrected/map flow, component map PR/efficiency, calibrated **model-predicted shaft RPM**, reference-speed percent, nozzle effective/geometric areas and control positions, thrust, fuel, TSFC validity, pressure term, compressor/turbine/shaft powers, warnings, map IDs and input assumptions. TJ shows one shaft; TF shows independently predicted HP and LP shaft speeds, separate core and bypass nozzles. Comparison panels keep flight conditions matched and make design parameter differences explicit. CSV/print export includes maps, model revision, bounds, solver residuals and citations. No unsupported OEM-measured-RPM or surge-margin claims.

## 10. Model evidence sources (to consult and record by section)
- NASA Glenn general thrust equation: https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/thrust-force/
- NASA Glenn turbofan core/bypass and mass split: https://www.grc.nasa.gov/www/k-12/airplane/turbfan.html
- NASA Glenn turbine engine background: https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/turbine-engines/
- NASA Glenn fundamentals of Brayton cycle: https://www.grc.nasa.gov/www/k-12/BGP/brayton.html
- NASA thermodynamic polynomials and source datasets **must be selected and verified before coefficients enter code**; no unreviewed coefficient values appear in this spec.

## Engineering definition of done
For each model: validate map source, right-to-redistribute, speed scaling in rpm, applicable map domain, numerical baseline and independent off-design reference points. Demonstrate mass/energy/shaft/nozzle matching, variable geometric area fidelity and atomic worker-to-scene state, no map extrapolation without explicit evidence, and accurate solver diagnostics. Numerical results not verified are marked unavailable; do not claim implementation readiness until D01/D02 evidence passes. Manual aerospace-engineering review is strongly recommended.

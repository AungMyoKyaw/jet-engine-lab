# Jet Engine Lab — Approved Redesign Decisions

Status: **All Q01–Q200 and D01=B/D02=B decisions locked.** Final planning review completed with external-data validation gates; implementation authorization was granted on 2026-11-01; public release remains gated.

Source: user-approved Q01–Q200 plus final D01=B/D02=B, 2026-11-01. **Do not silently override these decisions.** New information can trigger an explicitly documented conflict, but never replace a decision without approval.

## Product and scope

| ID | Selection | Approved decision |
|---|---|---|
| Q01 — Primary goal | C | Advanced engineering learning tool |
| Q02 — Target audience | A | Engineering students, developers and aviation enthusiasts |
| Q03 — Engine architecture | C | Separate turbojet and turbofan simulations |
| Q04 — Scientific rigor | A | Physically coherent educational approximation |
| Q05 — Website structure | C | Multi-page technical learning platform |
| Q06 — Existing learning features | C | Rebuild all learning modules from scratch |

## Visual design and assets

| ID | Selection | Approved decision |
|---|---|---|
| Q07 — Overall aesthetic | C | Blueprint/CAD engineering workspace |
| Q08 — UI density | A | Engine-dominant layout; contextual controls; few panels |
| Q09 — Brand identity | A | Retain Jet Engine Lab; redesign visual system |
| Q10 — Photography and materials | A | Realistic metals, subtle wear, studio-grade lighting |
| Q11 — Asset sourcing | A | Curated licensed assets plus custom mechanical geometry |
| Q12 — Asset licensing | C | Any license allowing this exact free website, subject to individual asset rights and redistribution checks |
| Q13 — Asset budget | A | Free assets and tooling only |
| Q14 — Level of detail | A | High detail for inspection, optimized elsewhere |

## 3D experience

| ID | Selection | Approved decision |
|---|---|---|
| Q15 — Engine presentation | A | Large three-quarter cutaway with optional external shell |
| Q16 — Component inspection | A | Click, focus, isolate, explode and inspect components |
| Q17 — Mechanical animation | A | Rotors, shaft and effects synchronized with simulation state |
| Q18 — Airflow visualization | A | Subtle temperature-colored animated flow |
| Q19 — Camera system | A | Smooth orbit and precise preset inspection cameras |
| Q20 — Guided tour | A | Optional educational, immediately interruptible tour |
| Q21 — Labels and annotations | A | Contextual annotations anchored to selected components |

## Simulation and learning

| ID | Selection | Approved decision |
|---|---|---|
| Q22 — Thermodynamics | B | Expand into a more sophisticated simulation |
| Q23 — Telemetry visibility | B | Full instrument panel persistently visible |
| Q24 — Charts and cycle analysis | A | Expandable dedicated analysis workspace |
| Q25 — Simulation controls | C | Substantially more advanced engineering parameters |
| Q26 — Learning interaction | B | Full guided course with chapters |

## Engineering and release

| ID | Selection | Approved decision |
|---|---|---|
| Q27 — Frontend architecture | C | Migrate to a React-based 3D stack |
| Q28 — Desktop/mobile | B | Desktop-first with reduced mobile experience |
| Q29 — Performance | B | Prioritize maximum visual quality even if slower |
| Q30 — Loading and offline | A | Progressive loading, cached assets and useful offline behavior |
| Q31 — Accessibility | A | Keyboard, reduced motion and accessible technical fallback |
| Q32 — Sound | A | Optional subtle mechanical audio, muted initially |
| Q33 — Recording | A | Preserve full-site recording and add curated demonstration film |
| Q34 — Publishing | A | master for source; GitHub Pages for production |
| Q35 — Release approach | A | Finalize specs, then implement, test, review and deploy after approval |

## Round 2 — approved dependent decisions (Q36–Q100)

All choices below were explicitly approved as **A** on 2026-11-01. These decisions are locked; pending implementation-level decisions will not supersede them.

| ID | Selection | Approved decision |
|---|---|---|
| Q36 — Turbojet reference | A | Generic, unbranded single-spool axial turbojet with documented proportions |
| Q37 — Turbofan reference | A | Two-spool high-bypass educational turbofan |
| Q38 — Bypass treatment | A | Separate fan bypass and hot-core flow paths |
| Q39 — Exhaust configuration | A | Separate core and bypass nozzles for baseline turbofan |
| Q40 — Engine authenticity | A | Reference-informed generic engineering designs, clearly labeled |
| Q41 — Turbojet assemblies | A | Detailed intake, compressor, stators, shaft, combustor, turbine and nozzle |
| Q42 — Turbofan assemblies | A | Detailed fan, LPC, HPC, combustor, HPT, LPT, two shafts and exhaust streams |
| Q43 — Operating modes | A | Validated steady-state points with illustrative startup/shutdown animations |
| Q44 — Dimensions | A | Physically coherent, documented reference proportions |
| Q45 — Selectable parts | A | Assembly and meaningful subassembly picking |
| Q46 — Configuration presets | A | One carefully validated baseline for each engine type |
| Q47 — Physics resolution | A | Station-based thermodynamics with component and spool energy balances |
| Q48 — Gas properties | A | Temperature-dependent gas-property approximation |
| Q49 — Intake modeling | A | Mach-dependent pressure recovery and inlet losses |
| Q50 — Compressor and turbine models | A | Configurable pressure ratios and efficiency-based multistage calculations |
| Q51 — Shaft work | A | Explicit shaft power matching, including independent turbofan spools |
| Q52 — Combustion modeling | A | Fuel-air energy balance, burner efficiency and pressure losses |
| Q53 — Nozzle calculations | A | Choking, exit velocity and pressure-thrust calculations |
| Q54 — Fuel performance | A | Jet-A-like fuel assumptions, fuel flow and specific fuel consumption |
| Q55 — Advanced control parameters | A | Editable efficiency, turbine inlet temperature, bypass ratio and loss parameters |
| Q56 — Invalid conditions | A | Show constraint warnings and reject nonphysical states |
| Q57 — Compressor instability | A | Explain surge and stall boundaries without claiming unsupported precision |
| Q58 — Measurement units | A | SI default with aviation/Imperial toggle |
| Q59 — Performance outputs | A | Station states, net/gross thrust, fuel flow, efficiency, TSFC and shaft work |
| Q60 — Comparison workspace | A | Compare turbojet/turbofan operating points in aligned plots |
| Q61 — Numerical validation | A | Independent conservation checks and published educational reference benchmarks |
| Q62 — Core syllabus | A | Thermodynamics, components, turbomachinery, performance, design tradeoffs and failure mechanisms |
| Q63 — Learning paths | A | Beginner foundations through advanced engineering |
| Q64 — Chapter access | A | Recommended chapter order; all chapters accessible |
| Q65 — Equation depth | A | Readable explanations with expandable full derivations |
| Q66 — Lesson format | A | Interactive models, original diagrams, worked examples and experiments |
| Q67 — Practice exercises | A | Interactive parameter experiments with detailed feedback |
| Q68 — Learning progress | A | Local browser-based progress without an account |
| Q69 — Scientific citations | A | Cite NASA, FAA and other trustworthy open technical references |
| Q70 — Technical glossary | A | Searchable glossary of variables, station notation and terminology |
| Q71 — Language | A | English for initial release |
| Q72 — Accessible alternative | A | Detailed 2D component diagrams, equations and data tables |
| Q73 — Default visual theme | A | Dark graphite/navy CAD workspace with optional light theme |
| Q74 — Functional color | A | Consistent airflow temperature scale, selection and warning colors |
| Q75 — Typography | A | Precise interface sans-serif with monospaced measurements |
| Q76 — Home page | A | Prominent interactive engine introduction with curriculum entry points |
| Q77 — Navigation | A | Clear routes for Engines, Courses, Analysis and Reference |
| Q78 — Engine switching | A | Dedicated model switcher with separate route/state per engine |
| Q79 — Workspace composition | A | Dominant 3D viewport and persistent compact telemetry dock |
| Q80 — Telemetry priority | A | Thrust, spool speeds and fuel flow prioritized; additional readings remain visible |
| Q81 — Component selection UI | A | Compact part tree with contextual detail inspector |
| Q82 — Explosion mechanics | A | Controlled hierarchical assembly explosion and smooth recomposition |
| Q83 — Camera views | A | Orbit plus front, side, axial, cutaway and focused assembly presets |
| Q84 — Scene environment | A | Clean neutral HDR lighting, subtle engineering grid and measurement aids |
| Q85 — Material design | A | Realistic metallic PBR with restrained heat discoloration |
| Q86 — Rotor animation | A | Independent physically indicative spool speeds tied to operating state |
| Q87 — Mobile presentation | A | Lower-detail touch viewer with accessible technical panels |
| Q88 — Asset license compliance | A | Use any permitted free asset after validating public repository redistribution rights |
| Q89 — Asset traceability | A | Record creator, source URL, license, modifications and asset hash |
| Q90 — 3D asset integration | A | Inspect and split licensed models into functional components; rebuild missing parts |
| Q91 — 3D optimization | A | GLB/glTF with compression, optimized textures and desktop/mobile LODs |
| Q92 — Asset hosting | A | Self-host verified assets in the GitHub Pages distribution |
| Q93 — React foundation | A | React 19, TypeScript, Vite, stable React Three Fiber and Three.js |
| Q94 — Type safety | A | Strict TypeScript across simulation, 3D and UI modules |
| Q95 — Application state | A | Small domain-specific state stores separated from physics calculations |
| Q96 — Numerical execution | A | Use browser Web Workers for expensive simulation calculations |
| Q97 — Offline strategy | A | Cache shell, course content and recently used engine assets |
| Q98 — Testing strategy | A | Physics reference tests, component tests, E2E interactions and visual regression |
| Q99 — Render quality targets | A | High desktop fidelity with measured FPS, adaptive quality and no rigid 60-FPS promise |
| Q100 — Git and release workflow | A | Implement on an isolated feature branch; review before merging to master and publishing gh-pages |

## Round 3 — approved final-specification decisions (Q101–Q200)

All are explicitly approved **A** selections on 2026-11-01. The values below are the user-selected decisions; design-specific numeric values must be tagged as proposed unless independently verified or later accepted.

| ID | Selection | Approved decision |
|---|---|---|
| Q101 — Station numbering | A | Use documented gas-turbine station numbering, with explicit branch/station mappings for both architectures |
| Q102 — Gas property equations | A | Use documented temperature-dependent specific-heat correlations with integrated enthalpy |
| Q103 — Atmospheric reference | A | ISA-based dry-air atmosphere with clearly stated operating altitude bounds |
| Q104 — Intake pressure recovery | A | Mach-sensitive recovery model with documented losses and valid operating range |
| Q105 — Compression mathematics | A | Use variable-property isentropic relations and actual enthalpy rise at component efficiency |
| Q106 — Fuel and combustion energy | A | Solve fuel-air ratio using lower heating value, combustor efficiency, pressure loss and mixed-flow enthalpy |
| Q107 — Turbine cooling assumptions | A | Document an optional simplified cooling/bleed approximation and its effect on energy balance |
| Q108 — Bleed and accessory power | A | Explicitly account for configurable bleed flow and mechanical/accessory losses |
| Q109 — Nozzle equations | A | Solve convergent nozzle choking, exit state, mass consistency and pressure thrust |
| Q110 — Performance definitions | A | Document net/gross thrust, ram drag, TSFC and thermal/propulsive efficiency with valid-domain handling |
| Q111 — Spool matching algorithm | A | Enforce separate HP and LP shaft energy balances with bounded iterative solution |
| Q112 — Pressure ratio allocation | A | Use separately configurable fan, LPC and HPC ratios with validated baseline constraints |
| Q113 — Throttle semantics | A | Map throttle to a constrained turbine-inlet-temperature operating schedule |
| Q114 — Valid flight envelope | A | Start with documented subsonic operation over a bounded altitude range for both engines |
| Q115 — Mass-flow assumptions | A | Use user-controlled design-point inlet mass flow and explicit core/bypass split |
| Q116 — Solver method | A | Use robust bounded root solving with convergence and residual checks |
| Q117 — Conservation tolerances | A | Set separately documented numerical residual limits for mass, energy and spool power |
| Q118 — Convergence failure | A | Retain the last valid solution and display the rejected state with diagnostic reasons |
| Q119 — Comparison normalization | A | Compare engines at matched flight conditions and explicitly report differing design assumptions |
| Q120 — Model credibility display | A | Show equation assumptions, validity ranges, limitations and reference links beside results |
| Q121 — Engine coordinate system | A | Shared longitudinal coordinate system, consistent units and documented reference dimensions |
| Q122 — Inlet and fan geometry | A | Model appropriate lips, spinner, inlet guide geometry and distinct turbofan fan/bypass structure |
| Q123 — Turbojet compressor | A | Multiple distinguishable axial rotor/stator rows with plausible blade profiles and flow annulus |
| Q124 — Turbofan compressor structure | A | Physically distinct fan, LPC and HPC assemblies with independent spool grouping |
| Q125 — Rotor/stator differentiation | A | Clearly distinguish rotating blade rows, fixed vanes, hubs, disks and mounting relationships |
| Q126 — Combustor representation | A | Annular combustor with diffuser, liner, representative injection features and thermal visualization |
| Q127 — Turbine construction | A | Distinct turbojet turbine and turbofan HPT/LPT assemblies with representative rotor and stator geometry |
| Q128 — Mechanical supports | A | Coaxial spools, representative bearing locations, support frames and realistic shaft clearances |
| Q129 — Nacelle and casing | A | Separate structural cases, nacelle, bypass duct, removable panels and appropriate nozzle housings |
| Q130 — Bill of materials granularity | A | Maintain a typed, documented hierarchy of major parts and significant inspectable subassemblies |
| Q131 — Explosion structure | A | Hierarchical, collision-aware explosion vectors, using axial/radial directions where appropriate |
| Q132 — Explosion controls | A | Continuous explosion slider plus useful collapsed, partial and full presets |
| Q133 — External shell handling | A | Removable/ghosted shell sections with credible cutaway boundaries |
| Q134 — Sectioning tools | A | Interactive axial and radial section planes with caps where practical |
| Q135 — Projection modes | A | Perspective inspection and true orthographic CAD projection |
| Q136 — Measurement overlays | A | Show part dimensions, section measurements and engine-scale reference guides |
| Q137 — Component isolation | A | Isolate a component while ghosting adjacent context, with full restore |
| Q138 — Rotational motion | A | Reflect relative N1/N2 shaft speed and direction with visually safe scaling and aliasing avoidance |
| Q139 — Flow and temperature | A | Differentiate inlet, bypass, core and exhaust streams with meaningful flow and temperature encoding |
| Q140 — Guided-tour specification | A | Data-driven camera keyframes, synchronized component selection, captions, interruption and resumption |
| Q141 — Curriculum organization | A | Shared foundations followed by turbojet, turbofan and advanced analysis modules |
| Q142 — Initial chapter coverage | A | Approximately 12–16 substantial modules spanning all six approved syllabus subjects |
| Q143 — Prerequisite handling | A | Optional mathematics and physics refreshers with accessible advanced content |
| Q144 — Derivation presentation | A | Show assumptions, equation steps, units, physical meaning and worked solutions |
| Q145 — Experiments per module | A | At least one meaningful simulator-driven experiment per major engineering concept |
| Q146 — Assessment methods | A | Concept questions, numerical exercises and scenario interpretation with explanations |
| Q147 — Numerical answer checking | A | Unit-aware tolerances, justified rounding, feedback and reproducible input fixtures |
| Q148 — Progress and completion | A | Versioned local progress, completion by meaningful activity, manual reset and import/export |
| Q149 — Lab report export | A | Export selected operating conditions, assumptions, results and plots in a printable report |
| Q150 — Reference governance | A | Cite references near factual claims, include source versions/links and distinguish derived explanations |
| Q151 — Base color palette | A | Deep graphite/navy surfaces with steel-blue panels and restrained light-blue blueprint guides |
| Q152 — Primary selection accent | A | Technical cyan/ice-blue selection highlight distinct from temperature colors |
| Q153 — Thermal visualization palette | A | Documented continuous cool-to-hot scale, with separate accessibility-friendly patterns/labels |
| Q154 — Typefaces | A | IBM Plex Sans for interface and IBM Plex Mono for engineering data |
| Q155 — Desktop layout proportions | A | Give most width to 3D inspection while preserving a narrow telemetry dock and compact navigation |
| Q156 — Telemetry component design | A | One dominant thrust readout, clearly grouped spool/fuel metrics and compact secondary instruments |
| Q157 — Charts and plotting | A | Engineering-style line plots, readable axes/units, aligned station and engine comparison views |
| Q158 — Light-mode behavior | A | Complete functional light theme with equivalent information hierarchy and accessible contrast |
| Q159 — Animation design language | A | Restrained purposeful 160–400 ms UI transitions; no gratuitous spring/bounce movement |
| Q160 — Design-system deliverables | A | Document actual tokens, typography, component states, layouts and anti-patterns in DESIGN.md |
| Q161 — GitHub Pages routing | A | Use reliable static-host-compatible hash routing with clean labeled navigation |
| Q162 — Shareable simulator state | A | Support validated, versioned URL-encoded operating conditions and selected engine |
| Q163 — Engine switching behavior | A | Preserve applicable common flight conditions, reset incompatible engine-specific parameters and explain changes |
| Q164 — Component detail presentation | A | Contextual inspector with part name, function, relationships and related course references |
| Q165 — Readout update strategy | A | Recompute numerical results on validated parameter changes; smoothly interpolate only visual display |
| Q166 — Invalid-input experience | A | Show inline validation and retain the last valid simulation without hidden clamping |
| Q167 — Undo and reset | A | Support parameter undo/reset, engine preset restore and distinct camera reset |
| Q168 — Session persistence | A | Persist preferences and progress locally; restore valid simulator state with explicit versioning |
| Q169 — Keyboard interactions | A | Document shortcuts for inspection, camera presets, selected parts and simulation controls |
| Q170 — Loading/error surfaces | A | Design skeleton/loading phases, retryable model errors and an accessible fallback for unsupported 3D |
| Q171 — Asset selection criterion | A | Score every free model by mechanical suitability, visual fidelity, editability, download size and license |
| Q172 — License evidence | A | Keep license text, page URL, creator, retrieval date and evidence of public redistribution permission |
| Q173 — Attribution presentation | A | Maintain an accessible, complete public Credits and Licenses page for required attribution |
| Q174 — Restrictive licenses | A | Exclude assets that prohibit required modification, self-hosting or redistribution; do not equate free viewing with permission |
| Q175 — Engineering suitability review | A | Verify dimensions, topology, normals, assembly separation and plausible mechanical relationships before adoption |
| Q176 — Asset modification workflow | A | Use Blender and reproducible scripts for component splitting, reorientation, rigging and material cleanup |
| Q177 — Editable source preservation | A | Retain source files when redistribution is permitted; otherwise retain only allowed derivatives and internal provenance |
| Q178 — Compression strategy | A | Select Meshopt/Draco and KTX2 per measured asset needs, preserving visual fidelity and decoder compatibility |
| Q179 — LOD and texture strategy | A | Create close-inspection and distance/mobile LODs with visual-difference checks and GPU-memory tests |
| Q180 — Asset registry and credits audit | A | Maintain machine-readable provenance, hashes, licenses, part mapping, sizes and transformation history |
| Q181 — App module boundaries | A | Separate route UI, engine scene, model configuration, numeric solver, learning content and persistence |
| Q182 — Domain state implementation | A | Use small typed Zustand stores with selectors; keep physics functions pure and independently tested |
| Q183 — Component styling | A | CSS custom properties and modular styles with a small headless accessible component layer |
| Q184 — Mathematics rendering | A | KaTeX with semantic source math and accessible text alternatives |
| Q185 — Worker execution protocol | A | Debounce rapid inputs, version worker requests and discard stale results or cancellations |
| Q186 — Offline cache lifecycle | A | Versioned service-worker cache with bounded engine asset retention, updates and recovery behavior |
| Q187 — WebGL failure recovery | A | Accessible 2D schematic, valid technical results and explicit renderer diagnostics |
| Q188 — Reduced-motion behavior | A | Disable continuous motion and tours while maintaining manual frame-based inspection |
| Q189 — Responsive breakpoints | A | Desktop full workspace, tablet simplified viewer/telemetry and mobile lower-detail viewer with technical fallbacks |
| Q190 — Performance acceptance | A | Measure startup, download size, GPU memory, interaction latency and frame pacing on representative devices |
| Q191 — Numerical reference suite | A | Use independently computed and documented turbojet/turbofan cases with cross-checks against trusted educational references |
| Q192 — Conservation tests | A | Automated mass, energy, spool power and nozzle consistency invariants over valid parameter ranges |
| Q193 — Mechanical/physics synchronization | A | Verify part identities, shaft grouping, rotor directions and scene outputs against both engine models |
| Q194 — End-to-end browser testing | A | Cover Chromium, Firefox and WebKit plus desktop and mobile representative interaction paths |
| Q195 — Visual-regression coverage | A | Compare dark/light, engine types, tour/inspection states and representative responsive viewports |
| Q196 — Accessibility acceptance | A | Automated audits plus actual keyboard, screen-reader-oriented semantics and reduced-motion checks |
| Q197 — 3D quality acceptance | A | Inspect close-up geometry, clipping, shading, z-fighting, misaligned components and exploded-view overlap |
| Q198 — Asset/legal release check | A | Block shipping when asset provenance, modifications or redistribution rights are unresolved |
| Q199 — Publishing procedure | A | Build and test on isolated branch, review changes and visual evidence, then merge to master and publish verified gh-pages |
| Q200 — Final release gate | A | Require passing physics, UI, accessibility, asset, performance and recording checks plus final review |

## Final dependent decisions — APPROVED 2026-11-01

| ID | Choice | User-approved implementation requirement |
|---|---|---|
| D01 | **B** | Use source-traceable, independently validated compressor and turbine performance maps to predict off-design shaft speeds in RPM (TJ single spool; TF independent LP/HP). A normalized animation alone does not satisfy this requirement. |
| D02 | **B** | Provide explicit adjustable effective nozzle throat area, including independently adjustable turbofan core/bypass nozzles; reconcile flow capacity, shaft speed, thrust, and actual parametric nozzle geometry in one accepted simulation snapshot. |

D01/D02 are locked **in addition to** Q01–Q200. These selections supersede previously suggested D01=A and D02=A defaults, not the prior 200 user approvals. Implementation details and map-data evidence gates: `OFF_DESIGN_MAPS_AND_NOZZLES.md`. No further user design decision is pending. Scientific calibration and third-party licenses remain implementation evidence requirements.

## Engineering consequences and outstanding verification evidence

- Turbojet and turbofan require distinct geometry and thermodynamic models; never present an incorrect engine type as another.
- Q04 and Q22 require deeper yet explicitly bounded educational physics, not unsubstantiated engine-specific or certification-grade predictions.
- Q08 and Q23 require a persistent telemetry panel that does not visually overpower the engine.
- Q28–Q30 require high-fidelity desktop rendering, deliberately reduced mobile detail, progressive loading and useful offline operation.
- Q12 allows assets subject to terms for public display and redistribution in a public repository; individually verify license, credit, download permissions and modification rights.
- Q27 and Q34 require a React app compatible with static GitHub Pages deployment.
- Q35 prohibits application implementation and deployment until specifications are finalized and approved.
- All 200 decisions and final D01/D02 choices are closed; independent performance-map validation, asset legal evidence and final implementation authorization remain pending.

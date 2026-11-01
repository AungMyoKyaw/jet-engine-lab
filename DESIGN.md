# DESIGN.md — Jet Engine Lab Visual and Interaction System

**Status:** Proposed executable design spec based on user-locked Q07–Q09, Q15–Q21, Q73–Q87, Q131–Q140 and Q151–Q170. Colors, breakpoints and numeric token values below are **design proposals** for implementation, not separately user-locked values. **A partial React/CAD implementation now exists; numeric design tokens remain provisional until measured final visual review.**

## Art direction
A high-end **engineering CAD workbench**, not a flight-game cockpit, marketing landing page or dense spreadsheet dashboard. Mood: precise, quiet, credible, industrial. The engine is the hero; telemetry is always present yet secondary. The UI must visually distinguish verified computed results from conceptual graphics. Blueprint lines are contextual alignment/measurement aids, not wallpaper. Real metallic machinery under controlled studio lighting contrasts with fine blue interface construction lines. Avoid glassmorphism, neon gradients everywhere, fake oscilloscope noise, decorative counters, huge shadows and meaningless microcharts.

## Preliminary semantic tokens (proposal)
| Role | Dark value | Light value | Use |
|---|---|---|---|
| Background | `#0B121C` | `#F3F6F9` | App canvas |
| Surface 1 | `#111E2C` | `#FFFFFF` | Main instrument/lesson panels |
| Surface 2 | `#182B3B` | `#E6EDF2` | Subpanels, hover |
| Viewport | `#0B1824` | `#DFE8EE` | Neutral rendered environment backdrop |
| Main text | `#E9F1F6` | `#172633` | Labels and reading text |
| Secondary text | `#A9BBC9` | `#4B606E` | Metadata and subdued text |
| Hairline | `#344A5B` | `#B8C8D3` | Dividers and diagram guides |
| Selection | `#78DFF4` | `#006C86` | Selection, focus, neutral engineering states |
| Positive | `#80D6B0` | `#146D52` | Valid/healthy state only |
| Warning | `#F8C27A` | `#905000` | Solver constraints and uncertain states |
| Error | `#FF9E97` | `#A63832` | Invalid inputs and failures |

All proposed combinations must be measured for WCAG contrast before adoption: 4.5:1 for normal text, 3:1 for large text and critical graphic boundaries. **Never encode stage identity or temperature by color alone.** Selection cyan is not the temperature ramp. Reserve warning yellow/orange for warnings; temperature colors appear only where a unit/legend clarifies meaning.

**Thermal scale (proposal):** physically grounded Kelvin temperature mapped to a documented normalized range, with legend and numeric tooltip at station/stream. Suggested ramp `#4E9EC4` → `#8BD8D1` → `#F2C56B` → `#E67D50`; use perceptually reasonable interpolation and configurable hatch/labels for color-vision accessibility. Do not imply CFD resolution by painting a continuous gradient on geometry with only station data; segment or interpolate visibly as illustration. Separate core/bypass paths with arrow shape, labeling and/or dash convention.

## Typography and spacing
IBM Plex Sans normal text (400/500/600), IBM Plex Mono numerical tables, units, station names (400/500/600); both from checked license and self-hosted font files at implementation time. Fluid body 14–16px; main lesson prose 16–18px with 1.55–1.7 line height; desktop telemetry primary 34–44px tabular numerals; labels 11–12px sentence-case or restrained uppercase; avoid microtype below 12px for primary controls. Monospace **only** for measured values, equations, IDs and metadata. Heading scale ~28/24/20/16px with 1.15–1.3 leading; no gratuitous 80px hero words.

Proposed spacing base 4px; steps 4/8/12/16/24/32/48. Main panel radii 6–10px, no inflated 24px pill-shaped dashboard. Borders 1px or true viewport separators. Buttons 36–44px height; icon hit targets ≥44×44px for touch; focus halo distinct from selection. Use a restrained 1px grid: spacing tied to dimension/coordinate reference, fading away where diagrams or text require clarity.

## Layout and responsive anatomy
- **Wide desktop (proposed ≥1280px):** 64px top bar with Jet Engine Lab mark, model switcher, Engines / Courses / Analysis / Reference, theme and help. Full-height workbench; compact collapsible part-tree rail (~208px), wide center viewport (dominant remaining area), pinned telemetry dock (~248px). Inspector appears over/under part rail or as reversible drawer, never covering critical engine surfaces. Axial/camera/explode controls are grouped in a narrow scene toolbar. Avoid dual full-height sidebars when viewport drops below minimum.
- **Laptop (proposed 1024–1279px):** shrink/collapse part rail to popover; telemetry remains pinned (~210px), scene receives priority. Scrolling page sections cannot trap scroll-wheel zoom; activate wheel-to-zoom only when viewport focused/explicit interaction. Test actual MacBook 14-inch viewport.
- **Tablet (proposed 768–1023px):** model scene above a telemetry strip; parts and solver controls behind deliberate tabs, not nested card towers.
- **Mobile (<768px proposal):** reduced-detail touch model if WebGL viable; accessible 2D component map and data tables as equal path; telemetry retains thrust and essential readings without hiding others behind inaccessible gestures. Large hit targets; explicitly prevent orbit gestures from causing accidental page scroll only while actively manipulating canvas.
- **Height constraints:** width alone is insufficient; test 900, 768, 600 and 520px viewport heights; handle OS/browser zoom 200% and large-font settings.

## Screen contracts
| Route | Above-the-fold priority | Below/secondary |
|---|---|---|
| Home | Single striking engine preview, precise product promise, two model choices, clear course CTA | Course map, concept experiment, credits, limitations |
| Engines / turbojet | One-spool cutaway, station readout, thrust/fuel/shaft telemetry | Detailed part hierarchy, operating controls and model derivations |
| Engines / turbofan | Fan + two distinct spools, split bypass/core streams, separate exhaust sections | Core/bypass station plots, mass split, N1/N2 reference labeling |
| Analysis | Engine selector / paired comparison, normalized inputs, aligned plots and exported report | Equation assumptions, residuals, source links |
| Courses | Ordered 12–16 module catalogue, progress and prerequisites | Worked examples and references |
| Course chapter | Learning objective, concise prose, diagram/experiment, equations and practice | Hints, feedback, sources and glossary |
| Reference | Searchable symbols/stations, linked citations and engine glossary | Equation derivations, unit conversion |
| Credits | Human-readable per-asset credits, licenses and modifications | Reproducible hashes and source URLs |

## Component library — minimum state matrix
| Component | States |
|---|---|
| Model switcher | Default/hover/focus/loading/active/incompatible-values-reset |
| Part-tree row | Default/hover/selected/isolated/hidden/ghosted/keyboard focus |
| View toolbar | Disabled/active/toggled/projection switch/section unavailable/pressed |
| Explode slider | 0/full/intermediate/keyboard/drag/cancel; value text and reset |
| Camera preset | Targeted/transitioning/interrupted/orthographic/perspective |
| Numeric field | Default/focused/edited/invalid/out-of-envelope/reset/units changed |
| Solver card | Ready/calculating/valid/warning/rejected/stale/last-valid |
| Telemetry | Computed/recently-updated/unavailable/undefined efficiency/units change |
| Chart | Empty/loading/valid/error/hover/focus/export-compatible |
| Lesson quiz | Not-started/in-progress/incorrect/feedback/completed/reset |
| Offline banner | Online/asset download/cache unavailable/update ready/offline fallback |

## Interactions and microbehavior
- **On first load:** clean 3/4 cutaway, no autoplay orbit; load a lightweight lower-detail proxy or thumbnail, then higher detail progressively. Render engine only when scene/asset loads. Exactly one primary instructional hint: 'Drag to orbit · scroll/pinch to zoom · select a part'. Dismiss with first meaningful action and restore by Help.
- **Part selection:** hover previews silhouette/label; click/tap commits selection; inspector shows type, function, spool, relevant stations and lesson link; focus camera without disorienting jump. ESC clears selection once, and returns to prior camera via explicit Back/Reset.
- **Explosion:** zero/partial/full preset, bounded continuous slider, shape-safe hierarchical separation, recomposition by reversing the same transforms. Stop running animations when scene offscreen; animate only actual user intent. Background part fades stay subtle and readable.
- **Sectioning:** axial and radial planes in model coordinates; capping must not distort parts, normals or physical readings. Show line/plane controls; disable unsupported cap on problematic meshes with explanation, not broken geometry.
- **Camera:** orbit with angle/elevation/zoom bounds, front/side/axial/perspective-3/4 presets, orthographic toggle, selected-part focus; smooth transition ~250–400ms. User pointer input immediately cancels tour/camera animation. Clamp physically meaningless camera interior traversal unless explicit exploded/cutaway inspection.
- **Tour:** pause/play and Next/Back; explicit visual indication when running; captions/camera/selected-part timeline synchronized; interruption by user always wins; resume from last complete stop. No compulsory autoplay.
- **Inputs:** separate units from canonical SI data, clear valid ranges, step affordances for precision and direct typed input; debounce worker recomputes (proposal 120–200ms) without changing scientific results. Any computed value with unresolved/stale state visibly labeled. Maintain pinned telemetry but collapse redundant descriptions, not metrics.
- **Sound:** muted initially, active only after user gesture; real audio on/off and volume controls; no essential information conveyed by sound.
- **Reduced motion:** no perpetual rotation, particles, guided autoplay or smooth spatial transitions; manual inspect and numeric results still available.

## Camera and state hierarchy
Independent camera state per engine, but explicit model switching retains matching flight inputs. Predefined target camera transforms and explosion vectors are authored in `docs/ENGINE_ASSEMBLIES.md` then verified against the **final** actual geometry. Scene selection and animations must not mutate solver inputs; solver updates may update cosmetic flow and rotor indication only after a valid result arrives.

## Quality floor and banned shortcuts
- No excessive cards, duplicated labels or misleading huge gauges; **engine dominates** while all required telemetry stays available.
- No faux computed RPM, unsupported OEM claims, or false temperature field claims from animation alone.
- No colorful decorative heat gradients, clipping labels, unreadable dim contrast, exploding meshes through each other, broken focus outlines, scroll-jacking or tiny click targets.
- No third-party model iframe masquerading as independently pickable asset; full component semantics must be available when a model is accepted.
- No broken light theme (charts/canvas/callouts must be separately themed); no flashing or infinite animation that ignores user preferences.
- Test both engines, both themes, high zoom, keyboard-only, touch, slow network, WebGL failure, offline, reduced motion and all saved/invalid input states.

## Assets and brand
Wordmark **Jet Engine Lab**, restrained machine/section symbol; new favicon and cover art may be designed after user implementation approval, without importing logos or manufacturer marks. Use authored CAD-like diagram language with thin leader lines, station ticks, axis compass, exact units and source references. Materials/lighting follow `docs/ENGINE_ASSEMBLIES.md`, asset license gate `docs/ASSET_PROVENANCE.md`.

## Deliverable acceptance for design
**Implementation distinction:** the live UI tokens are in `src/app/ui/style.css` and the React workspace in `src/app/ui/App.tsx`. Responsive screenshots and measured audit findings are in `docs/visual-audit/REVIEW.md`; only the tested views/states are evidenced. The tables above document the target system, not a claim that every proposed color, breakpoint, motion or accessibility acceptance criterion is already implemented. Continue measuring actual rendered contrast, responsive layouts and interaction states before design-system sign-off.

## Final mandatory D01=B / D02=B interactions — supersedes earlier illustrative-speed proposals

**Design/Off-design mode:** expose editable design-point map calibration and component assumptions separately from operating controls; in off-design mode the map solver owns component pressure ratios, corrected flow, efficiencies and shaft RPM. A persistent slim telemetry dock prominently shows map-predicted TJ shaft RPM or TF N1/N2 (LP/HP) in rpm, with source reference, calibration and validity state. Actual model RPM is from the converged worker, while rendered rotational playback is visually slowed and explicitly marked as an animation speed scale. No invented RPM, no claim to measured OEM behavior.

**Variable nozzle area:** show a compact A8 effective throat control for TJ and independent core A8 / bypass A18 controls for TF, with SI/aviation-area units, bounded input and a reset-to-baseline. An inspector separates effective flow area and computed geometric throat area. The 3D nozzle wall/throat rings actually deform to match accepted geometry; dimensions and area measurement overlay update with the same solver result ID, including choked/unchoked state and thrust. While recalculating, show pending intent, not incompatible old telemetry plus newly committed mesh. On validation failure preserve the prior valid nozzle geometry and readouts with a clear diagnostic.

**Interaction states:** map unavailable, source unverified, map outside domain, map-converged-but-geometry-pending, geometry rejected, source-speed uncalibrated, area constraint exceeded; all must have keyboard and screen-reader announcements. Visual regression includes baseline/min/mid/max nozzle area, choke boundary, TF independent nozzle adjustment and both shaft-speed displays in dark/light and reduced-motion states. Nozzle actuator deformation must not intersect fixed turbine exhaust structures.

See `docs/OFF_DESIGN_MAPS_AND_NOZZLES.md`. Earlier design references to purely illustrative/normalized RPM are superseded by the explicit requirement for computed, calibrated model speeds; an animated rotor may still be visually slowed for readability.

## Native web engineering-workspace extension (2026-11-01)

The user approved Q201–Q248=A as the new *direction*: a **browser-native CAD-style studio** with a dominant Three.js scene, compact semantic HTML/React chrome, adaptable instrument panels, technical labels and accessible alternatives. Retain the existing palette/provenance and scientific honesty as baseline; any different final design tokens, dock sizes, camera-tool behavior, panel layouts or breakpoint specifics depend on the ongoing [full grill](docs/NATIVE_WEB_WORKSPACE_GRILL.md), currently Q249–Q320 pending. No assumptions from future rounds are locked. The original Q01–Q200 and D01=B / D02=B remain unchanged. The accepted direction is not evidence of implementation or release approval.

### Workspace shell approval — Round 2 (2026-11-01)

Q249–Q320=A are locked for the target native-feeling web design: compact 44–52px top chrome, scene-dominant viewport, contextual resizable panels, accessible menus/commands, semantic and mobile-first alternatives, light/dark precision themes and versioned layout persistence. Actual dependent CAD picking, gizmo, section and measurement choices are awaiting Round 3. Previous Q01–Q248 and D01=B/D02=B retain their approvals. See [decision record](docs/NATIVE_WEB_WORKSPACE_GRILL.md). No implementation/deployment authorization follows from this design approval.

### Continued independent question frontiers (2026-11-01)

The exhaustive individual-question record now includes **unanswered Q321–Q572**: Round 3 (CAD scene interactions), Round 4 (simulation and analysis), Round 5 (project files and PWA), Round 6 (learning and accessibility), and Round 7 (performance, provenance and release). Questions are prepared with separate A/B/C choices; **none is an approved implementation decision** until the user selects it. Q201–Q320=A and the original Q01–Q200/D01=B/D02=B remain locked. Additional dependent rounds will be generated after these selections, followed by a conflict/architecture-readiness review. No implementation, Git commit/push/merge or deployment.

## Native web CAD implementation approval — 2026-11-01

The user approved the remaining **Q321–Q572=A** defaults and explicitly authorized implementation. Previously approved Q201–Q320=A, Q01–Q200, D01=B and D02=B remain fixed. Requirements are targets, not evidence of completed functionality; unvalidated RPM and full off-design nozzle closure remain release blockers. All 252 individual choices are in [the grilling record](docs/NATIVE_WEB_WORKSPACE_GRILL.md).

## Visual-first experience supersedes the CAD dashboard — 2026-11-01

The engine route now uses a full-window single 3D engine with restrained overlays, five stage pictograms and Explore/Understand/Experiment modes. No permanent panel-heavy CAD layout. Controls remain accessible DOM and SVG; only the engine itself uses interactive WebGL. Previously approved docked-workbench defaults are deferred to optional advanced tools. See [Visual-First Release](docs/VISUAL_FIRST_RELEASE.md).

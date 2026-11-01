# Jet Engine Lab — Native-Feeling Web Workspace Grill

**Implementation authorized:** Native-feeling browser workspace; no Tauri/Electron/SwiftUI. User approved **Q201–Q572=A**, preserving Q01–Q200 and D01=B/D02=B. Implementation and independent scientific acceptance remain distinct.

**Method:** grill-me → grilling. Preserve every numbered A/B/C question and record individual answers. The user asks for all questions, not silent bulk approval. Advance only those decision fronts with settled prerequisites; recompute dependent questions after responses. Do not pre-answer downstream dependencies.

**Technical baseline checked:** React 19, Three.js, React Three Fiber, WebGL, worker-based preview physics, static GitHub Pages, course/analysis/reference views. React Three Fiber v10 WebGPU is documented as alpha with shader-library compatibility caveats (2026-11-01). Canvas-drawn text is not semantically accessible without equivalent DOM. Sources: https://r3f.docs.pmnd.rs/next/migration/v10 , https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/canvas .

## Round 1 — foundation, approved Q201–Q248=A (historical questionnaire)

**Approval recorded:** All 48 A recommendations were explicitly approved on 2026-11-01 without overrides. The original B/C choices below are preserved as historical alternatives.

### A — Product identity and scope

| Question | A — Recommended | B | C |
|---|---|---|---|
| **Q201 · Product identity** | Native-feeling browser CAD/engineering studio | Educational website with 3D sections | General-purpose engine CAD authoring tool |
| **Q202 · Primary audience** | Engineering learners plus technical enthusiasts | Professional aerospace analysts first | Casual visitors first |
| **Q203 · Principal workflow** | Inspect → simulate → measure → learn | Read lessons → launch viewer | Model geometry from scratch |
| **Q204 · Landing behavior** | Open the workspace directly; retain Overview entry | Start on editorial landing page | Guided onboarding every visit |
| **Q205 · Scope boundary** | Redesign workspace UX without weakening existing scientific gates | Simultaneously replace numerical solver | Rebuild complete app from zero |
| **Q206 · Existing approvals** | Preserve Q01–Q200 and D01=B/D02=B unless explicitly amended | Reopen all prior decisions | Replace old spec |
| **Q207 · Site organization** | Studio as main app; courses, analysis and reference as coordinated views | Separate marketing site and studio | Everything inside one 3D scene |
| **Q208 · Delivery priority** | Complete coherent workspace and test before production update | Publish every small UI step | Wait until entire scientific overhaul is done |

### B — Rendering and canvas boundaries

| Question | A — Recommended | B | C |
|---|---|---|---|
| **Q209 · UI rendering split** | 3D Canvas for scene; SVG/Canvas2D visuals as needed; semantic HTML controls | Draw all interface text and controls in Canvas | HTML-only with minimal 3D |
| **Q210 · 3D renderer strategy** | Keep current stable Three.js/R3F WebGL path; evaluate WebGPU migration separately | Adopt R3F v10 alpha/WebGPU immediately | Build custom raw WebGPU renderer |
| **Q211 · Canvas topology** | One primary WebGL canvas reused across workspace modes | Independent WebGL canvases per panel | Multiple simultaneous engine canvases by default |
| **Q212 · Engineering annotations** | Scene-anchored labels/measurements with DOM/SVG accessible alternatives | GPU-only text labels | No labels on model |
| **Q213 · 2D charts and schematics** | Responsive SVG/DOM first; Canvas for dense/animated visualizations | Canvas-only charts | Render charts as 3D objects |
| **Q214 · Visual asset identity** | Original/verified-licensed geometry; optional donor models distinguished | Visual fidelity regardless of provenance | Original procedural geometry only |
| **Q215 · Rendering fidelity** | Adaptive PBR/CAD fidelity with graceful fallback | Max-quality everywhere | Low-cost schematic rendering only |
| **Q216 · Motion realism** | Explicit distinction between physical outputs and visual animation | Free cinematic effects without status labels | No animation |

### C — Workspace, UI and interaction

| Question | A — Recommended | B | C |
|---|---|---|---|
| **Q217 · Viewport layout** | Full-height desktop-like workspace without body scrolling | Traditional scrollable site layout | Fullscreen-only 3D view |
| **Q218 · Viewport dominance** | Engine occupies most usable area; instruments secondary | Equal viewer and dashboard space | Charts dominate |
| **Q219 · Panel management** | Resizable, collapsible docks with initial workspace presets | Fully floating windows only | Static, fixed panels |
| **Q220 · Docking ambition** | Reliable predefined docking/resizing first; advanced drag layouts later | Full IDE-style drag docking at initial release | No docking |
| **Q221 · Application chrome** | Compact top menu/toolbar, status bar and command palette | Website header and hero on every view | Floating icons only |
| **Q222 · Interaction paradigm** | Explicit CAD tool modes (select, orbit, pan, measure, section) | One context-sensitive tool | Tour-only experience |
| **Q223 · Input methods** | Mouse, trackpad, keyboard and touch | Desktop pointer only | Touchscreen primary |
| **Q224 · Workspace presets** | Inspection, Simulation, Analysis and Learning layouts | One fixed workspace | Arbitrary saved layouts only |
| **Q225 · Panel/layout persistence** | Versioned, locally restored per-device preferences | Reset layout every visit | Require cloud profile |
| **Q226 · Design language** | Original aerospace CAD: restrained graphite/navy, precise engineering accents | High-energy sci-fi cockpit | Clone Fusion/Blender visually |
| **Q227 · Information density** | Compact by default; optional comfort/readability density | Dense professional-only interface | Spacious presentation-only interface |
| **Q228 · Themes** | Fully supported dark and light themes | Dark only | Follow OS with no override |
| **Q229 · Mobile scope** | Focused inspection/simulation, bottom-sheet tools and 2D fallback | Complete desktop docking on phones | Mobile read-only |
| **Q230 · Guided discovery** | Contextual, dismissible onboarding plus discoverable shortcuts | Mandatory walkthrough | No onboarding |

### D — Platform, projects and data

| Question | A — Recommended | B | C |
|---|---|---|---|
| **Q231 · Supported browsers** | Recent Chromium, Safari and Firefox with fallbacks | Chromium only | Safari only |
| **Q232 · Hosting model** | Remain a static GitHub Pages app with client-side compute | Move app to required hosted backend | Desktop wrapper |
| **Q233 · Installability** | Optional installable PWA with standalone window mode | Browser tab only | Require PWA installation |
| **Q234 · Offline behavior** | Versioned offline engine/assets/lessons with safe cache updates | Network required | One-time immutable download |
| **Q235 · Accounts** | No account required | Optional account in initial version | Mandatory login |
| **Q236 · Project files** | Versioned local open/save/export project format | URL state only | No project persistence |
| **Q237 · Sharing/collaboration** | Share versioned input/state via URL; no live multi-user initially | Real-time multiplayer collaboration | No sharing |
| **Q238 · Privacy/analytics** | No third-party behavioral tracking by default | Opt-in anonymized usage telemetry | Standard product analytics |

### E — Quality, constraints and release

| Question | A — Recommended | B | C |
|---|---|---|---|
| **Q239 · Performance target** | Measured adaptive quality and responsive interaction; degrade gracefully | Absolute highest visuals at any cost | Low fidelity everywhere |
| **Q240 · Accessibility baseline** | Keyboard equivalents, semantic inspectors, screen-reader data, 2D fallback | Basic ARIA labels only | Canvas-only interaction |
| **Q241 · Scientific integrity** | Same accepted solver snapshot drives geometry, readouts and export | Allow independent decorative data for immersion | Hide scientific outputs entirely |
| **Q242 · Unverified features** | Label/disable unsupported engineering claims, especially RPM | Show approximate RPM without validation | Omit engineering disclaimers |
| **Q243 · Education integration** | Contextual lesson/derivation drawer linked to selected component | Courses entirely separate | Replace lessons with cinematic tours |
| **Q244 · Comparisons** | Mode-driven side-by-side analytical comparison; preserve one main viewport by default | Dual WebGL viewports always visible | No comparisons |
| **Q245 · Exports** | Screenshots, project state, CSV and future verified reports | Screenshot only | No exports |
| **Q246 · Release controls** | Isolated branch, screenshot/test QA, then approved master/Pages update | Edit and push master continuously | Create separate new repository |
| **Q247 · Quality evidence** | Playwright visual/interaction/keyboard/performance tests across representative devices | Manual screenshot review only | Unit tests only |
| **Q248 · Final acceptance** | Complete approved workspace contract and retain D01/D02 scientific release gates | Visual acceptance alone marks engineering product complete | No explicit release gates |

## Dependent rounds — planned areas, not yet answerable

- **Round 2:** physical workspace anatomy and sizing: toolbar/docks, panel drag/resize, grid, chrome, context menus, breakpoint design.
- **Round 3:** canvas scene interaction: CAD picking, gizmos, section planes, measurement, materials, camera, explosion, visual flow and labels.
- **Round 4:** simulation/data workflows: input state, history, inspector↔physics sync, charts, timeline, comparison and error states.
- **Round 5:** project files/persistence/PWA: versioned saves, imports/exports, offline packages and update/recovery.
- **Round 6:** learning, accessibility, mobile, keyboard, touch and assistive equivalents.
- **Round 7:** rendering performance, quality tiers, source/licensing, visual regression and security/privacy.
- **Round 8+:** dependencies discovered during answers, conflicts, exact release gates, final complete architecture-readiness review.

**No implementation authorization from this questionnaire.** Do not modify application code, commit, push or deploy while design questions remain open.

## Round 1 decision record — approved 2026-11-01

The user approved **every Q201–Q248=A** without overrides. This records all 48 individual approvals, not merely a proposed default. Previous Q01–Q200 and D01=B / D02=B remain unchanged. These decisions concern **the browser-based, native-feeling workspace redesign** and do not change underlying physics validation requirements.

| Approved ID | Choice | Approved ID | Choice | Approved ID | Choice | Approved ID | Choice |
|---|---|---|---|---|---|---|---|
| Q201 | **A** | Q213 | **A** | Q225 | **A** | Q237 | **A** |
| Q202 | **A** | Q214 | **A** | Q226 | **A** | Q238 | **A** |
| Q203 | **A** | Q215 | **A** | Q227 | **A** | Q239 | **A** |
| Q204 | **A** | Q216 | **A** | Q228 | **A** | Q240 | **A** |
| Q205 | **A** | Q217 | **A** | Q229 | **A** | Q241 | **A** |
| Q206 | **A** | Q218 | **A** | Q230 | **A** | Q242 | **A** |
| Q207 | **A** | Q219 | **A** | Q231 | **A** | Q243 | **A** |
| Q208 | **A** | Q220 | **A** | Q232 | **A** | Q244 | **A** |
| Q209 | **A** | Q221 | **A** | Q233 | **A** | Q245 | **A** |
| Q210 | **A** | Q222 | **A** | Q234 | **A** | Q246 | **A** |
| Q211 | **A** | Q223 | **A** | Q235 | **A** | Q247 | **A** |
| Q212 | **A** | Q224 | **A** | Q236 | **A** | Q248 | **A** |

## Round 2 — complete currently unlocked decision frontier (Q249–Q320)

**Approved 2026-11-01:** The user separately confirmed **all Q249–Q320=A**, with no overrides. Every table row below is an approved design decision; its B/C columns preserve rejected alternatives. Later-dependent decisions remain open.

### A. Application shell and screen geometry

| ID · Decision | A — Recommended | B | C |
|---|---|---|---|
| **Q249 · Default workspace** | Inspection workspace opens with active engine | Simulation workspace opens by default | Resume the last-viewed page regardless of mode |
| **Q250 · Canvas allocation** | Aim for 68–78% usable desktop workspace width | Exactly half-width canvas | Canvas always full-screen with all UI overlay |
| **Q251 · Top chrome height** | Compact 44–52px command/title row | Large 70–90px header | No fixed top chrome |
| **Q252 · Primary tool placement** | Horizontal tool row aligned with the canvas | Left vertical toolbar only | Radial tools only |
| **Q253 · Global navigation rail** | Slim collapsible left workspace rail | Full-width permanent navigation sidebar | No workspace navigation rail |
| **Q254 · Default inspector placement** | Context inspector docked on right | Inspector always below viewport | Inspector opens as a floating modal |
| **Q255 · Bottom workspace area** | Collapsed until charts, timeline or console are requested | Always-open bottom dock | No bottom dock |
| **Q256 · Status bar** | Small persistent status strip with simulation validity | Large multi-row instrumentation footer | No status bar |
| **Q257 · Project/document identity** | Show project name, active engine and unsaved state in chrome | Only browser tab title | Detailed project header above scene |
| **Q258 · Modes navigation** | Workspace tabs with browser-history/deep-link support | Separate full-page reloads | Floating radial navigation only |
| **Q259 · Scrolling contract** | No document scrolling in studio; panels scroll independently | Whole studio page scrolls | Canvas captures all wheel scroll |
| **Q260 · Fullscreen behavior** | Browser fullscreen toggles via shortcut and visible button | Fullscreen is required to simulate | Never offer fullscreen |
| **Q261 · Small desktop contract** | Support 1024×700 with adapted panel widths | Require at least 1440×900 | Treat anything below 1280 as mobile UI |
| **Q262 · Ultrawide utilization** | Use available canvas area; bound instrument and inspector widths | Constrain whole application to fixed max width | Stretch every panel proportionally |

### B. Panel docking, resizing, and layout state

| ID · Decision | A — Recommended | B | C |
|---|---|---|---|
| **Q263 · Component navigation** | Searchable engine subsystem tree in left dock | Unstructured flat parts list | Click-only inspection in viewport |
| **Q264 · Inspector content hierarchy** | Selection properties, data, actions and provenance separated by tabs | Single continuous dense property list | Selection popup only |
| **Q265 · Initial left-dock state** | Slim tools rail visible; parts tree collapsible | Full parts tree always open | Hide all left navigation by default |
| **Q266 · Initial right-dock state** | Compact inspector visible in Inspection preset | Right inspector always hidden | Right inspector permanently expanded |
| **Q267 · Default left dock width** | 220–280px when expanded | At least 400px | Fixed 160px |
| **Q268 · Default right dock width** | 280–360px when expanded | 480px or more | Fixed 200px |
| **Q269 · Dock min/max constraints** | Clamp widths to preserve usable canvas; handle narrow screens | Unlimited resizing | Fixed widths without user resize |
| **Q270 · Resize interaction** | Pointer drag plus keyboard-accessible resize handles | Pointer drag only | Buttons for preset widths only |
| **Q271 · Resize performance** | Update dock widths smoothly without rebuilding the 3D scene | Recreate scene on resize | Resize only after drag release |
| **Q272 · Collapsed panel memory** | Restore last user-sized width when reopened | Always return to default width | Never remember size |
| **Q273 · Dock movement in first release** | Move supported panels among predefined left/right/bottom slots | Arbitrary floating IDE panes immediately | Never move panels |
| **Q274 · Dock tab organization** | Multiple compatible panels grouped as selectable tabs | Independent visible panels for every tool | Only one panel can exist |
| **Q275 · Canvas occlusion policy** | Reserve safe viewport insets for controls and overlays | Allow dock panels to cover the engine | Always hide overlays while camera moves |
| **Q276 · Selection across layouts** | Preserve selected part and accepted operating state during mode/layout changes | Reset everything per mode | Preserve selection only |
| **Q277 · Layout reset** | Restore selected preset without deleting projects or saved simulation inputs | Global reset erases every preference | No reset command |
| **Q278 · Focus and overlay dismissal** | Escape closes transient inspectors/menus; focus returns to trigger | Escape resets camera and engine | Ignore Escape for panels |

### C. Commands, menus, and workflow feedback

| ID · Decision | A — Recommended | B | C |
|---|---|---|---|
| **Q279 · Menu taxonomy** | File / Edit / View / Simulation / Tools / Learn / Help | One unstructured giant menu | Only icon-based controls |
| **Q280 · Command palette** | Cmd/Ctrl+K searchable commands, modes and parts | No command palette | Palette requires a modifier plus two keys |
| **Q281 · Shortcut defaults** | Documented macOS and Windows/Linux equivalents | macOS shortcuts only | User must assign every shortcut |
| **Q282 · Input conflict resolution** | Text fields and assistive commands take precedence over global shortcuts | Global shortcuts always intercept | Disable keyboard shortcuts when a panel is open |
| **Q283 · Active tool visibility** | Clearly indicate active selection/navigation/measurement tool | Cursor shape is the only indication | Hide active tool when idle |
| **Q284 · Right-click menus** | Accessible context menus scoped to selected part and stage | Browser-native menu only | All commands require toolbar navigation |
| **Q285 · Toolbar labels** | Icons plus labels for critical commands; dense mode may collapse labels | Icons exclusively | Text buttons exclusively |
| **Q286 · Tooltips and help** | Delay tooltips; show shortcut and concise engineering effect | Always visible verbose tooltips | No tooltips |
| **Q287 · Status bar contents** | Units, model validity, current selection, view mode and background task | Only frames per second | Full telemetry duplicate |
| **Q288 · Notification channels** | Inline field errors, nonblocking toasts and explicit persistent blockers | All alerts as modal dialogs | All feedback as temporary toast |
| **Q289 · Long calculation feedback** | Cancel/retry and last-valid-result indicators for expensive jobs | Blocking loading spinner resets canvas | No status until complete |
| **Q290 · Undo/redo scope** | Reversible UI edits and input-state changes; simulation history separate | Undo every animation frame | Undo selection only |
| **Q291 · Property edit behavior** | Live preview with validation, reversible accepted changes | Submit full form before changing any input | Accept invalid input temporarily as output |
| **Q292 · Numerical failure presentation** | Keep last valid result, show cause, distinguish stale from current | Replace failed calculation with zeros | Hide all telemetry after failure |

### D. Design system and technical visualization

| ID · Decision | A — Recommended | B | C |
|---|---|---|---|
| **Q293 · Viewport visual tone** | Graphite/navy CAD stage with readable lighting and depth | Bright sci-fi neon cockpit | Pure-black blueprint only |
| **Q294 · Accent hierarchy** | Single primary cyan plus restrained semantic thermal/warning colors | Many equally strong accent colors | Monochrome only |
| **Q295 · Light theme parity** | Purpose-built light theme including viewport/chart contrast | Invert dark palette automatically | Disable light mode in canvas |
| **Q296 · Typography pairing** | IBM Plex Sans UI + IBM Plex Mono engineering values | Decorative display fonts everywhere | System font with no monospaced data |
| **Q297 · Density control** | Compact default with comfortable alternative and scalable typography | One unchangeable dense layout | Huge default controls everywhere |
| **Q298 · Geometry of UI elements** | Subtle 2–6px corners and precise hairline borders | Fully rounded consumer dashboard | Sharp unstyled browser defaults |
| **Q299 · Layering and shadows** | Minimal shadows; hierarchy from spacing, material and borders | Heavy glassmorphism throughout | No separation between layers |
| **Q300 · Canvas overlay strategy** | Reserve consistent safe zones and prevent occluded technical data | Overlay all controls on model | Never draw overlay controls |
| **Q301 · Micro-interaction timing** | Subtle 120–220ms UI transitions; respect reduced-motion settings | Long cinematic transitions in all UI | No animated state feedback |
| **Q302 · Selection feedback** | Consistent outline/highlight and corresponding inspector entry | Material replacement without indication | Tooltip only |
| **Q303 · Thermal/flow color semantics** | Legend and explicitly labeled computed versus illustrative overlays | Decorative thermal glow with no legend | Never use thermal colors |
| **Q304 · Reference grid/axes** | Toggle world grid, axis triad and reference frame labels independently | Permanent bright grid | No reference frame indication |
| **Q305 · Charts visual system** | Shared station colors, unit formatting and accessible point/table equivalents | A separate unrelated chart style | Only numeric text readouts |
| **Q306 · Empty/loading/error states** | Informative placeholders with actionable retry and fallback | Blank panels until ready | Spinners with no context |

### E. Responsive, accessibility, and persisted shell behavior

| ID · Decision | A — Recommended | B | C |
|---|---|---|---|
| **Q307 · Tablet breakpoint** | Adaptive dock collapse around 900px with resizable canvas | Force desktop docking at every width | Switch to phone UI at 1200px |
| **Q308 · Phone breakpoint** | Focused mobile layout around 640px; no full IDE dock dragging | Full desktop chrome squeezed into phone | Phone has a different product |
| **Q309 · Mobile command access** | Two-row priority tool dock with overflow command sheet | Horizontally scrolling toolbar only | Hide all tools behind a menu |
| **Q310 · Mobile inspector** | Accessible bottom sheet with snap points and explicit close | Permanent full-height sidebar | Tiny hover popover |
| **Q311 · Mobile part navigation** | Searchable compact hierarchy and 3D tap selection | Desktop tree always visible | 3D tap selection only |
| **Q312 · Mobile initial stage** | Engine and throttle first; secondary docks closed | Show every metric before model | Show only a poster image |
| **Q313 · Device orientation** | Support both portrait and landscape; adapt stage and inspector | Portrait only | Landscape only |
| **Q314 · Touch controls** | Target at least ~44px touch actions without sacrificing desktop density | Desktop-size 24px icons on phones | Oversized targets everywhere |
| **Q315 · Safe areas** | Respect browser/OS insets and software keyboard resize | Assume rectangular full screen | Disable mobile fullscreen |
| **Q316 · Keyboard access** | Roving or ordered focus, shortcuts, reachable resizers and escape behavior | Pointer-only dock management | Keyboard use limited to forms |
| **Q317 · Assistive readout** | Announce meaningful accepted state changes; station data in semantic table | Announce every animation frame | No assistive updates |
| **Q318 · Contrast and color independence** | Check WCAG contrast; never encode validity by color alone | Use color only for all statuses | Force all screens into one high-contrast palette |
| **Q319 · Zoom and text scaling** | Retain controls and data at 200% browser zoom without horizontal document scrolling | Disable text zoom support | Require desktop width for zoomed views |
| **Q320 · Workspace preference schema** | Versioned local preferences with recovery/default reset | Store raw component state without migration | Mandatory cloud settings service |

## Further dependent rounds (to be asked in full after Round 2 answers)

**Round 3 — 3D/CAD interaction tree:** component hit testing, selection hierarchy, layers, section planes, measurement, camera, explode, visualization, physical/illustrative animation.

**Round 4 — simulator/analyst tree:** validated input model contract, live telemetry timing, history, comparison, plots, annotation provenance and solver/error convergence.

**Round 5 — project files and PWA tree:** versioned file formats, edit history, open/save, link sharing, offline update/rollback and local-device recovery.

**Round 6 — educational/accessibility tree:** lesson interactions, full course boundaries, keyboard/screen-reader tests, mobile and touch details.

**Round 7 — graphics/performance/release tree:** LODs, memory limits, frame timing, provenance, browser verification, native-feeling UI QA and release mechanics.

**Round 8+:** recompute the open frontier after each answer; ask every remaining applicable dependent question, then run contradictions and architecture readiness. The count is intentionally not capped.

## Round 2 decision record — approved 2026-11-01

User approved **every Q249–Q320=A (72 individually numbered questions)**, with no overrides. The complete decision meanings and rejected B/C alternatives remain in the Round 2 table above. Prior Q01–Q248 and D01=B/D02=B retain their original decisions.

| ID | Choice | ID | Choice | ID | Choice | ID | Choice |
|---|---|---|---|---|---|---|---|
| Q249 | **A** | Q267 | **A** | Q285 | **A** | Q303 | **A** |
| Q250 | **A** | Q268 | **A** | Q286 | **A** | Q304 | **A** |
| Q251 | **A** | Q269 | **A** | Q287 | **A** | Q305 | **A** |
| Q252 | **A** | Q270 | **A** | Q288 | **A** | Q306 | **A** |
| Q253 | **A** | Q271 | **A** | Q289 | **A** | Q307 | **A** |
| Q254 | **A** | Q272 | **A** | Q290 | **A** | Q308 | **A** |
| Q255 | **A** | Q273 | **A** | Q291 | **A** | Q309 | **A** |
| Q256 | **A** | Q274 | **A** | Q292 | **A** | Q310 | **A** |
| Q257 | **A** | Q275 | **A** | Q293 | **A** | Q311 | **A** |
| Q258 | **A** | Q276 | **A** | Q294 | **A** | Q312 | **A** |
| Q259 | **A** | Q277 | **A** | Q295 | **A** | Q313 | **A** |
| Q260 | **A** | Q278 | **A** | Q296 | **A** | Q314 | **A** |
| Q261 | **A** | Q279 | **A** | Q297 | **A** | Q315 | **A** |
| Q262 | **A** | Q280 | **A** | Q298 | **A** | Q316 | **A** |
| Q263 | **A** | Q281 | **A** | Q299 | **A** | Q317 | **A** |
| Q264 | **A** | Q282 | **A** | Q300 | **A** | Q318 | **A** |
| Q265 | **A** | Q283 | **A** | Q301 | **A** | Q319 | **A** |
| Q266 | **A** | Q284 | **A** | Q302 | **A** | Q320 | **A** |

**Status:** Q201–Q320 approved A. Round 3 decisions pending. The user requests each subsequent question individually, rather than bulk approval. No application code changes, commits, pushes, merges or deployment authorized.

## Round 3 — CAD Canvas and engineering interaction (Q321–Q392)

**Pending questions, individually numbered.** Each A is a recommendation, not approval. The user requires every question to be asked explicitly; do not offer bulk approval. Previously approved: Q01–Q320 and D01=B / D02=B.

### A. Component selection and model hierarchy

#### Q321 — Component picking

**A — Recommended:** Accurate raycasting on selectable groups.
**B:** Pick proxy boxes only.
**C:** Tree selection only.

#### Q322 — Hover feedback

**A — Recommended:** Subtle hover outline and name, no selection change.
**B:** Select on hover.
**C:** No hover state.

#### Q323 — Click through geometry

**A — Recommended:** Pick nearest visible eligible surface.
**B:** Pick through every surface.
**C:** Select whole engine.

#### Q324 — Overlapping components

**A — Recommended:** Offer hit-list and cycle-selection shortcut.
**B:** Only frontmost part.
**C:** Require manual hiding.

#### Q325 — Hierarchy granularity

**A — Recommended:** Subsystem, component and mesh-detail levels.
**B:** One flat mesh list.
**C:** Assemblies only.

#### Q326 — Multiple selection

**A — Recommended:** Shift/modifier additive selection.
**B:** Single selection only.
**C:** Select adjacent parts automatically.

#### Q327 — Tree and Canvas sync

**A — Recommended:** Bidirectional part selection and focus.
**B:** Independent selection states.
**C:** Tree labels only.

#### Q328 — Switching engine

**A — Recommended:** Remember per-engine selections separately.
**B:** Carry IDs across different engines.
**C:** Forget selections.

#### Q329 — Selection appearance

**A — Recommended:** Outlined/emissive highlight retaining actual material.
**B:** Replace full material color.
**C:** Text label only.

#### Q330 — Hide and isolate

**A — Recommended:** Reversible visibility; never alter solver inputs.
**B:** Delete hidden geometry.
**C:** No hide tool.

#### Q331 — Focus selection

**A — Recommended:** Fit selected component; reversible previous view.
**B:** Fixed zoom distance.
**C:** Jump to world origin.

#### Q332 — Selection metadata

**A — Recommended:** Role, shaft, stations, provenance and validity.
**B:** Unverified exact values.
**C:** Name only.

### B. Cameras and spatial navigation

#### Q333 — Mouse navigation

**A — Recommended:** Documented CAD orbit, pan and zoom mappings.
**B:** FPS navigation.
**C:** Undocumented gestures.

#### Q334 — Orbit pivot

**A — Recommended:** Cursor/selection-aware pivot with recenter.
**B:** World origin only.
**C:** Jump pivot on hover.

#### Q335 — Zoom behavior

**A — Recommended:** Smooth bounded zoom-to-cursor.
**B:** Unbounded exponential zoom.
**C:** Fixed discrete steps.

#### Q336 — Pan behavior

**A — Recommended:** Middle/Shift-drag and trackpad/keyboard equivalents.
**B:** Orbit only.
**C:** Left drag always pans.

#### Q337 — Camera presets

**A — Recommended:** Isometric, front, rear, top, side, axial and part-fit.
**B:** Three-quarter only.
**C:** No presets.

#### Q338 — Camera transitions

**A — Recommended:** Short interruptible easing and reduced-motion instant mode.
**B:** Long cinematic transitions.
**C:** Always snap.

#### Q339 — Projection mode

**A — Recommended:** Perspective and orthographic technical mode.
**B:** Perspective only.
**C:** Orthographic only.

#### Q340 — Camera clipping

**A — Recommended:** Scene-aware near/far to prevent clipping and z-fighting.
**B:** Static near/far.
**C:** Disable depth test.

#### Q341 — Reset camera

**A — Recommended:** Reset camera/projection only, preserve simulation.
**B:** Reset every input.
**C:** Reload browser.

#### Q342 — Save views

**A — Recommended:** Project-specific named views plus temporary views.
**B:** One global camera state.
**C:** Never save views.

#### Q343 — Free-fly mode

**A — Recommended:** Off by default; optional later after accessibility review.
**B:** Always-on FPS mode.
**C:** Pointer lock required.

#### Q344 — Axes triad

**A — Recommended:** Clickable axes with frame labels.
**B:** Decorative axes only.
**C:** Hide axes.

### C. Measurement, snapping, annotation

#### Q345 — Distance measurement

**A — Recommended:** Two selected geometry anchors with world-space distance.
**B:** Screen-pixel estimates.
**C:** Typed distances only.

#### Q346 — Angle measurement

**A — Recommended:** Three points or vectors with explicit reference plane.
**B:** Visual protractor only.
**C:** No angle tool.

#### Q347 — Snapping

**A — Recommended:** Toggleable vertex, edge, center and plane snaps.
**B:** Snap to pixels.
**C:** No snapping.

#### Q348 — Units

**A — Recommended:** SI default, labeled unit switch and exact conversions.
**B:** Imperial only.
**C:** Unitless values.

#### Q349 — Unverified geometry

**A — Recommended:** Mark dimensions illustrative unless source scale validated.
**B:** Claim exact tolerances.
**C:** Disable all measurements.

#### Q350 — Measurement precision

**A — Recommended:** Limit significant digits to verified geometric accuracy.
**B:** Nine decimals everywhere.
**C:** Integer values only.

#### Q351 — Annotation types

**A — Recommended:** Anchored notes, dimensions and station/component callouts.
**B:** Screen-only sticky notes.
**C:** No annotations.

#### Q352 — Measurement persistence

**A — Recommended:** Versioned per-project data plus temporary mode.
**B:** Global across projects.
**C:** Always discard.

#### Q353 — Annotation editing

**A — Recommended:** Inspector forms and optional handles.
**B:** Canvas text entry only.
**C:** Immutable annotations.

#### Q354 — Annotation export

**A — Recommended:** Snapshot, anchors, units, provenance and validity.
**B:** Plain image only.
**C:** Proprietary binary only.

#### Q355 — Reference coordinates

**A — Recommended:** Explicit component/engine/world frames and transforms.
**B:** Mix local/world silently.
**C:** Camera-pixel coordinates.

#### Q356 — Manufacturing claims

**A — Recommended:** Never assert verified clearance without verified geometry.
**B:** Claim production-accuracy.
**C:** Hide qualifications.

### D. Section, explode, visibility

#### Q357 — Sectioning scope

**A — Recommended:** One true clipping plane initially; validated multi-plane later.
**B:** Unlimited planes at release.
**C:** No section tool.

#### Q358 — Section positioning

**A — Recommended:** Gizmo, numeric offset, axis presets and reset.
**B:** Pointer only.
**C:** Fixed center plane.

#### Q359 — Clipped surfaces

**A — Recommended:** Caps/hatching where topology supports; disclose gaps.
**B:** Fake solid caps everywhere.
**C:** Unlabeled holes.

#### Q360 — Section material treatment

**A — Recommended:** Distinct cut faces retaining component identity.
**B:** One global flat material.
**C:** Hide uncut geometry.

#### Q361 — Section target

**A — Recommended:** Whole engine or selected subsystem.
**B:** Whole engine only.
**C:** Pre-rendered single cut.

#### Q362 — Plane controls

**A — Recommended:** Enable/invert, slider and numeric transform per plane.
**B:** Reset button only.
**C:** Reload to apply.

#### Q363 — Explode presets

**A — Recommended:** Whole engine and subsystem-focused explosion.
**B:** Random scatter.
**C:** Only single fixed linear path.

#### Q364 — Explode scale

**A — Recommended:** Bounded 0–100% magnitude and reset.
**B:** Unlimited separation.
**C:** On/off toggle.

#### Q365 — Displacement paths

**A — Recommended:** Component-hierarchy-driven local axes.
**B:** Random paths.
**C:** Always screen horizontal.

#### Q366 — Exploded framing

**A — Recommended:** Fit displaced bounds without changing orbit direction.
**B:** Clip offscreen parts.
**C:** Snap default camera.

#### Q367 — Combining view tools

**A — Recommended:** Composable hide, clip and explode with indicators.
**B:** Last tool silently clears others.
**C:** Prevent combinations.

#### Q368 — Scoped reset

**A — Recommended:** Independent camera/section/explode/visibility resets plus full view reset.
**B:** Destructive global reset.
**C:** Reload page.

### E. Visual layers and physical depiction

#### Q369 — Visibility layers

**A — Recommended:** Independent casing, shafts, blades, flow, labels and measurements.
**B:** Global show/hide only.
**C:** No layers.

#### Q370 — Rendering modes

**A — Recommended:** PBR, technical material ID and wireframe/ghost.
**B:** Photorealistic only.
**C:** Neon outline only.

#### Q371 — Thermal overlay source

**A — Recommended:** Accepted station values; interpolation explicitly illustrative.
**B:** Decorative heat presented as measured.
**C:** No thermal display.

#### Q372 — Airflow depiction

**A — Recommended:** Separate core/bypass with legend and validity.
**B:** Unlabeled single stream.
**C:** Static arrows only.

#### Q373 — Animation controls

**A — Recommended:** Play/pause and variable illustrative rate; reduced motion.
**B:** Uncontrollable continuous animation.
**C:** Never animate.

#### Q374 — Shaft RPM integrity

**A — Recommended:** Show physical RPM only once validated; otherwise visual-only.
**B:** Estimate RPM from throttle.
**C:** No rotor animation.

#### Q375 — X-ray transparency

**A — Recommended:** Per-layer ghost controls and depth-aware selection.
**B:** Whole scene transparent.
**C:** No X-ray.

#### Q376 — Station labels

**A — Recommended:** Scene-anchored labels linked to accessible data.
**B:** Disconnected decorative text.
**C:** Reference page only.

#### Q377 — Legends

**A — Recommended:** Contextual units, source and validity legend.
**B:** Huge persistent legend.
**C:** No legend.

#### Q378 — Environment lighting

**A — Recommended:** Stable Studio/Neutral/Inspection presets.
**B:** Random HDRI.
**C:** Fixed lighting.

#### Q379 — Canvas backgrounds

**A — Recommended:** Dark CAD, light studio and high-contrast schematic.
**B:** Animated wallpapers.
**C:** Always transparent.

#### Q380 — Reference-model separation

**A — Recommended:** CC0 donor model clearly labeled visual-only.
**B:** Use donor as certified solver geometry.
**C:** Remove reference model.

### F. Scene state, accessibility and reliability

#### Q381 — WebGL context loss

**A — Recommended:** Preserve state; controlled recovery and 2D fallback.
**B:** Reload and discard.
**C:** Blank Canvas.

#### Q382 — Geometry-load failure

**A — Recommended:** Part-specific error, retry and schematic fallback.
**B:** Silently omit missing parts.
**C:** Crash workspace.

#### Q383 — Graphics quality

**A — Recommended:** Adaptive levels plus manual override; metrics deferred to performance round.
**B:** Maximum quality only.
**C:** Minimum quality only.

#### Q384 — Nonvisual scene access

**A — Recommended:** Keyboard part tree, 2D schematic and semantic data tables.
**B:** Announce raw vertices.
**C:** No alternative.

#### Q385 — Screenshot types

**A — Recommended:** Clean scene, annotated scene or whole workspace with optional metadata.
**B:** Browser screenshot only.
**C:** Always all panels.

#### Q386 — Scene and physics link

**A — Recommended:** Selected part references same accepted solver snapshot.
**B:** Independent UI-generated values.
**C:** No component data.

#### Q387 — View vs physics changes

**A — Recommended:** View controls never modify solver; physical geometry inputs request recalculation.
**B:** Orbit changes physics.
**C:** Geometry never syncs.

#### Q388 — Shared state architecture

**A — Recommended:** Typed centralized view state and stable component IDs.
**B:** Duplicated local state copies.
**C:** Mutable mesh is source of truth.

#### Q389 — Undoable scene actions

**A — Recommended:** Scoped undo for annotations, visibility, section, explode and camera.
**B:** Undo animation frames.
**C:** No undo.

#### Q390 — Keyboard commands

**A — Recommended:** Access select, focus, orbit/pan, section, measure and hide/isolate.
**B:** Selection only.
**C:** Mouse required.

#### Q391 — Canvas right-click

**A — Recommended:** Part-scoped accessible context menu with browser fallback.
**B:** Block all browser menus.
**C:** Right-click orbits.

#### Q392 — Verification scope

**A — Recommended:** Inspect geometry fit, tools, validity, 2D fallback and screenshots across modes.
**B:** One polished screenshot.
**C:** Unit tests only.

## Next dependent rounds

Round 4: solver, station telemetry, history and comparison. Round 5: project formats, PWA and offline recovery. Round 6: curriculum, mobile accessibility and assistive behaviors. Round 7: rendering budgets, provenance and release validation. Additional decision-tree rounds continue until all remaining dependent questions are resolved.

**Status:** Q321–Q392 not yet approved. No application code changes, commits, pushes, merges or deployment.

## Round 4 — Independent simulation, telemetry, analysis and state frontier (Q393–Q464)

**All questions pending.** Q321–Q392 also remain pending. This frontier covers choices grounded in approved Q201–Q320 and fixed D01=B/D02=B; it avoids assuming answers to the open Round 3 CAD-specific questions. Each question is written separately, with A/B/C, not a batch approval.

### A. Canonical simulation state and model contracts

#### Q393 — What is the canonical app state boundary?

**A — Recommended:** Separate project inputs, accepted computed snapshot and view-only state.
**B:** One mutable object for everything.
**C:** Three.js mesh data owns solver state.

#### Q394 — How should accepted results be identified?

**A — Recommended:** Versioned result ID plus input hash and model version.
**B:** Use last render time only.
**C:** No result identity.

#### Q395 — Where should expensive calculations execute?

**A — Recommended:** Web Worker with typed messages and bounded runtime.
**B:** Main UI thread.
**C:** Required remote server.

#### Q396 — What constitutes an atomic update?

**A — Recommended:** Update geometry, telemetry and chart data only from the same accepted result.
**B:** Update each panel independently.
**C:** Show optimistic fabricated outputs.

#### Q397 — How should rapid slider changes be scheduled?

**A — Recommended:** Coalesce previews and apply the latest validated request.
**B:** Compute every pointer event without bound.
**C:** Calculate only after releasing every slider.

#### Q398 — Should results be reproducible?

**A — Recommended:** Same versioned inputs and solver produce deterministic outputs.
**B:** Randomize small physical values for realism.
**C:** No reproducibility goal.

#### Q399 — What canonical unit system should calculations use?

**A — Recommended:** SI internally, convert only at presentation and import/export boundaries.
**B:** Mix user-selected units in solver.
**C:** Store formatted text.

#### Q400 — How should invalid input be represented?

**A — Recommended:** Keep draft inputs separate; retain last accepted result with stale/invalid label.
**B:** Overwrite accepted result with invalid values.
**C:** Silently clamp every value.

#### Q401 — What is a design-point parameter?

**A — Recommended:** Clearly distinguish editable design assumptions from computed off-design states.
**B:** Treat every displayed quantity as independent input.
**C:** Hide design/off-design distinction.

#### Q402 — How should model confidence be expressed?

**A — Recommended:** Per-result provenance and validation status including preview/verified.
**B:** All results labeled certified.
**C:** No status metadata.

#### Q403 — How should model changes be versioned?

**A — Recommended:** Schema and solver version recorded with project and result.
**B:** Use package version only.
**C:** Never version formulas.

#### Q404 — How should legacy simulator values be migrated?

**A — Recommended:** Explicit compatible import with missing-field warnings and non-destructive fallback.
**B:** Silently reinterpret all legacy values.
**C:** Drop old files with no explanation.

### B. Operating controls and input validation

#### Q405 — How should operating controls be organized?

**A — Recommended:** Operating conditions, engine design, nozzles and visualization in separate dock sections.
**B:** One giant scroll form.
**C:** Only throttle visible.

#### Q406 — How should input versus computed values appear?

**A — Recommended:** Editable values visually differentiated from calculated read-only output.
**B:** All numbers styled alike.
**C:** Hide computed output near controls.

#### Q407 — How should throttle behave?

**A — Recommended:** Normalized 0–100% UI with documented preliminary schedule and bounds.
**B:** Direct uncalibrated physical RPM slider.
**C:** Unlimited throttle above 100%.

#### Q408 — What happens to atmosphere parameters?

**A — Recommended:** Validate altitude/Mach together against supported domain and ISA approximation.
**B:** Allow unrestricted atmospheric extrapolation.
**C:** Use fixed sea-level atmosphere.

#### Q409 — How should effective nozzle area be entered?

**A — Recommended:** Explicit effective area, display derived geometric area and Cd assumption.
**B:** One unlabeled arbitrary scale.
**C:** Treat effective area identical to geometric without Cd.

#### Q410 — How should nozzle geometry and controls synchronize?

**A — Recommended:** Only accepted solver input state changes parameterized throat geometry.
**B:** Scale mesh before validating.
**C:** Use a decorative unrelated nozzle.

#### Q411 — How should bypass/core controls be presented?

**A — Recommended:** Separate core and bypass nozzle inputs with consistent units and engine applicability.
**B:** One nozzle parameter silently changes both.
**C:** No independent bypass control.

#### Q412 — How should linked operating conditions behave in comparisons?

**A — Recommended:** Explicit linked/unlinked control with visible effective conditions.
**B:** Always secretly synchronize inputs.
**C:** Never allow linked controls.

#### Q413 — What precision should numeric input fields use?

**A — Recommended:** Per-parameter sensible increments, valid ranges and unit labels.
**B:** Every input uses 0.000000001 steps.
**C:** Unbounded free text.

#### Q414 — How should input constraints be explained?

**A — Recommended:** Visible range, reason, dependency and invalid-state guidance.
**B:** Generic 'error' toast only.
**C:** Clamp without notice.

#### Q415 — Which quick presets should ship?

**A — Recommended:** Clearly named teaching scenarios with exact assumptions and restore capability.
**B:** OEM-sounding preset performance claims.
**C:** No presets.

#### Q416 — What should reset operating parameters do?

**A — Recommended:** Reset only current engine inputs after reversible confirmation; preserve projects.
**B:** Erase project and all saved layouts.
**C:** Reload app without explanation.

### C. Live instruments and scientific labeling

#### Q417 — Which metrics belong in the compact dock?

**A — Recommended:** Net thrust, fuel flow, mass flow and model validity first; advanced metrics expandable.
**B:** Every available number always visible.
**C:** Show thrust only.

#### Q418 — How should stale readings look?

**A — Recommended:** Visible last-valid timestamp/result ID and non-color-only stale warning.
**B:** Display stale data as live.
**C:** Replace with zero.

#### Q419 — How should unvalidated N1/N2 be displayed?

**A — Recommended:** Unavailable physical RPM plus explicit illustrative rotor animation label.
**B:** Derive RPM directly from throttle.
**C:** Random RPM approximations.

#### Q420 — How should engine stations be labeled?

**A — Recommended:** Keep source station IDs and static versus total type explicit.
**B:** Use ambiguous sequential numbers.
**C:** Hide station distinctions.

#### Q421 — How should thrust direction and sign be documented?

**A — Recommended:** Explicit net/gross and momentum/pressure conventions.
**B:** Show positive magnitude regardless of sign.
**C:** No definition.

#### Q422 — When should TSFC be shown?

**A — Recommended:** Only for supported units and positive net thrust, otherwise unavailable with explanation.
**B:** Divide even when thrust is zero.
**C:** Always show constant estimate.

#### Q423 — How should gas-property approximations be disclosed?

**A — Recommended:** Show assumed thermodynamic model and operating validity near relevant outputs.
**B:** State properties are exact.
**C:** Hide assumptions.

#### Q424 — Where should source provenance appear?

**A — Recommended:** Accessible inline details linking equation, input and source/version.
**B:** Only external PDF citation.
**C:** No model attribution.

#### Q425 — How should instrument updates be drawn?

**A — Recommended:** Use accepted snapshots and low-cost DOM updates independent of 3D frame rate.
**B:** Re-render entire Canvas per number.
**C:** Couple readouts to rotor animation.

#### Q426 — How should changes in metrics be represented?

**A — Recommended:** Optional value deltas with clearly named comparison baseline.
**B:** Always show unexplained green/red arrows.
**C:** No indication of change.

#### Q427 — Should telemetry be streamed continuously?

**A — Recommended:** Only computation-progress updates; no fabricated per-frame physics telemetry.
**B:** Invent continuously varying engine values.
**C:** Block UI until every animation stops.

#### Q428 — How should technical terms be explained?

**A — Recommended:** Context definitions, equation links and plain-language glossary.
**B:** Remove engineering terminology.
**C:** Show only abbreviations.

### D. Plots, reference maps and analytical inspection

#### Q429 — Which primary technical charts are available?

**A — Recommended:** Station pressure, temperature, mass/energy and relevant model output.
**B:** Only decorative animated gauges.
**C:** Only a long numerical table.

#### Q430 — How should chart units and quantities be displayed?

**A — Recommended:** Explicit axis units, total/static distinction and conversion controls.
**B:** Unlabeled mixed units.
**C:** Auto-normalize every quantity.

#### Q431 — How should station plots handle missing stations?

**A — Recommended:** Show engine-specific station mapping with gaps and provenance.
**B:** Invent stations for symmetry.
**C:** Force equal station sets without explanation.

#### Q432 — How should chart axes scale?

**A — Recommended:** Bounded truthful autoscaling with user-controlled ranges and reset.
**B:** Always start at zero even when misleading.
**C:** Never show axes.

#### Q433 — How should hovering/clicking a chart relate to the engine?

**A — Recommended:** Linked station highlight when station mapping is valid, with keyboard table equivalent.
**B:** Change actual solver inputs on hover.
**C:** No chart/engine relationship.

#### Q434 — How should chart panels behave in the studio?

**A — Recommended:** Resizable/tabbed analysis dock with optional maximize/undock.
**B:** Always full-screen chart.
**C:** Charts are permanent Canvas overlays.

#### Q435 — What should operating curves require?

**A — Recommended:** Generate only within supported validated sweep domains and label preview results.
**B:** Invent smooth curves between unsupported points.
**C:** Disallow all sweeps.

#### Q436 — How should imported component maps be inspected?

**A — Recommended:** Preserve raw coordinate/axis names, map units, provenance and no-extrapolation.
**B:** Treat raw maps as engine-calibrated RPM.
**C:** Hide raw data and axes.

#### Q437 — What happens if a sweep fails mid-run?

**A — Recommended:** Keep verified points, mark failure regions and allow bounded retry.
**B:** Interpolate all failed points silently.
**C:** Erase the whole chart.

**Question archive:** Detailed individually numbered A/B/C questions Q438–Q572 continue in [NATIVE_WEB_WORKSPACE_CONTINUED.md](NATIVE_WEB_WORKSPACE_CONTINUED.md). The original grill holds Q201–Q437 and the approval matrix for Q321–Q572.

## Final default approval record — 2026-11-01

**Approval recorded 2026-11-01:** The user subsequently authorized implementation of all remaining recommended A defaults, covering **Q321–Q572=A** (252 choices). The A/B/C alternatives in the original questionnaire are preserved as historical options, no longer pending. Original Q01–Q200, D01=B and D02=B remain unchanged. This approval authorizes implementation but does not make unvalidated scientific models or incomplete features complete.

| ID | Decision | ID | Decision | ID | Decision | ID | Decision |
|---|---|---|---|---|---|---|---|
| Q321 | **A** | Q384 | **A** | Q447 | **A** | Q510 | **A** |
| Q322 | **A** | Q385 | **A** | Q448 | **A** | Q511 | **A** |
| Q323 | **A** | Q386 | **A** | Q449 | **A** | Q512 | **A** |
| Q324 | **A** | Q387 | **A** | Q450 | **A** | Q513 | **A** |
| Q325 | **A** | Q388 | **A** | Q451 | **A** | Q514 | **A** |
| Q326 | **A** | Q389 | **A** | Q452 | **A** | Q515 | **A** |
| Q327 | **A** | Q390 | **A** | Q453 | **A** | Q516 | **A** |
| Q328 | **A** | Q391 | **A** | Q454 | **A** | Q517 | **A** |
| Q329 | **A** | Q392 | **A** | Q455 | **A** | Q518 | **A** |
| Q330 | **A** | Q393 | **A** | Q456 | **A** | Q519 | **A** |
| Q331 | **A** | Q394 | **A** | Q457 | **A** | Q520 | **A** |
| Q332 | **A** | Q395 | **A** | Q458 | **A** | Q521 | **A** |
| Q333 | **A** | Q396 | **A** | Q459 | **A** | Q522 | **A** |
| Q334 | **A** | Q397 | **A** | Q460 | **A** | Q523 | **A** |
| Q335 | **A** | Q398 | **A** | Q461 | **A** | Q524 | **A** |
| Q336 | **A** | Q399 | **A** | Q462 | **A** | Q525 | **A** |
| Q337 | **A** | Q400 | **A** | Q463 | **A** | Q526 | **A** |
| Q338 | **A** | Q401 | **A** | Q464 | **A** | Q527 | **A** |
| Q339 | **A** | Q402 | **A** | Q465 | **A** | Q528 | **A** |
| Q340 | **A** | Q403 | **A** | Q466 | **A** | Q529 | **A** |
| Q341 | **A** | Q404 | **A** | Q467 | **A** | Q530 | **A** |
| Q342 | **A** | Q405 | **A** | Q468 | **A** | Q531 | **A** |
| Q343 | **A** | Q406 | **A** | Q469 | **A** | Q532 | **A** |
| Q344 | **A** | Q407 | **A** | Q470 | **A** | Q533 | **A** |
| Q345 | **A** | Q408 | **A** | Q471 | **A** | Q534 | **A** |
| Q346 | **A** | Q409 | **A** | Q472 | **A** | Q535 | **A** |
| Q347 | **A** | Q410 | **A** | Q473 | **A** | Q536 | **A** |
| Q348 | **A** | Q411 | **A** | Q474 | **A** | Q537 | **A** |
| Q349 | **A** | Q412 | **A** | Q475 | **A** | Q538 | **A** |
| Q350 | **A** | Q413 | **A** | Q476 | **A** | Q539 | **A** |
| Q351 | **A** | Q414 | **A** | Q477 | **A** | Q540 | **A** |
| Q352 | **A** | Q415 | **A** | Q478 | **A** | Q541 | **A** |
| Q353 | **A** | Q416 | **A** | Q479 | **A** | Q542 | **A** |
| Q354 | **A** | Q417 | **A** | Q480 | **A** | Q543 | **A** |
| Q355 | **A** | Q418 | **A** | Q481 | **A** | Q544 | **A** |
| Q356 | **A** | Q419 | **A** | Q482 | **A** | Q545 | **A** |
| Q357 | **A** | Q420 | **A** | Q483 | **A** | Q546 | **A** |
| Q358 | **A** | Q421 | **A** | Q484 | **A** | Q547 | **A** |
| Q359 | **A** | Q422 | **A** | Q485 | **A** | Q548 | **A** |
| Q360 | **A** | Q423 | **A** | Q486 | **A** | Q549 | **A** |
| Q361 | **A** | Q424 | **A** | Q487 | **A** | Q550 | **A** |
| Q362 | **A** | Q425 | **A** | Q488 | **A** | Q551 | **A** |
| Q363 | **A** | Q426 | **A** | Q489 | **A** | Q552 | **A** |
| Q364 | **A** | Q427 | **A** | Q490 | **A** | Q553 | **A** |
| Q365 | **A** | Q428 | **A** | Q491 | **A** | Q554 | **A** |
| Q366 | **A** | Q429 | **A** | Q492 | **A** | Q555 | **A** |
| Q367 | **A** | Q430 | **A** | Q493 | **A** | Q556 | **A** |
| Q368 | **A** | Q431 | **A** | Q494 | **A** | Q557 | **A** |
| Q369 | **A** | Q432 | **A** | Q495 | **A** | Q558 | **A** |
| Q370 | **A** | Q433 | **A** | Q496 | **A** | Q559 | **A** |
| Q371 | **A** | Q434 | **A** | Q497 | **A** | Q560 | **A** |
| Q372 | **A** | Q435 | **A** | Q498 | **A** | Q561 | **A** |
| Q373 | **A** | Q436 | **A** | Q499 | **A** | Q562 | **A** |
| Q374 | **A** | Q437 | **A** | Q500 | **A** | Q563 | **A** |
| Q375 | **A** | Q438 | **A** | Q501 | **A** | Q564 | **A** |
| Q376 | **A** | Q439 | **A** | Q502 | **A** | Q565 | **A** |
| Q377 | **A** | Q440 | **A** | Q503 | **A** | Q566 | **A** |
| Q378 | **A** | Q441 | **A** | Q504 | **A** | Q567 | **A** |
| Q379 | **A** | Q442 | **A** | Q505 | **A** | Q568 | **A** |
| Q380 | **A** | Q443 | **A** | Q506 | **A** | Q569 | **A** |
| Q381 | **A** | Q444 | **A** | Q507 | **A** | Q570 | **A** |
| Q382 | **A** | Q445 | **A** | Q508 | **A** | Q571 | **A** |
| Q383 | **A** | Q446 | **A** | Q509 | **A** | Q572 | **A** |

**Implementation caution:** This approved scope is extensive. Maintain an evidence-backed implementation-status matrix; do not falsely declare all 572 requirements completed.

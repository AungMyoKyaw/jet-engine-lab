# Jet Engine Lab — Playwright Visual Space Audit

**Date:** 2026-11-01
**Branch:** `feature/jet-engine-lab-redesign`
**Mode:** Read-only UI inspection. No application code changed.

## Captures

The images below were captured with **Playwright CLI** against the running local development server at `127.0.0.1:4173`, using Chromium and a short stabilization delay. All images are full-page.

| Screenshot | Viewport | Route |
|---|---|---|
| [Turbofan desktop](turbofan-1920.png) | 1920×1080 | `#/engines/turbofan` |
| [Turbojet laptop](turbojet-1440.png) | 1440×900 | `#/engines/turbojet` |
| [Turbofan mobile](turbofan-mobile-390.png) | 390×844 | `#/engines/turbofan` |
| [Analysis](analysis-1440.png) | 1440×900 | `#/analysis` |
| [Courses](courses-1440.png) | 1440×900 | `#/courses` |

## Measured structure

The following positions are browser DOM bounding rectangles in CSS pixels (not visual estimates).

| Element | 1920×1080 | 1440×900 | 390×844 |
|---|---|---|---|
| Engine workspace top | y=253 | y=237 | y=333 |
| Canvas size | 1390×817 | 968×566 | 364×329 |
| Workspace bottom | y=1126 | y=859 | y=1174 |
| Operating controls top | y=1144 | y=877 | y=1192 |
| Total document height | 1674 | 1422 | 2448 |

### Findings and fixes in priority order

**P0 — Engine is too small relative to canvas, particularly at 1440px and mobile.** The engine occupies roughly half the available canvas width in the laptop/mobile capture; large portions are background. At 1920px it fills more of the canvas horizontally, but could still be framed more tightly. The mobile camera deliberately retreats to a long distance (`[21, 10, 34]`), amplifying the problem. **Fix:** automatically fit engine group bounds against camera aspect ratio and available safe areas; set a tighter default and recenter with OrbitControls. Target ~75–85% of the *usable* 3D viewport width without clipping, and keep per-component zoom presets.

**P0 — Controls are not visible in the initial viewport.** On a 1920×1080 desktop, controls begin **64px below the fold**. At 1440×900 they begin **23px above the fold**, leaving essentially none of the controls usable without scrolling. On a 390×844 phone, controls start at **y=1192**, more than a full screen below the top. **Fix:** add a context-relevant compact operating-control dock inside/adjacent to the stage; move full advanced inputs to an expandable drawer or section. Limit decorative hero and stage height based on viewport rather than canvas aspect ratio.

**P0 — Telemetry wastes vertical room.** At 1920×1080 the last row of telemetry ends near **y=743**, while the footer starts at **y=1068**, creating about **325px** of blank sidebar. On mobile, telemetry consumes 370px between the 3D viewport and anatomy strip, pushing inspection and inputs far below. **Fix:** overlay compact live readouts on the stage or use a short bottom KPI strip; keep detailed station data in Analysis. If preserving a sidebar, allow it to hug its content rather than stretch for no value.

**P1 — Three permanent sidebars compete with 3D.** The desktop stage reserves 228px for anatomy and 240px for telemetry (and their borders), even if neither is actively needed. **Fix:** replace anatomy list with a compact collapsible part rail and turn selection details into a popover/inspector. Avoid making the 3D scene subordinate to a fixed dashboard grid.

**P1 — Large introductory header duplicates context.** Navigation, eyebrow, giant heading, explanatory line, and engine switch precede the workbench by 179px after navigation at 1920px (workspace begins y=253). On mobile the stage starts only at y=333. **Fix:** compact the workspace heading into a 44–64px toolbar. Show the large editorial hero on the Overview route, not on every interactive engine route.

**P1 — Mobile is technically responsive but not usable as an engine-first experience.** The mobile viewport occupies y=334–714, but the engine appears much smaller than available width, model controls wrap to two rows, and users must scroll far to reach interactive simulation inputs. **Fix:** model-first stage with auto-fit, a two-row floating KPI/control strip, a bottom-sheet inspector and mobile-specific control arrangement. Preserve keyboard/a11y fallback.

**P2 — Analysis is mostly well allocated.** The two-panel comparison charts are balanced; whitespace is useful here. The large page heading could be slightly smaller on medium screens, but no urgent restructuring required.

**P2 — Courses list is readable and deliberately sparse, not inefficient in the same way.** Right-side `READ LESSON` affordances sit a long way from text; this helps scanning but could be replaced by row hover/focus affordances and a modest max-width for readability. Do not compress all 15 subjects into tiny cards.

### Suggested target layout

- **Desktop:** sticky compact header; one wide 3D engine stage; optional 140–180px collapsible part rail; optional floating telemetry readouts; compact flight-condition and throttle controls visible in the first viewport. Full simulation settings and analysis below or in a drawer.
- **Mobile:** select engine and immediately see a nearly full-width 3D assembly, two or three primary live KPIs and an immediate throttle affordance. Component details in an accessible bottom sheet.
- **Motion/fit:** auto-fit by engine bounding box and camera aspect, no clipping through selection/explosion, maintain independent OrbitControls reset/preset behavior, respect reduced motion.
- **Scientific transparency:** preserve status labels and unavailable physical RPM; do not fabricate solver values while simplifying UI.

### Verification criteria for a later implementation

1. At 1440×900, 1920×1080, 390×844, the 3D engine initially occupies at least ~75% of safe horizontal stage space without cropping or hiding controls.
2. Primary throttle, engine switch and top 2–3 telemetry metrics are visible without scrolling in desktop first fold; on mobile primary control is reachable within the first viewport.
3. No wasted 300px+ blanks in persistent telemetry columns.
4. Component selection, exploded-view motion, camera reset, keyboard navigation, 2D fallback and dark/light themes still work.
5. Re-run Playwright desktop/mobile screenshots and tests; compare against these captures before editing, then manually inspect every route.

**Status:** Findings only. Source, git branch and deployment unchanged; screenshots/report are uncommitted audit artifacts.

## IMPLEMENTED — second-pass review (2026-11-01)

All changes are on `feature/jet-engine-lab-redesign`; no application code was modified in `master`, and no public deployment occurred.

**Delivered:**
- Collapsible anatomy/part inspector instead of a permanent left rail; accessible Escape dismissal and focus return. On mobile it becomes a visually reviewed bottom sheet.
- Floating, content-sized telemetry dock with the full 6 metric groups always visible and no ~325px dead area underneath.
- Responsive 3D framing based on the envelopes of individual assemblies. Wide desktops use a tighter crop; medium widths retain safe margins. Explosion changes auto-fit the separated parts and preserve current orbit orientation. Camera presets and reset remain.
- Stage-integrated throttle slider synchronized with the numerical worker and full settings, visible before scrolling at every tested size. The mobile toolbar exposes reference, casing, explosion and Reset controls without horizontal overflow.
- Compact engine heading and viewport-height-aware stage, plus responsive control-grid auto-layout. The Analysis and Courses layouts were deliberately left largely untouched.

**Playwright screenshots:**
- [Desktop turbofan after](after/turbofan-1920.png) / [desktop turbojet after](after/turbojet-1440.png)
- [Mobile turbofan after](after/turbofan-mobile-390.png) / [mobile inspector](after/mobile-inspector.png) / [mobile light theme](after/mobile-light.png)
- [1024px laptop](after/engine-1024.png) / [768px tablet](after/engine-768.png) / [100% exploded desktop](after/exploded-1440.png) / [100% exploded mobile](after/exploded-390.png)

**Measured improvements from browser DOM at the same viewport:**

| Element | Before | After | Change |
|---|---:|---:|---:|
| 1920×1080 workspace top | 253px | 194px | −59px |
| 1920×1080 operating-controls top | 1144px | 898px | −246px, visible above fold |
| 1440×900 workspace top | 237px | 188px | −49px |
| 1440×900 operating-controls top | 877px | 747px | −130px, visible above fold |
| 390×844 workspace top | 333px | 228px | −105px |
| 390×844 operating-controls top | 1192px | 916px | −276px |
| 390×844 quick throttle top | Not present | 565px | Primary control above fold |
| Persistent telemetry blank at 1920px | ~325px | None (content-sized dock) | Removed unused panel space |

**Responsive interaction automation:** `bun run smoke:visual` exercises 1920×1080, 1440×900, 1024×768, 768×900, 390×844 and 360×740; tests inspect/close, camera presets, reset, quick throttle, model rendering, horizontal overflow and clipping of toolbar actions. A separate full-explosion manual screenshot check verified the separated model remains visible on desktop and mobile; Escape closes inspector. The original six-route production/offline tests remain required.

**Scope remains the UI/visual-audit work:** full D01 map-calibrated off-design RPM, full D02 solver/nozzle matching, final course content and other release gates are still incomplete. This does not authorize merging to master or publishing to gh-pages.

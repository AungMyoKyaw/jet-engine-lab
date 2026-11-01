# Native Web Workspace — Individual Question Archive (Q438–Q572)

This companion file restores the A/B/C question descriptions that continue the earlier [grill](NATIVE_WEB_WORKSPACE_GRILL.md). The user subsequently approved **A for every Q321–Q572** as implementation direction; B/C are retained alternatives, not accepted decisions. Do not confuse design approval with verified implementation.

## Round 4 continuation — Q438–Q464

### Q438 — Data export

**A — Approved recommendation:** Versioned CSV/JSON with units, inputs and validity.
**B:** Unlabeled CSV.
**C:** Screenshot only.

### Q439 — Chart export

**A — Approved recommendation:** SVG/PNG with units and legend.
**B:** Unlabeled raster.
**C:** No export.

### Q440 — Derivations

**A — Approved recommendation:** Link selected metric to versioned equations and assumptions.
**B:** Generic unsourced formulas.
**C:** External search only.

### Q441 — Simulation history

**A — Approved recommendation:** Record accepted input/result changes with versions and timestamps.
**B:** Capture raw pointer events.
**C:** No history.

### Q442 — History capacity

**A — Approved recommendation:** Bounded ring and explicit saved snapshots.
**B:** Unlimited continuous writes.
**C:** Only latest result.

### Q443 — Undo versus history

**A — Approved recommendation:** Separate input Undo and immutable result history.
**B:** Undo rewrites historical results.
**C:** History equals Undo.

### Q444 — Comparison baseline

**A — Approved recommendation:** Pin named conditions/versioned snapshots.
**B:** Use unnamed default.
**C:** No baseline.

### Q445 — Comparison fairness

**A — Approved recommendation:** Show differing assumptions, link only compatible inputs.
**B:** Claim false matching.
**C:** Hide assumptions.

### Q446 — Two-engine rendering

**A — Approved recommendation:** One main scene plus paired charts and tables.
**B:** Always two heavy canvases.
**C:** Only text.

### Q447 — Scenario duplication

**A — Approved recommendation:** Clone inputs and provenance without mutation.
**B:** Overwrite current scenario.
**C:** Only screenshot.

### Q448 — Scenario metadata

**A — Approved recommendation:** Engine, input set, model version, validity, notes.
**B:** Name only.
**C:** No metadata.

### Q449 — Replay semantics

**A — Approved recommendation:** Deterministically recompute and flag solver version differences.
**B:** Fake RPM replay.
**C:** Silently replace values.

### Q450 — Comparative charts

**A — Approved recommendation:** Consistent series labels, units and validity.
**B:** Unlabeled overlays.
**C:** Only one series.

### Q451 — Incompatible results

**A — Approved recommendation:** Explain mismatch and normalize only when valid.
**B:** Silently rescale results.
**C:** Broken graphs.

### Q452 — Sharing comparison

**A — Approved recommendation:** Portable versioned scenario links without personal data.
**B:** Mandatory cloud account.
**C:** Images only.

### Q453 — Superseding requests

**A — Approved recommendation:** Reject stale computations by request identity.
**B:** Last completion wins.
**C:** Unlimited parallel jobs.

### Q454 — Cancellation

**A — Approved recommendation:** Cooperative cancellation with bounded worker termination.
**B:** Kill every slider calculation.
**C:** Never cancel.

### Q455 — Out-of-order replies

**A — Approved recommendation:** Reject results mismatching current inputs/model.
**B:** Newest arrival wins.
**C:** Largest thrust wins.

### Q456 — Slow calculations

**A — Approved recommendation:** Nonblocking status, last-valid result, timeout and retry.
**B:** Freeze UI.
**C:** No progress state.

### Q457 — Infeasible points

**A — Approved recommendation:** Explicit failure while retaining last valid result.
**B:** Hidden clamping.
**C:** Return NaN.

### Q458 — Nonconvergence

**A — Approved recommendation:** Display diagnostics without fabricated success.
**B:** Heuristic OEM-like substitute.
**C:** Silently mark last result current.

### Q459 — Map acceptance

**A — Approved recommendation:** Pin license, exact axes, calibration and independent tests.
**B:** Import alone is sufficient.
**C:** Ignore maps.

### Q460 — D01 RPM

**A — Approved recommendation:** Physical RPM only after independently validated matched maps and scale.
**B:** Treat normalized speed as RPM.
**C:** Infer from animation.

### Q461 — D02 nozzle closure

**A — Approved recommendation:** Effective area, flow, shafts and 3D throat match under tests.
**B:** Moving visual nozzle suffices.
**C:** Ignore conservation.

### Q462 — Animation isolation

**A — Approved recommendation:** Separate visual animation clocks from numerical model.
**B:** Use frame rate as RPM.
**C:** Rendering is solver.

### Q463 — Recovery

**A — Approved recommendation:** Restore verified project and flag interrupted calculation.
**B:** Mark interrupted solve completed.
**C:** Discard all saved inputs.

### Q464 — Numerical verification

**A — Approved recommendation:** Unit/property tests, independent fixtures and identity consistency.
**B:** Visual tests only.
**C:** Manual examples only.


## Round 5 — Projects, offline and PWA (Q465–Q500)

### Q465 — Project file format

**A — Approved recommendation:** Portable versioned JSON with schema and checksums.
**B:** Binary-only archive.
**C:** Browser storage only.

### Q466 — Save/Save As

**A — Approved recommendation:** Local download with File System Access enhancement and fallback.
**B:** Cloud mandatory.
**C:** Silent overwrite.

### Q467 — Autosave

**A — Approved recommendation:** Local recovery checkpoint distinct from explicit Save.
**B:** Overwrite downloaded original.
**C:** No recovery.

### Q468 — Project identity

**A — Approved recommendation:** Stable random ID independent of user PII.
**B:** Email as ID.
**C:** Title as unique ID.

### Q469 — File migrations

**A — Approved recommendation:** Versioned validation, backup and upgrade report.
**B:** Silent coercion.
**C:** Reject all older versions.

### Q470 — Import checks

**A — Approved recommendation:** Validate schema, types, ranges, references and integrity.
**B:** Trust all files.
**C:** Check extension only.

### Q471 — Asset links

**A — Approved recommendation:** Manifest with hashes, licenses and safe references.
**B:** Personal absolute paths.
**C:** Unverified hotlinks.

### Q472 — Project layouts

**A — Approved recommendation:** Project-scoped data with device-specific UI overrides.
**B:** Share device layout always.
**C:** No project layouts.

### Q473 — Dirty state

**A — Approved recommendation:** Visible unsaved indicator and destructive-navigation warning.
**B:** No dirty tracking.
**C:** Block all navigation.

### Q474 — Recent projects

**A — Approved recommendation:** Bounded local history with clear/remove controls.
**B:** Upload history.
**C:** Unlimited public file paths.

### Q475 — Save conflicts

**A — Approved recommendation:** Detect revisions and offer compare or duplicate.
**B:** Last writer silently wins.
**C:** Prevent all edits.

### Q476 — Samples

**A — Approved recommendation:** Bundled illustrative presets with source licensing.
**B:** Fake OEM-certified examples.
**C:** No samples.

### Q477 — PWA install

**A — Approved recommendation:** Optional browser install into standalone window.
**B:** Browser tab only.
**C:** Installation mandatory.

### Q478 — Offline behavior

**A — Approved recommendation:** Cached studio, lessons, reference data and local projects.
**B:** Only offline placeholder.
**C:** Network required.

### Q479 — Asset cache

**A — Approved recommendation:** Versioned shell plus bounded on-demand 3D resources.
**B:** Indefinite cache.
**C:** No cache.

### Q480 — Updates

**A — Approved recommendation:** Update-ready prompt at a safe point.
**B:** Force reload during work.
**C:** Never update.

### Q481 — Cache recovery

**A — Approved recommendation:** Atomic version switching with safe rollback.
**B:** Delete old cache before loading.
**C:** Mix incompatible assets.

### Q482 — Offline missing assets

**A — Approved recommendation:** Explain and offer predownload/retry.
**B:** Invisible missing geometry.
**C:** Crash app.

### Q483 — Offline engine packs

**A — Approved recommendation:** Optional sized/checksummed packs with storage checks.
**B:** Download everything automatically.
**C:** Never package assets.

### Q484 — Quota

**A — Approved recommendation:** Check storage and protect user projects before eviction.
**B:** Evict projects first.
**C:** Assume unlimited.

### Q485 — Service-worker boundary

**A — Approved recommendation:** Intercept same-origin static resources only.
**B:** Arbitrary proxy.
**C:** Intercept all internet.

### Q486 — Static routing

**A — Approved recommendation:** Hash paths compatible with GitHub Pages/PWA.
**B:** Backend rewrites required.
**C:** Unhandled pathname routes.

### Q487 — Offline tests

**A — Approved recommendation:** Cold/warm, migration, rollback and quota browser tests.
**B:** Online only.
**C:** Manifest implies working.

### Q488 — PWA identity

**A — Approved recommendation:** Original app icon and preview status.
**B:** Clone existing CAD brand.
**C:** Generic icon.

### Q489 — Device preferences

**A — Approved recommendation:** Versioned local settings with migration/export/reset.
**B:** Mandatory cloud.
**C:** Plain URL settings.

### Q490 — Large local data

**A — Approved recommendation:** IndexedDB/OPFS with file export fallback.
**B:** Unbounded localStorage.
**C:** Remote database.

### Q491 — Usage analytics

**A — Approved recommendation:** No third-party behavioral tracking by default.
**B:** Third-party trackers.
**C:** Upload every project.

### Q492 — Share links

**A — Approved recommendation:** Explicit generation with privacy review.
**B:** Automatic full state sharing.
**C:** Public database required.

### Q493 — URL privacy

**A — Approved recommendation:** Never include paths, secrets, notes or identifiers.
**B:** Include everything.
**C:** No privacy checks.

### Q494 — Corrupt projects

**A — Approved recommendation:** Read-only diagnostics and verified recovery.
**B:** Silent overwrite.
**C:** Erase storage.

### Q495 — Reset scope

**A — Approved recommendation:** Separate settings reset from project deletion.
**B:** Delete all by one control.
**C:** No reset.

### Q496 — Data export

**A — Approved recommendation:** Portable archive of projects, annotations and preferences.
**B:** Screenshots only.
**C:** No portability.

### Q497 — Failed migration

**A — Approved recommendation:** Keep original bytes and offer safe fallback.
**B:** Destroy old first.
**C:** Infinite spinner.

### Q498 — PII in shipped assets

**A — Approved recommendation:** No personal details in sample/source defaults.
**B:** Use developer personal details.
**C:** Analytics identity.

### Q499 — External sources

**A — Approved recommendation:** Visible URL and attribution without hidden uploads.
**B:** Fetch every link automatically.
**C:** Block downloads.

### Q500 — Crash restoration

**A — Approved recommendation:** Restore verified state and label incomplete calculations.
**B:** Mark work complete.
**C:** Restore visual motion as physics.


## Round 6 — Learning, mobile and accessibility (Q501–Q536)

### Q501 — Lesson context

**A — Approved recommendation:** Connect lesson to selected part and station.
**B:** Replace workspace entirely.
**C:** Render lessons as textures.

### Q502 — Learning progression

**A — Approved recommendation:** Concept, geometry, experiment, checked interpretation.
**B:** Videos only.
**C:** Free play without objectives.

### Q503 — Assessment

**A — Approved recommendation:** Source-reviewed questions and numerical reasoning rubrics.
**B:** Unverified generated answers.
**C:** Auto-complete on open.

### Q504 — Experiments

**A — Approved recommendation:** Sandbox changes with full project restoration.
**B:** Overwrite live project.
**C:** Disable controls.

### Q505 — Wrong answers

**A — Approved recommendation:** Actionable feedback with equations/sources.
**B:** Generic praise.
**C:** Red cross only.

### Q506 — Difficulty

**A — Approved recommendation:** Beginner/intermediate/advanced tags.
**B:** One level only.
**C:** Paid tier.

### Q507 — Progress

**A — Approved recommendation:** Versioned local state with export/reset.
**B:** Cloud account required.
**C:** History only.

### Q508 — Objectives

**A — Approved recommendation:** Explicit prerequisites, outcomes and completion evidence.
**B:** Hidden goals.
**C:** Title only.

### Q509 — Cross-references

**A — Approved recommendation:** Bidirectional lesson/component/station/equation/data links.
**B:** One-way page links.
**C:** No links.

### Q510 — Math accessibility

**A — Approved recommendation:** Accessible math and plain text alongside KaTeX.
**B:** Rasterized Canvas equations.
**C:** No math.

### Q511 — Unvalidated physics exercises

**A — Approved recommendation:** Explain D01/D02 and use valid conceptual alternatives.
**B:** Invent RPM answers.
**C:** Hide module.

### Q512 — Module completeness

**A — Approved recommendation:** Sources, objectives, practice, feedback and accessible mode.
**B:** Paragraph alone.
**C:** Screenshot only.

### Q513 — Mobile first screen

**A — Approved recommendation:** Engine, orbit, throttle, primary metrics, part inspection.
**B:** Every desktop dock.
**C:** Static thumbnail.

### Q514 — Touch gestures

**A — Approved recommendation:** One finger orbit, two finger pan/zoom with help.
**B:** Invisible undocumented gestures.
**C:** No touch.

### Q515 — Keyboard overlay

**A — Approved recommendation:** Preserve focused input and adapt bottom panels.
**B:** Reload page.
**C:** Hide controls.

### Q516 — Mobile inspector

**A — Approved recommendation:** Accessible bottom sheet with snap states.
**B:** Hover popup.
**C:** Every part uses full page.

### Q517 — Landscape phone

**A — Approved recommendation:** Expand engine and collapse secondary panels.
**B:** Require portrait.
**C:** Overflow panels.

### Q518 — Shortcuts help

**A — Approved recommendation:** Searchable cheat sheet with platform equivalents.
**B:** Undocumented shortcuts.
**C:** No shortcuts.

### Q519 — Canvas focus

**A — Approved recommendation:** Predictable scene/DOM focus transitions.
**B:** Trap focus inside Canvas.
**C:** No keyboard scene.

### Q520 — Nonvisual engine

**A — Approved recommendation:** Semantic component tree and station tables.
**B:** Announce every vertex.
**C:** Require vision.

### Q521 — Live regions

**A — Approved recommendation:** Announce accepted state, errors and mode changes only.
**B:** Every animation frame.
**C:** No announcements.

### Q522 — 2D fallback

**A — Approved recommendation:** Selectable labeled schematic with technical data.
**B:** Unsupported error.
**C:** Static poster.

### Q523 — Contrast/zoom

**A — Approved recommendation:** Dedicated contrast tokens and 200% reflow testing.
**B:** Disable zoom.
**C:** Simple invert filter.

### Q524 — Reduced motion

**A — Approved recommendation:** Disable nonessential animations with playback override.
**B:** Ignore OS preferences.
**C:** Disable all state feedback.

### Q525 — First launch

**A — Approved recommendation:** Optional short tour with skip/resume.
**B:** Mandatory long tutorial.
**C:** Empty screen.

### Q526 — Advanced tools

**A — Approved recommendation:** Progressively expose through palette, menus and tips.
**B:** Expose all simultaneously.
**C:** Hide permanently.

### Q527 — Shortcut conflicts

**A — Approved recommendation:** Native editing and assistive keys take priority.
**B:** Always intercept.
**C:** Disable shortcuts globally.

### Q528 — Help

**A — Approved recommendation:** Task guides, accessibility, engineering assumptions and issue report.
**B:** External site only.
**C:** Tooltips only.

### Q529 — Unavailable tool

**A — Approved recommendation:** Explain why disabled and prerequisites.
**B:** Bare disabled icon.
**C:** Silent failure.

### Q530 — Baseline presets

**A — Approved recommendation:** Show initial assumption values and restore option.
**B:** Fake OEM data.
**C:** Start all zero.

### Q531 — Empty state

**A — Approved recommendation:** Sample project chooser and Open Project.
**B:** Blank Canvas.
**C:** Automatic upload.

### Q532 — Return visit

**A — Approved recommendation:** Recover recent verified project with notice.
**B:** Reset everything.
**C:** Mandatory external sync.

### Q533 — Mode transitions

**A — Approved recommendation:** Retain active project and selection context.
**B:** Reload and erase.
**C:** One mode only.

### Q534 — Feedback

**A — Approved recommendation:** Public issue tracker and privacy-reviewed diagnostics export.
**B:** Auto-upload local projects.
**C:** No reporting.

### Q535 — Changelog

**A — Approved recommendation:** Versioned concise changes and scientific limitations.
**B:** Certified marketing claims.
**C:** No version.

### Q536 — Accessibility gate

**A — Approved recommendation:** Automated and manual reader/keyboard/zoom/contrast tests.
**B:** Screenshots only.
**C:** No accessibility QA.


## Round 7 — Performance, provenance and release (Q537–Q572)

### Q537 — Frame-rate budget

**A — Approved recommendation:** Target smooth 60fps desktop with adaptive fallback.
**B:** Force 120fps.
**C:** Uncapped GPU use.

### Q538 — Quality tiers

**A — Approved recommendation:** Measure device capacity with manual override.
**B:** User-agent only.
**C:** Always maximum.

### Q539 — LOD

**A — Approved recommendation:** Distance/screen-error tiers with silhouette checks.
**B:** Random decimation.
**C:** No LOD.

### Q540 — Repeated geometry

**A — Approved recommendation:** Instancing and reusable meshes with stable part IDs.
**B:** Individual draw call per blade.
**C:** Merge all losing picking.

### Q541 — Picking performance

**A — Approved recommendation:** Accelerated broad-phase with accuracy checks.
**B:** Raycast all triangles every frame.
**C:** Bounding boxes only.

### Q542 — Asset loading

**A — Approved recommendation:** Lazy mode-based loading with bounded progress.
**B:** Download everything on launch.
**C:** Load only on hover.

### Q543 — Textures

**A — Approved recommendation:** Device-appropriate size/format tiers with hashes.
**B:** Always 8K.
**C:** No textures.

### Q544 — GPU pressure

**A — Approved recommendation:** Lower DPR/LOD/effects and report degradation.
**B:** Allocate until crash.
**C:** Reload browser.

### Q545 — Panel resize

**A — Approved recommendation:** Preserve Canvas context and update aspect smoothly.
**B:** Recreate context.
**C:** Never adapt.

### Q546 — Hidden tab

**A — Approved recommendation:** Suspend nonessential animation and respect visibility.
**B:** Render continuously.
**C:** Stop all computation.

### Q547 — Benchmarks

**A — Approved recommendation:** Measure FPS, frame time, memory proxy, input latency, bundles and workers.
**B:** Appearance only.
**C:** Single FPS sample.

### Q548 — Regression budget

**A — Approved recommendation:** Repeatable device profiles and objective thresholds.
**B:** One machine subjective review.
**C:** No measures.

### Q549 — Geometry admission

**A — Approved recommendation:** Verify origin, license, hash, scale, material and omissions.
**B:** Any GLB.
**C:** Original meshes only.

### Q550 — Notices

**A — Approved recommendation:** Bundle third-party terms and linked credits.
**B:** Hide attribution.
**C:** Relicense as MIT.

### Q551 — Visual priorities

**A — Approved recommendation:** Mechanical clarity and CAD readability over spectacle.
**B:** Cinematic effects above accuracy.
**C:** Wireframe only.

### Q552 — Procedural mesh validation

**A — Approved recommendation:** Bounds, normals, topology, scale and actuation tests.
**B:** Screenshots only.
**C:** Assume valid.

### Q553 — Map admission

**A — Approved recommendation:** Exact upstream version, axes, license, hash and independent fixtures.
**B:** Map pictures as data.
**C:** Name-only imports.

### Q554 — Fidelity status

**A — Approved recommendation:** Distinguish validated, reference and illustrative sources.
**B:** Claim OEM accuracy for all.
**C:** No labeling.

### Q555 — Thermal colors

**A — Approved recommendation:** Source-verified consistent legends and physical/illustrative indicators.
**B:** Random colors.
**C:** No legend.

### Q556 — Missing parts

**A — Approved recommendation:** Label omissions and maintain schematic fallback.
**B:** Invent exact production geometry.
**C:** Hide model.

### Q557 — Screenshot context

**A — Approved recommendation:** Include view, version, units and optional attribution.
**B:** Unlabeled image.
**C:** Private identifiers.

### Q558 — Asset security

**A — Approved recommendation:** Validate glTF payload size, type and origin with resource limits.
**B:** Execute arbitrary scripts.
**C:** Unlimited remote assets.

### Q559 — Provenance audit

**A — Approved recommendation:** Reproducible imports, hashes, rights and independent evidence.
**B:** Trust filenames.
**C:** Discard source details.

### Q560 — Versioned assets

**A — Approved recommendation:** Recheck hashes and rendering fixtures after revision.
**B:** Silent replacement.
**C:** Never update.

### Q561 — Browser matrix

**A — Approved recommendation:** Chromium, Safari/WebKit, Firefox, mobile and 2D fallback.
**B:** Chromium desktop only.
**C:** Single screenshot.

### Q562 — Playwright coverage

**A — Approved recommendation:** Docks, shortcuts, tools, touch, offline, exports and failures.
**B:** Homepage only.
**C:** Unit tests only.

### Q563 — Visual snapshots

**A — Approved recommendation:** Themes, engines, inspectors, clipping, explosion, charts and fallback.
**B:** One marketing image.
**C:** Random snapshots.

### Q564 — Scientific regression

**A — Approved recommendation:** Independent numerical fixtures and conservation/feasibility checks.
**B:** UI snapshot only.
**C:** Any nonzero thrust.

### Q565 — Property tests

**A — Approved recommendation:** Bounded generated inputs and physics/geometry invariants.
**B:** Default values only.
**C:** No property tests.

### Q566 — Deployment flow

**A — Approved recommendation:** Verified master, isolated build, Pages publish and rollback.
**B:** Direct untested push.
**C:** Manual file upload.

### Q567 — Release status

**A — Approved recommendation:** Separate visual-preview readiness from D01/D02 scientific validation.
**B:** Claim everything complete.
**C:** No status.

### Q568 — Production verification

**A — Approved recommendation:** Check SHA, public assets, routes, fallback and offline recovery.
**B:** Push means success.
**C:** Homepage only.

### Q569 — Rollback

**A — Approved recommendation:** Restore known-good Pages state and document failure.
**B:** Delete user storage.
**C:** Ignore incidents.

### Q570 — Release docs

**A — Approved recommendation:** README screenshots, decisions, architecture, tests, limits and credits.
**B:** Marketing only.
**C:** No documentation.

### Q571 — Privacy scan

**A — Approved recommendation:** Scan source, screenshots and artifacts for secrets/PII.
**B:** Assume private.
**C:** Publish private diagnostics.

### Q572 — Grill completion

**A — Approved recommendation:** All choices approved, conflicts resolved and architecture reviewed.
**B:** First round sufficient.
**C:** Visual polish sufficient.

# Contributing

This is a teaching project. Changes should make a physical idea easier to understand **without making the underlying model less honest**.

Before opening a pull request:

1. Run `bun test` and `bun run build`.
2. Keep calculated values in `src/physics.js`, not duplicated as independent numbers in the UI.
3. Explain new assumptions in `docs/ENGINEERING.md` and distinguish teaching approximations from measured engine data.
4. Check the desktop and narrow-mobile layout. The 3D model should still be usable with reduced performance.
5. Keep public content free of personal paths, accounts, contact details, credentials, and private infrastructure references.

Bug reports are most useful with the control settings, expected behavior, and actual result. If a change touches aerodynamic or thermodynamic equations, include a source and a test case.

## Local commands

```sh
bun test
bun run build
bun run dev
```

The site has no hosted backend. Pull requests should not introduce accounts, telemetry, or network dependencies just to reproduce an existing interaction.

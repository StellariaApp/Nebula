# @stellaria/nebula-tokens

The contract. `NebulaTheme` defines the exact shape of a theme — colour roles, typography, geometry,
motion, effects and the variant recipes — and this package is where that type lives, along with the
non-chromatic base tokens and the 20 generated 50–950 palettes.

**Zero runtime dependencies**, by design and enforced in CI. It is types and data; nothing executes.

## Install

```bash
pnpm add @stellaria/nebula-tokens
```

You rarely install it alone: `@stellaria/nebula-web` and `@stellaria/nebula-themes` both depend on it.
Reach for it directly when you are writing a theme, or typing something against the contract.

## What you get

```ts
import { palettes, radius, spacing, type NebulaTheme } from "@stellaria/nebula-tokens";

// A theme is data that satisfies the contract, so it round-trips as JSON
// and feeds web and native from the same object.
const mine = { ...base, colors: { ...base.colors, primary: palettes.teal } } satisfies NebulaTheme;
```

- **`NebulaTheme`** and every type it is made of. A theme that misses a section does not typecheck.
- **`palettes`** — 20 families in 11 steps, generated in OKLCH. `palettes.ts` is generated output; it
  is not edited by hand.
- **Base tokens**: `font`, `radius`, `spacing`, `sizes`, `animation`, `effects`, `zIndex`,
  `breakpoints`, `ink`.
- **Shared types** the components use: `BaseProps`, `NebulaField`, `VariantRecipe`, `Unit`, `Size`.

Ink policy lives here too: `ink.floor` is the contrast ratio below which light text gives way to
dark over a fill. `0` keeps it light no matter what — a product's call, not the library's.

## Compatibility

ESM only. Node 20+ to build. No React dependency: it is platform-agnostic on purpose, which is what
lets web and native share one theme.

## Documentation

<https://nebula.stellaria.app>

## Licence

MIT.

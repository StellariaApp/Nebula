# @stellaria/nebula-themes

The official themes and the runtime validator. `light` and `dark`, built on the indigo→violet axis,
plus the Zod schema that checks any theme you load at runtime.

## Install

```bash
pnpm add @stellaria/nebula-themes @stellaria/nebula-tokens
```

## What you get

```ts
import { officialThemes, LoadTheme } from "@stellaria/nebula-themes";

// Ship one of the two…
const dark = officialThemes.dark;

// …or validate your own before handing it to the provider.
const mine = LoadTheme(await (await fetch("/tenant-theme.json")).json());
```

- **`officialThemes`** with `light` and `dark`, and `officialThemeNames` to iterate them.
- **`LoadTheme`** — parses and validates against `themeSchema`, and throws a `ThemeValidationError`
  that names the offending path. Use it on anything that did not come from your own build.
- **`themeSchema`** if you want to validate without loading.
- **`FlipScale`** for building a dark scale from a light one.

A theme is plain JSON that satisfies `NebulaTheme`, so the same file feeds web and native. Every
official theme passes WCAG 2.2 AA on every text/surface pair in CI — 158 pairs each.

## Compatibility

ESM only. Node 20+ to build. Depends on `zod` for the runtime schema; the type contract itself lives
in `@stellaria/nebula-tokens` and carries no dependencies.

## Documentation

<https://nebula.stellaria.app>

## Licence

MIT.

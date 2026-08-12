# @stellaria/nebula-hooks

Cross-platform hooks with no UI. The same API on web and on React Native, so behaviour written once
does not fork per platform.

## Install

```bash
pnpm add @stellaria/nebula-hooks @stellaria/nebula-tokens
```

`react` is a peer.

## What you get

```tsx
import { useTheme, useMediaQuery, usePermission } from "@stellaria/nebula-hooks";

const { theme, setTheme, scheme, systemScheme } = useTheme();

// setTheme takes an official name or a whole NebulaTheme, so a tenant
// repaints everything without remounting.
setTheme("light");
```

- **`useTheme`** — the theme, the scheme, and the setter. Identical signature on both platforms.
- **`useMediaQuery`** — breakpoints from the theme, SSR-safe.
- **`usePermission`** — permission gating against a resolver you inject; the core is never coupled to
  your backend.
- **`useDeviceTier`**, **`useReducedMotion`**, and the overlay and motion helpers the catalogue uses.

## Compatibility

React 19.2+. ESM only. Node 20+ to build.

## Documentation

<https://nebula.stellaria.app>

## Licence

MIT.

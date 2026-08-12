# @stellaria/nebula-web

The web half of Nebula: **158 components** built on three layers — React Aria for behaviour and
accessibility, Vanilla Extract for zero-runtime CSS, and `motion` for animation whose springs come
from the theme.

Two products that look nothing alike ship from these same components. You change the theme, never
the code.

## Install

```bash
pnpm add @stellaria/nebula-web @stellaria/nebula-themes @stellaria/nebula-tokens @stellaria/nebula-hooks
```

`react` and `react-dom` are peers — bring your own. `@stellaria/nebula-icons` is optional, and so are
the integrations further down.

## Quickstart

Two things the library cannot do for you, and the reason your first render may look wrong:

```tsx
// app/layout.tsx
import { ColorSchemeScript, NebulaProvider } from "@stellaria/nebula-web";
import "@stellaria/nebula-web/dist/index.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <NebulaProvider defaultTheme="dark">{children}</NebulaProvider>
      </body>
    </html>
  );
}
```

1. **Import the stylesheet.** The CSS is compiled at build time and shipped as a file; nothing
   injects it at runtime.
2. **Put `<ColorSchemeScript />` in the `<head>`.** It sets `color-scheme` before hydration, which is
   what stops a light flash on a dark theme.

Then:

```tsx
import { Button, Card, Text } from "@stellaria/nebula-web";

<Card withBorder p="lg" r="lg">
  <Text fz="h4">Ready</Text>
  <Button variant="gradient" onPress={() => {}}>
    Go
  </Button>
</Card>;
```

## Subpaths

Heavy dependencies are isolated so the main entry never pays for them. Importing `Button` does not
drag Recharts, TipTap or the table engine — **verified with a bundle, not assumed**.

| Entry                              | What it brings                    | Components | Budget (brotli, per module) |
| ---------------------------------- | --------------------------------- | ---------: | --------------------------: |
| `@stellaria/nebula-web`            | the catalogue                     |        149 |    `Box` 19.75 · `Button` 42.25 |
| `@stellaria/nebula-web/charts`     | Recharts                          |          1 |                      131 kB |
| `@stellaria/nebula-web/datagrid`   | TanStack Table + virtualiser      |          1 |                   102.25 kB |
| `@stellaria/nebula-web/editor`     | TipTap                            |          2 |                   175.25 kB |
| `@stellaria/nebula-web/command`    | command palette, on React Aria    |          1 |                       80 kB |
| `@stellaria/nebula-web/media`      | `react-player`                    |          1 |                       70 kB |
| `@stellaria/nebula-web/carousel`   | Embla                             |          1 |                       51 kB |
| `@stellaria/nebula-web/dnd`        | dnd-kit                           |          2 |                       48 kB |

Budgets are enforced in CI by `size-limit` per module, not for the whole package.

**The CSS is all-or-nothing.** `sideEffects` marks the compiled sheets as side-effectful — it has to,
or a bundler would drop the styles of the components you use. So importing one component keeps the
catalogue's stylesheet. The JavaScript does tree-shake; the CSS does not.

## Optional integrations

Declared **structurally** and never imported, so you install them only if you use them:

| Peer                    | Used by         | Why optional                                     |
| ----------------------- | --------------- | ------------------------------------------------ |
| `form-atoms`            | form fields     | any field works controlled, without a form library |
| `@pqina/react-pintura`  | `EditorImage`   | commercial licence: it is never a dependency of ours |

## Compatibility

| | |
| ------------ | --------------------------------------------------- |
| React        | 19.2+ |
| Next.js      | 16+ — App Router, server components by default |
| Node         | 20+ (build only; the package ships no server code) |
| Modules      | ESM only. No CJS build |
| TypeScript   | 5.9+ for consumers |

Server components work out of the box: a component only carries `"use client"` when it resolves the
theme at runtime or holds state. The catalogue says which is which on every page of the docs.

## Documentation

<https://nebula.stellaria.app>

Every component has its own page with props, slot props, the entry point it ships from and a live
sample.

## Licence

MIT.

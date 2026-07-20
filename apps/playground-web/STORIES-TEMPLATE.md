# Plantilla de stories obligatorias (playground-web)

> Referencia canónica para W1.4–W4. Toda story CSF3 (Storybook 10.5). El gate a11y
> (`turbo a11y`) corre axe sobre TODAS las stories; el gate `size` mide el bundle.

## Dónde viven las stories

- **App-side**: `apps/playground-web/src/stories/<Categoría>/<Nombre>.stories.tsx`, una por componente. Importan desde el especificador público `@stellaria/nebula-web` (nunca deep-imports).
- Se mantiene `packages/web` **libre de dependencias de Storybook** (los tipos `Meta`/`StoryObj` viven solo en la app).
- **DX de autoría (W1.4+)**: para HMR sobre el código fuente de los componentes, Storybook aliasará `@stellaria/nebula-web` → `packages/web/src/index.ts` y añadirá el plugin de Vanilla Extract en `viteFinal` (se cablea al aterrizar el primer componente en W1.4). Hoy W1.3 consume el `dist` precompilado (valida el artefacto de ADR-016).

## Toolbar global (ya disponible)

- **Tema**: `nebula-light` / `nebula-dark` / `sober-light` / `playful` (decorator envuelve cada story en `NebulaProvider`, remonta al cambiar).
- **Motion**: `Motion on` / `Reduced motion` (simula `prefers-reduced-motion`).
- **Viewport**: phone/tablet/laptop/desktop/wide (breakpoints del theme).

## Stories obligatorias por componente

| Story           | Qué cubre                                                                               |
| --------------- | --------------------------------------------------------------------------------------- |
| `Default`       | render base con props mínimas.                                                          |
| `Variants`      | todas las variantes del `variantMap` (filled/outline/light/glass/ghost/glow/gradient…). |
| `Sizes`         | escala `xs–xl` (heights de `sizes.control`).                                            |
| `States`        | hover/active/focus/disabled/loading según aplique.                                      |
| `Dark`          | fijado en `nebula-dark` vía `globals` (además del toggle de toolbar).                   |
| `ReducedMotion` | fijado en reduced-motion; verifica el fallback de animación.                            |

**Play function de teclado** (obligatoria donde haya interacción): Tab/Enter/Space/flechas/Esc/Home/End según el patrón APG del componente (docs/03 §1). Usa `play` + `@storybook/test`.

## Reglas a11y (gate `turbo a11y`)

- 0 violaciones axe. La regla `region` está desactivada globalmente (las stories son fragmentos, no páginas).
- Todo control solo-icono lleva `aria-label`/`VisuallyHidden`; inputs con label vinculado; focus visible (`colors.border.focus`).
- El contraste lo garantizan los temas (gate `check:contrast`); no metas hex crudos en las stories.
- Exonerar una story puntual: `parameters: { a11y: { disable: true } }` (con justificación).

## Esqueleto CSF3

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { within, userEvent, expect } from "@storybook/test";

import { Button } from "@stellaria/nebula-web";

const meta: Meta<typeof Button> = {
  title: "Actions/Button",
  component: Button,
  args: { children: "Acción" },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {(["filled", "outline", "light", "ghost"] as const).map((v) => (
        <Button key={v} {...args} variant={v}>
          {v}
        </Button>
      ))}
    </div>
  ),
};

export const Dark: Story = { globals: { theme: "nebula-dark" } };

export const ReducedMotion: Story = { globals: { reducedMotion: "reduce" } };

export const KeyboardActivation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Acción" });
    button.focus();
    await userEvent.keyboard("{Enter}");
    await expect(button).toHaveFocus();
  },
};
```

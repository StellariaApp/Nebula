---
name: ui-web-patterns
description: Patrones de componentes de @stellaria/nebula-web — tres capas React Aria (behavior) + Vanilla Extract (visual) + motion, con RSC y a11y APG.
---

# Patrones web (`@stellaria/nebula-web`)

Reescrito para el stack real de Nebula (ADR-002/003/004): **React Aria hooks + Vanilla Extract + motion v12**. No hay Radix, no hay Mantine, no hay CSS-in-JS runtime.

## Tres capas por componente (docs/01 §4)

1. **Behavior/a11y**: hooks de React Aria (`useButton`, `useDialog`, `useComboBox`…) — focus management, keyboard nav y ARIA correctos (APG). HTML nativo donde baste (`<dialog>`, `<details>`).
2. **Visual**: `recipe()` de VE (variant × size × state) + `sprinkles` SOLO en primitivos de Layout (equivalente web del Collector). Los valores llegan por CSS vars del theme (`createThemeContract`) — zero-runtime.
3. **Motion**: `motion` v12 alimentado por `theme.motion.*`; degradar a CSS transitions en componentes simples; `prefers-reduced-motion` colapsa a fades ≤120ms o nada.

## Estructura por componente

```
components/<Category>/<Name>/
  <Name>.tsx        # forwardRef; hooks de Aria + motion
  <Name>.types.ts   # re-exporta/extiende el contrato compartido de nebula-tokens
  <Name>.css.ts     # recipe() para variantes/sizes
  vars.css.ts       # CSS vars locales (si aplica)
  use<Name>.ts      # lógica (opcional)
  index.ts
```

## Reglas

- Los estilos SOLO leen roles semánticos del theme (`colors.surface.*`, `sizes.control.*`) vía vars — nunca paletas crudas ni hex.
- **RSC**: presentacionales (Text, Title, Divider, Paper…) server-safe SIN `"use client"`; interactivos con `"use client"` en el boundary. Regla de lint propia.
- Variantes pintan según `theme.variantMap` (recetas temables) — no lógica de color por componente.
- `aria-label` obligatorio en todo control solo-icono; focus visible con `colors.border.focus` (≥3:1).
- Deps pesadas (charts/dnd/editor/datagrid/command/carousel) SOLO en subpath exports (ADR-014).

## Anti-patterns

- Reimplementar keyboard/focus a mano cuando existe hook de React Aria.
- Estilos inline dinámicos o clases duplicadas por tema (el theming es por CSS vars).
- Props ambiguas sin tipos (`config`, `options` sueltos) — todo tipado desde el contrato compartido.

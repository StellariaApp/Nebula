---
name: theme-a11y-motion
description: Reglas AA de theming, contraste y motion de Nebula — WCAG 2.2 AA estricto validado por tooling, reduced-motion obligatorio.
---

# Theme + A11y + Motion (WCAG 2.2 AA estricto)

## Reglas

- Contraste validado **por tooling, no por auditoría manual**: `pnpm check:contrast` (4.5:1 texto, 3:1 large/UI, focus ≥3:1) sobre cada tema oficial; corre en PRs que toquen tokens/themes/contrato.
- Focus visible obligatorio: `colors.border.focus` con ≥3:1 contra la superficie; nunca `outline: none` sin reemplazo.
- Touch targets ≥44×44pt native / ≥24px CSS (WCAG 2.2 · 2.5.8).
- Nunca depender solo del color para comunicar estado (icono/texto/forma acompañan).
- Motion SIEMPRE vía tokens del theme (`motion.duration/easing/spring`) — jamás duraciones o easings sueltos.
- `motion.tier` del tema gobierna la intensidad global: `minimal` colapsa animaciones no esenciales; `disabled` de sistema (`prefers-reduced-motion` web / `ReduceMotion.System` native) SIEMPRE respetado con fallback funcional (fades ≤120ms o nada).
- Hot paths solo `transform` + `opacity`; nunca animar width/height/top en interacciones continuas.
- Motion expresivo solo en feedback y overlays; sobrio en tablas y formularios densos.

## Checklist por PR

- [ ] ¿`pnpm check:contrast` verde (incluye estados hover)?
- [ ] ¿Foco visible y navegación por teclado conservados (web)?
- [ ] ¿Animaciones sobre `transform`/`opacity` y alimentadas por tokens?
- [ ] ¿Fallback verificado con reduced-motion activo?

## Anti-patterns

- Introducir un easing/duración sin token compartido.
- Animaciones expresivas en workflows data-dense.
- Pares texto/superficie nuevos sin añadirlos a `tools/contrast-check/src/pairs.ts`.

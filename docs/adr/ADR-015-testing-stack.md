# ADR-015 — Stack de testing

- **Estado**: aceptada · 2026-07-14
- **Contexto**: los 3 repos fuente tienen **cero tests**; el único gate hoy es `tsc --noEmit`. Una librería de ~213 componentes con contrato AA no puede depender de QA manual.
- **Decisión**:
  - **Unit/interaction**: Vitest + React Testing Library (web); Jest + RNTL (native, por compatibilidad Metro/Expo). Contrato mínimo por componente: render de variantes, interacción principal, contrato a11y (roles/labels/keyboard).
  - **Stories como fixtures**: las CSF de Storybook 10 alimentan interaction tests (play functions) y el pipeline axe (ADR-007, 03 §4).
  - **E2E**: Playwright sobre playground-web y theme-creator; Maestro sobre playground-native (flujos: abrir overlay, navegar por teclado/gesto, cambiar tema, reduced-motion).
  - **Gates CI por PR**: typecheck (TS 7) + lint + unit + axe-stories + contrast-check de temas + size-limit.
- **Alternativas**: Jest en web (más lento que Vitest con VE); solo tests visuales/snapshots (frágiles, no verifican comportamiento ni a11y).
- **Consecuencias**: el "testing contract" se documenta en la skill de quality-gates; ningún componente sale de Tier 1 sin su contrato de tests completo.

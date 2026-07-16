---
name: quality-gates
description: Gates de calidad de Nebula por cambio y por fase — typecheck TS7, lint, contrast-check, y los gates de CI de docs/03 §4 (axe, keyboard, reduced-motion, size-limit).
---

# Quality Gates

## Gates mínimos por cambio (SIEMPRE, desde F0)

```bash
pnpm turbo build typecheck lint   # TS 7 estricto por paquete; lint tipado (TS 5.9.3 raíz, ADR-012)
pnpm check:contrast               # si tocaste tokens, themes o el contrato NebulaTheme
```

- Typecheck estricto: `strict` total + `noUncheckedIndexedAccess`; presupuesto de `any` = solo fronteras de framework documentadas.
- Los checks de contrato de tokens (`src/__checks__/contract.test-d.ts`) forman parte del typecheck.

## Gates de CI por fase (docs/03 §4 — se activan al montar cada pieza)

| Gate | Qué valida | Herramienta | Desde |
|---|---|---|---|
| axe sobre stories | 0 violaciones a11y en TODAS las stories web | @storybook/addon-a11y + test-runner | F1 |
| Contrast check | pares texto/superficie y estados AA de cada tema oficial | `tools/contrast-check` | **F0 (activo)** |
| Keyboard tests | Tab/flechas/Esc/Enter en overlays, menús, combobox, tabs | Storybook play functions | F2 |
| Reduced motion | fallbacks con `prefers-reduced-motion` / mock `ReduceMotion` | stories parametrizadas | F2 |
| Bundle budget | primitivos ≤5 kB · compuestos ≤15 kB · patterns ≤35 kB gzip | size-limit por entry | F1 |
| Native a11y | props `accessibility*` por contrato | lint + RNTL | F2 |
| Tests unit/interaction | testing contract por componente (ADR-015) | Vitest/RTL + Jest/RNTL | F2 |

## Gate de documentación

- Cambio de estructura/arquitectura/API pública ⇒ actualizar `docs/` + ADR + la skill afectada en el mismo PR.
- Fase nueva no se abre sin el gate de la anterior en verde (docs/05).

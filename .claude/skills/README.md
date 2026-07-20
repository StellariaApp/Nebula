# Skills de gobernanza de Nebula

Migradas/adaptadas desde `.claude/skills` de Stellaria según docs/01 §9 y la tabla del anexo C §4 (7 migrar · 5 adaptar · 4 no aplican · 1 revisar).

## Orden de aplicación sugerido

1. `project-guardrails` — antes de cualquier cambio.
2. Skill de capa: `monorepo-workspace` · `typescript-strict` · `ui-web-patterns` · `ui-native-patterns` · `tokens-governance` · `theme-a11y-motion` · `effects-guardrails` · `permissions-mirror`.
3. Validar con `quality-gates`; documentar con `architecture-decisions`; commitear con `git-pr-conventions`.

## Trazabilidad con Stellaria

| Skill Nebula           | Origen                            | Acción                                                    |
| ---------------------- | --------------------------------- | --------------------------------------------------------- |
| project-guardrails     | 00-project-guardrails             | Adaptada (reescrita para el grafo y reglas de Nebula)     |
| monorepo-workspace     | 10-monorepo-workspace             | Adaptada (turbo+pnpm de Nebula, ESM, TS7)                 |
| typescript-strict      | 11-typescript-strict              | Migrada (+contingencia ADR-012, checks de contrato)       |
| ui-web-patterns        | 20-ui-web-patterns                | **Reescrita** para React Aria + Vanilla Extract + motion  |
| ui-native-patterns     | 21-ui-native-patterns             | Migrada (paths de Nebula + contrato a11y 03 §1)           |
| tokens-governance      | 22-style-system-tokens-governance | Migrada (contrato NebulaTheme + palette-gen)              |
| theme-a11y-motion      | 23-theme-a11y-motion              | Migrada (AA validado por contrast-check)                  |
| effects-guardrails     | 24-effects-glass-blur-gradients   | Migrada (+gradients tokens, glass.enabled, useDeviceTier) |
| permissions-mirror     | 33-permissions-frontend-mirror    | Adaptada → **spec de PermissionGate** (docs/01 §6)        |
| architecture-decisions | 50-architecture-decisions         | Migrada (formato de los ADRs reales del repo)             |
| quality-gates          | 90-quality-gates                  | Migrada + **ampliada** con los gates de docs/03 §4        |
| git-pr-conventions     | 91-git-pr-conventions             | Migrada (scopes de Nebula)                                |

**No aplican a Nebula** (fuera de una librería UI): 30-services-domain-patterns, 31-api-query-websocket, 32-enterprise-multi-tenant, 40-pos-offline-first.

**Revisada — 99-custom-skills-roadmap**: sus items (POS hardware, offline conflict-resolution, observability) no aplican. Roadmap de skills futuras de Nebula:

- `testing-contract` — al activar ADR-015 en F2 (contrato de tests por componente).
- `stories-csf-shared` — en F1 con los playgrounds (stories compartidas W/N como fixtures).
- `bundle-budget` — cuando exista `tools/bundle-budget` (budgets de docs/03 §3).

## Mantenimiento

- Cambio relevante de arquitectura ⇒ actualizar doc + ADR + skill en el mismo PR.
- Si una regla falla en la práctica, se corrige en la skill con ejemplo.
- Mantener las skills cortas, accionables y verificables.

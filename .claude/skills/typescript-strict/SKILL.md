---
name: typescript-strict
description: Reglas de type-safety extremo de Nebula — presupuesto de any, patrones type/interface/satisfies y la contingencia TS 7/5.9.
---

# TypeScript estricto en Nebula

## Reglas

- Presupuesto de `any`: **0** en tokens/hooks/themes/icons; en web/native solo fronteras de framework documentadas con comentario (herencia Stellaria: `CreateAnimated` ×4 y similares).
- Preferir `unknown` + narrowing explícito; `Record<string, unknown>` para props dinámicas (p.ej. `cloneElement`).
- `strict` total heredado de `tsconfig.base.json` (incluye `noUncheckedIndexedAccess` y `exactOptionalPropertyTypes`) — nunca relajarlo por paquete.
- **Sin features exclusivas de TS 7** mientras el lint parsee con 5.9 (ADR-012 — mantiene la vía de retorno).
- Contratos públicos de componentes compartidos entre plataformas viven en `@stellaria/nebula-tokens/types` (patrón `<Cat>Props` + `Keys<Cat>`); los `Keys*` runtime deben cubrir `keyof` de sus Props EXACTO (check en `src/__checks__/contract.test-d.ts`).

## Patrones

- `type` para composición y unions; `interface` para contratos extendibles (secciones del theme).
- `as const satisfies X` para tokens (valida sin ensanchar).
- Loose strings con autocomplete: `Token | (string & Record<never, never>)` — nunca `Token | string` (la unión se colapsa).
- Checks de tipos negativos/positivos en `__checks__/*.test-d.ts` (se typecheckan y lintean, excluidos del build).

## Validación

- `pnpm typecheck` verde (tsc 7.0.2 por paquete); `pnpm lint` verde (typescript-eslint sobre TS 5.9.3 raíz).

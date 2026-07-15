# ADR-001 — Monorepo con Turborepo + pnpm

- **Estado**: aceptada · 2026-07-14
- **Contexto**: Nebula necesita ~8 paquetes publicables + 3 apps con caché de builds y pipelines por paquete. Stellaria ya validó Turborepo+pnpm; el equipo lo conoce. Versiones verificadas: turbo 2.10.5, pnpm 11.13.
- **Decisión**: Turborepo 2.10 + pnpm 11 workspaces. Pipelines: `build`, `typecheck`, `lint`, `test`, `size`, `a11y` con caché remota.
- **Alternativas**: Nx (más features, más complejidad/lock-in de plugins); pnpm workspaces solo (sin caché de tareas ni grafo).
- **Consecuencias**: convención `workspace:*` entre paquetes; publicación con changesets (a definir en Etapa 2); los dominios premium usan `publishConfig` hacia registry privado.

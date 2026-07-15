# ADR-012 — TypeScript 7 (compilador nativo) desde el inicio

- **Estado**: aceptada · 2026-07-14 (C2-Q8 — decisión del propietario; la recomendación técnica era empezar en la última 5.x/6.x)
- **Contexto**: TS 7.0.2 (port nativo en Go, ~10× más rápido) es la última estable. Riesgo: partes del toolchain (plugin de Vanilla Extract, typed-linting de ESLint, Metro/Expo, Storybook builder) pueden no soportar aún TS 7.
- **Decisión**: scaffold del monorepo con TypeScript 7.0 desde el día 1.
- **Plan de contingencia (obligatorio)**: (1) el spike inicial de Etapa 2 valida la cadena completa VE + Metro/Expo 57 + Storybook 10 + eslint bajo TS 7 ANTES de escribir componentes; (2) si algo bloquea, se fija la última 5.x/6.x SOLO en el paquete afectado (pnpm permite versiones por workspace) sin revertir el resto; (3) no usar features exclusivas de TS 7 en código de librería hasta pasar el spike, para mantener la vía de retorno abierta.
- **Consecuencias**: builds/typechecks muy rápidos en un monorepo de ~213 componentes; riesgo de fricción temprana absorbido por el spike; revisar trimestralmente el estado del ecosistema.

# ADR-012 — TypeScript 7 (compilador nativo) desde el inicio

- **Estado**: aceptada · 2026-07-14 (C2-Q8 — decisión del propietario; la recomendación técnica era empezar en la última 5.x/6.x)
- **Contexto**: TS 7.0.2 (port nativo en Go, ~10× más rápido) es la última estable. Riesgo: partes del toolchain (plugin de Vanilla Extract, typed-linting de ESLint, Metro/Expo, Storybook builder) pueden no soportar aún TS 7.
- **Decisión**: scaffold del monorepo con TypeScript 7.0 desde el día 1.
- **Plan de contingencia (obligatorio)**: (1) el spike inicial de Etapa 2 valida la cadena completa VE + Metro/Expo 57 + Storybook 10 + eslint bajo TS 7 ANTES de escribir componentes; (2) si algo bloquea, se fija la última 5.x/6.x SOLO en el paquete afectado (pnpm permite versiones por workspace) sin revertir el resto; (3) no usar features exclusivas de TS 7 en código de librería hasta pasar el spike, para mantener la vía de retorno abierta.
- **Consecuencias**: builds/typechecks muy rápidos en un monorepo de ~213 componentes; riesgo de fricción temprana absorbido por el spike; revisar trimestralmente el estado del ecosistema.

## Resultado del spike (2026-07-15)

Spike ejecutado en `spike/` (descartable, no versionado) con `typescript@7.0.2` (latest en npm),
Node 26.2, pnpm 11. Veredicto por eslabón de la cadena:

| #   | Eslabón                                                                                             | Resultado        | Detalle                                                                                                                                                                                                                                                                                         |
| --- | --------------------------------------------------------------------------------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| a   | TS puro (`tsc --noEmit` + build con emit de `.d.ts`)                                                | ✅ VERDE         | Emit funciona. **Migración requerida**: TS 7 exige `rootDir` explícito cuando hay `outDir` (error TS5011, ver aka.ms/ts6). El tsconfig base del monorepo lo fija.                                                                                                                               |
| b   | Vanilla Extract (`@vanilla-extract/css` 1.21.1 + `recipes` 0.5.7 + `vite-plugin` 5.2.5, vite 8.1.4) | ✅ VERDE         | `.css.ts` con `style`/`createVar`/`recipe` typechecka bajo TS 7 y compila a CSS estático. El plugin evalúa con esbuild — independiente de la versión de tsc.                                                                                                                                    |
| c   | Expo SDK 57 (expo 57.0.6, RN 0.86.0, react 19.2.7)                                                  | ✅ VERDE         | `tsc --noEmit` limpio extendiendo `expo/tsconfig.base`; `expo export --platform android` bundlea 577 módulos vía Metro (Metro transpila TS con Babel — independiente de tsc).                                                                                                                   |
| d   | Storybook 10.5.0 (builder vite, framework `@storybook/react-vite`)                                  | ✅ VERDE         | `storybook build` completa y `storybook dev -p 6006` responde HTTP 200 con una story CSF3 tipada (`satisfies Meta<...>`).                                                                                                                                                                       |
| e   | ESLint 9.39.5 + typescript-eslint 8.64.0 (typed linting)                                            | ❌ ROJO con TS 7 | Crash duro al cargar el parser: `TypeError: Cannot read properties of undefined (reading 'Cjs')` en `@typescript-eslint/typescript-estree` — TS 7 (binario nativo Go) no expone la API JS del compilador que typescript-eslint necesita. Su peer range lo declara: `typescript >=4.8.4 <6.1.0`. |

### Contingencia aplicada (alcance mínimo)

Según el plan del ADR: se fija **TypeScript 5.9.3** (última 5.x estable; 6.x solo existe como
`6.0.0-beta`, descartada para toolchain) **exclusivamente para la cadena de lint**:

- `typescript@5.9.3` como devDependency de la **raíz** del workspace, donde viven `eslint` y
  `typescript-eslint` (pnpm resuelve el peer del parser contra esa instancia).
- Cada paquete declara su propio `typescript@7.0.2` para `tsc` (build/typecheck) — el bin local
  del paquete tiene precedencia sobre el de la raíz.
- Verificado empíricamente: con 5.9.3 el typed linting obtiene tipos reales
  (`@typescript-eslint/no-floating-promises` dispara sobre un archivo trampa).

**Build, typecheck, VE, Metro/Expo y Storybook quedan en TS 7.0.2** — la contingencia NO los toca.

### Reglas derivadas

1. Mantener la regla del ADR: **sin features exclusivas de TS 7** en código de librería mientras
   el lint parsee con 5.9.x (garantiza además la vía de retorno).
2. `rootDir` explícito en todo tsconfig con `outDir` (requisito TS 7).
3. Revisión trimestral: cuando typescript-eslint soporte TS 7 (o su sucesor nativo tipo
   `tsgolint` madure), retirar el pin 5.9.3 de la raíz y cerrar la contingencia.

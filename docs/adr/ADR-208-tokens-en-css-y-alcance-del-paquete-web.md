# ADR-208 — Los tokens salen también como CSS y se cierra el alcance de los componentes esenciales

- **Estado**: **propuesta** · 2026-10-28 — rama `feat/nebula-alcance`, pendiente de revisión del propietario.
- **Cambia API pública**: sí, y **solo añade** en `@stellaria/nebula-tokens`: el subpath `./css`
  (`dist/tokens.css`) y los exports `BuildTokensCss`, `LIGHT_SCHEME` y `DARK_SCHEME`. Además, un
  cambio de comportamiento en `@stellaria/nebula-web`: `Table.Row` con `onPress` deja de llevar
  `role="button"` y conserva el rol `row`.
- **Dependencias nuevas**: `axe-core@4.12.1` como `devDependency` de `@stellaria/nebula-web`
  (la misma versión que ya resolvía `axe-playwright` en el lockfile). Ninguna de runtime.
- **Toca**: `packages/tokens/{src/css,scripts,test,package.json,turbo.json}`,
  `packages/themes/src/__tests__/tokens-css.test.ts`, `packages/web/src/__tests__/{axe.ts,a11y-contract.test.ts}`,
  las suites `*.a11y.test.tsx`, `Table`, `Select`, `Menu`, `apps/playground-web` (historias, `Dockerfile`,
  `Caddyfile`), `docs/inventario-componentes.md`.

## Contexto

Dos consumidores nuevos no pasan por React: un proyecto Astro estático de páginas de preventa, que casi no
lleva JavaScript, y un panel interno en React con Vite que solo necesita los valores. Hasta ahora los
tokens solo se podían usar importando el tema y materializándolo con Vanilla Extract (`docs/02` §4), que
exige React y el plugin de Vite.

Además, un repaso del paquete web con axe encontró defectos en componentes que contaban como
terminados porque tenían pruebas y historia (ver `docs/inventario-componentes.md`).

## Decisión

1. **`@stellaria/nebula-tokens/css`** es un CSS de custom properties con prefijo `--nebula-*`: paletas,
   color semántico por esquema (`primary`, `accent`, `gray`, `success`…`info`, `surface`, `text`,
   `border`), tipografía, espacio, radios, tamaños de control, sombras, movimiento y capas.
   - Sale de los tokens de TS: paletas, tipografía, espacio, radios y movimiento se leen de las mismas
     constantes; el esquema claro y el oscuro están en `src/css/scheme.ts` con los mismos pasos de paleta
     que `themes/_base`.
   - `:root` lleva el claro. `prefers-color-scheme: dark` aplica el oscuro salvo que el documento fije
     `data-theme="light"`; `[data-theme="dark"|"light"]` lo fija en la raíz o en cualquier subárbol.
   - `prefers-reduced-motion: reduce` pone las duraciones a `0ms`.
   - Se genera en `build` (`scripts/build-css.mjs`, después de `tsc`) y se publica en `dist/tokens.css`.
2. **Por qué el esquema vive en `tokens` y no se lee del tema.** `tokens` no puede depender de `themes`
   (grafo de una sola dirección) y no lleva dependencias de runtime. A cambio hay dos escrituras de la misma
   verdad, y lo que impide que se separen es `themes/src/__tests__/tokens-css.test.ts`, que compara el
   tema `nebula` claro y oscuro con `LIGHT_SCHEME`/`DARK_SCHEME`. La alternativa —mover las superficies de
   `_base` a `tokens`— se deja para otro ADR porque toca los 16 temas.
3. **La prueba de tokens usa `node:test`**, sin framework: `tokens` no tenía runner y añadir `vitest` solo
   para esto arrastraba una entrada nueva en el lockfile. Corre sobre `dist`, así que `turbo test` depende
   de `build` en ese paquete (`packages/tokens/turbo.json`).
4. **`axe-core` en las pruebas del paquete web** (`src/__tests__/axe.ts`). jsdom no tiene layout, así que
   el contraste (`color-contrast`) se deja a `pnpm check:contrast` y al gate de Storybook en navegador real.
5. **`Table.Row` pulsable conserva el rol `row`.** `role="button"` sobre un `<tr>` sacaba la fila de la
   tabla y hacía inválido `aria-selected`. Sigue siendo enfocable y se activa con Enter y Espacio.
6. **Storybook ya es estático** (`storybook build` → `apps/playground-web/storybook-static`, unos 14 MB).
   Se añade el alias `build-storybook`, un `Dockerfile` y un `Caddyfile` que lo sirven. No se despliega.
7. **Se elimina `Rosette/Biblioteca`** (`RosetteBiblioteca.stories.tsx`): era la única pieza del repo con
   la etiqueta `nsfw` y no hay otra referencia.

## Consecuencias

- Un `<link>` o `import '@stellaria/nebula-tokens/css'` basta para usar los tokens en Astro o en el panel.
- Los temas de producto (`marte`, `vela`…) **no** salen en el CSS: solo `nebula`. Un CSS por tema es un
  paso aparte, y ya se puede escribir con `BuildTokensCss` como base.
- `BuildTokensCss` entra en el bundle JS de `tokens`; con `sideEffects` limitado a `*.css` sigue siendo
  eliminable por tree-shaking.

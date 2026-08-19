# ADR-174 — Los puntos de ruptura son estructura, no tema

- **Estado**: **aceptada** · 2026-08-18 — decidida por el propietario
- **Cambia API pública**: sí, y **rompe**. `NebulaTheme` pierde `breakpoints`, y con él sale el tipo
  `ThemeBreakpoints`.
- **Toca**: `packages/tokens`, `packages/themes` (schema y base), `packages/hooks`, `docs/02` §2.

## Contexto

`NebulaTheme.breakpoints` prometía que un tema puede mover los puntos de ruptura. La plataforma no
deja cumplirlo: **una `@media` no puede leer una custom property**. `@media (min-width: var(--bp))`
no es CSS válido y no hay forma de rodearlo sin recompilar las hojas, que es justo lo que el contrato
CSS existe para evitar.

Así que las hojas —`Box`, `Container`, `SimpleGrid`, `Segment`, `theme/media.ts`— nunca leyeron el
tema: usan el token estático `breakpoints` de `@stellaria/nebula-tokens`, horneado en build.

Quien sí lo leía era `useBreakpointUp` / `useBreakpointDown`, que construyen la consulta con
`matchMedia` en JavaScript y ahí sí pueden leer lo que quieran. **Y ese era el problema**: los dos
hooks medían contra los puntos del tema mientras las hojas medían contra los del token. Mientras
ningún tema los cambiara, coincidían por casualidad. El primero que los cambiara habría partido en
dos el sistema responsivo —el CSS ocultando a 768 y el hook diciendo que no— sin que nada avisara.

## Decisión

**`breakpoints` sale de `NebulaTheme`.** Los puntos de ruptura son estructura de la librería, como el
orden de las capas CSS, no una elección de tema.

`useBreakpointUp` y `useBreakpointDown` pasan a leer el token. Dejan además de llamar a `useTheme`,
así que ya no arrastran el contexto: es un componente menos atado al provider, en la línea de
[ADR-150](ADR-150-las-variantes-se-resuelven-una-vez-por-tema.md).

El token `breakpoints` **no se toca**: sigue exportado desde `@stellaria/nebula-tokens` y sigue
siendo el único origen.

## Alternativas

**Dejar el campo y documentar que web lo ignora.** Cero rotura. Se descarta: un campo que los
dieciséis temas deben rellenar, que el schema de Zod valida, y que sólo dos hooks leen —discrepando
del CSS— es peor que no tenerlo. El contrato deja de mentir a coste de una rotura que el lote ya
paga once veces.

**Emitir `@media` por tema.** Multiplica el CSS por el número de puntos de ruptura y obliga a
recompilar las hojas al cambiar de tema, que es exactamente lo que
[ADR-168](ADR-168-el-contrato-css-se-muda-con-los-temas.md) y
[ADR-169](ADR-169-los-temas-comparten-su-base-y-viven-en-una-capa.md) acaban de quitar de en medio.

**Que los hooks sigan leyendo el tema y que las hojas se recompilen.** Misma objeción, y además
convierte un cambio de tema en un cambio de hoja.

## Consecuencias

- **Rompe**: quien construya un `NebulaTheme` a mano tiene que quitar `breakpoints`. Es un campo de
  más, así que el error de TypeScript lo señala en el sitio exacto.
- **Los dos hooks dejan de depender del provider.** Miden lo mismo que el CSS por construcción, no
  por coincidencia.
- Native no se ve afectado: Unistyles recibe sus puntos de ruptura en `StyleSheet.configure`, que ya
  era configuración global y no parte del tema.
- Si algún día hiciera falta que un producto los mueva, el sitio es la configuración de build —donde
  vive el token—, no el tema.

# ADR-192 — La lámina de estado lleva la ilustración al lado y rellena el hueco

- **Estado**: **aceptada** · 2026-09-12 — decidida por el propietario, con la alternativa recomendada · **implementada** el mismo día. Lote «Rosette → Nebula» (`docs/reviews/rosette-a-nebula-2026-09-12.md`).
- **Cambia API pública**: sí, y **solo añade** en `EmptyModule`: `layout="stack" | "side"`,
  `surface="glass"` y `fill`.
- **Toca**: `packages/web/src/components/EmptyModule/`.
- Es el hallazgo #4 de C2 y el «hallazgo abierto» de `docs/07` §9.1.

## Contexto

`EmptyModule` ya tiene `illustration` (una ranura `aria-hidden` cuyo tamaño sale de `size`) y
`surface` (`none | paper | outline | dashed`), y monta un `EmptyState` debajo: la ilustración va
**encima**, apilada (`flexDirection: column`, `EmptyModule.css.ts:10`). Lo que C2 dice de que
«`EmptyState`/`EmptyModule` son icono + título + acción» es impreciso; lo que falta es otra cosa.

La lámina de Rosette (`system-state.tsx`) es un `Card variant="glass" withBorder r="lg"` con la
ilustración **a la izquierda** en retrato 1:2, título `h3`/`h5`, cuerpo `text.muted body2` y una
acción; y desde el 05/09/2026 lleva `flex={1}` + `alignSelf: stretch` porque «todos los empty o
system states tienen que tomar flex»: en una pantalla vacía —que es donde vive— una tarjeta de
500 px flotando arriba con media pantalla de fondo debajo partía el vacío por la mitad. Polaris
reescribió lo suyo (`states/system-states.tsx`) con `EmptyState` + `Alert`: **dos productos, dos
láminas**, y la de Polaris pinta un fallo de la API con el mismo aspecto que un vacío.

Las cinco ilustraciones (vacío, error, no encontrado, sin sesión, bloqueado) son activos del
producto y significan cosas distintas; el `kind` que las elige es del producto también.

## Decisión

```tsx
<EmptyModule layout="side" surface="glass" fill illustration={<Image …/>} title description action />
```

- `layout="side"`: la ilustración a la izquierda y el `EmptyState` a su derecha, alineados al
  centro, con `wrap` para que bajo `tablet` se apile sola. `"stack"` es el defecto y es lo que hay.
- `surface="glass"`: `Card variant="glass" withBorder r="lg"` como superficie, que es la de las
  láminas y avisos de `docs/07` §13.
- `fill`: `flex: 1; align-self: stretch` sobre la raíz, y el contenido centrado dentro. Es la regla
  medida del 05/09.
- `compact` de Rosette es `size="sm"`, que ya existe. `kind` **no entra**: es un mapa de cinco
  activos del producto a una prop `illustration`.

## Alternativas

- **Componente nuevo `StateSheet`**: sería `EmptyModule` con tres props. Dos componentes para el
  mismo estado es lo que ya pasa entre productos.
- **Ilustración en `EmptyState`**: `EmptyState` es el icono + texto sin superficie; la ilustración
  es del módulo, como ya está decidido.

## Consecuencias

- `system-state.tsx` de Rosette pasa a `EmptyModule` con el mapa `kind → asset` de tres líneas;
  `failed.tsx` y `retry.tsx` se quedan en el producto (necesitan `router.refresh`).
- Polaris sustituye `EmptyView`/`ErrorView` por la misma lámina y **su fallo deja de parecer un
  vacío**.
- Story `EmptyModule/Side` con `fill` dentro de un `AppShell.Section` para que se vea rellenar.

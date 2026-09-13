# EmptyModule

`EmptyState` con superficie, ilustración, dos acciones y pie. `EmptyState` es el icono con su texto;
esto es el módulo que se pone donde debería haber contenido.

## `layout="side"`, `surface="glass"` y `fill` (ADR-192)

La lámina de estado de un producto —vacío, fallo, no encontrado, sin sesión, bloqueado— lleva la
ilustración **al lado** del texto, va sobre cristal y **rellena** el hueco de lo que no se pudo
pintar. Rosette la escribió a mano (`system-state.tsx`) y Polaris escribió otra con `EmptyState` +
`Alert`: dos productos, dos láminas, y en la segunda un fallo de la API se veía como un vacío.

- `layout="side"`: la ilustración a la izquierda y el `EmptyState` a su derecha, con el texto
  alineado al inicio; bajo `tablet` se apila sola porque la fila envuelve.
- `surface="glass"`: la raíz es un `GlassSurface component="section" level="strong" r="lg"`, la
  misma lámina que `Card variant="glass" glass="strong" withBorder r="lg"` de la norma (§13 de
  `docs/07`). Las otras superficies siguen siendo el `<section>` liso.
- `fill`: `flex: 1; align-self: stretch` en la raíz. Medido en Rosette el 05/09/2026: sin él, en
  una pantalla vacía quedaba una tarjeta de 500 px arriba y media pantalla de fondo debajo, con el
  borde de la tarjeta partiendo el vacío por la mitad.

Las cinco ilustraciones y su significado son del producto: `illustration` es la ranura y el mapa
`kind → activo` vive en la app.

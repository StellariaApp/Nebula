# Table

Tabla de datos simple sobre los elementos nativos `<table>`, `<thead>`, `<tbody>`, `<tfoot>`, `<tr>`, `<th>` y `<td>`. No ordena, no pagina ni virtualiza: para eso está `DataGrid`.

## Semántica

- La tabla se nombra con `caption`. Con `captionVisible={false}` (el defecto) el texto va dentro de `VisuallyHidden`: los lectores de pantalla lo anuncian y la vista no lo ve.
- `Table.Title` es un `<th>`: `scope="col"` por defecto y `scope="row"` para el encabezado de fila.
- `numeric` alinea la celda al final y activa las cifras tabulares.

## Filas pulsables

`Table.Row` con `onPress` conserva su rol `row`: se vuelve enfocable (`tabIndex 0`) y se activa con Enter y Espacio. Antes se le ponía `role="button"`, y eso sacaba la fila de la tabla: el lector dejaba de contar filas y axe marcaba `aria-allowed-attr`, porque `aria-selected` no es válido en un `button`. `selected` publica `aria-selected` y `data-selected`.

## Tablas anchas

`Table.ScrollContainer` envuelve la tabla en una región con scroll. Es enfocable y lleva `role="region"` con `label`, porque una zona con scroll que el teclado no alcanza deja fuera a quien no usa ratón (regla `scrollable-region-focusable`).

## Motion

La tabla no anima. Solo la fila con `reveal` entra al verse, y esa transición ya respeta `prefers-reduced-motion` desde `Reveal`.

# DataGrid

Vive en el subpath `@stellaria/nebula-web/datagrid` (ADR-014 regla 3, ADR-058). Importar `Button` no
lo arrastra: `dist/index.js` no lo menciona.

## TanStack aporta el modelo; el DOM es de Nebula

`@tanstack/react-table` es headless de verdad —una sola dependencia transitiva, `table-core`— y aquí
solo se usa como motor de sorting, selección y paginación. La tabla que sale al DOM es `<table>`
semántica con `<th scope="col">` y `aria-sort`, no una rejilla de `div`s.

`ColumnDef` y `SortingState` se reexportan desde el subpath a propósito: definir columnas exige el
tipo, y obligar al consumidor a instalar `@tanstack/react-table` solo para importar un tipo sería una
dependencia de más en su `package.json`.

## La virtualización se enciende sola

Por debajo de `virtualizeFrom` (50 por defecto, el umbral que fija el gate de W3 en `docs/03` §3) las
filas se pintan todas. A partir de ahí entra `@tanstack/react-virtual` y solo se montan las visibles,
con dos `<tr aria-hidden>` de relleno arriba y abajo que sostienen la altura del scroll.

Los rellenos son filas de tabla y no `padding` del `<tbody>` porque un `<table>` no admite otra cosa
entre `<tr>`s sin romper el modelo de la tabla —y con él la navegación por filas del lector de
pantalla—. Van con `aria-hidden` para que no se cuenten como filas de datos.

El umbral es prop y no constante porque depende de la altura de fila del producto: 50 filas de 44 px
caben en dos pantallas, 50 filas de 120 px no.

## `sortDescFirst` es de TanStack, y se conserva

Una columna numérica ordena **descendente** en el primer click; una de texto, ascendente. No es un
defecto: es el default de `table-core` y es el que la gente espera —el importe más alto primero, el
nombre por la A—. Se documenta aquí porque sorprende al escribir el primer test.

## Fila pulsable

`onRowClick` añade `tabIndex={0}` y maneja Enter y Espacio, no solo el click. Sin eso la fila sería
inalcanzable por teclado, que es lo que `docs/03` §1 prohíbe para cualquier cosa accionable. La fila
**no** recibe `role="button"`: seguiría siendo una fila de tabla y cambiarle el rol la sacaría del
modelo de la tabla.

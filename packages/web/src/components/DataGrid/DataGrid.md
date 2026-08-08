# DataGrid

Subpath `@stellaria/nebula-web/datagrid`. Motor: `@tanstack/react-table` + `@tanstack/react-virtual`
(ADR-058). W3.4 entregó la base —orden, selección, paginación, virtualización desde 50 filas—; W4.4
añade toolbar, menú de columna, panel de filtros, resize, export CSV y el patrón de teclado completo.

## El patrón de teclado cambia quién es focusable

Hasta W4.4 cada fila pulsable era una parada de tabulación. Con el patrón de grid de APG, **toda la
tabla tiene una sola parada** y el foco se mueve por celda con las flechas. Es un cambio de
comportamiento consciente: una tabla de 200 filas con `onRowClick` metía 200 paradas en el orden de
tabulación de la página, que es exactamente lo que el patrón de grid existe para evitar.

`Enter` sobre cualquier celda de una fila pulsable sigue activándola: el evento burbujea de la celda al
`<tr>`, que es donde vive el handler.

`useGridKeyboard` mueve el foco con `focus()` sobre el DOM, **no con estado de React**. Mover el foco
en una tabla virtualizada de mil filas no puede costar un re-render, y el `tabIndex` de las celdas se
reescribe imperativamente por la misma razón.

Cobertura: flechas, `Home`/`End` (extremos de la fila), `Ctrl+Home`/`Ctrl+End` (primera y última celda
del grid) y `PageUp`/`PageDown` (diez filas). Los límites se recortan, no se envuelven: en un grid,
salirse por abajo y aparecer arriba desorienta.

## `withColumnMenu` obliga a mostrar la toolbar

La condición de montaje de la toolbar incluye `withColumnMenu && hidden.length > 0`, y no es
cosmético: sin ella, ocultar una columna desde su menú dejaba al usuario **sin ninguna forma de
recuperarla** —el botón de restaurar vive en la toolbar, y la toolbar no se montaba si no había
búsqueda, filtros ni acciones—. Lo destapó un test que ocultaba una columna y buscaba el botón.

## El CSV se sanea contra inyección de fórmulas

Una celda que empieza por `=`, `+`, `-` o `@` **la ejecuta Excel** al abrir el fichero: es el vector de
CSV injection, y en una tabla que exporta datos escritos por usuarios es una vía real. `ToCsv`
antepone un apóstrofo a esas celdas, que es la convención de la hoja de cálculo para «esto es texto».

El resto del escapado es el de RFC 4180 —comillas dobladas, entrecomillado cuando hay delimitador o
salto de línea— y el fichero sale con BOM para que Excel lo abra en UTF-8 sin preguntar.

`ToCsv` se exporta desde el subpath y tiene tests propios: la corrección de un fichero que el usuario
descarga no puede depender de una función privada sin cobertura.

## Export: qué filas salen

Por defecto **todas** las del modelo core, no las de la página visible: quien pulsa «exportar» en una
tabla paginada espera el conjunto, no la página. Con `selectionOnly` y selección activa, solo lo
seleccionado. Las columnas ocultas nunca salen —si el usuario las quitó de la vista, quitarlas del
fichero es lo coherente— y la columna de selección tampoco.

**Las dos ramas leen el modelo core, y eso es lo que hace verdad el párrafo anterior.** La de
selección leía el modelo paginado, así que seleccionar tres filas repartidas en tres páginas
descargaba un fichero con una: el mismo razonamiento que justifica exportar el conjunto y no la
página se le aplicaba a la rama por defecto y no a esta. Corregido en la revisión previa a W5, con un
test que selecciona a través de páginas y cuenta las líneas del CSV.

El precio, que ya pagaba la rama por defecto: el orden del fichero es el de origen, no el de la vista
ordenada.

## Resize por teclado, no solo por puntero

El asa es un `<button>` con nombre accesible que responde a las flechas en pasos de 16 px, además del
arrastre. Un asa que solo funciona con ratón es un control inaccesible, y el `cursor: col-resize` no lo
salva.

## Budget

87,34 kB brotli, banda propia de 95 kB. Se intentaron dos deferrals —la toolbar y el `Menu` de la
cabecera— y **ninguno movió la aguja**: el peso es la composición (tabla + virtualizador + Checkbox +
Button + SearchInput + Menu + Tag), no una rama aislable. Queda medido en `docs/03` §3 en vez de
esconderse tras un `lazy` que no ahorra nada y añade una frontera de Suspense.

# TransferList

## Dos listas, dos estados distintos

Hay dos conceptos fáciles de confundir y que aquí están separados a propósito:

- **`value`** — qué elementos están **en el panel de destino**. Es el estado del componente y lo que
  viaja en `onChange`.
- **lo señalado** (interno) — qué elementos están **marcados para mover**. Es efímero, vive por panel y
  se limpia después de cada movimiento.

Sin esa separación, marcar un elemento y moverlo serían la misma acción, y no habría forma de mover
varios de una vez.

## Semántica de la selección

Cada panel es un `role="listbox"` con `aria-multiselectable` y cada fila un `role="option"` con
`aria-selected`. Las filas son `<button>` de verdad, no `<div>` con handler: así el teclado, el foco y
el estado deshabilitado salen del navegador y no hay que reimplementarlos.

`aria-selected` describe **lo señalado**, no lo asignado. En qué panel está un elemento ya lo dice el
panel que lo contiene; usar `aria-selected` para eso dejaría la marca sin forma de anunciarse.

## Los cuatro botones y su estado

Añadir/quitar lo señalado se deshabilitan sin nada señalado; añadir/quitar todo, con el panel vacío.

«Añadir todo» respeta las opciones `disabled`: mover a la fuerza algo que el consumidor bloqueó sería
un agujero, así que filtra antes de mover. Hay que hacerlo explícitamente porque «todo» y «todo lo
permitido» no son lo mismo, y el atajo es justo donde se cuela el error.

## El buscador es por panel

Cada panel tiene su consulta, no hay una compartida. Buscar en el origen mientras se revisa el destino
es el caso normal cuando la lista es larga, y un único campo obligaría a alternar.

# Select

Lista desplegable de una sola elección sobre `useSelect` de React Aria: un botón que abre un `listbox` en un popover. Para elegir varias opciones, `MultiSelect`; para buscar mientras se escribe, `Combobox`; para el `<select>` nativo del navegador, `NativeSelect`.

## Nombre accesible

El botón se nombra con la etiqueta del campo y el valor elegido (`aria-labelledby` apunta a ambos). El `listbox` también lleva el nombre de la etiqueta: React Aria solo sabe del `label` cuando lo recibe como texto, y aquí llega como nodo de `FormField`, así que `Select` lo enlaza a mano con `aria-labelledby` hacia `<id>-label`. Sin etiqueta, el `placeholder` hace de `aria-label`.

## Teclado

Flecha abajo o Enter abren desde el botón; las flechas recorren las opciones y se saltan las deshabilitadas; Enter elige y Escape cierra y devuelve el foco al botón.

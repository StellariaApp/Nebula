# Progress

## `variant` pinta el track, no el relleno

El subconjunto es `light · outline · ghost` y **excluye `filled` a propósito**. En una barra de
progreso, el `background` de la receta es el **track**, y `filled` lo resuelve a `scale.600`, que es el
mismo color del relleno: el indicador desaparecería dentro de su propio contenedor.

El mapeo es por tanto `track ← resolved.background` y relleno ← el acento (`scale.600`), que no cambia.
Sin `variant`, el track sigue siendo `surface.sunken` y nada se mueve.

La alternativa evaluada —tintar el **relleno** al 12 % y dejar el track transparente— se descartó con
medición: el indicador quedaba entre **1,11 y 1,16:1** contra la página en los cuatro temas, muy por
debajo del 3:1 que WCAG 2.2 exige a un componente de UI no textual (criterio 1.4.11). Con el reparto
correcto, el relleno se lee entre 3,84 y 7,05:1 sobre el track tintado, y entre 4,38 y 7,86:1 sobre el
track transparente de `outline` y `ghost`.

## `TrackVars` se resuelve en el componente raíz

`Bar` y `Ring` no son componentes: `Progress` los invoca como funciones, y además **de forma
condicional** (`props.type === "ring" ? Ring(…) : Bar(…)`). Un `useTheme()` dentro de cualquiera de los
dos rompería las reglas de hooks en cuanto el consumidor alternara el `type`. Por eso el hook se llama
una sola vez en `Progress` y el resultado baja como argumento.

El anillo recibe el mismo color como `stroke` de su círculo de fondo, y `"none"` cuando la receta
resuelve el track a transparente: un stroke transparente en SVG dibujaría igualmente el trazo.

## Coste de RSC

Progress era uno de los tres presentacionales server-safe del catálogo. Al adoptar variantes necesita
`useTheme()` y con él `"use client"` (ADR-038, consecuencia aceptada por el propietario). El hook se
llama siempre, también sin `variant`, porque no puede ser condicional.

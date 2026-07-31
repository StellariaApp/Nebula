# Charts

Viven en el subpath `@stellaria/nebula-web/charts` (ADR-014 regla 3, ADR-058). El contrato de props es
el de ADR-011 —`data/series/axes/tooltip/legend` + theming por tokens—, no la API de Recharts: cambiar
el motor más adelante no rompe consumidores.

## Un chart sin nombre es decorativo, y se declara como tal

`ChartFrame` emite `role="img"` **solo si hay `title` o `summary`**. Un `role="img"` sin nombre
accesible es una violación de `role-img-alt` —lo detectó el gate axe con cuatro nodos—, y además es
una mentira: le dice al lector de pantalla «aquí hay una imagen» y no le dice cuál.

Sin ninguno de los dos, el canvas se queda **sin rol y sin `aria-hidden`**: un `div` corriente.

El primer intento fue marcarlo `aria-hidden` —«si no tiene nombre, es decoración»— y el gate lo rechazó
con `aria-hidden-focus`: Recharts deja nodos enfocables dentro de su SVG, y ocultar del árbol de
accesibilidad un contenedor que los tiene es peor que no ocultarlo. Sin rol no se dispara ninguna de
las dos reglas, y el empujón para que el consumidor ponga `title` sigue estando donde debe: en la
documentación, no en un atributo que rompe el foco.

Cuando hay los dos, `title` nombra y `summary` describe. Cuando solo hay `summary`, nombra el resumen:
más vale un nombre largo que ninguno.

## `SparkLine` y `TrendIndicator` no tocan Recharts

Es requisito de ADR-011 y está verificado por medición, no por intención: 12,08 y 9,83 kB frente a los
113,94 de un `BarChart`. Los dos se dibujan con SVG propio porque su sitio es dentro de una tarjeta o
de una fila de tabla, y arrastrar el motor entero para pintar una línea de 40 px no tiene defensa.

## Por qué `TrendIndicator` no tiñe el número

Tiñe **solo la flecha**, que va `aria-hidden`, y deja el número en `text.primary`. Es el patrón que
`Stat` ya usaba, y no es una preferencia estética: `semantic.success.600` sobre `surface.base` **no
llega a AA en sober-light**, y el gate axe lo marcó como `color-contrast` en cuanto el número se pintó
de verde.

`Stat` pasaba el mismo gate desde W3.3 porque su flecha es decorativa —axe excluye del cálculo de
contraste lo que está oculto para el lector— y su cifra nunca cambia de color. `TrendIndicator` se
alinea con eso, que además es lo coherente: los dos componentes se usan juntos, `TrendIndicator` suele
ir dentro del `diff` de un `Stat`, y dos tratamientos distintos de la misma idea en el mismo sitio se
leen como un error.

El sentido sigue llegando por tres vías que no dependen del color: la flecha, el signo del número y el
texto solo-lector (`al alza` / `a la baja` / `sin cambios`).

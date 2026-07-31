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

## W4.4 — charts completos

`RadarChart`, `ChartLegend`, `ChartTooltip` y `ChartPanel` cierran §1.12 del inventario.

### La deuda de Recharts, evaluada y no reabierta

`docs/w3-closure.md` §Deuda 2 dejó el número escrito «por si el coste justifica reabrir ADR-011 en W4,
cuando lleguen los charts completos». Medido ahora, con los charts completos dentro:

| Entrada          | Medido      | Con Recharts |
| ---------------- | ----------- | ------------ |
| `BarChart`       | 115,54 kB   | sí           |
| `SparkLine`      | 13,47 kB    | **no**       |
| `TrendIndicator` | 11,18 kB    | **no**       |

El coste creció 1,6 kB respecto a W3.4 (113,94 → 115,54) al entrar `RadarChart`, que reutiliza el
motor ya presente. **No se reabre ADR-011**, y la razón es que ninguna de las dos condiciones que
justificarían hacerlo se cumple:

1. **El coste no se ha desbordado.** Añadir el cuarto tipo de gráfico costó 1,6 kB, no otro motor: la
   curva es plana porque Recharts ya estaba pagado.
2. **El aislamiento funciona.** `dist/index.js` no menciona `recharts` (verificado en cada cierre de
   tramo), y las dos piezas que un dashboard usa en cantidad —`SparkLine` en cada fila de una tabla,
   `TrendIndicator` en cada tarjeta— **no lo tocan**: son SVG propio, 13,47 y 11,18 kB.

Sustituirlo significaría escribir el motor cartesiano, el polar, ejes, escalas, tooltips y
responsividad sobre d3 o Skia. Son meses, y el beneficio solo lo nota quien importa `/charts`, que es
precisamente quien ha decidido que quiere gráficos. La deuda 2 de W3 queda **cerrada como evaluada y
asumida**, no como pendiente.

### `ChartLegend` y `ChartTooltip` no los usa Recharts

Son componentes **nuestros**, para quien quiera legenda o tooltip fuera del lienzo: una leyenda
compartida entre varios paneles, un tooltip en una tabla de apoyo, un resumen sin gráfico. Los charts
siguen usando los de Recharts por dentro, porque sustituirlos exigiría reimplementar su posicionamiento
sobre el canvas.

`ChartLegend` con `onToggle` es un grupo de botones de dos estados (`aria-pressed`), no una lista de
adornos: si sirve para encender y apagar series, tiene que anunciarse como control.

### `ChartPanel` es una retícula, no un contenedor de gráficos

No sabe nada de charts: recibe `content` como `ReactNode`. Cada panel con título es una `<section>`
etiquetada, de modo que un lector de pantalla puede saltar entre paneles de un dashboard. `span` se
recorta al número de columnas para que un panel no desborde la retícula en móvil.

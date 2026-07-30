# DateDisplay

## El valor sigue el contrato ISO de ADR-050

`value` acepta string ISO, epoch en milisegundos o `Date`, pero el caso canónico —y el único que cruza
la frontera de los pickers— es el **string ISO**. Un `YYYY-MM-DD` se detecta y se parsea como local
(`T00:00:00`), no como UTC: `new Date("2026-07-30")` es medianoche UTC y en cualquier zona al oeste de
Greenwich se pinta como el día 29. Es el off-by-one que ADR-050 cita como motivo de no usar `Date`
crudo en la cadena de fechas.

Ese mismo dato decide el preset por defecto —`date` para una fecha sin hora, `datetime` para lo
demás— y el `dateTime` que se emite: sin hora cuando la entrada no la tenía, para no inventar una
precisión que el dato no tiene.

## Por qué el absoluto va en `title` y no en `aria-label`

`<time>` no tiene rol implícito, así que mapea a `generic`. `aria-label` sobre un elemento genérico es
un atributo **prohibido**: los lectores de pantalla lo ignoran y la regla `aria-prohibited-attr` de axe
lo marca, de modo que romperría el gate de a11y sin aportar nada.

El reparto queda: el texto visible dice lo mismo a todo el mundo —«hace 3 días»—, `dateTime` lleva el
valor máquina para el navegador y el consumidor, y `title` añade la fecha exacta para quien puede
apuntar con el ratón. Un usuario de lector de pantalla recibe exactamente la misma información que un
usuario vidente que no pase el cursor por encima; no hay pérdida relativa.

## `mode="auto"`

Relativo mientras la distancia a `now` sea menor que `relativeThreshold` (7 días por defecto),
absoluto después. Es el comportamiento habitual en listados de actividad: lo reciente se lee mejor en
relativo y lo viejo en fecha.

`now` es inyectable **para que la salida sea determinista en test y en story**. Sin la prop, cada
render vuelve a leer el reloj: es correcto en producción y no sirve para fijar un snapshot ni para el
gate de regresión visual.

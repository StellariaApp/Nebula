# Checkbox

## La caja deriva de `sizes.control`, no de una escala propia

`styles.size` es un `styleVariants` que fija `variables.size` en `calc(vars.size.control.<size> / 2)`.
No hay tabla de píxeles en el `.tsx`.

Es la misma regla que ya aplica ActionIcon (`ActionIcon.css.ts`) y que fija `docs/06-visual-language.md`
§4: en un control, el glifo ocupa aproximadamente la mitad del lado útil y **deriva de
`sizes.control`**. La caja de un checkbox es ese glifo: el indicador visual dentro de un objetivo
táctil que es la fila entera (`root` es el `<label>`).

Antes existía `SIZE_PX = { xs: 14, sm: 16, md: 18, lg: 20, xl: 24 }` en el `.tsx`, que rompía dos
reglas a la vez: ADR-033 punto 6 —ningún componente declara alturas en literales— y el principio de
`docs/02` de que la personalización ocurre vía tema. Un tema que comprimiera `control` no movía el
checkbox. El censo de ADR-033 solo miró los `.css.ts`, así que este literal se le escapó.

La derivación no se eligió, se dedujo: Switch ya declaraba `16/18/22/26/30`, que cae dentro de 1 px de
`control/2` (`15/18/21/25/30`) en los cinco peldaños, mientras Checkbox y Radio se desviaban hasta 6.
La regla ya estaba en el sistema y solo dos componentes se le habían escapado. El detalle está en
`docs/reviews/visual-calibration-2026-07-28.md`.

## Por qué el tamaño va por CSS y no por `assignInlineVars`

`variables.color` sí se inyecta en runtime porque depende de la prop `color`. El tamaño no: depende solo
de `size`, que es un conjunto cerrado, de modo que `styleVariants` lo resuelve en build y el componente
no necesita suscribirse al tema con `useTheme()`. Switch sí lo hace, pero porque necesita el valor
**numérico** para calcular el recorrido del gesto de arrastre; ver `Switch.md`.

## El objetivo táctil es la fila, no la caja

`root` es un `<label>` en `inline-flex`, así que el área activable incluye la caja, el hueco y el texto.
La caja por sí sola queda por debajo de los 24 px CSS de WCAG 2.2 (criterio 2.5.8) en todos los
peldaños, y eso es correcto siempre que la fila los alcance. Con `label` ausente la fila se reduce a la
caja: ahí el consumidor es responsable de dar área, igual que con cualquier control sin etiqueta.

# Switch

## La pista deriva de `sizes.control`, pero por JS y no por CSS

`track_h` es `theme.sizes.control[size] / 2` y `track_w` es `track_h * TRACK_RATIO`. Ambos se inyectan
con `assignInlineVars` en `variables.height` y `variables.width`.

Checkbox y Radio resuelven su tamaño con `styleVariants` en el `.css.ts`, sin tocar el tema en runtime.
Switch **no puede**: el recorrido del pulgar (`travel = track_w - track_h`) es un número que alimenta
`useMotionValue`, `Rubber()` y la resolución del gesto por posición y velocidad. Un `calc()` de CSS no
es legible desde JS, así que el valor tiene que venir del objeto `theme`, al que este componente ya
está suscrito por el spring de ADR-026.

Que las dos rutas coincidan no es casualidad ni requiere sincronización: las dos leen la misma entrada
del contrato, `sizes.control[size]`. Un tema que recalibre `control` mueve los tres componentes y el
recorrido del gesto a la vez.

Antes existía `SIZE = { xs: {w:28,h:16}, … md: {w:38,h:22} … }` en el `.tsx`. Con `control / 2` el
Switch se mueve como mucho 1 px por peldaño, porque **ya cumplía la regla sin declararla**: sus alturas
caían dentro de 1 px de `control / 2` en los cinco peldaños. Los que se desviaban eran Checkbox y Radio,
hasta 6 px. Ver `docs/reviews/visual-calibration-2026-07-28.md`.

## `TRACK_RATIO`

`1.75` es la proporción ancho/alto que la pista ya tenía —las cinco parejas anteriores median entre
1,73 y 1,78— extraída a constante. Es una **proporción**, no una altura, así que no incumple ADR-033
punto 6: el tamaño sigue saliendo del contrato y el ratio solo describe la forma de la pastilla.

## Deuda conocida, fuera del alcance de esta corrección

`thumb` calcula su lado como `calc(${variables.height} - 4px)` y se posiciona con `top: 2px` /
`insetInlineStart: 2px`. Ese `4px` es el doble del inset y sigue siendo un literal. No es una altura
—es el aire entre pulgar y pista—, de modo que ADR-033 no lo alcanza, pero merece salir a un token de
espaciado cuando se toque el componente. Anotado y no corregido aquí para no mezclarlo con la causa (c).

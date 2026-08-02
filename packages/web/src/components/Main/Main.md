# Main

El componente de **página**: landmark `main`, skip link, slots de cabecera y pie, backdrop y carril de
contenido. Es la pareja de `Section` en una landing, igual que `AppShell` lo es de un dashboard.

## `momentum` — la inercia de la rueda, sobre el documento

Apagado por defecto ([ADR-073](../../../../../docs/adr/ADR-073-momentum-de-pagina-en-main.md)). Es el
mismo muelle que `Scroll`, con los mismos defaults —`spring: "default"`, `multiplier: 1.5`— para que
la prop se sienta igual en los dos sitios, y se apaga con `prefers-reduced-motion` y con
`motion.tier: "minimal"`.

Lo que cambia es el scroller: **`Main` no se vuelve un contenedor con overflow**. La inercia se aplica
al scroll del documento a través de `useMomentumPage`, de modo que `window.scrollY` sigue siendo la
fuente de verdad.

Eso no es un detalle de implementación, es la decisión entera. Si `Main` desplazara por dentro,
`window.scrollY` dejaría de moverse y con él se caerían tres cosas a la vez: el `parallax` de
`StarField`, el scroll-spy y la píldora de `Nav`, y el `Reveal` por viewport, que necesitaría que le
pasaran `root`. Medido sobre la landing con una muesca de 300, con el momentum encendido: el scroll
decelera 27 → 221 → 447 y el campo de estrellas sigue valiendo `0.045 × scrollY` en cada muestra.

Un `Main` con `momentum` gobierna el scroll de **toda la página**. Por eso la prop no existe en
`Section` ni en `Hero`: no hay un momentum «de región».

### `smooth` — los enlaces con la física del tema

Encendido por defecto ([ADR-075](../../../../../docs/adr/ADR-075-el-chrome-fijo-entra-en-la-navegacion-por-ancla.md)).
Un clic en un ancla interna no salta: lo lleva **el mismo muelle que la rueda**, así que `spring`
gobierna las dos y la página tiene una sola física. `scroll-behavior: smooth` no habría servido: su
curva la decide el navegador y no se puede calibrar. Se mantiene igualmente como respaldo para lo que
el hook no intercepta —teclado, `scrollIntoView`, `scrollTo` programáticos—.

`Main` también publica `scroll-padding-top` con la altura de la barra fija que encuentre en su slot
`header`, medida con `ResizeObserver`. Sin eso, el ancla deja la sección debajo del chrome. El
consumidor no pasa ningún número: si tuviera que hacerlo, el dato lo tendría cada landing y no el
sistema.

### `bounce` — el rebote en el límite

Encendido con `momentum` ([ADR-074](../../../../../docs/adr/ADR-074-rebote-en-el-limite-del-scroll.md)).
El transform se aplica a **`main.content` y solo a él**, y esa precisión es la decisión entera: un
`transform` crea _containing block_ para los `position: fixed` que tenga dentro, así que
transformarlo más arriba habría roto el `StarField parallax`. Como el `backdrop` es hermano del
contenido y no su padre, el campo sigue anclado al viewport.

Medido durante un rebote de 99 px: `position: fixed` y `top: 0` constantes, `scrollY` en 0 —el
rebote no mueve el scroll, es desplazamiento visual— y al terminar, con `scrollY` 1319, el parallax
valía 59.355 px contra 59.35 esperados.

## `spacing` no se usa con bandas

`spacing` pone un `gap` entre los hijos directos y existe para el contenido que **no** son bandas —un
dashboard cuyo hijo es una `Card` o una tabla—. Cuando el contenido son `Section` o `Hero`, el ritmo
lo gobierna el padding de la banda y `spacing` se deja sin pasar; ver
[`styles/band.md`](../../styles/band.md), que trae la medición de por qué.

## Por qué `MainProps` ya no hereda de `ScrollProps`

Lo hacía, y el efecto era que `<Main momentum />`, `<Main shadows />` o `<Main axis="x" />`
**typechequeaban sin hacer nada**: `Main` destructura lo que usa y el resto va a `ExtractStyleProps`,
que lo deja en un `rest` que este componente descarta.

Heredar el tipo de un componente con overflow en otro que no lo tiene no ahorra código, sólo promete
props que no existen. Ahora extiende `StyleProps`, que es lo que de verdad reenvía, y declara las tres
que soporta.

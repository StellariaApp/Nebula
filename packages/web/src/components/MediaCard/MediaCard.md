# MediaCard

La tarjeta de medio, una sola para todas las rejillas de un producto (ADR-198). En Rosette la
pintan Explorar, Mis Avatares, Guardados y la Galería; durante un tiempo la Galería tuvo la suya y
era «la única rejilla que no se parecía a las demás».

## El marco

`3/4` con `GradientBackground` debajo, y encima las láminas de `frames` —la portada primero, la
galería detrás, sin repetidos— que pasan solas al pasar por encima: 300 ms la primera y 900 las
demás, y `prefers-reduced-motion` las para. Con `clip` hay además un adelanto mudo que arranca al
pasar y vuelve a la lámina al salir; con `playable`, la tarjeta **es** un reproductor: `VideoPlayer
defer fill` ocupa el marco hasta el pie, y mientras corre (`onPlaying`) insignias, botones y pie se
apartan con un fundido —no de golpe: siguen en el árbol y cambia la opacidad, con `pointer-events`
apagado para que un botón invisible no siga recibiendo clics—.

## Las esquinas no se pisan

`cornerStart`/`cornerEnd` son rótulos que sólo se leen; `action`/`actionStart` se pulsan. Con los
dos arriba a la izquierda, el rótulo tapaba el botón o al revés según cuál se pintara después:
cuando hay `actionStart`, el rótulo baja con el reloj a la fila de `stamps`, sobre el velo de abajo.
Dos velos —arriba corto y suave, abajo largo— sostienen esquinas y pie sobre cualquier lámina.

## `href` o `onOpen`, nunca los dos

Con `href` la tarjeta entera es un enlace (`component` pone el `Link` del router). Sin él, `onOpen`
abre algo aquí mismo —el `Viewer`— a través de una lámina del tamaño del marco: envolver la tarjeta
en un `button` metería el menú de la esquina dentro de un botón, que ni es HTML válido ni sabe a
cuál de los dos va el clic. El pie deja pasar el clic (`pointer-events: none`): dentro no hay más
que un retrato y dos renglones.

`ceiling` y `count` son dos ranuras de texto: la tarjeta no sabe qué es un roset ni una versión.

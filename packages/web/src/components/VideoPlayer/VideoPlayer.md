# VideoPlayer

El reproductor de vídeo **en línea** (ADR-195), hermano del de audio y por el mismo motivo:
`<video controls>` pinta la barra del navegador —gris en Chrome, azul en Firefox, otra en WebKit— y
en ninguna se puede tocar ni el color ni la forma. Esto son las cinco cosas que un clip necesita
—arrancar, arrastrar, el tiempo, el volumen y ampliar— con la pista de la casa
(`styles/player-controls.css.ts`, compartida con `AudioPlayer`).

`Player` (`/media`, react-player) es otra cosa: un marco o un modal para **un** medio, sin control
de reproducción. Éste va en una rejilla, un chat o un feed.

## Lo aprendido a golpes en Rosette, y por qué está así

- **`defer`**: parado no hay `<video>`, hay una `<img>` con la carátula; el clip se monta al
  primer play. Una rejilla de veinticuatro tarjetas montaba doce elementos `video`, y cada uno
  abría una petición de rango sólo para leer la cabecera. Sin carátula, se monta al asomarse
  (`IntersectionObserver`, 200 px de margen), no al entrar en la página.
- **La duración se mide cuatro veces** —al montar, `loadedmetadata`, `durationchange`,
  `canplay`—: con el fichero en caché el metadato llega antes que React y el evento no vuelve.
  `duration` la puede mandar quien llama para no abrir el fichero. `Infinity` (un directo) cae al
  final de lo que el navegador dice que puede buscar.
- **Los mandos flotan sobre el vídeo** y no debajo: debajo, cada celda de una rejilla medía
  distinto según el clip. Parado se ven siempre; andando, al pasar por encima o con foco.
- **Pantalla completa del marco**, no del `<video>`: sobre el elemento el navegador se lleva sus
  controles y esta barra desaparece. El estado sale de `fullscreenchange`, no del botón.
- **Un solo gesto para pausar**: el propio vídeo. El play grande del centro sólo mientras está
  parado; en la barra no hay play, que a 150 px dejaba la pista en un pulgar y un guion.
- **`onPlaying`** avisa a quien enmarca para que se aparte: la tarjeta de medio esconde insignias
  y pie mientras el clip corre.
- **`fill`** es de la rejilla: el marco mide lo que mide el clip salvo que la casilla ya esté
  medida, y entonces cubre.

El fondo del marco es `surface.sunken` y no negro: las bandas de un vertical en un marco ancho son
parte del reproductor y tienen que leerse como material, al contrario que el letterbox de `Player`.

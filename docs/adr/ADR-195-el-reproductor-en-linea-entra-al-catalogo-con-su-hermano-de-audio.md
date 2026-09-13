# ADR-195 — El reproductor en línea entra al catálogo, con su hermano de audio

- **Estado**: **aceptada** · 2026-09-12 — decidida por el propietario, con la alternativa recomendada · **implementada** el mismo día. Lote «Rosette → Nebula» (`docs/reviews/rosette-a-nebula-2026-09-12.md`).
- **Cambia API pública**: sí, y **solo añade**: `VideoPlayer` y `AudioPlayer` en
  `@stellaria/nebula-web/media`, más seis glifos internos (`Play`, `Pause`, `Volume`, `VolumeOff`,
  `Maximize`, `Minimize`).
- **Dependencias nuevas**: **ninguna**. Son `<video>`/`<audio>` + `<input type="range">`.
- **Toca**: `packages/web/src/components/VideoPlayer/`, `AudioPlayer/`, `src/media/index.ts`,
  `src/glyphs/`, `.size-limit.js`.
- Es el hallazgo #1 de C2, el §6.4 de `Rosette/docs/refactor-a-nebula.md` («decidido que entra») y
  `docs/07` §11.

## Contexto

`Player` (ADR-060) envuelve `react-player` para **un** medio en un marco o en un modal, y no expone
reproducción. Un feed, una rejilla de clips o un globo de chat necesitan otra cosa: un reproductor
**en línea** con mandos propios, porque `<video controls>` y `<audio controls>` pintan la barra del
navegador —gris en Chrome, azul en Firefox, otra en WebKit— sobre el cristal, y no se pueden vestir.
Iris (`demo-case.tsx:90`) lo hace hoy, y es un delta de C3.

Rosette lo resolvió con dos componentes que **comparten hoja** (`player.css.ts`): la misma pista
con lo reproducido en primario, el mismo pulgar, el mismo desplegable vertical de volumen. Que
compartan hoja es lo que hace que la voz y el vídeo se reconozcan como el mismo mando. El inventario
(`docs/00`) no tiene ni una fila de audio.

Lo que Rosette aprendió a golpes y sube con el componente:

- **`defer`**: no montar el `<video>` hasta el primer play. Una rejilla de 24 tarjetas montaba 12
  elementos `video` y cada uno abría una petición de rango solo para leer la cabecera. Con `defer`,
  parado hay una `<img>` con la carátula; sin carátula, se monta al asomarse (`IntersectionObserver`
  con 200 px de margen).
- **La duración se mide en los cuatro momentos** en que puede aparecer (montar, `loadedmetadata`,
  `durationchange`, `canplay`): con el fichero en caché el metadato llega antes que React y el
  evento no vuelve. `duration` la puede mandar quien llama para no abrir el fichero.
- **Los mandos flotan sobre el vídeo** y no debajo: debajo, cada celda medía distinto según el
  clip. Parado se ven; andando, solo al pasar por encima o con foco.
- **Pantalla completa del marco**, no del `<video>`: pedirla sobre el elemento se lleva sus
  controles nativos. El estado sale de `fullscreenchange`, no del botón.
- **`onPlaying`** avisa a quien enmarca para que se aparte (la tarjeta esconde insignias y pie).
- **`fill`** es de la rejilla: el marco mide lo que mide el vídeo salvo que la casilla ya esté
  medida.

## Decisión

```tsx
<VideoPlayer src poster label maxHeight fill defer duration autoPlay loop onPlaying labels />
<AudioPlayer src label labels />
```

- Van en `/media` con `Player`, sin arrastrar `react-player`: son módulos distintos y `size-limit`
  los mide por módulo. Budget: banda **media ≤70 kB**; medida esperada muy por debajo (Rosette:
  442 + 201 líneas sin dependencias).
- `labels` con `Partial<PlayerControlsLabels>` (`play`, `pause`, `seek`, `volume`, `mute`,
  `unmute`, `fullscreen`, `exitFullscreen`) y defaults en inglés como el resto del catálogo. Rosette
  los pasa desde `shared.player`.
- Los iconos son glifos internos (`src/glyphs/`), como todo componente de `web`: seis nuevos, con la
  misma forma que `ChevronRight`. `nebula-icons` ya tiene los seis nombres para el consumidor.
- La hoja compartida es un módulo `styles/player-controls.css.ts` que los dos componentes componen;
  `--filled` sigue siendo la var que rellena la pista hasta el pulgar en un `range` **de verdad**,
  que es lo que da teclado y lector de pantalla gratis.
- Ranuras: `surfaceProps` (el `<video>`/`<audio>`), `barProps`, `trackProps`, `volumeProps`.
- El fondo del marco es `surface.sunken` y **no** negro literal: aquí las bandas de un vertical en
  un marco ancho son parte del reproductor y tienen que leerse como cristal, al contrario que el
  letterbox de `Player` (ver `Player.md`).

## Alternativas

- **Extender `Player` con `inline`**: `Player` no controla reproducción por decisión (`Player.md`),
  y meterle mandos propios lo convierte en otro componente con una dependencia de 38 kB debajo.
- **Reproductor de audio con forma de onda**: es una librería más y ninguna pantalla lo pidió; la
  nota de voz de un chat dura segundos.
- **Un solo `MediaPlayer kind="video" | "audio"`**: la forma es distinta (uno flota mandos sobre un
  marco, el otro es una fila) y solo comparten la pista.

## Consecuencias

- `video-player.tsx`, `voice-player.tsx` y `player.css.ts` de Rosette se sustituyen por dos imports.
  Iris retira su `<video controls>`.
- `MediaCard` (ADR-198) depende de esto: sube después.
- Story `Media/VideoPlayer` (parado, andando, `defer` con y sin carátula, `fill` en rejilla) y
  `Media/AudioPlayer`, en los dos esquemas; test de teclado sobre las dos pistas.
- `docs/00` gana dos filas en Media; `docs/03` anota la medida.

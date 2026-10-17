# ADR-206 — El vídeo en directo lleva mandos por esquina que aparecen y se van

- **Estado**: **aceptada** · 2026-10-17 — aprobada por el propietario (la sala tipo Meet de Vela
  y la 1.1.20) · **implementada** el mismo día. Sigue a ADR-205.
- **Cambia API pública**: sí, y **solo añade** a `LiveVideo`: `overlay`, `overlayMode`,
  `idleDelay`, `pinned` y `overlayProps`, y los tipos `LiveVideoCorner` y `LiveVideoOverlayMode`.
- **Dependencias nuevas**: **ninguna**.
- **Toca**: `packages/web/src/components/LiveVideo/`, la story `Media › VideoEnDirecto`,
  `docs/00` y `docs/07` §11.

## Contexto

Vela pasa a una sala tipo Google Meet: rejilla de equipos y, al fijar uno, el vídeo grande con
mandos encima —ampliar y el menú del equipo arriba a la derecha, el audio abajo a la izquierda y
«Tomar control» abajo a la derecha— que **aparecen al mover el puntero y desaparecen** cuando se
queda quieto. `LiveVideo` 1.1.19 solo pinta su botón de ampliar (visible con `:hover`) y la
insignia de directo; cualquier otro mando tendría que posicionarse a mano encima del marco, con su
propio temporizador, y competiría con el botón de ampliar por la esquina.

Además el vídeo es una superficie de **control remoto**: el panel escucha `pointer*`, `wheel` y
`contextmenu` sobre el `<video>`. Una capa encima que tragara el puntero rompería el control.

## Decisión

```tsx
<LiveVideo
  stream={stream}
  withFullscreen
  overlay={{
    topEnd: <Menu trigger={<ActionIcon aria-label="Más" />} items={…} />,
    bottomStart: <AudioControls />,
    bottomEnd: <Button>Tomar control</Button>,
  }}
  overlayMode="auto"
  idleDelay={2500}
  pinned={controlling ? ["bottomEnd"] : undefined}
/>
```

- **Cuatro esquinas** (`topStart`, `topEnd`, `bottomStart`, `bottomEnd`). Cada una es un hueco fijo
  en el marco con sus hijos en fila. **Ampliar va el primero de `topEnd`**: lo que se pase allí
  queda a su derecha. **La insignia de directo va la primera de `topStart`** y no se oculta nunca.
- **`overlayMode`**: `"auto"` (por defecto) despierta el marco al mover el puntero y lo duerme tras
  `idleDelay` ms quieto o al salir; también lo mantienen despierto el **foco dentro** (teclado) y
  **un menú abierto** (`:has([aria-expanded="true"])`), para que el ⋮ no desaparezca bajo su propio
  menú. En pantallas sin hover se ve siempre. `"always"` no duerme; `"never"` no despierta.
- **`pinned`**: esquinas que se ven en cualquier modo. Es lo que necesita el control remoto: con
  `overlayMode="never"` mientras se controla, solo «Soltar control» queda encima del escritorio.
- **La capa no captura el puntero** (`pointer-events: none`); solo los mandos lo reciben. Debajo, el
  `<video>` sigue recibiendo `pointer*` y `wheel`.
- **Dos velos** (arriba y abajo, `color-mix` de `surface.base` hacia transparente, como la barra de
  `VideoPlayer`) acompañan a los mandos para que se lean sobre cualquier imagen; solo se pintan si
  hay mandos en esa mitad.
- El estado se expone como `data-awake` y `data-mode` en el marco; `data-pinned` en cada esquina.

## Alternativas

- **Que el consumidor ponga los mandos con `position: absolute`.** Es lo que Vela haría hoy: un
  temporizador por producto, la esquina disputada con ampliar y el riesgo de tragarse el puntero.
  Es justo lo que el catálogo existe para no repetir.
- **Un `children` libre encima del vídeo.** Deja el temporizador y la regla del puntero al
  consumidor; las esquinas fijas son lo que todo reproductor en directo usa.
- **Reusar la barra inferior de `VideoPlayer`.** Es una barra de tiempo con volumen; aquí no hay
  tiempo y los mandos son de producto.

## Consecuencias

- `withFullscreen` deja de tener su propia regla de visibilidad: ahora sigue la de la capa
  (`"auto"` por defecto), que además lo oculta tras la inactividad estando el puntero dentro.
- Los mandos son del consumidor: su accesibilidad (nombres, foco) es suya. La capa solo los
  posiciona y los muestra.
- Con `prefers-reduced-motion` aparecen y desaparecen sin transición.

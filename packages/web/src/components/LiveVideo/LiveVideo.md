# LiveVideo

El vídeo **en directo** (ADR-205): un `MediaStream` —WebRTC, una cámara, una captura de pantalla—
en un marco del catálogo. Hermano de `VideoPlayer` y no un modo suyo: aquél reproduce un fichero
con pista, tiempo, volumen y play; aquí no hay nada que buscar ni que pausar, y lo único que se
conserva de sus mandos es ampliar.

```tsx
<AspectRatio ratio={16 / 9}>
  <LiveVideo
    label="Pantalla de equipo-04"
    placeholder={<Skeleton h="100%" w="100%" />}
    stream={stream}
    surfaceRef={video_ref}
    withFullscreen
  />
</AspectRatio>
```

## Por qué está así

- **`srcObject` se asigna sólo cuando cambia.** Es una propiedad del DOM y no un atributo, así que
  React no la escribe: lo hace un efecto, comparando antes. Reasignar el mismo flujo en cada render
  vacía el búfer y la imagen parpadea. `null` o `undefined` lo sueltan.
- **El `<video>` está montado siempre**, haya flujo o no. Quien escucha eventos sobre él —el panel
  de control remoto de Vela engancha `pointer*`, `wheel` y `contextmenu`— se suscribe una vez en el
  primer efecto; si el elemento naciera con el flujo, su efecto ya habría corrido contra `null` y no
  volvería a correr.
- **`autoPlay muted playsInline`, nunca `controls`.** Sin `muted` el navegador no arranca solo, y
  en un directo no hay un play que pulsar. La barra nativa está prohibida en todo el catálogo
  (`docs/07` §11). `surfaceProps` puede quitar el `muted` si el flujo trae audio y hubo un gesto.
- **Se funde al primer fotograma** (`loadeddata`, o `readyState` ya en `HAVE_CURRENT_DATA`): hasta
  entonces el decodificador pinta negro y eso se lee como «roto». Mientras, se ve el marco hundido o
  el `placeholder`. `emptied` lo vuelve a esconder. `onReady` avisa de los dos cambios.
- **Los eventos propios se escuchan con `addEventListener`**, no con `onLoadedData`: la ranura se
  esparce después de lo calculado —gana el consumidor, ADR-098— y un `onLoadedData` suyo apagaría
  el fundido.
- **`placeholder` por defecto es nada**, no un `Skeleton`: un equipo apagado dejaría un brillo de
  «cargando» para siempre. Quien sabe que está conectando lo pide.
- **`fit="contain"` por defecto.** En un escritorio remoto recortar es perder la barra de tareas; las
  bandas son `surface.sunken`, como en `VideoPlayer`. `"cover"` para una cámara en una casilla.
- **El marco llena a su padre** (`width` y `height` al 100 %). En una `AspectRatio` mide la casilla;
  en una vista de foco el padre tiene que tener altura, o el marco cae a la del vídeo.
- **Pantalla completa del marco**, como en `VideoPlayer`: la insignia y el botón siguen encima. El
  estado sale de `fullscreenchange`. En pantalla completa el marco pierde el radio.
- **La insignia de directo** sólo aparece con imagen: «Live» sobre un marco vacío mentiría.

## Llegar al `<video>`

`surfaceRef` (objeto o callback) es el elemento: `getBoundingClientRect`, `videoWidth`,
`videoHeight`, `addEventListener`. El `ref` del componente no existe a propósito: en el catálogo el
`ref` es la raíz, y aquí la raíz es el marco.

Para normalizar el puntero sobre el contenido real con `fit="contain"`, descuenta las bandas:
`scale = min(rect.width / videoWidth, rect.height / videoHeight)`, y el contenido mide
`videoWidth * scale` por `videoHeight * scale`, centrado.

El cursor de control remoto va por la ranura: `surfaceProps={{ style: { cursor: "crosshair" } }}`.

## Style props

Van al marco, que es la raíz. El `<video>` se viste por `surfaceProps`.

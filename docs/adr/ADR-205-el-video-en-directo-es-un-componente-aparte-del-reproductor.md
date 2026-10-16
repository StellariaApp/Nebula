# ADR-205 — El vídeo en directo es un componente aparte del reproductor

- **Estado**: **aceptada** · 2026-10-16 — aprobada por el propietario (entra vídeo en directo al
  catálogo y sale en la 1.1.19) · **implementada** el mismo día. Hallazgo del panel de Vela
  (`Vela/dashboard/app/video-surface.tsx`, un `Box component="video"` hecho a mano).
- **Cambia API pública**: sí, y **solo añade**: `LiveVideo`, `LIVE_VIDEO_LABELS` y los tipos
  `LiveVideoProps`, `LiveVideoFit` y `LiveVideoLabels`, en `@stellaria/nebula-web` y en
  `@stellaria/nebula-web/media`.
- **Dependencias nuevas**: **ninguna**. Es un `<video>` con `srcObject`.
- **Toca**: `packages/web/src/components/LiveVideo/`, `src/index.ts`, `src/media/index.ts`,
  `.size-limit.js`, la story `Media/Carrusel y galería › VideoEnDirecto`, `docs/00` y `docs/07` §11.

## Contexto

`VideoPlayer` (ADR-195) reproduce **un fichero**: recibe `src: string`, mide la duración, pinta la
pista, el tiempo, el volumen y el play grande, y su `<video>` es interno. Un flujo WebRTC no encaja
en ninguna de esas piezas: llega como `MediaStream` y se asigna a `srcObject` —una propiedad del
DOM, no un atributo que React sepa escribir—, no tiene duración ni se puede buscar, y la pausa no
significa nada porque lo que se pierde no vuelve.

Vela lo resolvió con un `Box component="video"` suelto, y de paso enseñó lo que el catálogo tiene
que dejar hacer: el panel de control remoto **necesita el `<video>` en la mano** — normaliza el
puntero a [0,1] sobre el contenido real (`getBoundingClientRect` + `videoWidth`/`videoHeight`,
descontando las bandas de `object-fit: contain`), escucha `pointer*`, `wheel` y `contextmenu`
directamente sobre el elemento y le pone `cursor: crosshair` mientras controla.

## Decisión

```tsx
<LiveVideo
  stream={stream}
  fit="contain"
  label="Pantalla de equipo-04"
  placeholder={<Skeleton h="100%" w="100%" />}
  withFullscreen
  withLiveBadge
  surfaceRef={video_ref}
  surfaceProps={{ style: { cursor: "crosshair" } }}
/>
```

- **Componente aparte**, `LiveVideo`, no un modo de `VideoPlayer`: el contrato es otro (un objeto
  vivo en vez de una URL) y de los mandos del reproductor no sirve ninguno salvo ampliar.
- `stream: MediaStream | null | undefined`. Se asigna a `srcObject` **sólo cuando cambia** —
  reasignar el mismo flujo vacía el búfer y parpadea— y se pide `play()`. `null` lo suelta.
- El `<video>` es siempre `autoPlay muted playsInline` y nunca `controls`. **Está montado siempre**,
  con flujo o sin él: así la ref existe desde el primer render y quien escucha eventos sobre ella no
  tiene que esperar a que llegue el flujo para suscribirse.
- **`fit`**: `"contain"` por defecto (las bandas son `surface.sunken`, como en `VideoPlayer`) o
  `"cover"`. El marco llena lo que le den (`width` y `height` al 100 %): en una `AspectRatio` mide la
  casilla, en una vista de foco toma la altura del padre.
- **`placeholder`**: lo que se pinta mientras no hay imagen —sin flujo, o con flujo y aún sin el
  primer fotograma (`loadeddata`)—. Por defecto nada: el marco hundido ya dice «aquí va un vídeo».
  El vídeo se funde al llegar el primer fotograma, para no enseñar el negro del decodificador.
- **`onReady(ready)`** avisa cuando hay imagen y cuando deja de haberla.
- **`withFullscreen`** (apagado por defecto): el mismo botón de cristal en la esquina que
  `VideoPlayer`, sobre el **marco** y con el estado leído de `fullscreenchange`.
- **`withLiveBadge`** (apagado por defecto): una `Badge` `filled` en `error` arriba a la izquierda,
  sólo mientras hay imagen. Rótulo en `labels.live`.
- **El `<video>` se alcanza por `surfaceRef`** (`Ref<HTMLVideoElement>`, ref de objeto o callback),
  con el mismo nombre de nodo que `surfaceProps`. `surfaceProps` es su ranura
  (`ComponentPropsWithoutRef<"video">` sin `src`, `controls` ni `children`) y se esparce después de
  lo calculado, como en todo el catálogo. Los eventos que el componente necesita (`loadeddata`,
  `emptied`) se escuchan con `addEventListener`, así que un `onLoadedData` en la ranura no los pisa.
- `labels: Partial<LiveVideoLabels>` (`fullscreen`, `exitFullscreen`, `live`) con defaults en
  inglés, como el resto del catálogo.
- Style props (ADR-032) al marco. `"use client"`.

## Alternativas

- **`VideoPlayer` con `stream`**: el tipo de `src` pasaría a ser una unión, y la mitad del
  componente —la pista, el tiempo, la duración medida cuatro veces, `defer`, la carátula, el play
  grande— tendría que apagarse con condiciones. Dos contratos en un componente es lo que ADR-195
  descartó para `MediaPlayer kind`.
- **El `ref` de React 19 sobre el `<video>`**: en el catálogo el `ref` de un componente es su raíz,
  y aquí la raíz es el marco (es lo que va a pantalla completa y lo que llevan las style props).
  Mandarlo al `<video>` haría de éste el único componente donde `ref` no es la raíz.
- **Exponer sólo un callback con las coordenadas normalizadas**: es la necesidad de Vela, no la del
  catálogo; otro consumidor querrá dibujar encima o capturar fotogramas, y todos necesitan el
  elemento.
- **Un `Skeleton` por defecto en vez de nada**: un equipo apagado dejaría un brillo de «cargando»
  para siempre. Quien sabe que está conectando lo pide con `placeholder`.

## Consecuencias

- `video-surface.tsx` de Vela se queda en la lógica del control remoto sobre `surfaceRef`; el
  `<video>`, el `srcObject` y el esqueleto pasan a `LiveVideo`.
- Entrada propia en `.size-limit.js` (banda **media ≤70 kB**, sin dependencias).
- Test: asigna el flujo sólo cuando cambia y lo suelta con `null`, `placeholder` hasta
  `loadeddata`, `onReady`, la ref alcanza el `<video>`, `fit`, pantalla completa y la insignia.
- Story `VideoEnDirecto` con un flujo de `canvas.captureStream()`, fuera del gate visual (no es
  `Composition` ni `AllThemes`: un flujo vivo no se puede congelar).
- `docs/00` gana una fila en Media y `docs/07` §11 una receta.

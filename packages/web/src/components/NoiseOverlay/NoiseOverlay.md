# NoiseOverlay

## El grano es un token, no un adorno

`effects.glass.noiseOpacity` existe en el contrato desde F0 y hasta W4 no lo leía nadie. Este
componente es su consumidor: sin prop `opacity` toma el valor del tema —0.02 en `light` y `dark`, y 0
en un tema que apague los materiales—, de modo que la degradación por tema es el comportamiento por
defecto y no una rama especial.

`effects.glass.enabled === false` fuerza 0 **aunque el consumidor pase `opacity`**. Es deliberado: si
el tema declara que no hay materiales, un override local no debería poder reintroducirlos, igual que
`GlassSurface` no deja forzar el `backdrop-filter`. `data-noise="off"` deja la rama observable.

## Por qué lee el tema en vez de vivir solo en CSS

`vars.glass.noiseOpacity` es una var del contract, así que un `NoiseOverlay` puramente CSS habría sido
server-safe y sin `"use client"`. Se descarta por la regla del párrafo anterior: `glass.enabled` es data
no-CSS (`docs/02` §4) y sin leerla no hay forma de anular un `opacity` explícito.

## El SVG va inline, no como asset

La textura es un `feTurbulence` en un data URI dentro de `styles/noise.css.ts`, compartido con
`GlassSurface` (`noise`) y `MeshGradientBg` (`grain`). Vanilla Extract lo emite una sola vez y no hay
petición de red ni asset que publicar con el paquete. `baseFrequency: 0.85` con 4 octavas y un tile de
180 px da grano fino sin patrón visible al repetir (`stitchTiles: stitch` evita la costura).

## `mix-blend-mode` y el contexto de apilamiento

El grano mezcla en `overlay`, que necesita un contexto de apilamiento aislado para no sangrar sobre lo
que haya detrás del contenedor. El componente **no** lo crea: es responsabilidad del contenedor
declarar `isolation: isolate` (lo hacen `GlassSurface` y `MeshGradientBg`). Montado suelto sobre un
`Paper` sin aislar, el grano mezclará con el fondo de la página.

En `forced-colors: active` la capa se oculta por completo (`display: none`): una textura de ruido en
alto contraste es interferencia, no material.

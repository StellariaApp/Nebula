# Player

Subpath `@stellaria/nebula-web/media`, único consumidor de `react-player`
([ADR-060](../../../../../docs/adr/ADR-060-deps-de-dnd-carousel-y-media.md)).

## Por qué tiene subpath propio y no va en `/carousel`

`Player` es la única pieza del catálogo que necesita `react-player`. Meterlo en `/carousel` habría
hecho que importar `Carousel` arrastrase el reproductor sin tocar vídeo: exactamente el sesgo que
ADR-014 regla 3 existe para evitar. Con `/media` aparte, quien usa carruseles paga embla y nada más.

## `opened` es opcional, y eso decide la forma del componente

El `Player` de tfv era siempre un modal (`{ video, open, onClose }`). Aquí `opened` es opcional y esa
diferencia cambia lo que se renderiza:

- **sin `opened`** → el marco de vídeo suelto, para incrustarlo en una card, un hero o una pestaña;
- **con `opened`** → el mismo marco dentro de un `Modal`.

Es el mismo componente y el mismo contrato de props. La alternativa —dos componentes, o un
`PlayerModal` que envuelve a `Player`— duplicaba API para una decisión de presentación.

## No se controla la reproducción desde fuera

`playing` se pasa a react-player pero el componente **no** mantiene estado de reproducción propio ni
expone `onPlay`/`onPause`/`onProgress`. Es un wrapper fino a propósito: react-player ya tiene una API
de control completa y reimplementarla aquí sería mantener una capa que se desincroniza con la suya en
cada versión. Lo que sí se envuelve es lo que Nebula aporta —marco con `aspect-ratio` del tema, radius,
modal y etiquetas— y lo que el consumidor necesite más allá de eso lo pide instalando react-player,
que ya tiene como dependencia transitiva.

## El fondo del marco es negro literal

Es el único hex crudo del componente, y es deliberado: el letterbox de un vídeo no es una superficie
del tema. `surface.sunken` en un tema claro deja bandas grises alrededor de un vídeo, que se lee como
un fallo de carga. Un reproductor se ve sobre negro en todos los temas.

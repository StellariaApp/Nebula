# Lightbox

Referencia de API: el `Preview` de tfv (`docs/api/tfv-components.md` §2), con `{ image?, images?,
imagesUploads?, open, onClose, initialIndex? }`.

## Qué se conserva de tfv y qué no

Se conserva la idea: un visor modal con zoom, pan y pase de diapositivas, abierto sobre una colección
con índice inicial. Cambian tres cosas:

- **Un solo `images`**, no tres props (`image`/`images`/`imagesUploads`). `imagesUploads` arrastraba el
  tipo de dominio `Upload` de tfv, con su `quality.thumbnail`; aquí eso se generaliza a
  `LightboxImage { src, alt, thumbnail, caption }`, que cualquier dominio puede construir. Una sola
  imagen es un array de uno.
- **`opened`/`onClose`** en vez de `open`, por coherencia con `Modal` y el resto del catálogo.
- **`alt` es parte del contrato.** En tfv las imágenes eran strings y no había texto alternativo; una
  galería sin `alt` es una galería inaccesible.

## No hay dependencia para el zoom

`useZoomPan` son ~90 líneas de aritmética sobre `{ scale, x, y }`. Traer una librería de zoom/pan para
esto habría metido una dependencia en el **entry principal** —`Lightbox` es Tier 2 y no va en
subpath— por algo que se resuelve con dos `clamp` y un `transform`.

El desplazamiento útil se limita en proporción al zoom (`ClampOffset`): a escala 1 no hay nada que
arrastrar, y a escala 4 el margen es el que la imagen realmente se sale. Sin ese límite, el pan
permite empujar la imagen fuera de la vista y dejar el escenario en negro.

Todo el zoom es `transform` sobre la `<img>`, nunca `width`/`height`: es la regla de `docs/03` §2 y
además evita reflow por frame durante el arrastre. Durante el pan se anula la transición
(`data-panning`), porque interpolar una transformada que ya viene del puntero produce un arrastre con
retardo.

## El escenario es enfocable a propósito

`tabIndex={0}` con `role="group"`. Es la única forma de que el zoom y el pan tengan operación por
teclado (`+`/`-`/`0` y flechas), que es requisito de `docs/03` §1. Las flechas cambian de imagen
cuando **no** hay zoom y desplazan la imagen cuando lo hay: es el mismo gesto que en cualquier visor y
evita gastar dos teclas distintas para lo que el usuario percibe como «moverse».

El nivel de zoom se anuncia en una live region (`VisuallyHidden aria-live="polite"`), porque un cambio
de escala es invisible para un lector de pantalla.

## El pase de diapositivas sí lleva pausa

Al revés que `Carousel`, aquí el movimiento automático es el propósito de la función y por eso existe:
`withSlideshow` monta un botón de play/pausa, que es lo que WCAG 2.2 (2.2.2) exige para cualquier
animación de más de cinco segundos. Se apaga solo al cerrar el visor.

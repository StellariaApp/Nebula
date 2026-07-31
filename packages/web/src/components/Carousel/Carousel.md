# Carousel

Subpath `@stellaria/nebula-web/carousel`, sobre Embla ([ADR-060](../../../../../docs/adr/ADR-060-deps-de-dnd-carousel-y-media.md)).

## El contrato de items es el de GridList

`items` + `getKey` + `renderItem`, exactamente como `GridList` (que ya tenía un modo `"carousel"`
declarativo desde W3.3). Es la misma decisión que en `DataGrid` y `SortableList`: el catálogo tiene un
solo contrato genérico de colección y quien lo aprende una vez lo reutiliza. Aquí `renderItem` recibe
`(item, index)` y no el `mode` de GridList, porque un carrusel no tiene modos.

## Reduced motion apaga el desplazamiento, no la navegación

Embla anima el scroll con su propio motor, así que `prefers-reduced-motion` no lo toca solo. Se
resuelve en dos sitios a la vez:

- `duration: 0` en las opciones, que quita la animación de los arrastres y de los controles;
- `scrollTo(index, jump)` con `jump = reduced`, que salta en vez de recorrer cuando el índice cambia
  desde fuera.

Las dos hacen falta: la primera no cubre el `scrollTo` programático y la segunda no cubre el gesto.

## Semántica del carrusel

Sigue el patrón de carrusel de APG en su forma mínima y honesta:

- la raíz es un `<section>` con `aria-roledescription="carousel"` y etiqueta;
- cada slide es un `role="group"` con `aria-roledescription="slide"` y `aria-label` con su posición
  («2 de 5»), que es lo que un lector anuncia al entrar;
- los controles son botones con nombre y se deshabilitan en los extremos cuando `loop` es `false`.

**No hay autoplay**, y por eso no hay botón de pausa. WCAG 2.2 (2.2.2) exige poder detener cualquier
movimiento automático de más de cinco segundos, y la forma de no incumplirlo es no ofrecerlo: el
slideshow automático vive en `Lightbox`, donde el contenido es el objeto de la vista y el control de
pausa tiene sentido.

## `slideSize` es una var, no una variante

El ancho de slide es un número o una longitud CSS (`"100%"`, `"33.333%"`, `280`), no una escala. Una
escala de tallas no sirve aquí: el número de slides visibles depende del contenedor y del contenido, y
cada consumidor lo calcula distinto. Va por `assignInlineVars` para que el recipe siga siendo estático.

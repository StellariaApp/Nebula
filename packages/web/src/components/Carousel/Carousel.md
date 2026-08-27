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

## El índice controlado mueve, no reinicia

`startIndex` se lee **una sola vez**, al montar. Antes recibía `index ?? defaultIndex`, o sea la
posición viva del modo controlado, y ahí estaba el fallo: el envoltorio de React de Embla compara sus
opciones **por valor** y llama a `reInit` en cuanto una cambia, así que cada cambio de `index`
replantaba el carrusel en ese slide **de un salto** — y se comía el `scrollTo` que hay justo debajo,
que es el que lo recorre. Medido en un consumidor: `330 → −930` en un fotograma con `index` puesto, y
la deceleración entera (`−22 → −35 → −43 → −49 → −54 → −60…` en muestras de 25 ms) sin él.

El modo controlado se mueve por el efecto y sólo por él. `defaultIndex` sigue siendo de dónde arranca.

## `duration` y `containScroll` se dejan pasar

Los dos gobiernan cosas que no se pueden imitar desde fuera, y por eso son props y no valores fijos:

- **`duration`** son las unidades de Embla, no milisegundos; 25 es lo de siempre. `prefers-reduced-motion`
  sigue mandando por encima y lo lleva a cero.
- **`containScroll`** decide si el carrusel puede desplazarse más allá de su contenido. Con el defecto
  —`"trimSnaps"`— **la primera y la última nunca llegan al centro** aunque `align` sea `center`: no hay
  contenido detrás que las empuje. Con `false` sí, que es lo que quiere un selector donde la lámina
  elegida se queda en medio.

# Viewer

El visor **sin panel** (ADR-196): fondo oscuro con desenfoque y la pieza encima, hasta el borde.
`Lightbox` monta un `Modal` con su panel, zoom por teclado y pase de diapositivas; para mirar una
foto de cerca en un producto de imágenes, «una foto dentro de una tarjeta es la foto más pequeña y
el marco más grande». Rosette llegó a tener tres visores y los redujo a éste.

## Cuándo éste y cuándo `Lightbox`

`Lightbox` para una galería de documentación: panel, pase con pausa, `+`/`-`/`0`. `Viewer` para
las piezas de un producto: arrastre continuo, pellizco, rueda y doble toque, tira de miniaturas, y
nada entre la pieza y el borde de la pantalla.

## El arrastre es continuo, y por eso la tira no es `Carousel`

Embla avisa del cambio cuando el gesto ha terminado: la miniatura y el contador daban un salto al
soltar en vez de seguir al dedo. Aquí la posición es un `offset` con decimales mientras el dedo está
puesto y el índice sale de redondearla, así que cambia en el momento en que la siguiente pieza pasa
de la mitad; al soltar se acomoda a la entera más cercana, con transición sólo entonces (animar
durante el arrastre hace que la imagen vaya por detrás del dedo).

Las miniaturas son una fila con `scroll-snap` y no un `Carousel`: meter Embla en el core viola
ADR-014 regla 3, y aquí no hay nada continuo que seguir, sólo la elegida yendo al centro.

## Gestos y cierre

- `touch-action: none` en el escenario: sin él el navegador se queda el pellizco y el arrastre.
- Las flechas se pintan sólo con puntero fino (`(hover: hover) and (pointer: fine)`): en táctil
  taparían la pieza donde cae el pulgar. **No pasan por el escenario**: `setPointerCapture` sobre
  él hacía que el `click` se disparase en el escenario y pulsar «siguiente» cerraba el visor.
- El fondo cierra sólo si el clic empezó en el hueco —ni en la pieza ni en un mando— y el dedo no
  recorrió nada. Acercada, tampoco: ahí un clic suelto es lo que sobra de mover la imagen.
- Con una sola pieza no se pintan ni la tira, ni el contador, ni las flechas.
- Sólo imágenes, por decisión: un vídeo dentro tendría que adivinar si el dedo va a la barra de
  tiempo o a pasar de pieza. El clip se reproduce donde está con `VideoPlayer`.

## La descarga es un `<a download>` de verdad

Ningún componente de acción lo da, y `download` sobre un enlace es lo que hace que el navegador
guarde el fichero. Mide `vars.size.control.md`, lo mismo que el `ActionIcon` de cerrar a su lado.

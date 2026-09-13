# Cutout

Un fondo que cubre la caja y una figura recortada superpuesta (ADR-197). Es el recurso visual de
toda la landing de Rosette —hero, cierre, «yours»— y de sus láminas, y no existía en Nebula en
ninguna forma.

## `background` es una ranura, no una `src`

El fondo lo pone quien llama: un `next/image` con `fill` y `priority` —que es lo que deja el LCP de
una landing en verde—, el `Image` del catálogo o un `<img>` a pelo. `Cutout` le da la caja
(`position: relative; overflow: hidden`, las esquinas de `r`) y, si es un `<img>` suelto, lo hace
cubrir. Así no hay dependencia de Next ni de un CDN.

## La figura se coloca con vars

`figureSize` es la fracción del ancho de la caja; `figurePosition` mapea a `top/bottom/left/right`
y a un `transform` compuesto de `translate` y tres `rotate`. Todo viaja como vars de CSS con
`assignInlineVars`, con sus valores por defecto en la hoja (`bottom: 0; right: 0`), en vez de un
`style` calculado a mano en cada sitio. La figura no recibe puntero: lo que se pulsa es lo que va
en `children`.

Es un componente de servidor: no tiene estado.

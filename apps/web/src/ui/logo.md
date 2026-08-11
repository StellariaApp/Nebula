# `logo` — por qué el logotipo se tiñe con vars y no con el degradado del tema

El logotipo se repinta al cambiar de producto, como el resto de la página. Lo hace **solo con CSS
vars**, sin `useTheme()` y sin `"use client"`, y eso condiciona de dónde salen sus colores.

## Por qué no lee `effects.gradients.brand`

Sería lo obvio —es el degradado que el tema declara como su marca— pero `docs/02` §4 deja los
gradientes fuera de la proyección CSS: son data no-CSS que se lee del objeto `theme` por contexto.
Leerlos obligaría a `useTheme()`, y el logo se monta en `site-footer` y `surfaces`, que son
componentes de servidor. Volverlos cliente por el logotipo es caro y trae parpadeo en la primera
pintura.

Así que el eje sale de `primary.500 → accent.500`, que **sí** son vars. En los temas oficiales es
exactamente el mismo par que `gradients.brand` (indigo 500 → violet 500), y en un producto sigue su
identidad de color aunque no sean los mismos peldaños que su degradado declarado.

## La tinta de las estrellas

`ink.primary`, no `#fff`. Con eso las estrellas obedecen `ink.floor` como cualquier otro relleno del
catálogo (ADR-132): un tema que baje el suelo las mantiene claras sobre un primario claro, y uno que
lo suba las voltea. Antes eran blancas fijas y se perdían sobre un producto de primario claro.

## Lo que sigue con la marca cableada, a propósito

`public/logo.svg` conserva `#3F37C9`/`#9D4EDD`. Lo consume `og-card.tsx` a través de Satori, que no
resuelve CSS vars ni tiene tema, y una tarjeta social debe salir siempre con la identidad de Nebula
(ADR-020) sea cual sea el producto que el visitante tuviera puesto. No es deuda: es el único sitio
donde la marca no debe seguir al tema.

# Avatar

## El color sale del `variantMap`

`AvatarVariant` es `Extract<Variant, "filled" | "outline" | "light">` y lo resuelve `ResolveVariant`
(ADR-038). El default es `light`, que es lo que Avatar pintaba antes.

Antes calculaba su paleta a mano: `color-mix(scale.500 18%, transparent)` de fondo y `scale.700` de
texto. Es la receta `light` con **otro alpha** —el contrato dice 12 %—, una tercera variación del mismo
nombre junto a las que tenían Alert (12 %) y Badge (14 %). Ninguna de las cuatro coincidía y ningún
gate las comparaba.

El subconjunto se queda en tres: un avatar aparece casi siempre en colecciones —`Avatar.Group` existe
justo para eso— y `docs/06` §6 excluye `glow` de las listas completas. `gradient` y `glass` tampoco le
corresponden: el avatar no es raíz de su región y su superficie compite con la imagen o las iniciales
que contiene.

## El borde llega por var, no por recipe

`outline` necesita dibujar un borde que las otras dos variantes no tienen. En vez de una variante de
recipe se publican dos vars —`avatarBorder` y `avatarBorderWidth`— con `fallbackVar` a `transparent` y
`0`, para que el ancho lo decida la receta resuelta y no un booleano paralelo que pudiera contradecirla.

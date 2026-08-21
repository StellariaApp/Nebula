---
"@stellaria/nebula-web": patch
---

El relleno de `Card` se pone con `p`, como en el resto del catálogo, y su prop `padding` desaparece.

`Card` tenía una prop propia para el relleno porque la banda a sangre (`Card.Section`) cancela el
padding con un margen negativo y necesita el valor en una variable, y la variante de la receta era el
único sitio capaz de publicarlo. El `p` de los style props escribía `padding` y dejaba la variable
atrás: la tarjeta se veía bien y **todas las bandas a sangre de dentro sangraban la cantidad
equivocada**, en silencio.

Ahora la variable la publica `p` desde los sprinkles, en los dos carriles del extractor —el de tokens
y el abierto—, así que sigue al relleno también por breakpoint y un `p={20}` la deja igual que un
`p="md"`. Con eso `Card` ya no necesita prop propia.

**Migración:** `padding="x"` pasa a `p="x"`. La escala entera es tipable ahora, porque es la del
catálogo y no la de este componente; la recomendación de ADR-029 —`md`, `lg`, `xl`— sigue en pie
aunque el tipo ya no la vigile.

El `gap` interno sigue cayendo un escalón por debajo del relleno; la pareja se ata ahora en el
componente en vez de en la receta, y cede cuando el consumidor trae su propio `gap`.

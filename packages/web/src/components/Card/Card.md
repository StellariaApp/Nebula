# Card

## `variant` es opcional y aditivo

Sin `variant`, Card pinta lo de siempre: `surface.raised` + `text.primary` + `border.default`. Con
`variant`, `ResolveVariant` sobrescribe las tres piezas contra `theme.variantMap` (ADR-038). El recipe
usa `fallbackVar`, así que la var local solo existe cuando hay variante y ningún uso previo cambia.

Card es el componente con el subconjunto más amplio del catálogo —los seis: `filled`, `outline`,
`light`, `glass`, `glow` y `gradient`—. Es el único caso en que `docs/06` §6 admite las tres capas de
efecto, porque una card puede ser raíz de su región y objeto único de atención. La contrapartida está en
el propio §6 y no la puede vigilar el tipo: **una colección de cards usa el mismo nivel**, así que
`glow` y `gradient` son para la card destacada, no para la lista.

`withBorder` y la variante conviven: el borde se dibuja si el consumidor lo pide **o** si la receta
resuelta lo trae (`outline`).

El glow va a `boxShadow` por la variante `glowing` del recipe, no al `::after` animado de la plantilla
(§3.1). Ese patrón es para controles; una card ya tiene su propio motion de hover y `docs/06` §6 fija
que las sombras no animan.

## El padding vive en una var, no en el recipe

`CardSection` sangra hasta el borde de la card restando el padding con margen negativo. Mientras ese
margen fue `-space.md` fijo, el sangrado solo era correcto con `padding="md"`: con cualquier otro valor
la imagen o el separador dejaban un residuo de aire a cada lado (8 px con `lg`).

La variante `padding` publica ahora su valor en la var `pad` (`Card.vars.css.ts`) y lo aplica desde ahí.
`sectionInset` consume `calc(pad * -1)`, así que el sangrado se deriva del padding real sin que la
sección tenga que conocerlo. La var cascadea a los descendientes, que es justo lo que necesita un
compound.

## Escala de padding

`md` (16) compacto · `lg` (24) default · `xl` (32) prominente, según `docs/06-visual-language.md` §3 y
ADR-029. `sm` (8) se retiró: quedaba por debajo del rango que el lenguaje visual asigna a una card y
producía composiciones sin aire. Para agrupaciones más densas que `md`, `docs/06` §5 pide usar espacio o
divisor en vez de una card.

No mezclar los tres paddings dentro de una misma colección.

## Hover interactivo

Una card interactiva combina dos señales: elevación por `motion` (lift de 2 px con el spring `gentle`
del tema) y refuerzo de borde a `border.strong` por CSS. El lift se desactiva con reduced motion y con
`motion.tier: "minimal"`; la transición de borde se anula con `prefers-reduced-motion`. El estado sigue
siendo legible sin ninguna de las dos.

El lift se mantiene deliberadamente en 2 px: `docs/06` §5 pide que el hover no salte más de un nivel de
la escalera de elevación.

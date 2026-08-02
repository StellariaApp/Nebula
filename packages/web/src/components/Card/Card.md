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

## El `gap` deriva del `padding` (G1.5)

La raíz era `flex` en columna **sin `gap`**: el ritmo vertical entre título, cuerpo y acciones lo ponía
el consumidor, y dos cards del mismo producto podían quedar distintos sin que nada lo detectara. Los
cards del archivo de referencia sí lo declaran —`Metric Card` con padding 16 y gap 8, `Plan Card` con
padding 24 y gap 16—.

La regla no se eligió, se dedujo de `docs/06` §3: **dentro < entre**. El hueco interno de un card es un
peldaño por debajo de su propio padding, que reproduce exactamente los dos cards medidos:

| `padding` | valor |     `gap` |
| --------- | ----: | --------: |
| `none`    |     0 |         0 |
| `md`      |    16 |  8 (`sm`) |
| `lg`      |    24 | 16 (`md`) |
| `xl`      |    32 | 24 (`lg`) |

`padding="none"` lleva `gap: 0` a propósito: es el modo que usan los cards seccionados —los que
combinan `sectionInset` con `sectionBorder`—, donde un hueco separaría el borde de una sección de la
siguiente y rompería la lectura de lista continua.

**Pendiente de comprobación visual**: un card con `padding` distinto de `none` _y_ secciones con borde
recibe ahora hueco entre ellas. No hay caso así en el archivo de referencia ni en las láminas, pero
conviene mirarlo cuando se capture el baseline de ADR-037.

## Dos cosas que el plan proponía y no se hicieron

**Padding asimétrico** (16 vertical / 20 horizontal, de `Metric Card`): el informe de geometría lo dio
por ganador del archivo de diseño, y al ir a aplicarlo no se sostiene. Solo **uno** de los tres cards
medidos lo usa —`Plan Card` es 24 uniforme y `Address Card` no tiene padding de raíz—, y `pad` es una
sola variable que `sectionInset` **niega** con `calc(pad * -1)`: partirla en dos ejes obliga a
duplicar esa negación. Coste alto, evidencia de una sola instancia.

**Borde de 2 px como marca de selección** (`Plan Card` en `Variant=Current`): requiere un prop
`selected` que Card no tiene, y la evidencia es una variante de un card. Es ampliación de API, no
calibración, así que sale del tramo de geometría y necesita su propia decisión.

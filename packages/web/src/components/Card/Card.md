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

## El relleno se pone con `p`, y la sangría lo lee de `--nb-pad`

`CardSection` sangra hasta el borde de la card restando el padding con margen negativo. Mientras ese
margen fue `-space.md` fijo, el sangrado solo era correcto con 16 de relleno: con cualquier otro valor
la imagen o el separador dejaban un residuo de aire a cada lado (8 px con `lg`).

Que la sección necesite el número tuvo durante un tiempo un precio raro: Card llevaba una prop
`padding` propia —una variante de la receta— porque era el único sitio capaz de publicar el valor en
una var, y el `p` que gasta el resto del catálogo escribía `padding` y dejaba la var atrás. Dos nombres
para lo mismo, y el bueno era el que ningún otro componente usaba.

Ya no. **`p` publica `--nb-pad`**, y lo hace desde los sprinkles (`Box.css.ts`), no desde Card: es una
declaración más dentro de las clases de `padding` que ya se generaban, así que la variable sigue al
relleno también por breakpoint. El carril abierto hace lo mismo con su cadena de fallbacks, de modo que
un `p={20}` la deja igual que un `p="md"`. `section_inset` consume `calc(var(--nb-pad, 0px) * -1)` y no
tiene que conocer nada; el `0px` de reserva es para la card sin relleno, donde no hay qué cancelar.

Solo `p` la publica, no `px` ni `pt`: la sangría cancela los cuatro lados a la vez y únicamente el
relleno uniforme dice cuánto es. Y como la var cascadea, una banda a sangre funciona dentro de
cualquier contenedor con relleno, no solo dentro de una Card.

## Escala de relleno

`md` (16) compacto · `lg` (24) por defecto · `xl` (32) prominente, según `docs/06-visual-language.md`
§3 y ADR-029. `sm` (8) se retiró: quedaba por debajo del rango que el lenguaje visual asigna a una card
y producía composiciones sin aire. Para agrupaciones más densas que `md`, `docs/06` §5 pide usar espacio
o divisor en vez de una card.

Con `p` la escala entera es tipable —`xxs`, `sm`, `xxl`— porque es la del catálogo y no la de este
componente. Eso es una guía que el tipo ya no vigila, no un permiso: la de arriba sigue siendo la
recomendación, y `sm` en una card sigue siendo lo que ADR-029 quitó.

No mezclar los tres rellenos dentro de una misma colección.

## Hover interactivo

Una card interactiva combina dos señales: elevación por `motion` (lift de 2 px con el spring `gentle`
del tema) y refuerzo de borde a `border.strong` por CSS. El lift se desactiva con reduced motion y con
`motion.tier: "minimal"`; la transición de borde se anula con `prefers-reduced-motion`. El estado sigue
siendo legible sin ninguna de las dos.

El lift se mantiene deliberadamente en 2 px: `docs/06` §5 pide que el hover no salte más de un nivel de
la escalera de elevación.

## El `gap` deriva del relleno (G1.5)

La raíz era `flex` en columna **sin `gap`**: el ritmo vertical entre título, cuerpo y acciones lo ponía
el consumidor, y dos cards del mismo producto podían quedar distintos sin que nada lo detectara. Los
cards del archivo de referencia sí lo declaran —`Metric Card` con padding 16 y gap 8, `Plan Card` con
padding 24 y gap 16—.

La regla no se eligió, se dedujo de `docs/06` §3: **dentro < entre**. El hueco interno de un card es un
peldaño por debajo de su propio relleno, que reproduce exactamente los dos cards medidos:

| `p`    | valor |     `gap` |
| ------ | ----: | --------: |
| `none` |     0 |         0 |
| `md`   |    16 |  8 (`sm`) |
| `lg`   |    24 | 16 (`md`) |
| `xl`   |    32 | 24 (`lg`) |

La pareja la ata `GapForPad` en la cáscara y no la receta, que es donde vivía cuando el relleno era una
variante: al pasar a `p` se habría roto sin ruido, y un `p="none"` habría conservado el aire de una card
de 24. La regla es literalmente «un escalón por debajo en la escala del tema», así que vale también para
los valores que la tabla no lista, y cede en dos casos —cuando el consumidor trae su propio `gap`, y
cuando el relleno no sale de la escala (`p={20}`), donde el hueco se queda en el de la base—.

`p="none"` lleva `gap: 0` a propósito: es el modo que usan los cards seccionados —los que combinan
`sectionInset` con `sectionBorder`—, donde un hueco separaría el borde de una sección de la siguiente y
rompería la lectura de lista continua.

**Pendiente de comprobación visual**: un card con relleno distinto de `none` _y_ secciones con borde
recibe ahora hueco entre ellas. No hay caso así en el archivo de referencia ni en las láminas, pero
conviene mirarlo cuando se capture el baseline de ADR-037.

## Dos cosas que el plan proponía y no se hicieron

**Padding asimétrico** (16 vertical / 20 horizontal, de `Metric Card`): el informe de geometría lo dio
por ganador del archivo de diseño, y al ir a aplicarlo no se sostiene. Solo **uno** de los tres cards
medidos lo usa —`Plan Card` es 24 uniforme y `Address Card` no tiene padding de raíz—, y `--nb-pad` es
una sola variable que `sectionInset` **niega** con `calc(var(--nb-pad) * -1)`: partirla en dos ejes
obliga a duplicar esa negación. Coste alto, evidencia de una sola instancia.

**Borde de 2 px como marca de selección** (`Plan Card` en `Variant=Current`): requiere un prop
`selected` que Card no tiene, y la evidencia es una variante de un card. Es ampliación de API, no
calibración, así que sale del tramo de geometría y necesita su propia decisión.

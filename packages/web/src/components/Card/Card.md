# Card

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

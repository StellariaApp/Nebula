# NavLink

Renderiza uno de tres elementos excluyentes según las props: **botón de disclosure** si recibe `children`, **ancla** si recibe `href` sin hijos, o **botón simple** en cualquier otro caso. La rama la decide la composición, no una prop de tipo.

## `aria-current` también en la rama con hijos

Un grupo de navegación desplegable puede ser a la vez la sección actual, así que `active` publica `aria-current="page"` en las tres ramas. La rama con hijos añade además la semántica de disclosure (`aria-expanded` + `aria-controls`) y pliega por `Collapse`.

## Por qué `Collapse` necesitaba `inert`

Al anidar NavLinks se destapó que `Collapse` marcaba `aria-hidden` al cerrarse pero dejaba sus hijos en el orden de tabulación: el gate axe lo reportó como `aria-hidden-focus` (serio). `Collapse` aplica ahora `inert`, que los retira del foco y del árbol de accesibilidad a la vez.

## Contraste del estado activo

El texto activo usa el tono **700** de la escala, no el 600: con 600 sobre el fondo teñido al 14% no se alcanzaba 4.5:1 en `sober-light`. Es el mismo par que ya validan las variantes `light` y `outline` de `Badge`.

La barra indicadora entra con el spring del tema, y tanto ella como el giro del chevron se apagan con `prefers-reduced-motion` y con `motion.tier: "minimal"`.

## El estado activo sale del `variantMap`

`NavLinkVariant` es `Extract<Variant, "filled" | "light" | "ghost">` y el default es `light`, que es lo
que NavLink pintaba antes: `activeBg` ← `resolved.background`, `accent` ← `resolved.foreground`.

Antes lo calculaba a mano con `color-mix(scale.500 14%, transparent)` y `scale.700`. Era la **quinta**
variación de la misma receta en el catálogo —el contrato dice 12 %, Alert decía 12 %, Badge 14 % y
Avatar 18 %—, así que el activo se aclara ligeramente al pasar a 12 %.

`ghost` es el caso de navegación sin superficie: el item activo se distingue solo por el color del
texto y por la barra de acento, que NavLink dibuja aparte y no depende de la variante.

## Vigilar el peso al tocarlo

NavLink mide **20,88 kB contra un budget de 21**: 0,12 kB de margen, el más ajustado del catálogo tras
adoptar `ResolveVariant`. La regla de ADR-032 §7 dice que un exceso individual se corrige adelgazando
el componente, no subiendo su límite, así que el siguiente cambio que lo engorde tendrá que compensarse
dentro del propio módulo.

## La densidad sale del archivo de diseño, no de la escala de layout (G1.3)

`paddingInline` es `space.u3` (12) y `paddingBlock`/`gap` son `space.u2_5` (10), los valores que
`Sidebar Nav Item` usa en el archivo de referencia. Antes eran `space.sm` (8) y `space.xs` (4): el
`minHeight` de `control.sm` estiraba la caja hasta los mismos 36 px, pero con el texto pegado a los
bordes. Misma altura, otro aire — que es lo que se percibía como «se ve mal».

Los tres valores son de la mitad `u*` de la escala (ADR-045), la que existe para densidad interna de
control. Un componente de navegación no separa bloques: define cuánto respira una fila.

## El estado activo tiene que sobrevivir al hover

`&:hover:not([data-disabled='true'])` es más específico que `&[data-active='true']` —pseudo-clase más
`:not()` contra un solo atributo—, así que **al pasar el puntero sobre la página actual esta perdía su
marca** y se pintaba como una fila cualquiera. El selector combinado
`&[data-active='true']:hover:not([data-disabled='true'])` restituye la receta del variant.

Queda deliberadamente **sin** tinte propio de activo+hover: el archivo de diseño no declara estado de
hover para este componente —solo `Default`, `Active` y `Disabled`—, así que no hay referencia sobre
cuánto debe responder una fila que ya está seleccionada. Que el activo se mantenga es lo mínimo
correcto; diferenciarlo es una decisión de diseño pendiente.

## El hover se apoyaba en `surface.sunken`

Era el mismo defecto de la causa (a) de `docs/reviews/visual-calibration-2026-07-28.md`, que en dark
deja el hover a 1.01 contra el canvas —invisible—. El censo de aquella sesión encontró Accordion y
Pagination y **se saltó NavLink**. Ahora usa `surface.hover` (ADR-044) como los otros dos.

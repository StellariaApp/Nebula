# NavLink

Renderiza uno de tres elementos excluyentes según las props: **botón de disclosure** si recibe `children`, **ancla** si recibe `href` sin hijos, o **botón simple** en cualquier otro caso. La rama la decide la composición, no una prop de tipo.

## `aria-current` también en la rama con hijos

Un grupo de navegación desplegable puede ser a la vez la sección actual, así que `active` publica `aria-current="page"` en las tres ramas. La rama con hijos añade además la semántica de disclosure (`aria-expanded` + `aria-controls`) y pliega por `Collapse`.

## Por qué `Collapse` necesitaba `inert`

Al anidar NavLinks se destapó que `Collapse` marcaba `aria-hidden` al cerrarse pero dejaba sus hijos en el orden de tabulación: el gate axe lo reportó como `aria-hidden-focus` (serio). `Collapse` aplica ahora `inert`, que los retira del foco y del árbol de accesibilidad a la vez.

## Contraste del estado activo

El texto activo usa el tono **700** de la escala, no el 600: con 600 sobre el fondo teñido al 14% no se alcanzaba 4.5:1 en `sober-light`. Es el mismo par que ya validan las variantes `light` y `outline` de `Badge`.

La barra indicadora entra con el spring del tema, y tanto ella como el giro del chevron se apagan con `prefers-reduced-motion` y con `motion.tier: "minimal"`.

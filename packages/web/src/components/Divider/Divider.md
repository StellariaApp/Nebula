# Divider

Separador con `role="separator"` y `aria-orientation`. Absorbe el `DividerTitle` de TFV vía la prop `label` (por eso TFV DividerTitle se descarta en el inventario).

## Con label

Solo horizontal. Se compone de dos líneas (`border-top` con las vars) y el texto en medio; `labelPosition` decide cuál línea crece (`grow`) y cuál queda corta (`fixed`, `flex-basis: space.lg`). Las líneas van `aria-hidden` porque son puramente decorativas: el separador ya comunica su rol y el label aporta el texto.

## Color, grosor y estilo por vars

`color` es un `ColorExtended` —el mismo vocabulario que la style prop `c` y que las otras 49 props de color del catálogo (ADR-021)—: roles (`border.strong`, `text.muted`), escalas semánticas con shade y alpha (`primary.600`, `primary.600.40`), paletas crudas, `#hex`, `white`/`black`/`inherit`/`currentColor`/`transparent`. El default es `border.default`. `size` mapea a un grosor local (`xs…xl` → 1…5 px, constante de layout, no token de tema) o acepta un valor libre; `lineStyle` es el `border-style`. Los tres se publican como vars locales para que un cambio de tema repinte el color por CSS.

Hasta la normalización de WN, `color` era un `BorderRole` pelado (`strong`, no `border.strong`) y era el **único** componente del catálogo que se salía de ADR-021. La forma vieja ya no compila: `color="strong"` pasa a `color="border.strong"`. Como contrapartida heredada de ADR-021, un color concreto (hex o paleta cruda) es un escape hatch que **no se adapta entre temas** y queda fuera de `check:contrast`; los roles y las escalas semánticas siguen resolviéndose a vars y sí se adaptan.

El eje se llamó `variant` hasta ADR-041. Se renombró porque no es una receta cromática: en el resto del catálogo `variant` significa un subconjunto de `Variant` resuelto contra `theme.variantMap`, y un `border-style` no tiene nada que ver con eso. `lineStyle` nombra la propiedad CSS que expresa y no colisiona con ninguna clave de sprinkles.

## `lineProps` cae sobre las dos líneas

Un divisor con rótulo pinta **dos** tramos de línea, uno a cada lado. `lineProps` se esparce sobre
los dos, porque son el mismo elemento repetido y no dos nodos con identidad distinta. Dos ranuras
—`leftLineProps`/`rightLineProps`— habrían inventado una distinción que el componente no tiene.

Sin `label` no hay líneas que ajustar: el divisor es un solo borde y `lineProps` no se pinta.

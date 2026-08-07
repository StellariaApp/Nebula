# Divider

Separador con `role="separator"` y `aria-orientation`. Absorbe el `DividerTitle` de TFV vía la prop `label` (por eso TFV DividerTitle se descarta en el inventario).

## Con label

Solo horizontal. Se compone de dos líneas (`border-top` con las vars) y el texto en medio; `labelPosition` decide cuál línea crece (`grow`) y cuál queda corta (`fixed`, `flex-basis: space.lg`). Las líneas van `aria-hidden` porque son puramente decorativas: el separador ya comunica su rol y el label aporta el texto.

## Color, grosor y estilo por vars

`color` es un rol de borde (`subtle/default/strong/focus`), nunca un hex; `size` mapea a un grosor local (`xs…xl` → 1…5 px, constante de layout, no token de tema) o acepta un valor libre; `lineStyle` es el `border-style`. Los tres se publican como vars locales para que un cambio de tema repinte el color por CSS.

El eje se llamó `variant` hasta ADR-041. Se renombró porque no es una receta cromática: en el resto del catálogo `variant` significa un subconjunto de `Variant` resuelto contra `theme.variantMap`, y un `border-style` no tiene nada que ver con eso. `lineStyle` nombra la propiedad CSS que expresa y no colisiona con ninguna clave de sprinkles.

## `lineProps` cae sobre las dos líneas

Un divisor con rótulo pinta **dos** tramos de línea, uno a cada lado. `lineProps` se esparce sobre
los dos, porque son el mismo elemento repetido y no dos nodos con identidad distinta. Dos ranuras
—`leftLineProps`/`rightLineProps`— habrían inventado una distinción que el componente no tiene.

Sin `label` no hay líneas que ajustar: el divisor es un solo borde y `lineProps` no se pinta.

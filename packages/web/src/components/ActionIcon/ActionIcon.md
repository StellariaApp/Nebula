# ActionIcon

Botón cuadrado solo-icono. Misma anatomía que Button (React Aria `useButton` + recipe + motion + `ResolveVariant`), pero con dimensiones cuadradas por `size` (`sizes.control`) e icono centrado.

**a11y (docs/03 §1)**: al ser solo-icono, el icono va `aria-hidden` y el **nombre accesible es obligatorio** vía `aria-label` (o `aria-labelledby`). El gate axe lo verifica; sin él, `button-name` falla. En `loading` el icono baja a `opacity: 0`, aparece el spinner y `aria-busy` anuncia la carga, conservando el nombre.

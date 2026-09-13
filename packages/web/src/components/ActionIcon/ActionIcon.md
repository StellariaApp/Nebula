# ActionIcon

Botón cuadrado solo-icono. Misma anatomía que Button (React Aria `useButton` + recipe + motion + `ResolveVariant`), pero con dimensiones cuadradas por `size` (`sizes.control`) e icono centrado.

**a11y (docs/03 §1)**: al ser solo-icono, el icono va `aria-hidden` y el **nombre accesible es obligatorio** vía `aria-label` (o `aria-labelledby`). El gate axe lo verifica; sin él, `button-name` falla. En `loading` el icono baja a `opacity: 0`, aparece el spinner y `aria-busy` anuncia la carga, conservando el nombre.

## `pressed`: el estado va en el relleno, no en el trazo

ADR-194. Guardar, me gusta, silenciar, pantalla completa: un `ActionIcon` que conmuta. Con
`pressed` el botón anuncia `aria-pressed` y, mientras está puesto, dibuja `pressedVariant`
(`filled` por defecto) en vez de `variant`. La regla es visual y es de producto: un icono tintado
sobre cristal se lee como «este botón es de marca», no como «esto ya está guardado»; el relleno se
lee de un vistazo. No hay `onToggle`: `onPress` con el booleano fuera, como `Switch` y `Chip`.

`data-pressed` es otra cosa —el instante del clic, de React Aria— y por eso el conmutador publica
`data-toggled`.

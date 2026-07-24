# Menu / ContextMenu

Patrón APG *menu button*: `useMenuTrigger` + `useMenu` + `useTreeState`, con la colección construida desde el array `items` (misma forma de API que Select/Combobox, decidida en el checkpoint de W2.4).

## Por qué `Enter` necesita un handler propio

`useMenuTrigger` abre el menú desde `onPressStart`, pero **se salta explícitamente el teclado**:

```js
onPressStart(e) {
  if (e.pointerType !== 'touch' && e.pointerType !== 'keyboard' && !isDisabled) { … }
}
```

y su `onKeyDown` abandona el caso `Enter`/`Space` si el evento ya venía con `preventDefault`:

```js
case 'Enter':
case ' ':
  if (trigger === 'longPress' || e.isDefaultPrevented()) return;
```

`usePress` (dentro de nuestro `Button`) sí hace `preventDefault` en `Enter` sobre un `<button>` nativo, así que esa rama siempre se sale y el menú no abriría con teclado. React Aria lo reconoce en un comentario de su propio código: *"it's only through PressResponder magic that this works for RSP and RAC. it does not work in aria examples"*. Su `Pressable` no sirve aquí porque solo acepta elementos DOM (`ReactElement<DOMAttributes, string>`), no componentes como `Button`.

La solución es componer `onPress` sobre el del trigger y abrir cuando `pointerType === "keyboard"`. No hay doble apertura: en `Enter` el `onKeyDown` de aria ya se salió, y `ArrowDown`/`ArrowUp` siguen resolviéndose por su propia rama (que no tiene la guarda de `isDefaultPrevented`), abriendo con foco en el primer o último item.

Cobertura de teclado resultante: `Enter`/`Space` abren, `ArrowDown` abre enfocando el primero, `ArrowUp` el último, flechas navegan saltando deshabilitados, `Home`/`End` van a los extremos, type-ahead busca por `textValue`, `Esc` cierra.

## El ciclo de press en los botones

Que esto funcione exigió que `Button`, `UnstyledButton` y `ActionIcon` reenviaran a `useButton` el ciclo completo de press (`onPressStart`, `onPressEnd`, `onPressUp`, `onPressChange`, `preventFocusOnPress`) y no solo `onPress` — ver `utils/press-props.ts`. Cualquier trigger de overlay (Menu hoy; Select y Combobox en la Parte 2) depende de ello.

## ContextMenu

Se ancla al puntero, así que no usa `usePopover` (que necesita el rect de un trigger) sino posición fija en las coordenadas del evento, con `useOverlay` para el cierre por `Esc` y click fuera. Además del click derecho acepta las teclas de contexto (`ContextMenu` y `Shift+F10`), anclando entonces al rect del elemento enfocado.

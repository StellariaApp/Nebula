# Anillo de foco

Única definición del anillo de foco del catálogo (ADR-036). Ningún componente vuelve a escribir `outline` ni `boxShadow` de foco por su cuenta.

## Por qué `box-shadow` y no `outline`

`box-shadow` sigue el `border-radius` real del elemento; `outline` con offset positivo dibuja una forma cuyo radio no coincide con el del control en los peldaños altos del tema (`lg` 14 · `xl` 20 · `xxl` 28). En un botón `radius="full"` la diferencia se ve a simple vista.

La razón de fondo, sin embargo, es el **anillo de dos tonos**: un separador del color de la superficie y un halo del color de foco.

```
0 0 0 3px <separator>, 0 0 0 5px <halo>
```

El separador cumple dos funciones a la vez, y por eso no es un adorno: garantiza que el anillo se distinga aunque el control se apoye sobre una superficie del mismo tono que el foco, y **es el `outline-offset`** de esta geometría — el hueco que separa el trazo del borde del control. `outline` no puede expresar lo primero, porque es un trazo único.

`OFFSET` (3) y `THICKNESS` (2) son las dos únicas cifras del anillo y gobiernan también el `outline` del fallback, de modo que recalibrar una no puede desincronizar las dos geometrías.

## El campo no recolorea su borde al enfocarse

Antes de unificar, `field` pintaba `borderColor: focus` **y** un anillo, que juntos se leían como un solo filo azul grueso. Al añadir el separador esa combinación se partió en dos líneas azules con un hueco oscuro entre medias. El borde recoloreado sobra: el anillo ya comunica el foco, y mantener los dos duplica la señal.

## El tono se cambia por var, no duplicando la regla

`halo` y `separator` son `createVar()` con `fallbackVar` a `border.focus` y `surface.base`. Quien necesite otro tono lo declara y ya:

```ts
"&[data-invalid='true']:focus-within": {
  vars: { [focus.halo]: vars.color.semantic.error["500"] },
},
```

Así el campo inválido conserva su anillo rojo sin una segunda definición de la geometría, que era el defecto que A4 denunciaba en `field.css.ts`.

## El fallback de `forced-colors` va dentro de `ring`

En el modo de alto contraste de Windows el navegador **descarta `box-shadow`**. Migrar a esa geometría sin más sería una regresión de accesibilidad frente al `outline` que había antes. Por eso `ring` emite además un `outline: 2px solid transparent` bajo `@media (forced-colors: active)`: el modo forzado repinta ese trazo con el color del sistema y el foco nunca desaparece.

Va **dentro** de `ring`, no como fragmento aparte, para que sea imposible migrar la geometría y olvidar el fallback. Un `...focus.ring` trae las dos cosas.

## El disparador sigue siendo el de cada componente

ADR-036 regla 4 pide un solo disparador, `data-focus-visible`. Este helper es agnóstico: se aplica bajo el selector que cada componente ya usaba. Hoy conviven cuatro:

| Disparador                      | Dónde                                                          |
| ------------------------------- | -------------------------------------------------------------- |
| `[data-focus-visible='true']`   | Button, ActionIcon, UnstyledButton — vía `useFocusRing`        |
| `:focus-visible`                | Accordion, Anchor, Card, NavLink, Pagination, Segment          |
| `input:focus-visible + hermano` | Checkbox, Radio, Switch — el anillo va en un hermano del input |
| `:focus-within`                 | `field` — el foco cae en el `<input>` interior                 |

Unificarlos exige añadir `useFocusRing` a seis componentes y, en Accordion, Pagination y Segment, extraer un componente hijo por item porque sus botones se crean dentro de un `.map()` y un hook no puede vivir en un bucle. Es trabajo de comportamiento, no de estilo, y **no cambia lo que el usuario ve**: `:focus-visible` nativo y el de React Aria pintan en los mismos momentos para un botón corriente. Queda como paso propio, con su alcance ya medido.

# Anillo de foco

Única definición del anillo de foco del catálogo (ADR-036). Ningún componente vuelve a escribir `outline` ni `boxShadow` de foco por su cuenta.

```
outline: 2px solid <halo>;
outline-offset: 4px;
```

`OFFSET` (4) y `THICKNESS` (2) son las dos únicas cifras del anillo.

## Por qué `outline` y no `box-shadow`

ADR-036 regla 2 eligió `box-shadow` con dos argumentos. Al implementarlo y mirarlo en pantalla, **los dos resultaron falsos**:

**«`outline` no sigue el `border-radius`».** Lo seguía ya cuando se escribió el ADR: Chrome desde la 94, Firefox desde la 88 y Safari desde la 16.4 dibujan el `outline` —incluso con `outline-offset`— respetando el radio real del elemento. El argumento describía un navegador que ya no existe.

**«`box-shadow` permite el anillo de dos tonos».** Permite pintarlo, pero no permite lo que hacía falta: **un hueco transparente**. Un `box-shadow` con spread es una forma maciza, no un anillo; el hueco solo existe si una capa interior **opaca** tapa el interior de la exterior. Eso obliga a que el separador tenga un color concreto, y no hay ninguno correcto: `surface.base` pinta el canvas sobre una Card, `surface.overlay` pinta el overlay sobre el canvas. Se probaron las dos variantes y las dos se ven mal en la mitad de los casos.

`outline-offset` no tiene ese problema porque el hueco **no se pinta**: deja ver lo que hay detrás, sea el canvas, una Card o la cabecera de un Modal.

## Consecuencia: no hace falta fallback de `forced-colors`

ADR-036 regla 6 exigía emitir un `outline: 2px solid transparent` bajo `@media (forced-colors: active)`, porque en el modo de alto contraste de Windows el navegador **descarta `box-shadow`** y el foco habría desaparecido.

Con la geometría en `outline`, el modo forzado lo repinta con el color del sistema por sí solo. La regla desaparece porque desaparece su motivo, no porque se renuncie a ella.

## El tono se cambia por var

`halo` es un `createVar()` con `fallbackVar` a `border.focus`. Quien necesite otro tono lo declara:

```ts
"&[data-invalid='true']:focus-within": {
  vars: { [focus.halo]: vars.color.semantic.error["500"] },
},
```

Así el campo inválido conserva su anillo rojo sin una segunda definición de la geometría, que era el defecto que A4 denunciaba en `field.css.ts`.

## El campo no recolorea su borde al enfocarse

Antes de unificar, `field` pintaba `borderColor: focus` **y** un anillo, que juntos se leían como un solo filo azul grueso. Con el anillo separado del borde esa combinación se lee como dos líneas azules. El borde recoloreado sobra: el anillo ya comunica el foco.

## El disparador sigue siendo el de cada componente

ADR-036 regla 4 pide un solo disparador, `data-focus-visible`. Este helper es agnóstico: se aplica bajo el selector que cada componente ya usaba. Hoy conviven cuatro:

| Disparador                      | Dónde                                                          |
| ------------------------------- | -------------------------------------------------------------- |
| `[data-focus-visible='true']`   | Button, ActionIcon, UnstyledButton — vía `useFocusRing`        |
| `:focus-visible`                | Accordion, Anchor, Card, NavLink, Pagination, Segment          |
| `input:focus-visible + hermano` | Checkbox, Radio, Switch — el anillo va en un hermano del input |
| `:focus-within`                 | `field` — el foco cae en el `<input>` interior                 |

Unificarlos exige añadir `useFocusRing` a seis componentes y, en Accordion, Pagination y Segment, extraer un componente hijo por item porque sus botones se crean dentro de un `.map()` y un hook no puede vivir en un bucle. Es trabajo de comportamiento, no de estilo, y **no cambia lo que el usuario ve**: `:focus-visible` nativo y el de React Aria pintan en los mismos momentos para un botón corriente. Queda como paso propio, con su alcance ya medido.

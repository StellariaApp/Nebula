# Slider / RangeSlider

`SliderBase` es la única implementación; `Slider` emite un `number` y `RangeSlider` un
`{ start, end }`. Los dos envuelven la base en `FormField`, así que el `<label>` lo pinta el campo y
la base solo recibe `ariaLabel` / `ariaLabelledBy`.

## El input nativo va oculto, no estilado

`useSliderThumb` devuelve `inputProps` para **un `<input type="range">` visualmente oculto**: es la
pieza que aporta rol, valor, límites y teclado. Si se monta a la vista, el navegador pinta *además*
su propio track y su propio pulgar encima del track y del thumb de Nebula. Por eso el input va
dentro de `VisuallyHidden` de `react-aria` — el mismo patrón que `ColorPicker` — y todo lo que se ve
son los `div` de `track`, `fill` y `thumb`.

`VisuallyHidden` recorta sin sacar del flujo de foco, así que el `useFocusRing` del input sigue
disparando `data-focus-visible` en el thumb, que es quien dibuja el anillo (ADR-036).

## La geometría del thumb la pone React Aria

`thumbProps.style` ya trae `position: absolute`, `left` con el porcentaje del valor —invertido en
RTL— y `transform: translate(-50%, -50%)`. La hoja de Nebula aporta solo el eje que falta,
`top: 50%`, y el tamaño por `size`.

Los variantes de `thumbSize` **no llevan `marginTop`/`marginLeft` negativos**: centrar por margen
sobre un elemento que ya se centra por `transform` desplaza el thumb media pieza arriba y a la
izquierda. Tampoco hay que recalcular `left` a mano con `state.getThumbPercent(index)`: además de
duplicar el cálculo, pierde la inversión de RTL.

`fill` sí calcula su `left`/`width` con `getThumbPercent` porque no tiene equivalente en el hook.

## Las marcas reservan su hueco

`marks` es una capa absoluta anclada a `top: 100%` del track y con `height: 0`, así que por sí sola
no ocupa nada y las etiquetas se comen el espacio del control siguiente. Cuando hay marcas, la raíz
recibe además `rootWithMarks`, que reserva abajo el alto de la línea de etiquetas.

## Etiquetado de los thumbs

`RangeSlider` da `aria-label` propio a cada thumb ("Mínimo" / "Máximo"), así que cada uno necesita
resolver su nombre accesible como `label del campo + label del thumb`. El input recibe un `id`
propio y un `aria-labelledby` explícito que concatena el id del label del `FormField` con el suyo;
con `withValue={false}` no existe `<output>`, y sin ese `aria-labelledby` el nombre accesible se
perdería.

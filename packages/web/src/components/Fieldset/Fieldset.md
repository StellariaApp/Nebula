# Fieldset

## El eje se llama `surface`, no `variant`

`FieldsetSurface` es `Exclude<FieldSurface, "underline">`: `outline`, `filled` y `unstyled`.

Se llamaba `variant` con los valores `default | filled | unstyled`, y no lo era. ADR-041 reservó
`variant` para la receta cromática del contrato —un subconjunto de `Variant` resuelto contra
`theme.variantMap`— y el eje de un fieldset es el tratamiento de la superficie del marco, que no
resuelve contra nada del `variantMap`. `default` no existe siquiera como miembro de `Variant`.

El vocabulario se toma del eje `surface` de los campos (ADR-042) porque es el mismo concepto y ya
existe: `default` pasa a `outline`. `underline` se excluye —un marco de grupo no se define con una sola
línea inferior— y por eso el tipo es un `Exclude` del compartido en vez de una unión nueva: si mañana
`FieldSurface` gana un miembro, aquí hay que decidir explícitamente si aplica.

## Por qué `outline` no rellena aquí y sí en un campo

En el eje de los campos, `outline` y `filled` comparten relleno (`surface.sunken`) y se diferencian por
el borde. En un fieldset, `outline` deja el fondo **transparente**.

No es una inconsistencia del nombre: en los dos casos `outline` significa «el borde es lo que define la
superficie» y `filled` «el relleno es lo que la define». Lo que cambia es si el relleno está presente
cuando no es el protagonista, y eso lo decide el elemento: una caja de texto necesita separarse del
canvas para leerse como editable; un marco que agrupa campos ya está separado por su borde y rellenarlo
metería una segunda superficie entre el canvas y los propios campos, que sí van rellenos.

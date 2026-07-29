# Loader

## `type`, no `variant`

`type` elige la forma de la animación —`spinner`, `dots`, `bars`— y se publica como `data-type`.

El eje se llamó `variant` hasta ADR-041. No lo era: en el resto del catálogo `variant` significa un
subconjunto de `Variant` resuelto contra `theme.variantMap`, y «spinner contra bars» no es una receta
cromática ni tiene relación con el effects budget. El color del Loader ya viaja por `color`
(`SemanticScaleName`), que es su eje cromático real.

`type` es el nombre que `Progress` y `List` ya usan para el mismo tipo de eje —elegir entre formas del
mismo componente—, así que no introduce vocabulario nuevo. No colisiona con sprinkles ni con ningún
atributo HTML: `LoaderProps` es una interfaz cerrada sobre `StyleProps` y el componente renderiza un
`<span>`.

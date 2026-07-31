# Search

## `top` y `bottom` son slots, no posicionamiento

Los dos nombres colisionan con las style props de posición de ADR-032, que publica `top`, `right`,
`bottom` y `left`. La regla 3 de ese ADR resuelve la colisión a favor de la prop del componente, así
que `SearchProps` hace `Omit<StyleProps, "color" | "top" | "bottom">` y los dos pasan a ser slots, como
en la referencia de TFV (`docs/api/tfv-components.md` §5).

Consecuencia: sobre `Search` no se puede escribir `top={0}` para pegarlo a un borde. Si hace falta
posicionarlo, se envuelve en un `Box position="sticky" top={0}` — que además es donde tiene sentido,
porque lo que se pega es la región, no la barra.

`before` y `after` no colisionan con nada y se quedan con su nombre.

## Los filtros no se renderizan aquí

`Search` no sabe pintar un filtro: recibe `filters` y se los pasa entero a `Filters`, que es quien
tiene el popover, el recuento de activos y el «quitar todos». Los cuatro props de estado
—`filterState`, `defaultFilterState`, `onFilterChange`, `filterAccessors`— son puro reenvío.

Así una app que ya tiene su propia barra puede usar `Filters` suelto, y una que solo quiere buscar
puede usar `SearchInput` suelto. `Search` es la composición de los tres, no una capa nueva.

## `onChange` y `onSearch` no son lo mismo

`onChange` va en cada pulsación; `onSearch` va con el retardo de `debounce` (300 ms por defecto, el de
`SearchInput`). El primero sirve para reflejar el texto en la vista, el segundo para pedir datos. Se
exponen los dos porque en un listado grande atarlos al mismo reloj obliga a elegir entre un input con
lag o una petición por tecla.

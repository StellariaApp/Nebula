# MultiSelect

Combobox con `selectionMode: "multiple"` (soportado de forma nativa por `useComboBoxState` en react-stately 3.48: `ValueType<'multiple'> = Key[]`), con los valores elegidos como chips y búsqueda en el mismo campo.

## Identidad del array controlado

El estado controlado de React Aria compara el `value` por identidad. Pasarle un array recién creado en cada render —`value={[...selected]}`— provoca **"Too many re-renders"**: cada render produce un `value` distinto y el ciclo no cierra. Por eso la copia va memoizada sobre `fp.value`, que a su vez es estable (`useUncontrolled` lo guarda en estado, y en modo controlado se memoiza sobre la prop).

Es la misma razón por la que `items` y `disabledKeys` también se memoizan.

## `maxValues`

Al alcanzar el tope no se deshabilita el campo: se añaden a `disabledKeys` las opciones **no seleccionadas**, de modo que las ya elegidas siguen pudiendo deseleccionarse. Deshabilitar la lista entera dejaría al usuario sin forma de corregir su selección sin usar los chips.

## Contrato de formulario

`field` es `NebulaField<string[]>`. El hook se instancia con el tipo mutable (`useFieldProps<string[]>`) y la conversión ocurre en la frontera: `setValue` es contravariante, así que un `NebulaField<string[]>` no encaja donde se espera `NebulaField<readonly string[]>`.

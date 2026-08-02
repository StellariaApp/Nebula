# Patterns de Combobox

Los cuatro son composiciones sobre la primitiva `Combobox` (§1.5 del inventario), no
implementaciones nuevas: el motor de React Aria, el popover, la lista y el contrato de campo ya
estaban. Por eso los cuatro miden lo mismo que `Combobox` más unos cientos de bytes.

| Patrón             | Qué añade                                                              |
| ------------------ | ---------------------------------------------------------------------- |
| `Autocomplete`     | `allowsCustomValue` — el valor escrito vale aunque no esté en la lista |
| `SearchableSelect` | Lo contrario: filtra pero solo deja elegir de la lista                 |
| `CreatableSelect`  | Una opción sintética «Crear …» cuando lo escrito no existe             |
| `AsyncSelect`      | Debounce sobre la consulta y carga remota con estado                   |

## `CreatableSelect` marca la opción nueva con un prefijo reservado

La opción de alta viaja como `__create__:<etiqueta>`. Es la única forma de distinguirla en
`onSelectionChange` sin cambiar el contrato de `SelectOption`, y nunca colisiona con un valor real
porque el consumidor jamás lo escribe. Al elegirla se llama `onCreate`, que puede devolver la opción
definitiva, una cadena —que se toma como `value`— o `null` para abortar el alta.

Las opciones creadas se acumulan en el estado del patrón y se concatenan a `data`, así que siguen
existiendo aunque el consumidor no actualice su lista.

## `AsyncSelect` guarda `load` e `initialData` en refs

Los dos entran en el efecto que dispara la carga, y los dos suelen llegar como literal en línea
—`load={async (q) => …}`, `initialData={[]}`— que cambia de identidad en cada render. Con ellos en
las dependencias, el efecto se re-dispara, hace `setState` y vuelve a renderizar: bucle infinito. Es
el mismo defecto de identidad que obligó a memoizar el parseo en la cadena de fechas (W3.1), y aquí
lo destapó el gate de tests colgándose.

Las dependencias reales son `[debounced, minQueryLength]`. `request_ref` descarta las respuestas de
peticiones que ya no son la última, de modo que una consulta lenta no pisa a una posterior.

`emptyLabel` cambia según el estado —`loadingLabel`, `errorLabel` o el vacío normal—, así que la
lista comunica la carga sin necesidad de un spinner aparte.

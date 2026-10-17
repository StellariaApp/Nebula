# Combobox

Primitiva de `docs/00-inventory.md` §1.4 sobre `useComboBox` + `useComboBoxState`: base de Select, MultiSelect y de los patrones de §1.5 (SearchableSelect, CreatableSelect, AsyncSelect).

## El filtrado es nuestro, no de React Aria

`useComboBoxState` acepta `defaultFilter`, pero lo **ignora cuando `items` es controlado**:

```js
// react-stately/useComboBoxState
let filteredCollection = useMemo(() =>
  // No default filter if items are controlled.
  props.items != null || !defaultFilter ? collection : filterCollection(collection, inputValue, defaultFilter),
  […]);
```

Como el API público es `data` (decisión del checkpoint de W2.4), la colección siempre está controlada y el filtro corre aquí, con el `contains` de `useFilter` (respeta locale, acentos y mayúsculas). Es además el camino que necesitan AsyncSelect y CreatableSelect, que filtran fuera del componente.

El filtro es por **subcadena**, no por prefijo: escribir `co` casa con `Colombia` y con `Méxi`**`co`**.

## `query`: borrador contra selección

Controlar `items` obliga a controlar también `inputValue`, y eso rompería el comportamiento normal de "el campo muestra la opción elegida". Se resuelve con un borrador que solo existe mientras el usuario escribe:

```ts
const query = inputValue ?? draft ?? selected?.label ?? "";
```

`draft` vuelve a `null` en cada selección, de modo que el input recupera la etiqueta seleccionada. Y mientras `query` sea exactamente esa etiqueta se muestran **todas** las opciones: al reabrir tras elegir, la lista no aparece filtrada a un solo elemento.

## Etiquetado

`FormField` pinta el `<label>`, así que el id se genera aquí y se le pasa: el hook recibe `aria-labelledby` apuntando a ese label en vez de un `aria-label` que taparía el texto visible. Sin id propio, React Aria avisa de que falta etiqueta aunque el `<label for>` sí funcione sobre un `<input>`.

El botón de despliegue hereda el nombre del campo por `aria-labelledby` (comportamiento APG de React Aria); `toggleLabel` solo se aplica cuando no hay `label`.

## El botón de despliegue no esparce todo lo de React Aria

`useComboBox` devuelve `buttonProps` para pasarlos por `useButton`, no al DOM: traen `excludeFromTabOrder` e `isDisabled`, que React no reconoce y avisa en consola. `UnstyledButton` ya corre su propio `useButton` con las props de press, así que `TriggerDomProps` quita esas dos antes del esparcido. `isDisabled` es el mismo `fp.isDisabled` que recibe el hook y llega al botón como `disabled`. `excludeFromTabOrder` se descarta porque el orden de foco lo fija el propio Combobox: el botón entra en el Tab con la lista cerrada y sale con `tabIndex={-1}` mientras está abierta.

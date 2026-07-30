# Calendar

## Tres defectos que la revisión visual del propietario destapó

**El hover no existía.** `Calendar.css.ts` declaraba `&[data-hovered='true']` pero `CalendarGrid` nunca
emitía ese atributo: no usaba `useHover`. La regla era código muerto desde que se escribió, y ningún
gate lo ve —axe no comprueba estados de puntero y los tests no los ejercitaban—.

**El rango se pintaba sólido de extremo a extremo.** `useCalendarCell` de React Aria devuelve
`isSelected` en **todos** los días de un rango, no solo en los extremos. Como la celda aplicaba la
píldora sólida a `[data-selected]` y `borderRadius: full` incondicionalmente, los días intermedios
salían del color de acento y con las esquinas redondeadas, produciendo un festoneado en vez de una
banda. La banda tenue que `cellWrapper` ya definía quedaba tapada debajo.

La distinción la aporta ahora `data-range-middle`, que la celda emite cuando está dentro del rango y
**no** es uno de los dos extremos. Con eso:

- extremos y selección simple: píldora sólida con la receta resuelta;
- intermedios: fondo transparente, `borderRadius: 0` y peso normal, dejando ver la banda del wrapper;
- el hover deja de excluir a los seleccionados, así que un día intermedio responde al puntero.

**El color estaba clavado a `primary`.** El día seleccionado horneaba `primary.600` + `text.onPrimary` y
la banda `primary.100`, sin prop `color` ninguna: un calendario no se podía teñir ni por prop ni por
tema. Es la misma receta `filled` escrita a mano que la auditoría WV encontró en Alert, Badge, Avatar,
NavLink, Pagination y FieldError.

## El color se resuelve en la raíz y cascadea

`Calendar` y `RangeCalendar` resuelven `ResolveVariant` una vez y publican `dayBg`, `dayFg`, `dayBorder`
y `rangeBg` como vars en su elemento raíz. `CalendarView` y `CalendarGrid` no reciben ni propagan el
color: lo heredan por CSS.

Es deliberado. La alternativa era atravesar dos componentes intermedios con dos props que ninguno de los
dos usa, solo para llegar a la celda. Las vars ya cascadean y el árbol de un calendario es fijo.

`rangeBg` se deriva del fondo resuelto con `color-mix` al 16 %, no de un peldaño fijo de la escala: así
la banda sigue al `color` y a la `variant` en lugar de asumir que existe un `.100` —que no existe cuando
el consumidor pasa un hex por el modo plano de ADR-021—.

## `GridPicker` comparte las vars, no las duplica

`MonthPicker` y `YearPicker` pintan su celda seleccionada con las mismas `dayBg`/`dayFg`/`dayBorder` de
este módulo. Es el mismo rol de diseño —la celda de fecha elegida— y duplicar el juego de vars habría
permitido que las dos superficies derivaran sin que nada lo detectara, que es exactamente el defecto que
esta auditoría lleva seis casos corrigiendo.

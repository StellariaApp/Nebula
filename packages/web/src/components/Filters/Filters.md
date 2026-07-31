# Filter · Filters

## El descriptor es de TFV; el transporte del valor, no

`docs/00-inventory.md` §1.11 fija «el descriptor declarativo `Filter` de TFV como base», y
`FilterDescriptor` lo es: `key`, `type` sobre la misma unión (`select · multiselect · radio · range ·
date · text`, más `daterange`, que TFV resuelve con dos campos sueltos) y las opciones.

Lo que **no** se copia es `ParamsFilterProps`, la forma en que TFV lee y escribe: cuatro funciones
—`value`, `values`, `onSet`, `onDelete`— porque su fuente son los search params de Next, que no son un
objeto plano. Nebula no depende de ningún router (`docs/01` §7), así que el camino por defecto es un
**estado plano** `FilterState` controlado o no controlado, y las cuatro funciones quedan como escotilla
opcional (`accessors`) para quien sí quiera enchufarlo a la URL:

```tsx
<Filters filters={FILTERS} accessors={{ value, values, onSet, onDelete }} />
```

`StateAccessors` se exporta para construir esas funciones desde un objeto, que es lo que hace el propio
componente cuando no se le pasa `accessors`. Así el caso simple no obliga a escribir nada y el caso de
URL no obliga a mantener dos fuentes de verdad.

## `range` y `daterange` viajan como un solo string

`"10..250"` y `"2026-01-01..2026-03-31"`. Un filtro tiene **una** `key`, y partirlo en `precio_min` y
`precio_max` duplicaría las keys y rompería el recuento de activos y el «quitar todos». El separador es
`..` porque no aparece en un número ni en una fecha ISO, y `RangeParts`/`JoinRange` son las dos
funciones que lo cruzan. Un extremo vacío es válido: `"..250"` es «hasta 250».

## `FilterOption.label` es `string`, no `ReactNode`

`SelectOption` del sistema de colecciones lo exige —lo usa como `textValue` para la navegación por
teclado escribiendo— y un descriptor de filtro es un dato serializable que suele venir de configuración
o de la URL. Para adornar la opción está `description`, que sí es `ReactNode`.

## Las ramas de fecha van con `lazy`

`Filter` sabe pintar los siete tipos, así que un import estático arrastraría la cadena de fechas a toda
app con filtros, declare o no un `type: "date"`. Medido: **110,7 kB con las fechas dentro, 70,6 kB sin
ellas** — 40 kB brotli que la mayoría de los consumidores no usa.

Por eso `DatePicker` y `DateRangePicker` entran por `lazy()` + `Suspense`. La API pública no cambia:
el descriptor sigue siendo declarativo y `type: "date"` sigue funcionando solo. El sitio es
especialmente cómodo porque el panel vive en un `Popover` y no monta hasta abrirse, así que el
fallback no parpadea en la carga inicial.

Nota de medición: `size-limit` bundlea con esbuild **sin** code-splitting, de modo que sumaba el chunk
diferido al presupuesto y el número no bajaba. Las tres entradas llevan `deferred` para excluirlo, que
es la misma corrección que ADR-032 §6 hizo con la hoja de sprinkles. El `import()` sobrevive al build
—se puede comprobar en `dist/components/Filters/Filter.js`—, así que el bundler del consumidor sí
parte el chunk.

## Un filtro vacío se borra, no se guarda vacío

Poner un `select` en su opción vacía llama a `onDelete`, no a `onSet(key, "")`. Si se guardara la
cadena vacía, el filtro contaría como activo, el badge del disparador mentiría y la app tendría que
limpiar el objeto antes de mandarlo al backend.

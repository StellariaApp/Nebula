# Chip / ChipGroup

## `variant` es el subconjunto del contrato, no una receta local

`ChipVariant` es `Extract<Variant, "filled" | "outline" | "light">` y la receta la resuelve
`ResolveVariant` contra `theme.variantMap` (ADR-038). Chip nació con una función `Palette()` propia que
horneaba `color-mix(in srgb, color 14%, transparent)` para `light` —la cuarta definición incompatible de
esa misma receta en el catálogo— y por tanto no recibía el remapeo que `playful` hace de `filled`.

El subconjunto **no incluye `ghost` ni `gradient`**, que sí están en la fila de ADR-038 §3 junto a
Badge. La ejecución de ese ADR lo recorta:

- `ghost` resuelve a fondo y borde transparentes, que es exactamente el reposo de un chip **sin
  marcar**. Un chip marcado en `ghost` sería indistinguible de uno sin marcar salvo por el icono, y el
  estado de selección es la única información que un chip transporta.
- `gradient` cae en la exclusión de `docs/06` §6 —«no es fondo dominante en tablas, formularios ni
  lectura larga»— porque un chip vive en colección dentro de un formulario o una barra de filtros.
  Badge conserva `gradient` porque etiqueta un elemento suelto, no una lista de opciones.

## El estado sin marcar no lleva variante

`variant` describe el chip **marcado**. Sin marcar, los tres roles son neutros —fondo transparente,
`text.primary` y `border.default`— con independencia de la variante: es la caja vacía sobre la que se
lee la selección, y tintarla convertiría el reposo en un cuarto estado a distinguir.

## El borde mide 1 px siempre

La hoja fija `borderWidth: 1` y **no** consume `resolved.borderWidth`. `light` y `filled` lo resuelven
a `0`, así que leerlo encogería la caja 2 px al marcar y movería la fila entera de chips. Con el ancho
fijo, la receta solo cambia el **color** del borde —transparente en `light` y `filled`, el acento en
`outline`— y la geometría no depende del estado.

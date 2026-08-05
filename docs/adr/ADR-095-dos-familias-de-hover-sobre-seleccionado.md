# ADR-095 — Dos familias de hover sobre seleccionado

- **Estado**: aceptada · 2026-08-05 (decisión del propietario durante N4) · **Complementa** ADR-088
- **No amplía el contrato**: `ResolveVariant` ya devolvía `backgroundHover`

## Contexto

ADR-088 añadió `surface.hoverActive` para el cruce selección + puntero, y dejó el reparto para N4.
Al barrer el catálogo aparecen **diez** hojas con estado seleccionado y respuesta a hover, y el token
solo encaja en tres de ellas.

La razón es que el fondo del estado seleccionado no siempre sale de `surface.*`. En la mitad del
catálogo sale de `ResolveVariant`, es decir, es **color de marca**: el día elegido de un calendario,
el enlace activo de una navegación, la página actual de una paginación. Pintar `surface.hoverActive`
ahí sustituye la marca por un gris neutro — que es peor que el problema que ADR-088 venía a resolver.

## Decisión

El token que se usa lo decide **de dónde sale el fondo del estado seleccionado**, no el tipo de
componente:

| El seleccionado se pinta con… | El hover sobre seleccionado usa…                 | Componentes                          |
| ----------------------------- | ------------------------------------------------ | ------------------------------------ |
| `vars.color.surface.active`   | `vars.color.surface.hoverActive`                 | DataGrid · Table · TransferList      |
| `ResolveVariant(...)`         | `resolved.backgroundHover`, por var del componente | Calendar · MonthPicker · NavLink · Pagination |

La segunda familia no necesita token nuevo: `ResolvedVariant` ya expone `backgroundHover`, que es
`Darken(base, 12)` para las recetas sólidas, y Button, ActionIcon y QuickAction ya lo consumen como
su peldaño de hover. El componente lo expone como una var más de su `<Nombre>.vars.css.ts`, con el
sufijo `Hover` sobre la var que ya usaba:

```ts
// Calendar.vars.css.ts
export const dayBg = createVar();
export const dayBgHover = createVar();

// Calendar.tsx
[dayBg]: resolved.background,
[dayBgHover]: resolved.backgroundHover,

// Calendar.css.ts
"&[data-selected='true'][data-hovered='true']": {
  background: fallbackVar(dayBgHover, vars.color.primary["600"]),
}
```

El `fallbackVar` mantiene la regla de ADR-088 de que la dirección viaja como var y no como cálculo:
si el consumidor no fija variante, cae al peldaño siguiente de la escala primaria.

### Cuándo NO es un caso

Dos componentes tienen selección y puntero y aun así quedan fuera. Merece la pena escribirlo porque
el barrido los señala y la corrección sería un error:

- **Un único resaltado que mueve el puntero.** `GlobalSearch` fija su índice activo en
  `onPointerMove`, así que ratón y teclado comparten estado: no hay dos estados que cruzar.
  `collections/option-list` hace lo mismo con `data-focused`, y además marca la selección con peso
  tipográfico, no con fondo.
- **La afordancia del activo no es el fondo.** `Nav` pinta un indicador móvil detrás del enlace
  activo y le pone el fondo a `transparent` a propósito; darle fondo de hover duplicaría la señal.

## Consecuencias

- Ocho componentes ganan respuesta de puntero sobre su elemento seleccionado. Tres corregían el
  fallo (b) de ADR-088 —el seleccionado se disfrazaba de no seleccionado—: `Carousel`, `Table` y
  `DataGrid`. En `Carousel` era el más visible: el punto actual pasaba de `primary.600` a gris al
  apuntarlo, porque `&:hover` empata en especificidad con `&[aria-current]` y venía después.
- `Calendar.vars.css.ts` gana `dayBgHover`, que consumen también `MonthPicker` y `YearPicker`;
  `NavLink` gana `activeBgHover`; `Pagination` gana `accentHover`.
- En `Pagination` el fondo activo es una píldora aparte con `layoutId`, así que la regla va sobre la
  píldora con el padre en el selector: `"[data-active='true']:hover:not(:disabled) &"`.
- El presupuesto de `NavLink` sube a 23.5 kB (122 B de exceso).
- Queda sin resolver, y anotado en el cuaderno de N5, que **`hover` y `active` valen lo mismo** en
  `nebula-dark` y `nebula-light`: hoy un elemento seleccionado y uno con el ratón encima son
  indistinguibles, así que el peldaño que este ADR reparte se apoya en una escalera con dos
  escalones iguales.

# ADR-201 — La rejilla simple tiene una celda que abarca

- **Estado**: **aceptada** · 2026-09-13 — decidida por el propietario · **implementada** el mismo
  día. Hallazgo 4 de C3 en Polaris (`docs/reviews/rosette-a-nebula-2026-09-12.md` §7).
- **Cambia API pública**: sí, y **solo añade**: `SimpleGrid.Cell` (`SimpleGridCell`) con `span` y
  `rowSpan`, y los tipos `SimpleGridCellOwnProps`, `SimpleGridCellProps`, `SimpleGridSpan` y
  `SimpleGridResponsive`. `SimpleGrid` se convierte en compuesto sin cambiar su firma.
- **Dependencias nuevas**: ninguna.
- **Toca**: `packages/web/src/components/SimpleGrid/` (`components/Cell.tsx` nuevo,
  `responsive-vars.ts` nuevo, `SimpleGrid.css.ts`, `SimpleGrid.vars.css.ts`, `SimpleGrid.types.ts`,
  `SimpleGrid.tsx`, `index.ts`, `SimpleGrid.md`, `__tests__/`), `src/index.ts`, `.size-limit.js`,
  la story `Layout/SimpleGrid › Mosaico con celda 2×2`.

## Contexto

`SimpleGrid` reparte columnas iguales y **los hijos no declaran nada**: ese es su contrato frente a
`Grid`, donde cada `Col` lleva su `span`. Al mosaico de verticales de Polaris le hace falta una
pieza que ocupe dos columnas y dos filas —la vertical principal, con las demás alrededor— y lo
resolvió como pudo: una clase propia en `verticals.css.ts` con `gridColumn: span 2` y `gridRow:
span 2` sobre un hijo cualquiera de la rejilla. Es CSS que conoce la estructura interna del
componente y que se rompe en cuanto el mosaico cambia de columnas por breakpoint, porque el `span`
del consumidor no sabe cuántas hay.

Cambiar a `Grid` no es respuesta: `Grid` es una fila flex de doce columnas y no tiene filas que
abarcar; el mosaico es una rejilla de verdad.

## Decisión

```tsx
<SimpleGrid cols={{ base: 2, laptop: 4 }} spacing="sm">
  <SimpleGrid.Cell span={2} rowSpan={2}>
    …
  </SimpleGrid.Cell>
  {rest}
  <SimpleGrid.Cell span={{ base: 2, laptop: 4 }}>…</SimpleGrid.Cell>
</SimpleGrid>
```

- `SimpleGrid.Cell` es un `Box` polimórfico (`component`, mismo patrón de tipos que
  `SimpleGridProps`) con `span` (columnas) y `rowSpan` (filas), los dos con **la misma forma que
  `cols`**: un número para todos los anchos o `{ base, phone, tablet, laptop, desktop, wide }`.
  Por defecto `1` y `1`.
- Se resuelve como `cols`: la celda publica inline sólo las vars de los breakpoints presentes y la
  hoja lleva horneada la cadena mobile-first de `fallbackVar` en cada `min-width` del token.
  `grid-column: span var(--span)` y `grid-row: span var(--rowSpan)`. Cero runtime, sin
  `"use client"`.
- La cadena de `@media` que `SimpleGrid.css.ts` escribía a mano para `cols` pasa a una función
  (`Cascade`) que sirve a las tres pistas, y `ColsVars` a `ResponsiveVars` en `responsive-vars.ts`,
  compartido por la raíz y la celda.
- Vive en `SimpleGrid/components/Cell.tsx` con símbolo `SimpleGridCell` y se compone con
  `Object.assign` en el `index.ts` (ADR-097); se exporta también suelto, como `GridCol`.
- Un `span` mayor que las columnas de ese ancho **desborda** (columnas implícitas). Se declara
  sobre los mismos breakpoints que `cols`; el componente no lo recorta, porque `min()` dentro de
  `span <integer>` no tiene el soporte que exige el catálogo.

## Alternativas

- **`Grid` con `Col span`**: es flex, no tiene filas; el mosaico 2×2 no se puede expresar.
- **Prop en el hijo vía `data-span`** leída por la rejilla con `globalStyle`: obliga a enumerar los
  valores posibles en la hoja y no da `rowSpan` responsive.
- **Dejarlo en el consumidor**: es lo que hace Polaris hoy y lo que motivó el hallazgo.

## Consecuencias

- `verticals.css.ts` de Polaris se queda sin `span` a mano; el mosaico declara `Cell span rowSpan`.
- `.size-limit.js` gana la entrada `SimpleGridCell` (`components/Cell.js`, 24 kB, el mismo tope que
  `SimpleGrid`); **queda por medir** con `size-limit` al construir. La entrada de `SimpleGrid` no se
  toca: la raíz sólo cambió el helper y la hoja tiene ahora dos clases.
- La refactorización de la cadena no cambia el CSS de `simple_grid`: mismas cinco consultas, mismos
  `fallbackVar` en el mismo orden.

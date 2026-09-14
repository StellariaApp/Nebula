# SimpleGrid

Rejilla de columnas iguales (`grid-template-columns: repeat(cols, minmax(0,1fr))`) con `cols` responsive, sin JS de resize ni `"use client"`.

## cols responsive sin media queries dinámicas

Los recipes de Vanilla Extract son estáticos: no se pueden generar media queries por valor en runtime. La solución es una **cadena mobile-first de `fallbackVar`** ya horneada en el CSS: `--sg-cols` se recalcula en cada breakpoint del token (`phone…wide`) como «este breakpoint si está definido, si no el anterior, … si no la base». El componente solo publica inline las variables de los breakpoints presentes (`--sg-cols-base` siempre, y `--sg-cols-tablet`, etc. si el consumidor los pasó); las ausentes degradan por la cadena.

Así `cols={{ base: 1, tablet: 2, laptop: 4 }}` funciona con CSS estático y cero runtime, y los breakpoints salen del token `breakpoints` (no hay px mágicos duplicados).

## `SimpleGrid.Cell` — la celda que abarca

ADR-201. La rejilla reparte columnas iguales y los hijos no declaran nada; un mosaico donde una
pieza ocupa dos columnas y dos filas —el de verticales de Polaris— acababa con `gridColumn: span 2`
escrito a mano en la hoja del consumidor. `SimpleGrid.Cell` es un `Box` con `span` (columnas) y
`rowSpan` (filas), los dos con la misma forma que `cols`: un número para todos los anchos o un
objeto por breakpoint desde `base`.

Se resuelve con la misma cadena de `fallbackVar` que `cols`: la celda publica inline sólo las vars
de los breakpoints presentes y el CSS estático recalcula `--span` y `--rowSpan` en cada `min-width`
del token. `grid-column: span var(--span)` y `grid-row: span var(--rowSpan)`.

Un `span` mayor que las columnas de ese ancho crea columnas implícitas y desborda: se declaran los
dos sobre los mismos breakpoints (`cols={{ base: 2, laptop: 4 }}` con
`span={{ base: 2, laptop: 2 }}`). Las celdas que no abarcan no necesitan envolverse en `Cell`.

# SimpleGrid

Rejilla de columnas iguales (`grid-template-columns: repeat(cols, minmax(0,1fr))`) con `cols` responsive, sin JS de resize ni `"use client"`.

## cols responsive sin media queries dinámicas

Los recipes de Vanilla Extract son estáticos: no se pueden generar media queries por valor en runtime. La solución es una **cadena mobile-first de `fallbackVar`** ya horneada en el CSS: `--sg-cols` se recalcula en cada breakpoint del token (`phone…wide`) como «este breakpoint si está definido, si no el anterior, … si no la base». El componente solo publica inline las variables de los breakpoints presentes (`--sg-cols-base` siempre, y `--sg-cols-tablet`, etc. si el consumidor los pasó); las ausentes degradan por la cadena.

Así `cols={{ base: 1, tablet: 2, laptop: 4 }}` funciona con CSS estático y cero runtime, y los breakpoints salen del token `breakpoints` (no hay px mágicos duplicados).

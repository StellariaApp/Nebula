# ADR-173 — El segmento puede envolverse en rejilla, con las mismas columnas que `SimpleGrid`

- **Estado**: **aceptada** · 2026-08-18 — decidida por el propietario
- **Cambia API pública**: sí, **aditivo**. `Segment.Control` gana `cols`. Nada existente cambia.
- **Toca**: `packages/web/src/components/Segment`.

## Contexto

`Segment` tenía dos formas de tratar lo que no cabe: `overflowMode="scroll"`, que lo empuja fuera de
la vista, y `overflowMode="wrap"`, que lo dobla en filas de ancho libre. Con catorce opciones —el
selector de temas de la landing— ninguna de las dos sirve: la primera esconde la mitad y la segunda
deja filas de longitud desigual, con la última a medio llenar.

Lo que hacía falta era una rejilla, y `SimpleGrid` ya la sabe hacer. Meter el segmento dentro de un
`SimpleGrid` no vale: el indicador se posiciona contra el contenedor del control, así que un
envoltorio por en medio lo descoloca.

La primera versión pasó las columnas por `style` desde el consumidor. No funciona: `createVar()`
devuelve `var(--x)`, que no es una clave válida de `style`, y la rejilla salía siempre a una columna.

## Decisión

`Segment.Control` gana **`cols?: SimpleGridCols`** — el mismo tipo que `SimpleGrid`, un número o un
objeto por punto de ruptura (`base`, `phone`, `tablet`, `laptop`, `desktop`, `wide`).

```tsx
<Segment.Control aria-label="Product theme" cols={{ base: 2, tablet: 4, laptop: 6, desktop: 8 }} />
```

Tres consecuencias de la forma en que se implementa:

1. **Las columnas viajan por `assignInlineVars`**, igual que en `SimpleGrid`, no por `style` crudo.
   Es la única manera de escribir una var de Vanilla Extract desde el consumidor.
2. **La cascada la resuelve el CSS**, con `fallbackVar` encadenado punto de ruptura a punto de
   ruptura. Un objeto incompleto —`{ base: 2, desktop: 8 }`— hereda hacia arriba sin que el
   componente calcule nada en JS.
3. **`cols` implica varias filas**, así que activa el mismo camino que `overflowMode="wrap"` para
   que el indicador siga el eje Y. No hay que declarar las dos cosas.

## Alternativas

**Reutilizar `overflowMode` con un valor `"grid"`.** Se descarta: el modo dice qué hacer con lo que
sobra y esto dice cuántas columnas hay. Además haría falta la prop de columnas igual.

**Pasar las columnas por `style` desde fuera.** Es lo que se probó primero y no funciona, por lo
dicho en el contexto.

**Un `gridColumns` propio en vez de reutilizar `SimpleGridCols`.** Se descarta por lo mismo que se
comparten los puntos de ruptura: dos vocabularios de rejilla en la misma librería es exactamente la
divergencia que el contrato existe para evitar.

## Consecuencias

- Aditivo: sin `cols`, `Segment.Control` se comporta exactamente igual que antes.
- El indicador se mueve en dos ejes cuando hay rejilla. **No se excluye de la rejilla**: es un
  hermano posicionado en absoluto, no una celda, así que no cuenta como columna.
- `Segment` queda con dos props que hablan de lo mismo desde ángulos distintos —`overflowMode` y
  `cols`—. Se acepta: la primera es una política y la segunda una forma.

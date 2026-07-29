# ADR-041 — `variant` significa receta cromática: renombrado de los ejes de Divider y Loader

- **Estado**: **propuesta** · 2026-07-28 (checkpoint de la auditoría WV)
- **Precondición de**: [ADR-038](ADR-038-variantes-de-superficie-por-subconjunto.md).
- **Auditoría de origen**: `docs/reviews/variantes-cobertura-2026-07-28.md` §0.1 y §3.5.

## Contexto

De los seis componentes que declaran un prop `variant`, dos no expresan una receta de color:

- `Divider.variant: "solid" | "dashed" | "dotted"` (`Divider.types.ts:8`) es **`borderStyle`**.
- `Loader.variant: "spinner" | "dots" | "bars"` (`Loader.types.ts:4`) es **la forma de la animación**.

Ninguno tiene relación con `variantMap`, con `color`, ni con el effects budget de `docs/06` §6. Ocupan
el nombre `variant` en el catálogo y hacen que «6 de 68 componentes tienen variantes» sea engañoso para
quien lea el índice de API: dos de esos seis hablan de otra cosa.

El problema no es cosmético. ADR-038 fija que `variant` es un subconjunto de `Variant` resuelto contra
`theme.variantMap`. Con Divider y Loader como están, esa regla admite dos excepciones que solo se
pueden explicar caso por caso, y cualquier lint de paridad W/N que intente verificarla tiene que
mantener una lista de exclusiones.

Precedente directo: ADR-026 eliminó `SegmentedControl` porque «mantener dos componentes para lo mismo
solo duplicaba superficie de API». Aquí es el caso simétrico — un mismo nombre para tres cosas
distintas.

## Decisión

1. **`variant` queda reservado, en todo el catálogo, a la receta cromática del contrato.** Un prop que
   no se resuelva contra `theme.variantMap` no se llama `variant`.

2. **Renombrados**:

   | Componente | Antes                                    | Después                                      |
   | ---------- | ---------------------------------------- | -------------------------------------------- |
   | Divider    | `variant: "solid" \| "dashed" \| "dotted"` | `lineStyle: "solid" \| "dashed" \| "dotted"` |
   | Loader     | `variant: "spinner" \| "dots" \| "bars"`   | `type: "spinner" \| "dots" \| "bars"`        |

   `lineStyle` nombra la propiedad CSS que expresa (`borderStyle`) sin colisionar con la style prop
   homónima; `type` es el nombre que ya usa `Progress` para el mismo eje —elegir entre formas del mismo
   componente (`Progress.types.ts`)— y `List` para el suyo, de modo que no introduce vocabulario nuevo.

3. **Ninguno de los dos adopta `variant` cromático.** Un Divider es una línea de un rol de borde
   (`color: BorderRole`) y un Loader es un indicador de una escala semántica (`color:
   SemanticScaleName`); ninguno pinta fondo, primer plano y borde a la vez, que es la condición de
   ADR-038 regla 1. Sus budgets se quedan en 12 kB (ADR-039 consecuencias).

4. **Se hace ahora.** Los paquetes siguen `private: true` y sin consumidores externos, la misma
   ventana que ADR-032 aprovechó para ampliar 47 contratos: «este es el momento de menor coste posible
   y no se repetirá».

## Alternativas

- **Dejarlo como está y documentar la excepción**: cero cambios de API, a cambio de que la regla de
  ADR-038 nazca con dos excepciones y de que el lint de paridad W/N mantenga una lista de exclusiones.
  Rechazada.
- **Absorber los dos ejes en `Variant`** añadiendo `solid`/`dashed`/`dotted`/`spinner`/`dots`/`bars` a
  la unión: rechazada de plano. Son seis miembros nuevos que obligarían a los cuatro temas oficiales y
  a todo tema de tenant a definir una `VariantRecipe` de color para «punteado» y para «spinner», que no
  significan nada como receta de color. Es el error que la auditoría WV existe para evitar.
- **Renombrar solo Divider**, dejando `Loader.variant`: `spinner|dots|bars` se parece más a una
  variante visual que `solid|dashed|dotted`, pero sigue sin ser una receta cromática y sigue rompiendo
  la regla. Rechazada por arbitraria.
- **`Divider.dashed`/`Divider.dotted` como booleanos**: evita el prop nuevo, pero permite el estado
  imposible de ambos a la vez. Rechazada.

## Consecuencias

- **Cambio incompatible de API en dos componentes.** Es el único de los ADRs de esta auditoría que no
  es aditivo. No hay consumidores externos; dentro del repo afecta a las stories de
  `apps/playground-web` y a los tests de ambos componentes, que se migran en el mismo PR.
- **Coste de bundle cero**: es un renombrado de prop, sin lógica nueva.
- **Native hereda los nombres** (`@stellaria/nebula-native`, N1), cubierto por el lint de paridad W/N.
  La semilla Stellaria expone `variant` en su Divider y su Loader, de modo que la migración de N1 debe
  aplicar el renombrado en lugar de portar el nombre.
- Tras este ADR, la afirmación verificable del catálogo pasa a ser **«todo `variant` es un subconjunto
  de `Variant` resuelto contra `variantMap`»**, comprobable con un lint en vez de con una lista.
- `docs/00-inventory.md` y las fichas de API de Divider y Loader se actualizan en el mismo PR.

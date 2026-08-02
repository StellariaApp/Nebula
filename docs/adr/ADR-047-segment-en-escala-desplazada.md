# ADR-047 — Segment y Tabs en la escala `control` desplazada

- **Estado**: **aceptada** · 2026-07-29 (checkpoint de G1.1; decisión del propietario)
- **Análisis de origen**: `docs/reviews/geometria-figma-vs-nebula-2026-07-28.md` §2.2 y §6 (G1.1).

## Contexto

`docs/06` §4.1 ya fija la regla, y con su consecuencia explícita:

> **Lo interactivo va en `control`, aunque parezca compacto.** Los items de una paginación son
> objetivos táctiles: usan `control` desplazada un peldaño […] Es también la razón de que Pagination
> no ofrezca `xs`: por debajo de `control.xs` no hay peldaño.

`Pagination` la implementa: `sm`→`control.xs`, `md`→`control.sm`, `lg`→`control.md`, `xl`→`control.lg`,
y estrecha su unión a `PaginationSize = "sm" | "md" | "lg" | "xl"`.

**`Segment` no.** Mapea directo —`md`→`control.md`— y queda en 42 px, el componente más alto de su
clase. La comparación con el archivo de diseño lo señala como la diferencia estructural más grande del
catálogo: el Figma resuelve el mismo control con una píldora de 25 px dentro de un contenedor de 33.

`Segment` es un `radiogroup` o un `tablist`: sus items son objetivos táctiles, así que `sizes.compact`
—la otra escala— le está vedada por la misma sección: «lo que la consuma no puede ser interactivo».

## Decisión

1. **`Segment` adopta la escala desplazada**, con el mismo mapeo que `Pagination`:

   | `size` | Antes        | Después      |  px |
   | ------ | ------------ | ------------ | --: |
   | `xs`   | `control.xs` | **retirado** |   — |
   | `sm`   | `control.sm` | `control.xs` |  30 |
   | `md`   | `control.md` | `control.sm` |  36 |
   | `lg`   | `control.lg` | `control.md` |  42 |
   | `xl`   | `control.xl` | `control.lg` |  50 |

2. **`SegmentSize = "sm" | "md" | "lg" | "xl"`**, declarado en `Segment.types.ts` con la misma forma
   que `PaginationSize`. `SegmentContextValue.size` lo consume en lugar de `Size`.

3. **`Tabs` lo hereda.** Es un atajo sobre `Segment` (`docs/00-inventory.md`), de modo que su prop
   `size` pasa a `SegmentSize`. Si no lo hiciera, `Tabs size="xs"` compilaría y reventaría en el
   `recipe`.

4. **El contenedor y la píldora quedan en `full`** y el padding del contenedor pasa del literal `"3px"`
   a `space.xs` (4). Con `md` en 36 y 4 px de padding, la píldora interna queda en **28** —el diseño
   tiene 33 y 25—.

## Alternativas

- **Desplazar sin estrechar**, mapeando `xs` y `sm` ambos a `control.xs`: no rompe API, pero deja dos
  tamaños que rinden idénticos. Rechazada: un consumidor no debe elegir entre dos opciones
  indistinguibles.
- **Dejar el alto en 42**: cero cambio de API, y la píldora y el radio ya mejoran mucho el aspecto.
  Rechazada por el propietario en el checkpoint.
- **Usar `sizes.compact`** (20·24·28·32·36), que aterriza casi exacto sobre el diseño: prohibida por
  `docs/06` §4.1, porque `compact` no satisface el mínimo táctil y `Segment` es interactivo. Descartada
  antes de llegar al checkpoint.

## Consecuencias

- **Cambio de API pública, restrictivo**: `Segment size="xs"` y `Tabs size="xs"` dejan de compilar. Los
  paquetes siguen `private: true` y el único consumidor era la lámina `Segment.stories.tsx`, ya migrada.
- **El mismo `size` significa otra altura**: un `Segment md` pasa de 42 a 36 px y ahora alinea con un
  input `sm`, exactamente como una `Pagination md`. Es el efecto buscado y es coherente entre los dos
  componentes que aplican la regla.
- **No se toca `Size`**: la unión del contrato sigue con sus cinco miembros. Lo que se estrecha es la
  prop de dos componentes, no el vocabulario.
- **Invalida capturas previas de Segment y Tabs** — relevante para el baseline de ADR-037, que va
  después del tramo.
- **Queda una asimetría anotada, no resuelta**: `Segment` y `Pagination` desplazan; el resto del
  catálogo interactivo-pero-compacto no se ha auditado contra esta regla. Si aparecen más casos, la
  discusión es si `docs/06` §4.1 necesita una lista explícita en vez de dos precedentes.

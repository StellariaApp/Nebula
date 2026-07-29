# ADR-039 — Escalón de budget «primitivo temable con variantes en runtime»

- **Estado**: **aceptada** · 2026-07-28 (checkpoint de la auditoría WV; ejecutada junto a ADR-038 en
  el tramo V2+V3)
- **Enmienda**: [ADR-022](ADR-022-budget-primitivos-temables-runtime.md) y `docs/03` §3.
- **Precondición de**: [ADR-038](ADR-038-variantes-de-superficie-por-subconjunto.md).
- **Auditoría de origen**: `docs/reviews/variantes-cobertura-2026-07-28.md` §3.2.

## Contexto

ADR-038 hace que once componentes resuelvan su receta con `ResolveVariant` contra `theme.variantMap`.
La auditoría WV midió el coste marginal de ese import, en lugar de estimarlo: se compiló el mismo
módulo del `dist` con y sin él, con esbuild 0.28.1 (`--bundle --minify --format=esm --target=es2022`,
`react`/`react-dom` externos) y brotli q11.

```
a-badge              11.03 kB brotli      d-avatar             11.10 kB
b-badge-plus-rv      13.25 kB brotli      e-avatar-plus-rv     13.17 kB
c-rv-only             3.61 kB brotli      f-paper              10.46 kB
                                          g-paper-plus-rv      12.65 kB

delta sobre Badge : 2.21 kB      delta sobre Avatar: 2.07 kB      delta sobre Paper : 2.19 kB
```

**El delta real es +2,07–2,21 kB brotli**, consistente en tres componentes distintos, y no los ~6 kB
que se venían asumiendo: cualquier componente temable ya importa `theme/contract.css.js` y el contexto
de tema, de modo que lo único que se añade es la lógica de resolución más las `palettes` de tokens.

Aplicado sobre la medición completa de `pnpm --filter @stellaria/nebula-web size` —78 entradas, todas
en verde hoy—, seis componentes rebasan su límite:

| Componente | Medido |  Budget | Con `ResolveVariant` | Exceso |
| ---------- | -----: | ------: | -------------------: | -----: |
| Badge      |  11,57 |      12 |            **13,77** | +1,77  |
| Avatar     |  11,65 |      12 |            **13,85** | +1,85  |
| Divider    |  11,61 |      12 |            **13,81** | +1,81  |
| Loader     |  11,41 |      12 |            **13,61** | +1,61  |
| Paper      |  10,90 |      12 |            **13,10** | +1,10  |
| Progress   |  12,21 |      14 |            **14,41** | +0,41  |

Y dos pasan sin margen útil: Card 21,64 / 22 y NavLink 20,95 / 21.

## Decisión

1. **Se introduce un escalón nuevo, no se sube el existente**: **primitivo temable con variantes en
   runtime ≤14,5 kB**. El escalón «primitivo temable en runtime ≤12 kB» de ADR-022 **se conserva
   intacto** para los primitivos que no adoptan `variant` —Group, Grid, GridCol, SimpleGrid, Container,
   Scroll, Space, AspectRatio, Mark, Blockquote, List, Skeleton, Radio—, que hoy miden 9,35–11,61 kB y
   seguirían con el gate vigilándolos de verdad.

   Es la forma exacta de ADR-022, que introdujo un sub-budget en lugar de relajar el de 9 kB. Subir el
   escalón entero a 14,5 dejaría a trece primitivos con ~3 kB de margen ocioso, y un budget con margen
   de sobra deja de señalar regresiones.

2. **El número sale de la misma regla que ADR-022**: headroom sobre el máximo proyectado. El máximo es
   Avatar con 13,85 kB; +0,7 kB de headroom —el mismo que ADR-022 dejó sobre Divider/Grid 11,3 para
   fijar 12— da 14,55, que se redondea a **14,5 kB**.

3. **Progress tiene entrada propia por encima del escalón** (bar + ring, 14 kB) y se recalibra a
   **16 kB**, medido 14,41.

4. **Card y NavLink no se recalibran.** Card queda en 21,64 / 22 y NavLink en 20,95 / 21. Son excesos
   de un componente concreto, no del suelo compartido, y la regla de ADR-032 §7 se mantiene: se
   corrigen adelgazando el componente si aprietan, nunca subiendo su límite. Si al implementar ADR-038
   alguno rebasa, la salida es reducir su subconjunto de variantes, no levantar el budget.

5. **La recalibración se aplica en el mismo PR que ADR-038 y con la medición pegada**, entrada por
   entrada, en la tabla que `docs/03` §4.5 exige publicar en el PR.

## Alternativas

- **Subir el escalón de ADR-022 de 12 a 14,5 kB** para todos: una regla menos que explicar, a cambio de
  vaciar el gate para trece primitivos que no cambian. Rechazada por el mismo motivo por el que ADR-032
  §6 rechazó excluir el runtime de sprinkles: un budget que nadie puede rebasar no es un gate.
- **No recalibrar y adelgazar `ResolveVariant`** hasta que quepa en 12 kB: sería lo ideal, pero el
  módulo aislado ya pesa 3,61 kB con `palettes` incluidas y el margen disponible es de 0,35 kB en
  Avatar. No hay 1,9 kB que recortar sin retirar el modo plano de ADR-021. Rechazada por inviable, no
  por indeseable.
- **Variantes zero-runtime** para los primitivos del escalón de 12 kB: 0 kB, pero pierde `variantMap`.
  Ya rechazada en ADR-038.
- **Excluir `ResolveVariant` de los budgets por módulo**, como ADR-032 §6 hizo con la hoja atómica:
  rechazada. La hoja atómica es CSS que la app descarga una sola vez; `ResolveVariant` es JS que viaja
  en cada módulo que lo importa, igual que el runtime de sprinkles, que sí se sigue contando.

## Consecuencias

- `docs/03-a11y-motion-performance.md` §3 gana el escalón nuevo en su tabla de budgets y una nota de
  revisión fechada, en la línea de las tres que ya tiene (W1.4, ADR-022, ADR-032).
- `packages/web/.size-limit.js` recalibra seis entradas. **Divider y Loader no adoptan `variant`**
  (ADR-041 renombra sus ejes), de modo que su presencia en la tabla del contexto es proyección, no
  cambio: se quedan en 12 kB.
- Las entradas que sí suben a 14,5 son Badge, Avatar y Paper; Progress sube a 16. Card, Segment, Tabs,
  NavLink, Pagination, Toast y Alert absorben el delta dentro de su límite actual.
- El escalón nuevo **no es una licencia**. Un primitivo que adopte `variant` y aun así rebase 14,5 kB
  se adelgaza o reduce su subconjunto; la regla de ADR-032 §7 sigue vigente para el exceso individual.

## Ejecución (2026-07-28, tramo V2+V3)

Se recalibró **una sola entrada**, no las tres proyectadas, porque la medición corrigió la proyección
en dos puntos:

| Componente | Antes |  Proyectado | **Medido** | Budget      |
| ---------- | ----: | ----------: | ---------: | ----------- |
| Badge      | 11,57 |       13,77 |  **13,94** | 12 → **14,5** |
| Alert      | 30,44 |       32,64 |  **30,43** | 35 (sin tocar) |

**Alert no paga nada.** La proyección asumía +2,2 kB, pero Alert ya arrastraba `ResolveVariant` por su
cadena `ButtonClose → ActionIcon`, de modo que el import ya estaba en su grafo. Es un recordatorio de
que el delta de +2,07–2,21 kB solo aplica a módulos que **no** dependan ya de un componente de acción;
Card, Toast y NavLink habrá que medirlos uno a uno en V4/V5 en vez de proyectarlos.

Badge midió 13,94 frente a los 13,85 proyectados —0,09 kB de diferencia—, así que el escalón de 14,5 kB
conserva 0,56 kB de holgura, del orden del que ADR-022 dejó sobre su máximo.

Paper, Avatar y Progress **no se recalibran todavía**: no adoptan `variant` hasta V4 y subir su budget
antes de que lo necesiten dejaría el gate sin señal durante todo el tramo intermedio.

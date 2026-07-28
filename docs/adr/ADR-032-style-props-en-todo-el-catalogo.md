# ADR-032 — Style props en todo el catálogo y condiciones responsive

- **Estado**: aceptada · 2026-07-28 (decisión del propietario en el checkpoint de auditoría de código y diseño)
- **Contexto**: `utils/style-props.ts` define `StyleProps` y `ExtractStyleProps`, y `Box.css.ts`
  construye el sprinkles que las respalda. La función `ExtractStyleProps` se invoca **en un solo
  componente**: `Box`. Otros 20 las heredan por tipo, porque extienden `BoxOwnProps` y delegan el
  render en `Box`. Los **47 restantes no las aceptan**, entre ellos Button, Card, ActionIcon, Badge,
  Alert, Modal, Menu y todos los inputs.

  El código de producto que Nebula debe sustituir está escrito sobre la ergonomía contraria: en
  `fonicredito-app` cada componente pasa por un `collector.ts` que recoge
  `p/m/w/h/c/fz/fw/r/gap/self/shrink/lh` y los proyecta a variantes de Unistyles; en `tfv-frontend`
  las props de estilo de Mantine están disponibles en todo el catálogo. Sin style props en los
  componentes interactivos, cada uso de producto necesita un envoltorio.

  Además, `defineProperties` se llama una única vez en `Box.css.ts`, como `UNRESPONSIVE`, sin
  `conditions`. El tema publica cinco breakpoints que **ninguna style prop consume**. El coste de esa
  ausencia es medible en la referencia: el `Button` de tfv expone `auto`, `responsive` e `inverted` y
  su hoja de estilos las implementa con seis clases; son un parche por componente a una capacidad que
  falta en el sistema de estilos.

## Decisión

1. **Todo componente del catálogo acepta `StyleProps`.** Su tipo de props extiende `StyleProps` —
   directamente o vía `BoxOwnProps`— y su implementación aplica `ExtractStyleProps` antes de componer
   `className`.

2. **Precedencia.** La style prop del consumidor gana siempre a la decisión interna del componente.
   El mecanismo es el que ya fija `docs/patterns/web-component-template.md` §2: la clase base vive en
   `baseLayer` y la clase atómica de sprinkles queda sin capa. **Precondición**: los 8 componentes con
   estilos base fuera de capa —AspectRatio, ButtonGroup, Grid, Group, Scroll, SimpleGrid, Space,
   VisuallyHidden— se migran a `baseLayer` **antes** de ampliar nada. Hoy su comportamiento lo decide
   el orden de emisión del bundler.

3. **Sin colisión de nombres.** Una style prop no puede ocultar una prop existente del componente. El
   conjunto actual no colisiona —los atajos son `p`, `m`, `w`, `c`, `fz`, `r`, `gap`, `self`… y las
   props de componente son `size`, `variant`, `color`, `radius`, `shadow`—, y esa separación pasa a ser
   norma: `StyleProps` no incorporará jamás las claves `size`, `variant`, `color`, `radius`, `shadow`
   ni `padding` sin abreviar.

4. **Sprinkles pasa a ser responsive** con los cinco breakpoints del tema:
   `phone` 576 · `tablet` 768 · `laptop` 1024 · `desktop` 1280 · `wide` 1536. Se define una condición
   `base` sin media query, más una condición por breakpoint en `min-width`, con `defaultCondition:
"base"`. La forma de consumo es la de sprinkles: `p={{ base: "md", tablet: "lg" }}`.

5. **Alcance de lo responsive.** Solo son responsive las propiedades donde el ancho cambia una
   decisión de composición: espaciado, dimensión, display, flex, grid, alineación, `textAlign` y
   `fontSize`. Color, sombra, radio y `zIndex` quedan en una sola condición. Esto acota el CSS
   generado sin perder ningún caso real de tfv ni de foni.

6. **Los budgets de `size-limit` se recalibran en el mismo tramo** que introduce las condiciones, con
   el delta anotado en el PR. Si el coste real excede lo previsto, la corrección es reducir el número
   de condiciones —no subir los budgets.

## Alternativas

- **Dejarlo como está** (solo los 21 primitivos de layout): rechazada. Es más estricto y más ligero,
  pero traslada el coste a cada app consumidora en forma de envoltorios, que es exactamente el
  problema que Nebula existe para eliminar.
- **Solo layout y spacing en los 47** (`m*`, `w`, `maw`, `grow`, `shrink`, `self`), sin color ni
  tipografía: rechazada. Es un punto medio defendible, pero deja fuera `fz` y `c`, que son dos de los
  atajos más usados en foni, y obliga a explicar una frontera arbitraria en cada componente.
- **Responsive con una sola condición** en lugar de cinco: rechazada. Cubre lo que hoy ejercitan tfv y
  foni, pero congela el sistema en el patrón que esos repos adoptaron _por carecer_ de breakpoints, en
  vez de darles el que necesitaban.
- **Props parche por componente** al estilo `auto`/`responsive`/`inverted` de tfv: rechazada
  explícitamente. Multiplica el contrato de cada componente para resolver localmente un problema del
  sistema de estilos.

## Consecuencias

- **Ampliación de API pública en 47 componentes.** Es aditiva: no rompe ningún uso existente. Los
  paquetes están `private: true` y sin consumidores externos, de modo que este es el momento de menor
  coste posible y no se repetirá.
- **El CSS atómico crece** por el número de condiciones. Se contiene limitando lo responsive a las
  propiedades de la regla 5 y se verifica con `size-limit` en el mismo PR.
- **`baseLayer` deja de ser opcional.** Todo estilo base de un componente que acepte style props debe
  estar en capa. Pasa a ser punto obligatorio del checklist de
  `docs/patterns/web-component-template.md` §6 y se corrige el defecto latente de los 8 componentes.
- **Paridad con native.** `@stellaria/nebula-native` deberá exponer el mismo conjunto de atajos; el
  patrón `collector.ts` de fonicredito es la implementación de referencia para Unistyles. Queda como
  requisito de N1, cubierto por el lint de paridad W/N.
- `docs/patterns/web-component-template.md` §1 y §6 y `docs/01-architecture.md` §4 se actualizan en el
  mismo PR que implemente la decisión.

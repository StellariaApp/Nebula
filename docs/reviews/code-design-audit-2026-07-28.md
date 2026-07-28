# Auditoría de código y diseño — capa web

**Fecha**: 2026-07-28
**Alcance auditado**: `packages/web` (68 componentes), `packages/tokens`, `apps/playground-web`.
**Referencias de contraste**: `tfv-frontend/packages/components` y
`fonicredito-app/src/services/shared/components`, como fuente de patrones de consumo real.
**Naturaleza**: review. Las decisiones que de aquí salen viven en ADR-032 … ADR-037; este documento no
decide nada por sí mismo. ADR-030 y ADR-031 se aceptaron en paralelo por otra vía y no salen de aquí;
se cruzan con el plan en §5.

## 0. Veredicto

La base es sana: `pnpm turbo build typecheck lint test` cierra **29/29** y el catálogo respeta los
contratos que `docs/01`, `docs/02` y `docs/03` fijaron. Lo que esta auditoría encuentra no son roturas
sino **tres sistemas a medio cablear**: se construyó la maquinaria, se aplicó al piloto, y no se
propagó al resto del catálogo.

| Sistema             | Construido en          | Propagado a                 |
| ------------------- | ---------------------- | --------------------------- |
| Style props         | `utils/style-props.ts` | 1 componente de 68 (`Box`)  |
| Gramática de motion | `tokens/animation.ts`  | 0 componentes               |
| `baseLayer`         | `theme/layers.css.ts`  | 38 archivos `.css.ts` de 76 |

Ese patrón —maquinaria correcta, adopción parcial— explica mejor la sensación de "le falta algo" que
cualquier hallazgo estético aislado. Las dos reviews previas ya lo detectaron en la capa de elevación
(sombras dark) y lo corrigieron; aquí aparece en style props, motion y capas de CSS.

## 1. Hallazgos — estructura y código

### A1 · Las style props existen para un solo componente · **P0**

`ExtractStyleProps` se invoca únicamente en `Box.tsx`. Los otros 67 componentes importan de
`utils/style-props.js` solo el helper `cx`.

Por herencia de tipos hay **21 componentes** que sí las aceptan, porque extienden `BoxOwnProps` y
delegan el render en `Box`: AspectRatio, Blockquote, Box, ButtonGroup, Center, Code, Container,
Divider, Flex, FormField, Grid, Group, List, Mark, Paper, Scroll, SimpleGrid, Space, Text, Title,
VisuallyHidden.

Los **47 restantes no las aceptan**, y son justamente los de uso más frecuente: Button, Card,
ActionIcon, Badge, Alert, Modal, Menu, Popover, Tooltip y todos los inputs. Un `<Button mt="md">` no
compila; hay que envolverlo.

Contraste con los repos de referencia: en fonicredito cada componente pasa por un `collector.ts` que
recoge `p/m/w/h/c/fz/fw/r/gap/self/shrink/lh`, y en tfv las props de estilo de Mantine están
disponibles en todo. Es la ergonomía sobre la que está escrito el código de producto que Nebula debe
sustituir.

→ **ADR-032**.

### A2 · Style props sin responsive · **P1**

`Box.css.ts` llama a `defineProperties` una sola vez, como `UNRESPONSIVE`, sin `conditions`. El tema
publica cinco breakpoints (`phone` 576 … `wide` 1536) que ninguna style prop consume.

El coste de esa ausencia es visible en la referencia: el `Button` de tfv tiene props `auto`,
`responsive` e `inverted`, y `index.css.ts` las implementa con seis clases
(`button_responsive`, `_inverted`, `_force`, y los tres equivalentes para label y section). Son un
parche a la falta de condiciones responsive en el sistema de estilos, replicado por componente.

→ **ADR-032**.

### A3 · `baseLayer` aplicado a la mitad, con un defecto latente · **P1**

38 de los 76 archivos `.css.ts` usan `baseLayer`. Descontando los `*.vars.css.ts` —que solo declaran
`createVar()` y no necesitan capa— quedan **8 componentes con estilos base sin capa que además aceptan
style props**: AspectRatio, ButtonGroup, Grid, Group, Scroll, SimpleGrid, Space y VisuallyHidden.

Esto no es cosmético. El contrato de `docs/patterns/web-component-template.md` §2 se apoya en que el
CSS sin capa gana al CSS con capa: sprinkles queda sin capa, la clase base entra en `nebula.base`, y
por eso la style prop del consumidor prevalece. En estos 8 componentes **ambas clases están sin capa**,
con la misma especificidad (una clase), de modo que el ganador lo decide el orden de emisión del
bundler y no el contrato.

Caso concreto: `Group.css.ts` fija `display: flex` y `flexDirection: row` fuera de capa, y `Group`
acepta `display` y `direction` como style props. `<Group direction="column">` depende hoy del orden de
las hojas, no de una regla. La plantilla ya advierte que este fallo es invisible en revisión de código.

### A4 · Anillo de foco duplicado, con dos idiomas · **P1**

`vars.color.border.focus` aparece en 13 archivos, cada uno reescribiendo el anillo, y con dos
tratamientos incompatibles:

- **outline exterior**: `outline: 2px solid` + `outlineOffset: 2px` — 12 archivos.
- **anillo interior**: `boxShadow: 0 0 0 2px` — `styles/field.css.ts`.

Un formulario que alterna inputs y botones muestra dos geometrías de foco distintas. La review del
2026-07-21 ya propuso un `styles/focus.css.ts` compartido como P2; no se creó.

→ **ADR-036**.

### A5 · `LazyMotion` repetido 15 veces, con features mezcladas · **P1**

Quince componentes montan su propio `<LazyMotion>`: Accordion, ActionIcon, Button, Card, Collapse,
EmptyState, Image, NavLink, Pagination, Segment (×2), Switch, Toast, Transition y `overlay-motion`.
Trece cargan `domAnimation` y **dos cargan `domMax`** (Switch y `Segment/Control`). Una vista que
combine un Switch con cualquier botón carga los dos paquetes de features.

→ **ADR-034**.

### A6 · La física del spring se copia a mano · **P1**

Hay **13 bloques `type: "spring"`** repartidos en 12 archivos, cada uno desestructurando
`{ stiffness, damping, mass }` del tema y repitiendo el ternario de reduced-motion. No existe helper.

→ **ADR-034**.

### A7 · Reduced-motion cubierto a un sexto, y con dos idiomas · **P1**

Solo **13 de 76** archivos `.css.ts` declaran `prefers-reduced-motion`, repartidos entre
`transitionDuration: "0.01ms"` (9 usos) y `transitionProperty: "none"` (3 usos). `docs/03` exige el
tratamiento en todo lo que anima.

→ **ADR-034**.

### A8 · `Card` contradice la plantilla canónica · **P2**

[Card.tsx:97-98](../../packages/web/src/components/Card/Card.tsx#L97-L98) usa `whileHover` y
`whileTap`. La plantilla §Capa 3 lo prohíbe de forma explícita: _"el press se deriva del `isPressed`
de React Aria, no de `whileTap` — una sola fuente de verdad de la interacción"_. Es el único
componente que lo hace.

## 2. Hallazgos — diseño y pixel

### B1 · Tres escalas de tamaño bajo los mismos cinco nombres · **P0**

| Escala          |  xs |  sm |  md |  lg |  xl | Origen                        |
| --------------- | --: | --: | --: | --: | --: | ----------------------------- |
| `sizes.control` |  30 |  36 |  42 |  50 |  60 | token, tematizable            |
| Badge           |  16 |  20 |  24 |  28 |  32 | `rem` literal en el `.css.ts` |
| Pagination      |  24 |  28 |  32 |  40 |  48 | `rem` literal en el `.css.ts` |

Dos consecuencias distintas:

1. **Alineación**: una barra de paginación `md` (32 px) junto a un botón `md` (42 px) no comparte eje.
   El mismo nombre entrega tres alturas.
2. **Tematización**: al estar horneadas en `rem`, ningún tema puede recalibrar Badge ni Pagination. Es
   una fuga del principio de `docs/02` — la personalización ocurre exclusivamente vía tema.

Que Badge sea más bajo que un control es correcto; que lo sea mediante literales fuera del contrato,
no.

→ **ADR-033**.

### B2 · El peso del label de control no está gobernado · **P1**

`docs/06` §2 fija: los labels de control usan `semibold` y `lineHeight.normal`.

| Componente                                         | `fontWeight` declarado |
| -------------------------------------------------- | ---------------------- |
| Button · Badge · Alert                             | `semibold` ✓           |
| Accordion · label de `field`                       | `medium`               |
| Segment · NavLink · Pagination · Menu · ActionIcon | **ninguno** (hereda)   |

Cinco componentes interactivos dejan el peso a la herencia. En una composición real, los items de un
Segment se ven más ligeros que el Button contiguo a la misma altura.

### B3 · Misma altura, distinta tipografía · **P1**

A 42 px de alto (`md`): Button usa `font.size.button` (14 px); Segment usa `font.size.body1` (16 px).
Ambos son labels de control según `docs/06` §2. `field` usa también `body1`, pero ahí es texto de
valor y 16 px está justificado —evita el zoom automático de iOS—, así que el desalineado real es
Segment.

### B4 · Unos treinta valores fuera del sistema · **P2**

`2.75rem` (Accordion), `2.25rem` (NavLink), `12rem` (Menu `minWidth`), `2rem` (`option-list`, Menu),
`3px` (Blockquote, NavLink, Segment), `8px` (flecha de Popover y de Tooltip), `5px` (FieldError),
`1rem` (`Toast` EDGE, MultiSelect). Ninguno es tematizable y varios definen geometría percibida.

## 3. Hallazgos — animación

### C1 · La gramática de motion está escrita y nadie la usa · **P0**

`packages/tokens/src/tokens/animation.ts` define un vocabulario completo. Usos en `packages/web`:

| Token                                                        |  Usos |
| ------------------------------------------------------------ | ----: |
| `motion.transition.*` (interaction · layout · overlay)       | **0** |
| `motion.transforms.*` (scalePress · liftHover · fadeSlideUp) | **0** |
| `motion.keyframes.*` (fadeIn · fadeSlideInUp · pulseSoft)    | **0** |
| `easing.emphasized`                                          | **0** |
| `easing.accelerate`                                          | **0** |
| `duration.instant`                                           | **0** |
| `duration.slow`                                              | **0** |
| `easing.standard`                                            |    26 |
| `duration.fast`                                              |    12 |

En su lugar, cada componente reescribe `transitionProperty` a mano: hay **13 listas de propiedades
distintas** en el catálogo. La consecuencia no es de peso de bundle, es de percepción: no existe una
coreografía compartida, sino cuarenta y siete decisiones locales que casualmente comparten duración.

### C2 · Una sola duración y una sola curva para toda la interacción · **P1**

Prácticamente todo hover y press resuelve en `duration.fast` (120 ms) con `easing.standard`. La curva
con rebase —`emphasized`, `cubic-bezier(0.34, 1.56, 0.64, 1)`— está definida y no se usa en ningún
sitio. Es precisamente la curva que produce la sensación de materialidad que se busca.

### C3 · Los overlays entran y salen igual · **P1**

En `overlay-motion.tsx`, `exit={phase.from}` con **el mismo spring que la entrada**, y los cinco
overlays —Modal, Popover, Menu, Drawer, Tooltip— comparten `spring.default`. Dos problemas de oficio:

- Una salida que dura lo mismo que su entrada se percibe lenta: al cerrar, el usuario ya decidió.
- Un tooltip y un modal no pueden compartir física. El `preset` actual solo cambia la transformada
  (`scale`, `fade`, `slide-up`, `slide-down`), nunca la física.

`spring.gentle` tiene 3 usos y `spring.snappy` **uno**.

### C4 · Sin orquestación · **P2**

`staggerChildren` y `delayChildren`: **0 usos**. Menús, listas de opciones, toasts y celdas de grid
aparecen en bloque. Es la diferencia más barata y más perceptible entre "correcto" y "cuidado".

### C5 · Todo es spring, incluso lo que no debería · **P2**

**0 usos** de `type: "tween"`. Una opacidad pura animada por spring gasta física en algo que no tiene
masa; para fades, un tween con `decelerate` es más predecible y más corto.

## 4. Decisiones del propietario (checkpoint 2026-07-28)

| #   | Decisión                                                                                        | ADR     |
| --- | ----------------------------------------------------------------------------------------------- | ------- |
| 1   | Style props se extienden a **todo el catálogo**                                                 | ADR-032 |
| 2   | Con **responsive por los 5 breakpoints** del tema                                               | ADR-032 |
| 3   | Nueva **escala tokenizada** para elementos no-control, en `NebulaTheme`                         | ADR-033 |
| 4   | **Capa de motion compartida completa**: asimetría, física por tipo, stagger, `LazyMotion` único | ADR-034 |
| 5   | **Convergir todo el conjunto** de ergonomía de tfv/foni                                         | ADR-035 |
| 6   | Anillo de foco **por `box-shadow`** en todo el catálogo                                         | ADR-036 |
| 7   | Gate de **screenshot diff** sobre láminas y composiciones                                       | ADR-037 |
| 8   | Entregable de esta sesión: **informe + ADRs, sin tocar código**                                 | —       |

## 5. Plan de ejecución propuesto

Siete tramos, cada uno cerrando con `pnpm turbo build typecheck lint test` en verde y, cuando toque
tokens o temas, con `pnpm check:contrast`. El orden no es negociable en sus tres primeros pasos: T1
es precondición de T2, y T2 lo es de todo lo demás.

| Tramo | Contenido                                                                                                                                  | ADR     | Depende de              |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------- | ----------------------- |
| T1    | `baseLayer` en los 8 componentes sin capa (A3). Es corrección de defecto, no refactor                                                      | —       | —                       |
| T2    | Sprinkles responsive con los 5 breakpoints; recalibrar budgets de `size-limit`                                                             | ADR-032 | T1                      |
| T3    | Style props en los 47 componentes restantes, por lotes de familia                                                                          | ADR-032 | T2                      |
| T4    | `styles/motion.css.ts` + helper de transición; `LazyMotion` único; idioma único de reduced-motion; asimetría y física por overlay; stagger | ADR-034 | —                       |
| T5    | `sizes` no-control en el contrato; Badge y Pagination migrados; pesos y tamaños de label (B2, B3); valores mágicos a tokens (B4)           | ADR-033 | —                       |
| T6    | `styles/focus.css.ts` y migración de los 13 archivos                                                                                       | ADR-036 | —                       |
| T7    | Convergencia de ergonomía de consumo                                                                                                       | ADR-035 | T3                      |
| T8    | Gate de screenshot diff sobre láminas y composiciones                                                                                      | ADR-037 | T4, T5, T6, **ADR-031** |

T4, T5 y T6 son independientes entre sí y pueden ir en cualquier orden. T8 va al final a propósito:
capturar el baseline antes de T4–T6 obligaría a regenerarlo tres veces.

### Cruce con el trabajo en curso

Durante esta sesión se aceptaron en paralelo **ADR-030** —el provider publica el contenedor de
portales de los overlays— y **ADR-031** —carga de la tipografía—. Ninguno entra en conflicto con lo
que aquí se decide, pero el segundo condiciona el plan: **T8 no puede ejecutarse antes de que ADR-031
esté implementado.** Capturar un baseline mientras el catálogo renderiza en la fuente de sistema
congelaría esa fuente en cada imagen del repositorio y convertiría el gate en la garantía de que el
defecto persiste.

Los tres hallazgos —portales sin tema, tipografía nunca cargada, y los tres sistemas a medio cablear
de este informe— comparten causa: **maquinaria construida y verificada por un gate que miraba a otro
sitio**. El decorator del playground pintaba el tema en `body`, así que axe veía overlays correctos; la
fuente de sistema es legible, así que ninguna aserción falló. Es el argumento más fuerte a favor de
ADR-037, y también la razón de ponerlo al final y no al principio.

## 6. Riesgos

1. **Volumen de CSS atómico (T2)**. Cinco condiciones responsive multiplican las clases generadas por
   sprinkles. Los budgets de `size-limit` —75 entradas hoy— se recalibran en el mismo tramo, con el
   delta documentado; si el coste real excede lo previsto, la salida es reducir condiciones, no
   levantar budgets en silencio.
2. **Superficie de API (T3 y T7)**. Se amplía el contrato público de 47 componentes y luego se le suman
   props de conveniencia. Los paquetes están `private: true` y sin consumidores externos: es el momento
   más barato posible para hacerlo, y no se repetirá.
3. **Estabilidad de los snapshots (T8)**. El renderizado de fuentes difiere entre Windows y CI.
   ADR-037 fija runner y umbral; sin eso el gate genera ruido en vez de señal.
4. **Paridad con native**. T2, T4 y T5 tocan contratos compartidos Web/Native. N1 hereda las tres
   deudas y debe cubrirlas con el lint de paridad.

## 7. Lo que esta auditoría confirma y no debe tocarse

- La arquitectura de tres capas —React Aria, Vanilla Extract, motion— y su reparto de
  responsabilidades. Ningún hallazgo la cuestiona.
- `ResolveVariant` y el `variantMap` en runtime: cero hex en componentes, verificado.
- La separación paletas → primitivas → roles → vars de componente.
- El testing contract: 68 de 68 con `__tests__`, y la suite estable tras la sesión del 2026-07-27.
- Las cinco láminas `Foundations/Visual QA` y el fixture Rosette, que ya demostraron su utilidad
  encontrando defectos reales de tematización.

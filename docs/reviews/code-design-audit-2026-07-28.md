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

### 5.1 Estado de ejecución (2026-07-28, cierre de T3)

Todo lo cerrado está en `main`. Cada commit cerró con `build · typecheck · lint · test · size` en
verde; el cierre del tramo añade `a11y` (55 suites, 338 tests).

| Tramo   | Estado      | Commits                                                                                                                                                         |
| ------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T1      | **cerrado** | `1b3da87`                                                                                                                                                       |
| T2      | **cerrado** | `1369c9a`                                                                                                                                                       |
| T3      | **cerrado** | `83ca70d` `00bb48d` `956ca9c` `f54e641` `3cd5fa8` `f3fac90` `efdeccb` `ed1fc58` `f4c8914` `292f558` `1bb107a` `d4f1dc4` + `cfdeeae` `07ba00b` (docs y enmienda) |
| T4      | **cerrado** | `7b95585` `e4d5098` `95d9f43` `32851e3` `11c85fd` + `f50802d` `867a016`                                                                                         |
| T5      | **cerrado** | `14cdbab` `745c06d`                                                                                                                                             |
| T6      | **cerrado** | `0b985ab`                                                                                                                                                       |
| T7 – T8 | sin empezar | —                                                                                                                                                               |

Doce lotes por familia. Los seis primeros son de la primera sesión; los seis últimos cierran el tramo:
Anchor y Highlight · Collapse y Transition · NavLink y Pagination · Modal y Toast · Select, Combobox y
MultiSelect · el compound de Segment y Tabs.

**Excluidos por no renderizar un elemento propio**: Conditional · Omit · Valid · Portal · FocusTrap ·
FileButton, y dentro del compound de Segment, `Control.Item` y `Content.Item` — devuelven `null` y solo
declaran datos que lee el padre. La consecuencia práctica está anotada en `Segment.md`: el panel de un
`Content.Item` se sigue estilando por su `className`.

**Tres correcciones al recuento de esta sección.** El censo original se hizo sobre las extensiones
directas de `BoxOwnProps` y sobre la suposición de que delegar implica heredar; ninguna de las dos se
sostiene:

- **Anchor y Highlight ya las aceptaban.** Extienden `TextOwnProps`, no `BoxOwnProps`, y delegan en
  `Text` → `Box`, que es quien llama a `ExtractStyleProps`. Highlight ya traía además resuelta la
  colisión de `color`. Se cerraron con tests, no con cambio de código (`efdeccb`).
- **Drawer hereda de Modal, pero Tabs no heredaba de Segment.** `DrawerProps` extiende `ModalProps` y
  el componente hace spread de `...modal_rest`; `TabsProps` era una interfaz cerrada que pasaba a
  `Segment` prop por prop, de modo que habría quedado como el único componente del catálogo sin style
  props. Corregido en `d4f1dc4`.
- El total real del tramo es **37 componentes**, no 36.

**Recalibración de `size-limit`.** Pagination pasó de 28,84 a 37,26 kB brotli contra un budget de
34 kB. El delta es +8,42 kB y es íntegramente el runtime de sprinkles: Transition subió +8,74 y
Collapse +8,79 en el mismo tramo por lo mismo. Los tres eran de los pocos módulos que no importaban
nada de `utils/style-props.js` —ni siquiera `cx`— y por tanto nunca lo habían arrastrado; su código
propio no crece. Es el suelo compartido subiendo, la misma forma que el escalón 9 → 9,5 kB de T2, y
Pagination era el último módulo del catálogo en esa situación. Budget recalibrado a **40 kB** por
decisión del propietario. Transition y Collapse siguen dentro de su budget de 48 sin tocarlo.

### 5.1.1 T4 — la capa de motion, en cinco lotes

Los tres contadores de C1–C5 quedan en cero: cero `type: "spring"` copiados a mano, cero
`transitionProperty` escritos por componente, cero `LazyMotion` fuera del provider y cero
`transitionDuration: "0.01ms"`. Los tokens que la auditoría midió sin usar —`easing.emphasized`,
`easing.accelerate`, `duration.instant`, `duration.slow`— entran todos en circulación.

El dato que no estaba previsto es el de peso. Mover el `LazyMotion` al provider **baja cada módulo con
motion ~18 kB brotli** y sube el provider de 18,48 a 52,83: `size-limit` contaba el paquete de features
una vez por módulo, la misma contabilidad que la regla 6 de ADR-032 corrigió para la hoja atómica. Se
recalibraron **34 entradas**, el provider hacia arriba y 33 módulos hacia abajo, porque un budget con
margen de sobra deja de señalar regresiones.

Tres decisiones de implementación que el ADR no fijaba:

- **Las transiciones se componen de `vars.motion.*`, no de las cadenas de `tokens/animation.ts`.** Esas
  llevan la duración y la curva ya resueltas, así que un tema que recalibrara `motion.duration` dejaría
  de repintar. Mismos nombres, misma semántica, tematizables.
- **`surface` y `preset` son dos props de `OverlayMotion`, no una.** El ADR las colapsa, pero Modal
  necesita transformadas distintas para la misma física —centrado escala, drawer desliza, pantalla
  completa funde— y las tres son física de modal.
- **La salida por tween acelerado se aplica a las seis superficies**, no solo a las cuatro que el ADR
  nombra: la regla 2 está escrita como invariante y un spring no tiene duración con la que cumplirla.

### 5.1.2 T5 — las dos escalas, en dos lotes

`ThemeSizes` gana `compact` y `vars.size` pasa a `vars.size.control.*` / `vars.size.compact.*`. Badge
sale de sus literales, Pagination pasa a `control` desplazada un peldaño, y B2, B3 y B4 se resuelven
con el censo corregido.

Dos correcciones al enunciado de los hallazgos, ambas encontradas al aplicarlos:

- **B2 contaba cinco componentes y son tres.** `ActionIcon` no tiene label —su `fontSize` dimensiona el
  icono—, así que es falso positivo. Y de los cuatro restantes solo Segment y Pagination son labels de
  control: Menu y NavLink son listas de texto, y ponerlas en `semibold` habría aplanado la jerarquía
  que `docs/06` §1 pide preservar. Pasan a `medium`, que gobierna el peso sin competir con el
  contenido.
- **La regla 4 de ADR-033 no cerraba el caso de `xs`.** Al desplazar cinco nombres un peldaño hacia
  abajo, `xs` se queda sin destino porque no hay peldaño bajo `control.xs`. Se retira del contrato de
  Pagination: los cuatro que quedan son distintos entre sí y superan el mínimo de 24 px de WCAG 2.2,
  mientras que el `xs` actual estaba justo en el límite que el propio ADR señala como riesgo.

La escala `compact` absorbe exactamente los dos `2rem` de Menu y `option-list`, que es señal de que el
peldaño estaba bien elegido. De B4 quedan fuera, a propósito, los `outlineOffset` —son el anillo de
foco y los unifica T6—, los hairlines de 1–3 px y las flechas de 8 px de Popover y Tooltip, que no
tienen peldaño en la rejilla de 4 px y tokenizarlos sería inventar escala.

### 5.1.3 T6 — el anillo de foco, y lo que su regla 4 no pagaba

`styles/focus.css.ts` sustituye las trece definiciones: `outline: 2px solid <halo>` con
`outline-offset: 4px`, y el tono en una var, de modo que el campo inválido conserva su anillo rojo sin
una segunda geometría.

**La geometría llegó ahí por dos correcciones sucesivas, ambas encontradas mirando la pantalla y no el
código**, y las dos enmiendan ADR-036 —ver su bullet de corrección—. Primero se implementó el anillo
de dos tonos por `box-shadow` que fijaba la regla 2. Sobre el `ButtonClose` de la cabecera de un Modal
apareció un cerco de color ajeno al fondo: el separador tenía por defecto el color del canvas y ese no
es el color de un overlay. Al hacerlo transparente desapareció el hueco entero, que es lo que destapó
el fondo del asunto: **un `box-shadow` con spread es una forma maciza**, y el hueco solo existe si una
capa interior opaca tapa el interior de la exterior. Es decir, `box-shadow` no puede dar un hueco
transparente, y ningún color de separador es correcto sobre todas las superficies.

`outline-offset` sí lo da, porque su hueco no se pinta. Y la premisa que había descartado `outline`
—que no respeta el `border-radius`— era falsa ya cuando se escribió el ADR: Chrome la cumple desde la
94, Firefox desde la 88 y Safari desde la 16.4. Con `outline` cae también la regla 6: el fallback de
`forced-colors` existía para compensar que `box-shadow` se descarta en alto contraste.

**La regla 4 queda a medias, a propósito.** Pide un disparador único, `data-focus-visible`, pero solo
tres archivos lo emiten hoy. Los otros diez se reparten en tres familias que no se convierten
escribiendo CSS: seis usan `:focus-visible` nativo sobre elementos sin React Aria —y en Accordion,
Pagination y Segment los botones se crean dentro de un `.map()`, así que un hook exige extraer un
componente hijo por item—, tres pintan el anillo en un hermano del input oculto, y `field` usa
`:focus-within` porque el foco cae en el `<input>` interior.

El helper es agnóstico al disparador, de modo que **la geometría sí queda unificada en los trece**, que
es el defecto que A4 denuncia y el único que el usuario percibe. La unificación de disparadores queda
como paso propio con su alcance ya medido —`useFocusRing` en seis componentes y cuatro
reestructurados—, y sin efecto visible: `:focus-visible` nativo y el de React Aria pintan en los mismos
momentos para un botón corriente. Decisión del propietario en el checkpoint de apertura del tramo.

### 5.2 Corrección pendiente de ADR-032 regla 3

La regla afirma que no hay colisión de nombres entre style props y props de componente. **Es falsa**.
Con T3 cerrado el censo está completo: son cuatro clases, y la tercera tiene dos resoluciones
distintas según si los valores del componente caben o no dentro del tipo de la style prop.

| Clase                                                             | Ejemplos                                                                                                                      | Resolución aplicada                                           |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Prop semántica de componente                                      | `color` en Button, ActionIcon, Badge, Alert, toggles, NavLink, Pagination, Segment, Tabs, Highlight; `shadow` en Card y Paper | omitir de `StyleProps`; queda el atajo `c`                    |
| Atributo HTML real                                                | `wrap` en `<textarea>` (hard/soft)                                                                                            | gana el atributo                                              |
| Propiedad CSS reutilizada con otra semántica, valores ajenos      | `position` en FieldError (`"bottom"`) y en ToastProvider (`"top-start"`…)                                                     | omitir de `StyleProps`; gana la prop del componente           |
| Propiedad CSS reutilizada con otra semántica, valores subconjunto | `padding` en Popover y Modal (`none\|sm\|md\|lg` ⊂ `SpacingName`)                                                             | la interfaz la estrecha; gana la prop, y `p` sigue disponible |
| Atajo que ya era prop del componente                              | `maw` en Tooltip                                                                                                              | gana la prop, aplicada tras el spread                         |

Afecta a cerca del 40 % del catálogo. **Regla 3 reescrita** con estas cuatro clases y su resolución, y
la corrección registrada en Consecuencias de ADR-032 con la forma que fijó ADR-028: la regla daba por
hecho que `StyleProps` no contenía `color`, `shadow` ni `padding`, cuando los contenía desde el día que
se aceptó — `createSprinkles` publica el nombre largo de cada propiedad además de su atajo, y el censo
original se hizo sobre la lista de atajos.

### 5.3 Decisiones de diseño tomadas al implementar

- **Inputs**: las style props se aplican al `FormField` raíz, no al `<input>` interno — `w="100%"` o
  `mt="md"` describen el campo, no la caja de texto. `className` sigue apuntando al input y
  `rootClassName` a la raíz.
- **Overlays**: el style de sprinkles se intercala entre el de React Aria —que posiciona— y el de la
  prop específica del componente, de modo que ninguna style prop pueda romper el posicionamiento.
- **Frontera con motion**: los componentes que renderizan `m.*` necesitan cast a `MotionStyle` y, con
  `exactOptionalPropertyTypes`, spread condicional del `style` (Card, EmptyState, Transition).
- **Raíz semántica vs. raíz visual**: cuando no coinciden, las style props van donde ya iba
  `className`, aunque eso deje alguna prop sin efecto. Pagination es el caso: van al `<nav>`, y `gap`
  no separa los controles porque el flex vive en el `<ul>` interior. `className` y las style props
  deben describir siempre el mismo nodo; abrir el espaciado será una prop propia del componente, no
  mover las style props a otro elemento.
- **Compound**: cada pieza aplica las suyas a su propio nodo (Segment, `Segment.Control`,
  `Segment.Content`, `Header`/`Footer`), de modo que la barra puede llevar `maw` sin que la raíz cambie
  de ancho.

### 5.4 Deuda abierta

1. **Los invariantes de las hojas `.css.ts` no tienen gate.** Verificarlos exige leer las fuentes: jsdom
   no resuelve capas y el plugin de vanilla-extract intercepta `.css.ts` incluso con `?raw`, de modo que
   `import.meta.glob` devuelve el módulo compilado. Se volvió a comprobar en T4 —una aserción escrita
   así pasa siempre y no vale nada— y se retiró antes de commitear. Sobre `.tsx` sí funciona, y ahí el
   gate existe y está acompañado de un test que verifica que el escaneo ve fuente real antes de afirmar
   nada. Su sitio es un paquete en `tools/` como `check:contrast`, lo que es cambio estructural y pide
   ADR propio. **Ahora vigila dos invariantes, no uno**: `baseLayer` obligatorio y cero transiciones
   escritas a mano. La alternativa barata es añadir `@types/node` para leer del disco desde vitest —tres
   líneas de test— y eso también es dependencia nueva con ADR.
2. **`XImpl` → `XComponent`** (commit `193d974`, recuperado de la sesión paralela) dejó en cada archivo
   la constante con el mismo nombre que la interfaz que la tipa:
   `export const Anchor = AnchorComponent as unknown as AnchorComponent;`. Compila, pero el nombre
   `Impl` era justo lo que distinguía implementación de contrato público.
3. **`ToastProvider` no expone `className`.** Acepta style props pero no la clase del consumidor, que
   es la única pieza del catálogo en esa asimetría. Su sitio natural es T7, junto al resto de la
   ergonomía de consumo.
4. **Los `.Item` del compound de Segment** no aceptan style props (§5.1). Abrirlo exige que
   `SegmentContent` extraiga las style props de las props de cada hijo; se decide con evidencia de uso.
5. **El disparador único de foco de ADR-036 regla 4** (§5.1.3). Diez de los trece archivos siguen con
   su disparador propio; unificarlos es trabajo de comportamiento, no de estilo, y no cambia nada de lo
   que el usuario ve.
6. **El repositorio no cumple su propia configuración de Prettier.** `pnpm format` reescribe **173
   archivos** —docs, stories, `CLAUDE.md`, componentes ya cerrados—, de modo que ejecutarlo dentro de un
   tramo entierra su diff. Se ha venido formateando archivo a archivo al tocarlo. Normalizarlo entero
   pide un commit propio de solo formato, aislado y con los gates en verde antes y después.
7. **A8 sigue abierta y sin tramo asignado.** `Card` es el único componente que deriva el press de
   `whileHover`/`whileTap` en vez del `isPressed` de React Aria, contra lo que fija la plantilla §Capa 3.
   T4 migró su física al helper pero no tocó esa parte: corregirlo exige cablear los hooks de Aria en un
   componente que hoy no los usa, y eso es trabajo de contrato, no de motion.
8. **Los finales de línea del repositorio están mezclados.** Conviven archivos LF y CRLF sin
   `.gitattributes` que lo normalice, lo que rompe cualquier edición por patrón multilínea y ya obligó a
   rehacer una pasada en T4. `Segment/Content.tsx` llegó a tener dos bytes NUL literales dentro de
   sendos literales de cadena, corregidos en `e4d5098`.

**Cerradas al cierre de T3**: la enmienda de ADR-032 regla 3 (§5.2), y la actualización de
`docs/patterns/web-component-template.md` §1 y §6 y `docs/01-architecture.md` §4 que la última
consecuencia del propio ADR-032 exigía "en el mismo PR que implemente la decisión".

### 5.5 Defectos visuales reportados tras T6 (revisión del propietario en el playground)

Con T1–T6 cerrados y todos los gates en verde, la revisión visual encontró seis defectos. Ninguno es
de arquitectura: son **relaciones de color y densidad correctas por contrato y erróneas a la vista**,
que es precisamente la clase de defecto que ningún gate actual detecta. Se atacan en la sesión
dedicada de `prompts/5-review/RV-revision-visual-contra-figma.md`, con acceso al Figma.

**Los seis, tal como se reportaron:**

1. **Modal y Drawer.** El propietario subió el contraste del cuerpo en light y mejoró, pero el borde
   inferior de la cabecera queda muy fuerte, y en dark la relación se percibe **invertida**. El foco
   del botón de cierre se veía raro — ese sí era un defecto propio y está corregido, ver abajo.
2. **Accordion**: el hover se ve raro.
3. **Checkbox, Radio y Switch** deberían compartir altura a igual `size`.
4. **Segment** se ve raro en dark.
5. **Pagination**: el hover no se ve.
6. **NavLink** se ve mal, y es el que más estados simultáneos tiene.

**Tres causas, no seis defectos.** El análisis de los cuatro medibles reduce la lista:

- **`surface.sunken` como token de hover no funciona sobre el canvas.** Es literalmente el mismo
  valor de hover en Accordion (`&:hover:not(:disabled)`) y en Pagination
  (`&:hover:not(:disabled):not([data-active='true'])`), y en dark `sunken` y el canvas casi no se
  distinguen. **2 y 5 son el mismo defecto.** La pregunta abierta es si falta un rol de «hover sobre
  canvas» en el contrato, lo que sería ADR.
- **La escalera de superficies dentro de un overlay.** `surface.overlay` en la cabecera y
  `surface.sunken` en el cuerpo mantienen la misma relación en los dos esquemas, pero el salto es
  mucho mayor en dark, donde el cuerpo se lee como un hueco en lugar de como una superficie hundida.
  Afecta a Modal y Drawer por igual, que es lo que el punto 1 describe.
- **Alturas en literales dentro del `.tsx`.** Checkbox y Radio declaran
  `SIZE_PX = { xs: 14, sm: 16, md: 18, lg: 20, xl: 24 }` y Switch
  `SIZE = { md: { w: 38, h: 22 }, … }`: a `md`, 18 px contra 22. **El censo de ADR-033 solo miró los
  `.css.ts`**, así que estos tres se le escaparon; llevarlos al contrato es aplicar la regla que ya
  existe, no decidir nada nuevo.

**Corregido en el acto**, por ser defecto propio de T6: el anillo de foco no dejaba ver la
superficie de detrás. La corrección completa —y las dos premisas de ADR-036 que se cayeron por el
camino— está en §5.1.3.

**Pendiente de aplicar, con el análisis hecho**: en `ButtonGroup` y en los `tab` de `Segment` los
controles se solapan —`marginInlineStart: -1px` en el primero, `zIndex: 1` uniforme en el segundo— y
sin gestión de apilado el anillo del elemento enfocado queda tapado por el vecino que va después en el
DOM. Elevarlo desde el helper compartido no sirve: `position: relative` dentro de `focus.ring` haría
que Checkbox, Radio, Accordion y `field` pasaran a estar posicionados **solo mientras tienen el foco**,
y cualquier descendiente absoluto se reanclaría al enfocar. Corresponde elevarlo en los dos sitios
donde el solapamiento existe y se conoce.

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

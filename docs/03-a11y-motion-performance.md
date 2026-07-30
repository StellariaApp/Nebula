# 03 — Accesibilidad, Motion y Performance

> WCAG 2.2 AA estricto (decisión cerrada). Estado real de partida: los 3 repos fuente tienen a11y mínima (fonicredito: 3 componentes; tfv: delegada a Mantine; Stellaria: 16 de 39 componentes, con gap en inputs de texto) y cero tests. Nebula nace con contrato a11y y gates de CI por componente.

## 1. Contrato de accesibilidad por componente

Cada componente del catálogo declara en su `types.ts` (y verifica en tests) su contrato a11y. Por clase de componente:

| Clase                                   | Web (React Aria / APG)                                                                              | Native (`accessibility*`)                                                                                                                                                      |
| --------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Acciones (Button, ActionIcon, FAB…)     | `useButton` — role, keyboard (Enter/Space), focus visible                                           | `accessibilityRole="button"`, `accessibilityLabel` obligatorio si onlyIcon, `accessibilityState={{disabled, busy}}`                                                            |
| Toggles (Switch, Checkbox, Radio, Chip) | `useSwitch/useCheckbox/useRadioGroup` — estado anunciado                                            | `role="switch                                                                                                                                                                  | checkbox                                                    | radio"`, `accessibilityState={{checked}}` |
| Inputs de texto                         | `useTextField` — label SIEMPRE vinculado (FormField), error con `aria-describedby`+`aria-invalid`   | `accessibilityLabel` desde FormField, `accessibilityValue`, error anunciado (`accessibilityLiveRegion`) — **gap actual de Stellaria TextInput/Textarea: se corrige al migrar** |
| Selects/Combobox/Autocomplete           | `useComboBox/useSelect/useListBox` — roving focus, type-ahead, aria-activedescendant                | Sheet de opciones con `role="menu"`/listado accesible, foco inicial correcto                                                                                                   |
| Overlays (Modal/Drawer/Sheet/Popover)   | `useDialog/useOverlay/usePopover` — focus trap, restore focus, Esc, scroll lock, `aria-modal`       | `accessibilityViewIsModal`, foco al abrir, cierre con back/gesto anunciado                                                                                                     |
| Menús                                   | `useMenu` — navegación por flechas, Home/End, type-ahead                                            | ActionSheet nativo o lista con roles                                                                                                                                           |
| Tabs · `Segment.Control` con paneles    | `useTabList` — flechas, `aria-selected`, panel vinculado                                            | `role="tablist/tab"`, `accessibilityState={{selected}}`                                                                                                                        |
| `Segment.Control` sin paneles           | `radiogroup` con radios nativos — un `tablist` sin panel que controlar es ARIA incorrecto (ADR-026) | `role="radiogroup/radio"`, `accessibilityState={{checked}}`                                                                                                                    |
| Tablas/DataGrid                         | `useTable`/grid pattern — sort anunciado, navegación de celdas                                      | headers asociados; en móvil, filas como items accesibles                                                                                                                       |
| Feedback (Toast/Alert/Progress)         | `role="status                                                                                       | alert"`, live regions; Progress con `aria-valuenow`                                                                                                                            | `accessibilityLiveRegion`, `accessibilityValue` en progress |
| Charts                                  | resumen textual + tabla de datos accesible como fallback                                            | `accessibilityLabel` descriptivo por serie/punto clave                                                                                                                         |

Reglas transversales:

1. **Navegación por teclado completa** en web: todo lo interactivo alcanzable y operable sin ratón; orden de foco lógico; `FocusTrap` en overlays; skip-links en AppShell.
2. **Focus visible**: token `colors.border.focus` con contraste ≥3:1 contra la superficie; nunca `outline: none` sin reemplazo.

   **Geometría única en web** (ADR-036): `packages/web/src/styles/focus.css.ts` es la única definición del anillo — `outline: 2px solid <halo>` con `outline-offset: 4px`. El tono se cambia declarando la var `halo`, no duplicando la regla; así el campo inválido conserva su anillo rojo con una sola geometría.

   **Por qué `outline` y no `box-shadow`**: el hueco de un anillo de foco **no debe pintarse**, tiene que dejar ver la superficie que haya detrás, y `box-shadow` no puede expresar eso —con spread es una forma maciza, y el hueco solo existe si una capa interior opaca lo tapa, lo que obliga a elegir un color que será el equivocado sobre alguna superficie—. `outline` respeta además el `border-radius` real del elemento en todos los navegadores objetivo, y en modo de alto contraste el sistema lo repinta por sí solo, sin fallback adicional.

3. **Touch targets** ≥44×44pt native / 24px CSS mínimo AA (WCAG 2.2 — criterio 2.5.8).
4. **Textos**: contraste 4.5:1 (3:1 para large text y componentes UI) — validado por tokens, no por auditoría manual (ver §4).
5. `VisuallyHidden` y `aria-label` en todo control solo-icono (lint rule propia).

## 2. Motion

### Tokens (en el theme — ver 02 §2.4)

- `duration`: instant(0) / fast(120ms) / base(200ms) / slow(320ms) / expressive(500ms) — valores finales se calibran en Etapa 2.
- `easing`: standard / emphasized / decelerate / accelerate.
- `spring`: gentle / default / snappy (`{stiffness, damping, mass}` — mismos números alimentan Reanimated y motion).
- `motion.tier` del tema escala/desactiva efectos no esenciales.

### Reglas de implementación

1. **Hot paths solo `transform` + `opacity`** (web: compositor; native: UI thread con Reanimated worklets). Nunca animar layout (width/height/top) en interacciones continuas; usar layout animations dedicadas (Reanimated Layout / motion layout) solo en transiciones discretas.
2. **Reduced motion es obligatorio**: native `ReduceMotion.System` en TODA animación Reanimated (patrón ya presente en Stellaria/FC); web `prefers-reduced-motion` colapsa a fades ≤120ms o nada. El tier `minimal` del tema fuerza el mismo comportamiento.

   **Idioma único en web** (ADR-034): `transitionProperty: "none"` **y** `animationName: "none"`, expuestos como `still` en `packages/web/src/styles/motion.css.ts`. Se retira `transitionDuration: "0.01ms"`, que era un truco para forzar el disparo de `transitionend` y que el catálogo no necesitaba. Lo que anima por keyframes compone `still` **con su sustituto estático** en vez de sustituirlo: un spinner congelado a media vuelta dice lo contrario de lo que quiere decir, así que apaga el giro y fija un aspecto estable. En JS, `MotionOff()` resuelve en un solo sitio `prefers-reduced-motion` y el tier, y todos los helpers degradan a duración cero por esa vía.

   Deja de ser opcional: **todo componente que anime lo declara**.

3. **Degradación en low-end** (native): `useGlassQuality` (patrón LiquidGlass de Stellaria: ultra/high/medium/low) se generaliza a un `useDeviceTier` en `@stellaria/nebula-hooks`; los efectos Skia bajan de calidad o se apagan.
4. Haptics acompañan interacciones primarias en native (`triggerHaptic`), nunca en loops.
5. Entrada escalonada (patrón `animatedIndex/animatedDelay` de FC/TFV) se estandariza como `stagger` en los patterns de listas, alimentado por motion tokens. En web es `Stagger`/`StaggerDelay` (`utils/motion.ts`): paso derivado de `duration.instant` y **tope de ocho elementos**, para que una lista larga no encadene un retardo perceptible en su último item.
6. **Asimetría entrada/salida** (ADR-034): la entrada decelera con su duración plena; la salida acelera a dos tercios. Una salida nunca dura más que su entrada. La física la elige la superficie —tooltip, popover/menu, modal/drawer, toast—, no la transformada; el detalle está en `docs/06` §6.1.
7. **Ninguna transición se escribe a mano.** Las cinco composiciones de `styles/motion.css.ts` —`interaction`, `layout`, `overlay`, `confirm` y `value`— cubren el catálogo y se componen de `vars.motion.*`, de modo que siguen siendo tematizables. Punto obligatorio del checklist de `docs/patterns/web-component-template.md` §6.

## 3. Performance

### Budgets (gates de CI)

| Métrica                                                              | Budget                                                                                                                                            | Herramienta                              |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| Bundle web por componente (brotli, import individual **por módulo**) | **por clase de componente** (ADR-051): primitivos de composición pura ≤9,5 kB · primitivos temables en runtime ≤12 kB · **primitivos temables con variantes en runtime ≤14,5 kB** · **primitivos con color extendido ≤13,5 kB** · compuestos ≤48 kB · **compuestos de colección ≤80 kB** · **compuestos de fecha ≤90 kB** · patterns ≤70 kB (excl. peers pesados aislados) | size-limit por entry en CI               |
| Tree-shaking                                                         | importar `Button` no arrastra charts/dnd/editor (subpaths `@stellaria/nebula-web/charts` etc.)                                                    | size-limit + test de imports             |
| CSS                                                                  | zero-runtime (VE); vars por tema, no clases duplicadas por tema                                                                                   | build check                              |
| Native TTI del playground                                            | sin regresión >10% entre releases                                                                                                                 | perf test en CI (maestro + trace)        |
| Re-renders                                                           | compound components no re-renderizan hijos no afectados (Jotai atómico)                                                                           | why-did-you-render en playground + tests |
| Listas                                                               | virtualización obligatoria ≥50 items (FlashList/SectionList native; react-virtual web)                                                            | contrato de List/DataGrid                |
| RSC                                                                  | los presentacionales **sin theming en runtime** no llevan `"use client"`; los que resuelven `variant` contra `variantMap` sí lo son por construcción (ADR-038) | eslint rule — ⚠️ **no implementada** |

> **Revisión de budgets (2026-07-20, W1.4)**: los números originales (5/15/35 kB gzip) eran provisionales (roadmap, supuesto 4) y se fijaron antes de medir. Con la anatomía cerrada en ADR-018 —React Aria + `motion` con springs del theme— la medición real de Button es **45,1 kB brotli** (motion + `domAnimation` 27,7 · react-aria 9,75 · CSS y código propio ~7,6). El propietario ratificó mantener `motion` en toda la librería por la paridad exacta de física con Reanimated, asumiendo el coste; los budgets se elevan en consecuencia. Se mide **por módulo** (`dist/components/…/X.js`), no por el barrel, porque el barrel arrastra el CSS de todo el paquete vía `sideEffects` y no representa lo que consume quien importa un componente suelto.

> **Revisión de budgets (2026-07-20, W2 — [ADR-022](adr/ADR-022-budget-primitivos-temables-runtime.md))**: W1.4 midió solo Box/Text/Button; ningún primitivo resolvía tokens en runtime. Al aterrizar la capa de layout de W2 (Grid, Divider, Paper, Container, Scroll, SimpleGrid, Group, Space, AspectRatio) se midió que un primitivo **compuesto sobre Box + theming en runtime** (recipe de VE y/o `assignInlineVars`) tiene un suelo de **9,2–11,3 kB brotli/módulo** (Box 8,6 + runtime de recipe/dynamic), por encima del budget de 9 kB. Los primitivos de **composición pura** sin runtime (Flex 8,7 · Center 8,7 · VisuallyHidden 8,8) sí caben en 9 kB. Se introduce el sub-budget **primitivo temable en runtime ≤12 kB** (headroom sobre el máx medido, Divider/Grid 11,3), sin abandonar el patrón canónico de ADR-018 (recipe + `assignInlineVars`).

> **Revisión de budgets (2026-07-29, W3.1 — [ADR-051](adr/ADR-051-budget-de-la-cadena-de-fechas.md))**: la cadena de fechas midió DatePicker 84,2 · DateTimePicker 84,17 · DateRangePicker 84,89 · DatePickerInput 70,19 · TimeInput 58,28 · Calendar 42,62 · RangeCalendar 42,39 · MonthPicker 20,64 · YearPicker 19,81 kB. Tres módulos exceden `patterns ≤70` en ~21 %: el suelo de un campo (≈25 kB) más picker + campo segmentado + calendario de `react-stately` más `@internationalized/date` (≈14 kB), y ninguna parte es opcional con React Aria (ADR-003) y el contrato APG de §1. Se añade la banda **compuestos de fecha ≤90 kB**. En el mismo ADR se sincera **compuestos de colección ≤80 kB**, que recoge Select 67, Combobox 74, MultiSelect 75 y Menu 58: tenían budget individual desde W2 y ninguna banda los cubría, de modo que `compuestos ≤48` nunca se les aplicó. Los budgets pasan a declararse **por clase de componente**, que es como operaban de facto desde ADR-022. `MonthPicker`/`YearPicker` quedan en ~20 kB por estar construidos sobre grid propia sin la cadena de fechas: el coste es de la maquinaria de calendario, no de la clase «picker».

> **Revisión de budgets (2026-07-28, T2 — [ADR-032](adr/ADR-032-style-props-en-todo-el-catalogo.md) §6–§7)**: al hacer sprinkles responsive se destapó un sesgo de la metodología. `size-limit` mide cada entrada _con todas sus dependencias_, así que las 75 entradas por módulo contaban **cada una** la hoja atómica compartida de sprinkles, que una app descarga una sola vez. Con una condición el sesgo era tolerable; con seis dejaba **51 de 75** budgets en rojo sin regresión real. **La hoja atómica se excluye de los budgets por módulo** y pasa a tener entrada propia (`Box.css.ts.vanilla.css`, budget 8 kB, medido 6,55); el **runtime** de sprinkles (`Box.css.js`, budget 16 kB, medido 14,8) también tiene entrada propia pero **sigue contándose en cada módulo**, porque excluirlo además deja los budgets sin significado (Box 512 B, Text 931 B). La configuración vive ahora en `packages/web/.size-limit.js`, no en `package.json`, porque la exclusión requiere `modifyEsbuildConfig`. Con ello el escalón **composición pura pasa de 9 a 9,5 kB**: Text, Title, Code y ButtonGroup excedían por 131–144 B al crecer el runtime, y el suelo de todo primitivo que componga Box subió ~140 B. Regla: se recalibra un **suelo compartido** medido; el exceso de un componente concreto se corrige adelgazándolo, no subiendo su budget.

> **Revisión de budgets (2026-07-30, W3.3 bloque C)**: la entrada `NebulaProvider` pasa de **60 a 62 kB**. Es la **única** que sigue midiéndose desde el barrel (`dist/index.js`), de modo que acumula el CSS de todo el catálogo vía `sideEffects` y crece con cada componente que entra, tenga o nada que ver con el provider: 59,73 kB al cerrar el bloque B y 60,54 al cerrar el C. Medida por módulo (`dist/provider/nebula-provider.js`) da **43,62 kB**, y los ~17 kB de diferencia son CSS de componentes que el provider no monta. **Decisión del propietario (checkpoint del bloque C)**: se sube el techo y se conserva la medición desde el barrel, porque «qué descarga quien importa del barrel» es información real que ninguna otra entrada da. Se asume que el número volverá a tocarse en W3.4 (DataGrid, charts, CommandPalette) y en W3.5 (AppShell): la alternativa evaluada y descartada fue moverla a por-módulo como ADR-032 regla 6 hizo con las otras 113 entradas.
>
> Dos budgets propios en el mismo bloque, por la misma razón que `Chip` tiene el suyo: **StatusBadge 15 kB** (medido 14,55) porque compone `Badge`, que solo ya mide 14,1 contra un techo de clase de 14,5 —cualquier componente que lo componga sale de esa clase por construcción—, y **PermissionGate 9,5 kB** (medido 9,39), que sí cabe en composición pura.

### Estrategias

- **Web**: VE compila a CSS estático; recipes generan clases, no estilos inline; `motion` importado por feature; React Aria hooks por componente (no el paquete entero). SSR-safe (Next 16): sin acceso a `window` en render.
- **Native**: Unistyles 3 resuelve estilos en C++ sin re-render por cambio de tema; Reanimated 4 en UI thread; Skia lazy (`import()` dinámico de Effects Tier 3); imágenes con expo-image (caché + placeholders).
- **Carga de temas**: JSON de tema ≤10 kB; validación Zod solo en carga dinámica (los oficiales se validan en build).

## 4. Validación automatizada en CI (quality gates)

1. **axe sobre stories**: `@storybook/addon-a11y` 10.5 + test-runner ejecuta axe en TODAS las stories (web) en cada PR; fallo = bloqueo. Native: chequeos de props a11y por lint + RNTL (`toHaveAccessibilityValue` etc.).
2. **Contrast check de tokens** (`tools/contrast-check`): valida cada par texto/superficie y estado (hover/focus/disabled) de cada tema oficial contra AA; corre en PRs que toquen `@stellaria/nebula-themes` o el contrato. Es el mismo motor que usa el Theme Creator en vivo.
3. **Keyboard tests**: interaction tests de Storybook (play functions) cubren Tab/flechas/Esc/Enter en overlays, menús, combobox y tabs.
4. **Reduced motion tests**: stories parametrizadas con `prefers-reduced-motion: reduce` (web) y mocks de `ReduceMotion` (native) verifican fallbacks.
5. **Bundle budget**: size-limit por entry point, tabla publicada en el PR.
6. **Typecheck estricto**: TS 7, `strict` total, presupuesto de `any` = solo fronteras de framework documentadas (herencia del patrón Stellaria: hoy 8 `any` justificados).

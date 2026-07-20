# 03 — Accesibilidad, Motion y Performance

> WCAG 2.2 AA estricto (decisión cerrada). Estado real de partida: los 3 repos fuente tienen a11y mínima (fonicredito: 3 componentes; tfv: delegada a Mantine; Stellaria: 16 de 39 componentes, con gap en inputs de texto) y cero tests. Nebula nace con contrato a11y y gates de CI por componente.

## 1. Contrato de accesibilidad por componente

Cada componente del catálogo declara en su `types.ts` (y verifica en tests) su contrato a11y. Por clase de componente:

| Clase                                   | Web (React Aria / APG)                                                                            | Native (`accessibility*`)                                                                                                                                                      |
| --------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Acciones (Button, ActionIcon, FAB…)     | `useButton` — role, keyboard (Enter/Space), focus visible                                         | `accessibilityRole="button"`, `accessibilityLabel` obligatorio si onlyIcon, `accessibilityState={{disabled, busy}}`                                                            |
| Toggles (Switch, Checkbox, Radio, Chip) | `useSwitch/useCheckbox/useRadioGroup` — estado anunciado                                          | `role="switch                                                                                                                                                                  | checkbox                                                    | radio"`, `accessibilityState={{checked}}` |
| Inputs de texto                         | `useTextField` — label SIEMPRE vinculado (FormField), error con `aria-describedby`+`aria-invalid` | `accessibilityLabel` desde FormField, `accessibilityValue`, error anunciado (`accessibilityLiveRegion`) — **gap actual de Stellaria TextInput/Textarea: se corrige al migrar** |
| Selects/Combobox/Autocomplete           | `useComboBox/useSelect/useListBox` — roving focus, type-ahead, aria-activedescendant              | Sheet de opciones con `role="menu"`/listado accesible, foco inicial correcto                                                                                                   |
| Overlays (Modal/Drawer/Sheet/Popover)   | `useDialog/useOverlay/usePopover` — focus trap, restore focus, Esc, scroll lock, `aria-modal`     | `accessibilityViewIsModal`, foco al abrir, cierre con back/gesto anunciado                                                                                                     |
| Menús                                   | `useMenu` — navegación por flechas, Home/End, type-ahead                                          | ActionSheet nativo o lista con roles                                                                                                                                           |
| Tabs/SegmentedControl                   | `useTabList` — flechas, `aria-selected`, panel vinculado                                          | `role="tablist/tab"`, `accessibilityState={{selected}}`                                                                                                                        |
| Tablas/DataGrid                         | `useTable`/grid pattern — sort anunciado, navegación de celdas                                    | headers asociados; en móvil, filas como items accesibles                                                                                                                       |
| Feedback (Toast/Alert/Progress)         | `role="status                                                                                     | alert"`, live regions; Progress con `aria-valuenow`                                                                                                                            | `accessibilityLiveRegion`, `accessibilityValue` en progress |
| Charts                                  | resumen textual + tabla de datos accesible como fallback                                          | `accessibilityLabel` descriptivo por serie/punto clave                                                                                                                         |

Reglas transversales:

1. **Navegación por teclado completa** en web: todo lo interactivo alcanzable y operable sin ratón; orden de foco lógico; `FocusTrap` en overlays; skip-links en AppShell.
2. **Focus visible**: token `colors.border.focus` con contraste ≥3:1 contra la superficie; nunca `outline: none` sin reemplazo.
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
3. **Degradación en low-end** (native): `useGlassQuality` (patrón LiquidGlass de Stellaria: ultra/high/medium/low) se generaliza a un `useDeviceTier` en `@stellaria/nebula-hooks`; los efectos Skia bajan de calidad o se apagan.
4. Haptics acompañan interacciones primarias en native (`triggerHaptic`), nunca en loops.
5. Entrada escalonada (patrón `animatedIndex/animatedDelay` de FC/TFV) se estandariza como `stagger` en los patterns de listas, alimentado por motion tokens.

## 3. Performance

### Budgets (gates de CI)

| Métrica                                                              | Budget                                                                                         | Herramienta                              |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------- |
| Bundle web por componente (brotli, import individual **por módulo**) | primitivos ≤9 kB · compuestos ≤48 kB · patterns ≤70 kB (excl. peers pesados aislados)          | size-limit por entry en CI               |
| Tree-shaking                                                         | importar `Button` no arrastra charts/dnd/editor (subpaths `@stellaria/nebula-web/charts` etc.) | size-limit + test de imports             |
| CSS                                                                  | zero-runtime (VE); vars por tema, no clases duplicadas por tema                                | build check                              |
| Native TTI del playground                                            | sin regresión >10% entre releases                                                              | perf test en CI (maestro + trace)        |
| Re-renders                                                           | compound components no re-renderizan hijos no afectados (Jotai atómico)                        | why-did-you-render en playground + tests |
| Listas                                                               | virtualización obligatoria ≥50 items (FlashList/SectionList native; react-virtual web)         | contrato de List/DataGrid                |
| RSC                                                                  | los presentacionales no llevan `"use client"`; regla de lint                                   | eslint rule                              |

> **Revisión de budgets (2026-07-20, W1.4)**: los números originales (5/15/35 kB gzip) eran provisionales (roadmap, supuesto 4) y se fijaron antes de medir. Con la anatomía cerrada en ADR-018 —React Aria + `motion` con springs del theme— la medición real de Button es **45,1 kB brotli** (motion + `domAnimation` 27,7 · react-aria 9,75 · CSS y código propio ~7,6). El propietario ratificó mantener `motion` en toda la librería por la paridad exacta de física con Reanimated, asumiendo el coste; los budgets se elevan en consecuencia. Se mide **por módulo** (`dist/components/…/X.js`), no por el barrel, porque el barrel arrastra el CSS de todo el paquete vía `sideEffects` y no representa lo que consume quien importa un componente suelto.

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

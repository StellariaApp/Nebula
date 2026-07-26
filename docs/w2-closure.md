# Cierre de W2 — Web Tier 1

> Verificado el 2026-07-26 sobre `main` (`1808a47`). Requisito previo: W1 cerrado (`docs/w1-closure.md`).

## Entregables por sub-fase (commits)

| Sub-fase | Entregable                                                                                     | Estado |
| -------- | ------------------------------------------------------------------------------------------------ | ------ |
| W2.1     | Foundation/Layout y Utilities Tier 1 (Box, Flex, Center, Group, Grid+Col, SimpleGrid, Container, Scroll, Divider, Space, AspectRatio, Paper, VisuallyHidden, Portal, FocusTrap, Transition, Collapse, Conditional/Valid/Omit) | ✅     |
| W2.2     | Tipografía Tier 1 (Title, Anchor, Mark, Highlight, Code, Blockquote, List) + `@stellaria/nebula-icons` (registry lucide, `CreateIcons` tipado, packs — ADR-008/023)                                                        | ✅     |
| W2.3     | Buttons/Actions (ActionIcon, ButtonClose, ButtonCopy, ButtonGroup, UnstyledButton, FileButton) + sistema de forms (FormField, FieldError, `useFieldProps`/`NebulaField` — ADR-005) + inputs básicos (TextInput, PasswordInput, Textarea, SearchInput, NumberInput, Checkbox, Radio, Switch) | ✅     |
| W2.4     | Overlays core (Popover, Tooltip, Modal, Drawer, Menu, ContextMenu) + colecciones (Combobox, Select, MultiSelect) + `Segment` compound (motion, gesto, imán — ADR-026, absorbe `SegmentedControl`)                          | ✅     |
| W2.5     | Feedback (Alert, Toast+`ToastProvider`, Loader, Skeleton, Progress) + Data display Tier 1 (Card compound, Avatar+Group, Badge, Image/BackgroundImage, Accordion, EmptyState) + Navegación Tier 1 (NavLink, Pagination; Tabs ya cubierto en W2.4 sobre `Segment`)          | ✅     |

Catálogo Tier 1 web de `docs/00-inventory.md` completo: 100% de Foundation/Layout, Typography, Buttons/Actions, Inputs/Forms, Overlays, Feedback, Data display y Navigation marcados Tier 1 están implementados. `List (data, FlatList)` (native-only) y `Breadcrumbs` (Tier 2) quedan fuera de alcance, como estaba decidido.

## Gate de W2 (docs/05-roadmap.md)

| Criterio                                                    | Resultado                                                                 |
| ------------------------------------------------------------ | -------------------------------------------------------------------------- |
| Testing contract por componente                             | ✅ **68 archivos, 296 tests** (`vitest`, paquete `@stellaria/nebula-web`) |
| axe 0 violaciones                                            | ✅ **50 stories, 299 tests, 0 violaciones** (`turbo a11y`)                |
| Presets sober/playful sin componentes "rotos"                | ✅ Cubierto por las stories `AllThemes` de cada componente                |
| Budgets (size-limit)                                         | ✅ Todas las entries dentro de budget (ver tabla siguiente)               |
| Keyboard tests de overlays/menu/combobox                     | ✅ Play functions de teclado en Modal/Drawer/Popover/Tooltip/Menu/ContextMenu/Combobox/Select/MultiSelect/Segment/Tabs |
| Láminas `Foundations/Visual QA` y review visual (docs/06)     | ✅ Stories `Composition`/`AllThemes` por componente visual                |
| Pipeline completa                                            | ✅ `pnpm turbo build typecheck lint test` — **29/29 tareas verdes**       |

**Veredicto: GATE DE W2 EN VERDE.**

## Medidas reales de bundle (brotli, por módulo — muestra representativa)

| Entry                            | Tamaño   | Budget |
| --------------------------------- | -------- | ------ |
| Button (compuesto)                | 47,14 kB | 48 kB  |
| useTheme (sin CSS)                | 15,42 kB | 18 kB  |
| Toast + ToastProvider              | 52,84 kB | 58 kB  |
| Card (compound + motion)          | 36,66 kB | 44 kB  |
| Accordion (APG + Collapse+motion) | 34,41 kB | 42 kB  |
| NavLink (disclosure APG + motion) | 36,55 kB | 42 kB  |
| Pagination (rango + motion)       | 36,38 kB | 42 kB  |
| Segment (compound: motion+gesto)  | 50,90 kB | 58 kB  |
| Combobox (Aria + filtrado)        | 81,81 kB | 90 kB  |

Los sub-budgets vigentes son los de ADR-022 (primitivo temable en runtime ≤12 kB) y la revisión de W1.4 (compuestos ≤48 kB, patterns ≤70–90 kB según coste real de Aria+motion). El único ajuste de budget hecho en W2.5 fue `useTheme (sin CSS)`: 15→18 kB, porque `sideEffects: ["*.css"]` del barrel arrastra el CSS de cada componente nuevo registrado a cualquier import parcial de `dist/index.js`; documentado en el commit de la parte 3 de navegación.

## Hallazgo de este cierre: estado del repositorio previo a validar

Al arrancar esta sesión, `HEAD` estaba en un commit desprendido (`1808a47`, "W2.5 parte 3 — navegación") que la rama local `main` no reflejaba. Se verificó que **`origin/main` ya tenía ese commit** (la discrepancia era solo del checkout local de este contenedor); se alineó `main` local por fast-forward y se confirmó con `git push` (`Everything up-to-date`). No se rehizo trabajo: se re-verificaron los 6 gates completos (build/typecheck/lint/test/size/a11y) sobre el commit existente antes de dar la parte 3 por cerrada.

## Nota de entorno: gate `a11y` en este contenedor

El binario de Chromium headless-shell pre-instalado en `/opt/pw-browsers` (revisión 1194) no coincide con la revisión que espera la versión de `playwright-core` resuelta por el lockfile (1228). Es un desajuste de imagen del entorno de ejecución, no un defecto del código: `@storybook/test-runner` en esta versión no expone un mecanismo de configuración (`jest-playwright.config.*`) funcional para inyectar `launchOptions.executablePath` — su "runner" interno siempre pasa un `testEnvironmentOptions` no vacío, lo que hace que la rama de carga de archivo de `readConfig` nunca se ejecute. Se resolvió localmente enlazando la revisión 1194 preinstalada bajo el path que la 1228 esperaba (cambio efímero del contenedor, **no** commiteado al repo). Con eso, el gate corrió limpio: 50/50 stories, 299/299 tests, 0 violaciones. Si este entorno se reconstruye, el mismo ajuste (o actualizar la imagen base) será necesario para que `pnpm --filter playground-web a11y` corra sin intervención manual.

## Pendientes para W3

1. **`CardComplex`** (C1-Q4): el Card compound de W2.5 cubre `Section/Image/Badges/Actions/Meta`; el envoltorio de alto nivel con las props de TFV reorganizadas queda para W3, con checkpoint del propietario antes de fijar los grupos de props.
2. **Data display extendido** (Timeline, Table, Spoiler, Kbd, ThemeIcon, ColorSwatch, Stat) y **navegación Tier 2** (Breadcrumbs, Stepper) quedan en el alcance de W3 según `docs/00-inventory.md`.
3. **Desajuste de Playwright en el entorno remoto**: documentado arriba; evaluar fijar la imagen base o pinear `playwright`/`playwright-core` a una versión con browsers pre-cacheados coincidentes, para que el gate `a11y` no dependa de un ajuste manual por sesión.

## Arranque recomendado de W3 (Tier 2)

Seguir `docs/patterns/web-component-template.md`. Orden sugerido por `docs/00-inventory.md` §1.4/§1.6/§1.10: primero inputs de fecha/hora (reutilizan `FormField`/`useFieldProps` de W2.3), después el checkpoint de `CardComplex` con el propietario antes de tocar data display extendido, y solo entonces Search/Filter/Filters y DataGrid básico (requieren TanStack Table — ADR previo por dependencia nueva).

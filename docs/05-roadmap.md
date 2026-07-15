# 05 — Roadmap de Nebula

> Alcance v1 comprometido: **catálogos completos** (177 native + 204 web → ~213 canónicos unificados) + dominios premium (decisión del propietario). Estrategia: **la librería se construye completa antes de migrar las apps** (C3-Q3). Sin fechas — fases con entregables verificables y gates; una fase no se abre sin la anterior en verde.

## Fases

### F0 — Scaffold y fundaciones
**Entregables**: monorepo Turborepo+pnpm con los paquetes core vacíos y pipelines; **spike TS 7** validando la cadena completa (VE + Metro/Expo 57 + Storybook 10 + eslint) según ADR-012; `@stellaria/nebula-tokens` con contrato `NebulaTheme` + types compartidos migrados de Stellaria + Zod schema; `tools/palette-gen` (OKLCH 50–950) y `tools/contrast-check` funcionando; skills de gobernanza instaladas.
**Gate**: `turbo build/typecheck/lint` verde bajo TS 7 (o contingencia ADR-012 aplicada y documentada); paletas regeneradas pasan contrast-check.

### F1 — Theming dual + playgrounds vivos
**Entregables**: runtime dual (`NebulaProvider` web con CSS vars/`ColorSchemeScript`; native con Unistyles configure); temas `nebula-light/dark` completos + borradores `sober`/`playful`; ambos playgrounds arrancando (Storybook 10.5 web + Expo/SB-RN) con toolbar de tema/scheme/reduced-motion; primeros primitivos demo (Box, Text, Button) en ambas plataformas.
**Gate**: cambiar tema reconfigura los demo-components en ambas plataformas sin tocar código; axe CI y size-limit conectados y en verde.

### F2 — Tier 1 (core esencial, WN)
**Entregables**: migración de los 39 componentes de Stellaria (con los refactors de 04 §2: a11y de TextInput/Textarea, fix Textarea dark, fix ChipGroup, split Header→FormField+Header) + resto del Tier 1 de los catálogos en ambas plataformas: Foundation/Typography/Buttons completos, inputs básicos (TextInput, NumberInput, PasswordInput, Textarea, SearchInput, Select, MultiSelect, Checkbox, Radio, Switch, SegmentedControl), Card compound, Avatar, Badge, Alert, Toast+provider, Modal, BottomSheet, Drawer, Popover, Tooltip, Menu, Loader, Skeleton, Progress, Tabs, NavLink, Breadcrumbs, Pagination, EmptyState, Portal/Transition/Collapse/FocusTrap/VisuallyHidden, sistema de forms (FormField+NebulaField), `@stellaria/nebula-icons` con registry.
**Gate**: testing contract completo por componente; axe 0 violaciones; presets sober/playful sin componentes "rotos"; budgets en verde; stories CSF compartidas para todo el tier.

### F3 — Tier 2 (extendido)
**Entregables**: inputs completos (fechas/hora/calendar, Color, File, Tags, Pin, Rating, Autocomplete, Combobox patterns, InputPhone/Dial/Currency, Signature, Dropzone), data display extendido (Table, Timeline, Accordion, GridList, Stat, ListItem/SwipeableRow/SectionList, List data), overlays restantes, navegación completa (TabBar+adapter, Stepper, Burger), Search/Filter/Filters, CommandPalette, DataGrid básico, charts básicos (Bar/Line/Area/Pie + Spark/Trend), `CardComplex` (diseño de grupos de props con revisión del propietario), AppShell/Panel/Section/Main/Banner/Feature, PermissionGate, InfiniteList/SearchableList, StatusBadge/CurrencyDisplay/DateDisplay, `@stellaria/nebula-native-camera`.
**Gate**: ídem F2 + keyboard tests de combobox/menu/datagrid; virtualización verificada ≥50 items.

### F4 — Tier 3 (premium visual)
**Entregables**: Effects/Shaders (LiquidGlass migrado + continuación plan v2, Aurora/Mesh/Noise/Gradients con los nuevos tokens `gradients`), Animated Text (8), Micro-interactions (9), Carousels avanzados, DnD/Kanban, Rich Content (RichTextEditor, CodeHighlight, EditorImage peer-Pintura, Player, ImageGallery), DataGrid avanzado, charts completos (Radar, tooltips/legends compartidos).
**Gate**: Skia lazy-load verificado (bundle base intacto); degradación low-end (`useDeviceTier`) demostrada; reduced-motion en todos los efectos.

### F5 — Theme Creator (paralelizable desde fin de F1)
**Entregables**: MVP (editor de secciones + preview de galería + export/import JSON) tras F1; validación AA en vivo y generación de paletas tras F2; preview completa con el catálogo al cierre de F3.
**Gate**: round-trip completo (crear→export→cargar en ambas plataformas); temas `fonicredito` y `tfv-gold` creados con él como casos reales.

### F6 — Dominios premium
**Entregables**: `@stellaria/nebula-commerce`, `@stellaria/nebula-sales`, `@stellaria/nebula-payments` (alcance por paquete según 00-inventory §1.18); `@stellaria/nebula-people` y `@stellaria/nebula-maps` (confirmados); registry privado + mecánica de licencias (mini-ADR); galería premium separada en playgrounds.
**Gate**: cada paquete consume solo core+hooks+icons; entidades por duck-typing (cero imports de apps).

### F7 — Gate de migración y planes por app
**Entregables**: verificación de cobertura contra 00-inventory §4/§5 (100% de lo que cada app necesita); planes de migración detallados (docs propios) para fonicredito (codemod directo, 04 §5.1) y tfv (migración total, 04 §5.2); codemods escritos y probados en seco.
**Gate**: criterios de "lista para migrar" de 04 §5.3 en verde → se abre la ejecución de migraciones (fuera de este roadmap).

## Quality gates transversales (todas las fases)

typecheck TS7 estricto · lint (+reglas propias: no `"use client"` en presentacionales, no hex fuera de tokens, aria-label en solo-icono) · unit+interaction tests · axe sobre stories · contrast-check de temas · size-limit por entry · review ADR para toda dependencia nueva.

## Top-8 riesgos y mitigación

| # | Riesgo | Prob./Impacto | Mitigación |
|---|---|---|---|
| 1 | **TS 7 rompe el toolchain** (VE/Metro/SB) | media/alto | Spike F0 antes de cualquier componente; contingencia por-paquete ADR-012; sin features TS7-only al inicio |
| 2 | **Volumen** (~213 canónicos + premium) → fatiga/scope creep | alta/alto | Tiers estrictos con gates; F2 no se abre sin F1 verde; matriz 00 como única fuente de alcance; descartes ya acordados |
| 3 | **Web desde cero + AA estricto** | media/alto | React Aria como motor (ADR-003); axe CI desde F1 (no al final); keyboard tests por patrón |
| 4 | **Deriva de paridad API W/N** | media/medio | Contratos en `@stellaria/nebula-tokens/types` como única fuente; stories CSF compartidas; lint que compara exports W/N por componente WN |
| 5 | **Skia/LiquidGlass en low-end** | media/medio | `useDeviceTier` + quality tiers (patrón ya validado); lazy-load Tier 3; perf tests en playground |
| 6 | **Theme Creator scope creep** | alta/medio | Spec cerrada (02 §5), MVP en F5.1; nuevas features requieren ADR |
| 7 | **@storybook/react-native 10 inmaduro** | media/medio | Las stories CSF son independientes del runner: fallback a app catálogo Expo propia sin reescribir stories |
| 8 | **Apps evolucionan mientras se construye la lib** (C3-Q3 pospone migraciones) | alta/medio | Re-verificación de la matriz (re-ls + diff de APIs) como primer paso de F7; congelar creación de componentes nuevos en apps cuando exista equivalente Nebula |

## Supuestos pendientes de confirmar

> Avancé con estos supuestos para no bloquear; **ninguno se da por cerrado** hasta confirmación del propietario. Los items 1–3 fueron **confirmados el 2026-07-14**.

1. ~~`@stellaria/nebula-icons` como paquete separado~~ — **CONFIRMADO**.
2. ~~`@stellaria/nebula-people` y `@stellaria/nebula-maps`~~ — **CONFIRMADOS** ambos en el plan premium.
3. ~~Presets demostrativos `sober` y `playful`~~ — **APROBADOS** nombre y dirección.
4. **Valores finales de motion tokens y budgets de bundle**: números provisionales, se calibran en F1/F2.
5. **Publicación con changesets** y mecánica exacta del registry privado premium (npm private vs Verdaccio): propuesto, se decide con mini-ADR en F0/F6.
6. **TipTap vs Lexical** (RichTextEditor) y **cmdk vs propio** (CommandPalette): fijados provisionalmente TipTap/cmdk; ADR definitivo al llegar a F4/F3.
7. **Jest para native** (por Metro) vs unificar todo en Vitest: propuesto Jest; validar en F0.
8. **Diseño fino de los grupos de props de `CardComplex`**: esbozado en 01 §4; requiere tu revisión en F3.
9. **`caption: 8px`** en la escala tipográfica de Stellaria: probable ajuste por legibilidad AA — confirmar al calibrar.
10. **Storage de persistencia de tema** (MMKV recomendado, inyectable): confirmar que no debe imponerse.

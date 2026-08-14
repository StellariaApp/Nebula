# 05 — Roadmap de Nebula

> Alcance v1 comprometido: **catálogos completos** (177 native + 204 web → ~213 canónicos unificados) + dominios premium (decisión del propietario). Estrategia: **la librería se construye completa antes de migrar las apps** (C3-Q3). Sin fechas — fases con entregables verificables y gates.
>
> **Estructura por etapas (decisión del propietario, 2026-07-15)**: (1) Fundaciones → (2) **Web** desde desarrollo hasta publicación + premium web → (3) Theme Creator (paralela) → (4) **Native** desde desarrollo hasta publicación + premium native → (5) Review (gate de migración). Códigos de fase: `F0 · W1–W6 · TC · N1–N5 · R`. Los prompts de ejecución viven en `prompts/` (una carpeta por etapa).
>
> Orden estricto F0 → W1…W6 → N1…N5 → R, con tres flexibilidades: TC corre en paralelo desde el cierre de W1; W6 puede solaparse con el arranque de N1 (el core native solo necesita W5); N5 requiere N4 + W6.

## Etapa 1 — Fundaciones

### F0 — Scaffold y fundaciones _(cerrada — ver `docs/f0-closure.md`)_

**Entregables**: monorepo Turborepo+pnpm con paquetes core vacíos y pipelines; **spike TS 7** ✅ (veredicto: todo verde salvo typescript-eslint → contingencia TS 5.9.3 solo en la cadena de lint); `@stellaria/nebula-tokens` con contrato `NebulaTheme` + types compartidos migrados de Stellaria; `tools/palette-gen` (OKLCH 50–950) y `tools/contrast-check`; skills de gobernanza.
**Gate**: `turbo build/typecheck/lint` verde; paletas regeneradas pasan contrast-check.

## Etapa 2 — Web: desarrollo → publicación → premium

### W1 — Theming web + playground web _(cerrada — ver `docs/w1-closure.md`)_

**Entregables**: `@stellaria/nebula-themes` (Zod schema, temas `light/dark`, `loadTheme`); runtime web (`createThemeContract` VE, `NebulaProvider`, `ColorSchemeScript`, `useTheme` + hooks base migrados); `apps/playground-web` (Storybook 10.5 + toolbar tema/scheme/reduced-motion + addon-a11y + size-limit); **piloto de anatomía** (Box, Text, Button completos) que valida las 3 capas de 01 §4.
**Gate**: cambiar tema reconfigura los pilotos sin tocar código; axe y size-limit verdes; Button con testing contract al 100% (plantilla para todo lo demás).

### W2 — Web Tier 1 _(cerrada — ver `docs/w2-closure.md`)_

**Entregables**: Foundation/Layout, Typography, Utilities, `@stellaria/nebula-icons` (registry lucide), Buttons/Actions, sistema de forms (FormField + `NebulaField` + `useFieldProps`), inputs básicos, Combobox + Select/MultiSelect, overlays core (Modal, Drawer, Popover, Tooltip, Menu), feedback (Alert, Toast+provider, Loader, Skeleton, Progress), Card compound, Avatar, Badge, navegación core, EmptyState.
**Gate**: testing contract por componente; axe 0 violaciones; los temas oficiales sin componentes "rotos"; budgets; keyboard tests de overlays/menu/combobox; láminas `Foundations/Visual QA` y review visual según `docs/06-visual-language.md`.

### W3 — Web Tier 2 ✅ CERRADA (docs/w3-closure.md)

**Entregables**: inputs completos (fechas/hora/calendar, Color, File, Tags, Pin, Rating, Autocomplete, Combobox patterns, InputPhone/Dial/Currency, Signature, Dropzone, JsonInput, Fieldset), data display extendido, Search/Filter/Filters, CommandPalette, DataGrid básico, charts básicos, AppShell, Panel, Section, Main, Banner, Feature, `CardComplex` (⚠️ checkpoint del propietario para los grupos de props), PermissionGate, InfiniteList/SearchableList, StatusBadge/CurrencyDisplay/DateDisplay, Form orquestador, ModalDelete/FormDelete, Stepper y overlays/utilidades restantes.
**Gate**: ídem W2 + keyboard tests de datagrid; virtualización ≥50 items.

### W4 — Web Tier 3

**Entregables**: Glass/Effects (con tokens `gradients`), DnD/Kanban, Rich Content (RichTextEditor, CodeHighlight, EditorImage peer-Pintura, Player, ImageGallery, Carousel), DataGrid avanzado, charts completos, TransferList/VirtualizedSelect, GlobalSearch, TypographyStylesProvider, DirectionProvider (RTL).
**Gate**: subpaths aislados verificados; reduced-motion en todos los efectos; catálogo web al 100% (o excepciones aprobadas).

### WR — Web Refine: auditoría visual del catálogo _(entre W4 y W5)_

**Entregables**: censo de cobertura contra `00-inventory`; baseline del archivo de diseño en disco; auditoría visual de los 144 componentes con superficie repartida en 8 familias (estructura, jerarquía, peso visual, espaciado, tipografía, en los 4 temas); consolidado por causa; plan de alineación ejecutado.
**Gate**: `docs/wr-closure.md`; los cuatro gates en verde tras cada tramo; los ADRs de las causas de contrato aprobados; **declaración explícita de que el aspecto está estable para capturar el baseline de ADR-037**.
**Por qué antes de W5**: publicar un catálogo cuya calibración visual no se ha auditado convierte cada defecto en una incidencia de terceros, y los arreglos de calibración pasan de trabajo interno a breaking visual con versión. Prompts en `prompts/2.1-web-refine/`.

### WN — Web Normalize: igualar la forma del catálogo _(entre WB y W5)_ ✅

**Entregables**: seis tramos sobre los 158 componentes ya existentes —nombres de los símbolos de las hojas (N0), las vars locales en su propio archivo (N1), criterio de compound y dónde viven sus partes (N2), props de ranura (N3), reparto de `surface.hoverActive` (N4) y el cuaderno de hallazgos (N5)—. Prompts en `prompts/2.3-web-normalize/`.
**Gate**: `docs/wn-closure.md` — **cerrada el 2026-08-14**, con los números de apertura y cierre uno al lado del otro y los siete gates verificados.
**Por qué antes de W5**: cada una de estas convenciones decide si un consumidor puede ajustar un componente sin forkearlo. Aplicarlas después de publicar convierte cada una en un _breaking change_.

### W5 — Publicación web v1 🚀

**Entregables**: changesets (mini-ADR); auditoría de exports/subpaths/sideEffects/peers; publicación npm bajo org `stellaria` de tokens/hooks/themes/icons/web (+ decisión del paquete paraguas `@stellaria/nebula` — ADR-013); READMEs de consumo; verificación de instalación en proyecto Next 16 virgen.
**Gate**: install limpio en proyecto virgen → Button+tema funcionando; budgets publicados; ⚠️ requiere confirmar **licencia y visibilidad** (supuesto #11).

Dos obligaciones del consumidor que la librería no puede resolver por él y que el README debe declarar:

- **Cargar la tipografía** (ADR-031). La librería no emite `@font-face`; el tema declara la familia y la
  app la carga o sobrescribe `font.family`. Sin esto recibe una tipografía distinta de la del catálogo,
  en silencio.
- **No envolver `NebulaProvider` en un ancestro con `transform`, `filter` o `contain`** (ADR-030). El
  contenido de overlay se portaliza dentro del subárbol del provider; esas propiedades crean bloque
  contenedor y desplazarían el overlay.

### W6 — Premium web

**Entregables**: registry privado + mecánica de licencias (mini-ADR — supuesto #5); superficie **web** de `@stellaria/nebula-commerce`, `-sales`, `-payments`, `-people`, `-maps` (entidades duck-typed, cero imports de apps); galería Premium en playground web; publicación premium web.
**Gate**: instalación premium externa de los 5 (web); cada paquete consume solo core+hooks+icons.

## Etapa 3 — Theme Creator _(paralela: TC.1 tras W1 · TC.2 tras W2 · TC.3 tras W4; no bloquea W5)_

### TC — Theme Creator

**Entregables**: MVP (editor + preview + export/import JSON) → validación AA en vivo + generación de paletas (motores de tools/) → preview con catálogo completo + temas reales `fonicredito` y `tfv-gold` (dogfooding).
**Gate**: round-trip completo; temas de las apps creados y validados AA.

## Etapa 4 — Native: desarrollo → publicación → premium

### N1 — Theming native + migración Stellaria + Tier 1 _(requiere W5)_

**Entregables**: runtime native (NebulaProvider sobre Unistyles, mismos temas JSON, storage inyectable); `apps/playground-native` (Expo 57 + SB-RN 10.5, stories CSF reutilizadas); **migración de los 39 componentes de Stellaria** con los refactors de 04 §2 (a11y TextInput/Textarea, fix Textarea dark, fix ChipGroup, split Header→FormField+Header, Action→ActionIcon); Tier 1 native restante (BottomSheet patrón FC, Select-sobre-sheet, Toast, overlays, feedback, data display core, navegación core); **lint de paridad W/N**.
**Gate**: paridad de contratos con web por lint; mismos temas JSON funcionando; testing contract + a11y por componente.

### N2 — Native Tier 2

**Entregables**: inputs completos native (fechas en Sheet, InputPhone/Dial/Currency, Signature Skia, pickers), data display (Table, List data, SectionList, SwipeableRow…), navegación completa (**TabBar + adapter react-navigation**), Search/Filters, PullToRefresh, overlays restantes, Drop/Drops, CardComplex native, genéricos de dominio, **`@stellaria/nebula-native-camera`** (captura básica).
**Gate**: ídem N1 + virtualización y gestos verificados en dispositivo.

### N3 — Native Tier 3

**Entregables**: **LiquidGlass** migrado + continuación plan v2; shaders; Animated Text (8); Micro-interactions (incl. AnimatedThemeToggle desde ST); Carousels; charts native (victory-native XL, contrato unificado); `useDeviceTier` generalizado.
**Gate**: Skia lazy-load (bundle base intacto); degradación low-end demostrada; reduced-motion total; catálogo native al 100% (o excepciones aprobadas).

### N4 — Publicación native v1 🚀

**Entregables**: publicación de `nebula-native` y `nebula-native-camera` + bumps coordinados; verificación en app Expo 57 virgen; docs de consumo.
**Gate**: install limpio → componentes+tema+BottomSheet funcionando; paridad de temas JSON web/native demostrada.

### N5 — Premium native + cierre premium _(requiere N4 + W6)_

**Entregables**: superficie **native** de los 5 paquetes premium con paridad de API contra W6 (Scanner sobre native-camera; motor de maps con comparativa); publicación de superficies native; galería premium en ambos playgrounds; cierre del programa premium.
**Gate**: lint de paridad premium en verde; instalación premium externa dual de los 5.

## Etapa 5 — Review

### R — Gate de migración y planes por app

**Entregables**: **re-verificación de la matriz** (re-`ls` + diff de APIs de fonicredito y tfv, que habrán evolucionado — riesgo #8); verificación del gate "lista para migrar" (04 §5.3) por app; planes detallados (`docs/migrations/fonicredito-plan.md` con codemod directo, `docs/migrations/tfv-plan.md` con migración total Mantine→Nebula); codemods escritos y probados **en seco** sobre copias.
**Gate**: criterios de 04 §5.3 en verde → la ejecución de las migraciones queda lista para decisión del propietario (fuera de este roadmap).

## Quality gates transversales (todas las fases)

typecheck TS7 estricto (lint con contingencia 5.9.3 — ADR-012) · lint (+reglas propias: no `"use client"` en presentacionales, no hex fuera de tokens, aria-label en solo-icono) · unit+interaction tests · axe sobre stories · contrast-check de temas · size-limit por entry · review ADR para toda dependencia nueva.

## Top-8 riesgos y mitigación

| #   | Riesgo                                                                                 | Prob./Impacto                                          | Mitigación                                                                                                                            |
| --- | -------------------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **TS 7 rompe el toolchain**                                                            | ~~media~~ **materializado parcial: typescript-eslint** | Contingencia aplicada (TS 5.9.3 solo en lint); revisión trimestral para retirar el pin (ADR-012)                                      |
| 2   | **Volumen** (~213 canónicos + premium) → fatiga/scope creep                            | alta/alto                                              | Tiers estrictos con gates; ninguna fase se abre sin la anterior verde; matriz 00 como única fuente de alcance                         |
| 3   | **Web desde cero + AA estricto**                                                       | media/alto                                             | React Aria como motor (ADR-003); axe CI desde W1; keyboard tests por patrón; piloto de anatomía en W1 antes de escalar                |
| 4   | **Deriva de paridad API W/N** (agravada por web-first: native llega una etapa después) | **alta**/medio                                         | Contratos en `nebula-tokens/types` desde F0; en la etapa web todo componente WN declara contrato compartido; lint de paridad desde N1 |
| 5   | **Skia/LiquidGlass en low-end**                                                        | media/medio                                            | `useDeviceTier` + quality tiers; lazy-load Tier 3; perf tests en playground                                                           |
| 6   | **Theme Creator scope creep**                                                          | alta/medio                                             | Spec cerrada (02 §5); MVP primero (TC.1); nuevas features requieren ADR                                                               |
| 7   | **@storybook/react-native 10 inmaduro**                                                | media/medio                                            | Stories CSF independientes del runner: fallback a catálogo Expo propio sin reescribir stories                                         |
| 8   | **Apps evolucionan mientras se construye la lib**                                      | alta/medio                                             | Re-verificación de la matriz como primer paso de R; congelar componentes nuevos en apps cuando exista equivalente Nebula publicado    |

## Supuestos pendientes de confirmar

> Avancé con estos supuestos para no bloquear; **ninguno se da por cerrado** hasta confirmación del propietario. Los items 1–3 fueron **confirmados el 2026-07-14**.

1. ~~`@stellaria/nebula-icons` como paquete separado~~ — **CONFIRMADO**.
2. ~~`@stellaria/nebula-people` y `@stellaria/nebula-maps`~~ — **CONFIRMADOS** ambos en el plan premium.
3. ~~Presets demostrativos `sober` y `playful`~~ — retirados en ADR-108; el catálogo oficial queda en `light` y `dark`.
4. **Valores finales de motion tokens y budgets de bundle**: provisionales, se calibran en W1/W2.
5. ~~**Mecánica del registry privado premium**~~ — **CERRADO por [ADR-113](adr/ADR-113-el-nucleo-es-mit-y-los-dominios-se-venden.md)** (2026-08-08): organización npm **privada** con token por cliente en su `.npmrc`, que es lo que conserva semver y `npm update`. Los seis paquetes de dominio nacen `private: true` y no se quitan nunca. Descartadas la venta del código fuente (sin ruta de actualización) y el registry autoalojado (infraestructura antes del primer cliente). **Changesets sigue abierto** como entregable de W5, que es donde toca.
6. ~~**TipTap vs Lexical**~~ + ~~**cmdk vs propio**~~ — **SUPUESTO CERRADO POR COMPLETO**. La mitad de cmdk la cerró **ADR-057/W3.4** (propio sobre React Aria; cmdk descartado al verificar que arrastra 4 paquetes de Radix, uno de ellos un sistema de diálogo completo). La del editor la cierra **ADR-061/W4.3**: TipTap 3.29.2 es definitivo y Lexical queda descartado por seguir en 0.x —mismo criterio que descartó `@dnd-kit/react` en ADR-060—, con W5 publicando el core.
7. **Jest para native** vs unificar en Vitest: propuesto Jest; validar al abrir N1.
8. ~~**Grupos de props de `CardComplex`**~~ — **RESUELTO en el checkpoint de W3.5**: `media`/`badges`/`actions`/`meta` + básicas planas, con `actions` como lista tipada `CardAction[]` con ranura de posición en vez de las cuatro props con nombre de tfv. Registrado en `docs/01` §4.
9. ~~**`caption: 8px`**~~ — **RESUELTO en ADR-024/W2.V**: `caption=12`, `body3=13` y ningún
   texto informativo o interactivo baja de 12 px.
10. **Storage de persistencia de tema** (MMKV recomendado, inyectable): confirmar que no debe imponerse.
11. ~~**Publicación pública vs privada del core** + **licencia**~~ — **CERRADO por [ADR-113](adr/ADR-113-el-nucleo-es-mit-y-los-dominios-se-venden.md)** (2026-08-08): el núcleo es **MIT y público**. `LICENSE` en la raíz y campo `license` en los seis paquetes; el paso de `private: true` a `publishConfig` es entregable de W5, no del ADR. Ya no bloquea W5.2 ni el pie del sitio.

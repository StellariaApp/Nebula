# Cierre de W3 — Web Tier 2

> Verificación del gate de `docs/05-roadmap.md` §W3. Fecha de cierre: 2026-07-30.
> Fases previas: `docs/f0-closure.md`, `docs/w1-closure.md`, `docs/w2-closure.md`.

## Estado

**W3 cerrada.** El catálogo web pasa de 68 componentes (W2) a **130** en
`packages/web/src/components`, con **755 tests** en `@stellaria/nebula-web`, 74 láminas de story y los
tres primeros **subpath exports** del paquete.

## Entregables contra el roadmap

| Tramo    | Entregable                                                                                                     | Estado |
| -------- | ---------------------------------------------------------------------------------------------------------------- | ------ |
| **W3.1** | Calendar, DatePicker(+Input), DateRangePicker, DateTimePicker, TimeInput, MonthPicker, YearPicker                | ✅     |
| **W3.1** | ColorInput/ColorPicker, FileInput, TagsInput, PinInput, Rating, Fieldset, JsonInput, Slider/RangeSlider, Chip     | ✅     |
| **W3.2** | InputPhone, InputDial, InputCurrency, Signature, Dropzone                                                        | ✅     |
| **W3.2** | Form orquestador, FormDelete, ModalDelete, Stepper (+`useStepper`)                                              | ✅     |
| **W3.2** | Autocomplete, SearchableSelect, CreatableSelect, AsyncSelect                                                     | ✅     |
| **W3.3** | Table, Timeline, Accordion genérico, GridList, Stat, Spoiler, Kbd, ThemeIcon, ColorSwatch, Image, Indicator, Tag, Banderole | ✅ |
| **W3.3** | StatusBadge (+StatusMapProvider), CurrencyDisplay, DateDisplay, InfiniteList, SearchableList, EmptyModule, QuickAction | ✅ |
| **W3.3** | PermissionGate + `usePermission`/`PermissionProvider` + prop `permission` en el catálogo                          | ✅     |
| **W3.4** | Search, Filter/Filters (descriptor declarativo)                                                                  | ✅     |
| **W3.4** | CommandPalette — subpath `/command`                                                                              | ✅     |
| **W3.4** | DataGrid básico — subpath `/datagrid`                                                                            | ✅     |
| **W3.4** | Charts básicos + SparkLine + TrendIndicator — subpath `/charts`                                                  | ✅     |
| **W3.5** | AppShell, Panel, Section, Main, Banner, Feature, Burger, NProgress, LoadingOverlay, Dialog, HoverCard, Affix, Overlay | ✅ |
| **W3.5** | **CardComplex** con los grupos de props cerrados en checkpoint                                                    | ✅     |

## Gate verificable

| Criterio                                       | Resultado                                                                 |
| ---------------------------------------------- | ------------------------------------------------------------------------- |
| `pnpm turbo build typecheck lint`              | **25/25 tareas**                                                          |
| `pnpm turbo test`                              | **755** web · 24 hooks · 27 themes · 15 icons                             |
| `pnpm --filter @stellaria/nebula-web size`     | **157 entradas · 0 excedidas**; 130/130 componentes con presupuesto        |
| `pnpm --filter playground-web a11y` (axe)      | **74 suites / 477 tests · 0 violaciones**                                 |
| `pnpm check:contrast`                          | 5 temas · 590 pares · **0 FAIL**                                          |
| Keyboard tests de DataGrid                     | sorting por cabecera, selección por casilla, paginación y fila con Enter   |
| Virtualización ≥50 items                       | `DataGrid` a partir de `virtualizeFrom` (50 por defecto), con test de umbral |
| Presets sober/playful                          | láminas `AllThemes` en cada familia nueva                                  |
| Subpaths aislados                              | ver §Subpaths                                                             |

## Subpaths

Tres exports nuevos, ninguno alcanzable desde el barrel. Verificado sobre `dist/index.js`: importar
`Button` pesa **50,46 kB** y no menciona `recharts`, `@tanstack/*`, `DataGrid`, `BarChart` ni
`CommandPalette`.

| Subpath     | Contenido                                    | Dependencias nuevas                              |
| ----------- | -------------------------------------------- | ------------------------------------------------ |
| `/command`  | CommandPalette + CommandScore                | **ninguna** (ADR-057)                            |
| `/datagrid` | DataGrid                                     | `@tanstack/react-table`, `@tanstack/react-virtual` |
| `/charts`   | Bar/Line/Area/Pie + SparkLine/TrendIndicator | `recharts`                                       |

El aislamiento no lo da el build sino que `src/index.ts` no reexporta nada de ellos; `preserveModules`
mantiene el árbol y cada entry sale por su lado.

## Decisiones tomadas en W3

19 ADRs entre el **040** y el **058**. Los que cambian contrato o cierran supuestos del roadmap:

| ADR     | Decisión                                                                                | Supuesto |
| ------- | ----------------------------------------------------------------------------------------- | -------- |
| **050** | El valor de fecha que cruza la API pública es un string ISO, no `Date`                    | —        |
| **051** | Banda «compuestos de fecha ≤90 kB» y sinceramiento de «colección ≤80»                     | —        |
| **054** | `Accordion` genérico sobre `Multiple` (cambio incompatible, asumido)                      | —        |
| **055** | El mapa de estados de `StatusBadge` **no** entra en `NebulaTheme`                          | —        |
| **056** | Prop `permission` en el catálogo + registro de keys por declaration merging                | —        |
| **057** | `CommandPalette` propio sobre React Aria; **cmdk descartado**                              | **#6** (mitad) |
| **058** | Deps de DataGrid y charts, con el coste de Recharts medido                                 | —        |
| —       | Grupos de props de `CardComplex` (checkpoint, registrado en `docs/01` §4)                  | **#8**   |

**ADR-038 queda ejecutado**: los cinco componentes que su regla 6 nombraba nacieron con su subconjunto
de `variant` — Chip (W3.1), Stepper (W3.2), StatusBadge (W3.3), CardComplex y Banner (W3.5). Ninguno
se escribió con receta local.

## Cobertura acumulada contra `00-inventory` §1

130 componentes en `packages/web/src/components` y 273 exports en el barrel. Contra el objetivo de
~213 componentes canónicos del catálogo completo (§2), eso deja el **web en torno al 61 %**, con la
salvedad de que la cuenta canónica incluye filas solo-native y familias que W4 desarrolla.

Sobre el alcance **web Tier 1 + Tier 2**, que es lo que W2 y W3 debían cubrir, el catálogo está
**completo**: no queda ninguna fila de §1 con `Plat` W/WN y `Tier` 1–2 sin implementar.

Lo que resta es Tier 3 y va a W4: Glass/Effects, DnD/Kanban, Rich Content (RichTextEditor,
CodeHighlight, EditorImage, Player, ImageGallery, Carousel), DataGrid avanzado, charts completos,
TransferList, VirtualizedSelect, GlobalSearch, TypographyStylesProvider y DirectionProvider (RTL).

## Deuda declarada

1. **La entrada del barrel de `size-limit` deriva.** `NebulaProvider` y `useTheme` se miden desde
   `dist/index.js`, así que acumulan el CSS de todo el catálogo y suben con cada componente: 60 → 66 kB
   y 20 → 22 kB a lo largo de W3. El propietario decidió conservar esa medición por la información que
   da; la alternativa —medir por módulo, como las otras 155 entradas— sigue sobre la mesa.
2. **Recharts arrastra Redux.** Medido: 113,94 kB brotli un `BarChart` mínimo. Está aislado en
   `/charts` y ADR-011 es decisión cerrada, pero el número queda escrito en ADR-058 por si el coste
   justifica reabrirla en W4, cuando lleguen los charts completos.
3. **`CommandPalette` no tiene páginas anidadas ni historial de comandos recientes** — las dos cosas
   que cmdk regalaba (ADR-057 §Consecuencias).
4. **La regla de lint de RSC sigue sin implementar** (`docs/03` §3): «los presentacionales no llevan
   `use client`» se verifica a ojo desde W2.

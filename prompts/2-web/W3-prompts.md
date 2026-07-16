# Prompts W3 — Web Tier 2

> 5 prompts secuenciales. Requiere W2 cerrado (`docs/w2-closure.md`). Mismo bloque común que W2 (cópialo de `W2-prompts.md (misma carpeta)` al inicio de cada prompt, cambiando "W1 cerrado" por "W2 cerrado").

---

## Prompt W3.1 — Inputs de fecha/hora + pickers restantes

```
[BLOQUE COMÚN de W2, con W2 cerrado]

MISIÓN (00-inventory §1.4 Tier 2):
1. Fechas: Calendar, DatePicker/DatePickerInput, DateRangePicker, DateTimePicker, TimeInput,
   MonthPicker, YearPicker. Motor: hooks de fecha de React Aria (useDatePicker/useCalendar) +
   @internationalized/date — es dependencia nueva: confirma su coste en el reporte (viene con React
   Aria, debería estar justificada; si el bundle sorprende, pregunta).
2. Pickers: ColorInput + ColorPicker (swatches/sliders/formatos), FileInput, TagsInput, PinInput
   (celdas con auto-focus), Rating, Fieldset, JsonInput (validación en vivo; syntax highlight solo si
   ya quedó resuelto en W2.2, si no textarea monospace).
Contrato a11y de docs\03 §1 en todos; i18n de calendarios (semana inicia según locale).

REPORTE: tabla componente→estado + coste de bundle de la cadena de fechas.
```

## Prompt W3.2 — Inputs compuestos + Form orquestador

```
[BLOQUE COMÚN de W2, con W3.1 cerrado]
LEE ADEMÁS: docs\api\fonicredito-components.md §7 y docs\api\tfv-components.md §3 (las APIs reales que
estos componentes deben poder cubrir).

MISIÓN:
1. InputPhone + InputDial (dial codes con búsqueda y bandera; field+fieldDial como FC), InputCurrency
   (máscara/formato Intl), Signature (canvas web: draw/clear/undo/export; contrato field),
   Dropzone (tipos image/file/pdf/video, preview, field).
2. Form (orquestador: header/banderole/footer/submit/cancel/error — referencia TFV FormProps),
   FormDelete y ModalDelete (patrón confirmación destructiva), Stepper (wizard con useStepper en hooks).
3. Autocomplete + Combobox patterns (§1.5): SearchableSelect (renderOption slot), CreatableSelect,
   AsyncSelect (debounce+loading).

REPORTE: story de formulario multi-paso completo (Stepper+Form+inputs+Zod) como fixture integral.
```

## Prompt W3.3 — Data display extendido + genéricos de dominio

```
[BLOQUE COMÚN de W2, con W3.2 cerrado]

MISIÓN:
1. Data display (§1.6 Tier 2): Table (+ScrollContainer; compound Header/Row/Cell — referencia de API:
   FC Table), Timeline, Accordion (multiple tipado como FC), GridList (conmutador list/grid/carousel
   con contrato de items GENÉRICO — no CardProps), Stat, Spoiler, Kbd, ThemeIcon, ColorSwatch,
   Image/BackgroundImage, Indicator, Tag/Pill, Banderole.
2. Genéricos de dominio (§1.18 → core): StatusBadge (mapa semántico configurable por theme),
   CurrencyDisplay, DateDisplay (relative/absolute), InfiniteList + SearchableList (integración
   TanStack Query duck-typed — SIN dependencia directa), EmptyModule, QuickAction.
3. PermissionGate + PermissionProvider + usePermission en hooks (docs\01 §6, resolver inyectable,
   keys tipadas por generics).

REPORTE: tabla componente→estado + demo de PermissionGate con resolver de ejemplo.
```

## Prompt W3.4 — Search/Filters + CommandPalette + DataGrid básico + charts básicos

```
[BLOQUE COMÚN de W2, con W3.3 cerrado]
LEE ADEMÁS: docs\adr\ADR-011-charts.md (contrato unificado de charts).

MISIÓN:
1. Search (slots), Filter/Filters (descriptor declarativo `Filter` — referencia TFV: select/multiselect/
   radio/range/date/text), SearchInput ya existe.
2. CommandPalette (cmdk provisional — si al integrarlo ves razón para hacerlo propio sobre Combobox,
   PREGUNTA con comparativa: es el supuesto #6 del roadmap).
3. DataGrid básico (subpath @stellaria/nebula-web/datagrid): TanStack Table engine + UI propia —
   sorting, selección de filas, paginación integrada, virtualización (react-virtual) ≥50 filas.
4. Charts básicos (subpath /charts): wrappers Recharts con contrato unificado (data/series/axes/
   tooltip/legend + theming por tokens): BarChart, LineChart, AreaChart, PieChart/Donut + SparkLine
   + TrendIndicator. A11y: resumen textual + tabla de datos fallback (docs\03 §1).

REPORTE: verificación de subpaths (importar Button NO arrastra datagrid/charts — size-limit).
```

## Prompt W3.5 — AppShell + CardComplex + overlays restantes + cierre Tier 2

```
[BLOQUE COMÚN de W2, con W3.4 cerrado]

MISIÓN:
1. AppShell (+Header/Navbar/Aside/Footer/Main, colapsable, responsive, skip-links), Panel
   (master-detail con resize), Section, Main, Banner (hero configurable — referencia TFV §6),
   Feature, Burger, NProgress, LoadingOverlay, Dialog, HoverCard, Affix, Overlay.
2. **CardComplex** sobre los compounds de W2.5, con las props de TFV REORGANIZADAS en grupos
   (media/badges/actions+permission/meta — boceto en docs\01 §4). ⚠️ CHECKPOINT OBLIGATORIO: antes de
   implementar, presenta al propietario la propuesta final de grupos de props (supuesto #8 del roadmap)
   con 2-3 alternativas donde haya trade-off. No implementes sin su respuesta.
3. CIERRE DE W3: gate de docs\05-roadmap.md W3 → docs\w3-closure.md.

REPORTE: cierre de W3 + cobertura acumulada contra 00-inventory §1 (qué % del catálogo web está hecho).
```

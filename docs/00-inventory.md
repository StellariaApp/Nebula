# 00 — Inventario y matriz de cobertura de Nebula

> Estado: **cerrado en Checkpoint 1 (2026-07-14)** — las 7 decisiones de frontera están registradas en §6.
> Fuentes verificadas con `ls`/lecturas reales (ver anexos `api/`).

## Metodología y fuentes

La matriz cruza **5 fuentes**:

| Sigla   | Fuente                                                           | Volumen verificado                                        |
| ------- | ---------------------------------------------------------------- | --------------------------------------------------------- |
| **P2**  | Catálogo native `Stellaria/docs/phase-2-ui-native-components.md` | 177 items                                                 |
| **P3**  | Catálogo web `Stellaria/docs/phase-3-ui-web-components.md`       | 204 items                                                 |
| **ST**  | Implementado en `Stellaria/src/ui/native`                        | 39 componentes ([anexo C](api/stellaria-native.md))       |
| **FC**  | `fonicredito-app/src/services/shared/components`                 | 52 componentes ([anexo A](api/fonicredito-components.md)) |
| **TFV** | `tfv-frontend/packages/components`                               | 117 componentes ([anexo B](api/tfv-components.md))        |

**Criterio de aceptación**: el 100% de FC (52) y TFV (117) aparece en las tablas de disposición (§4 y §5) con destino y justificación.

### Leyenda

- **Plataforma**: `W` web · `N` native · `WN` ambas con API unificada.
- **Destino**: `core` (`@stellaria/nebula-web` / `@stellaria/nebula-native`) · `dominio` (paquetes premium vendibles `@stellaria/nebula-sales|commerce|payments…` — ver §1.18) · `app` (permanece en la app, reconstruido sobre primitivas Nebula) · `descartar` (cubierto por otro componente o sin valor).
- **Tier**: prioridad 1/2/3 según catálogos (Tier 1 = core inicial).
- **Clasificación**: `prim` primitivo · `comp` compuesto · `patrón` · `dom` dominio-específico · `app` app-específico.

---

## 1. Matriz canónica — componentes de Nebula

Una fila por componente canónico. Los nombres de consumidores que mapean a cada fila están en §4/§5.

### 1.1 Foundation / Layout

| Componente                                  | Clas.  | Plat | Tier | Fuentes                                     | Destino | Base de migración / nota                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------------------------- | ------ | ---- | ---- | ------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Box                                         | prim   | WN   | 1    | P2·P3·ST·FC(View)                           | core    | ST Box (native); web nuevo con sprinkles                                                                                                                                                                                                                                                                                                                                                                                        |
| Flex                                        | prim   | WN   | 1    | P2·P3·ST·FC(View)                           | core    | ST Flex                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Row / Column                                | prim   | N    | 1    | P2·ST                                       | core    | ST Row/Column (azúcar sobre Flex; web usa Flex)                                                                                                                                                                                                                                                                                                                                                                                 |
| Center                                      | prim   | WN   | 1    | P2·P3·ST                                    | core    | ST Center                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Group                                       | prim   | WN   | 1    | P2·P3·ST·TFV                                | core    | ST Group (store Jotai); el Group de TFV es otra cosa (ver §5)                                                                                                                                                                                                                                                                                                                                                                   |
| Grid / Grid.Col                             | comp   | WN   | 1    | P2·P3·ST·TFV                                | core    | ST Grid (Jotai store)                                                                                                                                                                                                                                                                                                                                                                                                           |
| SimpleGrid                                  | prim   | WN   | 1    | P2·P3·ST(Grid.Simple)                       | core    | ST Grid.Simple                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Container                                   | prim   | WN   | 1    | P2·P3·ST·TFV                                | core    | ST Container; el Container de TFV es un patrón de sección (→ Section)                                                                                                                                                                                                                                                                                                                                                           |
| SafeArea                                    | prim   | N    | 1    | P2·ST·FC                                    | core    | ST SafeArea                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Scroll                                      | prim   | WN   | 1    | P2·P3·ST·FC                                 | core    | ST Scroll (+gesture inyectable de FC); web añade `shadows` y `smooth` sin JS, y `momentum` con un subcomponente cliente que no le quita RSC ([ADR-069](adr/ADR-069-indicadores-de-scroll-y-momentum.md)). `momentum` es solo web: en native lo da `ScrollView` con `decelerationRate`                                                                                                                                           |
| Divider                                     | prim   | WN   | 1    | P2·P3·ST·FC·TFV                             | core    | ST Divider; web añade `label` (cubre TFV DividerTitle)                                                                                                                                                                                                                                                                                                                                                                          |
| Space                                       | prim   | WN   | 1    | P2·P3·ST                                    | core    | ST Space                                                                                                                                                                                                                                                                                                                                                                                                                        |
| AspectRatio                                 | prim   | WN   | 1    | P2·P3·ST                                    | core    | ST AspectRatio                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Paper                                       | prim   | WN   | 1    | P2·P3·ST·TFV                                | core    | ST Paper (shadowMap iOS/Android)                                                                                                                                                                                                                                                                                                                                                                                                |
| Pressable                                   | prim   | N    | 1    | P2(§10)·ST                                  | core    | ST Pressable (scale+haptic)                                                                                                                                                                                                                                                                                                                                                                                                     |
| AppShell (+Header/Navbar/Aside/Footer/Main) | comp   | W    | 1    | P3·TFV(Navbar/Sidebar/Footer/Aside/Sidenav) | core    | Nuevo; absorbe el shell de TFV. **Los cinco nombres del paréntesis no son exports**: son props de slot (`header`, `navbar`, `aside`, `footer`) más `contentId` para el `<main>`                                                                                                                                                                                                                                                 |
| Panel                                       | patrón | W    | 2    | P3·TFV                                      | core    | Nuevo (master-detail con resize); API inspirada en TFV Panel                                                                                                                                                                                                                                                                                                                                                                    |
| Main                                        | patrón | WN   | 1    | P2·FC·TFV                                   | core    | FC Main (header/footer/background/keyboard) como referencia de API. **ADR-070** le anade `contentWidth` (carril de pagina) y `spacing` (ritmo vertical), ambas apagadas por defecto: el uso dominante es el dashboard dentro de `AppShell`                                                                                                                                                                                      |
| Section                                     | patrón | W    | 2    | TFV(Container/Section)                      | core    | Nuevo; sección con title/slots/loading/error — generaliza TFV Container. **ADR-070** le añade `reveal` (anima el propio `<section>`, sin envoltorio) y `contentWidth`, **que vale 1180 por defecto**: toda sección queda acarrilada como la `Nav`. En dashboard se recupera el ancho completo con `contentWidth="none"`                                                                                                         |
| Header (screen/TopBar)                      | comp   | WN   | 1    | P2(§8)·ST·FC                                | core    | **ADR-062**: entregado en web el 2026-07-31 (checkpoint de WR1.1). Es la mitad screen-header del `Header` de ST tras la partición de `04-migration-map.md` L51 —la mitad field-header ya es `FormField`—. Raíz `<div>`, no `<header>`: el landmark `banner` lo pone `AppShell`. **Sin scroll-collapse**: el estado flotante vivió aquí un día (enmienda 1) y se mudó a `Nav` el 2026-08-01 (**ADR-068**, enmienda 2 de ADR-062) |

### 1.2 Typography

| Componente               | Clas. | Plat | Tier | Fuentes                    | Destino | Base / nota                                                  |
| ------------------------ | ----- | ---- | ---- | -------------------------- | ------- | ------------------------------------------------------------ |
| Text                     | prim  | WN   | 1    | P2·P3·ST·FC·TFV(Paragraph) | core    | ST Text (TextGlass/TextGradient); `isLoading`+skeleton de FC |
| Title                    | prim  | WN   | 1    | P2·P3·ST                   | core    | ST Title                                                     |
| Anchor / Link            | prim  | WN   | 1    | P2·P3·ST·TFV(Link)         | core    | ST Anchor; web integra adapter de router (Next Link)         |
| Highlight                | prim  | WN   | 1    | P2·P3·ST                   | core    | ST Highlight                                                 |
| Mark                     | prim  | WN   | 1    | P2·P3·ST                   | core    | ST Mark                                                      |
| Code                     | prim  | WN   | 1    | P2·P3·ST                   | core    | ST Code (refractor)                                          |
| Blockquote               | prim  | WN   | 2    | P2·P3·ST                   | core    | ST Blockquote                                                |
| List (tipográfica)       | prim  | WN   | 2    | P2·P3·ST                   | core    | ST List (Jotai)                                              |
| TypographyStylesProvider | util  | W    | 2    | P3                         | core    | Nuevo                                                        |

### 1.3 Buttons & Actions

| Componente           | Clas. | Plat | Tier | Fuentes                         | Destino | Base / nota                                                                                                   |
| -------------------- | ----- | ---- | ---- | ------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------- |
| Button (+Group)      | prim  | WN   | 1    | P2·P3·ST·FC·TFV                 | core    | ST Button (ripple, variants, gradient)                                                                        |
| ActionIcon (+Group)  | prim  | WN   | 1    | P2·P3·ST(Action)·FC(Action)·TFV | core    | ST Action. **No hay `ActionIconGroup`**: el `+Group` lo cubre `ButtonGroup`, genérico sobre `Box` a propósito |
| ButtonClose          | prim  | WN   | 1    | P2·P3·ST                        | core    | ST ButtonClose                                                                                                |
| ButtonCopy           | prim  | WN   | 2    | P2·P3·ST                        | core    | ST ButtonCopy                                                                                                 |
| ButtonFloating (FAB) | prim  | N    | 2    | P2·ST                           | core    | ST ButtonFloating                                                                                             |
| FileButton           | prim  | W    | 2    | P3                              | core    | Nuevo                                                                                                         |
| UnstyledButton       | prim  | W    | 1    | P3                              | core    | Nuevo (base polimórfica)                                                                                      |

### 1.4 Inputs & Forms

| Componente                          | Clas. | Plat                    | Tier | Fuentes                                       | Destino | Base / nota                                                                                 |
| ----------------------------------- | ----- | ----------------------- | ---- | --------------------------------------------- | ------- | ------------------------------------------------------------------------------------------- |
| FormField (Input.Wrapper)           | comp  | WN                      | 1    | P2·P3·ST(Header)·FC(Header/Error)·TFV(Header) | core    | ST Header + spec de stellaria-input-components-plan; contrato `field` duck-typed form-atoms |
| TextInput                           | prim  | WN                      | 1    | P2·P3·ST·FC·TFV                               | core    | ST TextInput (⚠️ añadir a11y)                                                               |
| NumberInput                         | prim  | WN                      | 1    | P2·P3·TFV                                     | core    | Nuevo                                                                                       |
| PasswordInput                       | prim  | WN                      | 1    | P2·P3·ST                                      | core    | ST PasswordInput                                                                            |
| Textarea                            | prim  | WN                      | 1    | P2·P3·ST                                      | core    | ST Textarea (fix dark mode pendiente)                                                       |
| SearchInput                         | prim  | WN                      | 1    | P2·FC·TFV                                     | core    | Nuevo; debounce integrado (`useDebounce` ST)                                                |
| Select                              | comp  | WN                      | 1    | P2·P3·FC(InputSelect)·TFV                     | core    | Native: sobre BottomSheet (patrón FC); web: sobre Combobox                                  |
| MultiSelect                         | comp  | WN                      | 1    | P2·P3                                         | core    | —                                                                                           |
| NativeSelect                        | prim  | W                       | 2    | P3                                            | core    | `<select>` nativo                                                                           |
| Autocomplete                        | comp  | W                       | 2    | P3                                            | core    | Sobre Combobox                                                                              |
| Combobox (primitiva)                | prim  | W                       | 1    | P3                                            | core    | React Aria useComboBox como motor                                                           |
| TagsInput                           | comp  | WN                      | 2    | P2·P3                                         | core    | —                                                                                           |
| Checkbox (+Group)                   | prim  | WN                      | 1    | P2·P3·ST·FC(InputCheckbox)                    | core    | ST Checkbox                                                                                 |
| Radio (+Group)                      | prim  | WN                      | 1    | P2·P3                                         | core    | Nuevo                                                                                       |
| Switch (+Group)                     | prim  | WN                      | 1    | P2·P3·ST·FC(Toggle)·TFV(InputSwitch)          | core    | ST Switch                                                                                   |
| Slider / RangeSlider                | prim  | WN                      | 2    | P2·P3·TFV(InputSlider)                        | core    | Nuevo                                                                                       |
| Segment (Control + Content)         | comp  | WN                      | 1    | P2·P3·ST·FC(Segment)·TFV(Segment)             | core    | **ADR-026**: absorbe SegmentedControl; sin `Content` es el selector de valor (radiogroup)   |
| Chip (+Group)                       | prim  | WN                      | 2    | P2·P3·ST                                      | core    | ST Chip (fix ChipGroup selección)                                                           |
| PinInput                            | prim  | WN                      | 2    | P2·P3                                         | core    | Nuevo                                                                                       |
| Rating                              | prim  | WN                      | 2    | P2·P3·TFV                                     | core    | Nuevo                                                                                       |
| FileInput                           | prim  | WN                      | 2    | P2·P3                                         | core    | Nuevo                                                                                       |
| ColorInput / ColorPicker            | comp  | W(N picker simple)      | 2    | P2·P3·TFV(InputColor)                         | core    | Nuevo                                                                                       |
| JsonInput                           | prim  | W                       | 3    | P3                                            | core    | Nuevo                                                                                       |
| DatePicker / DatePickerInput        | comp  | WN                      | 2    | P2·P3·FC(InputCalendar)                       | core    | Native: calendar en Sheet (patrón FC)                                                       |
| DateTimePicker / TimeInput          | comp  | WN                      | 2    | P2·P3                                         | core    | —                                                                                           |
| DateRangePicker                     | comp  | WN                      | 2    | P2·P3                                         | core    | —                                                                                           |
| Calendar / MonthPicker / YearPicker | comp  | WN(Calendar) W(pickers) | 2    | P2·P3                                         | core    | —                                                                                           |
| Fieldset                            | prim  | WN                      | 2    | P2·P3                                         | core    | —                                                                                           |
| InputPhone                          | comp  | WN                      | 2    | P2·P3·FC                                      | core    | FC InputPhone (field+fieldDial) como referencia de API                                      |
| InputDial                           | comp  | WN                      | 2    | P3·FC(Dial)                                   | core    | —                                                                                           |
| InputCurrency                       | comp  | WN                      | 2    | P2·P3                                         | core    | Máscara numérica; display → CurrencyDisplay                                                 |
| Signature                           | comp  | WN                      | 2    | P3·FC·TFV                                     | core    | FC Signature (Skia) native; web canvas nuevo                                                |
| Dropzone                            | comp  | W                       | 2    | P3(§14)·TFV                                   | core    | Nuevo; contrato `field`                                                                     |

> **§1.4 cerrada tras W3.2.** `InputPhone`, `InputDial`, `InputCurrency`, `Signature` y `Dropzone`
> se entregaron en W3.2. `InputPhone` gobierna dos valores —número nacional y **código ISO** del país,
> no el prefijo (ADR-053 punto 6)—; el dataset de 227 prefijos vive en `collections/dial-codes` y
> mide 866 B. `Dropzone` **no recibe `variant`** (ADR-038, sexta exclusión): su superficie ya la
> gobierna el estado de arrastre.

> **§1.4 completa tras W3.1.** `Slider/RangeSlider`, `Chip (+Group)` y `NativeSelect` son Tier 2 de
> esta sección y no aparecían en ningún prompt de W3; se absorbieron en W3.1 por decisión del
> propietario (checkpoint de apertura). `GradientText` (ADR-043, adelantado de W4 a W3) también se
> entregó en W3.1 y queda desglosado en §1.13 como Tier 2.

> **Eje `surface` (ADR-042, ejecutado en W3.1)**: todo campo de esta sección acepta
> `surface="outline" | "filled" | "underline" | "unstyled"`, con `outline` por defecto. Es una
> variante del recipe compartido `styles/field.css.ts` —zero-runtime, sin `ResolveVariant` y sin
> entrar en `NebulaTheme`—, y se declara en el `FormField` raíz, no en el control interno.
> `glass`, `glow` y `gradient` quedan excluidos por contrato (`docs/06` §6).

> **Valor de las fechas (ADR-050)**: `DatePicker`, `DatePickerInput`, `Calendar`, `DateTimePicker`,
> `TimeInput`, `MonthPicker` y `YearPicker` exponen **strings ISO 8601**
> (`YYYY-MM-DD`, `HH:mm`, `YYYY-MM-DDTHH:mm`, `YYYY-MM`, `YYYY`) y `DateRangePicker` usa
> `DateRange` de `@stellaria/nebula-tokens`. `@internationalized/date` es motor interno y no aparece
> en la API pública, de modo que el contrato `WN` no obliga a `packages/native` a adoptarla.

### 1.5 Combobox Patterns (web)

| Componente        | Clas.  | Plat | Tier | Fuentes         | Destino | Nota                                                                           |
| ----------------- | ------ | ---- | ---- | --------------- | ------- | ------------------------------------------------------------------------------ |
| SearchableSelect  | patrón | W    | 2    | P3·TFV(Option*) | core    | Con slot `renderOption` (cubre Option de TFV; Option\<Entidad\> quedan en app) |
| CreatableSelect   | patrón | W    | 2    | P3              | core    | —                                                                              |
| AsyncSelect       | patrón | W    | 2    | P3              | core    | —                                                                              |
| TransferList      | patrón | W    | 3    | P3              | core    | —                                                                              |
| VirtualizedSelect | patrón | W    | 2    | P3              | core    | TanStack Virtual                                                               |

> **§1.5 en W3.2**: `SearchableSelect`, `CreatableSelect` y `AsyncSelect` se entregaron como
> composiciones sobre la primitiva `Combobox`, junto a `Autocomplete` (§1.4). Los cuatro miden lo
> mismo que `Combobox` más unos cientos de bytes. `TransferList` y `VirtualizedSelect` siguen
> pendientes (W4 y W3.4).

### 1.6 Data Display

| Componente                              | Clas.  | Plat | Tier | Fuentes                      | Destino   | Base / nota                                                                                                                                                                                                                       |
| --------------------------------------- | ------ | ---- | ---- | ---------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Card (+Section, compound) y CardComplex | comp   | WN   | 1    | P2·P3·FC·TFV                 | core      | C1-Q4: **dual** — compound primitives + `CardComplex` de alto nivel construido sobre ellos, con las props de TFV reorganizadas en grupos (media, badges, actions con permission, meta)                                            |
| Avatar (+Group)                         | prim   | WN   | 1    | P2·P3·TFV                    | core      | Nuevo                                                                                                                                                                                                                             |
| Badge                                   | prim   | WN   | 1    | P2·P3·FC·TFV                 | core      | Nuevo (variantes FC/TFV como referencia)                                                                                                                                                                                          |
| Tag / Pill                              | prim   | WN   | 2    | P2(Tag)·P3·TFV(Pill)         | core      | Badge removible                                                                                                                                                                                                                   |
| Indicator                               | prim   | WN   | 2    | P2·P3·FC(Bell dot)·TFV(Bell) | core      | Cubre el "Bell genérico" (contador + dot)                                                                                                                                                                                         |
| Image / BackgroundImage                 | prim   | WN   | 1    | P2·P3                        | core      | expo-image native                                                                                                                                                                                                                 |
| Accordion                               | comp   | WN   | 1    | P2·P3·FC·TFV                 | core      | FC Accordion (multiple genérico) como referencia de API                                                                                                                                                                           |
| Timeline                                | comp   | WN   | 2    | P2·P3                        | core      | —                                                                                                                                                                                                                                 |
| Table (+ScrollContainer)                | comp   | WN   | 2    | P2·P3·FC                     | core      | FC Table (compound Header/Row/Title/Cell) como base de API                                                                                                                                                                        |
| ListItem / SwipeableRow                 | comp   | N    | 2    | P2                           | core      | —                                                                                                                                                                                                                                 |
| SectionList                             | comp   | N    | 2    | P2                           | core      | —                                                                                                                                                                                                                                 |
| List (data, FlatList)                   | comp   | N    | 1    | FC·P2(InfiniteList §15)      | core      | FC List (layout animations, gesture)                                                                                                                                                                                              |
| Spoiler                                 | prim   | WN   | 2    | P2·P3                        | core      | —                                                                                                                                                                                                                                 |
| Kbd                                     | prim   | WN   | 3    | P2·P3                        | core      | —                                                                                                                                                                                                                                 |
| ThemeIcon                               | prim   | WN   | 2    | P2·P3                        | core      | —                                                                                                                                                                                                                                 |
| ColorSwatch                             | prim   | WN   | 2    | P2·P3                        | core      | —                                                                                                                                                                                                                                 |
| Stat                                    | comp   | WN   | 2    | P2·P3                        | core      | —                                                                                                                                                                                                                                 |
| EmptyState                              | comp   | WN   | 1    | P2·P3·TFV(Empty/NotFound)    | core      | TFV Empty como referencia de API                                                                                                                                                                                                  |
| Banderole                               | prim   | W    | 3    | P3·TFV                       | core      | —                                                                                                                                                                                                                                 |
| GridList                                | patrón | W    | 2    | P3·TFV                       | core      | Conmutador list/grid/carousel; contrato de items genérico (no CardProps de TFV)                                                                                                                                                   |
| Shadow                                  | util   | N    | 2    | P2                           | descartar | Cubierto por Paper + shadow tokens (así lo hace ST)                                                                                                                                                                               |
| Hero (antes `Banner`)                   | comp   | W    | 2    | TFV                          | core      | C1-Q5 lo aprobó como `Banner`. **ADR-070 enmienda 2**: renombrado a `Hero` y realineado a banda de página — `order={1}`, `contentWidth={1180}`, a sangre y sin radio por defecto. Comparte carril con `Nav`, `Section` y `Footer` |
| Feature                                 | comp   | W    | 3    | TFV                          | core      | C1-Q5: aprobado                                                                                                                                                                                                                   |

### 1.7 Data Grid (web)

| Componente                                              | Clas.  | Plat | Tier | Fuentes | Destino                      |
| ------------------------------------------------------- | ------ | ---- | ---- | ------- | ---------------------------- |
| DataGrid (+Toolbar/Pagination/ColumnHeader/FilterPanel) | patrón | W    | 2-3  | P3      | core (TanStack Table engine) |

### 1.8 Feedback & Status

| Componente                       | Clas. | Plat | Tier | Fuentes                    | Destino | Base / nota                                                                                                                                                                   |
| -------------------------------- | ----- | ---- | ---- | -------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Alert                            | comp  | WN   | 1    | P2·P3·TFV(Warning)         | core    | —                                                                                                                                                                             |
| Toast / Notification (+provider) | comp  | WN   | 1    | P2·P3·FC(Toast)·TFV(Alert) | core    | Visual/gestos de FC Toast; Nebula provee provider+API imperativa propia (el store de la app se adapta)                                                                        |
| Loader                           | prim  | WN   | 1    | P2·P3·ST                   | core    | ST Loader (Circular/Dot/Dots — cubre FC Dots)                                                                                                                                 |
| CircleLoader                     | prim  | N    | 2    | P2                         | core    | Variante de Loader                                                                                                                                                            |
| Progress / RingProgress          | comp  | WN   | 1    | P2·P3·FC(Progress)         | core    | FC Progress (segmentos, spring/timing) como referencia. **No hay export `RingProgress`**: es `Progress type="ring"`, mismo criterio de eje de forma que ADR-041 para `Loader` |
| Skeleton                         | prim  | WN   | 1    | P2·P3·FC·TFV               | core    | FC Skeleton (shimmer/pulse) + integración `isLoading` en primitivos                                                                                                           |
| Countdown                        | comp  | WN   | 3    | P2                         | core    | Web entregado en W4.4; valor ISO (ADR-050)                                                                                                                                    |
| LoadingOverlay                   | comp  | WN   | 2    | P2·P3                      | core    | —                                                                                                                                                                             |
| NProgress                        | util  | W    | 3    | P3                         | core    | —                                                                                                                                                                             |

### 1.9 Overlays

| Componente                     | Clas. | Plat                | Tier | Fuentes                         | Destino | Base / nota                                                                                     |
| ------------------------------ | ----- | ------------------- | ---- | ------------------------------- | ------- | ----------------------------------------------------------------------------------------------- |
| Modal                          | comp  | WN                  | 1    | P2·P3·TFV                       | core    | Web: `<dialog>` + React Aria useDialog; TFV Modal (drawer/blurred/responsive) referencia de API |
| BottomSheet (Sheet)            | comp  | N (W drawer-bottom) | 1    | P2·FC(Sheet)                    | core    | FC Sheet (snap points, sheetId, draggable) — la mejor base existente                            |
| BottomSheetStack / ActionSheet | comp  | N                   | 2    | P2                              | core    | —                                                                                               |
| Drawer                         | comp  | WN                  | 1    | P2·P3·TFV(Aside/ViewDrawer)     | core    | —                                                                                               |
| Dialog                         | comp  | WN                  | 2    | P2·P3                           | core    | —                                                                                               |
| Popover                        | comp  | WN                  | 1    | P2·P3·TFV                       | core    | Web: Floating UI + React Aria                                                                   |
| Tooltip                        | comp  | WN                  | 1    | P2·P3·FC                        | core    | FC Tooltip (posiciones, arrow, autoHide) referencia native                                      |
| Menu / ContextMenu             | comp  | WN                  | 1    | P2·P3·TFV(Tooltip≡menú)         | core    | El "Tooltip" de TFV mapea aquí                                                                  |
| Overlay                        | prim  | WN                  | 2    | P2·P3·TFV(OverlayCancel visual) | core    | —                                                                                               |
| Affix                          | prim  | WN                  | 3    | P2·P3                           | core    | —                                                                                               |
| HoverCard                      | comp  | W(N long-press)     | 2    | P2·P3                           | core    | —                                                                                               |

### 1.10 Navigation

| Componente     | Clas. | Plat        | Tier | Fuentes                | Destino | Base / nota                                                                                                                                                                                                                                                                                                                                   |
| -------------- | ----- | ----------- | ---- | ---------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tabs           | comp  | WN          | 1    | P3·FC(Segment.Content) | core    | Sobre `Segment` (ADR-026); adelantado de W2.5                                                                                                                                                                                                                                                                                                 |
| TabBar         | comp  | N           | 2    | P2·FC                  | core    | C1-Q3: contrato propio (items declarativos) + adapter delgado de react-navigation                                                                                                                                                                                                                                                             |
| SegmentedNav   | comp  | N           | 2    | P2                     | core    | —                                                                                                                                                                                                                                                                                                                                             |
| Breadcrumbs    | comp  | W(N tablet) | 2    | P2·P3·TFV              | core    | Web entregado en la auditoría de cierre de W4: items declarativos, adapter por `component`, colapso de intermedios                                                                                                                                                                                                                            |
| NavLink        | comp  | WN          | 1    | P2·P3                  | core    | Enlace de barra **lateral**: vertical, con descripción, hijos colapsables y `PermissionGate`. No confundir con `Nav.Links.Link`                                                                                                                                                                                                               |
| Nav            | comp  | W           | 1    | Rosettee(site-header)  | core    | **ADR-068**: entregado el 2026-08-01. Barra de navegación de **sitio**, compound `Nav.Logo`/`.Links`/`.Links.Link`/`.Actions`/`.Divider`. Se queda el estado flotante que ADR-062 enmienda 1 había puesto en `Header`. El enlace activo sale de `useScrollSpy` (anclas), de `location.pathname` (rutas) o de `active` (router del consumidor) |
| Stepper        | comp  | WN          | 2    | P2·P3·TFV              | core    | —                                                                                                                                                                                                                                                                                                                                             |
| Pagination     | comp  | WN          | 1    | P2·P3·TFV              | core    | API declarativa (page/total/onChange); wiring de router queda en app                                                                                                                                                                                                                                                                          |
| Burger         | prim  | WN          | 2    | P2·P3                  | core    | —                                                                                                                                                                                                                                                                                                                                             |
| ScrollProgress | prim  | WN          | 3    | P2                     | core    | Web entregado en W4.4                                                                                                                                                                                                                                                                                                                         |

### 1.11 Command & Search (web-first)

| Componente       | Clas.  | Plat | Tier | Fuentes                              | Destino                                                              |
| ---------------- | ------ | ---- | ---- | ------------------------------------ | -------------------------------------------------------------------- |
| CommandPalette   | patrón | W    | 2    | P3                                   | core — **propio sobre React Aria**, subpath `/command` (**ADR-057**) |
| GlobalSearch     | patrón | W    | 3    | P3                                   | core                                                                 |
| Search (slots)   | patrón | WN   | 2    | P3·FC(HeaderFilter/BadgesFilter)·TFV | core — API por callbacks/searchParams; atoms quedan en app           |
| Filter / Filters | patrón | WN   | 2    | P3·TFV                               | core — descriptor declarativo `Filter` de TFV como base              |

### 1.12 Charts

| Componente                                     | Plat | Tier | Fuentes     | Destino                                                  |
| ---------------------------------------------- | ---- | ---- | ----------- | -------------------------------------------------------- |
| BarChart, LineChart, AreaChart, PieChart/Donut | WN   | 2-3  | P2·P3       | core (web: Recharts wrapper; native: Skia/Victory — ADR) |
| RadarChart                                     | W    | 3    | P3          | core                                                     |
| SparkLine, TrendIndicator                      | WN   | 2    | P2·P3       | core                                                     |
| ChartTooltip, ChartLegend                      | WN   | 3    | P3          | core                                                     |
| ChartPanel (grid de paneles)                   | W    | 3    | TFV(Charts) | core (utilidad menor)                                    |

### 1.13 Drag & Drop (web)

| Componente                                          | Tier | Fuentes | Destino        |
| --------------------------------------------------- | ---- | ------- | -------------- |
| DragDropContext, Draggable, Droppable, SortableList | 3    | P3      | core (dnd-kit) |
| KanbanBoard, KanbanColumn, KanbanCard               | 3    | P3      | core           |

### 1.14 Rich Content

| Componente                                          | Plat | Tier | Fuentes                        | Destino | Nota                                                                                                                                      |
| --------------------------------------------------- | ---- | ---- | ------------------------------ | ------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| RichTextEditor                                      | W    | 3    | P3·TFV(Editor)                 | core    | TipTap; contrato `field`                                                                                                                  |
| CodeHighlight (+Tabs)                               | W    | 3    | P3                             | core    | —                                                                                                                                         |
| Carousel                                            | WN   | 2    | P2·P3·TFV                      | core    | Web: Embla; native: propio                                                                                                                |
| BlurCarousel / CinematicCarousel / CircularCarousel | N    | 3    | P2                             | core    | —                                                                                                                                         |
| ImageGallery / Lightbox                             | WN   | 2    | P2·TFV(Preview/CarouselImages) | core    | TFV Preview (zoom/pan) referencia web                                                                                                     |
| Player                                              | W    | 3    | P3·TFV                         | core    | C1-Q5: aprobado; wrapper fino de react-player                                                                                             |
| EditorImage                                         | W    | 3    | P3·TFV                         | core    | C1-Q6: **peer-dependency opcional de Pintura** — Nebula publica el wrapper; cada consumidor trae su licencia/instalación                  |
| PoweredDocument                                     | W    | —    | P3·TFV                         | app     | El catálogo lo describe como "visor PDF" pero el real es un footer de marca para PDFs; el visor PDF sería componente nuevo si se necesita |

### 1.15 Effects / Glass / Shaders

| Componente                                                                             | Plat | Tier | Fuentes                           | Destino | Nota                                                                                                                                                                                                                                                                                               |
| -------------------------------------------------------------------------------------- | ---- | ---- | --------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LiquidGlass                                                                            | N    | 3    | ST (¡no está en P2!)              | core    | Migrar ST completo (plan v2 parcialmente implementado)                                                                                                                                                                                                                                             |
| GlassSurface                                                                           | WN   | 2    | P2·P3                             | core    | Tokens glass.surface                                                                                                                                                                                                                                                                               |
| GradientText                                                                           | WN   | 2    | P2·P3·ST(TextGradient)            | core    | **ADR-043**: adelantado de W4 a W3; entregado en W3.1. `background-clip: text` sobre `effects.gradients`; sin prop `animated`                                                                                                                                                                      |
| GradientBorder / GradientBackground / AnimatedGradient / MeshGradient / GrainyGradient | WN   | 3    | P2·P3                             | core    | W4. Los tokens `gradient.*` ya existen (`effects.gradients` en el contrato). Dos nombres no son exports: **`MeshGradient` es `MeshGradientBg`**, y **`GrainyGradient` es la prop `grain`** de `GradientBackground` y `MeshGradientBg` sobre `styles/noise.css` (resuelto en el checkpoint de W4.1) |
| BlurView / BlurOverlay                                                                 | WN   | 2    | P2·P3·ST(Blur factory)            | core    | ST Blur factory en Layout. **En web el export es `BlurOverlay`**; `BlurView` es el nombre de React Native y no existe en `packages/web`                                                                                                                                                            |
| NoiseTexture / NoiseOverlay                                                            | WN   | 3    | P2·P3                             | core    | **En web el export es `NoiseOverlay`**; `NoiseTexture` es la hoja reutilizable `styles/noise.css.ts` (`grain`, `noiseOpacity`) que consumen GlassSurface, GradientBackground y MeshGradientBg                                                                                                      |
| MeshGradient / GrainyGradient                                                          | WN   | 3    | P2·P3                             | core    | ⚠️ **Fila duplicada** de `GradientBorder / … / MeshGradient / GrainyGradient` (arriba); misma resolución: `MeshGradientBg` y la prop `grain`                                                                                                                                                       |
| StarField                                                                              | WN   | 3    | Rosettee (`stellaria-background`) | core    | **Adición aprobada en W4.1** (petición del propietario): retícula + estrellas de la identidad Stellaria, con parallax de scroll opcional. Entregado en web en W4.1                                                                                                                                 |
| Aurora, ChromaRing, EnergyOrb, SiriOrb, SkiaRipple, WaveScrawler                       | N    | 3    | P2                                | core    | Skia; lazy-load                                                                                                                                                                                                                                                                                    |
| Drop / Drops (decorativo)                                                              | N    | 3    | P2·FC                             | core    | FC Drop/Drops                                                                                                                                                                                                                                                                                      |

### 1.16 Animated Text & Micro-interactions (native-first)

| Componente                                                                                                    | Tier | Fuentes            | Destino | Nota                                  |
| ------------------------------------------------------------------------------------------------------------- | ---- | ------------------ | ------- | ------------------------------------- |
| AnimatedText, FadeText, StaggeredText, DynamicText, GooeyText, AnimatedMaskedText, CurvedMarquee, CountUpText | 3    | P2                 | core    | —                                     |
| GooeySwitch, ElasticSlider, SpinButton, FlexiButton, StackedChips                                             | 3    | P2                 | core    | —                                     |
| AnimatedThemeToggle                                                                                           | 3    | P2·ST(ThemeSwitch) | core    | ST ThemeSwitch (Skia) ya implementado |
| PullToRefresh                                                                                                 | 2    | P2·FC(Refresh)     | core    | —                                     |
| Pressable / Haptic                                                                                            | 1    | P2·ST·FC(utils)    | core    | ST Pressable + triggerHaptic          |

### 1.17 Utilities & Providers

| Componente                 | Plat | Tier | Fuentes                          | Destino     | Nota                                                                                                                                                                                                                        |
| -------------------------- | ---- | ---- | -------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Portal                     | WN   | 1    | P2·P3·TFV                        | core        | —                                                                                                                                                                                                                           |
| Transition                 | WN   | 1    | P2·P3                            | core        | Disparo por `mounted`                                                                                                                                                                                                       |
| Reveal                     | W    | 2    | —                                | core        | **ADR-070**: entregado el 2026-08-01. Mismo vocabulario de presets que `Transition`, disparo por **viewport**. `once` activado por defecto. El contenido se rinde visible y el estado oculto lo aplica un efecto en cliente |
| Collapse                   | WN   | 1    | P2·P3                            | core        | —                                                                                                                                                                                                                           |
| FocusTrap                  | W    | 1    | P2·P3                            | core        | Vía React Aria                                                                                                                                                                                                              |
| VisuallyHidden             | WN   | 1    | P2·P3                            | core        | —                                                                                                                                                                                                                           |
| MediaQuery / useMediaQuery | WN   | 2    | P2                               | core (hook) | Web entregado en la auditoría de cierre de W4: `useMediaQuery` + `useBreakpointUp/Down` en `@stellaria/nebula-hooks`                                                                                                        |
| KeyboardAware              | N    | 1    | P2·FC(Main)                      | core        | —                                                                                                                                                                                                                           |
| ThemeProvider              | WN   | 1    | P2·P3·ST(StellProvider)          | core        | **Se implementa como `NebulaProvider`** (docs/02 §4) — la fila nombra el concepto, no el export                                                                                                                             |
| ColorSchemeScript          | W    | 1    | P3                               | core        | Anti-flash SSR                                                                                                                                                                                                              |
| DirectionProvider          | W    | 3    | P3                               | core        | RTL                                                                                                                                                                                                                         |
| Conditional / Valid / Omit | WN   | 1    | P2·P3·FC·TFV                     | core        | C1-Q7: API unaria `when` + `fallback` (cubre el binario de TFV)                                                                                                                                                             |
| Invert / Grow / Wrap (TFV) | W    | —    | TFV                              | descartar   | Cubiertos por props de Flex/Group (`reverse`, `grow`, `wrap`)                                                                                                                                                               |
| Icon (sistema de iconos)   | WN   | 1    | TFV(Icon)·FC(@expo/vector-icons) | core        | ⚠️ Estrategia de iconos = ADR (checkpoint 2)                                                                                                                                                                                |
| IconPicker (Icons de TFV)  | W    | 3    | TFV                              | app         | Editor interno; sobre Select+Icon de Nebula                                                                                                                                                                                 |

### 1.18 Domain-Specific (P2 §15 + P3 §17) — CERRADO en C1-Q1: **paquetes de dominio premium (vendibles)**

Decisión del propietario: núcleos `@stellaria/nebula-web` + `@stellaria/nebula-native` gratuitos/base, y **dominios premium comercializables**. Propuesta de organización (a refinar en `01-architecture.md`):

Genéricos disfrazados de dominio → **core** (sin acoplamiento real; formateo/gating configurables):

| Componente                    | Plat | Fuentes            | Destino                                                                                                                                            |
| ----------------------------- | ---- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| StatusBadge                   | WN   | P2·P3              | core (Badge + mapa semántico **inyectado por provider**; colores del vocabulario del tema — **ADR-055**; `variant` hereda el subconjunto de Badge) |
| CurrencyDisplay               | WN   | P2·P3·FC(Currency) | core (FC Currency como base)                                                                                                                       |
| DateDisplay                   | WN   | P2·P3              | core                                                                                                                                               |
| InfiniteList / SearchableList | WN   | P2                 | core (TanStack Query duck-typed: `InfiniteQueryLike` estructural; las props sueltas ganan al objeto de query)                                      |
| PermissionGate                | WN   | P3                 | core (@stellaria/nebula-hooks `usePermission` con provider inyectable)                                                                             |
| EmptyModule                   | W    | P3                 | core (variante de EmptyState: superficie + ilustración + acción secundaria)                                                                        |
| QuickAction                   | WN   | P2·P3              | core (preset Card+ActionIcon; `variant` sobre la unión completa — **ADR-038**, enmienda W3.3)                                                      |
| Form (orquestador)            | WN   | P3·TFV             | core (banderole+header+fields+submit/cancel; no es form engine)                                                                                    |

Dominio real → **paquetes premium** (asignación propuesta; los paquetes se crean cuando su primer módulo se implemente, no antes):

| Paquete                           | Componentes                                                                                                  | Justificación de mercado                                            |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| `@stellaria/nebula-commerce`      | ProductCard, PriceTag, StockIndicator, CartItem, CartSummary, Categories/Category patterns                   | e-commerce/catálogo — demanda demostrada por tfv                    |
| `@stellaria/nebula-sales`         | OrderCard, InvoicePreview, ReceiptPreview, ReceiptView, NumPad, Scanner, ShipmentTracker, ShippingCalculator | ventas/POS — alineado con el roadmap POS de Stellaria               |
| `@stellaria/nebula-payments`      | CardSubscription/planes, checkout summary, payment status patterns                                           | suscripciones/pagos — demanda demostrada por tfv (Stripe)           |
| `@stellaria/nebula-people`        | UserCard, ContactCard, AvatarUser patterns, ActivityItem, NotificationItem                                   | CRM/equipo — transversal a dashboards                               |
| `@stellaria/nebula-native-camera` | Captura básica de foto (C1-Q2: sin detección KYC; VisionCamera wrapped mínimo)                               | mobile capture — la detección rostro/documento queda en fonicredito |
| `@stellaria/nebula-maps`          | Map/GoogleMap + geocoding a fields                                                                           | opcional por el peso de la dep de Google                            |

Regla de frontera: un componente entra a un paquete de dominio solo si (1) su semántica es de negocio pero **no** depende de un backend concreto (recibe entidades por props/duck-typing), y (2) es razonablemente universal dentro de su vertical. Lo que dependa de tipos/API de una app concreta permanece en esa app.

---

## 2. Conteo de la matriz canónica

- **Core confirmado**: ~214 componentes canónicos únicos WN/W/N (los 177 P2 + 204 P3 colapsan por API unificada; + adiciones aprobadas en C1-Q5: Hero (antes Banner), Feature, Player, Section, ChartPanel, ImageGallery-web; + LiquidGlass y EditorImage; + **StarField**, aprobado en el checkpoint de W4.1).
- **Dominios premium** (C1-Q1): ~24 componentes repartidos en `@stellaria/nebula-commerce`, `@stellaria/nebula-sales`, `@stellaria/nebula-payments` (+ `people` y `maps`, confirmados 2026-07-14) y `@stellaria/nebula-native-camera` (C1-Q2).
- **Descartes**: Shadow (P2), ActionRotate (FC), Invert/Grow/Wrap/DividerTitle/Warning/CarouselCards (TFV).

---

## 3. Inventario secundario (hooks / stores / utils / animations / providers / skills)

### 3.1 fonicredito-app `shared/`

| Recurso                                                                                                                                                      | Destino                                                  | Nota                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------- | -------------------------------------------------------------------------- |
| `hooks/useSheet, useModal, useTimer` (atom-family por id)                                                                                                    | core `@stellaria/nebula-hooks`                           | Patrón de overlays por id — rediseñar sin exigir Jotai al consumidor (ADR) |
| `hooks/useColors`                                                                                                                                            | core (absorbido por theme runtime)                       | —                                                                          |
| `hooks/useScroll, useWritting`                                                                                                                               | core `@stellaria/nebula-hooks`                           | `useWritting` ≈ `useDebounce` variante                                     |
| `hooks/useStepper`                                                                                                                                           | core (junto a Stepper, contrato form-atoms)              | —                                                                          |
| `hooks/useTheme`                                                                                                                                             | core (ThemeProvider Nebula)                              | —                                                                          |
| `hooks/useAlert`                                                                                                                                             | app (wiring) — Nebula expone API imperativa de Toast     | —                                                                          |
| `hooks/useNotifications, useDeviceToken, useExpoToken, useFaceDetection, useDocumentDetection, useUpdate*, useStoreUrl, useSplash`                           | app                                                      | negocio/infra                                                              |
| `animations/action, button, card, tooltip, background`                                                                                                       | core (absorbidas en los componentes Nebula equivalentes) | —                                                                          |
| `stores/sheet, modal, timer, stepper, theme, alerts`                                                                                                         | core (internos de Nebula, no expuestos)                  | —                                                                          |
| `stores/mmkv (atomWithMMKV), jotai`                                                                                                                          | core utils opcionales                                    | —                                                                          |
| `stores/camera, device, expo, fcm, flow, notifications, token, update, splash, logs`                                                                         | app                                                      | —                                                                          |
| `utils/theme (Get*Theme), luminance, transform (WithAlpha), animated (CreateAnimated)`                                                                       | core `@stellaria/nebula-tokens`/utils                    | Converge con ST                                                            |
| `utils/date, string, math, name, json, map, options, lodash, hash, intl, keyboard, interactions, filter, field, form, components, feedback(haptics), assets` | core utils (selección) / app                             | Revisión caso a caso en migración                                          |
| `utils/channel, notification-refetch, pageParam`                                                                                                             | app                                                      | —                                                                          |
| `layouts/Root, providers/*`                                                                                                                                  | app                                                      | árbol de providers propio; Nebula solo exige su ThemeProvider              |

### 3.2 tfv-frontend `packages/`

| Recurso                                                                                                                                             | Destino                                      | Nota                                                                    |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ----------------------------------------------------------------------- |
| `hooks/useModal, useAside, useSidebar, useStepper, useTimer, useAlert, useBadge, useUnmount, delay, dates, searchParams, theme, usePalette, scroll` | core `@stellaria/nebula-hooks` (rediseñados) | Los basados en searchParams se parametrizan (adapter de router)         |
| `hooks/usePWA, useLanguage, next.ts, upload, toSpeech, preview, editor, signature, location`                                                        | app                                          | —                                                                       |
| `hooks/useCompanyServices, useCompanyFee, useHasWebsite, useShareAddress, useCountNotifications, useAvatarUser, role, permissions, logout, dev`     | app                                          | dominio                                                                 |
| `stores/alert, modal, aside, sidebar, timer`                                                                                                        | core (internos Nebula)                       | —                                                                       |
| `stores/website, notifications, signature, language, textToSpeech, dev, cookie(s)`                                                                  | app                                          | —                                                                       |
| `utils/maths, js, css (color/transform/vars), colors (luminance/palette), core (date/file/resize/state/form-atom), components, shared`              | core utils (selección)                       | `form-atom` utils convergen con contrato forms                          |
| `utils/auth/permissions, core/categories, core/firebase`                                                                                            | app                                          | —                                                                       |
| `themes/` (tokens VE legacy)                                                                                                                        | descartar valores 1:1                        | Ya auditado en style-system-research §7 (Keep/Adapt/Discard); no portar |
| `api/`, `actions/`, `router/`, `config/`, `types/` de dominio                                                                                       | app                                          | fuera del alcance de UI lib                                             |

### 3.3 Skills de Stellaria (17) → Nebula

Migrar: `11-typescript-strict`, `22-tokens-governance`, `23-theme-a11y-motion`, `24-effects`, `50-architecture-decisions`, `90-quality-gates` (+a11y CI, bundle budget), `91-git-pr-conventions`.
Adaptar: `00-guardrails`, `10-monorepo-workspace`, `20-ui-web-patterns` (React Aria+VE), `21-ui-native-patterns`, `33-permissions-mirror` (como spec de PermissionGate).
No aplican a Nebula: `30-services`, `31-api-query`, `32-multi-tenant`, `40-pos-offline`. `99-roadmap`: revisar.

---

## 4. Disposición 100% — fonicredito-app (52/52)

| #   | Componente FC | → Canónico Nebula          | Destino                           | Justificación                                                                                                                   |
| --- | ------------- | -------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Accordion     | Accordion                  | core                              | API genérica (multiple tipado) sirve de referencia                                                                              |
| 2   | Action        | ActionIcon                 | core                              | `href` de expo-router se saca del core (adapter/onPress)                                                                        |
| 3   | ActionRotate  | —                          | descartar                         | Preset trivial: `ActionIcon icon="rotate"`                                                                                      |
| 4   | Badge         | Badge                      | core                              | —                                                                                                                               |
| 5   | BadgesFilter  | Search/Filters             | core (patrón)                     | Variante por callbacks — ya compatible con API Nebula                                                                           |
| 6   | Bell          | Indicator + ActionIcon     | app                               | Wiring de notificaciones+router es de la app; el dot/counter lo cubre Indicator                                                 |
| 7   | Button        | Button                     | core                              | —                                                                                                                               |
| 8   | Camera        | Camera (captura básica)    | `@stellaria/nebula-native-camera` | C1-Q2: paquete de captura básica (tomar foto); la detección rostro/documento KYC queda en la app                                |
| 9   | Card          | Card                       | core                              | Animación stagger (AnimationCardProps) pasa a motion tokens                                                                     |
| 10  | Conditional   | Conditional                | core                              | C1-Q7: API unaria `when`+`fallback`                                                                                             |
| 11  | Currency      | CurrencyDisplay            | core                              | Sin acoplamiento; formateo Intl                                                                                                 |
| 12  | Divider       | Divider                    | core                              | —                                                                                                                               |
| 13  | Dots          | Loader (`type="dots"`)     | core                              | ADR-041: el eje de forma del Loader es `type`, no `variant`                                                                     |
| 14  | Drop          | Drop                       | core                              | Decorativo                                                                                                                      |
| 15  | Drops         | Drops                      | core                              | Composición con safe-area                                                                                                       |
| 16  | Error         | FormField (slot error)     | core (absorbido)                  | Tooltip de error del field                                                                                                      |
| 17  | Header        | FormField + Header(screen) | core                              | Se divide en dos canónicos (doble responsabilidad hoy)                                                                          |
| 18  | HeaderFilter  | Search + Filters           | core (patrón)                     | Se reescribe sin atoms obligatorios; wiring Jotai queda en app                                                                  |
| 19  | HeaderUpdate  | —                          | app                               | expo-updates; usa Card/Text de Nebula                                                                                           |
| 20  | HeaderUser    | —                          | app                               | QueryMe/roles; usa Header/Avatar/Indicator de Nebula                                                                            |
| 21  | InputCalendar | DatePicker                 | core                              | Calendar-en-sheet como patrón native                                                                                            |
| 22  | InputCheckbox | Checkbox (+FormField)      | core                              | —                                                                                                                               |
| 23  | InputPhone    | InputPhone                 | core                              | Referencia de API (field+fieldDial)                                                                                             |
| 24  | InputSearch   | SearchInput                | core                              | Se reescribe con onSearch/debounce; atom queda en app                                                                           |
| 25  | InputSelect   | Select                     | core                              | Select-sobre-Sheet = patrón native de Nebula                                                                                    |
| 26  | InputText     | TextInput (+FormField)     | core                              | —                                                                                                                               |
| 27  | List          | List (data)                | core                              | FlatList+layout animations                                                                                                      |
| 28  | Logs          | —                          | app                               | Herramienta debug de la app; usa Sheet/Table de Nebula                                                                          |
| 29  | Main          | Main                       | core                              | Referencia de API                                                                                                               |
| 30  | Notifications | —                          | app                               | Copy y permisos push propios                                                                                                    |
| 31  | Omit          | Omit                       | core                              | —                                                                                                                               |
| 32  | Progress      | Progress + RingProgress    | core                              | Segmentos multi-color como feature                                                                                              |
| 33  | Refresh       | PullToRefresh              | core                              | —                                                                                                                               |
| 34  | SafeArea      | SafeArea                   | core                              | —                                                                                                                               |
| 35  | ScreenError   | EmptyState/EmptyModule     | app (composición)                 | Redirección por rol es de la app                                                                                                |
| 36  | Scroll        | Scroll                     | core                              | —                                                                                                                               |
| 37  | Segment       | Segment (compound)         | core                              | **ADR-026**: compound `Segment.Control`/`.Content`/`.Header`/`.Footer`; SegmentedControl y Tabs se conservan para el uso suelto |
| 38  | Sheet         | BottomSheet                | core                              | La mejor implementación existente (snap points, sheetId)                                                                        |
| 39  | Signature     | Signature                  | core                              | Skia                                                                                                                            |
| 40  | Skeleton      | Skeleton                   | core                              | —                                                                                                                               |
| 41  | Splash        | —                          | app                               | Assets/branding propios; usa Progress de Nebula                                                                                 |
| 42  | TabBar        | TabBar                     | core                              | C1-Q3: core con adapter de react-navigation                                                                                     |
| 43  | Table         | Table                      | core                              | Base de la API compound                                                                                                         |
| 44  | Tabs          | —                          | app                               | Azúcar sobre expo-router Screen                                                                                                 |
| 45  | Text          | Text                       | core                              | `isLoading` skeleton integrado se conserva                                                                                      |
| 46  | Theme         | —                          | app                               | UI trivial sobre useTheme de Nebula                                                                                             |
| 47  | Toast         | Toast                      | core                              | Visual/gestos al core; cola useAlert queda como wiring app                                                                      |
| 48  | Toggle        | Switch                     | core                              | —                                                                                                                               |
| 49  | Tooltip       | Tooltip                    | core                              | Referencia native                                                                                                               |
| 50  | UpdateModal   | —                          | app                               | expo-updates                                                                                                                    |
| 51  | Valid         | Valid                      | core                              | —                                                                                                                               |
| 52  | View          | Box / Flex                 | core                              | Se separa en Box+Flex (decisión ST ya tomada); props abreviadas se conservan                                                    |

## 5. Disposición 100% — tfv-frontend (117/117)

| #   | Componente TFV        | → Canónico Nebula                    | Destino           | Justificación                                                        |
| --- | --------------------- | ------------------------------------ | ----------------- | -------------------------------------------------------------------- |
| 1   | Accordion             | Accordion                            | core              | Passthrough Mantine → API propia                                     |
| 2   | AccordionList         | Accordion (variante list)            | core              | `sticky/flat` como props                                             |
| 3   | ActionIcon            | ActionIcon                           | core              | —                                                                    |
| 4   | Alert                 | Toast                                | core              | Es el renderer del store de alerts                                   |
| 5   | Aside                 | Drawer                               | core              | Store propio queda en app                                            |
| 6   | AsidePdf              | —                                    | app               | Render PDF de dominio                                                |
| 7   | Avatar                | Avatar                               | core              | —                                                                    |
| 8   | AvatarUser            | —                                    | app               | `User` de dominio; compone Avatar                                    |
| 9   | Badge                 | Badge                                | core              | —                                                                    |
| 10  | Banderole             | Banderole                            | core              | —                                                                    |
| 11  | Banner                | Hero                                 | core              | C1-Q5: adición aprobada; renombrado en ADR-070 enmienda 2            |
| 12  | BannerDev             | —                                    | app               | Entorno                                                              |
| 13  | BannerPWA             | —                                    | app               | PWA                                                                  |
| 14  | Bell                  | Indicator (+ActionIcon)              | core              | API genérica (count/dropdown)                                        |
| 15  | BellNovu              | —                                    | app               | Novu                                                                 |
| 16  | Breadcrumbs           | Breadcrumbs                          | core              | Se reescribe declarativo (paths→items)                               |
| 17  | Button                | Button                               | core              | —                                                                    |
| 18  | Buttons               | Button.Group                         | core              | —                                                                    |
| 19  | Card                  | Card compound + CardComplex          | core              | C1-Q4: dual — compounds + CardComplex con props reorganizadas        |
| 20  | CardSubscription      | —                                    | app               | Subscription de dominio                                              |
| 21  | Cards                 | GridList (grid)                      | core              | Contrato de items genérico                                           |
| 22  | Carousel              | Carousel                             | core              | —                                                                    |
| 23  | CarouselCards         | Carousel                             | descartar         | Duplicado casi exacto de Carousel                                    |
| 24  | CarouselImages        | ImageGallery                         | core              | Upload de dominio → prop genérica de imágenes                        |
| 25  | Cart                  | —                                    | app               | e-commerce                                                           |
| 26  | Categories            | —                                    | app               | CategoryGlobal; compone GridList                                     |
| 27  | Category              | —                                    | app               | ídem                                                                 |
| 28  | Charts                | ChartPanel                           | core              | Utilidad menor                                                       |
| 29  | Client                | —                                    | app               | CRM                                                                  |
| 30  | Conditional           | Conditional                          | core              | C1-Q7: API unaria `when`+`fallback`                                  |
| 31  | Container             | Section                              | core              | Patrón de sección con slots                                          |
| 32  | Dev                   | —                                    | app               | Entorno                                                              |
| 33  | Divider               | Divider                              | core              | —                                                                    |
| 34  | DividerTitle          | Divider (label)                      | descartar         | Cubierto por Divider con label                                       |
| 35  | Dropzone              | Dropzone                             | core              | —                                                                    |
| 36  | Editor                | RichTextEditor                       | core              | —                                                                    |
| 37  | EditorImage           | EditorImage                          | core              | C1-Q6: peer-dependency opcional de Pintura (licencia del consumidor) |
| 38  | Empty                 | EmptyState                           | core              | Referencia de API                                                    |
| 39  | Feature               | Feature                              | core              | C1-Q5: adición aprobada                                              |
| 40  | Filter                | Filter                               | core              | —                                                                    |
| 41  | FilterItem            | Filter (interno)                     | core              | —                                                                    |
| 42  | Filters               | Filters                              | core              | —                                                                    |
| 43  | Footer                | AppShell.Footer (+links)             | core              | —                                                                    |
| 44  | ForgotPassword        | —                                    | app               | Pantalla auth                                                        |
| 45  | Form                  | Form (orquestador)                   | core              | C1-Q1: reclasificado como genérico → core                            |
| 46  | FormDelete            | Form (variante destructiva)          | core              | Con ModalDelete                                                      |
| 47  | Grid                  | Grid / SimpleGrid                    | core              | —                                                                    |
| 48  | GridList              | GridList                             | core              | —                                                                    |
| 49  | Group                 | Section/Paper (grupo con header)     | core (absorbido)  | El Group de TFV es un "card group", no el Group layout               |
| 50  | Grow                  | —                                    | descartar         | `Flex grow`                                                          |
| 51  | Header                | FormField                            | core              | Es el Input.Wrapper del sistema                                      |
| 52  | Icon                  | Icon                                 | core              | Estrategia de iconos = ADR                                           |
| 53  | Icons                 | —                                    | app               | Picker interno de iconos                                             |
| 54  | Inbox                 | —                                    | app               | Novu                                                                 |
| 55  | InputColor            | ColorInput                           | core              | —                                                                    |
| 56  | InputDial             | InputDial                            | core              | —                                                                    |
| 57  | InputNumber           | NumberInput                          | core              | —                                                                    |
| 58  | InputSelect           | Select                               | core              | —                                                                    |
| 59  | InputSlider           | Slider                               | core              | —                                                                    |
| 60  | InputSwitch           | Switch                               | core              | (bug de naming documentado)                                          |
| 61  | InputText             | TextInput                            | core              | —                                                                    |
| 62  | Invert                | —                                    | descartar         | Orden de hijos = prop de Flex (`reverse`)                            |
| 63  | Link                  | Anchor                               | core              | Adapter de router                                                    |
| 64  | List                  | GridList (list)                      | core              | —                                                                    |
| 65  | Login                 | —                                    | app               | Pantalla auth                                                        |
| 66  | Logo                  | —                                    | app               | Marca                                                                |
| 67  | Main                  | Main                                 | core              | —                                                                    |
| 68  | Map                   | Map/GoogleMap                        | dominio           | C1-Q1: confirmado → `@stellaria/nebula-maps`                         |
| 69  | Me                    | —                                    | app               | Server component + getMe                                             |
| 70  | Modal                 | Modal                                | core              | Referencia de API (drawer/blurred/responsive)                        |
| 71  | ModalDelete           | ModalDelete                          | core              | Patrón de confirmación destructiva                                   |
| 72  | Navbar                | AppShell.Header/Navbar               | core              | —                                                                    |
| 73  | NotFound              | EmptyState (preset 404)              | core              | —                                                                    |
| 74  | Notification          | —                                    | app               | Novu                                                                 |
| 75  | Omit                  | Omit                                 | core              | —                                                                    |
| 76  | Option                | SearchableSelect (renderOption base) | core              | —                                                                    |
| 77  | OptionClient          | —                                    | app               | Entidad Client                                                       |
| 78  | OptionCompanyUser     | —                                    | app               | Entidad CompanyUser                                                  |
| 79  | OptionProvider        | —                                    | app               | Entidad Provider                                                     |
| 80  | OptionUser            | —                                    | app               | Entidad User                                                         |
| 81  | OverlayCancel         | Overlay (preset)                     | app (composición) | CancelZod es de dominio                                              |
| 82  | Pagination            | Pagination                           | core              | Declarativa; NavigateOptions queda en app                            |
| 83  | Panel                 | Panel                                | core              | —                                                                    |
| 84  | Paper                 | Paper                                | core              | —                                                                    |
| 85  | Paragraph             | Text                                 | core              | —                                                                    |
| 86  | Pill                  | Tag/Pill                             | core              | —                                                                    |
| 87  | Player                | Player                               | core              | C1-Q5: adición aprobada                                              |
| 88  | Popover               | Popover                              | core              | —                                                                    |
| 89  | PopoverCompanyService | —                                    | app               | Dominio                                                              |
| 90  | Portal                | Portal                               | core              | —                                                                    |
| 91  | PoweredDocument       | —                                    | app               | Footer de marca PDF                                                  |
| 92  | Preview               | ImageGallery/Lightbox                | core              | Referencia de API (zoom/pan/slideshow)                               |
| 93  | Product               | —                                    | app               | e-commerce                                                           |
| 94  | Products              | —                                    | app               | e-commerce                                                           |
| 95  | Rating                | Rating                               | core              | —                                                                    |
| 96  | Recover               | —                                    | app               | Pantalla auth                                                        |
| 97  | Register              | —                                    | app               | Pantalla auth                                                        |
| 98  | Search                | Search                               | core              | —                                                                    |
| 99  | SearchInput           | SearchInput                          | core              | —                                                                    |
| 100 | Section               | Section                              | core (absorbido)  | —                                                                    |
| 101 | Segment               | SegmentedControl                     | core              | —                                                                    |
| 102 | Service               | —                                    | app               | PermissionsKeys+dominio; usa NavLink/Card                            |
| 103 | Services              | —                                    | app               | ídem                                                                 |
| 104 | Sidebar               | AppShell.Navbar                      | core              | —                                                                    |
| 105 | Sidenav               | —                                    | app               | Shell con Me                                                         |
| 106 | Signature             | Signature                            | core              | —                                                                    |
| 107 | Skeleton              | Skeleton                             | core              | —                                                                    |
| 108 | Stepper               | Stepper                              | core              | —                                                                    |
| 109 | Tabs                  | Tabs                                 | core              | —                                                                    |
| 110 | Toggles               | —                                    | app               | Composición theme+idioma+dev                                         |
| 111 | Tooltip               | Menu                                 | core              | ⚠️ naming trap: es un menú de acciones                               |
| 112 | Valid                 | Valid                                | core              | —                                                                    |
| 113 | Verify                | —                                    | app               | Pantalla auth                                                        |
| 114 | ViewDrawer            | Drawer                               | core (absorbido)  | —                                                                    |
| 115 | Ware                  | —                                    | app               | Almacenes                                                            |
| 116 | Warning               | Alert (preset warning)               | descartar         | Cubierto por Alert                                                   |
| 117 | Wrap                  | —                                    | descartar         | Props de Flex                                                        |

---

## 6. Decisiones del Checkpoint 1 (cerradas el 2026-07-14)

| ID    | Caso                                                                                  | Decisión del propietario                                                                                                                                                                                                                                                                                                      |
| ----- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C1-Q1 | Frontera de dominio (38 items P2§15/P3§17)                                            | **Dominios premium vendibles**: núcleos `@stellaria/nebula-web`/`@stellaria/nebula-native` + paquetes `@stellaria/nebula-sales`, `@stellaria/nebula-commerce`, `@stellaria/nebula-payments` (y `people` y `maps` confirmados). Genéricos-disfrazados → core. Organización propuesta en §1.18; se refina en 01-architecture.md |
| C1-Q2 | Camera KYC                                                                            | **`@stellaria/nebula-native-camera`** reducido a captura básica (tomar foto); detección rostro/documento queda en fonicredito                                                                                                                                                                                                 |
| C1-Q3 | TabBar                                                                                | **Core con adapter** de react-navigation (contrato declarativo propio)                                                                                                                                                                                                                                                        |
| C1-Q4 | Card de TFV (90 props)                                                                | **Dual**: Card compound + `CardComplex` de alto nivel sobre los compounds, con las props actuales **reorganizadas** en grupos coherentes (media, badges, actions+permissions, meta) — diseño detallado en Etapa 2                                                                                                             |
| C1-Q5 | Adiciones no catalogadas (Banner, Feature, Player, Section, ChartPanel, ImageGallery) | **Añadir las 6** al catálogo core                                                                                                                                                                                                                                                                                             |
| C1-Q6 | EditorImage (Pintura comercial)                                                       | **Core con peer-dependency opcional** — Nebula publica el wrapper; cada consumidor aporta su licencia/instalación de Pintura                                                                                                                                                                                                  |
| C1-Q7 | Conditional (unario FC vs binario TFV)                                                | **Unario + `fallback`** (`when` + `fallback?: ReactNode`)                                                                                                                                                                                                                                                                     |

## 7. Verificación

- FC: 52/52 filas en §4 ✓ (verificado contra `ls` del 2026-07-14).
- TFV: 117/117 filas en §5 ✓ (ídem).
- P2: 177 items cubiertos en §1 (por fila directa o familia: AppShell×6, DataGrid×5, charts, DnD×7, dominio §1.18) ✓.
- P3: 204 items cubiertos en §1 ✓.
- ST: 39/39 con base de migración asignada (detalle archivo-por-archivo en `04-migration-map.md`) ✓.

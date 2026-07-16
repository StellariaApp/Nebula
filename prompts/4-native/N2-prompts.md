# Prompts N2 — Native Tier 2

> 3 prompts secuenciales. Requiere N1 cerrado. Bloque común de N1 aplicable (con "N1 cerrado").

---

## Prompt N2.1 — Inputs completos native

```
[BLOQUE COMÚN de N1, con N1 cerrado]
LEE ADEMÁS: docs\api\fonicredito-components.md §7 (APIs reales de InputCalendar/Phone/Select/
Checkbox/Signature que Nebula debe cubrir).

MISIÓN (00-inventory §1.4 Tier 2, plataforma N/WN):
1. Fechas: Calendar + DatePicker/DateRange/Time **en BottomSheet** (patrón FC InputCalendar; evalúa
   render propio vs react-native-calendars — pregunta con comparativa antes de añadir la dep).
2. InputPhone + InputDial (field+fieldDial como FC), InputCurrency (máscara Intl).
3. Signature (Skia — base FC Signature: export jpeg/png, field), FileInput, TagsInput, PinInput,
   Rating, Slider/RangeSlider (gesture-handler), ColorInput básico, Fieldset.
4. Contrato a11y de inputs COMPLETO en todos (la lección del gap de Stellaria).

REPORTE: tabla componente→estado + decisiones de dependencia (calendars).
```

## Prompt N2.2 — Data display + navegación completa + patterns

```
[BLOQUE COMÚN de N1, con N2.1 cerrado]

MISIÓN:
1. Data display: Table (compound, referencia FC), Timeline, Accordion (multiple tipado, referencia
   FC), ListItem/SwipeableRow, SectionList (headers sticky animados), **List data** (FlatList/FlashList
   + layout animations + gesture — referencia FC List), Stat, Spoiler, Indicator, Tag/Pill, ThemeIcon,
   ColorSwatch, BackgroundImage, GridList native.
2. Navegación: **TabBar con contrato declarativo + adapter react-navigation** (C1-Q3 — adapter en
   subpath @stellaria/nebula-native/adapters/react-navigation, peer opcional), SegmentedNav, Stepper,
   Burger, ScrollProgress, Header animated-on-scroll (si quedó pendiente de N1.3).
3. Patterns: Search/Filter/Filters (API por callbacks — el wiring Jotai queda en apps), PullToRefresh,
   InfiniteList/SearchableList (TanStack duck-typed), StatusBadge/CurrencyDisplay/DateDisplay,
   PermissionGate, QuickAction, EmptyModule, CardComplex native (mismos grupos de props aprobados
   en W3.5), Drop/Drops (decorativos FC), Banner/Feature native si aplican (verifica matriz).
4. Overlays restantes: ActionSheet, BottomSheetStack, Dialog, HoverCard (long-press), Overlay, Affix,
   LoadingOverlay.

REPORTE: tabla componente→estado + demo del TabBar adapter con una app react-navigation mínima.
```

## Prompt N2.3 — `@stellaria/nebula-native-camera` + cierre Tier 2

```
[BLOQUE COMÚN de N1, con N2.2 cerrado]
LEE ADEMÁS: docs\00-inventory.md §1.18 y §4 fila 8 (decisión C1-Q2: captura BÁSICA, sin KYC),
docs\api\fonicredito-components.md §11 (la API de Camera de FC como referencia de lo que la app
construirá ENCIMA — la detección rostro/documento NO entra aquí).

MISIÓN:
1. Crear packages/native-camera (@stellaria/nebula-native-camera): componente Camera con
   visible/onClose/onCapture(file)/allowCameraSwitch/initialCamera/labels + overlay/viewfinder
   personalizable por slots. Motor: pregunta antes de elegir (expo-camera vs react-native-vision-camera)
   con comparativa de peso/capacidades — FC usa VisionCamera pero para captura básica expo-camera
   puede bastar.
2. Permisos de cámara con UX accesible (estados denied/blocked con guía).
3. Stories/demo en playground native + testing contract.
4. CIERRE DE N2: gate de docs\05-roadmap.md N2 → docs\n2-closure.md (incluye verificación en
   dispositivo de virtualización y gestos).

REPORTE: cierre de N2 + decisión de motor de cámara registrada como mini-ADR.
```

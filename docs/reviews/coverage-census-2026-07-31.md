# Censo de cobertura web contra `00-inventory` §1 — 2026-07-31

> **WR1.1.** Auditoría de solo lectura. Reverificada contra el código, **sin heredar** ninguna
> afirmación de `w4-closure.md` ni de cierres anteriores. Ningún archivo de `packages/` fue tocado.

## Método

**Universo.** Todas las filas de `docs/00-inventory.md` §1 con `Plat` `W` o `WN` (incluidas las
formas compuestas `W(N picker simple)`, `W(N tablet)`, `W(N long-press)`, `WN(Calendar) W(pickers)`
y `N (W drawer-bottom)`) y destino `core`. Extraídas por parseo de las tablas, no a ojo.

**Convención de conteo.** Los nombres separados por `/` o `,` en una celda cuentan como un nombre
cada uno. Los paréntesis con `+` —`Button (+Group)`, `Table (+ScrollContainer)`,
`AppShell (+Header/Navbar/Aside/Footer/Main)`, `DataGrid (+Toolbar/…)`— denotan miembros compound o
slots del mismo componente: se **verifican uno a uno** pero no suman fila canónica.

**Fuera del universo, con motivo:**

| Sección                                   | Motivo                                                                                                                                            |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Filas `Plat: N`                           | Etapa 4 (N1–N4), no W5                                                                                                                            |
| `Shadow`, `Invert / Grow / Wrap`          | destino `descartar`                                                                                                                               |
| `PoweredDocument`, `IconPicker`           | destino `app`                                                                                                                                     |
| §1.18 tabla de paquetes premium           | destino `dominio`                                                                                                                                 |
| §1.16 Animated Text & micro-interacciones | ⚠️ la tabla **no tiene columna `Plat`**; el título dice "native-first" y sus fuentes son P2 (catálogo native). Se trata como `N`. Ver defecto D-3 |

**Cruce**, en este orden: directorios de `packages/web/src/components` → barrel
`packages/web/src/index.ts` → los siete subpaths → barrels de `packages/hooks` y `packages/icons` →
`packages/web/src/provider`. Los cruces se hicieron por **nombre exacto de export** extraído de los
barrels con un parser, no por subcadena: ni un solo `grep` de `Card` contra `CardComplex`.

**Superficie medida hoy:** 154 directorios en `packages/web/src/components`; 215 exports de valor en
el barrel principal; 8 barrels (principal + 7 subpaths); 82 archivos `*.stories.tsx`; 187 entradas
en `.size-limit.js`.

---

## Recuento

**194 nombres canónicos** en el universo. Al levantar el censo: **193 resueltos, 1 abierto**. Tras
el checkpoint: **194 de 194**, con `Header` construido el mismo día.

| Lista                                               | Recuento                                                              |
| --------------------------------------------------- | --------------------------------------------------------------------- |
| 1. Huecos reales                                    | **0**                                                                 |
| 2. Renombrados / absorbidos                         | **12** (5 ya anotados · 7 sin anotar → **anotados en el checkpoint**) |
| 3. Excepciones que necesitan aprobación             | **1** → resuelta construyéndola (ADR-062)                             |
| 4. Huérfanos (código sin fila)                      | **1** directorio (+4 exports secundarios)                             |
| 5. Incompletos (sin story, sin budget o sin export) | **5**                                                                 |

---

## 1. Huecos reales — 0

Ninguna fila del universo carece de rastro en el código. Las cuatro que W4 encontró tarde
(`Countdown`, `ScrollProgress`, `Breadcrumbs`, `useMediaQuery`) están hoy implementadas, exportadas y
presupuestadas — reverificado contra el código, no contra el cierre:

| Fila             | Rastro verificado                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------- |
| `Countdown`      | `components/Countdown/` · barrel L614 · budget L1196 · ⚠️ sin story (lista 5)                     |
| `ScrollProgress` | `components/ScrollProgress/` · barrel L620 · budget L1203 · ⚠️ sin story (lista 5)                |
| `Breadcrumbs`    | `components/Breadcrumbs/` · barrel L623 · budget L1189 · story `Navigation.stories.tsx`           |
| `MediaQuery`     | `packages/hooks/src/use-media-query.ts` → `useMediaQuery`, `useBreakpointUp`, `useBreakpointDown` |

**Ninguna familia queda bloqueada para WR2 por hueco de construcción.**

---

## 2. Renombrados y absorbidos — 12

El código no expone un símbolo con el nombre de la fila, pero el concepto **sí está implementado**
bajo otro nombre, como variante, como prop o como slot. Cinco ya están escritos en el inventario;
**siete no**, y son exactamente el tipo de tropiezo que WR1.1 existe para evitar.

### Ya anotados en el inventario — no requieren acción

| Fila (§)                      | Resolución verificada                                                                                                 | Dónde está escrito                  |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| `ThemeProvider` (§1.17)       | `NebulaProvider` — `provider/nebula-provider.tsx`, barrel L208                                                        | `00-inventory` L313                 |
| `MediaQuery` (§1.17)          | `useMediaQuery` + `useBreakpointUp/Down` en `@stellaria/nebula-hooks`                                                 | `00-inventory` L311                 |
| `Link` (§1.2 `Anchor / Link`) | `Anchor` — barrel L10                                                                                                 | `00-inventory` §5 fila 63           |
| `Pill` (§1.6 `Tag / Pill`)    | `Tag` — barrel L391                                                                                                   | `00-inventory` §5 fila 86           |
| `BottomSheet` (§1.9)          | `Drawer side="bottom"` — `ModalSide = "start" \| "end" \| "top" \| "bottom"` (`Modal.types.ts:9`), `DrawerProps.side` | celda `Plat`: `N (W drawer-bottom)` |

### Sin anotar — **hay que escribirlos en `00-inventory.md`**

| #   | Fila (§)                                             | Resolución verificada en código                                                                                                                                                                                                                             |
| --- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `RingProgress` (§1.8 `Progress / RingProgress`)      | Absorbido como eje de forma: `ProgressProps.type?: "bar" \| "ring"` (`components/Progress/Progress.types.ts:18`). Mismo criterio que ADR-041 para `Loader`. **No existe** un export `RingProgress`                                                          |
| 2   | `MeshGradient` (§1.15, dos filas)                    | El export se llama **`MeshGradientBg`** (`components/MeshGradientBg/`, barrel L566, budget L1133)                                                                                                                                                           |
| 3   | `GrainyGradient` (§1.15, dos filas)                  | No es componente: es la prop **`grain`** de `GradientBackground` y `MeshGradientBg` (`GradientBackground.types.ts:20`), sobre `styles/noise.css`. Aprobado en el checkpoint de W4 y escrito en `w4-closure.md` L19 y L104 — **pero nunca en el inventario** |
| 4   | `BlurView` (§1.15 `BlurView / BlurOverlay`)          | En web el export es `BlurOverlay` (barrel L545). `BlurView` es el nombre de React Native. Cero ocurrencias de `BlurView` en `packages/web`                                                                                                                  |
| 5   | `NoiseTexture` (§1.15 `NoiseTexture / NoiseOverlay`) | En web el export es `NoiseOverlay` (barrel L547); la textura reutilizable es `styles/noise.css.ts` (`grain`, `noiseOpacity`), consumida por `GlassSurface`, `GradientBackground` y `MeshGradientBg`. Cero ocurrencias de `NoiseTexture`                     |
| 6   | `ActionIcon (+Group)` (§1.3)                         | **No existe `ActionIconGroup`.** El agrupador es `ButtonGroup`, deliberadamente genérico (extiende `BoxOwnProps`, no conoce a `Button`): verificado envolviendo `ActionIcon` en `ButtonActions.stories.tsx:62-72`                                           |
| 7   | `AppShell (+Header/Navbar/Aside/Footer/Main)` (§1.1) | Los cinco no son exports: son **props de slot** — `header`, `navbar`, `aside`, `footer` (`AppShell.types.ts:12-15`) más `contentId` para el `<main>`. Relevante porque es la respuesta parcial a la fila `Header` abierta                                   |

### Compound y variantes verificados (correctos, sin acción)

`Button (+Group)`→`ButtonGroup` · `Checkbox/Radio/Switch/Chip (+Group)`→`CheckboxGroup`,
`RadioGroup`, `SwitchGroup`, `ChipGroup` · `Avatar (+Group)`→`AvatarGroup` ·
`Card (+Section)`→`CardSection` · `Grid.Col`→`GridCol` ·
`Table (+ScrollContainer)`→`Table.ScrollContainer` (`Table.tsx:193,202`) ·
`CodeHighlight (+Tabs)`→`CodeHighlightTabs` ·
`Segment (Control + Content)`→`SegmentControl`/`SegmentContent` ·
`PieChart/Donut`→`PieChartProps.donut` (`Charts.types.ts:58`) ·
`Notification`→`ToastProvider`/`nebulaToast` ·
`DataGrid (+Toolbar/Pagination/ColumnHeader/FilterPanel)`→ partes internas del subpath `/datagrid`.

---

## 3. Excepciones que necesitan aprobación del propietario — 1

> **Resuelta el mismo día**: el propietario eligió construirla, no declararla excepción. Ver
> §Checkpoint. Lo que sigue es el estado en que la encontró el censo.

| Fila                         | § / Plat / Tier | Estado al levantar el censo                              |
| ---------------------------- | --------------- | -------------------------------------------------------- |
| **`Header (screen/TopBar)`** | §1.1 · `WN` · 1 | Sin implementar en web y **sin escribir como excepción** |

Rastro real: solo `AppShellProps.header?: ReactNode` (`AppShell.types.ts:12`) —un hueco donde colgar
contenido, no el componente— y `AppShell.Labels.navigation`. No hay directorio, export, budget ni
story. Las tres fuentes de la fila (P2 §8, ST, FC) son native y su nota describe piezas native
(BackButton, StatusError, animated-on-scroll).

**Mientras no se apruebe, cuenta como hueco** (regla de WR1.1: no se inventan excepciones). Bloquea
la familia §1.1 Foundation/Layout en WR2 y es lo único que impide afirmar 100 % de catálogo web sin
matices.

---

## 4. Huérfanos — 1 directorio + 4 exports secundarios

### Directorio sin fila en §1

| Componente   | Evidencia                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FieldError` | `components/FieldError/` · barrel L59 · budget L262 · story `FieldError.stories.tsx`. **Cero ocurrencias de `FieldError` en `00-inventory.md`.** Procede del `Error` de fonicredito (§4 fila 16), que el inventario declaró _"core (absorbido)"_ dentro de `FormField`. Se construyó como componente propio, exportado y presupuestado: **le falta la fila** en §1.4, o hay que reclasificar la absorción |

### Exports de valor sin fila propia (dentro de directorios que sí la tienen)

| Export                           | Situación                                                                                                                                                          |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `FormDelete`, `ModalDelete`      | Aparecen solo en §4/§5 (TFV filas 46 y 71). §1.18 nombra `Form (orquestador)` pero no a sus dos variantes, que son exports públicos con budget propio (L388, L395) |
| `RangeCalendar`                  | La fila `Calendar / MonthPicker / YearPicker` no lo nombra; es export público con budget (L500)                                                                    |
| `OptionList` (`src/collections`) | Sin fila; §5 fila 76 mapea el `Option` de TFV a `SearchableSelect`, no a un export propio                                                                          |

No son código sobrante: son API pública que el inventario no describe. Decidir si se anotan como
miembros de su fila o se les da fila propia.

---

## 5. Incompletos — 5

Exportados pero sin lo que la plantilla exige.

| Componente          | Export       | Budget   | Story           | Falta                                                                                                                                                                                                                                               |
| ------------------- | ------------ | -------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Countdown`         | ✅ L614      | ✅ L1196 | ❌              | **Sin lámina.** Ninguna story importa `Countdown`/`COUNTDOWN_LABELS`/`SplitRemaining`                                                                                                                                                               |
| `ScrollProgress`    | ✅ L620      | ✅ L1203 | ❌              | **Sin lámina.** Ninguna story lo importa                                                                                                                                                                                                            |
| `Main`              | ✅ L474      | ✅ L941  | ✅ **resuelto** | Lo estaba: `Shell.stories.tsx` cubre `AppShell`/`Panel`/`Section`, no `Main`. Lo cerró de rebote la lámina `InMain` de `Header.stories.tsx` (ADR-062 decisión 8). Quedan cuatro: `Countdown`, `ScrollProgress`, `EditorImage` y `ColorSchemeScript` |
| `EditorImage`       | ✅ `/editor` | ✅ L1294 | ❌              | **Sin lámina.** `RichContent.stories.tsx` cubre `RichTextEditor` y `CodeHighlight`, no `EditorImage` (peer opcional de Pintura)                                                                                                                     |
| `ColorSchemeScript` | ✅ L213      | ❌       | ❌              | **Sin budget y sin lámina.** Cero ocurrencias en `.size-limit.js` y cero en `apps/playground-web`. Es la pieza anti-flash SSR (§1.17, `W`, Tier 1): que no tenga presupuesto ni verificación visual es la clase de hueco que este paso busca        |

**No son incompletos** (verificado, para que la próxima auditoría no los reabra):

- `DataGrid` no tiene entrada `dist/components/DataGrid/…` en `.size-limit.js` porque su presupuesto
  es el del subpath: `dist/datagrid/index.js`, 95 kB (L1070). Correcto.
- `DragDrop` y `Toast` sí tienen lámina; sus stories importan `DragDropContext`/`SortableList`/
  `KanbanBoard` y `ToastProvider`/`nebulaToast`, no el nombre del directorio.
- `NebulaProvider` no tiene story propia pero sí budget (L3) y se ejercita en **todas** las láminas
  como decorador (`fixtures/themes.tsx:59`).
- Los 154 directorios están exportados desde el barrel o desde un subpath. **Cero** sin export.

---

## Defectos del inventario detectados de paso

| #   | Defecto                                                                                                                                                                                                                                                                                                                       |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D-1 | §1.15 tiene **dos filas para el mismo par**: `GradientBorder / GradientBackground / AnimatedGradient / MeshGradient / GrainyGradient` (L284) y `MeshGradient / GrainyGradient` (L287). La segunda es redundante                                                                                                               |
| D-2 | §1.13 (Drag & Drop) **no tiene columna `Plat`**. Se dedujo `W` del título de sección. Conviene explicitarlo                                                                                                                                                                                                                   |
| D-3 | §1.16 (Animated Text) **no tiene columna `Plat`** y su destino es `core`. Se dedujo `N` del título y de las fuentes (P2). Si alguna fila fuera `WN`, este censo la habría dejado fuera: hay que fijarlo antes de W5                                                                                                           |
| D-4 | `w4-closure.md` §Cobertura afirma **153 directorios**; hoy hay **154**. La diferencia es coherente con `Breadcrumbs`, construido en la propia auditoría de cierre — la cifra se escribió antes. Ídem "218 exports de valor": medidos hoy **215** en el barrel principal. Cifras de cierre que ya no son verificables tal cual |

---

## Checkpoint — resuelto por el propietario el 2026-07-31

| #   | Punto                                            | Decisión                                                              | Estado                     |
| --- | ------------------------------------------------ | --------------------------------------------------------------------- | -------------------------- |
| 1   | `Header (screen/TopBar)` (bloqueante)            | **Componente web propio.** No es excepción: se construye antes de WR2 | ✅ **entregado** (ADR-062) |
| 2   | Anotar los 7 renombrados de la lista 2           | **Aplicar**                                                           | ✅ hecho                   |
| 3   | Fila para `FieldError` y los 4 exports huérfanos | **No ahora**                                                          | ⏸️ abierto                 |
| 4   | Defectos D-1 a D-3 del inventario                | **No ahora**                                                          | ⏸️ abierto                 |
| 5   | Cerrar los 5 incompletos de la lista 5           | **No ahora**                                                          | ⏸️ abierto                 |

### 1 — `Header` construido y entregado

`ADR-062` fija el contrato y el componente está en el catálogo. Al verificar las tres fuentes de la
fila, dos no eran lo que la nota decía:

- El `Header` de Stellaria es el componente de doble responsabilidad que `04-migration-map.md` L51
  manda partir; **su mitad de campo se entregó en W2 como `FormField`**. Lo que faltaba era solo la
  mitad screen-header.
- `HeaderUser` de fonicredito está catalogado **100 % app** (`docs/api/fonicredito-components.md`
  L720): recibe `SharedValue` de Reanimated y depende de `QueryMe` y de roles. No es migrable.
- El slot ya era landmark: `AppShell` emite `<header>` (banner) y `position: sticky`. Por eso la
  raíz de `Header` es un `<div>` y solo se eleva con `component`.

**Entregado**: `packages/web/src/components/Header/` · barrel · budget **34 kB (medido 31,4)** ·
13 tests · lámina `Header.stories.tsx` con siete historias, incluidas las dos que exige ADR-062
(dentro de `AppShell` y dentro de `Main`) y `AllThemes` con el tema `rosette`.

**Gates**: `pnpm turbo build typecheck lint test` **29/29** · **1056** tests web (+13) ·
`size` **188 entradas, 0 excedidas** · `a11y` **82 suites / 554 tests, 0 violaciones** (+1 suite,
+11 tests).

Con esto **§1 no tiene ninguna fila W/WN `core` sin resolver**: el catálogo web es 100 % sin
matices, y §1.1 Foundation/Layout queda desbloqueada para WR2.

### 2 — Renombrados anotados

Los siete quedan escritos en `00-inventory.md`:

| Fila                                      | Anotación añadida                                                               |
| ----------------------------------------- | ------------------------------------------------------------------------------- |
| §1.1 `AppShell (+Header/…/Main)`          | Los cinco nombres del paréntesis son props de slot, no exports                  |
| §1.3 `ActionIcon (+Group)`                | No hay `ActionIconGroup`; lo cubre `ButtonGroup`, genérico sobre `Box`          |
| §1.8 `Progress / RingProgress`            | No hay export `RingProgress`: es `Progress type="ring"` (criterio de ADR-041)   |
| §1.15 `… / MeshGradient / GrainyGradient` | `MeshGradient` → `MeshGradientBg`; `GrainyGradient` → prop `grain`              |
| §1.15 `BlurView / BlurOverlay`            | En web es `BlurOverlay`; `BlurView` es el nombre de React Native                |
| §1.15 `NoiseTexture / NoiseOverlay`       | En web es `NoiseOverlay`; la textura es `styles/noise.css.ts`                   |
| §1.15 `MeshGradient / GrainyGradient`     | Marcada como duplicado de la fila de arriba (D-1 no se corrigió, solo se anotó) |

### 3, 4 y 5 — abiertos por decisión, no por olvido

Quedan escritos aquí para que la próxima auditoría no los redescubra como hallazgos nuevos. El de
consecuencia práctica es el **5**: `Countdown`, `ScrollProgress`, `Main`, `EditorImage` y
`ColorSchemeScript` no tienen lámina, así que **WR2 no puede auditarlos visualmente**. Cuando WR2
los marque como NO EVALUADO, el motivo es este, no un descuido de esa fase.

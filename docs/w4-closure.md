# Cierre de W4 — Web Tier 3

> Verificación del gate de `docs/05-roadmap.md` §W4. Fecha de cierre: 2026-07-31.
> Fases previas: `docs/f0-closure.md`, `w1-closure.md`, `w2-closure.md`, `w3-closure.md`.

## Estado

**W4 cerrada.** El catálogo web pasa de 130 componentes (W3) a **154**, con **1043 tests** en
`@stellaria/nebula-web`, 81 láminas de story y **siete subpath exports**.

**El catálogo web está al 100 % salvo una fila, que necesita decisión del propietario**: `Header
(screen/TopBar)` (§1.1, WN, Tier 1). Ver §Cobertura.

## Entregables contra el roadmap

| Tramo    | Entregable                                                                                        | Estado |
| -------- | ----------------------------------------------------------------------------------------------- | ------ |
| **W4.1** | GlassSurface, BlurOverlay, NoiseOverlay                                                           | ✅     |
| **W4.1** | GradientBorder, GradientBackground, AnimatedGradient, MeshGradientBg (`grain` cubre GrainyGradient) | ✅   |
| **W4.1** | **StarField** — adición aprobada en checkpoint (retícula + estrellas de Stellaria)                | ✅     |
| **W4.2** | `/dnd`: DragDropContext, Draggable, Droppable, SortableList, KanbanBoard/Column/Card              | ✅     |
| **W4.2** | `/carousel`: Carousel sobre Embla con el contrato de items de GridList                            | ✅     |
| **W4.2** | ImageGallery + Lightbox (zoom/pan/slideshow propios, entry principal)                             | ✅     |
| **W4.2** | `/media`: Player                                                                                  | ✅     |
| **W4.3** | `/editor`: RichTextEditor (TipTap) + EditorImage (peer opcional de Pintura)                       | ✅     |
| **W4.3** | CodeHighlight (+Tabs) con botón de copia                                                          | ✅     |
| **W4.3** | TransferList, VirtualizedSelect, GlobalSearch                                                     | ✅     |
| **W4.3** | TypographyStylesProvider, DirectionProvider + auditoría RTL                                       | ✅     |
| **W4.4** | DataGrid avanzado: toolbar, menú de columna, panel de filtros, resize, export CSV, teclado de grid | ✅    |
| **W4.4** | Charts completos: RadarChart, ChartLegend, ChartTooltip, ChartPanel                               | ✅     |
| **W4.4** | **Countdown y ScrollProgress** — Tier 3 que ningún prompt de W4 nombraba                          | ✅     |

## Gate verificable

| Criterio                                       | Resultado                                                       |
| ---------------------------------------------- | --------------------------------------------------------------- |
| `pnpm turbo build typecheck lint test`         | **29/29 tareas**                                                  |
| `pnpm turbo test`                              | **1043** web · 28 hooks · 27 themes · 15 icons                    |
| `pnpm --filter @stellaria/nebula-web size`     | **187 entradas · 0 excedidas**                                    |
| `pnpm --filter playground-web a11y` (axe)      | **81 suites / 543 tests · 0 violaciones**                         |
| `pnpm check:contrast`                          | 5 temas · 0 FAIL                                                  |
| Subpaths aislados                              | verificado sobre `dist/index.js` — ver §Subpaths                  |
| Reduced-motion en todos los efectos            | `AnimatedGradient` y `StarField` paran por media query **y** por `motion.tier`; el resto no anima |
| Catálogo web                                   | 100 % salvo `Header`, pendiente de decisión — ver §Cobertura       |

## Subpaths

Siete exports, ninguno alcanzable desde el barrel. Verificado sobre `dist/index.js`: **cero
menciones** a `recharts`, `@tanstack/*`, `@dnd-kit/*`, `embla-carousel`, `react-player`, `@tiptap/*`,
`prosemirror-*`, ni a los componentes que los usan.

| Subpath     | Contenido                                                       | Dependencias                                        |
| ----------- | --------------------------------------------------------------- | --------------------------------------------------- |
| `/command`  | CommandPalette                                                   | ninguna (ADR-057)                                   |
| `/charts`   | Bar/Line/Area/Pie/**Radar** + SparkLine/TrendIndicator + **Legend/Tooltip/Panel** | `recharts`                        |
| `/datagrid` | DataGrid + `ToCsv`                                               | `@tanstack/react-table`, `@tanstack/react-virtual`  |
| `/dnd`      | DragDrop + Kanban                                                | `@dnd-kit/core|sortable|utilities|modifiers`        |
| `/carousel` | Carousel                                                         | `embla-carousel-react`                              |
| `/media`    | Player                                                           | `react-player`                                      |
| `/editor`   | RichTextEditor + EditorImage                                     | `@tiptap/react|starter-kit|pm`; Pintura como **peer opcional** |

`ChartLegend`, `ChartTooltip`, `ChartPanel`, `SparkLine` y `TrendIndicator` viven en `/charts` pero
**no tocan Recharts**: son SVG y CSS propios, entre 11 y 13 kB.

## Decisiones tomadas en W4

| ADR     | Decisión                                                                             | Supuesto |
| ------- | -------------------------------------------------------------------------------------- | -------- |
| **059** | `effects.glass.enabled` gobierna solo glass/blur/ruido; los gradientes se neutralizan por sus tokens | — |
| **060** | dnd-kit línea estable 6.x, embla, react-player como dep de subpath, y el subpath `/media` | —      |
| **061** | TipTap definitivo, `CodeHighlight` sin resaltador, ventana propia, Pintura duck-typed  | **#6**   |

**Supuesto #6 cerrado por completo.** La mitad de cmdk la cerró ADR-057 en W3.4; la del editor la
cierra ADR-061. Ambas por el mismo criterio: una dependencia **0.x** no entra en un paquete que se
publica en W5. Es también lo que descartó `@dnd-kit/react` 0.5.0 en ADR-060.

## Cobertura contra `00-inventory` §1

153 componentes en `packages/web/src/components`; **218 exports de valor y 353 de tipo** en el barrel,
más los siete subpaths.

Recorridas **todas** las filas de §1 con `Plat` W o WN y destino `core`, en los tres tiers. Cuatro
huecos que la primera pasada de cierre no vio, porque comprobó Tier 3 componente a componente pero
heredó de `w3-closure.md` la afirmación de que Tier 1–2 estaba completo en vez de reverificarla:

| Fila | Tier | Resultado |
| ---- | ---- | --------- |
| `Countdown` | 3 | Construido en W4.4 |
| `ScrollProgress` | 3 | Construido en W4.4 |
| `Breadcrumbs` | **2** | **Nunca se construyó.** Se nombró en el prompt de W2.5, `w2-closure` lo aplazó correctamente por ser Tier 2, y W3 —que era el tramo de Tier 2— no lo recogió. Construido en la auditoría de cierre |
| `MediaQuery / useMediaQuery` | 2 | **Nunca se construyó.** Entregado como `useMediaQuery` + `useBreakpointUp/Down` en `@stellaria/nebula-hooks` |

Y una fila que **queda abierta**:

| Fila | Tier | Estado |
| ---- | ---- | ------ |
| `Header (screen/TopBar)` | **1** | Sin implementar en web. Hoy solo existe el slot `header?: ReactNode` de `AppShell`, que es un hueco donde colgar contenido, no el componente. Las tres fuentes de la fila son native (P2 §8, ST, FC) y su nota describe cosas native —BackButton, StatusError, animated-on-scroll—, así que es plausible que siempre fuera native-first; pero **nadie lo escribió como excepción**. Necesita decisión del propietario: componente web propio, o excepción justificada con el slot de `AppShell` + `Section`/`Main` como respuesta |

`ThemeProvider` (§1.17, WN, Tier 1) aparecía como hueco en el barrido automático y **no lo es**: se
implementa como `NebulaProvider` (docs/02 §4). La fila queda anotada para que la próxima auditoría no
vuelva a tropezar con el nombre.

Adiciones sobre la matriz original, ambas aprobadas en checkpoint: **StarField** (§1.15, W4.1) y la
resolución de `GrainyGradient` como prop `grain` de `MeshGradientBg` en vez de componente propio.

**Lección de método**: un cierre no puede heredar la afirmación de cobertura del cierre anterior. La
verificación tiene que recorrer el inventario contra el código en cada tramo, y por eso queda escrita
como paso obligatorio de `prompts/2.1-web-refine/WR1-prompts.md` §WR1.1.

Contra los ~214 componentes canónicos del catálogo completo (§2), lo que queda pendiente es **solo
native**: LiquidGlass, shaders Skia, Animated Text, micro-interacciones, carruseles native y el resto
de filas `Plat: N`. Eso es la Etapa 4 (N1–N4), no W5.

## Auditoría de exports y `sideEffects` (preparación de W5)

- **`sideEffects: ["*.css"]` es correcto y está verificado.** Barrido de `dist`: los únicos imports
  por efecto puro son `import "react"` en seis módulos; **ningún `.css.js` se importa solo por su
  efecto**, todos exponen bindings que su componente consume. La declaración actual no puede tirar
  CSS. Invariante que W5 debe preservar: si algún día un módulo importa un `.css.js` sin usar sus
  exports, hay que ampliar `sideEffects` a `"*.css.js"` o ese estilo desaparecerá en producción.
- **Sin exports duplicados** en el barrel: 218 valores y 353 tipos, ninguno repetido.
- **Sin componentes huérfanos**: los 153 directorios de `src/components` están exportados desde el
  barrel o desde un subpath.
- Los siete subpaths están declarados en `exports` de `package.json` con `types` + `default`, y cada
  uno tiene su entry en `vite.config.ts`.

## Deuda declarada

0. **`Header (screen/TopBar)` sin resolver** — la única fila del catálogo web que no está ni
   implementada ni justificada como excepción. Bloquea poder afirmar el 100 % sin matices.
1. **La deuda 2 de W3 (Recharts) queda cerrada como evaluada, no como pendiente.** Medido con los
   charts completos: `BarChart` 115,54 kB (+1,6 kB respecto a W3.4 al entrar `RadarChart` sobre el
   mismo motor). No se reabre ADR-011: la curva es plana porque el motor ya estaba pagado, el
   aislamiento funciona, y las dos piezas que un dashboard usa en cantidad —`SparkLine` y
   `TrendIndicator`— no lo tocan. El razonamiento completo está en `Charts.md`.
2. **`DataGrid` tiene banda propia de 95 kB** (medido 87,34). Se intentaron dos deferrals y ninguno
   ayudó: el peso es la composición, no una rama aislable. Documentado en `docs/03` §3 y en
   `DataGrid.md`.
3. **El suelo compartido de sprinkles subió a 16,7 kB** en W4.3 al añadir las style props lógicas de
   RTL, y arrastró 32 budgets. Recalibración documentada; si el propietario prefiere revertir
   `ps`/`pe`/`ms`/`me`, son cuatro líneas y el resto de la auditoría RTL no depende de ellas.
4. **`Overlay` (W3.5) descarta las props que no reconoce** — no propaga `rest` tras
   `ExtractStyleProps`, así que un `data-*`, un `id` o un `onClick` se pierden en silencio. Todos los
   componentes de W4 sí lo hacen. No se tocó por estar fuera del alcance del tramo.
5. **La regla de lint de RSC sigue sin implementar** (`docs/03` §3), heredada de W3.
6. **La entrada del barrel sigue creciendo**: `NebulaProvider` 69,24 kB. Es la deuda 1 de W3, con la
   decisión del propietario de conservar la medición desde el barrel.
7. **El review visual no está hecho.** El gate de la plantilla pide contrastar las láminas contra
   Foundations/Visual QA a ojo; los gates automáticos están todos en verde, pero eso no lo sustituye.

## Lista de exports para W5

Punto de partida de la auditoría de publicación:

- **Entry principal** (`.`): 218 valores + 353 tipos. Incluye los 130 de W3 más los efectos de W4.1,
  `Lightbox`/`ImageGallery` (W4.2), `CodeHighlight`/`CodeHighlightTabs`/`TransferList`/
  `VirtualizedSelect`/`GlobalSearch`/`TypographyStylesProvider`/`DirectionProvider` (W4.3) y
  `Countdown`/`ScrollProgress` (W4.4).
- **Siete subpaths** con sus tipos, tabla arriba.
- **Peers**: `react` ^19.2.7, `react-dom` ^19.2.7. **Peer opcional**: Pintura (`@pqina/pintura` +
  `@pqina/react-pintura`), documentada en `src/editor/README.md` con su setup de licencia.
- **Deps de runtime** a auditar en W5: las de `docs/01` §8, ahora con dnd-kit, embla, react-player y
  TipTap añadidas y todas aisladas en subpath.

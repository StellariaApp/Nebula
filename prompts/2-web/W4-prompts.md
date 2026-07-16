# Prompts W4 — Web Tier 3

> 4 prompts secuenciales. Requiere W3 cerrado. Bloque común de W2 aplicable (con "W3 cerrado").

---

## Prompt W4.1 — Glass/Effects web + tokens `gradients`

```
[BLOQUE COMÚN de W2, con W3 cerrado]
LEE ADEMÁS: docs\02-theming.md §2.5 (effects con guardrails) y la investigación original:
C:\Users\Skr13\Documents\GitHub\Stellaria-Frontend\docs\style-system-research.md (guardrails de glass).

MISIÓN:
1. Completar los tokens `effects.gradients` en nebula-tokens/themes si F0 los dejó como esqueleto
   (brand/accent/surface por tema; sober los define neutros).
2. Componentes (§1.15 web): GlassSurface (backdrop-filter + guardrails: prohibido en tablas densas/
   forms críticos — documenta la regla en el JSDoc), GradientText, GradientBorder, GradientBackground,
   AnimatedGradient, MeshGradientBg (CSS), BlurOverlay, NoiseOverlay.
3. Todos degradan con prefers-reduced-motion y con `effects.glass.enabled=false` del tema (sober).

REPORTE: captura de los 8 en los 4 temas (stories) + verificación de que sober los neutraliza.
```

## Prompt W4.2 — DnD/Kanban + Carousel + media

```
[BLOQUE COMÚN de W2, con W4.1 cerrado]

MISIÓN (subpaths aislados — ADR-014):
1. /dnd: DragDropContext, Draggable, Droppable, SortableList, KanbanBoard/Column/Card (dnd-kit;
   a11y de arrastre por teclado según su patrón oficial).
2. /carousel: Carousel (Embla) con el contrato de items genérico de GridList.
3. ImageGallery/Lightbox (zoom/pan/slideshow — referencia de API: TFV Preview en
   docs\api\tfv-components.md §2) y Player (wrapper react-player en modal).

REPORTE: size-limit de cada subpath + verificación de aislamiento del entry principal.
```

## Prompt W4.3 — Rich content + utilidades finales

```
[BLOQUE COMÚN de W2, con W4.2 cerrado]

MISIÓN:
1. /editor: RichTextEditor (TipTap provisional — supuesto #6: si al integrar ves razón fuerte para
   Lexical, PREGUNTA con comparativa antes de seguir), contrato field, toolbar configurable.
2. CodeHighlight (+Tabs) con copy button.
3. EditorImage: wrapper con **Pintura como peer-dependency opcional** (C1-Q6) — error claro en
   runtime/tipos si el peer falta; documenta el setup de licencia en el README del subpath.
4. TransferList, VirtualizedSelect (§1.5 restantes), GlobalSearch (§1.11), TypographyStylesProvider,
   DirectionProvider (RTL) + auditoría rápida de RTL en los componentes de layout (gap: ¿algo asume LTR?).

REPORTE: estado de los supuestos #6 (TipTap/cmdk) tras el uso real — cerrar o escalar.
```

## Prompt W4.4 — DataGrid avanzado + charts completos + cierre Tier 3

```
[BLOQUE COMÚN de W2, con W4.3 cerrado]

MISIÓN:
1. DataGrid avanzado: Toolbar (filtros activos/búsqueda/bulk), ColumnHeader con menú, FilterPanel,
   column resize, export CSV, keyboard grid pattern completo.
2. Charts completos: RadarChart, ChartTooltip/ChartLegend compartidos, ChartPanel.
3. Auditoría final de subpaths y sideEffects de TODO nebula-web (preparación para W5).
4. CIERRE DE W4: gate de docs\05-roadmap.md W4 → docs\w4-closure.md. Cobertura contra 00-inventory:
   el catálogo web (204 P3 + adiciones C1-Q5) debe estar al 100% o con excepciones justificadas y
   aprobadas por el propietario.

REPORTE: cierre de W4 + lista definitiva de exports para la publicación de W5.
```

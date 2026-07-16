# Prompts W2 — Web Tier 1

> 5 prompts secuenciales. Requiere W1 cerrado (`docs/w1-closure.md`). Todos los componentes siguen la plantilla canónica `docs\patterns\web-component-template.md` y el alcance viene de `docs\00-inventory.md` §1 (columna Tier=1, plataforma W/WN).

**Bloque común — inclúyelo al inicio de CADA prompt de esta fase:**

```
Trabajas en C:\Users\Skr13\Documents\GitHub\Nebula (monorepo Nebula; W1 cerrado).
LEE ANTES: docs\patterns\web-component-template.md (plantilla OBLIGATORIA), docs\00-inventory.md §1
(alcance y notas por componente), docs\03-a11y-motion-performance.md §1 (contrato a11y de tu clase de
componentes), apps\playground-web\STORIES-TEMPLATE.md.
REGLAS: cada componente entrega types compartidos (contrato en el espíritu de tokens/types, sin tipos
web-only en la API pública de componentes WN) + implementación + testing contract (ADR-015) + stories
(4 temas) + entrada size-limit. Solo roles semánticos del theme. Dependencias nuevas → pregunta antes
(ADR-014). Política de preguntas del propietario: duda de API → opciones + recomendación.
GATE por prompt: turbo build/typecheck/lint/test/a11y/size verdes ANTES de reportar.
```

---

## Prompt W2.1 — Foundation/Layout + Utilities

```
[BLOQUE COMÚN]

MISIÓN — implementar en packages/web según 00-inventory §1.1 y §1.17 (Tier 1):
Layout: Flex, Center, Group, Grid (+Col), SimpleGrid, Container, Scroll, Divider (con label),
Space, AspectRatio, Paper. (Box ya existe de W1.4.)
Utilities: Portal, Transition, Collapse, FocusTrap (React Aria), VisuallyHidden, Conditional
(API unaria when+fallback — decisión C1-Q7), Valid, Omit.
Compound state con Jotai interno donde aplique (ADR-010, patrón Grid de Stellaria como referencia
conceptual: C:\Users\Skr13\Documents\GitHub\Stellaria-Frontend\src\ui\native\src\components\Layout\Grid).

REPORTE: tabla componente→estado + desviaciones de API respecto a la matriz (si las hubo, justificadas).
```

## Prompt W2.2 — Typography + `@stellaria/nebula-icons`

```
[BLOQUE COMÚN]

MISIÓN:
1. packages/icons (@stellaria/nebula-icons) según docs\adr\ADR-008: componente Icon + registry tipado
   con lucide-react como set base, registerIcons() con module augmentation de IconName, resolución
   perezosa (tree-shaking verificado con size-limit: importar 1 icono no arrastra el set).
2. Typography en packages/web según 00-inventory §1.2: Title, Anchor/Link (adapter de router por
   prop component — sin dependencia de Next), Highlight, Mark, Code (inline/block; evalúa syntax
   highlighting como subpath por peso — pregunta si la dep supera budget), Blockquote, List tipográfica.
   (Text ya existe de W1.4.)

REPORTE: API final del registry (con ejemplo de extensión) + tabla componente→estado.
```

## Prompt W2.3 — Actions + sistema de forms + inputs básicos

```
[BLOQUE COMÚN]
LEE ADEMÁS: docs\adr\ADR-005-forms-form-atoms.md (NebulaField duck-typed) y el plan original de
inputs de Stellaria: C:\Users\Skr13\Documents\GitHub\Stellaria-Frontend\docs\stellaria-input-components-plan.md
(spec de Header/FormField — inspiración, no copia).

MISIÓN:
1. Actions (§1.3): Button.Group, ActionIcon (+Group), ButtonClose, ButtonCopy, UnstyledButton,
   FileButton. (Button ya existe.)
2. Sistema de forms: FormField (label/description/error/required, lee status+error de NebulaField
   automáticamente; useTextField de React Aria para el vínculo label-input), useFieldProps en
   packages/hooks (conecta form-atoms como peer opcional — NUNCA import directo en web).
3. Inputs básicos (§1.4 Tier 1): TextInput, NumberInput, PasswordInput, Textarea (auto-resize),
   SearchInput (debounce con useDebounce), Checkbox (+Group, indeterminate), Radio (+Group),
   Switch (+Group), SegmentedControl (sliding indicator con motion tokens).
Contrato a11y de inputs (docs\03 §1) es OBLIGATORIO: label siempre vinculado, error con
aria-describedby + aria-invalid.

REPORTE: demo de un formulario completo con form-atoms + Zod en una story (fixture del patrón field).
```

## Prompt W2.4 — Combobox + Select/MultiSelect + overlays core

```
[BLOQUE COMÚN]
Esta es la zona de MAYOR riesgo a11y del proyecto (docs\05-roadmap.md riesgo 3). React Aria hooks son
obligatorios (ADR-003): useComboBox/useSelect/useListBox/useDialog/useOverlay/usePopover/useMenu/useTooltipTrigger.

MISIÓN (§1.4/§1.9 Tier 1):
1. Combobox (primitiva headless estilizable — base de Select/MultiSelect/Autocomplete futuros).
2. Select, MultiSelect (chips de valores, búsqueda).
3. Overlays: Modal (sobre <dialog> + useDialog; API con drawer/fullScreen/blurred como la referencia
   TFV de docs\api\tfv-components.md §2), Drawer, Popover, Tooltip, Menu (+ContextMenu básico).
4. Play functions de teclado para TODOS (Tab/flechas/Esc/Enter/Home/End/type-ahead según APG).

REPORTE: matriz de patrones APG cubiertos por componente + resultados de las play functions.
```

## Prompt W2.5 — Feedback + Data display core + Navegación core + cierre Tier 1

```
[BLOQUE COMÚN]

MISIÓN:
1. Feedback (§1.8): Alert, Toast + ToastProvider con API imperativa (nebulaToast.success(...) — patrón
   visual de referencia: FC Toast en docs\api\fonicredito-components.md §5), Loader, Skeleton,
   Progress (+segmentos multi-color).
2. Data display (§1.6 Tier 1): Card compound (Card.Section/Image/Badges/Actions/Meta — decisión C1-Q4;
   CardComplex llega en W3), Avatar (+Group), Badge, EmptyState.
3. Navegación (§1.10 Tier 1): Tabs (useTabList), NavLink, Breadcrumbs (declarativo), Pagination
   (declarativa, sin router).
4. CIERRE DE W2: verifica el gate completo de docs\05-roadmap.md W2 y escribe docs\w2-closure.md
   (checklist: testing contracts, axe 0 violaciones, presets sober/playful sin componentes rotos,
   budgets, keyboard tests).

REPORTE: cierre de W2 + lista de deuda/preguntas acumuladas para W3.
```

# Cierre de W2 — Web Tier 1

> Verificación del gate de `docs/05-roadmap.md` §W2. Fecha de cierre: 2026-07-27.
> Fases previas: `docs/f0-closure.md`, `docs/w1-closure.md`.

## Estado

**W2 cerrada.** El catálogo Tier 1 de `@stellaria/nebula-web` está completo: 68 componentes en `packages/web/src/components`, 63 archivos de test (**307 tests**) y 50 stories.

## Entregables contra el roadmap

| Entregable del gate           | Estado | Dónde                                                                                               |
| ----------------------------- | ------ | --------------------------------------------------------------------------------------------------- |
| Foundation / Layout           | ✅     | Flex, Center, Group, Grid (+Col), SimpleGrid, Container, Scroll, Divider, Space, AspectRatio, Paper |
| Typography                    | ✅     | Title, Anchor, Highlight, Mark, Code, Blockquote, List                                              |
| Utilities                     | ✅     | Portal, Transition, Collapse, FocusTrap, VisuallyHidden, Conditional, Valid, Omit                   |
| `@stellaria/nebula-icons`     | ✅     | Icon + registry lucide, `CreateIcons` y packs (ADR-008, ADR-023)                                    |
| Buttons / Actions             | ✅     | Button, UnstyledButton, ActionIcon, ButtonClose, ButtonCopy, ButtonGroup, FileButton                |
| Sistema de forms              | ✅     | FormField + `NebulaField` + `useFieldProps` + FieldError (ADR-005)                                  |
| Inputs básicos                | ✅     | TextInput, PasswordInput, Textarea, SearchInput, NumberInput, Checkbox, Radio, Switch (+Groups)     |
| Combobox + Select/MultiSelect | ✅     | Sobre `react-stately` (ADR-025), API `data` + `renderOption`                                        |
| Overlays core                 | ✅     | Modal, Drawer, Popover, Tooltip, Menu, ContextMenu                                                  |
| Feedback                      | ✅     | Alert, Toast + ToastProvider (`nebulaToast`), Loader, Skeleton, Progress                            |
| Card compound, Avatar, Badge  | ✅     | Card (+Section/Image/Badges/Meta/Actions), Avatar (+Group), Badge                                   |
| Navegación core               | ✅     | Segment/Tabs (ADR-026), NavLink, Pagination                                                         |
| EmptyState                    | ✅     | EmptyState                                                                                          |

Fuera de alcance web y justificado: `List (data, FlatList)` es solo native; `Breadcrumbs` y `Stepper` son Tier 2.

## Gate verificable

| Criterio                                   | Resultado                                                                                                                                                                      |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pnpm turbo build typecheck lint test`     | 29/29 tareas · 307 tests (**re-verificado el 2026-07-27: 355 tests**, tras cerrar la deuda #3 y añadir el testing contract de Avatar, Badge, EmptyState, Image, Loader y Tabs) |
| `pnpm --filter @stellaria/nebula-web size` | verde · 75 entradas, todas calibradas con medición real                                                                                                                        |
| `pnpm --filter playground-web a11y` (axe)  | 294/294 · 0 violaciones (**re-verificado el 2026-07-27: 338/338**, con las láminas `Foundations/Visual QA`)                                                                    |
| `pnpm check:contrast`                      | verde                                                                                                                                                                          |
| Temas oficiales                            | cubiertos por las stories `AllThemes` de cada familia                                                                                                                          |
| Keyboard tests de overlays/menu/combobox   | play functions en Popover, Menu, ContextMenu, Modal, Drawer, Select, Combobox, MultiSelect, Segment, Accordion, Pagination                                                     |

## Decisiones tomadas durante la fase

| ADR     | Qué resolvió                                                                                       |
| ------- | -------------------------------------------------------------------------------------------------- |
| ADR-021 | `ColorExtended` y prop `gradient` en Button                                                        |
| ADR-022 | Banda de budget para primitivos temables en runtime (≤12 kB)                                       |
| ADR-023 | `CreateIcons` tipado y packs de iconos                                                             |
| ADR-024 | Lenguaje visual y calibración W2.V (`caption=12`)                                                  |
| ADR-025 | `react-stately` y reparto de estado con Jotai en overlays                                          |
| ADR-026 | Compound `Segment` (absorbe SegmentedControl, adelanta Tabs) y motion con spring en los selectores |

## Defectos de a11y que encontró el gate

Se listan porque son el argumento de que el gate sirve, no un trámite:

1. **El gate era ciego a los portales.** `checkA11y` estaba acotado a `#storybook-root` y todos los overlays se renderizan fuera. Al pasarlo a `body` afloró un contraste de 1.02:1 en el atajo de teclado del menú enfocado.
2. **`aria-required` en `role=button`** (crítico) en el trigger de Select.
3. **`<label for>` no etiqueta a un `<button>`**: el trigger de Select se quedaba sin nombre accesible.
4. **`aria-hidden-focus`**: `useComboBox` exime del `aria-hidden` solo al input y al popover, dejando chips y botón de despliegue ocultos pero enfocables. Lo mismo en `Collapse`, que ocultaba sin retirar del orden de tabulación (resuelto con `inert`).
5. **`opacity` como estado deshabilitado** en los campos: compone todo el subárbol y hunde el contraste. Sustituido por colores explícitos.
6. **`aria-dialog-name`**: el `aria-labelledby` del Modal dependía del _slot id_ de `useDialog`, que falla cuando el contenido solo se monta al abrir.
7. **Falsos positivos de contraste durante la animación de entrada**: axe mide el color compuesto, así que el test-runner deja asentar la animación antes de auditar.

## Deuda y preguntas para W3

1. **Budgets de la clase colección**. Select 75, Combobox 81, MultiSelect 82 kB por módulo: son los más pesados del catálogo. Parten del baseline de un input (≈48 kB con `motion` vía FieldError) y suman la maquinaria de `react-stately`. Conviene evaluar carga diferida para los patrones de §1.5 antes de multiplicarlos.
2. **`domMax` vs `domAnimation`**. Los componentes con gesto (Switch, Segment) cargan `domMax`, que pesa ~20 kB más. Si aparecen más gestos, merece un punto de entrada compartido.
3. ~~**Animación de salida y tests**~~. **Resuelto el 2026-07-27**: el `waitFor` por defecto (1 s) contra una salida por spring hacía que `Modal.test.tsx` fallara de forma intermitente en la suite completa —la corrida de cierre de W2 reportó 307 en verde, pero no era reproducible—. Los dos asertos de desmontaje llevan ahora timeout explícito.
4. **`Tabs` como envoltorio**. Sigue en el catálogo por estar en el inventario, pero es azúcar sobre `Segment`. Decidir si se mantiene. (Ya tiene testing contract desde el 2026-07-27.)
5. ~~**Revisión visual pendiente**~~. **Resuelto el 2026-07-27**: las cinco láminas `Foundations/Visual QA` existen y la review se ejecutó en `docs/reviews/stellaria-ui-convergence-2026-07-27.md`, que además cerró la calibración de elevación dark (ADR-028). Queda como deuda extender `Composition`/`AllThemes` al resto del catálogo.
6. **`packages/native` sigue sin empezar.** Todo el Tier 1 existe solo en web; el contrato compartido en tokens está listo para N1.

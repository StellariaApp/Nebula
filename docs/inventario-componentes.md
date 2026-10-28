# Inventario de componentes web

Estado de cada componente de `@stellaria/nebula-web` (`packages/web/src/components/*`) medido sobre la rama `feat/nebula-alcance`. Se generó con un escaneo del repositorio (no a mano) y se puede repetir: contar casos `it(`/`test(` dentro de `components/<Nombre>/**/*.test.*` y buscar el nombre en `apps/playground-web/src/stories/*.stories.tsx`.

## Criterios

| Estado                         | Regla                                                                                                     |
| ------------------------------ | --------------------------------------------------------------------------------------------------------- |
| **terminado**                  | Aparece en al menos una historia y tiene 3 o más casos de prueba propios.                                 |
| **a medias**                   | Tiene historia y pruebas, pero solo 1 o 2 casos de prueba: el contrato apenas está cubierto.              |
| **sin pruebas**                | Ningún caso de prueba propio. Puede estar cubierto de rebote por otro componente, pero no tiene suite.    |
| **sin historia**               | Tiene pruebas pero no aparece en ninguna historia de Storybook.                                           |
| **sin historia y sin pruebas** | Ninguna de las dos.                                                                                       |
| **roto**                       | Falla en `build`, `typecheck`, `lint` o en sus pruebas. **Ninguno**: la línea base de `main` pasó entera. |

«Terminado» mide cobertura, no perfección: un componente puede estar terminado y tener defectos que nadie ha probado. Es lo que pasó con `Table`, `Select` y `Menu` (ver [Hallazgos](#hallazgos)).

Las 7 rutas de subpath (`/command`, `/charts`, `/datagrid`, `/dnd`, `/carousel`, `/media`, `/editor`) son reexportaciones: sus componentes viven en `components/` y la última columna indica a qué subpath pertenecen.

## Resumen

| Estado                     | `main` | esta rama |
| -------------------------- | -----: | --------: |
| terminado                  |    107 |       112 |
| a medias                   |     18 |        15 |
| sin pruebas                |     36 |        34 |
| sin historia               |      4 |         4 |
| sin historia y sin pruebas |      0 |         0 |
| roto                       |      0 |         0 |
| **total**                  |    165 |       165 |

## Los componentes que necesitan las páginas de preventa y el panel

Los 20 elementos de la lista de alcance, desglosados en 24 componentes porque algunos son dos piezas (insignia y estado, campo y burbuja de error, diálogo modal y panel, skeleton y spinner). «Antes» es `main`.

| Componente    | Uso                                  | Antes       | Ahora     | Pruebas (antes → ahora) | Nota                                                                                                                                                               |
| ------------- | ------------------------------------ | ----------- | --------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Button`      | botón                                | terminado   | terminado | 33 → 37                 | Sin cambios de fondo; se añade una suite de accesibilidad con axe y teclado.                                                                                       |
| `Anchor`      | enlace                               | terminado   | terminado | 7 → 10                  | Sin cambios de fondo; se añade una suite de accesibilidad con axe y teclado.                                                                                       |
| `TextInput`   | campo de texto                       | terminado   | terminado | 5 → 10                  | Sin cambios de fondo; se añade una suite de accesibilidad con axe y teclado.                                                                                       |
| `Textarea`    | área de texto                        | a medias    | terminado | 2 → 6                   | Pasa de 2 pruebas a descripción/error, Enter y axe; añade `Textarea.md`. Su historia sigue siendo `Forms/Inputs › Multiline`.                                      |
| `Select`      | select                               | terminado   | terminado | 11 → 17                 | El `listbox` abierto no tenía nombre accesible (`aria-input-field-name`). Corregido; añade `Select.md`.                                                            |
| `Checkbox`    | checkbox                             | terminado   | terminado | 3 → 7                   | Pasa de 3 pruebas a indeterminado, grupo, deshabilitado y axe.                                                                                                     |
| `Radio`       | radio                                | a medias    | terminado | 2 → 6                   | Pasa de 2 pruebas a flechas, grupo, deshabilitado y axe.                                                                                                           |
| `Switch`      | switch                               | a medias    | terminado | 2 → 6                   | Pasa de 2 pruebas a teclado, grupo, deshabilitado y axe.                                                                                                           |
| `FormField`   | campo con etiqueta y error           | terminado   | terminado | 5 → 8                   | Sin cambios de fondo; se añade una suite de accesibilidad con axe y teclado.                                                                                       |
| `FieldError`  | campo con etiqueta y error (burbuja) | terminado   | terminado | 5 → 5                   | Sin cambios; la burbuja la cubre la suite de `FormField` y la de `TextInput`.                                                                                      |
| `Card`        | tarjeta                              | terminado   | terminado | 19 → 23                 | Historia propia.                                                                                                                                                   |
| `Badge`       | insignia                             | terminado   | terminado | 7 → 10                  | Historia propia (incluye `StatusBadge`).                                                                                                                           |
| `StatusBadge` | estado                               | terminado   | terminado | 28 → 30                 | Sin cambios de fondo; se añade una suite de accesibilidad con axe y teclado.                                                                                       |
| `Alert`       | alerta                               | terminado   | terminado | 7 → 11                  | Historia propia (antes solo en la vista general).                                                                                                                  |
| `Modal`       | diálogo (modal)                      | terminado   | terminado | 21 → 24                 | Sin cambios de fondo; se añade una suite de accesibilidad con axe y teclado.                                                                                       |
| `Dialog`      | diálogo (panel no modal)             | sin pruebas | terminado | 0 → 10                  | Es un panel no modal (`role=status`), no el diálogo modal. Sin pruebas ni doc; ahora con ambas e historia propia.                                                  |
| `Tabs`        | pestañas                             | terminado   | terminado | 8 → 13                  | Historia propia; el teclado vive en `Segment`.                                                                                                                     |
| `Table`       | tabla simple                         | sin pruebas | terminado | 0 → 7                   | La fila pulsable perdía su rol `row` (`role="button"` sobre `<tr>`) y axe marcaba `aria-allowed-attr`. Corregido; ahora con pruebas, `Table.md` e historia propia. |
| `Tooltip`     | tooltip                              | terminado   | terminado | 5 → 9                   | Sin cambios de fondo; se añade una suite de accesibilidad con axe y teclado.                                                                                       |
| `Menu`        | menú desplegable                     | terminado   | terminado | 10 → 15                 | Las filas animaban su entrada ignorando `prefers-reduced-motion`. Corregido en su hoja.                                                                            |
| `Toast`       | toast                                | terminado   | terminado | 8 → 13                  | No tenía historia propia (solo dentro de `Feedback/Overview`); ahora sí.                                                                                           |
| `Skeleton`    | skeleton                             | terminado   | terminado | 6 → 10                  | Historia propia (incluye `Loader`).                                                                                                                                |
| `Loader`      | spinner                              | terminado   | terminado | 5 → 8                   | Sin cambios de fondo; se añade una suite de accesibilidad con axe y teclado.                                                                                       |
| `Avatar`      | avatar                               | terminado   | terminado | 15 → 19                 | Historia propia.                                                                                                                                                   |

Todos tienen ahora una suite `*.a11y.test.tsx` (axe-core sobre el DOM, foco y teclado, nombres accesibles) y están dentro del contrato estático `src/__tests__/a11y-contract.test.ts` (foco visible y `prefers-reduced-motion`).

## Todos los componentes

Pruebas = casos propios. Historias = primeras tres donde aparece (`—` si ninguna).

| Componente                 | Estado       | Pruebas | Historias                                         | `.md` | Subpath  |
| -------------------------- | ------------ | ------: | ------------------------------------------------- | ----- | -------- |
| `Accordion`                | terminado    |       9 | DataDisplay                                       | sí    | —        |
| `ActionIcon`               | terminado    |       6 | ActionIcon, ButtonActions, Dashboard…             | sí    | —        |
| `Affix`                    | sin pruebas  |       0 | RosetteFeed, Utilities                            | sí    | —        |
| `Alert`                    | terminado    |      11 | Alert, Feedback, RosetteAlta…                     | sí    | —        |
| `Anchor`                   | terminado    |      10 | Anchor                                            | sí    | —        |
| `AnimatedGradient`         | terminado    |       8 | GradientText, Gradients                           | sí    | —        |
| `AppShell`                 | terminado    |      20 | Dashboard, Header, RosetteAlta…                   | sí    | —        |
| `AspectRatio`              | a medias     |       2 | AspectRatio, Media                                | no    | —        |
| `AudioPlayer`              | terminado    |       4 | Media                                             | sí    | media    |
| `Avatar`                   | terminado    |      19 | Avatar, Dashboard, DataDisplay…                   | sí    | —        |
| `Badge`                    | terminado    |      10 | Badge, Card, Collections…                         | sí    | —        |
| `Banderole`                | sin pruebas  |       0 | Collections, Form                                 | no    | —        |
| `Blockquote`               | terminado    |       3 | Blockquote                                        | no    | —        |
| `BlurOverlay`              | terminado    |       9 | Effects                                           | sí    | —        |
| `Box`                      | terminado    |       9 | ActionIcon, Alert, Anchor…                        | sí    | —        |
| `Breadcrumbs`              | terminado    |      14 | Dashboard, Navigation, RosetteAvatar              | sí    | —        |
| `Burger`                   | sin pruebas  |       0 | Landing, Nav, Shell                               | no    | —        |
| `Button`                   | terminado    |      37 | Alert, Button, ButtonActions…                     | sí    | —        |
| `ButtonClose`              | a medias     |       2 | ButtonActions                                     | no    | —        |
| `ButtonCopy`               | a medias     |       1 | ButtonActions                                     | no    | —        |
| `ButtonGroup`              | a medias     |       2 | ButtonActions                                     | no    | —        |
| `Calendar`                 | terminado    |      11 | Calendar                                          | sí    | —        |
| `Card`                     | terminado    |      23 | Card, Charts, Collections…                        | sí    | —        |
| `CardComplex`              | terminado    |      11 | CardComplex                                       | sí    | —        |
| `Carousel`                 | terminado    |      16 | Media, RosetteFeed                                | sí    | carousel |
| `Center`                   | terminado    |       3 | AspectRatio, Center                               | no    | —        |
| `Charts`                   | terminado    |      33 | Charts                                            | sí    | charts   |
| `Checkbox`                 | terminado    |       7 | Drawer, FormDemo, FoundationsForms…               | sí    | —        |
| `Chip`                     | sin pruebas  |       0 | Slider                                            | sí    | —        |
| `Code`                     | terminado    |       3 | Code, CommandPalette, PermissionGate              | sí    | —        |
| `CodeHighlight`            | terminado    |      21 | RichContent                                       | sí    | —        |
| `Collapse`                 | a medias     |       2 | Collapse                                          | sí    | —        |
| `ColorPicker`              | terminado    |      11 | Pickers                                           | no    | —        |
| `ColorSwatch`              | sin pruebas  |       0 | Primitives                                        | no    | —        |
| `Combobox`                 | terminado    |      18 | Combobox                                          | sí    | —        |
| `CommandPalette`           | terminado    |      15 | CardComplex, CommandPalette                       | no    | command  |
| `Conditional`              | terminado    |       3 | Conditional                                       | sí    | —        |
| `Container`                | terminado    |       4 | Container, StarField                              | sí    | —        |
| `Countdown`                | sin historia |       9 | —                                                 | no    | —        |
| `CurrencyDisplay`          | sin pruebas  |       0 | DomainGenerics                                    | no    | —        |
| `Cutout`                   | a medias     |       2 | Cutout                                            | sí    | —        |
| `DataGrid`                 | terminado    |      35 | DataGrid, DataGridAdvanced                        | sí    | datagrid |
| `DateDisplay`              | sin pruebas  |       0 | DomainGenerics                                    | sí    | —        |
| `DatePicker`               | terminado    |      13 | DatePicker                                        | no    | —        |
| `DateRangePicker`          | sin pruebas  |       0 | DatePicker                                        | no    | —        |
| `DateTimePicker`           | sin pruebas  |       0 | DatePicker                                        | no    | —        |
| `Dialog`                   | terminado    |      10 | Dialog, Utilities                                 | sí    | —        |
| `DirectionProvider`        | terminado    |       6 | RichContent                                       | sí    | —        |
| `Divider`                  | terminado    |       5 | Dashboard, Divider, FoundationsActions…           | sí    | —        |
| `Dock`                     | terminado    |       4 | Dock                                              | sí    | —        |
| `DragDrop`                 | sin historia |      11 | —                                                 | sí    | dnd      |
| `Drawer`                   | terminado    |       4 | Drawer, Nav, RosetteAvatar…                       | no    | —        |
| `Dropzone`                 | sin pruebas  |       0 | ComposedInputs, RosetteAlta                       | no    | —        |
| `EditorImage`              | sin historia |       9 | —                                                 | no    | editor   |
| `EmptyModule`              | a medias     |       2 | DomainGenerics                                    | sí    | —        |
| `EmptyState`               | terminado    |       6 | Combobox, DataDisplay, RosetteAvatares…           | no    | —        |
| `Feature`                  | sin pruebas  |       0 | Landing, Shell                                    | no    | —        |
| `FieldError`               | terminado    |       5 | FieldError                                        | sí    | —        |
| `Fieldset`                 | sin pruebas  |       0 | Pickers                                           | sí    | —        |
| `FileButton`               | a medias     |       2 | ButtonActions                                     | no    | —        |
| `FileInput`                | sin pruebas  |       0 | Pickers                                           | no    | —        |
| `Filters`                  | terminado    |      15 | RosetteAvatares, SearchFilters                    | sí    | —        |
| `Flex`                     | terminado    |       4 | Box, Dashboard, Flex…                             | no    | —        |
| `FocusTrap`                | a medias     |       2 | FocusTrap                                         | sí    | —        |
| `Footer`                   | terminado    |      11 | Dashboard, Form, Landing…                         | sí    | —        |
| `Form`                     | terminado    |      20 | Form, FormDemo                                    | sí    | —        |
| `FormField`                | terminado    |       8 | FormField                                         | sí    | —        |
| `GlassSurface`             | terminado    |      11 | Dashboard, Effects, RosetteAlta…                  | sí    | —        |
| `GlobalSearch`             | terminado    |      18 | RichContent                                       | sí    | —        |
| `GradientBackground`       | terminado    |       9 | Gradients                                         | sí    | —        |
| `GradientBorder`           | terminado    |      33 | Dashboard, Gradients, Landing                     | sí    | —        |
| `GradientText`             | terminado    |       9 | Cutout, Dashboard, Effects…                       | sí    | —        |
| `Grid`                     | terminado    |       5 | DataGridAdvanced, Grid                            | sí    | —        |
| `GridList`                 | sin pruebas  |       0 | Collections, RosetteAvatares                      | no    | —        |
| `Group`                    | terminado    |       4 | ButtonActions, Effects, FocusTrap…                | sí    | —        |
| `Header`                   | terminado    |      14 | Dashboard, Form, Header…                          | sí    | —        |
| `Hero`                     | terminado    |       9 | Cutout, Landing, Shell                            | no    | —        |
| `Highlight`                | terminado    |       6 | Highlight                                         | no    | —        |
| `HoverCard`                | sin pruebas  |       0 | Utilities                                         | no    | —        |
| `Image`                    | terminado    |       9 | DataDisplay                                       | sí    | —        |
| `ImageGallery`             | terminado    |      10 | Media                                             | no    | —        |
| `Indicator`                | sin pruebas  |       0 | Dashboard, Primitives                             | no    | —        |
| `InfiniteList`             | terminado    |      18 | DomainGenerics                                    | sí    | —        |
| `InputCurrency`            | sin pruebas  |       0 | ComposedInputs, Form                              | no    | —        |
| `InputDial`                | sin pruebas  |       0 | ComposedInputs                                    | no    | —        |
| `InputPhone`               | terminado    |      21 | ComposedInputs, Form                              | sí    | —        |
| `JsonInput`                | sin pruebas  |       0 | Pickers                                           | no    | —        |
| `Kanban`                   | terminado    |      14 | DragDrop                                          | sí    | dnd      |
| `Kbd`                      | sin pruebas  |       0 | CommandPalette, Primitives, RosetteCarril…        | no    | —        |
| `Lightbox`                 | terminado    |      15 | Media                                             | sí    | —        |
| `List`                     | terminado    |       5 | List                                              | sí    | —        |
| `LiveVideo`                | terminado    |      11 | Media                                             | sí    | media    |
| `Loader`                   | terminado    |       8 | Feedback, Skeleton                                | sí    | —        |
| `LoadingOverlay`           | sin pruebas  |       0 | Utilities                                         | no    | —        |
| `Main`                     | sin pruebas  |       0 | Header, Landing, Nav                              | sí    | —        |
| `Mark`                     | terminado    |       3 | Mark                                              | no    | —        |
| `MediaCard`                | terminado    |       5 | Media                                             | sí    | —        |
| `Menu`                     | terminado    |      15 | CardComplex, Dashboard, Menu…                     | sí    | —        |
| `MeshGradientBg`           | terminado    |       9 | Effects, Gradients                                | sí    | —        |
| `Modal`                    | terminado    |      24 | CommandPalette, Media, Modal…                     | sí    | —        |
| `MonthPicker`              | terminado    |       8 | MonthPicker                                       | no    | —        |
| `MultiSelect`              | terminado    |       9 | MultiSelect                                       | sí    | —        |
| `NProgress`                | sin pruebas  |       0 | Utilities                                         | no    | —        |
| `NativeSelect`             | sin pruebas  |       0 | Slider                                            | no    | —        |
| `Nav`                      | terminado    |      53 | Header, Landing, Nav…                             | sí    | —        |
| `NavLink`                  | terminado    |       7 | Dashboard, Header, Navigation…                    | sí    | —        |
| `NoiseOverlay`             | terminado    |       6 | Effects                                           | sí    | —        |
| `NumberInput`              | terminado    |       3 | FieldError, Inputs, RosetteSaldo                  | no    | —        |
| `Omit`                     | a medias     |       2 | Modal, ValidOmit                                  | sí    | —        |
| `Overlay`                  | terminado    |      17 | Utilities                                         | no    | —        |
| `Pagination`               | terminado    |      18 | Navigation                                        | sí    | —        |
| `Panel`                    | sin pruebas  |       0 | ButtonActions, Dashboard, DataGridAdvanced…       | no    | —        |
| `Paper`                    | terminado    |       4 | ActionIcon, ButtonActions, Calendar…              | sí    | —        |
| `PasswordInput`            | a medias     |       1 | FormDemo, FormField, Inputs                       | no    | —        |
| `PermissionGate`           | terminado    |      19 | PermissionGate                                    | sí    | —        |
| `PinInput`                 | terminado    |      13 | Pickers                                           | sí    | —        |
| `Player`                   | terminado    |       7 | Media, RosetteFeed                                | sí    | media    |
| `Popover`                  | terminado    |       5 | Popover                                           | no    | —        |
| `Portal`                   | a medias     |       2 | Portal, Utilities                                 | sí    | —        |
| `Progress`                 | terminado    |       7 | Dashboard, Feedback, RosetteAvatar…               | sí    | —        |
| `QuickAction`              | sin pruebas  |       0 | DomainGenerics, PermissionGate                    | sí    | —        |
| `Radio`                    | terminado    |       6 | Toggles                                           | sí    | —        |
| `Rating`                   | terminado    |      11 | Pickers                                           | no    | —        |
| `Reveal`                   | terminado    |      29 | Landing, Reveal                                   | sí    | —        |
| `RichTextEditor`           | terminado    |      11 | RichContent                                       | no    | editor   |
| `Scroll`                   | terminado    |      13 | Scroll, ShellHanging                              | sí    | —        |
| `ScrollProgress`           | sin historia |       5 | —                                                 | no    | —        |
| `Search`                   | sin pruebas  |       0 | CommandPalette, Inputs, RichContent…              | sí    | —        |
| `SearchInput`              | a medias     |       2 | Drawer, Inputs, RosetteExplorar                   | no    | —        |
| `SearchableList`           | sin pruebas  |       0 | DomainGenerics                                    | sí    | —        |
| `Section`                  | terminado    |      37 | Card, Dashboard, FoundationsSurfaces…             | sí    | —        |
| `Segment`                  | terminado    |      30 | Dock, RosetteAlta, RosetteAvatar…                 | sí    | —        |
| `Select`                   | terminado    |      17 | Dock, FoundationsForms, RosetteUsuarios…          | sí    | —        |
| `Signature`                | sin pruebas  |       0 | ComposedInputs                                    | no    | —        |
| `SimpleGrid`               | terminado    |       7 | CardComplex, Charts, Collections…                 | sí    | —        |
| `Skeleton`                 | terminado    |      10 | Feedback, Media, Skeleton                         | sí    | —        |
| `Slider`                   | terminado    |      25 | Slider                                            | sí    | —        |
| `Space`                    | terminado    |       3 | Button, Landing, Space                            | no    | —        |
| `Spoiler`                  | sin pruebas  |       0 | Primitives                                        | no    | —        |
| `StarField`                | terminado    |      15 | Dashboard, Landing, RosetteCarril…                | sí    | —        |
| `Stat`                     | terminado    |       3 | Charts, Collections, Effects…                     | sí    | —        |
| `StatusBadge`              | terminado    |      30 | Badge, DomainGenerics, RosetteAvatar…             | sí    | —        |
| `Stepper`                  | sin pruebas  |       0 | Form, RosetteAlta                                 | no    | —        |
| `Switch`                   | terminado    |       6 | FoundationsForms, RosetteAvatar, RosetteAvatares… | sí    | —        |
| `Table`                    | terminado    |       7 | Collections, Dashboard, DomainGenerics…           | sí    | —        |
| `Tabs`                     | terminado    |      13 | CardComplex, Dashboard, PermissionGate…           | sí    | —        |
| `Tag`                      | terminado    |      12 | Primitives                                        | no    | —        |
| `TagsInput`                | terminado    |      17 | Pickers                                           | no    | —        |
| `Text`                     | terminado    |       6 | ActionIcon, Anchor, AspectRatio…                  | sí    | —        |
| `TextInput`                | terminado    |      10 | FieldError, Form, FormDemo…                       | sí    | —        |
| `Textarea`                 | terminado    |       6 | FoundationsForms, Inputs, RosetteAlta…            | no    | —        |
| `ThemeIcon`                | sin pruebas  |       0 | Primitives                                        | no    | —        |
| `TimeInput`                | sin pruebas  |       0 | DatePicker                                        | no    | —        |
| `Timeline`                 | sin pruebas  |       0 | Collections, RosetteAvatar                        | sí    | —        |
| `Title`                    | terminado    |       3 | Calendar, Card, Charts…                           | no    | —        |
| `Toast`                    | terminado    |      13 | Feedback, Toast                                   | sí    | —        |
| `Tooltip`                  | terminado    |       9 | Dashboard, FieldError, RosetteAlta…               | sí    | —        |
| `TransferList`             | terminado    |      10 | RichContent                                       | sí    | —        |
| `Transition`               | a medias     |       2 | Reveal, ShellHanging, Transition                  | sí    | —        |
| `TypographyStylesProvider` | terminado    |       5 | RichContent                                       | no    | —        |
| `UnstyledButton`           | terminado    |       3 | ButtonActions                                     | no    | —        |
| `Valid`                    | terminado    |       3 | ValidOmit                                         | no    | —        |
| `VideoPlayer`              | terminado    |       4 | Media                                             | sí    | media    |
| `Viewer`                   | terminado    |       5 | Media                                             | sí    | —        |
| `VisuallyHidden`           | a medias     |       2 | Dashboard, RosetteCarril, RosetteFeed…            | no    | —        |

## Hallazgos

Defectos reales que salieron al pasar axe y el teclado por los componentes «terminados», y que esta rama corrige:

1. **`Table.Row` pulsable** ponía `role="button"` sobre el `<tr>`: sacaba la fila de la tabla (los lectores dejaban de contarla) y `aria-selected` no es válido en un `button` (`aria-allowed-attr`). Ahora conserva su rol `row`, es enfocable y se activa con Enter y Espacio.
2. **`Select` abierto**: el `listbox` salía con `aria-labelledby=""` y sin nombre (`aria-input-field-name`). Ahora se nombra con la etiqueta del campo.
3. **`Menu`**: las filas entran en cascada por CSS y no respetaban `prefers-reduced-motion`. Ahora la hoja las deja quietas.

## Pendiente (fuera del alcance de esta rama)

- **Sin historia** (tienen pruebas): `Countdown`, `DragDrop`, `EditorImage`, `ScrollProgress`.
- **A medias** (1–2 casos de prueba): ver la tabla anterior. Son sobre todo utilidades y piezas pequeñas (`VisuallyHidden`, `Portal`, `Omit`, `ButtonClose`...).
- **Sin pruebas propias**: 34 componentes, muchos cubiertos de rebote por las suites de sus padres (por ejemplo `Chip` o `Fieldset`). Los de más riesgo para un panel son `NativeSelect`, `FileInput`, `DateRangePicker`, `DateTimePicker`, `InputCurrency` y `TimeInput`.
- **No auditados con axe**: `MultiSelect`, `Combobox` y `NativeSelect` comparten patrón con `Select`; conviene comprobar que sus listas abiertas tienen nombre accesible, como se hizo con `Select`.
- **Contraste AA** sobre el tema por defecto lo sigue cubriendo `pnpm check:contrast`; axe en jsdom no calcula contraste (no hay layout), así que no se duplica ahí.
- **Retorno del foco de `Modal`** y la contención de Tab son del `<dialog>` nativo: jsdom no los implementa, así que no se prueban en Vitest. Lo cubre el gate de accesibilidad de Storybook en un navegador real.

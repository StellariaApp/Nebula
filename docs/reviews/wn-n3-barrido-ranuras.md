# WN · N3 — Barrido de props de ranura

Cuaderno de trabajo del barrido decidido por el propietario (opción A, 2026-08-06). Sobrevive entre
sesiones: **el estado vive en la tabla**, no en la memoria de quien lo ejecuta.

## El criterio, para que la tanda 8 se parezca a la tanda 1

Lleva `<nodo>Props` el nodo que el componente **envuelve** y que tiene **identidad propia**: texto,
icono, cabecera, pie, control, o una región cuyo espaciado o alineación el consumidor querría ajustar
sin forkear.

**No lleva**:

- La ranura que se pinta **cruda**. El consumidor ya la controla entera, y añadir la prop sería ruido
  (ADR-098).
- El envoltorio puramente **estructural**, cuyo efecto ya se controla desde la raíz. Por nombre de
  clase: `root`, `wrapper`, `inner`, `container`, `stack`, `shell`, `frame`, `viewport`, `layer`.
- El nodo que **anima motion con un `style` calculado**: una ranura ahí invita a que el consumidor
  pise la animación. Precedente: el thumb de `Switch`.

**El nombre sale de la clase**: `styles.title` → `titleProps`, `styles.label_text` → `labelTextProps`.
Cuando varios componentes comparten forma, **manda el contrato común** sobre el nombre de la clase —
como `labelProps`/`indicatorProps` en `Checkbox`, `Radio` y `Switch`, que son tres componentes con la
misma anatomía y por eso llevan los mismos nombres.

**El tipo** sale de ADR-104: nodo de texto → `TextSlotProps`, envoltorio → `BoxSlotProps`, componente
de Nebula → su propio `Props`, glifo → `GlyphProps`.


**Cada ranura se documenta al añadirla** (ADR-105). El JSDoc sobre un miembro de un tipo público no
es un comentario: viaja al `.d.ts` y es lo que el consumidor lee al teclear. Se escribe lo que el
tipo no puede decir —sobre qué nodo cae, cuándo no aplica, si se comparte entre varios nodos—, no
una paráfrasis del nombre.

## Cómo se trabaja

Por tandas, con los gates en verde entre tanda y tanda y un commit por tanda. Cada tanda mide su
coste con `size-limit` y sube los presupuestos que rebase, que es el criterio del propietario.

Las ranuras son **puramente aditivas**: añadir una nunca rompe a un consumidor. Por eso este barrido
no bloquea v1 y puede continuar después de publicar.

## Dependencias con otros tramos

`Hero` y `Section` esperan a N2: se convierten en compound primero, porque **el montaje decide dónde
caen las ranuras**. Convertirlas antes obligaría a rehacerlas.

## Alcance medido (2026-08-06)

Es el techo con el criterio aplicado por nombre de clase. Cada tanda puede descartar nodos por
juicio; cuando lo haga, se anota aquí el porqué.

## Estado

**154 componentes, 485 nodos.**

| Componente | Nodos | Ranuras propuestas | Estado |
| --- | ---: | --- | --- |
| `DataGrid/DataGrid.tsx` | 13 | panel scroller table caption head th spacer empty row td foot status toolbarGap | hecho |
| `GlobalSearch/GlobalSearch.tsx` | 12 | trigger shortcut searchRow optionIcon input list groupLabel option optionBody optionTitle optionDescription status | hecho |
| `Hero/Hero.tsx` | 12 | hero media scrim slot body hiper header title subtitle description actions bottom | espera a N2 |
| `CardComplex/CardComplex.tsx` | 11 | badgeRow mediaWrap mediaActions body header heading title description metaRow person foot | pendiente |
| `Form/Form.tsx` | 10 | fieldset header headerText title headerActions banderole content footer error actions | pendiente |
| `Lightbox/Lightbox.tsx` | 10 | empty stage image caption bar group counter filmstrip thumb thumbImage | pendiente |
| `Dropzone/Dropzone.tsx` | 9 | zone icon title hint nativeInput list item fileName preview | pendiente |
| `Footer/Footer.tsx` | 9 | brand brandLink brandDescription link group groupTitle groupList legal columns | pendiente |
| `Section/Section.tsx` | 9 | section rail head heading title description actions body foot | espera a N2 |
| `Stepper/Stepper.tsx` | 9 | list bullet body label description item step track panel | hecho |
| `TransferList/TransferList.tsx` | 9 | pane paneHead paneTitle paneCount search list item empty controls | pendiente |
| `Table/Table.tsx` | 8 | table caption head foot row cell scroll scrollInner | pendiente |
| `Breadcrumbs/Breadcrumbs.tsx` | 7 | size list item expand separator current link | hecho |
| `Charts/ChartFrame.tsx` | 7 | title canvas summary details detailsSummary tableWrap table | pendiente |
| `CommandPalette/CommandPalette.tsx` | 7 | icon body label description inputRow empty list | pendiente |
| `Progress/Progress.tsx` | 7 | track indeterminate fill ring ringSvg ringArc ringLabel | pendiente |
| `Timeline/Timeline.tsx` | 7 | item bullet line body title meta description | hecho |
| `Toast/ToastProvider.tsx` | 7 | toast icon body title message action region | hecho |
| `Accordion/Accordion.tsx` | 6 | item trigger chevron icon label panel | hecho |
| `Carousel/Carousel.tsx` | 6 | carousel emptySlot slide controls indicators indicator | pendiente |
| `CodeHighlight/CodeHighlight.tsx` | 6 | header floatingCopy scroll pre gutter source | pendiente |
| `DataGrid/Toolbar.tsx` | 6 | toolbar toolbarSearch toolbarGap chips bulkBar bulkCount | pendiente |
| `InfiniteList/InfiniteList.tsx` | 6 | list item foot live end sentinel | pendiente |
| `Modal/Modal.tsx` | 6 | surface header heading subtitle body footer | hecho |
| `Nav/components/Links.tsx` | 6 | link links indicator overflow overflowTrigger overflowPanel | pendiente |
| `AppShell/AppShell.tsx` | 5 | rail skip chrome main scrollShadow | pendiente |
| `AppShell/components/Links.tsx` | 5 | links linksHeader linksContent link label | pendiente |
| `AppShell/components/Sidebar.tsx` | 5 | sidebar toggle sidebarContainer sidebarSlot sidebarBody | pendiente |
| `Charts/ChartPanel.tsx` | 5 | panelGrid panelCard panelHead panelTitle panelDescription | pendiente |
| `Charts/ChartTooltip.tsx` | 5 | tooltip tooltipTitle tooltipRow swatch tooltipValue | pendiente |
| `Kanban/KanbanCard.tsx` | 5 | card cardHead cardTitle cardDescription cardMeta | pendiente |
| `Kanban/KanbanColumn.tsx` | 5 | column columnHeader columnTitle columnCount columnEmpty | pendiente |
| `MultiSelect/MultiSelect.tsx` | 5 | control chip chipLabel chipRemove search | pendiente |
| `Nav/components/Sidebar.tsx` | 5 | sidebarScrim sidebar sidebarHead sidebarBody sidebarFooter | pendiente |
| `QuickAction/QuickAction.tsx` | 5 | badge icon body label description | hecho |
| `DataGrid/ColumnHeader.tsx` | 4 | headCell sortButton sortIcon resizer | pendiente |
| `EditorImage/EditorImage.tsx` | 4 | trigger image hint missing | pendiente |
| `Filters/Filters.tsx` | 4 | panel empty list foot | pendiente |
| `ImageGallery/ImageGallery.tsx` | 4 | empty gallery tile tileImage | pendiente |
| `Menu/MenuList.tsx` | 4 | item icon labels shortcut | pendiente |
| `Pagination/Pagination.tsx` | 4 | control value pill dots | hecho |
| `Slider/SliderBase.tsx` | 4 | row fill marks mark | pendiente |
| `Switch/Switch.tsx` | 4 | input track thumb labelText | hecho |
| `Tag/Tag.tsx` | 4 | tag section label remove | hecho |
| `ActionIcon/ActionIcon.tsx` | 3 | actionIcon spinner iconWrap | pendiente |
| `AnimatedGradient/AnimatedGradient.tsx` | 3 | animatedGradient drift scrim | pendiente |
| `Badge/Badge.tsx` | 3 | badge dot section | hecho |
| `Banderole/Banderole.tsx` | 3 | icon body actions | hecho |
| `BlurOverlay/BlurOverlay.tsx` | 3 | blurOverlay veil content | pendiente |
| `Button/Button.tsx` | 3 | button spinner section | pendiente |
| `Calendar/CalendarHeader.tsx` | 3 | nav header heading | pendiente |
| `Card/Card.tsx` | 3 | badges meta actions | descartado: los tres nodos son la raiz de las partes del compound |
| `Charts/ChartLegend.tsx` | 3 | legend legendItem swatch | pendiente |
| `Checkbox/Checkbox.tsx` | 3 | input box labelText | hecho |
| `Chip/ChipGroup.tsx` | 3 | groupRoot groupLabel group | pendiente |
| `ColorPicker/ColorInput.tsx` | 3 | preview trigger dropdown | pendiente |
| `ColorPicker/ColorPicker.tsx` | 3 | area swatches swatch | pendiente |
| `Countdown/Countdown.tsx` | 3 | unit value caption | hecho |
| `Dialog/Dialog.tsx` | 3 | dialog head title | hecho |
| `GradientBorder/GradientBorder.tsx` | 3 | gradientBorder beam arc | pendiente |
| `Image/BackgroundImage.tsx` | 3 | background overlay backgroundContent | pendiente |
| `List/components/Item.tsx` | 3 | item itemWithIcon itemIcon | pendiente |
| `Loader/Loader.tsx` | 3 | spinner dot bar | descartado: son el mecanismo de la animacion; size y color ya lo cubren |
| `NavLink/NavLink.tsx` | 3 | indicator section chevron | hecho |
| `Panel/Panel.tsx` | 3 | panel pane separator | pendiente |
| `Radio/Radio.tsx` | 3 | input dot labelText | hecho |
| `Rating/Rating.tsx` | 3 | group item partial | pendiente |
| `SearchableList/SearchableList.tsx` | 3 | toolbar search count | pendiente |
| `Segment/components/Control.tsx` | 3 | control indicator tab | pendiente |
| `Select/Select.tsx` | 3 | trigger chevron dropdown | hecho |
| `StarField/StarField.tsx` | 3 | starField aurora star | pendiente |
| `TagsInput/TagsInput.tsx` | 3 | tag tagLabel remove | pendiente |
| `Avatar/Avatar.tsx` | 2 | avatar image | hecho |
| `Blockquote/Blockquote.tsx` | 2 | blockquote iconWrap | hecho |
| `Calendar/CalendarGrid.tsx` | 2 | cellWrapper weekday | pendiente |
| `Charts/TrendIndicator.tsx` | 2 | trend arrow | pendiente |
| `CodeHighlight/CodeHighlightTabs.tsx` | 2 | tabList bare | pendiente |
| `DateRangePicker/DateRangePicker.tsx` | 2 | rangeSeparator trigger | pendiente |
| `Divider/Divider.tsx` | 2 | line label | hecho |
| `DragDrop/Draggable.tsx` | 2 | draggable row | pendiente |
| `DragDrop/SortableItem.tsx` | 2 | draggable row | pendiente |
| `DragDrop/SortableList.tsx` | 2 | list emptySlot | pendiente |
| `Fieldset/Fieldset.tsx` | 2 | legend description | pendiente |
| `FileInput/FileInput.tsx` | 2 | hidden trigger | pendiente |
| `Filters/Filter.tsx` | 2 | range item | pendiente |
| `GradientBackground/GradientBackground.tsx` | 2 | gradientBackground scrim | pendiente |
| `GridList/GridList.tsx` | 2 | toolbar item | pendiente |
| `Image/Image.tsx` | 2 | state img | pendiente |
| `Kanban/KanbanBoard.tsx` | 2 | board columnBody | pendiente |
| `LoadingOverlay/LoadingOverlay.tsx` | 2 | body label | pendiente |
| `MeshGradientBg/MeshGradientBg.tsx` | 2 | meshGradientBg scrim | pendiente |
| `MonthPicker/GridPicker.tsx` | 2 | grid cell | pendiente |
| `Nav/components/Section.tsx` | 2 | actions divider | pendiente |
| `NumberInput/NumberInput.tsx` | 2 | stepper stepperButton | pendiente |
| `RichTextEditor/RichTextEditor.tsx` | 2 | content placeholder | pendiente |
| `RichTextEditor/Toolbar.tsx` | 2 | toolbar group | pendiente |
| `Search/Search.tsx` | 2 | bar slot | pendiente |
| `Segment/components/Content.tsx` | 2 | content panel | pendiente |
| `Signature/Signature.tsx` | 2 | canvas actions | pendiente |
| `Spoiler/Spoiler.tsx` | 2 | content toggle | pendiente |
| `Affix/Affix.tsx` | 1 | affix | pendiente |
| `Anchor/Anchor.tsx` | 1 | anchor | pendiente |
| `AppShell/components/Aside.tsx` | 1 | asideRegion | pendiente |
| `AppShell/components/Content.tsx` | 1 | content | pendiente |
| `AppShell/components/Footer.tsx` | 1 | footer | pendiente |
| `AppShell/components/Header.tsx` | 1 | sectionHeader | pendiente |
| `AppShell/components/Nav.tsx` | 1 | navbar | pendiente |
| `AppShell/components/Section.tsx` | 1 | section | pendiente |
| `AppShell/components/Subbar.tsx` | 1 | sectionSub | pendiente |
| `AspectRatio/AspectRatio.tsx` | 1 | aspectRatio | pendiente |
| `Avatar/Group.tsx` | 1 | group | pendiente |
| `ButtonGroup/ButtonGroup.tsx` | 1 | group | pendiente |
| `Calendar/CalendarView.tsx` | 1 | months | pendiente |
| `Charts/SparkLine.tsx` | 1 | spark | pendiente |
| `Chip/Chip.tsx` | 1 | input | hecho |
| `Code/Code.tsx` | 1 | base | pendiente |
| `DatePicker/DatePicker.tsx` | 1 | trigger | pendiente |
| `DatePicker/DatePickerInput.tsx` | 1 | textTrigger | pendiente |
| `DatePicker/DatePickerPopover.tsx` | 1 | dialog | pendiente |
| `DragDrop/DragDropContext.tsx` | 1 | overlay | pendiente |
| `DragDrop/DragHandle.tsx` | 1 | handle | pendiente |
| `DragDrop/Droppable.tsx` | 1 | droppable | pendiente |
| `EmptyModule/EmptyModule.tsx` | 1 | media | hecho |
| `Feature/Feature.tsx` | 1 | feature | hecho |
| `GlassSurface/GlassSurface.tsx` | 1 | glassSurface | pendiente |
| `GradientText/GradientText.tsx` | 1 | gradientText | pendiente |
| `Grid/components/Col.tsx` | 1 | colBase | pendiente |
| `Grid/Grid.tsx` | 1 | grid | pendiente |
| `Group/Group.tsx` | 1 | group | pendiente |
| `Header/Header.tsx` | 1 | header | hecho |
| `HoverCard/HoverCard.tsx` | 1 | card | pendiente |
| `Indicator/Indicator.tsx` | 1 | dot | pendiente |
| `Kbd/Kbd.tsx` | 1 | kbd | pendiente |
| `List/List.tsx` | 1 | list | pendiente |
| `Mark/Mark.tsx` | 1 | mark | pendiente |
| `NativeSelect/NativeSelect.tsx` | 1 | chevron | pendiente |
| `Nav/components/Logo.tsx` | 1 | logo | pendiente |
| `Paper/Paper.tsx` | 1 | paper | pendiente |
| `PermissionGate/PermissionGate.tsx` | 1 | disabled | pendiente |
| `PinInput/PinInput.tsx` | 1 | group | pendiente |
| `Player/Player.tsx` | 1 | surface | pendiente |
| `Popover/Popover.tsx` | 1 | popover | pendiente |
| `ScrollProgress/ScrollProgress.tsx` | 1 | bar | pendiente |
| `Segment/components/Section.tsx` | 1 | section | pendiente |
| `SimpleGrid/SimpleGrid.tsx` | 1 | simpleGrid | pendiente |
| `Space/Space.tsx` | 1 | space | pendiente |
| `Stat/Stat.tsx` | 1 | arrow | hecho |
| `Text/Text.tsx` | 1 | text | pendiente |
| `ThemeIcon/ThemeIcon.tsx` | 1 | icon | pendiente |
| `Title/Title.tsx` | 1 | heading | pendiente |
| `Tooltip/Tooltip.tsx` | 1 | tooltip | pendiente |
| `TypographyStylesProvider/TypographyStylesProvider.tsx` | 1 | typography | pendiente |
| `UnstyledButton/UnstyledButton.tsx` | 1 | unstyled | pendiente |
| `VisuallyHidden/VisuallyHidden.tsx` | 1 | visuallyHidden | pendiente |

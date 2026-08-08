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
| `CardComplex/CardComplex.tsx` | 11 | badgeRow mediaWrap mediaActions body header heading title description metaRow person foot | hecho |
| `Form/Form.tsx` | 10 | fieldset header headerText title headerActions banderole content footer error actions | hecho (6 de 10; root, header, banderole, content y footer son raices de sus partes) |
| `Lightbox/Lightbox.tsx` | 10 | empty stage image caption bar group counter filmstrip thumb thumbImage | hecho |
| `Dropzone/Dropzone.tsx` | 9 | zone icon title hint nativeInput list item fileName preview | hecho |
| `Footer/Footer.tsx` | 9 | brand brandLink brandDescription link group groupTitle groupList legal columns | hecho (5 de 9; brand, link, group y legal son raices de sus partes) |
| `Section/Section.tsx` | 9 | section rail head heading title description actions body foot | espera a N2 |
| `Stepper/Stepper.tsx` | 9 | list bullet body label description item step track panel | hecho |
| `TransferList/TransferList.tsx` | 9 | pane paneHead paneTitle paneCount search list item empty controls | hecho |
| `Table/Table.tsx` | 8 | table caption head foot row cell scroll scrollInner | hecho (1 de 8; table, head, foot, row, cell y scroll son raices de sus partes; scrollInner es estructural y lleva el minWidth calculado) |
| `Breadcrumbs/Breadcrumbs.tsx` | 7 | size list item expand separator current link | hecho |
| `Charts/ChartFrame.tsx` | 7 | title canvas summary details detailsSummary tableWrap table | hecho (5 de 7; canvas lleva el alto calculado y el aria-labelledby que nombra al grafico; tableWrap es el envoltorio de desplazamiento de la tabla) |
| `CommandPalette/CommandPalette.tsx` | 7 | icon body label description inputRow empty list | hecho (11; el detector no conto option, input ni el glifo de la lupa. Las cinco de la fila toman los nombres de `Menu`, que tiene la misma anatomia) |
| `Progress/Progress.tsx` | 7 | track indeterminate fill ring ringSvg ringArc ringLabel | hecho (1 de 7; track y ring son la raiz de cada tipo; indeterminate, fill, ringSvg y ringArc son el mecanismo de la animacion, con su estilo calculado) |
| `Timeline/Timeline.tsx` | 7 | item bullet line body title meta description | hecho |
| `Toast/ToastProvider.tsx` | 7 | toast icon body title message action region | hecho |
| `Accordion/Accordion.tsx` | 6 | item trigger chevron icon label panel | hecho |
| `Carousel/Carousel.tsx` | 6 | carousel emptySlot slide controls indicators indicator | hecho (7; carousel es su raiz, y el detector no conto los dos ActionIcon de las flechas) |
| `CodeHighlight/CodeHighlight.tsx` | 6 | header floatingCopy scroll pre gutter source | hecho (5; scroll es el envoltorio de desplazamiento y su alto ya sale de maxHeight; gutter y source comparten metrica de linea y separarlas descuadra los numeros. El detector no conto el rotulo de la cabecera ni el ButtonCopy) |
| `DataGrid/Toolbar.tsx` | 6 | toolbar toolbarSearch toolbarGap chips bulkBar bulkCount | hecho (6 de 6; la barra es interna, asi que suben a DataGridProps. toolbarGap se publica como toolbarActionsProps) |
| `InfiniteList/InfiniteList.tsx` | 6 | list item foot live end sentinel | hecho |
| `Modal/Modal.tsx` | 6 | surface header heading subtitle body footer | hecho |
| `Nav/components/Links.tsx` | 6 | link links indicator overflow overflowTrigger overflowPanel | hecho (3 de 6; link y links son la raiz de sus partes; indicator lo anima motion con un style calculado) |
| `AppShell/AppShell.tsx` | 5 | rail skip chrome main scrollShadow | hecho (4 de 5; rail y shell son la raiz de cada montaje) |
| `AppShell/components/Links.tsx` | 5 | links linksHeader linksContent link label | hecho (3 de 5; links es la raiz, y link y label son la raiz de sus partes. El detector no conto el rotulo de la cabecera) |
| `AppShell/components/Sidebar.tsx` | 5 | sidebar toggle sidebarContainer sidebarSlot sidebarBody | hecho (2 de 5; sidebar, sidebarSlot y sidebarBody son la raiz de sus partes y sidebarContainer es estructural. El detector no conto el ActionIcon de encoger) |
| `Charts/ChartPanel.tsx` | 5 | panelGrid panelCard panelHead panelTitle panelDescription | hecho |
| `Charts/ChartTooltip.tsx` | 5 | tooltip tooltipTitle tooltipRow swatch tooltipValue | hecho |
| `Kanban/KanbanCard.tsx` | 5 | card cardHead cardTitle cardDescription cardMeta | hecho |
| `Kanban/KanbanColumn.tsx` | 5 | column columnHeader columnTitle columnCount columnEmpty | hecho |
| `MultiSelect/MultiSelect.tsx` | 5 | control chip chipLabel chipRemove search | hecho (8; el detector no conto el disparador, el chevron ni el desplegable, que viven en la hoja de Select. Nombres y tipos de ranura igualados a los de Select) |
| `Nav/components/Sidebar.tsx` | 5 | sidebarScrim sidebar sidebarHead sidebarBody sidebarFooter | hecho (4; sidebarScrim y sidebar los anima motion y sidebar es ademas la raiz; el detector no conto el ButtonClose) |
| `QuickAction/QuickAction.tsx` | 5 | badge icon body label description | hecho |
| `DataGrid/ColumnHeader.tsx` | 4 | headCell sortButton sortIcon resizer | hecho (5; la celda es interna, asi que suben a DataGridProps. El detector no conto el disparador del menu de columna) |
| `EditorImage/EditorImage.tsx` | 4 | trigger image hint missing | pendiente |
| `Filters/Filters.tsx` | 4 | panel empty list foot | hecho |
| `ImageGallery/ImageGallery.tsx` | 4 | empty gallery tile tileImage | hecho (2 de 4; gallery es la raiz y empty es la raiz de su rama) |
| `Menu/MenuList.tsx` | 4 | item icon labels shortcut | hecho |
| `Pagination/Pagination.tsx` | 4 | control value pill dots | hecho |
| `Slider/SliderBase.tsx` | 4 | row fill marks mark | hecho (2 de 4; row es la raiz, fill y mark llevan calculada su posicion en el eje. El detector no conto el output del valor. Suben a Slider y RangeSlider) |
| `Switch/Switch.tsx` | 4 | input track thumb labelText | hecho |
| `Tag/Tag.tsx` | 4 | tag section label remove | hecho |
| `ActionIcon/ActionIcon.tsx` | 3 | actionIcon spinner iconWrap | hecho (1 de 3; actionIcon es la raiz y spinner es el mecanismo de la animacion. iconWrap se publica como iconProps, que es el nombre comun del catalogo) |
| `AnimatedGradient/AnimatedGradient.tsx` | 3 | animatedGradient drift scrim | hecho (1 de 3; animatedGradient es la raiz y drift es la capa que anima la deriva) |
| `Badge/Badge.tsx` | 3 | badge dot section | hecho |
| `Banderole/Banderole.tsx` | 3 | icon body actions | hecho |
| `BlurOverlay/BlurOverlay.tsx` | 3 | blurOverlay veil content | hecho (1 de 3; blurOverlay es la raiz y veil ES el efecto, gobernado por blur, color y opacity) |
| `Button/Button.tsx` | 3 | button spinner section | hecho (3; button es la raiz y spinner es el mecanismo de la animacion de carga. section son DOS nodos, asi que van separados con los nombres de NavLink. El detector no conto el rotulo, que no lleva clase base) |
| `Calendar/CalendarHeader.tsx` | 3 | nav header heading | hecho (4; nav son DOS nodos y se publican como previousProps y nextProps. Suben a Calendar y RangeCalendar en CalendarSlotProps) |
| `Card/Card.tsx` | 3 | badges meta actions | descartado: los tres nodos son la raiz de las partes del compound |
| `Charts/ChartLegend.tsx` | 3 | legend legendItem swatch | hecho |
| `Checkbox/Checkbox.tsx` | 3 | input box labelText | hecho |
| `Chip/ChipGroup.tsx` | 3 | groupRoot groupLabel group | hecho (2 de 3; groupRoot es la raiz. groupLabel se publica como legendProps, el nombre de Fieldset) |
| `ColorPicker/ColorInput.tsx` | 3 | preview trigger dropdown | hecho (3 de 3; preview son DOS nodos y comparten una sola ranura) |
| `ColorPicker/ColorPicker.tsx` | 3 | area swatches swatch | hecho (2 de 3; area, track y thumb son el mecanismo del selector, con el degradado y la posicion que les calcula aria) |
| `Countdown/Countdown.tsx` | 3 | unit value caption | hecho |
| `Dialog/Dialog.tsx` | 3 | dialog head title | hecho |
| `GradientBorder/GradientBorder.tsx` | 3 | gradientBorder beam arc | descartado: gradientBorder es la raiz; beam y arc son el mecanismo del haz, con su barrido y su retardo calculados por arista |
| `Image/BackgroundImage.tsx` | 3 | background overlay backgroundContent | hecho (2 de 3; background es la raiz, y se le dieron style props y reenvio, que era lo que le faltaba) |
| `List/components/Item.tsx` | 3 | item itemWithIcon itemIcon | pendiente |
| `Loader/Loader.tsx` | 3 | spinner dot bar | descartado: son el mecanismo de la animacion; size y color ya lo cubren |
| `NavLink/NavLink.tsx` | 3 | indicator section chevron | hecho |
| `Panel/Panel.tsx` | 3 | panel pane separator | hecho (3; panel es la raiz, y pane son DOS nodos que se publican como masterProps y detailProps, con los nombres de sus props) |
| `Radio/Radio.tsx` | 3 | input dot labelText | hecho |
| `Rating/Rating.tsx` | 3 | group item partial | hecho (2 de 3; partial lleva calculado su ancho, que es el relleno fraccionado. item sirve a dos elementos y va por Box) |
| `SearchableList/SearchableList.tsx` | 3 | toolbar search count | hecho |
| `Segment/components/Control.tsx` | 3 | control indicator tab | hecho |
| `Select/Select.tsx` | 3 | trigger chevron dropdown | hecho |
| `StarField/StarField.tsx` | 3 | starField aurora star | descartado: starField es la raiz; aurora y star llevan calculada su geometria y su retardo, y las capas de parallax reciben su transform desde el rAF del scroll |
| `TagsInput/TagsInput.tsx` | 3 | tag tagLabel remove | hecho (4; el detector no conto el campo de texto. removeProps toma el tipo y el nombre de Tag) |
| `Avatar/Avatar.tsx` | 2 | avatar image | hecho |
| `Blockquote/Blockquote.tsx` | 2 | blockquote iconWrap | hecho |
| `Calendar/CalendarGrid.tsx` | 2 | cellWrapper weekday | hecho (2; cellWrapper es el `td` estructural y la ranura cae en el `div` del dia, que es quien lleva el estado) |
| `Charts/TrendIndicator.tsx` | 2 | trend arrow | pendiente |
| `CodeHighlight/CodeHighlightTabs.tsx` | 2 | tabList bare | pendiente |
| `DateRangePicker/DateRangePicker.tsx` | 2 | rangeSeparator trigger | hecho (2 de 2) |
| `Divider/Divider.tsx` | 2 | line label | hecho |
| `DragDrop/Draggable.tsx` | 2 | draggable row | hecho (2; draggable es la raiz y ademas el nodo que arrastra. El detector no conto el asa) |
| `DragDrop/SortableItem.tsx` | 2 | draggable row | descartado: es el nodo que ordena dnd-kit, con su ref y el transform que le escribe, y su row interna es el activador cuando no hay asa |
| `DragDrop/SortableList.tsx` | 2 | list emptySlot | hecho (2; list es la raiz. El detector no conto el asa, que baja a todas las filas) |
| `Fieldset/Fieldset.tsx` | 2 | legend description | hecho |
| `FileInput/FileInput.tsx` | 2 | hidden trigger | pendiente |
| `Filters/Filter.tsx` | 2 | range item | pendiente |
| `GradientBackground/GradientBackground.tsx` | 2 | gradientBackground scrim | hecho (1 de 2; gradientBackground es la raiz. El grano queda fuera: es la textura del efecto y su opacidad la fija el tema) |
| `GridList/GridList.tsx` | 2 | toolbar item | pendiente |
| `Image/Image.tsx` | 2 | state img | hecho (1 de 2; state son DOS casos con una sola ranura. La imagen la anima motion al aparecer, y su ajuste, radio y tamano ya son props) |
| `Kanban/KanbanBoard.tsx` | 2 | board columnBody | descartado: board es su raiz y columnBody es la lista que ordena dnd-kit, con sus manejadores de arrastre |
| `LoadingOverlay/LoadingOverlay.tsx` | 2 | body label | hecho |
| `MeshGradientBg/MeshGradientBg.tsx` | 2 | meshGradientBg scrim | hecho (1 de 2; meshGradientBg es la raiz, y el grano queda fuera por lo mismo que en GradientBackground) |
| `MonthPicker/GridPicker.tsx` | 2 | grid cell | hecho (1 de 2; grid es la raiz de la parte. cellProps sube a MonthPicker y YearPicker) |
| `Nav/components/Section.tsx` | 2 | actions divider | descartado: son la raiz de NavActions y NavDivider, que ya llevan style props |
| `NumberInput/NumberInput.tsx` | 2 | stepper stepperButton | pendiente |
| `RichTextEditor/RichTextEditor.tsx` | 2 | content placeholder | pendiente |
| `RichTextEditor/Toolbar.tsx` | 2 | toolbar group | pendiente |
| `Search/Search.tsx` | 2 | bar slot | hecho (3; slot son DOS nodos y se publican como beforeProps y afterProps, con los nombres de sus props) |
| `Segment/components/Content.tsx` | 2 | content panel | pendiente |
| `Signature/Signature.tsx` | 2 | canvas actions | pendiente |
| `Spoiler/Spoiler.tsx` | 2 | content toggle | hecho (2 de 2; el maxHeight del recorte se escribe despues de la ranura) |
| `Affix/Affix.tsx` | 1 | affix | descartado: es la raiz, que ya lleva style props (el nodo va por Portal, pero sigue siendo su unico nodo) |
| `Anchor/Anchor.tsx` | 1 | anchor | descartado: es la raiz, que ya lleva style props |
| `AppShell/components/Aside.tsx` | 1 | asideRegion | descartado: es la raiz de AppShellAside, que ya lleva style props y reenvia el resto |
| `AppShell/components/Content.tsx` | 1 | content | descartado: es la raiz de AppShellContent, que ya lleva style props y reenvia el resto |
| `AppShell/components/Footer.tsx` | 1 | footer | descartado: es la raiz de AppShellFooter, que ya lleva style props y reenvia el resto |
| `AppShell/components/Header.tsx` | 1 | sectionHeader | descartado: es la raiz de AppShellHeader, que ya lleva style props y reenvia el resto |
| `AppShell/components/Nav.tsx` | 1 | navbar | descartado: es la raiz de AppShellNav, que ya lleva style props y reenvia el resto |
| `AppShell/components/Section.tsx` | 1 | section | descartado: es la raiz de AppShellSection, que ya lleva style props y reenvia el resto |
| `AppShell/components/Subbar.tsx` | 1 | sectionSub | descartado: es la raiz de AppShellSubbar, que ya lleva style props y reenvia el resto |
| `AspectRatio/AspectRatio.tsx` | 1 | aspectRatio | descartado: es la raiz, que ya lleva style props |
| `Avatar/Group.tsx` | 1 | group | descartado: es la raiz. Se le dieron style props y reenvio del resto, que es lo que le faltaba para poder descartarla |
| `ButtonGroup/ButtonGroup.tsx` | 1 | group | descartado: es la raiz, que ya lleva style props |
| `Calendar/CalendarView.tsx` | 1 | months | hecho (1 de 1) |
| `Charts/SparkLine.tsx` | 1 | spark | descartado: es la raiz, que ya lleva style props (el poligono y la polilinea son el trazo del dato) |
| `Chip/Chip.tsx` | 1 | input | hecho |
| `Code/Code.tsx` | 1 | base | descartado: es la raiz, que ya lleva style props |
| `DatePicker/DatePicker.tsx` | 1 | trigger | hecho (1 de 1; triggerProps sube a DatePickerBaseProps y lo comparten los tres) |
| `DatePicker/DatePickerInput.tsx` | 1 | textTrigger | hecho (1 de 1; es el mismo triggerProps del contrato comun: aqui el disparador es el campo entero) |
| `DatePicker/DatePickerPopover.tsx` | 1 | dialog | hecho (1 de 1; se publica como popoverProps y sube al contrato comun, porque el popover es interno) |
| `DragDrop/DragDropContext.tsx` | 1 | overlay | descartado: es el DragOverlay de dnd-kit, que lo mueve la libreria con su propio transform |
| `DragDrop/DragHandle.tsx` | 1 | handle | hecho (1 de 1; DragHandle es interno, asi que su ranura se publica como handleProps en Draggable y SortableList) |
| `DragDrop/Droppable.tsx` | 1 | droppable | descartado: es la raiz, que ya lleva style props y reenvia el resto |
| `EmptyModule/EmptyModule.tsx` | 1 | media | hecho |
| `Feature/Feature.tsx` | 1 | feature | hecho |
| `GlassSurface/GlassSurface.tsx` | 1 | glassSurface | descartado: es la raiz, que ya lleva style props; la capa de grano es la textura del efecto |
| `GradientText/GradientText.tsx` | 1 | gradientText | descartado: es la raiz, que ya lleva style props |
| `Grid/components/Col.tsx` | 1 | colBase | descartado: es la raiz, que ya lleva style props |
| `Grid/Grid.tsx` | 1 | grid | descartado: es la raiz, que ya lleva style props |
| `Group/Group.tsx` | 1 | group | descartado: es la raiz, que ya lleva style props |
| `Header/Header.tsx` | 1 | header | hecho |
| `HoverCard/HoverCard.tsx` | 1 | card | descartado: la tarjeta flotante ES lo que pintan las style props del componente |
| `Indicator/Indicator.tsx` | 1 | dot | hecho (1 de 1; la chapa no es la raiz, es el nodo que se posiciona sobre ella) |
| `Kbd/Kbd.tsx` | 1 | kbd | descartado: es la raiz, que ya lleva style props |
| `List/List.tsx` | 1 | list | descartado: es la raiz, que ya lleva style props |
| `Mark/Mark.tsx` | 1 | mark | descartado: es la raiz, que ya lleva style props |
| `NativeSelect/NativeSelect.tsx` | 1 | chevron | hecho (1 de 1; mismo nombre que en Select y MultiSelect) |
| `Nav/components/Logo.tsx` | 1 | logo | descartado: es la raiz de NavLogo, que ya lleva style props |
| `Paper/Paper.tsx` | 1 | paper | descartado: es la raiz, que ya lleva style props |
| `PermissionGate/PermissionGate.tsx` | 1 | disabled | descartado: al conceder no pinta ningun nodo, y el velo de la rama disable ya se ajusta con className |
| `PinInput/PinInput.tsx` | 1 | group | hecho (1 de 1; es el role=group que agrupa las casillas dentro del FormField) |
| `Player/Player.tsx` | 1 | surface | descartado: es el className del ReactPlayer, que es un peer (misma excepcion que el editorProps de EditorImage en ADR-104) |
| `Popover/Popover.tsx` | 1 | popover | descartado: la superficie flotante ES lo que pintan las style props del componente; la flecha y el velo ya tienen ranura |
| `ScrollProgress/ScrollProgress.tsx` | 1 | bar | hecho (1 de 1; su ancho sale de una variable que se escribe en la raiz, asi que la ranura no lo pisa) |
| `Segment/components/Section.tsx` | 1 | section | descartado: es la raiz, que ya lleva style props |
| `SimpleGrid/SimpleGrid.tsx` | 1 | simpleGrid | descartado: es la raiz, que ya lleva style props |
| `Space/Space.tsx` | 1 | space | descartado: es la raiz, que ya lleva style props |
| `Stat/Stat.tsx` | 1 | arrow | hecho |
| `Text/Text.tsx` | 1 | text | descartado: es la raiz, que ya lleva style props |
| `ThemeIcon/ThemeIcon.tsx` | 1 | icon | descartado: es la raiz, que ya lleva style props |
| `Title/Title.tsx` | 1 | heading | descartado: es la raiz, que ya lleva style props |
| `Tooltip/Tooltip.tsx` | 1 | tooltip | descartado: el globo ES lo que pintan las style props del componente; la flecha ya tiene ranura |
| `TypographyStylesProvider/TypographyStylesProvider.tsx` | 1 | typography | descartado: es la raiz, que ya lleva style props |
| `UnstyledButton/UnstyledButton.tsx` | 1 | unstyled | descartado: es la raiz, que ya lleva style props |
| `VisuallyHidden/VisuallyHidden.tsx` | 1 | visuallyHidden | descartado: es la raiz, que ya lleva style props |

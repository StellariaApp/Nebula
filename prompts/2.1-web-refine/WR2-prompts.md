# Prompts WR2 — Auditoría visual por familia

> 8 prompts **paralelizables**: no comparten fichero de salida y ninguno toca código. Requiere
> WR1.1 en verde (sin huecos).
>
> **El baseline de diseño ya está hecho** (WR1.2, 2026-07-31): 93 hojas de Polaris en `.figma/` a
> escala verificada 1:1, con instrumento de medida en `tools/figma-measure/`. No hay que esperar a
> que vuelva la cuota de la API para arrancar.
>
> La rúbrica está en el [README de la fase](README.md) y es **literal y vinculante**. Sin ella, ocho
> agentes producen ocho opiniones incompatibles.

---

## Por qué el reparto es por familia y no alfabético

Un revisor solo detecta que un `Chip` y un `Badge` discrepan **si los mira juntos**. Repartir A–Z
garantiza que las incoherencias entre hermanos —que son la mayoría de los hallazgos de severidad B—
no las vea nadie.

---

## Bloque común — inclúyelo al inicio de CADA prompt de familia

```
Actúa como diseñador de sistemas en C:\Users\Skr13\Documents\GitHub\Nebula.
El catálogo web está cerrado y en verde (docs\w4-closure.md). Esto es AUDITORÍA: no se toca una
sola línea de código de componente en este prompt.

LEE ANTES, en este orden:
1. prompts\2.1-web-refine\README.md §Rúbrica — literal y vinculante.
2. docs\06-visual-language.md — la especificación. Es la vara de medir.
3. docs\02-theming.md §2 — contrato NebulaTheme y roles semánticos.
4. docs\reviews\figma-baseline\README.md — el baseline de Polaris: escala verificada 1:1, cómo
   deducir tamaños de fuente sin estimar, y el mapeo de qué hojas de .figma\ son las TUYAS (§5).
5. docs\reviews\geometria-figma-vs-nebula-2026-07-28.md — hallazgos ya conocidos. NO los repitas;
   cítalos si tu familia los hereda.
6. El <Nombre>.md de los componentes de tu familia que lo tengan: muchas decisiones que parecen
   defectos están justificadas ahí.

MÉTODO, en este orden y sin saltarte el primero:

1. MIRA. Arranca el playground (pnpm --filter=playground-web dev) y recorre la familia ENTERA junta,
   en los cuatro temas, en las láminas Composition y AllThemes. El defecto que motiva esta fase es
   que el código parecía correcto: no empieces por el .css.ts.
2. MIDE. De lo que veas mal, lee el valor real: del .css.ts, del DOM renderizado o de los estilos
   computados.
3. CONTRASTA. Contra docs\06, contra el token que debería usar, y contra el hermano de la familia.
4. SOLO ENTONCES, el diseño. Abre las hojas de .figma\ que te asigna el §5 del baseline. Para dos
   cosas: confirmar una intención y detectar lo que el diseño resuelve y docs\06 no dice (C). No
   mires el diseño antes del paso 1 o acabarás auditando parecidos en vez de defectos.

   MIDE, NO ESTIMES. Las hojas están a escala 1:1 y tienes instrumento:
     cd tools\figma-measure
     node measure.mjs "Button.png"       -> anchos, altos y grosores de borde
     node type-scale.mjs "Placeholder"   -> qué tamaño de Geist da ese ancho de tinta
   docs\reviews\figma-baseline\measurements.json ya trae la primera pasada de las 93 hojas.
   Un número del diseño que no salga del instrumento NO se escribe: va a «No medido».

FIGMA NO ES LA AUTORIDAD. Es Polaris, no Nebula: donde discrepe con docs\06, gana docs\06 y lo
reportas. Donde resuelva algo que docs\06 no especifica, lo propones como C.

ENTREGABLE ÚNICO: docs\reviews\visual-audit\<familia>.md con, en este orden:
  1. Tabla resumen: componente | A | B | C (recuentos).
  2. Un bloque por hallazgo: componente, magnitud (1-5), severidad, valor medido, valor esperado,
     consecuencia para el usuario, tema(s) afectado(s), token propuesto.
  3. «Coherencia de familia»: qué discrepa ENTRE hermanos aunque cada uno esté bien por separado.
     Esta sección es la razón de que el reparto sea por familia; no la dejes vacía sin justificarlo.
  4. «Lo que el diseño resuelve y docs\06 no dice» — los C.
  5. «Pendiente de arbitraje del diseño»: casos donde docs\06 CALLA y los hermanos discrepan,
     así que no puedes decidir cuál es el correcto. No los resuelvas por tu cuenta: son la entrada
     de WR3 al cubo de ESPECIFICACIÓN.
  6. «No medido»: qué no pudiste verificar y por qué (line-height, hoja de diseño inexistente para
     tu familia, story ausente, estado inalcanzable…).

NO escribas plan de acción, NO priorices entre familias y NO toques código. Eso es WR3.
```

---

## Las ocho familias

### WR2.1 — Layout y superficie (19)

```
[BLOQUE COMÚN]

FAMILIA: Box, Flex, Center, Group, Grid, SimpleGrid, Container, Scroll, Divider, Space, AspectRatio,
Paper, AppShell, Panel, Main, Section, Affix, Overlay, LoadingOverlay.

FOCO PROPIO DE ESTA FAMILIA: la escalera de elevación de docs\06 §5 y ADR-028. Es la familia que
define el suelo sobre el que se apoyan las otras siete: si `Paper` y `Section` no comparten criterio
de superficie+borde+sombra, todo lo que contengan hereda la incoherencia.
```

### WR2.2 — Tipografía y contenido (13)

```
[BLOQUE COMÚN]

FAMILIA: Text, Title, Anchor, Highlight, Mark, Code, Blockquote, List, GradientText,
TypographyStylesProvider, CodeHighlight, Kbd, Spoiler.

FOCO PROPIO: el baseline tipográfico de docs\06 §2 recalibrado en W2.V (caption=12, body3=13, ningún
texto informativo por debajo de 12 px). Verifica que `TypographyStylesProvider` —que estiliza HTML
ajeno por selector de etiqueta— produce la MISMA escala que los componentes que la aplican por prop.
Si divergen, todo contenido de CMS se ve distinto del contenido del catálogo.
```

### WR2.3 — Acciones y navegación (15)

```
[BLOQUE COMÚN]

FAMILIA: Button, ButtonGroup, ActionIcon, ButtonClose, ButtonCopy, UnstyledButton, FileButton,
Burger, QuickAction, Tabs, NavLink, Breadcrumbs, Pagination, Stepper, Segment.

FOCO PROPIO: dos cosas que ya tienen historial.
1. El estado `disabled`: docs\reviews\geometria-figma-vs-nebula §final documenta que Nebula tiene
   DOS recetas (atenuar el elemento entero vs solo el texto) y el diseño una. Mide cuál usa cada
   componente de esta familia.
2. `NavLink` fue señalado por el propietario como el peor del catálogo y es el que más estados
   simultáneos tiene. Dale un pase propio, no un renglón.
```

### WR2.4 — Campos de formulario (27)

```
[BLOQUE COMÚN]

FAMILIA: Form, FormField, FieldError, TextInput, Textarea, PasswordInput, NumberInput, SearchInput,
NativeSelect, Checkbox, Radio, Switch, Chip, Fieldset, Rating, Slider, PinInput, JsonInput,
TagsInput, InputPhone, InputDial, InputCurrency, Signature, Dropzone, FileInput, ColorPicker,
ColorSwatch.

FOCO PROPIO: la familia más grande y la que más sufre la incoherencia entre hermanos.
1. ALTURA: todos los controles interactivos del mismo `size` deben medir lo mismo (ADR-033). Mide
   la altura real de los 27 en los cinco tamaños y haz una tabla. Es el hallazgo más probable.
2. El ritmo 2/8/4 de FormField (label/control/error) fijado en W2.V: verifica que se respeta cuando
   el control es alto (Textarea, Dropzone, Signature) y no solo cuando es una línea.
```

### WR2.5 — Colecciones y overlays (15)

```
[BLOQUE COMÚN]

FAMILIA: Combobox, Select, MultiSelect, Modal, Drawer, Popover, Tooltip, Menu, Dialog, HoverCard,
GlobalSearch, CommandPalette, TransferList, Search, Filters.

FOCO PROPIO: la relación de superficies DENTRO de un contenedor elevado (docs\06 §5.2: cabecera y pie
comparten superficie, el cuerpo contrasta, y el separador busca ~1.3–1.4 en ambos esquemas). El
review de julio dejó anotado que en Modal y Drawer esa relación se percibe INVERTIDA entre light y
dark. Verifícalo y extiéndelo al resto de overlays.

Verifica también que las cuatro listas de opciones —Combobox, Select, MultiSelect, GlobalSearch— se
ven idénticas: comparten `collections/option-list` pero GlobalSearch tiene su propio listbox.
```

### WR2.6 — Datos y feedback (32)

```
[BLOQUE COMÚN]

FAMILIA: Table, DataGrid, GridList, InfiniteList, SearchableList, Timeline, Accordion, Card,
CardComplex, Stat, Badge, Tag, StatusBadge, Indicator, Avatar, ThemeIcon, Image, Banderole, Banner,
Feature, EmptyState, EmptyModule, Alert, Toast, Loader, Skeleton, Progress, NProgress, Countdown,
ScrollProgress, CurrencyDisplay, DateDisplay.

FOCO PROPIO: la familia con más piezas pequeñas que conviven en la misma región.
1. Badge, Tag, StatusBadge, Chip e Indicator aparecen juntos en tablas y cards. Mide altura, padding,
   radius y tamaño de texto de los cinco y ponlos en una tabla: si no forman una escala, se ve.
2. Card vs CardComplex vs Paper vs Section: cuatro superficies con propósito distinto. Verifica que
   la diferencia se lee y que no hay dos que se vean igual.
3. Densidad de Table y DataGrid: son las superficies donde docs\06 §6 PROHÍBE glass y gradientes.
   Comprueba que ninguna los usa.
```

### WR2.7 — Fechas y media (13)

```
[BLOQUE COMÚN]

FAMILIA: Calendar, DatePicker, DateRangePicker, DateTimePicker, MonthPicker, TimeInput, Carousel,
ImageGallery, Lightbox, Player, RichTextEditor, EditorImage, Charts.

FOCO PROPIO: dos superficies que no salen del catálogo.
1. La retícula del Calendar es la única cuadrícula densa de texto del sistema: verifica que el día
   seleccionado, el de hoy, el del rango y el deshabilitado se distinguen entre sí en los cuatro
   temas, y no solo del fondo.
2. Charts: el color de serie sale de `SeriesColor` con una paleta de seis roles. Verifica que las
   seis se distinguen entre sí en los cuatro temas y que el orden no coloca dos parecidas seguidas.
   Es un fallo que solo se ve con un gráfico de cinco series.
```

### WR2.8 — Efectos y DnD (10)

```
[BLOQUE COMÚN]

FAMILIA: GlassSurface, BlurOverlay, NoiseOverlay, GradientBorder, GradientBackground,
AnimatedGradient, MeshGradientBg, StarField, DragDrop, Kanban.

SIN REFERENCIA DE DISEÑO: el archivo de Polaris no cubre efectos ni arrastre (baseline §5). Esta
familia se audita SOLO contra docs\06 §6 y ADR-059, y su sección de C irá vacía. Dilo en el informe
en vez de forzar comparaciones con hojas que no son de tu familia.

FOCO PROPIO: el effects budget de docs\06 §6 —«máximo un efecto dominante por región»— y la
degradación por tema de ADR-059. Verifica en los cuatro temas que:
1. `sober` neutraliza glass, blur y ruido, y que los gradientes se ven sobrios sin desaparecer.
2. `playful` no se pasa: es el tema que más fácil rompe el budget.
3. Los estados de arrastre de DragDrop/Kanban —origen atenuado, destino resaltado, overlay en vuelo—
   se distinguen sin depender solo del color.
```

---

## Comprobación de reparto

Los 144 componentes con superficie visual están asignados, sin solapes. Si añades un componente al
catálogo, añádelo también a su familia aquí, o quedará fuera de la auditoría sin que nadie lo note —
que es exactamente lo que pasó con `Breadcrumbs` durante dos tramos.

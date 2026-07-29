# Auditoría WV — Cobertura de variantes y superficie temable

> Auditoría transversal solicitada por el propietario el 2026-07-28 («¿convendría crear variantes como
> Button para Text, Title o los Input?»). **No implementa**: el entregable es este informe y, tras el
> checkpoint, los ADRs propuestos. Alimenta W3 y debe cerrarse antes de que W3 multiplique el patrón.
>
> Estado del repo medido: W2 cerrado (`docs/w2-closure.md`), último ADR existente **ADR-037**
> (`ls docs/adr/`), 68 componentes en `packages/web/src/components`.

---

## 0. El punto de partida era optimista

Las tres cifras del prompt se reprodujeron. Dos son correctas; la tercera oculta el hallazgo central de
la auditoría.

| Medición del prompt                        | Resultado                                                                   |
| ------------------------------------------ | --------------------------------------------------------------------------- |
| 6 de 68 aceptan `variant`                  | **Correcto** — Button, ActionIcon, Alert, Badge, Divider, Loader            |
| 21 de 68 aceptan `color`                   | **Correcto** — pero sobre **5 tipos distintos** (§0.2)                      |
| `Variant` tiene 8 miembros, contrato W/N   | **Correcto** — `packages/tokens/src/types/variants.ts:16-17`                |

### 0.1 Solo 2 de esos 6 consumen `variantMap`

`grep -rln ResolveVariant` sobre `packages/web/src/components` devuelve exactamente dos archivos:
`Button/Button.tsx` y `ActionIcon/ActionIcon.tsx`. Los otros cuatro declaran un prop **llamado**
`variant` que es una unión local, y ninguno lee `theme.variantMap`. Peor: las cuatro uniones locales
viven en **tres ejes semánticos distintos**.

| Componente | Unión declarada                              | Archivo                     | Eje                          | ¿lee `variantMap`? |
| ---------- | -------------------------------------------- | --------------------------- | ---------------------------- | ------------------ |
| Button     | `Variant` (8)                                | `Button.types.ts:26`        | receta cromática             | **sí**             |
| ActionIcon | `Variant` (8)                                | `ActionIcon.types.ts:26`    | receta cromática             | **sí**             |
| Alert      | `"light" \| "filled" \| "outline"`           | `Alert.types.ts:7`          | receta cromática (a mano)    | no                 |
| Badge      | `"light" \| "filled" \| "outline" \| "dot"`  | `Badge.types.ts:7`          | receta cromática + **forma** | no                 |
| Divider    | `"solid" \| "dashed" \| "dotted"`            | `Divider.types.ts:8`        | **`borderStyle`**            | no                 |
| Loader     | `"spinner" \| "dots" \| "bars"`              | `Loader.types.ts:4`         | **forma de la animación**    | no                 |

La consecuencia es verificable y contradice `docs/02-theming.md` §2 punto 3 («hasta el significado
visual de `variant="filled"` es temable»): **`playful` remapea `filled` a `gradient.brand`**
(`packages/themes/src/__tests__/official-themes.test.ts:49`) y ese remapeo llega a Button y ActionIcon,
pero **no** a Alert ni a Badge, que seguirán pintando `scale.600` plano.

### 0.2 La duplicación ya produjo deriva medible

Alert y Badge reimplementan a mano las mismas tres recetas. No coinciden entre sí ni con el contrato:

| Receta `light`  | `variantMap` (nebula-dark:116) | Alert (`Alert.tsx:41-46`) | Badge (`Badge.tsx:30-34`) |
| --------------- | ------------------------------ | ------------------------- | ------------------------- |
| background      | `scale.500.12`                 | `scale.500` @ **12 %**    | `scale.500` @ **14 %**    |
| foreground      | `scale.800`                    | `text.primary`            | `scale.700`               |
| border          | `none`                         | `scale.500` @ 28 %        | `transparent`             |

| Receta `outline` | `variantMap`                | Alert                     | Badge                     |
| ---------------- | --------------------------- | ------------------------- | ------------------------- |
| foreground       | `scale.700`                 | `text.primary`            | `scale.700`               |
| border           | `scale.600`                 | `scale.500`               | `scale.500`               |

Tres definiciones divergentes de un mismo nombre, sin que ningún gate lo detecte. Trece componentes
usan `ScaleShade` (`utils/scale.ts`) —Alert, Avatar, Badge, Checkbox, FieldError, Loader, NavLink,
Pagination, Progress, Radio, Segment/Control, Switch, Toast—: su **escala de color** sí es temable,
su **receta** no.

### 0.3 `color` tampoco es un contrato, son cinco

ADR-021 fija que «cualquier prop de color de componente usa `ColorExtended` (convención)». De los 21
componentes con `color`, **2** la cumplen:

| Tipo de `color`             | Nº | Componentes                                                                                                                          |
| --------------------------- | -: | ------------------------------------------------------------------------------------------------------------------------------------ |
| `ColorExtended` (ADR-021)   |  2 | Button, ActionIcon                                                                                                                   |
| `SemanticScaleName`         | 16 | Alert, Avatar, Badge, Blockquote, Checkbox, Highlight, Loader, Mark, NavLink, Pagination, Progress, Radio, Segment, Switch, Tabs, Toast |
| `BorderRole`                |  1 | Divider                                                                                                                              |
| `"error" \| "info"`         |  1 | FieldError                                                                                                                           |
| `"neutral" \| "inverted"`   |  1 | Tooltip                                                                                                                              |

Se registra como **conflicto con ADR-021**, no se corrige aquí (regla de sesión: una conclusión que
choca con un ADR aceptado se registra, no se aplica). Divider, FieldError y Tooltip son excepciones
defendibles —no eligen una escala de acento, eligen un rol—; los 16 de `SemanticScaleName` son deuda
lisa y llana. Su coste de corrección es el mismo que el de §3.1 y conviene resolverlo en el mismo
tramo.

---

## 1. Matriz por componente

**Clase** — `superficie` (fondo + primer plano + borde propios) · `campo` (control de formulario) ·
`tipografía` (sin superficie) · `estructural` (layout, utilidad o sin elemento propio) · `feedback`.

**Tratamiento** — `añadir ahora` · `subconjunto` · `no aplica` · `ya cubierto` · `pertenece a W3/W4` ·
`requiere ampliar contrato` · `unificar` (ya tiene variantes, pero fuera del contrato).

**Coste** — delta de bundle medido (§3.2) contra el budget vigente; `✗` = se sale de budget.

### 1.1 Superficie (20)

| Componente     | `variant` hoy      | Variantes con sentido                       | Tratamiento              | Coste (medido/budget)  | Prioridad |
| -------------- | ------------------ | ------------------------------------------- | ------------------------ | ---------------------- | --------- |
| Button         | `Variant` (8)      | las 8                                       | ya cubierto              | 29,92 / 34             | —         |
| ActionIcon     | `Variant` (8)      | las 8                                       | ya cubierto              | 29,64 / 34             | —         |
| ButtonClose    | hereda ActionIcon  | las 8                                       | ya cubierto              | 29,79 / 34             | —         |
| ButtonCopy     | hereda ActionIcon  | las 8                                       | ya cubierto              | 29,82 / 34             | —         |
| Alert          | local (3)          | `filled·outline·light·glass`                | **unificar** subconjunto | 30,44 + 2,2 = 32,6 / 35 | **P1**   |
| Badge          | local (3+`dot`)    | `filled·outline·light·ghost` + `dot` aparte | **unificar** subconjunto | 11,57 + 2,2 = 13,8 / 12 **✗** | **P1** |
| Card           | —                  | `filled·outline·light·glass·glow·gradient`  | subconjunto              | 19,44 + 2,2 = 21,6 / 22 (0,4 margen) | P2 |
| Paper          | —                  | `filled·outline·light·glass`                | subconjunto              | 10,90 + 2,2 = 13,1 / 12 **✗** | P2 |
| Avatar         | —                  | `filled·light·outline`                      | subconjunto              | 11,65 + 2,2 = 13,9 / 12 **✗** | P3 |
| Segment        | —                  | `filled·light·ghost` (indicador)            | subconjunto              | 28,14 + 2,2 = 30,3 / 32 | P2       |
| Tabs           | —                  | ídem Segment (es su atajo)                  | subconjunto              | 28,24 + 2,2 = 30,4 / 32 | P2       |
| NavLink        | —                  | `filled·light·ghost`                        | subconjunto              | 18,75 + 2,2 = 21,0 / 21 (0,05 margen) | P3 |
| Pagination     | —                  | `filled·light·outline·ghost`                | subconjunto              | 18,99 + 2,2 = 21,2 / 22 | P3       |
| Toast          | —                  | `filled·light·glass`                        | subconjunto              | 35,87 + 2,2 = 38,1 / 41 | P3       |
| Tooltip        | `color` (2)        | ninguna: es superficie de sistema           | no aplica                | 31,57 / 36             | —         |
| Modal          | —                  | ninguna: nivel 4 de `docs/06` §5            | no aplica                | 35,21 / 40             | —         |
| Drawer         | —                  | ídem Modal                                  | no aplica                | 35,27 / 40             | —         |
| Popover        | —                  | ninguna: nivel 3 de `docs/06` §5            | no aplica                | 35,11 / 40             | —         |
| Menu           | —                  | ídem Popover                                | no aplica                | 50,67 / 58             | —         |
| Image          | —                  | ninguna: la superficie es el contenido      | no aplica                | 17,73 / 20             | —         |

Los cinco overlays quedan fuera por `docs/06` §5: su superficie **es** su nivel de elevación
(`surface.overlay` + sombra + rim). Un `Popover variant="filled" color="error"` rompería la escalera y
la física por superficie de ADR-034. Tooltip ya resuelve el caso legítimo con `color: neutral|inverted`.

### 1.2 Campo de formulario (13)

| Componente    | `variant` hoy | Variantes con sentido | Tratamiento         | Coste                       |
| ------------- | ------------- | --------------------- | ------------------- | --------------------------- |
| FormField     | —             | ninguna               | no aplica           | 21,43 / 24                  |
| TextInput     | —             | ver §2.B              | **ya cubierto**     | 22,38 / 25                  |
| Textarea      | —             | ver §2.B              | ya cubierto         | 22,46 / 26                  |
| PasswordInput | —             | ver §2.B              | ya cubierto         | 31,39 / 36                  |
| SearchInput   | —             | ver §2.B              | ya cubierto         | 31,38 / 36                  |
| NumberInput   | —             | ver §2.B              | ya cubierto         | 31,57 / 36                  |
| Select        | —             | ver §2.B              | ya cubierto         | 58,70 / 67                  |
| MultiSelect   | —             | ver §2.B              | ya cubierto         | 65,57 / 75                  |
| Combobox      | —             | ver §2.B              | ya cubierto         | 65,09 / 74                  |
| Checkbox      | —             | ninguna cromática     | no aplica (`color`) | 12,03 / 16                  |
| Radio         | —             | ninguna cromática     | no aplica (`color`) | 11,60 / 12                  |
| Switch        | —             | ninguna cromática     | no aplica (`color`) | 25,79 / 30                  |
| FieldError    | —             | ninguna               | no aplica           | 20,04 / 23                  |

Los nueve campos comparten **una sola** definición de superficie: el recipe `field` de
`packages/web/src/styles/field.css.ts:55`, con `surface.raised` + `border.default` y solo dos ejes
(`size`, `multiline`). Es zero-runtime y ya es temable por roles. El detalle en §2.B.

### 1.3 Tipografía (8)

| Componente | `variant` hoy | Tratamiento                                    | Coste       |
| ---------- | ------------- | ---------------------------------------------- | ----------- |
| Text       | —             | **ya cubierto por style props** (§2.C)         | 9,13 / 9,5  |
| Title      | —             | ya cubierto por style props                    | 9,14 / 9,5  |
| Anchor     | —             | ya cubierto (`underline`, `external`)          | 9,51 / 12   |
| Highlight  | —             | ya cubierto (`color`)                          | 10,04 / 12  |
| Mark       | —             | ya cubierto (`color`)                          | 9,43 / 12   |
| Code       | —             | ya cubierto (`block`)                          | 9,13 / 9,5  |
| Blockquote | —             | ya cubierto (`color`, `icon`, `cite`)          | 11,22 / 12  |
| List       | —             | ya cubierto (`type`, `icon`, `spacing`)        | 11,09 / 12  |

Text y Title tienen **9,13 y 9,14 kB contra un budget de 9,5**: 370 B de margen. Aunque la respuesta a
la pregunta C fuera afirmativa, `ResolveVariant` (+2,2 kB) no cabe. Ver §2.C.

### 1.4 Feedback (3)

| Componente | `variant` hoy         | Tratamiento                                                    | Coste                            |
| ---------- | --------------------- | -------------------------------------------------------------- | -------------------------------- |
| Loader     | `spinner\|dots\|bars` | **renombrar el eje** — es forma, no receta (§3.5)               | 11,41 / 12                       |
| Progress   | —                     | subconjunto `filled·light` (la barra ya es una superficie)      | 12,21 + 2,2 = 14,4 / 14 **✗**   |
| Skeleton   | —                     | no aplica                                                       | 11,61 / 12                       |

### 1.5 Estructural (24) — todos `no aplica`

Box · Flex · Center · Group · Grid · GridCol · SimpleGrid · Container · Scroll · Space · AspectRatio ·
ButtonGroup · Collapse · Transition · Portal · FocusTrap · VisuallyHidden · Conditional · Valid · Omit ·
FileButton · UnstyledButton · Accordion · EmptyState.

Dos matices:

- **Divider** (`11,61 / 12`) declara `variant: solid|dashed|dotted`, que es `borderStyle`. No es una
  receta cromática y no debe absorberse en `Variant`; ver §3.5.
- **Accordion** (`17,06 / 19`) es el único estructural con caso de superficie real: tfv usa
  `variant="contained"` y `"filled"` de Mantine (5 usos). Se trata en §2.A como candidato de segundo
  orden, porque su superficie es la de sus items, no la suya.

### 1.6 Pendientes de W3/W4 que esta decisión afecta

De `docs/00-inventory.md` §1 y `docs/05` §W3–W4.

| Componente                    | Fase | Clase        | Variantes con sentido                | Tratamiento                       |
| ----------------------------- | ---- | ------------ | ------------------------------------ | --------------------------------- |
| Chip (+Group)                 | W3   | superficie   | `filled·outline·light·ghost`         | subconjunto — **nace con ellas**  |
| Banner                        | W3   | superficie   | `filled·light·glass·gradient`        | subconjunto — nace con ellas      |
| StatusBadge                   | W3   | superficie   | hereda Badge                         | subconjunto                       |
| Stepper                       | W3   | superficie   | `filled·light` (el indicador)        | subconjunto                       |
| Feature · Section · Panel     | W3   | estructural  | ninguna                              | no aplica                         |
| CardComplex                   | W3   | superficie   | hereda Card                          | subconjunto (⚠️ checkpoint W3.5)  |
| Fieldset                      | W3   | campo        | ninguna                              | no aplica                         |
| DataGrid · AppShell           | W3   | estructural  | ninguna                              | no aplica                         |
| Rating · PinInput · TagsInput | W3   | campo        | ninguna                              | no aplica                         |
| **GradientText**              | W4   | tipografía   | —                                    | **es la respuesta a la C**        |
| GradientBorder/Background     | W4   | superficie   | —                                    | pertenece a W4                    |
| Glass/Effects                 | W4   | superficie   | —                                    | pertenece a W4                    |

**Este es el argumento de urgencia**: Chip, Banner, StatusBadge, Stepper y CardComplex son cinco
componentes de W3 que van a necesitar recetas cromáticas. Si el patrón no se decide antes, W3 los
escribirá a mano y la deriva de §0.2 pasará de 2 componentes a 7.

---

## 2. Las tres respuestas

### A — Componentes que pintan superficie: **sí, con subconjunto declarado; no con las 8**

**Recomendación.** Un componente de superficie declara `variant` sobre un **subconjunto explícito** de
`Variant`, y lo resuelve con `ResolveVariant` contra `theme.variantMap`. El subconjunto es parte de su
tipo (`Extract<Variant, "filled" | "outline" | "light">`), no una unión nueva.

Las 8 no tienen sentido sobre nada que no sea una acción:

- **`glow`** identifica «una acción primaria, selección o feedback excepcional; no se aplica a listas
  completas» (`docs/06` §6). Una `Card` con glow es legítima como excepción; una colección de cards con
  glow viola además §5 («una colección de cards usa el mismo nivel»). El riesgo no es el prop, es que
  el prop no distingue el uso único del uso en lista. **Se admite en Card y se excluye de todo lo que
  aparezca en colección** (Badge, Chip, NavLink, Pagination, Segment).
- **`gradient`** es «acento de marca en CTA, badge, header o hero» y «no es fondo dominante en tablas,
  formularios ni lectura larga» (`docs/06` §6). Admisible en Card, Banner y Badge; excluido de Alert
  —que sostiene texto de párrafo— y de todo overlay.
- **`glass`** «nunca se anida» (`docs/06` §6). Un Toast o una Card con glass son válidos aislados; dos
  anidados no. Admisible solo donde el componente es raíz de su región: Card, Paper, Toast, Banner.
- **`unstyled`** solo tiene sentido donde el consumidor va a reconstruir la superficie entera; hoy es
  Button/ActionIcon y `UnstyledButton` cubre el caso estructuralmente.

Subconjuntos propuestos, derivados de las reglas anteriores:

| Componente        | Subconjunto                                            |
| ----------------- | ------------------------------------------------------ |
| Card · Paper      | `filled · outline · light · glass · glow · gradient`   |
| Alert · Banner    | `filled · outline · light · glass`                     |
| Badge · Chip      | `filled · outline · light · ghost · gradient`          |
| Toast             | `filled · light · glass`                               |
| Segment · Tabs    | `filled · light · ghost`                               |
| NavLink           | `filled · light · ghost`                               |
| Pagination        | `filled · outline · light · ghost`                     |
| Avatar            | `filled · outline · light`                             |
| Progress          | `filled · light`                                       |

**Alternativa**: dejarlo como está y que cada componente siga escribiendo su receta a mano. Es más
barata en bundle (0 kB) y no toca ningún budget, pero es exactamente lo que produjo la deriva de §0.2 y
la promesa incumplida de `docs/02` §2.3. Si se elige, hay que **retirar esa promesa del doc**, porque
hoy es falsa para 4 de los 6 componentes con `variant`.

**Ninguna de estas variantes exige ampliar la unión `Variant`.** La recomendación A es de coste de
contrato **cero** (§3.1).

### B — Campos de formulario: **la recomendación era «no procede»; el propietario adopta el eje local, diferido a W3**

> **Decisión del checkpoint (2026-07-28)**: no se usa la unión `Variant`. Se añade un eje `surface`
> como variante del recipe `field` —zero-runtime, sin tocar contrato ni budgets— y **su ejecución se
> difiere a W3**, cuando existan los 24 campos definitivos en vez de los 9 actuales. Registrado en
> **ADR-042**.

La necesidad es supuesta. La evidencia del código de producto que Nebula debe sustituir es concluyente:

- **fonicredito**: `InputText`, `InputSelect`, `InputSearch`, `InputCheckbox` e `InputPhone` **no
  declaran ningún prop `variant`** (`src/services/shared/components/*/types.ts`). Cero.
- **tfv**: un solo `variant="filled"` sobre un input en todo el repo, y está en
  `packages/components/SearchInput/index.tsx:20` — es decir, **dentro de la propia capa de design
  system**, junto a `radius={50}` y `classNames` propios. Ningún call site de aplicación elige jamás
  el tratamiento de superficie de un campo.
- **tfv lo resuelve donde corresponde**: `packages/themes/index.ts:184-260` fija
  `--input-bg: background-2` y `--input-bd: background-4` en los `defaultProps` de `InputBase`, `Input`
  y `TextInput`. Un tratamiento único para todo el producto, decidido **en el tema**.

Nebula ya hace lo mismo y mejor: `packages/web/src/styles/field.css.ts:55` define un único recipe
`field` con `surface.raised` + `border.default`, consumido por los nueve campos. Cambiar el
tratamiento de campo de un tenant es cambiar `colors.surface.raised` y `colors.border.default` en su
tema — sin prop, sin runtime, sin contrato nuevo.

Además, las tres variantes vistosas están vetadas sobre un campo por `docs/06` §6: `gradient` «nunca
sostiene texto largo», `glass` «no se anida» (y un campo vive dentro de una Card que ya puede ser
glass), y `glow` está reservado a acción primaria o selección. Y ADR-035 regla 4 ya fijó que el
tratamiento cromático excepcional de un campo —`error`— **es un estado, no una variante**.

**La forma adoptada**: un eje `surface: "outline" | "filled" | "underline" | "unstyled"` como
**variante del recipe `field`**, en `styles/field.css.ts`, con `outline` como default (el
comportamiento actual, de modo que el cambio es aditivo). Es zero-runtime —VE lo resuelve en build—, no
toca `Variant`, no toca los temas y **no arrastra `ResolveVariant`**: coste de bundle ≈ 0 y coste de
contrato 0. Se difiere a W3 porque hoy hay 9 campos y W3 entrega 15 más; decidir el reparto sobre 9 y
redecidirlo sobre 24 es hacer el trabajo dos veces, y `Signature` o `Dropzone` pueden no admitir
`underline` de forma sensata.

**Lo que no se debe hacer bajo ningún supuesto**: reutilizar la unión `Variant` en un campo. `filled`
en un botón significa «acento sólido del color de acción» y en un campo significaría «superficie de
relleno neutra». El mismo nombre para dos cosas distintas es el error que esta auditoría existe para
evitar.

### C — Tipografía: **no procede; y `GradientText` se adelanta de W4 a W3**

> **Decisión del checkpoint (2026-07-28)**: ni `Text` ni `Title` reciben `variant`. El caso de uso
> legítimo —texto con gradiente— se entrega como componente dedicado y **`GradientText` pasa de W4 a
> W3**; los otros cinco componentes de gradiente se quedan en W4. Registrado en **ADR-043**.

`Text` y `Title` extienden `BoxOwnProps`, así que desde ADR-032 **ya aceptan todas las style props**
tipográficas: `c`, `fz`, `fw`, `ff`, `lh`, `ls`, `tt`, `td`, `ta`, `bg`, además de `truncate`, `lines`,
`inherit` y `order`. Se verificó contra el catálogo de sprinkles
(`packages/web/src/components/Box/Box.css.ts:119-165`).

Esa API cubre **el 100 %** de lo que expone el `Text` de fonicredito, que es el componente tipográfico
más usado de los repos de referencia: `ff · fw · c · fz · flex · ta · self · lh · decoration · bg · r`
(`fonicredito-app/src/services/shared/components/Text/types.ts`) — `decoration` incluido, que es `td`.
tfv usa `Paragraph`, un alias de `TextProps` de Mantine; su `variant` (`"text" | "gradient"`) tiene
**cero usos** en todo el repo.

El caso interesante está en la semilla. `Stellaria-Frontend` **sí** tiene `variant` en `Text`, y hereda
la unión completa de 8 miembros vía `BaseProps` (`src/ui/tokens/src/types/variants.ts:6`, idéntica a la
de Nebula). Su implementación (`.../Typography/Text/Text.tsx:29-45`) atiende **tres**: `gradient` y
`glass` delegan en subcomponentes Skia, y `outline` **renderiza el texto varias veces con offsets para
fingir un trazo**. Los otros cinco caen al render plano sin efecto.

Dos conclusiones, y las dos apuntan a lo mismo:

1. **`outline` significa cosas opuestas en Button y en Text de la semilla** — borde de superficie
   frente a contorno de glifo. Portar la unión a Text importaría esa colisión al contrato compartido.
2. **La demanda no existe.** Los 29 usos de `<Text variant>` de Stellaria están en dos archivos, ambos
   bajo `src/playgrounds/mobile/src/playground/demos/` (26 en `TypographyDemos.tsx`, 3 en
   `InputsDemos.tsx`): es la matriz de demostración del propio design system. **Cero usos en código de
   producto** en los tres repos de referencia.

El hueco real —texto con gradiente— ya está asignado: `docs/00-inventory.md:255` lo sitúa en **Tier 3**
como `GradientText / GradientBorder / GradientBackground / AnimatedGradient`, con la nota «⚠️ requiere
crear tokens `gradient.*`», y `docs/05` §W4 entrega «Glass/Effects (con tokens `gradients`)». Proponer
`variant="gradient"` en `Text` sería duplicar un componente de W4 con peor a11y: `docs/06` §6 prohíbe
que un gradiente pinte texto principal, de modo que el componente dedicado puede imponer el uso
acotado que un prop libre en `Text` no puede.

**Recomendación: no aplica.** Y como corolario, `Title` tampoco: su eje es `order`, que es jerarquía
semántica (ADR-024 punto 3), y `docs/06` §2 ya prohíbe elegir la semántica por apariencia.

**Lo que sí se mueve**: `GradientText` se adelanta a W3. Los tokens que lo bloqueaban ya existen
—`effects.gradients: { brand; accent; surface }` está en el contrato y los cuatro temas lo pueblan—, y
es el único de los seis componentes de gradiente del inventario con demanda registrada. El componente
puede además imponer lo que un prop libre no podría: fallback sólido legible cuando `background-clip:
text` no aplica, y reduced-motion en la variante animada. `GradientBorder`, `GradientBackground`,
`AnimatedGradient`, `MeshGradient` y `GrainyGradient` se quedan en W4.

---

## 3. El coste, cuantificado

### 3.1 Coste de contrato — la decisión más cara, y la recomendación no la paga

Ampliar la unión `Variant` obliga, por cada miembro nuevo, a tocar **8 sitios de código más N temas de
tenant**, censados por lectura directa:

| Sitio                                                          | Qué obliga                                   |
| -------------------------------------------------------------- | -------------------------------------------- |
| `packages/tokens/src/types/variants.ts:16-17`                  | la unión                                     |
| `packages/themes/src/enums.ts` (`variants`)                    | el array runtime, exhaustivo por tipo        |
| `packages/themes/src/load-theme.ts:36-45`                      | literal exhaustivo escrito a mano            |
| `packages/themes/src/themes/nebula-dark.ts:113`                | 1 receta                                     |
| `packages/themes/src/themes/nebula-light.ts:92`                | 1 receta                                     |
| `packages/themes/src/themes/sober-light.ts:91`                 | 1 receta                                     |
| `packages/themes/src/themes/playful.ts:92`                     | 1 receta                                     |
| `packages/web/src/theme/resolve-variant.ts` (`ResolveFlat`)    | 1 rama del switch de modo plano              |
| **Cada tema de tenant**                                        | 1 receta — hoy 0, planificados 2 (§3.1.1)    |

Y hay un coste que no es de código: `schema.ts:173` valida `variantMap` con
`z.record(z.enum(variants), variantRecipe)`, de modo que **todo JSON de tema existente deja de validar**
en cuanto la unión crece. Para un contrato pensado para que «un tenant cargue el suyo sin recompilar»
(`docs/02` §1), ampliar `Variant` es un **cambio incompatible del formato de datos**, no una adición.

Hoy el sistema mantiene **32 recetas** (4 temas × 8). Un miembro nuevo son 36. Con los dos temas de
tenant que TC entrega (`fonicredito`, `tfv-gold`, `docs/02` §3), son 48 → 54.

**La recomendación A no amplía la unión.** Su coste de contrato es **cero**: los nueve subconjuntos de
§2.A se expresan con `Extract<Variant, …>` sobre miembros que ya existen y ya tienen receta en los
cuatro temas.

#### 3.1.1 Lo que la evidencia diría si alguien propusiera ampliarla

Los dos candidatos que aparecen en los repos reales y no están en la unión **no la necesitan**:

- **`subtle`** (Badge de fonicredito, **21 usos**, el segundo valor más usado del repo). Su receta
  (`Badge/styles.ts:50-54, 95-97`) es `background: gray.600 @ 10 %` + `foreground: gray.700`. Eso es
  exactamente `variant="light" color="gray"` en Nebula. **No es un miembro que falte; es un default.**
- **`flat`** (Badge de tfv). Su receta (`Badge/index.tsx:76-82`) es `background: transparent`,
  `border: none`, `padding: 0`. Es `ghost` con padding retirado — y el padding es un caso de style
  prop (`p={0}`), no de variante.

El único que no mapea limpio es **`link`** (Button de fonicredito, **11 usos**): transparente, sin
`minHeight`, padding reducido y `fontWeight: 400` (`Button/styles.ts:58-64, 101-103, 134-137`). Su
diferencia con `ghost` **no es cromática sino geométrica**: colapsa la caja del control. Un miembro de
`Variant` no puede expresar eso, porque `VariantRecipe` solo tiene `background`, `foreground`, `border`,
`glass` y `glow`. La respuesta correcta es `Anchor` (que Nebula ya tiene, 9,51 / 12) o, si se quiere el
comportamiento de botón con aspecto de enlace, la prop `href` de ADR-035. **No se propone ampliar la
unión por este caso.**

### 3.2 Coste de bundle — medido, y el prompt lo sobreestimaba

El prompt estima `ResolveVariant` en ~6 kB. La medición real, con esbuild + brotli q11 sobre el `dist`
compilado, comparando el mismo módulo con y sin el import:

```
a-badge              11.03 kB brotli
b-badge-plus-rv      13.25 kB brotli
c-rv-only             3.61 kB brotli
d-avatar             11.10 kB brotli
e-avatar-plus-rv     13.17 kB brotli
f-paper              10.46 kB brotli
g-paper-plus-rv      12.65 kB brotli

ResolveVariant standalone (con tokens+contract): 3.61 kB
delta sobre Badge : 2.21 kB
delta sobre Avatar: 2.07 kB
delta sobre Paper : 2.19 kB
```

**El coste marginal real es +2,07–2,21 kB brotli**, consistente en tres componentes distintos. Es menor
porque cualquier componente temable ya importa `theme/contract.css.js` y el contexto de tema; lo único
que se añade es la lógica de resolución y las `palettes` de tokens.

Con ese delta, y contra la medición completa de `pnpm --filter @stellaria/nebula-web size` (78 entradas,
**todas en verde** hoy), **seis componentes se saldrían de su budget**:

| Componente | Medido |  Budget | Con `ResolveVariant` | Exceso    |
| ---------- | -----: | ------: | -------------------: | --------- |
| Badge      |  11,57 |      12 |            **13,77** | +1,77     |
| Avatar     |  11,65 |      12 |            **13,85** | +1,85     |
| Divider    |  11,61 |      12 |            **13,81** | +1,81     |
| Loader     |  11,41 |      12 |            **13,61** | +1,61     |
| Paper      |  10,90 |      12 |            **13,10** | +1,10     |
| Progress   |  12,21 |      14 |            **14,41** | +0,41     |

Y dos pasan sin margen útil: **Card** 21,64 / 22 (0,36 kB) y **NavLink** 20,95 / 21 (0,05 kB).

Los cinco primeros pertenecen todos al escalón **«primitivo temable en runtime ≤12 kB» de ADR-022**.
Esto es exactamente la situación que ADR-032 §7 tipifica: no es el exceso de *un* componente —que se
corrige adelgazándolo, nunca subiendo el budget— sino **el suelo compartido de un escalón entero**
subiendo por una decisión de arquitectura, igual que el paso de 9 a 9,5 kB de T2 y que la
recalibración de Pagination en T3. Si el propietario aprueba A, hay que recalibrar el escalón a
**~14 kB** y decirlo en el ADR, con la medición pegada.

La alternativa técnica que evita la recalibración: publicar una variante **zero-runtime** para los
componentes del escalón de 12 kB —recetas resueltas por `recipe()` de VE en build, leyendo los mismos
`vars` que `ResolveVariant`—. Cuesta 0 kB, pero **pierde `variantMap`**: un tema no podría remapear
`filled` a `gradient.brand` como hace `playful`. Es decir, resuelve el bundle reintroduciendo
exactamente el problema de §0.1. **No se recomienda**, pero es la disyuntiva honesta y el propietario
debe verla: *o* Badge pesa 13,8 kB *o* Badge no es realmente temable.

### 3.3 Coste de paridad W/N

`Variant` vive en `@stellaria/nebula-tokens`, que alimenta las dos plataformas, y el lint de paridad
W/N es un entregable de N1 (`docs/05` §N1). Cada componente al que se le añada `variant` en W3 es
trabajo obligatorio en N1/N2 con la misma unión y el mismo subconjunto.

La factura de la recomendación A, si se aprueba entera, son **13 componentes** (Alert, Badge, Card,
Paper, Avatar, Segment, Tabs, NavLink, Pagination, Toast, Progress + Chip y Banner de W3) que N1/N2
deberán implementar con paridad exacta. La buena noticia es que **el coste de paridad de ampliar la
unión sería el caro y la recomendación no lo paga**: los 8 miembros ya están en el contrato y la
semilla Stellaria ya los implementa en native (`src/ui/tokens/src/types/variants.ts:6` es idéntica),
así que N1 hereda el trabajo hecho.

### 3.4 Coste de a11y — hay un agujero, y es anterior a esta decisión

`pnpm check:contrast` corre verde: **28 pares × 5 temas** (smoke-light, nebula-light, nebula-dark,
sober-light, playful) = 140 comprobaciones, 0 FAIL.

```
28 pares · 28 PASS · 0 FAIL
✔ Gate de contraste en verde para 5 temas.
```

Pero la lectura de `tools/contrast-check/src/pairs.ts` muestra que **`BuildPairs()` no lee
`theme.variantMap` en ningún punto**. Los 28 pares son una lista escrita a mano. El par etiquetado
`text.onPrimary / primary.600 (filled)` (líneas 36-39) no deriva de la receta: fija
`bg: (t) => t.colors.primary["600"]` como literal. **En `playful`, cuya receta `filled` es
`gradient.brand`, el gate sigue comprobando `primary.600`, que no es lo que el componente pinta.**

Consecuencias, en orden de importancia:

1. De las **56 combinaciones** hoy alcanzables (8 variantes × 7 escalas) el gate cubre **1 y su hover**,
   y por coincidencia. `outline` (`fg: scale.700`), `light` (`fg: scale.800` sobre `scale.500.12`) y
   `ghost` (`fg: scale.700`) **no están cubiertas en ninguna escala**.
2. Por tanto **el coste marginal de a11y de la recomendación A es literalmente cero**, porque el gate no
   cubre variantes. Eso no es un ahorro: es la medida del agujero. Extender `variant` a 11 componentes
   más multiplica una superficie **no cubierta**.
3. `BuildPairs` **no sirve como está** y hay que ampliarlo. La forma correcta es derivarlo:
   para cada `[variant, recipe]` de `theme.variantMap` y cada escala de `SemanticScaleName`, resolver
   `recipe.foreground` sobre `recipe.background` (con la misma aritmética de alpha que
   `resolve-variant.ts`) y exigir 4.5:1. Eso son 56 pares por tema, 280 en total, y **es previsible que
   varios fallen hoy** — motivo suficiente para que sea su propio tramo y no un apéndice.

Este hallazgo es **independiente de las tres preguntas** y debería corregirse aunque el propietario
rechace A, B y C.

### 3.5 Dos ejes mal nombrados (coste cero, valor alto)

`Divider.variant` (`solid|dashed|dotted`) y `Loader.variant` (`spinner|dots|bars`) no son recetas
cromáticas: son `borderStyle` y forma de animación. Ocupan el nombre `variant` en el catálogo y hacen
que la afirmación «6 de 68 tienen variantes» sea engañosa para cualquiera que lea el índice de API.

Renombrarlos —`Divider.lineStyle`, `Loader.type`— cuesta 0 kB, no toca el contrato y deja `variant`
significando una sola cosa en todo el catálogo. Es la precondición barata de todo lo demás, y el
momento es ahora: los paquetes siguen `private: true` y sin consumidores externos (ADR-032
Consecuencias). Se propone como su propio tramo.

---

## 4. ADRs propuestos

Redactados tras el checkpoint del §6, **todos en estado `propuesta`**. La numeración arranca en
**ADR-038**, verificada con `ls docs/adr/` (último existente: `ADR-037-gate-de-regresion-visual.md`).

| Nº                                                            | Título                                                                            | Origen        |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------- |
| [ADR-038](../adr/ADR-038-variantes-de-superficie-por-subconjunto.md) | Variantes de superficie por subconjunto declarado de `Variant`             | pregunta A    |
| [ADR-039](../adr/ADR-039-budget-primitivo-temable-con-variantes.md)  | Escalón «primitivo temable con variantes en runtime» ≤14,5 kB              | pregunta A    |
| [ADR-040](../adr/ADR-040-buildpairs-derivado-de-variantmap.md)       | `BuildPairs` derivado de `variantMap` en `tools/contrast-check`            | independiente |
| [ADR-041](../adr/ADR-041-variant-es-receta-cromatica.md)             | `variant` significa receta cromática: renombrado de Divider y Loader       | independiente |
| [ADR-042](../adr/ADR-042-eje-surface-del-recipe-field.md)            | El tratamiento de superficie de un campo es eje local del recipe `field`   | pregunta B    |
| [ADR-043](../adr/ADR-043-tipografia-sin-variant-y-gradienttext-a-w3.md) | La tipografía no recibe `variant`; `GradientText` de W4 a W3            | pregunta C    |

**No se propone ningún ADR de ampliación de la unión `Variant`**, porque ninguna conclusión de esta
auditoría lo requiere (§3.1.1). Es el resultado más importante del informe: la decisión con más
arrastre del sistema no hay que tomarla.

Dos precisiones sobre el reparto:

- **ADR-039 introduce un escalón nuevo, no sube el de ADR-022.** Subir «primitivo temable en runtime»
  de 12 a 14,5 kB dejaría a trece primitivos que no adoptan `variant` —Group, Grid, GridCol,
  SimpleGrid, Container, Scroll, Space, AspectRatio, Mark, Blockquote, List, Skeleton, Radio, hoy entre
  9,35 y 11,61 kB— con ~3 kB de margen ocioso. Es la forma exacta de ADR-022, que introdujo un
  sub-budget en vez de relajar el de 9 kB.
- **V6 (`color: ColorExtended` en 16 componentes) no lleva ADR propio**: ADR-021 ya lo decidió como
  convención («los ~200 componentes siguientes que expongan color usan `ColorExtended`»). Es ejecución
  de un ADR aceptado, no una decisión nueva. Sí hay un detalle a resolver por componente en ese tramo:
  ampliar a `ColorExtended` obliga a soportar el **modo plano** de ADR-021, y en primitivos como Mark,
  Highlight o Blockquote, que hoy solo necesitan una escala, eso es peso añadido sobre un budget de
  12 kB. La medición manda, componente a componente.

---

## 5. Plan por tramos

Formato de `docs/reviews/code-design-audit-2026-07-28.md` §5. Cada tramo cierra con
`pnpm turbo build typecheck lint test size` en verde, y con `check:contrast` cuando toque tokens o temas.

| Tramo | Contenido                                                                                              | ADR     | Depende de | ¿Bloquea W3?                         |
| ----- | ------------------------------------------------------------------------------------------------------ | ------- | ---------- | ------------------------------------ |
| V0    | ~~Renombrado de los ejes de Divider y Loader~~ · **cerrado 2026-07-28**                              | ADR-041 | —          | no — paralelo                        |
| V1    | `BuildPairs` derivado de `variantMap`; triaje y corrección de los fallos que destape                   | ADR-040 | —          | no — paralelo, **pero precede a V3** |
| V2    | Subconjuntos declarados + `ResolveVariant` en Alert y Badge (unifica la deriva de §0.2)                | ADR-038 | V0         | **sí**                               |
| V3    | Escalón «temable con variantes» ≤14,5 kB; Progress a 16; medición pegada entrada por entrada           | ADR-039 | V2         | **sí**                               |
| V4    | Card, Paper, Avatar, Toast, Progress                                                                   | ADR-038 | V3         | no — paralelo                        |
| V5    | Segment, Tabs, NavLink, Pagination                                                                     | ADR-038 | V3         | no — paralelo                        |
| V6    | `color: ColorExtended` en los 16 componentes que hoy usan `SemanticScaleName` (deuda de ADR-021, §0.3) | ADR-021 | V2         | no — paralelo                        |
| V7    | `GradientText` en W3; desglose de `docs/05` §W3/§W4 y de `docs/00-inventory.md:255`                    | ADR-043 | —          | no — **es alcance de W3**            |
| V8    | Eje `surface` del recipe `field` en los campos                                                         | ADR-042 | —          | no — **diferido a W3**               |

**Lo que bloquea W3 son V2 y V3, y solo ellos.** V2 fija el patrón que Chip, Banner, StatusBadge,
Stepper y CardComplex deben seguir al nacer; V3 fija el budget con el que nacen. Abrir W3 antes de
cerrarlos significa escribir cinco componentes nuevos con recetas a mano y repetir §0.2 a mayor escala.

V0 y V1 son independientes entre sí y de todo lo demás; pueden empezar hoy. **V1 se sitúa antes de V3
a propósito**: si el gate de contraste derivado destapa fallos en las recetas actuales —y §3.4 dice que
es previsible—, es mucho más barato saberlo antes de propagar esas recetas a once componentes más.

V4, V5 y V6 pueden solaparse con W3 sin bloquearlo, porque son aplicación de un patrón ya fijado.

V7 y V8 **no son tramos previos a W3 sino trabajo dentro de W3**: V7 entrega `GradientText` con el
resto de W3, y V8 espera a que existan los 24 campos definitivos (hoy 9) para decidir el reparto una
sola vez. Ninguno bloquea nada.

### 5.1 Estado de ejecución

| Tramo   | Estado          | Nota                                                                             |
| ------- | --------------- | -------------------------------------------------------------------------------- |
| V0      | **cerrado**     | ADR-041 aceptado. `Divider.variant` → `lineStyle`, `Loader.variant` → `type`     |
| V1 – V8 | sin empezar     | —                                                                                 |

Con V0 cerrado, la afirmación «todo `variant` del catálogo es un subconjunto de `Variant` resuelto
contra `variantMap`» es cierta para los cuatro componentes que hoy exponen el prop, y por primera vez
es comprobable con un lint en vez de con una lista de excepciones. Alert y Badge siguen resolviendo su
receta a mano —eso lo cierra V2—, pero ya no hay ningún `variant` que signifique otra cosa.

---

## 6. Checkpoint — resuelto el 2026-07-28

| Pregunta                    | Decisión del propietario                                                                                        | ADR              |
| --------------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------- |
| **A** — superficie          | **Sí, con recalibración.** Subconjunto declarado + `ResolveVariant`, aceptando el escalón de budget nuevo       | ADR-038, ADR-039 |
| **B** — campos              | **Eje `surface` local del recipe `field`, diferido a W3.** No se usa la unión `Variant`                         | ADR-042          |
| **C** — tipografía          | **No procede**, y `GradientText` se adelanta de W4 a W3                                                         | ADR-043          |
| Independiente — contraste   | **Se abre.** `BuildPairs` derivado de `variantMap`                                                              | ADR-040          |
| Independiente — nombres     | **Se abre.** Renombrado de `Divider.variant` → `lineStyle` y `Loader.variant` → `type`                          | ADR-041          |
| Independiente — `color`     | **Se abre.** `ColorExtended` en los 16 componentes que hoy usan `SemanticScaleName`                             | ejecuta ADR-021  |

Las seis decisiones están redactadas en `docs/adr/ADR-038…043`, todas en estado **`propuesta`**: se
aceptan al abrir su tramo, con el doc que enmiendan actualizado en el mismo PR (`docs/02` §2.3 y
`docs/patterns/web-component-template.md` §2 para ADR-038; `docs/03` §3 para ADR-039; `docs/03` §4.2
para ADR-040; `docs/00-inventory.md` para ADR-041 y ADR-042; `docs/05` §W3/§W4 para ADR-043).

**La pregunta cara no hubo que hacerla.** Ninguna de las tres respuestas amplía la unión `Variant`, de
modo que los cuatro temas oficiales, `load-theme.ts`, el schema de Zod, los temas de tenant y la
implementación native quedan intactos. El coste real de la decisión es de **bundle**, no de contrato:
+2,2 kB brotli en once componentes y un escalón de `size-limit` nuevo.

---

## Anexo — evidencia de ejecución

Todas las mediciones de este informe provienen de ejecuciones reales del 2026-07-28.

**Gate** (`turbo` no arranca su binario nativo en este entorno —`spawn UNKNOWN`, errno -4094—, así que
se ejecutaron los mismos scripts con `pnpm -r --workspace-concurrency=1`):

```
build     exit=0
typecheck exit=0
lint      exit=0
test      exit=0    → 88 test files, 452 tests, 0 fallos
```

**Bundle** — `pnpm --filter @stellaria/nebula-web size`: 78 entradas, todas dentro de budget.
Extracto de las filas citadas:

```
Text          9.13 kB / 9.5 kB      Title        9.14 kB / 9.5 kB
Paper        10.90 kB / 12 kB       Badge       11.57 kB / 12 kB
Avatar       11.65 kB / 12 kB       Divider     11.61 kB / 12 kB
Loader       11.41 kB / 12 kB       Progress    12.21 kB / 14 kB
NavLink      18.75 kB / 21 kB       Card        19.44 kB / 22 kB
Pagination   18.99 kB / 22 kB       Segment     28.14 kB / 32 kB
Tabs         28.24 kB / 32 kB       Alert       30.44 kB / 35 kB
ActionIcon   29.64 kB / 34 kB       Button      29.92 kB / 34 kB
```

**Contraste** — `node tools/contrast-check/src/cli.ts`:

```
28 pares · 28 PASS · 0 FAIL   (× smoke-light, nebula-light, nebula-dark, sober-light, playful)
✔ Gate de contraste en verde para 5 temas.
```

**Delta de `ResolveVariant`** — esbuild 0.28.1 (`--bundle --minify --format=esm --target=es2022`,
`react`/`react-dom` externos) sobre `packages/web/dist`, comprimido con `zlib.brotliCompressSync`
q11; el detalle está en §3.2.

No se modificó ningún archivo del catálogo: la auditoría solo lee.

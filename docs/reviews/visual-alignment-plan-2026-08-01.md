# WR3.1 — Plan de alineación visual

> 2026-08-01. Sale de [`visual-audit-2026-08-01.md`](visual-audit-2026-08-01.md). **WR4 ejecuta estos
> tramos**; cada bloque es copiable tal cual.
>
> ✅ **El checkpoint de CONTRATO se resolvió el 2026-08-01** (ver T1). Con él, el plan queda
> desbloqueado y **T0 ya está ejecutado**.
>
> Estado: **T0, T2 y T4 ejecutados** · **T1 resuelto** con sus dos ADRs escritos y aceptados
> ([ADR-063](../adr/ADR-063-estado-disabled-dos-recetas-y-rol-de-superficie.md) ·
> [ADR-064](../adr/ADR-064-suposiciones-del-resolver-de-variantes.md)) · **T3 y T5 pendientes**.
> T2 sumó [ADR-065](../adr/ADR-065-escalon-de-superficie-y-escalera-de-sombras.md) ·
> [ADR-066](../adr/ADR-066-escala-de-prosa-y-dimensionado-del-codigo.md) ·
> [ADR-067](../adr/ADR-067-paleta-categorica-de-series-de-datos.md), y **desbloqueó T3**.
> C3 queda a medias: ver la salvedad 1 de T4.

## Orden y bloqueos

| Tramo  | Resuelve                              | Bloqueado por                                     | Bloquea a         |
| ------ | ------------------------------------- | ------------------------------------------------- | ----------------- |
| **T0** | C15 · C16                             | —                                                 | —                 |
| **T1** | Checkpoint: C2 · C9 · C13 · C17       | —                                                 | T4, parte de T5   |
| **T2** | C4 · C5 · C8 · C10 · C12 · C14-charts | — **ejecutado**                                   | T3 (desbloqueado) |
| **T3** | C6 · C7                               | ~~T2~~ — libre                                    | —                 |
| **T4** | C1 · C3 (C3 a medias)                 | — **ejecutado**                                   | —                 |
| **T5** | C11 · C14-Kanban                      | T1/ADR-063, **solo** para el punto 4 (`disabled`) | —                 |

T0, T2 y T4 pueden ir en paralelo: T0 no toca especificación, T2 no toca código y T4 no depende de
ninguno de los dos.

---

## T0 — La regresión de `Paper` y el detector que no la vio ✅ **ejecutado el 2026-08-01**

**Resultado, medido sobre el render en los cuatro temas:**

| Tema           | `Paper` sin props  | Lienzo             | Ratio | `Card`                |
| -------------- | ------------------ | ------------------ | ----: | --------------------- |
| `nebula-dark`  | `rgb(8,10,18)`     | `rgb(6,8,15)`      | 1.012 | idéntico a `Paper` ✅ |
| `nebula-light` | `rgb(253,253,253)` | `rgb(255,255,255)` | 1.017 | ídem ✅               |

Antes era **1.000 en los cuatro**. `Paper` y `Card` —los dos componentes que `docs/06` §5 pone en el
nivel 1— ahora pintan la misma superficie.

**Y deja a la vista C4**: el escalón restaurado es 1.012–1.073, o sea **por debajo del 1.08 del
escalón de hover**. T0 devuelve el valor que el sistema pretendía; **T3 decide si ese valor es
suficiente**. No son el mismo problema y conviene no confundirlos.

Gates: `build typecheck lint test` 29/29 · `check:contrast` 5 temas · 0 FAIL · `size` 0 excedidas ·
`a11y` 82 suites / **557** tests (+1 lámina), 0 violaciones.

<details>
<summary>El bloque ejecutado</summary>

```
Actúa como ingeniero de UI en C:\Users\Skr13\Documents\GitHub\Nebula.
Tramo T0 del plan de alineación visual (docs\reviews\visual-alignment-plan-2026-08-01.md).

CAUSA QUE RESUELVE
  C15 — Paper pinta surface.base siendo el primitivo del nivel 1 (regresión de d08da37).
  C16 — La lámina Foundations/Visual QA/Surfaces no ejerce ningún valor por defecto, y por eso
        C15 sobrevivió a un cierre de tramo con los cuatro gates en verde.

COMPONENTES
  packages\web\src\components\Paper\Paper.css.ts
  apps\playground-web\src\stories\FoundationsSurfaces.stories.tsx

QUÉ HACER
1. Paper.css.ts:14 — `fallbackVar(bg, vars.color.surface.base)` vuelve a
   `fallbackVar(bg, vars.color.surface.raised)`. Lo dicen tres fuentes: docs\06 §5 (nivel 1
   «card/panel → surface.raised»), el propio Paper.md L3 y L9 —que cita el código con el valor
   viejo— y Card.css.ts:19, su hermano del mismo nivel.
2. FoundationsSurfaces.stories.tsx — añadir una fila que pinte cada primitivo de superficie
   SIN props: `<Paper />`, `<Card />`, `<Section />` tal cual, sin `bg` ni `withBorder`. Hoy la
   lámina pasa `bg={step.surface}` explícito en los cinco niveles (L50-56), así que no puede
   detectar un default roto — que es exactamente lo que pasó.

CRITERIO DE ACEPTACIÓN (verificable)
  - En los cuatro temas, el `background-color` computado de un `<Paper>` sin props NO es igual al
    del `body`. Hoy la relación de luminancia es exactamente 1.000 en los cuatro.
  - La nueva fila de la lámina falla a ojo si alguien vuelve a cambiar el default.

GATES: pnpm turbo build typecheck lint test · check:contrast · size · a11y
ADR: no. Restaura lo que docs\06 y Paper.md ya dicen.
BLOQUEADO POR: nada.
```

</details>

---

## T1 — Checkpoint de CONTRATO ✅ resuelto el 2026-08-01

Se presentaron las cuatro causas juntas y el propietario resolvió las tres preguntas. **El cubo se
redujo de cuatro causas a dos ADRs.**

| Causa         | Decisión                                                                                                                                                                                              | Dónde queda                                                            |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **C2**        | **Corregir a los peldaños existentes.** `Tag`, `Kbd` y `Slider` pasan a `sizes.compact`/`control` tal como están; la escala **no se amplía**                                                          | Sale de CONTRATO → **CALIBRACIÓN**. Sin ADR. **T4 queda desbloqueado** |
| **C9**        | **Dos recetas + rol `surface.disabled`**: una para controles con superficie propia (cambia el fill y atenúa el texto, como el diseño), otra para los que no la tienen (`Checkbox`, `Radio`, `Switch`) | **ADR-063**                                                            |
| **C13 + C17** | **Un ADR conjunto**: toda derivación resuelve el gradiente a un color antes de operar, y la dirección de hover deja de estar horneada en `ShiftRef`                                                   | **ADR-064** — desbloquea además igualar el color de dark al de light   |

**Consecuencia para el orden**: T4 ya no espera a nadie. Lo único que sigue bloqueado es el punto 4
de T5 (unificar `disabled`), que espera a ADR-063.

De las **nueve decisiones numeradas** de `visual-audit-2026-08-01.md` §5, este checkpoint cierra las
tres primeras y las cuatro y cinco. Las cuatro restantes son de ESPECIFICACIÓN y las cierra T2.

<details>
<summary>Lo que se presentó en el checkpoint</summary>

Las cuatro causas iban juntas porque aprobar cuatro ampliaciones de una vez cuesta menos que cuatro
checkpoints, y porque **dos de ellas resultaron ser una**.

| Causa   | Qué se pide                                                             | Evidencia                                                                                                                                                      |
| ------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **C2**  | Peldaños intermedios en `sizes.compact`, o la decisión de que no faltan | `Tag` usa 18/22/26/38 y `Kbd` 18/34, ninguno en la escala (20/24/28/32/36). `Slider` necesita un peldaño de pulgar que no existe en ninguna de las dos escalas |
| **C9**  | Rol `surface.disabled` y/o opacidad de texto deshabilitado tokenizada   | Cinco recetas en el catálogo; el fill del diseño (`#E6ECF3` light / `#1B2540` dark) no corresponde a ningún rol actual                                         |
| **C13** | Que `color-mix`/`WithAlpha` reciban siempre un color                    | `color-mix(in srgb, <gradiente> 16%, transparent)` es inválido → el rango de fechas desaparece con un `filled` de gradiente                                    |
| **C17** | Dirección de hover por variante en `VariantRecipe`                      | `ShiftRef` mueve siempre +1; con la base en el lado oscuro y texto blanco, el hover da 3.70 y `check:contrast` tumba 14 pares                                  |

**C13 y C17 son la misma familia**: el resolver hace suposiciones sobre lo que `variantMap` le va a
entregar —que será un color, y que el hover debe ir hacia el 950—.

</details>

---

## T2 — Enmiendas a `docs/06` ✅ **ejecutado el 2026-08-01**

Los seis puntos quedan con número o regla operable. **T3 está desbloqueado.**

| Causa       | Lo que había                                 | Lo que queda                                                                                | Dónde          |
| ----------- | -------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------- |
| **C4**      | nada                                         | **≥1.08** entre niveles adyacentes, los dos esquemas, todo par                              | §5 · ADR-065   |
| **C5**      | §5 decía `md`/`lg`, el código `lg`/`xxl`     | Tabla vinculante nivel→sombra; gana §5, **después** de C4                                   | §5.3 · ADR-065 |
| **C8**      | «cae en la escala», sin decir cómo           | `minHeight` siempre, `height` nunca; multilínea puede exceder; el hijo no desborda al padre | §4.1           |
| **C10**     | baseline único, y un componente lo incumplía | Escala de prosa **declarada**; cuerpo `body1`; pesos y tracking de `Title`                  | §2.2 · ADR-066 |
| **C12**     | tres criterios (0.875em / 0.9em / body3)     | `max(0.875em, 12px)` inline · `body3` bloque · `1em` dentro de `pre`                        | §2.3 · ADR-066 |
| **C14-ch.** | ningún criterio                              | **≥1.10** adyacente · **ΔE2000 ≥15** normal · **≥10** protán/deután                         | §9 · ADR-067   |

**Tres hallazgos nuevos**, medidos al especificar y que la auditoría de WR2 no tenía:

1. **`surface.overlay` es el mismo hex que `surface.base` en tres de los cuatro temas** — ratio
   **1.000**, no un escalón pequeño. `Menu`, `Popover`, `Dialog`, `Modal` y el skip-link de `AppShell`
   pintan exactamente el color del lienzo. C4 no era «el escalón se queda corto», era «no hay escalón».
2. **Un tema puede dar el mismo hex a las series `primary` e `info` de un gráfico** (
   ΔE 0.0) y `accent`/`success` están a ΔE 2.0: seis series se dibujan con tres colores y medio.
3. **Todo bloque de código en prosa renderiza a 11.7 px**, bajo el suelo de 12 px de §2, porque
   `${typography} pre code` resetea `padding` y `background` pero no el tamaño y el `0.9em` se aplica
   sobre los 13 px del `pre`. No hace falta anidamiento raro: es el caso por defecto.

**Una premisa del plan corregida**: este documento afirmaba que `Drawer` no declara sombra. Sí la
tiene — `Drawer` renderiza `Modal`, así que hereda su `xxl`. Quien no declara sombra es `AppShell`, y
es correcto: es el nivel 0.

**Umbral recalibrado antes de escribirlo**: la primera versión del criterio de charts pedía ΔE ≥12
bajo dicromatismo. Validado contra **Okabe-Ito**, la referencia CVD-safe del campo, que alcanza
**11.6** — el umbral se habría escrito ya incumplido por la referencia. Se bajó a 10. Por el mismo
motivo el ratio de luminancia se exige **solo entre series adyacentes**: a todos los pares es
imposible incluso para Okabe-Ito (1.025).

Gates: `build typecheck lint test` **29/29** · `check:contrast` **5 temas · 0 FAIL**. No toca código,
así que `size` y `a11y` quedan como estaban.

<details>
<summary>El bloque ejecutado</summary>

```
Actúa como diseñador de sistemas en C:\Users\Skr13\Documents\GitHub\Nebula.
Tramo T2. NO TOCA CÓDIGO: solo docs\06-visual-language.md y, si cambia algo ya escrito, su ADR.

CAUSAS QUE RESUELVE: C4 · C5 · C8 · C10 · C12 · C14-charts

QUÉ ESPECIFICAR, con el hueco exacto de cada una

1. C4 — EL ESCALÓN DE SUPERFICIE. §5 lista cinco niveles y su tratamiento, pero no dice cuánto
   debe separar uno del siguiente. Medido hoy: AppShell↔lienzo 1.012–1.073, Modal↔cuerpo 1.062,
   Paper↔lienzo 1.000. Las dos únicas referencias numéricas de docs\06 son 1.08 (hover, §5.1) y
   1.3–1.4 (separador, §5.2): los escalones de superficie son MÁS PEQUEÑOS que el de hover.
   Hay que fijar un número, y decir si es el mismo en los dos esquemas.

2. C5 — LA ESCALERA DE SOMBRAS. §5 pide sm/md/lg para los niveles 2/3/4. El código usa lg para
   Popover, Menu, Dialog, HoverCard y Header flotante; xxl para Modal; ninguna para Drawer y
   AppShell. La lámina Foundations/Surfaces declara xs/sm/md/lg, o sea coincide con §5 y no con el
   código. Decidir cuál gana y alinear el otro.

3. C8 — ¿minHeight o height? El recipe `field` usa minHeight y cumple la escala; NavLink usa
   minHeight y se sale (36 declarado, 40.3 real en nebula). §4.1 dice en qué escala
   tiene que caer la altura pero no si el componente debe forzarla. Decidir también si un control
   puede legítimamente no tener altura fija — la variante de NavLink con descripción son dos líneas.

4. C10 — ¿PROSA O UI? §2 fija un baseline único. TypographyStylesProvider rinde el cuerpo a 14 px con
   interlineado relaxed mientras Text rinde 16 px con normal, y sus h1–h2 son semibold sin tracking
   mientras Title los pone bold con tracking tight. Si la prosa larga puede tener escala propia, hay
   que escribirlo y deja de ser defecto; si no, es un hallazgo A que corrige T5.

5. C12 — CÓMO SE DIMENSIONA EL CÓDIGO. Hoy hay tres criterios: Code usa 0.875em, la prosa usa 0.9em
   y CodeHighlight usa body3 absoluto. El mismo fragmento se ve a 12.6, 14 y 13 px según dónde caiga.
   Elegir uno. Y comprobar el borde: un `code` a 0.9em dentro de un `small` (12 px) da 10.8 px, bajo
   el suelo de §2.

6. C14-charts — LA PALETA CATEGÓRICA. docs\06 no da ningún criterio de separación entre series: ni
   ratio de luminancia mínimo, ni Δ perceptual, ni regla de orden. Las dos primeras series por
   defecto tienen ratio 1.04 con Δrgb 235: tonos muy distintos, casi la misma claridad, así que se
   confunden en escala de grises y con deficiencia protán/deután.

CRITERIO DE ACEPTACIÓN
  Cada uno de los seis puntos queda con un NÚMERO o una REGLA operable en docs\06 — no con una
  descripción. «El cuerpo contrasta» no es especificación; «≥1.15 entre niveles adyacentes» sí.

GATES: ninguno de código. ADR por cada punto que cambie algo ya escrito en docs\06 (C5 seguro:
hoy §5 dice una cosa y el catálogo hace otra desde hace meses).
BLOQUEADO POR: nada. Bloquea a T3.
```

</details>

---

## T3 — Calibrar superficies y bordes

```
Actúa como ingeniero de UI en C:\Users\Skr13\Documents\GitHub\Nebula.
Tramo T3. Requiere T2 cerrado: sin el número de C4 esto es elegir un valor al azar.

CAUSAS: C6 · C7, más la IMPLEMENTACIÓN de ADR-065 (C4 y C5), que T2 especificó y no ejecutó.

COMPONENTES
  ADR-065 — los roles surface.base/raised/overlay de los CINCO temas, más la sombra de Modal,
       Drawer, Menu, Popover, Select, DatePicker, ColorPicker y HoverCard.
  C6 — el separador interno de los overlays y el borde de Menu (calibración de TEMA, no de
       componente: los valores existen, están mal elegidos).
  C7 — Paper, Card (border.default) frente a AppShell, Section, Panel (border.subtle).

QUÉ HACER
0. ADR-065, Y EN ESTE ORDEN. Primero SUBIR el escalón de superficie a ≥1.08 entre niveles
   adyacentes (los dos esquemas, todo par adyacente, sunken↔base incluido) y romper la igualdad
   surface.overlay == surface.base, que hoy es EXACTA en nebula-dark y nebula-light.
   Solo DESPUÉS bajar la sombra a la tabla de §5.3 (nivel 3 → md, nivel 4 → lg). Al revés deja los
   overlays MENOS separados que hoy.
   Hay escalera conforme dentro de las paletas actuales: para nebula-dark, base=dark.50 →
   raised=dark.400 (1.098) → overlay=dark.600 (1.095). No hace falta ampliar el contrato.
   OJO CON LIGHT: en un tema claro extremo surface.raised YA es blanco puro, así que el nivel 3 no tiene
   recorrido por encima. La escalera light se construye BAJANDO el lienzo, no subiendo el overlay;
   con escalón 1.08 un raised conforme no pasa de luminancia 0.9222 y gray.50 está en 0.9289.
1. C6 — §5.2 pide ~1.3–1.4 EN AMBOS ESQUEMAS. Medido: el separador interno da 1.253 en dark y
   **1.010 en light** —donde a efectos prácticos no se ve—; el borde de Menu da **2.266 en dark** y
   1.390 en light. Ojo: FALLAN EN ESQUEMAS OPUESTOS, así que una calibración única empeora uno al
   arreglar el otro. Calibrar por esquema, que es justo lo que §5.2 llama «no por espejo de paleta».
2. C7 — §5 dice «border sutil» para los niveles 1 y 2. Hoy la card se separa del fondo con un borde
   MÁS FUERTE que el del shell que la contiene. Unificar sobre el nivel, no sobre el componente.

CRITERIO DE ACEPTACIÓN
  - Todo par de niveles adyacentes separa ≥1.08 en los CUATRO temas, medido sobre el DOM renderizado.
    Ningún par comparte color exacto.
  - Separador interno y borde de contenedor caen en la banda ~1.3–1.4 de §5.2, en los cuatro temas.
  - Un mismo nivel de elevación usa un solo rol de borde y una sola sombra en todo el catálogo.

  CUIDADO AL MEDIR: usa tools\render-measure\ y lee sus tres trampas. La de background-image importa
  aquí más que en ningún otro tramo, porque este tramo mide FONDOS.

GATES: los cuatro + check:contrast (toca tema).
  check:contrast es NECESARIO Y NO SUFICIENTE aquí: mide texto sobre fondo, no fondo contra fondo.
  El escalón roto que este tramo arregla pasó los cinco temas en verde durante meses.
ADR: no. ADR-065 ya está escrito y aceptado; esto lo implementa.
BLOQUEADO POR: nada — T2 cerrado el 2026-08-01.
IMPACTO EN EL BASELINE: el más amplio del plan — Paper, Card, AppShell, Section, Panel, Modal,
Drawer, Menu, Popover, Dialog, HoverCard. Es el tramo que manda sobre la fecha de captura de ADR-037.
```

---

## T4 — Sacar la geometría de los literales ✅ **ejecutado el 2026-08-01, con dos salvedades**

**Resultado medido** (`nebula-dark`; idéntico en los claros, y eso es lo correcto — ver la
corrección del criterio más abajo):

| Componente                   | Antes                  | Ahora                                                           | Origen                                   |
| ---------------------------- | ---------------------- | --------------------------------------------------------------- | ---------------------------------------- |
| `Kbd` alto                   | 18/20/24/28/34 literal | **20/24/28/32/36**                                              | `sizes.compact` exacto                   |
| `Kbd` fuente                 | **10**/11/12/14/16     | **12/12/13/14/16**                                              | `caption`→`body1`; ninguna bajo el suelo |
| `Tag` alto                   | 18/22/26/32/38 literal | `sizes.compact`                                                 | idem                                     |
| `Indicator` caja             | 8/12/16/20/24 literal  | `calc(compact / 2)` = 10/12/14/16/18                            | derivado, como `Checkbox`                |
| `Indicator` fuente           | **8/9/10/11**/12       | **12/12/12/13/14**                                              | ninguna bajo el suelo                    |
| `Slider` pista               | 4/5/6/8/10 literal     | `calc(control / 8)`                                             | derivado                                 |
| `Slider` pulgar              | 12/14/16/20/24 literal | `calc(control / 2)` = **15/18/21/25/30**                        | derivado                                 |
| `Slider` + `Rating` objetivo | = al gráfico           | **`::after` con `min-*: 24px`** verificado en los cinco tamaños | WCAG 2.5.8                               |
| `AppShell` z-index           | `3` y `20`             | `zIndex.sticky` y `zIndex.overlay`                              | contrato                                 |
| `Main` z-index               | `0` y `10`             | `zIndex.base` y `zIndex.overlay`                                | contrato                                 |

**Salvedad 1 — `Rating` sigue en `compact`.** Se le añadió el área de impacto de 24 px, así que
**cumple WCAG 2.5.8**, pero `docs/06` §4.1 dice «lo interactivo va en `control`» y eso **no se hizo**:
pasar las estrellas a `control` las llevaría de 20–36 px a 30–60 px y cambia el carácter del
componente. Es una decisión de diseño, no una calibración. **C3 queda abierta a medias.**

**Salvedad 2 — los z-index locales de `Main` no se tocaron.** Los `zIndex: 1` y `zIndex: 2` de su
cabecera y su pie son apilamiento **interno** del componente, no capas globales que compitan con
overlays. Sustituirlos por tokens de la escala 1000–1600 no arregla nada y sí arriesga romper el
orden. Se cambiaron solo los cuatro que compiten globalmente.

**Efecto lateral detectado, no corregido**: medido en la lámina, un `Tag` con botón de cierre mide
**38 px** aunque su `minHeight` sea 28 — el `ActionIcon` interior (36 px) lo desborda. Es la causa
**C8** (`minHeight` que el contenido desborda) apareciendo en un tercer sitio, además de `NavLink` y
del recipe `field`. Va a T2/T3, no aquí.

Gates: `build typecheck lint test` 29/29 · `check:contrast` 5 temas · 0 FAIL · `size` 0 excedidas ·
`a11y` 82 suites / 557 tests, 0 violaciones.

<details>
<summary>El bloque ejecutado</summary>

```
Actúa como ingeniero de UI en C:\Users\Skr13\Documents\GitHub\Nebula.
Tramo T4. DESBLOQUEADO: el checkpoint del 2026-08-01 resolvió C2 a favor de corregir a los peldaños
EXISTENTES. No se amplía sizes.compact, así que este tramo no necesita ADR ni espera a nadie.

CAUSAS: C1 · C3

COMPONENTES Y VALORES MEDIDOS
  Kbd        fuentes 10/11/12/14/16 px · alturas 18/20/24/28/34 · dos fuentes bajo el suelo de 12 px
  Indicator  fuentes 8/9/10/11/12 px · cajas 8/12/16/20/24 · CUATRO fuentes bajo el suelo
  Tag        minHeight 18/22/26/32/38 literal, paddingInline con token: crece con el tema a lo
             ancho pero no a lo alto (26 px en los dos temas, 67.3 → 63.3 px de ancho)
  Slider     pista 4/5/6/8/10 · pulgar 12/14/16/20/24 · el pulgar ES el objetivo táctil y con el
             tamaño por defecto mide 16 px, dos tercios del mínimo de 24 px CSS de §4
  Rating     (C3) botones role=radio de 20/24/28/32/36 px tomados de sizes.compact, que §4.1
             prohíbe expresamente para lo interactivo; xs queda además bajo los 24 px
  AppShell   z-index literales 3 y 20 · Main literales 0,1,2,10 — mientras Header, Popover, Menu,
             Tooltip y Toast usan la escala del contrato (1000–1600)

EL MODELO A SEGUIR ESTÁ EN EL CATÁLOGO
  Checkbox deriva su caja con `calc(control.<size> / 2)` → 15/18/21/25/30 px medidos. Consigue las
  dos cosas —la fila conserva el peldaño y la caja se ve compacta— sin inventar escala y sin dejar
  de responder al tema. Es exactamente lo que les falta a Rating y a Slider.

CRITERIO DE ACEPTACIÓN
  - Ningún componente de la lista declara una altura, una caja ni un tamaño de fuente en literal.
  - Ningún texto informativo baja de 12 px y ningún objetivo táctil baja de 24 px CSS.
  - Los z-index que compiten globalmente salen de vars.zIndex.

  CORRECCIÓN (2026-08-01): la primera versión de este criterio pedía que «los valores CAMBIEN entre
  dos temas con bases de espaciado distintas». Es INCORRECTO para las alturas: `sizes.control` y
  `sizes.compact` NO se recalibran por tema —los cuatro temas importan el mismo objeto `sizes`, como
  verificó WR2.3 A-1—, así que salir idénticos entre temas es lo correcto para lo que deriva de
  `sizes`. El criterio solo aplica a lo que deriva de `space`.

GATES: los cuatro + size (cambia el CSS de seis componentes).
ADR: no. El checkpoint decidió corregir a los peldaños existentes, no ampliar la escala.
BLOQUEADO POR: nada.
```

</details>

---

## T5 — Ritmos, labels y estados ✅ **ejecutado el 2026-08-14**

> Los tres puntos de código se midieron abiertos sobre `main` trece días después de escribirse este
> plan, y se cerraron entonces: `FormField.header` pasa de **0 px a 2 px** entre etiqueta y ayuda —y
> alcanza a los 27 campos a la vez—, el disparador de `Spoiler` sube de `body3` sin peso a `button`
> con `semibold`, y el destino de arrastre de `Kanban` gana el `outline: 1px dashed` de su hermano
> `DragDrop` más un segundo canal de peso en `data-over-limit`.
>
> Los dos encargos de verificación salieron limpios: **control→error ya tenía ritmo uniforme** —lo
> gobierna el `gap: sm` de `field.css.ts:14`, así que los controles altos no eran un caso aparte— y el
> **punto 4 estaba resuelto por ADR-063**, con `surface.disabled` en seis componentes.
>
> Que el de `Kanban` sobreviviera trece días con axe en verde es el dato que justifica esta fase:
> señalar solo con color no lo detecta ninguna herramienta automática.

```
Actúa como ingeniero de UI en C:\Users\Skr13\Documents\GitHub\Nebula.
Tramo T5. La parte de `disabled` requiere las decisiones 2 y 3 de T1; el resto no.

CAUSAS: C11 · C14-Kanban (y C9 si T1 lo aprobó)

QUÉ HACER
1. C11 — FormField.css.ts:8-15: el `header` es un flex column SIN gap, así que la etiqueta y su
   ayuda quedan pegadas: medido 0 px en los tres temas, donde §3 pide xxs/xs. Añadir
   `gap: vars.space.xxs`. Es el arreglo más barato del plan y toca los 27 campos a la vez.
   Verificar además el tramo que quedó SIN MEDIR: control→error, y el ritmo con controles altos
   (Textarea, Dropzone, Signature), que era el segundo punto del foco de WR2.4 y no se hizo.
2. C11 (segunda mitad) — Spoiler.css.ts:30-36: el disparador usa body3 (13 px) sin fontWeight, donde
   §2 pide `button` (14 px) y semibold para labels de control.
3. C14-Kanban — Kanban.css.ts:37-39 señala el destino solo con color (fondo + color de borde, sin
   cambiar grosor ni estilo). Replicar el patrón de su hermano DragDrop.css.ts:75-78:
   `outline: 1px dashed vars.color.border.strong` con `outlineOffset: -1`. Para `data-over-limit`
   (L78), añadir un segundo canal al color de aviso. Es WCAG 1.4.1.
4. C9, SOLO SI T1 LO APROBÓ — unificar las cinco recetas de disabled sobre lo decidido.

CRITERIO DE ACEPTACIÓN
  - label→ayuda separa lo que fije §3, medido en los cuatro temas.
  - El disparador de Spoiler mide lo mismo que cualquier otro label de control.
  - El destino de un arrastre en Kanban se distingue EN ESCALA DE GRISES.

GATES: los cuatro + a11y.
ADR: no, salvo la parte de C9.
BLOQUEADO POR: T1, solo para el punto 4.
```

---

## Después de T5

**Capturar el baseline de ADR-037.** No antes: T3 cambia once componentes de tres familias y T5
propaga a los 27 campos por `FormField`. Capturar antes de T3 obliga a rehacerlo, no a ajustarlo.

Y queda pendiente lo que este plan **no** cubre, porque la auditoría no lo produjo:

- **El paso 1 del método —MIRAR— no se hizo en ninguna familia.** Las ocho midieron el render; ninguna
  lo miró. Ritmo, alineación óptica y legibilidad de una composición siguen sin cubrir.
- **El paso 4 —Figma— tampoco**, de ahí los cero hallazgos C. El cubo de ESPECIFICACIÓN de T2 sale de
  huecos de `docs/06`, no del diseño.
- **~80 de 145 componentes sin medida de render**, concentrados en overlays (12), datos (25) y fechas
  (11).
- **`hover`, `active`, `focus-visible` y `loading` no se verificaron en ningún control.**

Si WR4 ejecuta este plan tal cual, cierra 16 causas medidas — y deja la fase con la mitad de su
método sin ejecutar. Eso hay que decidirlo, no heredarlo.

# WR2.1 — Layout y superficie

> Auditoría de 20 componentes. 2026-07-31. **No se tocó código.**
>
> ⚠️ **PARCIAL, y hay que saber en qué.** Dos pasadas:
>
> - **Pasada 1 — estática.** Pasos 2 (MIDE) y 3 (CONTRASTA) sobre los `.css.ts`, el contrato de
>   tokens y el historial de git.
> - **Pasada 2 — sobre el DOM renderizado** (§1.b). Storybook estático servido + Playwright leyendo
>   `getComputedStyle` de los 20 componentes en los **cuatro temas**. Resuelve buena parte de lo que
>   la primera pasada había dejado en «No medido»: colores resueltos, relaciones de contraste entre
>   superficies y degradación por tema.
>
> **El paso 4 (Figma) sigue sin hacer**, así que §4 está vacía. Y la pasada 2 **no es mirar**: es
> medir el render. Un defecto de composición que solo se aprecia a ojo puede seguir escondido.

## 1. Resumen

Cada hallazgo se cuenta **una vez**, en el componente que lo origina; los transversales van aparte
para no inflar el recuento sumándolos en cada componente que tocan.

| Origen                            |     A |     B |     C | Hallazgo |
| --------------------------------- | ----: | ----: | ----: | -------- |
| `Paper`                           |     1 |     0 |     0 | A-1      |
| `Header`                          |     1 |     0 |     0 | A-3      |
| `AppShell`                        |     1 |     0 |     0 | A-4      |
| `Main`                            |     0 |     1 |     0 | B-4      |
| `AppShell` + `Main`               |     0 |     1 |     0 | B-2      |
| `AppShell` + `Header`             |     0 |     1 |     0 | B-3      |
| Transversal — escalera de sombras |     1 |     0 |     0 | A-2      |
| Transversal — criterio de borde   |     0 |     1 |     0 | B-1      |
| Lámina `Foundations/Surfaces`     |     0 |     1 |     0 | B-5      |
| **Total**                         | **4** | **5** | **0** | **9**    |

Sin hallazgos: `Box`, `Flex`, `Center`, `Group`, `Grid`, `SimpleGrid`, `Container`, `Scroll`,
`Space`, `AspectRatio`, `Divider`, `Section`, `Panel`, `Affix`, `Overlay`, `LoadingOverlay` — en las
magnitudes que este pase pudo medir (ver §6).

Los C están vacíos porque el paso 4 no se ejecutó, no porque el diseño no aporte nada.

## 1.b Segunda pasada: medición sobre el DOM renderizado

**Instrumento**: `storybook-static` servido en local + Playwright, leyendo `getComputedStyle` con el
tema forzado por `?globals=theme:<nombre>`. Sin capturas: solo valores resueltos. Los ratios son de
luminancia relativa (la fórmula de WCAG), que es la vara que usa `docs/06` §5.1–5.2.

### Superficies contra su fondo, por tema

| Elemento                                | nebula-dark | nebula-light | sober-light |   playful |
| --------------------------------------- | ----------: | -----------: | ----------: | --------: |
| `Paper` por defecto vs canvas           |   **1.000** |    **1.000** |   **1.000** | **1.000** |
| `AppShell` header/navbar/aside vs shell |       1.012 |        1.017 |       1.073 |     1.017 |
| `Paper` en la lámina `ElevationLadder`  |       1.062 |        1.062 |       1.114 |     1.062 |

Referencias de `docs/06`: el **escalón de interacción** (§5.1) es ~1.08 y el **separador de regiones**
(§5.2) busca ~1.3–1.4.

### `Header floating` condensado, por tema

|                                   | nebula-dark             | nebula-light            | sober-light                   | playful                 |
| --------------------------------- | ----------------------- | ----------------------- | ----------------------------- | ----------------------- |
| `background-color`                | `rgba(15,17,25,.66)`    | `rgba(255,255,255,.58)` | **`rgb(255,255,255)`** opaco  | `rgba(255,255,255,.58)` |
| `border`                          | `rgba(255,255,255,.12)` | `rgba(255,255,255,.28)` | **`rgb(216,219,222)`** sólido | `rgba(255,255,255,.28)` |
| `data-animated`                   | `true`                  | `true`                  | **`false`**                   | `true`                  |
| `border-radius` (`radius.lg`)     | 16 px                   | 16 px                   | 4 px                          | 20 px                   |
| `z-index`                         | 1100                    | 1100                    | 1100                          | 1100                    |
| `inset-block-start` · `max-width` | 12 px · 1180 px         | ídem                    | ídem                          | ídem                    |

**Verificado**: la degradación de ADR-059 funciona en los dos ejes a la vez. `sober-light` apaga el
cristal (fondo opaco, borde sólido) **y** la animación (`data-animated="false"`), sin que el estado
deje de cambiar. `radius.lg` es tematizable de verdad: 4 px en sober, 20 px en playful.

---

## 2. Hallazgos

### A-1 · `Paper` pinta la superficie del nivel 0 siendo el componente del nivel 1

- **Componente**: `Paper` · **Magnitud 3** (peso visual) · **Severidad A**
- **Valor medido**: `Paper.css.ts:14` → `background: fallbackVar(bg, vars.color.surface.base)`
- **Valor esperado**: `vars.color.surface.raised`. Lo dicen **tres fuentes independientes**:
  - `docs/06` §5, fila del nivel 1: «card/panel → `surface.raised` + border sutil». `Paper` es
    literalmente el «panel» de esa fila.
  - Su propio `Paper.md`: L3 («fondo `surface.raised`») y L9, que **cita el código** como
    `fallbackVar(bg, vars.color.surface.raised)`.
  - Su hermano `Card.css.ts:19`, mismo nivel de elevación: `fallbackVar(bg, vars.color.surface.raised)`.
- **Es una regresión, con commit**: `git log -S` sobre esa línea da dos commits. `a5eb683` (W2, capa
  Tier 1) la introdujo como `raised`; **`d08da37`** (2026-07-29, _«eje surface del campo y la familia
  de fecha — W3.1, ejecuta ADR-042/047/048»_) la cambió a `base`. El diff es exactamente
  `-raised / +base`. Ese commit iba del eje `surface` de los **campos de formulario**; `Paper` no
  aparece en ADR-042 ni en su descripción, y `Paper.md` no se actualizó.
- **Consecuencia para el usuario**: un `<Paper>` sin `variant` sobre el canvas de la página pinta
  **el mismo color que el canvas**. Como `withBorder` es `false` por defecto, la superficie que define
  el nivel 1 del sistema no se distingue del fondo. Y junto a un `Card`, que sí pinta `raised`, dos
  componentes que la especificación pone en el mismo peldaño se ven en peldaños distintos.
- **Confirmado sobre el render (§1.b), y no es «poco contraste» sino ninguno**: en las láminas
  `layout-paper--composition` y `layout-paper--with-border` el `background-color` computado de `Paper`
  es **idéntico al del `body`** en los cuatro temas —`rgb(6,8,15)` en dark, `rgb(255,255,255)` en
  light y playful, `rgb(246,247,248)` en sober— con **ratio 1.000**. La superficie no está atenuada:
  no existe.
- **Temas**: los cuatro. `surface.base` y `surface.raised` son roles distintos en los cuatro.
- **Token propuesto**: `vars.color.surface.raised`.

### A-2 · La escalera de sombras implementada no es la de `docs/06` §5

- **Componente**: transversal · **Magnitud 3** (peso visual) · **Severidad A**
- **Valores medidos** (`vars.shadow.*` en cada `.css.ts`):

  | Componente                            | Sombra real | Nivel §5           | Sombra que §5 pide |
  | ------------------------------------- | ----------- | ------------------ | ------------------ |
  | `AppShell` header/navbar/aside/footer | **ninguna** | 2 elevado/sticky   | `sm`               |
  | `Header` (`floating`, condensado)     | **`lg`**    | 2 elevado/sticky   | `sm`               |
  | `Popover`                             | **`lg`**    | 3 dropdown/popover | `md`               |
  | `Menu`                                | **`lg`**    | 3 dropdown/popover | `md`               |
  | `Dialog`                              | **`lg`**    | 3–4                | `md`/`lg`          |
  | `HoverCard`                           | **`lg`**    | 3                  | `md`               |
  | `Tooltip`                             | **`md`**    | 3                  | `md`               |
  | `Modal`                               | **`xxl`**   | 4 modal/drawer     | `lg`               |
  | `Drawer`                              | **ninguna** | 4 modal/drawer     | `lg`               |

- **Valor esperado**: la tabla de `docs/06` §5 — nivel 2 `sm`, nivel 3 `md`, nivel 4 `lg`.
- **Consecuencia para el usuario**: **cinco componentes de tres niveles distintos comparten `lg`**, así
  que la sombra deja de codificar elevación. Un header flotante, un menú desplegable y un diálogo
  pesan lo mismo. Y en los dos extremos la escalera se rompe al revés: `Drawer` —nivel 4— no tiene
  sombra ninguna, y `AppShell` —nivel 2— tampoco.
- **Temas**: los cuatro, con la salvedad de ADR-028: en dark el paso lo carga la superficie y el rim,
  no la sombra, así que el síntoma se ve sobre todo en `nebula-light` y `sober-light`.
- **Token propuesto**: no procede resolverlo aquí. Afecta a componentes de **tres familias**
  (WR2.1, WR2.5 y WR2.6), así que la decisión —¿corrige el código o se reescribe §5?— es de WR3. Lo
  que sí está medido es que **hoy no coinciden**.

### A-3 · `Header floating` usa la sombra del nivel 4 siendo nivel 2

- **Componente**: `Header` · **Magnitud 3** · **Severidad A**
- **Valor medido**: `Header.css.ts:139` → `boxShadow: vars.shadow.lg` en `&[data-scrolled='true']`
- **Valor esperado**: `vars.shadow.sm` (`docs/06` §5, nivel 2 «elemento elevado/sticky»).
- **Consecuencia**: una cabecera pegada al borde superior pesa lo mismo que un `Dialog` y que un
  `Menu` abierto. Cuando el menú se abre **desde** esa cabecera, las dos superficies se leen al mismo
  nivel y el desplegable no se despega de su origen.
- **Contexto**: es código de hoy (ADR-062, enmienda 1). No es deuda heredada: entró mal.
- **Temas**: los cuatro.
- **Token propuesto**: `vars.shadow.sm` si gana §5; `vars.shadow.md` si WR3 ratifica la escalera
  implementada, para quedar **un peldaño por debajo** de `Popover`/`Menu`, que es la relación que §5
  pide entre los niveles 2 y 3. Lo que no puede quedarse es igual que ellos.

### B-1 · Dos criterios de borde para el mismo nivel de elevación

- **Componentes**: `Paper`, `Card` vs `AppShell`, `Section`, `Panel` · **Magnitud 3** · **Severidad B**
- **Valores medidos**:
  - `Paper.css.ts:18` y `Card.css.ts:24` → `vars.color.border.default`
  - `AppShell.css.ts:40,56,75,100`, `Section.css.ts:18`, `Panel.css.ts:41` → `vars.color.border.subtle`
- **Valor esperado**: `docs/06` §5 dice «border **sutil**» tanto en el nivel 1 como en el 2.
- **Consecuencia**: la card se separa del fondo con un borde **más fuerte** que el que separa las
  regiones del shell que la contiene. El contenedor pesa menos que su contenido, que es el orden
  inverso al de §1 («agrupación» antes que «superficie y borde»).
- **Temas**: los cuatro; `border.default` y `border.subtle` son roles distintos en todos.
- **Token propuesto**: `vars.color.border.subtle` en `Paper` y `Card`, o escribir en §5 que el nivel 1
  usa `default` y el 2 `subtle`. Hoy la especificación dice una cosa y el código hace dos.

### B-2 · Dos sistemas de z-index conviviendo

- **Componentes**: `AppShell`, `Main` vs `Header`, `Popover`, `Menu`, `Tooltip`, `Toast` ·
  **Magnitud 1** (estructura) · **Severidad B**
- **Valores medidos**:
  - Escala del contrato (`tokens/layout.ts:61-70`): `base` 0 · `dropdown` 1000 · `sticky` 1100 ·
    `overlay` 1200 · `modal` 1300 · `popover` 1400 · `toast` 1500 · `tooltip` 1600.
  - La consumen: `Header` (`zIndex.sticky`), `Popover`, `Menu`, `Tooltip`, `Toast`.
  - **No la consumen**: `AppShell.css.ts:34` → `zIndex: 3`; `AppShell.css.ts:113` (skip-link) →
    `zIndex: 20`; `Main.css.ts:26,37,43,55,76,82` → `0,1,2,1,1,2`; `Main.css.ts:96` (skip-link) → `10`.
- **Consecuencia**: la mitad del apilamiento del catálogo no es tematizable. Un tema que recalibre
  `zIndex` mueve los overlays y deja el shell donde estaba. Y dentro de la propia familia hay dos
  cabeceras pegajosas con criterios incomparables: `AppShell` en `3` y `Header floating` en `1100`.
- **Temas**: los cuatro por igual (el defecto es de contrato, no de color).
- **Token propuesto**: `vars.zIndex.sticky` para las regiones sticky de `AppShell` y `Main`, y un
  peldaño acordado para los skip-link. `docs/06` **no habla de z-index**: ver §5 de este informe.

### B-3 · Las dos cabeceras del sistema no comparten criterio de elevación

- **Componentes**: `AppShell` (slot `header`) vs `Header` (`floating`) · **Magnitud 3** · **Severidad B**
- **Valores medidos**:
  - `AppShell.css.ts:37-40`: `paddingInline: space.md` · `background: surface.raised` ·
    `borderBlockEnd: 1px solid border.subtle` · **sin sombra** · `zIndex: 3`
  - `Header.css.ts:120-143` (`floating`, condensado): `paddingInline: space.md` ·
    `background: vars.glass.default` · `border: vars.glass.default.border` ·
    `borderRadius: radius.lg` · **`shadow.lg`** · `zIndex.sticky`
- **Consecuencia**: son la misma pieza conceptual —la cabecera de la aplicación— y una se apoya en
  superficie+borde sin sombra mientras la otra flota con cristal, radio grande y sombra de nivel 4.
  Puestas en la misma pantalla no se leen como dos variantes del mismo componente.
- **Lo que sí coincide, verificado**: el `paddingInline` es `space.md` en las dos, y el `Header` **no
  flotante** no declara `paddingInline` ninguno — así que dentro del slot de `AppShell` no hay doble
  padding. Eso está bien resuelto.
- **Token propuesto**: alinear la sombra (ver A-3). El cristal y el radio son deliberados del estado
  flotante y no compiten con el slot, que nunca flota.

### B-4 · `Main` no participa de la escalera de superficies de su propia familia

- **Componente**: `Main` · **Magnitud 3** · **Severidad B**
- **Valor medido**: `Main.css.ts` usa `surface.base` para el lienzo y `surface.raised` **solo** en el
  skip-link (L99). Sus slots `header` y `footer` (L45-49, L61-65 del `.tsx`) son `<div>` sin
  superficie propia.
- **Valor esperado**: `AppShell`, su hermano directo, pinta `surface.raised` + borde en las cuatro
  regiones equivalentes.
- **Consecuencia**: la misma composición —cabecera pegajosa sobre contenido— se ve con separación en
  `AppShell` y sin ninguna en `Main`. Con `stickyHeader`, el contenido pasa por debajo de una franja
  transparente.
- **Temas**: los cuatro.
- **Token propuesto**: `vars.color.surface.raised` + `border.subtle` en los slots de `Main`, o
  declarar en su `.md` que `Main` es deliberadamente neutro y la superficie la pone el consumidor.

### A-4 · Las regiones del shell no se separan por superficie, y tampoco por sombra

- **Componente**: `AppShell` · **Magnitud 3** · **Severidad A**
- **Valor medido (§1.b)**: relación de luminancia entre `AppShell` header/navbar/aside y el lienzo del
  shell — **1.012** en `nebula-dark`, **1.017** en `nebula-light`, **1.017** en `playful`, **1.073**
  en `sober-light`. Sin `box-shadow` en ninguno de los cuatro (A-2).
- **Valor esperado**: `docs/06` §5 dice, para dark, que **«el paso lo carga la superficie, no la
  sombra: negro sobre casi-negro no tiene recorrido»**. Medido: la superficie carga **1.012**, que es
  ~7 veces menos que el escalón de interacción de §5.1 (~1.08) — es decir, **la cabecera del shell se
  separa del lienzo menos que un botón en hover se separa de su fondo**.
- **Consecuencia para el usuario**: la separación entre la cabecera, la barra lateral y el contenido
  la sostiene **solo el borde de 1 px**. Sobre una pantalla grande, las tres regiones del shell se
  leen como una sola superficie con líneas encima; y en dark, que es el tema por defecto, es donde
  menos recorrido hay.
- **Temas**: los cuatro; `sober-light` (1.073) es el único que se acerca al escalón de §5.1, y sigue
  por debajo del separador de §5.2 (~1.3–1.4).
- **Token propuesto**: no lo resuelve un cambio local. O `surface.raised` se separa más de
  `surface.base` en el contrato, o el nivel 2 recupera su sombra `sm`. Es decisión de WR3 porque toca
  el tema, no el componente.

### B-5 · La lámina que verifica la escalera de elevación no ejerce ningún default

- **Componente**: `Foundations/Visual QA/Surfaces` · **Magnitud 1** (estructura) · **Severidad B**
- **Valor medido**: `FoundationsSurfaces.stories.tsx:50-56` pinta los cinco niveles con
  `<Paper withBorder={…} shadow={…} radius="md" p="lg" bg={step.surface}>` — **`bg` explícito en los
  cinco**. Medido en el render: ahí `Paper` sí contrasta (1.062 en tres temas, 1.114 en sober),
  mientras que en `layout-paper--composition` da 1.000.
- **Valor esperado**: `docs/06` §8 declara esta lámina como «`Surfaces`: niveles 0–4 en los cuatro
  temas» y §7 la convierte en el gate humano del sistema.
- **Consecuencia**: **la lámina que existe para detectar exactamente A-1 no puede detectarlo**, porque
  sustituye el default por un valor explícito antes de pintar. Es la razón de que una regresión de dos
  días en el primitivo de superficie haya pasado por un cierre de tramo con todos los gates en verde.
- **Segundo síntoma, mismo origen**: la tabla `levels` de esa lámina declara `shadow: xs/sm/md/lg`
  para los niveles 1/2/3/4 —**exactamente lo que dice §5**— mientras `Popover`, `Menu`, `Dialog` y
  `HoverCard` usan `lg` y `Modal` usa `xxl` (A-2). La lámina y los componentes que representa no
  coinciden, y nadie los cruza.
- **Temas**: los cuatro.
- **Token propuesto**: no es de token. La lámina necesita una fila que pinte cada primitivo **sin
  props de superficie**, que es como lo usa un consumidor que no ha leído `docs/06`.

---

## 3. Coherencia de familia

**El foco que WR2.1 tenía asignado partía de una premisa que la medición desmiente.** El prompt dice:
«si `Paper` y `Section` no comparten criterio de superficie+borde+sombra, todo lo que contengan
hereda la incoherencia». Medido: **`Section` no es una superficie**. No declara ni un
`vars.color.surface.*`; es un contenedor de ritmo (`gap: space.md`) con un divisor inferior opcional
(`border.subtle`). No compite con `Paper` y no puede discrepar de él.

La comparación que sí existe, y que sí discrepa, es otra: **`Paper` vs `Card` vs `AppShell` vs
`Main`** — los cuatro que sí pintan superficie.

|                     | Superficie        | Borde                  | Sombra             | z-index           |
| ------------------- | ----------------- | ---------------------- | ------------------ | ----------------- |
| `Paper`             | `surface.base` ⚠️ | `border.default`       | opt-in, 8 peldaños | —                 |
| `Card`              | `surface.raised`  | `border.default`       | opt-in, 8 peldaños | —                 |
| `AppShell` regiones | `surface.raised`  | `border.subtle`        | **ninguna**        | literal `3`       |
| `Main` slots        | **ninguna**       | **ninguno**            | ninguna            | literales `1`/`2` |
| `Header` flotante   | `glass.default`   | `glass.default.border` | `shadow.lg`        | `zIndex.sticky`   |

Ninguna columna es consistente de arriba abajo. Es el hallazgo de familia: **no hay un criterio único
de «esto es una superficie elevada» en la familia que define las superficies del sistema**, y las
otras siete heredan lo que decida cada cual.

Lo que sí está sano, y conviene dejar escrito para que nadie lo «arregle»:

- Los nueve primitivos sin superficie —`Box`, `Flex`, `Center`, `Group`, `Grid`, `SimpleGrid`,
  `Container`, `Space`, `AspectRatio`— no declaran color, borde ni sombra. Correcto: son geometría.
- `Divider` y `Scroll` usan roles de borde (`default`/`strong`) coherentes con su función de línea.
- `Overlay` deriva su tinte y su alfa de vars locales y ofrece `blur` en `sm/md/lg` sobre
  `vars.blur.*`: consume la escala del contrato, no literales.
- El padding del slot `header` no se duplica entre `AppShell` y `Header` (ver B-3).

---

## 4. Lo que el diseño resuelve y `docs/06` no dice

**Vacío, y no porque no haya nada.** El paso 4 del método —abrir las hojas de `.figma/` con
`tools/figma-measure/`— no se ejecutó en este pase. Las hojas de Polaris asignadas a esta familia
siguen sin medir. Cualquier C de layout y superficie está por descubrir.

---

## 5. Pendiente de arbitraje del diseño

Casos donde `docs/06` **calla** y los hermanos discrepan. No los resuelvo: son entrada de WR3.

1. **z-index.** `docs/06` no menciona el apilamiento en ninguna de sus nueve secciones, pero el
   contrato `NebulaTheme` sí tiene una escala de ocho peldaños. Mitad del catálogo la usa y mitad no
   (B-2). Falta decidir si la escala es normativa y, si lo es, qué peldaño le toca a un skip-link —
   que hoy son literales `10` y `20`.

2. **¿`Paper` sin `variant` debe pintar superficie o ser neutro?** A-1 lo trata como regresión porque
   tres fuentes dicen `raised`. Pero si el cambio de `d08da37` fue deliberado —dejar `Paper` neutro
   para que `<Paper bg="…">` no pelee con la clase base— entonces lo que falta es escribirlo, y
   `Card` es el que discrepa. Hoy no hay ADR ni nota que lo sostenga en ninguna de las dos
   direcciones.

3. **El tamaño del título no sigue a `order`.** `Header.css.ts:62` fija `font.size.h4` y
   `Section.css.ts:53` fija `font.size.h5`, sea cual sea el `order` que reciban; los seis niveles se
   ven idénticos dentro de cada uno. `Title`, en cambio, sí mapea `order` → tamaño. `docs/06` §2 dice
   que «la semántica HTML no se elige por apariencia» —que es la dirección contraria— pero **no dice
   si el tamaño debe seguir a `order`**. Dos componentes hacen una cosa y su primitivo tipográfico
   hace la otra.

4. **`Drawer` sin sombra.** Es nivel 4 y no declara ninguna (A-2). Puede ser deliberado —el backdrop
   ya separa, como dice §5— pero entonces `Modal`, que tiene el mismo backdrop, no debería llevar
   `xxl`. Uno de los dos sobra.

---

## 6. No medido

Esto es lo que este pase **no** puede afirmar. Es la sección más importante del informe.

| Qué                                                | Por qué                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`backdrop-filter`: no concluyente**              | El headless **neutraliza los filtros**: un `backdrop-filter: blur(16px) saturate(140%)` puesto inline computa a `blur(0px) saturate(1)`. `GlassSurface` se comporta igual que `Header`, así que **no es defecto de ningún componente**. Sí está verificado que la cadena de vars llega intacta: `--surfaceBackdrop` resuelve a `blur(16px) saturate(140%)`. **Si el cristal desenfoca de verdad, este instrumento no puede decirlo**: hace falta un navegador con GPU |
| **El paso 1 del método: MIRAR**                    | La pasada 2 **mide el render; no lo mira**. Nadie ha recorrido la familia a ojo en los cuatro temas. Lo que un `getComputedStyle` no delata —ritmo, alineación óptica, si una composición «se lee»— sigue sin cubrir                                                                                                                                                                                                                                                  |
| **El paso 4: Figma**                               | No se abrió ninguna hoja de `.figma/` ni se usó `tools/figma-measure/`. Por eso §4 está vacía                                                                                                                                                                                                                                                                                                                                                                         |
| ~~Valores resueltos por tema~~                     | **Resuelto en la pasada 2** (§1.b): colores, ratios de luminancia, radios, z-index y degradación de `sober` medidos en los cuatro temas                                                                                                                                                                                                                                                                                                                               |
| **El separador de §5.2 (~1.3–1.4)**                | Medido el escalón entre superficie de región y lienzo (A-4). La relación del **borde de 1 px** contra las dos superficies que separa —que es lo que §5.2 calibra— no se ha calculado                                                                                                                                                                                                                                                                                  |
| **Magnitud 4 (espaciado) en profundidad**          | Se inventariaron los `vars.space.*` de cada componente, pero no se comprobó la regla «dentro < entre» de §3 sobre composiciones reales, que es donde se ve                                                                                                                                                                                                                                                                                                            |
| **Magnitud 5 (tipografía)**                        | Fuera del hallazgo 3 de §5, no se auditó. Es el foco de WR2.2                                                                                                                                                                                                                                                                                                                                                                                                         |
| **`Panel`, `Affix`, `LoadingOverlay`**             | Sin superficie, borde ni sombra propios. Medido que no declaran nada; **no** medido cómo se ven en uso                                                                                                                                                                                                                                                                                                                                                                |
| **El estado `floating` de `Header` en movimiento** | Los dos estados están medidos (§1.b) y `sober` apaga la animación; pero **la transición entre ellos no se ha visto correr**, ni se ha medido con `prefers-reduced-motion` forzado                                                                                                                                                                                                                                                                                     |
| **Densidad `data-dense`**                          | No se probó en ningún componente de la familia                                                                                                                                                                                                                                                                                                                                                                                                                        |

**Lo que este informe sí sostiene**: los nueve hallazgos tienen valor medido —siete de ellos ahora
también sobre el render, en los cuatro temas—, valor esperado citado a fuente y consecuencia. Ninguno
es «se ve raro». **Lo que no sostiene**: que no haya más, y en particular nada de lo que solo se ve
mirando.

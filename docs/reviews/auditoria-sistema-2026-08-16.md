# Auditoría del sistema visual — 2026-08-16

> **Fase 1 de VA1** (`prompts/3-visual-audit/VA1-auditoria-visual-por-componente.md`): el sistema
> antes que las piezas. Se juzga la **base compartida** —paletas, roles, escalas, matriz de
> variantes, materiales y motion—, no los 158 componentes. Esos son la fase 2 y **no se han mirado**.
>
> **Checkpoint del propietario.** La fase 2 no se abre sin que esto se haya visto: cinco de los
> hallazgos de abajo mueven píxeles en todo el catálogo, y auditar componentes antes de decidirlos
> sería tirar el trabajo.
>
> **No se ha tocado código, ni tokens, ni docs, ni `apps/playground-web/__snapshots__/`.** El
> entregable es el juicio.

## Desenlace — 2026-08-17

**Los hallazgos de este informe siguen todos abiertos.** Lo que se propuso para cerrarlos se
construyó, se midió y **se descartó al verlo renderizado**:

| propuesta                                                                                         | cubría | qué pasó                                             |
| ------------------------------------------------------------------------------------------------- | ------ | ---------------------------------------------------- |
| [ADR-158](../adr/ADR-158-la-escalera-de-elevacion-vuelve-a-cumplir-su-escalon.md) escalera        | §2.2   | aplicada, aprobada al mirarla, **revertida después** |
| [ADR-159](../adr/ADR-159-el-borde-sale-de-la-rampa-neutra-y-no-de-la-del-lienzo.md) borde         | §2.1   | aplicada, **revertida**                              |
| [ADR-160](../adr/ADR-160-el-filo-del-cristal-tambien-sale-de-la-rampa-neutra.md) filo del cristal | §2.4   | aplicada, **revertida**                              |
| ADR-161 rampa cromática                                                                           | §2.3   | aplicada, **revertida y borrada**                    |

Las tres primeras llevaron el gate ampliado a **186/186 en los tres temas**, desde 53 rojos. El
motivo del descarte fue de aspecto, no de medida: **el conjunto se veía peor**. Los ADR quedan como
`rechazada` con sus números dentro, para que quien redescubra los defectos no repita el camino.

**El gate volvió a sus 165 pares**, así que §2.1 y §2.2 vuelven a no medirse: `border.default`,
`border.subtle` y la distancia entre superficies adyacentes **no las mira nadie otra vez**. Es la
única parte del desenlace que no es una preferencia de aspecto, y queda anotada aquí como deuda.

La fase 2 se abre igualmente, por decisión del propietario, sobre la base sin tocar.

### El alcance, fijado el 2026-08-17

**El color queda fuera de alcance; todo lo demás entra y es revisable.** La regla está en
[la rúbrica](rubrica-auditoria-visual.md) §0. Lo que se paró fue el **borde**: 6:1 es el mínimo que
SC 1.4.11 exige sobre la rampa actual, y al verlo arruinaba el diseño. La medida era correcta y el
resultado, peor.

Re-cortados los hallazgos por esa regla, **la mitad sigue viva**:

| Hallazgo                                               | Alcance                   | Estado                                                       |
| ------------------------------------------------------ | ------------------------- | ------------------------------------------------------------ |
| §2.1 campo sin frontera                                | **color** · fuera         | reportado, sin propuesta                                     |
| §2.2 escalera de elevación bajo el 1.08 de ADR-065     | **color** · fuera         | reportado, sin propuesta                                     |
| §2.3 `lift` aplasta siete paletas                      | **color** · fuera         | reportado, sin propuesta                                     |
| §2.4 seis niveles de cristal, dos materiales           | **mixto** · parte entra   | **el desenfoque es geometría, no color** — ver abajo         |
| §2.5 `gradient` y `glass` sin `color` **ni hover**     | **entra**                 | vivo: el hover no es un valor de color, es que no hay estado |
| §2.6 `leading.h1 = 1.0` se solapa al envolver          | **entra** · tipografía    | vivo                                                         |
| §3 escala, tipografía, radios, `corner`, `control.xxs` | **entra** · geometría     | vivas, 8 de 11                                               |
| §4 divergencias `docs/` ↔ código                       | **entra** · documentación | vivas las 11                                                 |

Dos precisiones que la regla nueva destapa, y que valen más que el resto:

- **§2.4 tiene una salida que no toca color.** El defecto medido es que el velo tapa el 78–90 % del
  fondo, así que subir el desenfoque de 1 a 16 px no se ve. **`effects.blur` es geometría**, y la
  escalera de cristal salta de 4 px a 12 px sin usar `blur.md` (8 px). Reordenar el desenfoque —o
  reconocer que los seis niveles son dos— se puede hacer **sin mover un solo color**.

- **§2.5 estaba mal clasificado por mí.** Lo llamé «ignoran la prop `color`», que suena a hallazgo de
  color, y la mitad grave no lo es: esas dos variantes **no tienen estado de hover en absoluto**
  (verificado en vivo, [familia Acciones](auditoria-visual-acciones-2026-08-17.md) §2.1). Eso es
  ausencia de feedback, no un tono mal elegido, y **entra de lleno**.

## 0. Qué se hizo, y por qué así

`docs/wr-closure.md` dejó escrito que **el paso 1 del método —MIRAR— no se hizo en ninguna de las
ocho familias**: todas midieron el render, ninguna lo miró. Esta fase hace eso, en el nivel del
sistema.

Método: se volcó el estado real desde el `dist` compilado —no desde los docs— de
`@stellaria/nebula-tokens`, `@stellaria/nebula-themes` y el `ResolveVariant` y el contrato reales de
`@stellaria/nebula-web`; se renderizaron **siete láminas** con esos valores; y se miraron. Los temas
de producto se reconstruyeron replicando `BuildProduct` de `packages/demos`.

Las láminas y los scripts que las regeneran están en el scratchpad de la sesión
(`…/scratchpad/board{1..7}.png`, `dump.mjs`, `board.mjs`, `board2.mjs`, `analyse.mjs`). Todo número
citado abajo es reproducible con ellos; el informe se sostiene sin las imágenes.

La rúbrica que gobierna esto y que la fase 2 recibe literal está en
[`rubrica-auditoria-visual.md`](rubrica-auditoria-visual.md), ya en el repo.

## 1. Veredicto de la fase

**Los huesos del sistema están sanos y su argumento se sostiene.** La identidad cromática es
coherente, la escala de motion es la única escala del sistema que es una progresión limpia y
verificada, el suelo de tinta de ADR-132 hace exactamente lo que dice, y —el más importante— **la
tesis central de la librería es visiblemente cierta**: 20 temas sobre la misma composición dan 20
productos distintos y ninguno se rompe. Eso no es poco y conviene decirlo antes que lo demás.

**Pero hay un fallo de accesibilidad por el camino por defecto y una regla cerrada que el código no
implementa**, y los dos son de catálogo, no de componente:

- **Un campo de texto dentro de una `Card` no tiene frontera visible en ninguno de los dos temas
  oficiales** (§2.1). Ni su relleno ni su borde llegan al 3:1 que WCAG 2.2 SC 1.4.11 exige y que
  `docs/03` declara como contrato. Afecta a los 27 campos.
- **La escalera de elevación de ADR-065 —escalón mínimo 1.08— no está implementada** (§2.2). En
  `light` fallan **los tres** escalones (1.026 · 1.035 · 1.045); en `dark` fallan dos de tres. Se
  implementó bien en `051aa65` y **ADR-088 la revirtió**, sin que ningún gate lo viera.

Los dos comparten causa: **ningún gate mide la distancia entre dos superficies adyacentes ni entre
un borde y su superficie.** `check:contrast` mide `border.strong` y `border.focus`, y no mide
`border.default` ni `border.subtle`, que son precisamente los que fallan.

**Recomendación para el checkpoint: no abrir la fase 2 todavía.** Los hallazgos §2.1, §2.2 y §2.3
cambian el aspecto de todo el catálogo. Auditar 158 componentes contra una base que va a moverse
produce 158 síntomas de tres causas.

**Sobre ADR-037**: la declaración de «aspecto estable» corresponde a la fase 2 y **no se emite
aquí**. Lo que esta fase sí puede decir es que **hoy no procede emitirla**: el baseline guardaría una
escalera de elevación que contradice una decisión aceptada y un campo que no cumple AA.

---

## 2. Fallos

Ordenados por gravedad. Cada uno con la regla que incumple y la medida.

### 2.1 · CRÍTICO — El campo de texto no tiene frontera visible

**Qué se ve** — en la lámina de los 20 temas, el campo «Buscar cliente…» de las diez fichas oscuras
es texto flotando: no se distingue ninguna caja. En las claras se intuye apenas.

**Regla** — WCAG 2.2 **SC 1.4.11 Non-text Contrast**, 3:1 para «información visual necesaria para
identificar componentes de interfaz». `docs/03` §preámbulo declara **WCAG 2.2 AA estricto**, así que
esto es contrato, no heurística externa. `theme-a11y-motion` lo repite.

**Medida** — `styles/field.css.ts:182` fija `surface: "outline"` como defecto de los 27 campos, y
`:137` pinta su borde con `vars.color.border.default`. Un campo sobre una `Card` (`Paper` usa
`surface.raised`):

| tema    | borde vs la card              | relleno del campo vs la card | ¿algo llega a 3:1? |
| ------- | ----------------------------- | ---------------------------- | ------------------ |
| `dark`  | **1.00** (mismo color exacto) | 1.052                        | **no**             |
| `light` | **1.083**                     | 1.026                        | **no**             |

En `dark`, `border.default` y `surface.raised` son literalmente el mismo hex, `#20222c`. El campo se
identifica solo al pasar el ratón, porque `bdHover` sí usa `border.strong` (3.48:1). **Está al
revés**: la frontera aparece cuando ya has encontrado el campo.

**Por qué ningún gate lo vio** — `tools/contrast-check/src/pairs.ts` mide `border.strong` y
`border.focus` contra las superficies, y **no mide `border.default` ni `border.subtle`**. Los dos
roles que fallan son los dos que no se miran. Es el mismo patrón que ADR-132 §4 nombró: «un gate que
mide algo distinto de lo que el runtime pinta no mide nada».

**Alcance** — catálogo: 27 campos, y por herencia `Select`, `Combobox`, `MultiSelect`, `DatePicker`,
`SearchInput` y la cadena de fechas.

**Refutación intentada** — ¿lo salva el relleno, si el borde no? No: el relleno del campo es
`surface.base` y sobre una card (`raised`) da 1.026/1.052. ¿Y si el campo está sobre `base` y no
sobre una card? Entonces el relleno es idéntico al fondo (ratio 1.000) y solo queda el borde, que es
lo que falla. Las dos composiciones fallan, por motivos distintos.

---

### 2.2 · ALTO — La escalera de elevación de ADR-065 no está implementada, y se revirtió

**Regla** — **ADR-065 §1**: «El escalón mínimo entre niveles adyacentes es **1.08**», justificada en
una frase que el propio ADR destaca: _«un escalón de elevación nunca separa menos que un escalón de
hover»_. `docs/06` §5 la recoge y la da por **«implementado en B3»**, con una tabla que dice estar
**«verificada sobre el render»**.

**Medida** — relación de luminancia entre superficies adyacentes, hoy:

| tema    | escalones consecutivos                                                         | ¿cumple?   |
| ------- | ------------------------------------------------------------------------------ | ---------- |
| `dark`  | overlay→base **1.094** ✓ · base→raised **1.052** ✗ · raised→sunken **1.078** ✗ | 1 de 3     |
| `light` | sunken→raised **1.045** ✗ · raised→base **1.026** ✗ · base→overlay **1.035** ✗ | **0 de 3** |

**En `light` no cumple ni un solo par.** Y el escalón de hover que `docs/06` §5.1 fija en ~1.08 vale
**1.052** en dark y **1.026** en light, porque `surface.hover` es el mismo valor que `surface.raised`.

**La historia, trazada en git** — no es que nunca se hiciera. Se hizo:

| commit    | qué hizo con la rampa de `light`                                                                                     |
| --------- | -------------------------------------------------------------------------------------------------------------------- |
| `051aa65` | «la escalera de elevación, al segundo intento (ADR-065 / B3)» → `sunken` 800, `base` 600, `raised` 400, `overlay` 50 |
| `88ab398` | «el activo también recibe hover (ADR-088)» → `base` 200, `raised` **300**, `sunken` **400**                          |

La rampa de `051aa65` es **exactamente la tabla que `docs/06` §5 sigue publicando**, y medida
**cumple**: 1.108 · 1.084 · 1.110. La actual no. Un ADR sobre el estado `active` reescribió el bloque
de superficies entero y aplanó la elevación de paso.

**Y hay un segundo desajuste dentro del mismo ADR**: ADR-088 §«La escalera del tema claro, de paso»
decide `raised` = `light.400` y `sunken` = `light.600`. **El código tiene `light.300` y `light.400`**
— un peldaño corto en uno y dos en el otro. Ni siquiera la rampa que ADR-088 decidió llega a 1.08
(da 1.035 · 1.072 · 1.084), pero la que se implementó está aún más comprimida.

**La paleta no es la limitación**: `light` recorre 1.527 de extremo a extremo y la rampa actual usa
**1.11**. El sitio está; no se está usando.

**Alcance** — catálogo entero. Es lo que hace que en la lámina de roles las tarjetas `base`,
`raised`, `hover` y `disabled` se vean como la misma superficie.

**Nota separada, y a favor del código**: el _orden_ de las superficies en `dark` —`overlay` al fondo,
`sunken` como el peldaño más claro— **no es un fallo**. Parecía inversión semántica y no lo es:
**ADR-100** lo decide explícitamente y explica por qué (el `overlay` es el lienzo del shell, y el
cristal necesita un fondo del que distinguirse). Se comprobó y se descarta.

---

### 2.3 · ALTO — El tramo claro de las paletas está comprimido, y `lift` abre un acantilado

**Qué se ve** — en la lámina de paletas, `yellow.50` y `yellow.100` son **el mismo amarillo**
(L\* 97 y 97). En `yellow`, `gold`, `orange` y `lime`, los peldaños 50–300 son casi indistinguibles
y luego 500→600 cae en vertical: el amarillo brillante se convierte en oliva de un salto.

**Regla** — ADR-009 fija la escala 50–950 en OKLCH, cuyo propósito declarado es la **uniformidad
perceptual**; `tokens-governance` exige que las paletas se generen y no se editen. No hay regla que
fije una tolerancia, así que esto se reporta contra el propósito de OKLCH, citado.

**Medida** — ΔL\* entre peldaños consecutivos. `rango` = el mayor dividido por el menor; en una rampa
perceptualmente pareja valdría ~1:

| paleta                   | `lift` de la semilla | ΔL\* menor | ΔL\* mayor | rango     |
| ------------------------ | -------------------- | ---------- | ---------- | --------- |
| `yellow`                 | 0.17                 | **0.8**    | 25.1       | **×31.4** |
| `gold`                   | 0.13                 | 1.5        | 22.4       | ×14.9     |
| `orange`                 | 0.12                 | 1.6        | 21.7       | ×13.6     |
| `lime`                   | 0.12                 | 1.8        | 21.7       | ×12.1     |
| `teal`                   | 0.05                 | 2.7        | 17.4       | ×6.4      |
| `pink`                   | 0.03                 | 3.0        | 15.9       | ×5.3      |
| sin `lift` (10 familias) | 0                    | ~3.5       | ~12.1      | **×3.5**  |

La correlación con `lift` (`tools/palette-gen/src/seeds.ts`) es monótona y exacta: **el parámetro que
sube el tramo medio es el que aplasta el tramo claro y abre el acantilado**.

**Y hay un segundo efecto que alcanza a las 17 familias cromáticas, no solo a las 7 con `lift`**: la
rampa base reparte 8 puntos de L\* entre `50`, `100` y `200`, y **12 en un solo salto** de `300` a
`400`. Tres peldaños de tinte cubren menos recorrido perceptual que un peldaño del medio. Los tintes
son justo lo que consume la variante `light`, los badges suaves y los fondos de hover.

**Las dos paletas que sostienen todas las superficies son las de menos recorrido**: `light` abarca
**14 puntos** de L\* en once peldaños y `dark` **19**, contra los ~73 de cualquier cromática. Es la
causa material de §2.2: se les pide expresar elevación a las dos rampas con menos sitio para
expresarla.

**Alcance** — catálogo. Cualquier componente que use un tinte de una familia clara.

---

### 2.4 · MEDIO — Seis niveles de cristal, dos materiales

**Qué se ve** — en la lámina de cristal, `band`, `control`, `subtle`, `default` y `strong` son **el
mismo panel**. Solo `veil` se lee como material translúcido.

**Regla** — `docs/02` §2 afirma: _«Lo que separa un nivel de otro es **el desenfoque, no el velo**»_.

**Medida** — cuánto del fondo transmite cada nivel (distancia RGB entre el panel compuesto sobre
blanco y sobre negro; 441 = transparente, 0 = opaco):

| nivel     | velo | desenfoque | deja ver |
| --------- | ---- | ---------- | -------- |
| `veil`    | 0.05 | 1 px       | **95 %** |
| `band`    | 0.78 | 1 px       | 22 %     |
| `control` | 0.81 | 2 px       | 19 %     |
| `subtle`  | 0.84 | 4 px       | 16 %     |
| `default` | 0.87 | 12 px      | 13 %     |
| `strong`  | 0.90 | 16 px      | 10 %     |

**La afirmación del doc está invertida.** Lo que varía el resultado es el velo (22 % → 10 %, factor
2.2); el desenfoque nominalmente varía ×16 pero **opera sobre un canal ya suprimido al 10–22 %**.
Desenfocar lo que está tapado al 90 % no se ve. Además `veil` y `band` comparten el mismo 1 px, así
que **el único par que el doc podría explicar por desenfoque se separa exclusivamente por velo**.

**Dos divergencias más en el mismo sitio**: `docs/02` §2 dice **«5 niveles (ADR-078)»** y hay **6**;
y ADR-118 describe el velo como opaco _«—0.78 a 0.90—»_, rango que `veil` (0.05 / 0.30) no habita.

**Y un choque con la skill del repo**: `effects-guardrails` fija el desenfoque operativo máximo
recomendado en **`md` (8 px)** para superficies comunes. `default` usa 12 px y `strong` 16 px, y
`default` es, por nombre, la superficie común. Ninguna receta de cristal usa `blur.md`: la escalera
salta de 4 px a 12 px.

---

### 2.5 · MEDIO — Dos de las siete variantes ignoran el color

**Qué se ve** — al poner las 49 celdas juntas (lo que ninguna vista de componente permite), la fila
`gradient` es **el mismo indigo→violeta siete veces**, y la fila `glass` es **el mismo panel siete
veces**.

**Regla** — Nielsen, _consistencia y estándares_: `color` es una prop uniforme del catálogo y en dos
de siete variantes no hace nada, sin que nada lo anuncie. Y WCAG **SC 1.4.1**, en el caso que importa:
`<Button color="error" variant="gradient">` pierde **por completo** su señal de peligro y queda
idéntico a `color="success"`.

**Medida** — `variantMap.gradient` resuelve `background: "gradient.brand"` y `variantMap.glass`
resuelve `surface.overlay` / `text.primary` / `border.subtle`. Ninguno de esos cuatro caminos depende
de la escala. De las 49 celdas que ADR-150 precalcula, **14 son dos apariencias repetidas 7 veces**.

**No es necesariamente un fallo de diseño** —una variante de marca que ignore el color es
defendible— **pero hoy no está dicho en ninguna parte**, y `docs/02` §2 punto 3 vende justo lo
contrario: que el `variantMap` hace temable el significado visual de cada variante.

---

### 2.6 · MEDIO — `h1` con `leading: 1.0` se solapa en cuanto envuelve

**Qué se ve** — en el espécimen, la caja de línea de `h1` mide exactamente 48 px con una fuente de
48 px: los descendentes (la «p» de «Grumpy») salen de la caja.

**Regla** — principio tipográfico establecido: el interlineado no baja de la altura real del glifo
(ascendente + descendente, ~1.2 em en cualquier fuente de texto). Con `1.0` **las líneas se pisan**.

**Medida** — `packages/tokens/src/tokens/typography.ts:24` — `leading.h1 = 1.0`. Un `h1` de 48 px
envuelve en cuanto el carril baja de ~360 px, que es el primer breakpoint que la fase 2 debe probar.
`h2` (1.05) y `h3` (1.1) están en el mismo territorio.

**Limitación declarada**: el espécimen se rindió con Segoe UI, no con Geist. La conclusión es
geométrica y no depende de la fuente —ninguna fuente de texto cabe en 1.0 em—, pero **la magnitud
exacta del solape en Geist no se ha medido**.

---

## 3. Observaciones

Preferencias y deuda sin efecto visible hoy. **No son fallos.**

- **El fondo de la escala de cuerpo tiene cuatro nombres y unos dos tamaños perceptibles.**
  `body2` 14 · `body3` 13 · `button` 14 · `caption` 12. `button` **duplica exactamente** a `body2`, y
  13 contra 14 no es una distinción que sobreviva a una composición. Lo corrobora el propio
  `wr-closure.md`: T5 «arregló» `Spoiler` moviéndolo de `body3` a `button` — un cambio de **1 px**.

- **No hay ritmo vertical, y probablemente no hace falta que lo haya** — pero conviene decidirlo. De
  once cajas de línea, **solo `h1` cae en la rejilla de 4**; el resto son fraccionarias (35.2, 32.2,
  28.8, 25.6, 21.7, 19.5, 16.8, 17.4). _Efecto colateral que sí importa_: las cajas fraccionarias
  colocan el texto en subpíxel, y eso **amplifica la deriva entre los dos baselines visuales**
  (`win32` y `linux`) que `docs/03` §4.1 tiene sin reconciliar.

- **La escala tipográfica no es una razón**: 1.20 · 1.25 · 1.14 · 1.17 · 1.20 · 1.25 · 1.14 · 1.08.
  Oscila en vez de progresar. Es una rejilla de 4 px desde 16 arriba, que es una decisión legítima —
  pero entonces es una rejilla, no una escala modular, y ningún doc lo dice.

- **`space.sm` y `space.u3` son el mismo valor (12 px).** ADR-045 creó `u3` precisamente porque no
  había nada entre `sm` (8) y `md` (16); ADR-092 movió `sm` **encima de `u3`**. La regla de ADR-045
  §4 —tallas para layout, múltiplos para densidad de control— hoy obliga a elegir entre dos nombres
  para el mismo píxel. `tokens-governance` lo llama anti-patrón («sin aliases redundantes»).
  Uso medido: `space.sm` 155 · `space.u3` 10 · **`space.u3_5` 0**.

- **En toda la escala de espaciado no existe el peldaño de 8 px.** Con `unit = 4`, el multiplicador
  2 no está en ninguno de los 14 miembros: 0 · 2 · 4 · 6 · 10 · 12 · 14 · 16 · 20 · 22 · 28 · 38 · 50.
  ADR-092 lo asumió sin nombrarlo al declarar que los medios pasos cubren el hueco `xs → sm`.

- **`radius.none` y `radius.xxs` son ambos 0**, y la escala perdió su principio: ADR-046 la re-fasó
  a **múltiplos de 4** y ADR-072 movió `sm` a **9** y `xxl` a **32** sin citar a ADR-046. Hoy es
  0 · 0 · 4 · 9 · 12 · 16 · 20 · 32: pasos +4 · +5 · +3 · +4 · +4 · **+12**.

- **`corner: "sharp"` pone `radius.full = 0`**, así que en ese modo los avatares dejan de ser
  círculos y las píldoras dejan de ser píldoras (visible en la lámina de geometría). `round` conserva
  `full: 9999`. Puede ser deliberado; no está escrito.

- **`sizes.control.xxs` vale 20 px, por debajo del mínimo de 24 px** que `docs/03` §1 regla 3 declara
  (WCAG 2.5.8). **Hoy no lo consume ningún componente** —`Segment.md` documenta haberlo evitado a
  propósito—, así que es deuda de contrato, no un fallo alcanzable. Merece una nota en el contrato
  antes de que alguien lo use.

- **`ColorExtended` alcanza seis paletas cuyo relleno queda por debajo de AA.** Con `ink.floor = 2`,
  `OnColor` da tinta **blanca** sobre: `pink` 3.48 · `cyan` 2.78 · `teal` 2.71 · `orange` 2.35 ·
  `gold` 2.18 · `lime` 2.13. ADR-132 decidió el suelo 2 midiendo **las 7 escalas semánticas** y
  concluyó 0/30 FAIL, lo cual es correcto: **las otras 12 paletas semilla no entraron en esa
  medición**, y `docs/02` §2.1 las declara camino público. La decisión de ADR-132 no se discute; lo
  que se señala es que su base de medida no cubre toda la superficie que el API expone.

- **Los temas de producto llevan `ink.floor: 1`**, más permisivo aún que el de los oficiales. Se ve
  en la lámina: los botones primarios de `star` y `lagrange` llevan blanco sobre oro y naranja.
  ADR-132 §1 lo declara y lo exime («son demostración, no contrato»), y es defendible para v1 — pero
  son los que el sitio enseña.

- **`BuildProduct` no toca `effects.glass`**, así que los 9 productos comparten el filo neutro de
  nebula (`#e9e9ea` / `#23252c`). En `rosette-light`, sobre lienzo rosado, el filo del panel es gris.
  Es sutil y puede ser aceptable; queda anotado porque es lo único que no se retiñe.

- **Lo que sí está bien y conviene no tocar** — se comprobó y sale limpio:
  - **Motion es la única escala del sistema que es una progresión limpia**: 80 · 120 · 180 · 280 ·
    420 ms, razón ×1.5 constante. Y los tres springs son exactamente lo que `docs/03` §2 dice:
    ζ = 1.016 · 0.837 · 0.684, con sobreimpulso real 0 % · 0.8 % · 5.3 %. **El doc acierta.**
  - **El paso 500 está anclado al contraste** con precisión notable (ADR-084): las familias de tinta
    clara caen en 4.50–4.56 contra blanco, justo el filo de AA. Es ingeniería fina.
  - **Las sombras de `dark` no son un descuido**: `themes/shadows.md` documenta que negro sobre
    casi-negro no tiene recorrido y que el cue es el _rim_, y que en dark se perciben tres escalones y
    no cinco. El código hace lo que el doc dice.
  - **Todo el texto semántico pasa AA con holgura** sobre las seis superficies, en los dos temas
    (`primary` 13.7–17.0 · `secondary` 8.4–13.1 · `muted` 5.5–10.5).
  - **La tesis del theming se sostiene visualmente.** 20 temas, una composición, ninguno roto.

---

## 4. Divergencias `docs/` ↔ código

El código manda sobre la realidad; el doc cerrado manda sobre la decisión. Aquí van los sitios donde
**el doc describe algo que el código ya no es**. Ninguno se ha corregido: cambiarlos exige ADR.

| Doc          | Dice                                                | El código tiene                      | Sancionado por        |
| ------------ | --------------------------------------------------- | ------------------------------------ | --------------------- |
| `docs/02` §2 | `radius sm:8, xxl:28` «múltiplos de 4»              | `sm: 9`, `xxl: 32`                   | ADR-072 (no cita 046) |
| `docs/02` §2 | `control {16,24,32,40,48,56,64}`                    | `{20,28,36,44,52,60,68}`             | ADR-099               |
| `docs/02` §2 | glass «5 niveles»                                   | **6**                                | — sin ADR             |
| `docs/02` §2 | «lo separa el desenfoque, no el velo»               | lo separa el velo (§2.4)             | — contradicho         |
| `docs/02` §3 | «Los **ocho** temas de producto»                    | **9** (entró `star`)                 | — sin ADR             |
| `docs/03` §2 | `duration instant(0) base(200) slow(320) expr(500)` | `80 · 180 · 280 · 420`               | — sin ADR             |
| `docs/06` §5 | tabla de superficies «verificada sobre el render»   | es la columna **«antes»** de ADR-100 | ADR-100 / ADR-088     |
| `docs/06` §5 | escalón ≥1.08 «implementado en B3»                  | 1.026–1.078 (§2.2)                   | — **revertido**       |
| ADR-045      | tabla `sm:8 md:16 lg:24 xl:32 xxl:48 xxxl:64`       | `12 · 16 · 22 · 28 · 38 · 50`        | ADR-092               |
| ADR-045 §3   | «Ningún miembro existente cambia de valor»          | cinco cambiaron                      | ADR-092               |
| ADR-088      | `raised: light.400`, `sunken: light.600`            | `light.300`, `light.400`             | — **sin implementar** |

`docs/03` §2 merece una nota aparte: dice `duration.instant = 0`, y el código vale **80 ms**.
`Stagger` deriva su paso de ese token (`utils/motion.ts:130`) con tope de 8, así que el último
elemento de una lista arranca **640 ms** después del primero — mientras `docs/03` §2 regla 5 justifica
ese tope precisamente «para que una lista larga no encadene un retardo perceptible». Con el número
del doc el razonamiento se sostiene; con el del código, no.

---

## 5. Lo que NO se pudo juzgar

Huecos declarados, no rellenados:

- **Los 158 componentes.** Es la fase 2 y está bloqueada por este checkpoint. Nada de este informe
  dice si un componente concreto se ve bien.
- **Motion en movimiento.** Esta fase midió los tokens (duraciones, curvas, springs) pero **no vio
  una sola animación correr**. El hueco prioritario que el prompt nombra —`StarField`,
  `GradientBorder` con `beam`, `AnimatedGradient`, `Loader`, `Segment` con y sin `lazy`, `Reveal`,
  `Transition`— sigue **entero**. Las curvas de la lámina 7 salieron mal por un fallo mío al dibujar
  el Bézier y no se usaron para juzgar; lo que se afirma de motion sale de los números, no de ellas.
- **Geist.** Las láminas se rindieron con Segoe UI. Todo juicio de _tamaño, interlineado y razón_ es
  independiente de la fuente; ningún juicio de _forma, color de párrafo o legibilidad real_ se ha
  emitido, y no debe leerse ninguno.
- **Responsive.** Esta fase no probó 360/768/1280. Es de la fase 2.
- **Figma.** `WR1.2b` nunca se ejecutó y sigue sin ejecutarse: no hay contraste contra el diseño de
  referencia, así que los cero hallazgos de clase C de WR siguen siendo cero por falta de fuente, no
  por ausencia de problema.
- **Native.** Fuera de alcance.
- **`hover`, `active`, `focus-visible` y `loading` por componente.** `wr-closure.md` los declaró sin
  verificar y siguen sin verificar; aquí solo se midió el _token_ de hover, no su aplicación.

---

## 6. Qué propondría, y qué ADR pediría

No se ha cambiado nada. Esto es la propuesta para el checkpoint, en el orden en que la haría:

1. **Añadir a `tools/contrast-check/src/pairs.ts` los pares que faltan**: `border.default` y
   `border.subtle` contra las seis superficies, y **la distancia entre superficies adyacentes**
   contra el 1.08 de ADR-065. Es lo único que convierte §2.1 y §2.2 en algo que no puede volver a
   pasar. **Sin ADR** —es ampliar la cobertura de un gate, no cambiar contrato— y debería ir primero,
   porque el gate rojo es el que dice cuándo el resto está arreglado.

2. **ADR: restituir la escalera de elevación.** Debe decidir las tres cosas juntas, porque ADR-065,
   ADR-088 y ADR-100 hoy no se reconcilian: (a) si el mínimo sigue siendo 1.08; (b) qué peldaños usan
   los dos temas —la rampa de `051aa65` cumple y está medida—; (c) que `surface.hover` deje de ser
   el mismo valor que `surface.raised`. Enmienda `docs/06` §5 en el mismo PR.

3. **ADR: el borde por defecto tiene que verse.** Sale casi gratis del punto 2 si las superficies se
   separan, pero conviene decidirlo aparte porque afecta a `border.subtle`/`default`/`strong` como
   familia y toca los 27 campos.

4. **Revisar `lift` en `tools/palette-gen/src/seeds.ts`** para las siete familias afectadas, y de
   paso el reparto del tramo 50–300 de la curva base. Es regeneración de paletas: mecánica, pero
   mueve el catálogo entero, así que va **antes** de la fase 2 o **mucho después**, nunca en medio.

5. **Decisiones baratas, sin ADR**, que solo piden que alguien las tome: `leading.h1`; si `body3` y
   `button` siguen existiendo; si `gradient` y `glass` deben ignorar el color (y decirlo); y el
   desenfoque de `default`/`strong` contra `effects-guardrails`.

6. **Poner al día los docs de §4 en un solo PR de saneamiento.** La mayoría son sancionados por un
   ADR posterior que nadie propagó; no requieren decisión nueva, solo que el doc deje de contradecir
   al código.

---

## 7. Deuda que este informe deja anotada

- **`docs/06-visual-language.md` es vinculante y el prompt de VA1 no lo lista.** Es donde viven el
  ritmo, la densidad, la elevación y el effects budget, y es el doc con más divergencias (§4). La
  fase 2 debe leerlo, y la rúbrica ya lo incorpora.
- **Ningún gate mide geometría relacional** —distancia entre superficies, entre borde y superficie,
  entre dos peldaños de una escala—. Los diez gates de `docs/03` §4 verifican propiedades absolutas
  y el gate 8 verifica que nada se movió. Ninguno verifica que dos cosas estén suficientemente
  separadas, que es la clase a la que pertenecen §2.1, §2.2 y §2.3.

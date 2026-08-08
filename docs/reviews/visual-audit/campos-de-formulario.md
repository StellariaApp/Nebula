# WR2.4 — Campos de formulario

> Auditoría de 27 componentes. 2026-07-31. **No se tocó código.**
>
> Dos pasadas: estática sobre los `.css.ts` y sobre el DOM renderizado (Storybook estático +
> Playwright, `getComputedStyle` y `getBoundingClientRect`), en tres temas —`nebula-dark`,
> los dos temas oficiales— porque `nebula-light` comparte escalas con `nebula-dark` y lo que aquí se
> mide son geometrías, no colores.
>
> **Sin paso 4 (Figma)**: §4 vacía. Cobertura real: **9 de 27** con medida de render. Ver §6.

## 1. Resumen

| Origen                                 |     A |     B |     C | Hallazgo |
| -------------------------------------- | ----: | ----: | ----: | -------- |
| `Rating`                               |     1 |     0 |     0 | A-1      |
| `Slider` / `RangeSlider`               |     1 |     0 |     0 | A-2      |
| `FormField`                            |     1 |     0 |     0 | A-3      |
| Transversal — cuatro escalas de «size» |     0 |     1 |     0 | B-1      |
| **Total**                              | **3** | **1** | **0** | **4**    |

**El foco de esta familia predijo mal, y conviene decirlo.** El prompt daba por hecho que la altura
sería «el hallazgo más probable». Medida, es justo lo contrario: **el recipe `field` compartido es lo
más sólido del catálogo** (§3). Los defectos están en los tres controles que **no** pasan por él.

---

## 2. Hallazgos

### A-1 · `Rating` es interactivo y se dimensiona con la escala que tiene prohibido usar

- **Componente**: `Rating` · **Magnitud 4** · **Severidad A**
- **Valores medidos** (`inputs-pickers--sizes`, altura y ancho del `<button>` de cada estrella):
  **20 / 24 / 28 / 32 / 36 px** para `xs…xl` — idénticos en los tres temas.
- **Origen en el código**: `Rating.css.ts:67-71` toma `vars.size.compact.xs…xl`. Y el elemento medido
  es interactivo sin ambigüedad: `Rating.tsx:154-157` renderiza un `<button type="button"
role="radio">` por estrella, dentro de un `role="radiogroup"`.
- **Valor esperado**: `docs/06` §4.1 lo prohíbe con nombre y apellidos —
  «`compact` no satisface el mínimo táctil de 44 pt de native por definición. **Lo que la consuma no
  puede ser interactivo**; Badge lo cumple» — y §4.1 insiste: «**Lo interactivo va en `control`**,
  aunque parezca compacto».
- **Segundo incumplimiento, en la misma medida**: `docs/06` §4 fija «WCAG 2.2: **24 px CSS mínimo en
  web**». `Rating xs` mide **20 px**: por debajo. `sm` queda justo en 24.
- **Consecuencia para el usuario**: las estrellas de una valoración son el control con el objetivo más
  pequeño del catálogo. En `xs` no alcanzan el mínimo de WCAG en web, y como la fila es `WN`, en
  native el mismo contrato daría objetivos de 20 pt contra un mínimo de 44.
- **Temas**: los tres medidos, con valores idénticos.
- **Token propuesto**: `vars.size.control.*`, con la estrella dibujada dentro a la proporción que se
  quiera — que es exactamente lo que hace `Checkbox` (§3).

### A-2 · `Slider` escribe pista y pulgar en literales, y el pulgar es el objetivo táctil

- **Componente**: `Slider` y `RangeSlider` · **Magnitud 4** · **Severidad A**
- **Valores medidos** (`inputs-slider--sizes`):

  | `size` | pista | **pulgar** | ¿llega a 24 px?                      |
  | ------ | ----: | ---------: | ------------------------------------ |
  | `xs`   |  4 px |  **12 px** | no                                   |
  | `sm`   |  5 px |  **14 px** | no                                   |
  | `md`   |  6 px |  **16 px** | **no** — y es el default de producto |
  | `lg`   |  8 px |  **20 px** | no                                   |
  | `xl`   | 10 px |  **24 px** | justo                                |

  Idénticos en `nebula-dark` y `nebula-light`: **no responden al tema**.

- **Origen en el código**: `Slider.css.ts:149-153` (`trackSize`) y `156-161` (`thumbSize`) son
  literales de píxel, sin token.
- **Valor esperado**: `docs/06` §4.1 — «**Ningún componente declara alturas en literales.** Si una
  altura no cabe en ninguna de las dos escalas, la discusión es qué peldaño falta» — y §4, «24 px CSS
  mínimo en web».
- **Consecuencia para el usuario**: el pulgar es lo que se arrastra. Con el tamaño por defecto mide
  **16 px**, dos tercios del mínimo de WCAG 2.2, y un tema que recalibre la densidad no lo mueve: es
  el mismo síntoma que `Kbd` en WR2.2 —literales que se saltan el sistema de temas— pero aquí además
  cae sobre un objetivo táctil.
- **Temas**: los medidos, con valores idénticos — que es el síntoma.
- **Token propuesto**: derivar el pulgar de `vars.size.control.*` como hace `Checkbox` con
  `calc(control / 2)`, y la pista de una fracción de esa misma cadena.

### A-3 · El encabezado de `FormField` no separa la etiqueta de la ayuda

- **Componente**: `FormField` · **Magnitud 4** · **Severidad A**
- **Valores medidos** (`forms-formfield--with-error`, distancia real entre cajas):

  | Relación | nebula-dark | nebula-light | Esperado (`docs/06` §3) |
  | --------------- | ----------: | ----------: | -------: | ----------------------- |
  | label → ayuda | **0 px** | **0 px** | **0 px** | `xxs`/`xs` (2–4 px) ❌ |
  | ayuda → control | 8 px | 6 px | 10 px | `sm` ✅ |

- **Origen en el código**: `FormField.css.ts:8-15` — `header` es un `flex column` **sin `gap`**. El
  `gap: sm` que sí funciona es el del `root` (`styles/field.css.ts:18`), que separa el encabezado del
  cuerpo.
- **Valor esperado**: `docs/06` §3 — «Formulario: **label→ayuda `xxs/xs`**, ayuda→control `sm`,
  control→error `xs`». Y §3 avisa del riesgo justo debajo: «FormField separa internamente encabezado
  (label+ayuda) y cuerpo (control+error); un único `gap` uniforme para las cuatro piezas no representa
  sus relaciones».
- **Consecuencia para el usuario**: la etiqueta y su texto de ayuda quedan pegados, sin ninguna
  separación, así que se leen como un bloque de dos líneas en vez de como etiqueta + apoyo. Es el
  único de los tres ritmos del campo que no está declarado.
- **Temas**: los tres, con 0 px en todos — no depende de la base de espaciado.
- **Token propuesto**: `gap: vars.space.xxs` en `FormField.css.ts` `header`.

### B-1 · La familia expresa «size» con cuatro escalas distintas

- **Componentes**: `field` (9+), `Checkbox`, `Rating`, `Slider` · **Magnitud 4** · **Severidad B**
- **Valores medidos**, mismo `size`, mismos temas:

  | `size` | campo (`field`) | `Checkbox` caja | `Rating` botón | `Slider` pulgar |
  | ------ | --------------: | --------------: | -------------: | --------------: |
  | `xs`   |           30 px |           15 px |          20 px |           12 px |
  | `sm`   |           36 px |           18 px |          24 px |           14 px |
  | `md`   |           42 px |           21 px |          28 px |           16 px |
  | `lg`   |           50 px |           25 px |          32 px |           20 px |
  | `xl`   |           60 px |           30 px |          36 px |           24 px |

  Procedencia: `control` · `calc(control / 2)` · `compact` · literales.

- **Valor esperado**: ADR-033 fija **dos** escalas, no cuatro, y `docs/06` §4.1 dice que si una altura
  no cabe en ninguna «la discusión es qué peldaño falta».
- **Consecuencia**: `size="md"` significa cuatro cosas distintas en el mismo formulario. Dos de las
  cuatro procedencias son legítimas y están bien (`control` y `calc(control/2)`, §3); las otras dos
  son A-1 y A-2. Se anota como B propio porque **el problema agregado —que el eje `size` no tenga un
  significado único— no se ve mirando ningún componente por separado**, que es la razón de que el
  reparto de WR2 sea por familia.
- **Temas**: los medidos.
- **Token propuesto**: no procede; se resuelve al cerrar A-1 y A-2.

---

## 3. Coherencia de familia

**Lo mejor medido en toda la auditoría hasta ahora está en esta familia.**

### El recipe `field` compartido cumple la escala, exactamente

Altura real del campo en `forms-inputs--sizes`, medida en los tres temas:

| `size` | Altura medida | Peldaño | `nebula-dark` | `nebula-light` |
| ------ | ------------: | ------------ | ------------- | ------------- | --------- |
| `xs` | 30 px | `control.xs` | ✅ | ✅ | ✅ |
| `sm` | 36 px | `control.sm` | ✅ | ✅ | ✅ |
| `md` | 42 px | `control.md` | ✅ | ✅ | ✅ |
| `lg` | 50 px | `control.lg` | ✅ | ✅ | ✅ |
| `xl` | 60 px | `control.xl` | ✅ | ✅ | ✅ |

Detalle que importa: `styles/field.css.ts:102-129` declara **`minHeight`**, no `height` — el mismo
patrón que hunde a `NavLink` en WR2.3. Aquí **no falla**, y la medida explica por qué: el `<input>`
interior mide 18.8 / 20.3 / 23.2 / 29 px, siempre por debajo de su peldaño, así que el `minHeight`
manda. Es un acierto frágil, no un accidente: si alguien subiera el `font-size` de un peldaño, el
campo crecería fuera de la escala sin que ningún test lo notara.

### `Checkbox` es el modelo a seguir

`Checkbox.css.ts:41-47` deriva la caja con `calc(control.<size> / 2)`: 15 / 18 / 21 / 25 / 30 px,
medidos. Consigue las dos cosas a la vez —la fila conserva el peldaño de `control` y la caja se ve
compacta— **sin inventar una escala nueva y sin dejar de responder al tema**. Es exactamente lo que
les falta a `Rating` y a `Slider`.

### El ritmo del campo, en lo que se pudo medir

`ayuda → control` sale `space.sm` y **sigue la base de espaciado del tema**: 8 px en `nebula-dark`,
y se mueve con la densidad del tema. Correcto según §3. El que falla es `label → ayuda` (A-3).

---

## 4. Lo que el diseño resuelve y `docs/06` no dice

Vacío: el paso 4 no se ejecutó.

---

## 5. Pendiente de arbitraje del diseño

1. **¿`minHeight` o `height` en los controles?** El recipe `field` usa `minHeight` y funciona;
   `NavLink` usa `minHeight` y se sale de la escala (WR2.3 A-1). `docs/06` §4.1 dice en qué escala
   tiene que caer la altura, pero **no si el componente debe forzarla**. Los dos casos comparten
   mecanismo y solo uno falla, así que la regla que falta es explícita.
2. **Qué peldaño le toca al pulgar de un `Slider`.** Ni `control` ni `compact` tienen un peldaño
   pensado para un pulgar, y §4.1 dice que «la discusión es qué peldaño falta». Esa discusión no la
   cierra una auditoría.

---

## 6. No medido

**Cobertura real: 9 de 27 componentes con medida de render.** El resto está solo verificado en el
`.css.ts` o ni eso.

| Qué                                                         | Por qué                                                                                                                                                                                                                                                                                                                                         |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **El segundo punto del foco: el ritmo con controles altos** | El encargo pedía verificar el ritmo de `FormField` «cuando el control es alto (`Textarea`, `Dropzone`, `Signature`) y no solo cuando es una línea». **No se hizo.** A-3 está medido sobre un campo de una línea                                                                                                                                 |
| **`control → error`**                                       | La medida salió negativa (−75 px) en los tres temas: la lámina `forms-formfield--with-error` presenta el error como burbuja posicionada, no en flujo. **El tercer tramo del ritmo 2/8/4 no está verificado**                                                                                                                                    |
| **18 componentes sin medida de render**                     | `Form`, `FieldError`, `Textarea`, `NativeSelect`, `Radio`, `Switch`, `Chip`, `Fieldset`, `PinInput`, `JsonInput`, `TagsInput`, `InputPhone`, `InputDial`, `InputCurrency`, `Signature`, `Dropzone`, `FileInput`, `ColorPicker`/`ColorSwatch`. De `Switch` solo se midió la pista (21 × 36.8 px) y el pulgar (17 px), sin cruzarlo con su escala |
| **Si la caja visual es el objetivo táctil**                 | En `Checkbox` y `Switch` el objetivo suele ser la etiqueta, no la caja; **no se midió el área de impacto real**, así que sus tamaños no se juzgan contra el mínimo de 24 px. En `Rating` y `Slider` sí se pudo: el elemento medido **es** el `<button>` y el pulgar                                                                             |
| **`nebula-light`**                                          | No se recorrió: comparte escalas con `nebula-dark` y este pase mide geometría. Si un defecto fuera de color, no estaría aquí                                                                                                                                                                                                                    |
| **El paso 1: MIRAR**                                        | Un formulario completo con las cuatro escalas conviviendo no se ha visto. B-1 se deduce de la tabla; a ojo probablemente sea más evidente                                                                                                                                                                                                       |
| **El paso 4: Figma**                                        | No ejecutado                                                                                                                                                                                                                                                                                                                                    |

**Lo que este informe sostiene**: cuatro hallazgos medidos, con la regla de `docs/06` citada y la
consecuencia acotada. **Lo que no sostiene**: que los otros 18 componentes estén bien — no se han
medido, y dos de los tres defectos encontrados estaban precisamente en controles que no pasan por el
recipe compartido.

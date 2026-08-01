# WR2.2 — Tipografía y contenido

> Auditoría de 13 componentes. 2026-07-31. **No se tocó código.**
>
> Dos pasadas, como en WR2.1: estática sobre los `.css.ts` y sobre el DOM renderizado (Storybook
> estático + Playwright leyendo `getComputedStyle`, tema forzado por `?globals=theme:`), en los
> **cuatro temas**.
>
> **Sin paso 4 (Figma)**: §4 va vacía. Y medir el render **no es mirarlo**: lo que solo se aprecia a
> ojo —medida de línea real, ritmo de un artículo largo— sigue sin cubrir. Detalle en §6.

## 1. Resumen

| Origen                                         |     A |     B |     C | Hallazgo |
| ---------------------------------------------- | ----: | ----: | ----: | -------- |
| `TypographyStylesProvider` vs `Title` / `Text` |     1 |     0 |     0 | A-1      |
| `Kbd`                                          |     1 |     0 |     0 | A-2      |
| `Spoiler`                                      |     0 |     1 |     0 | B-1      |
| Transversal — tamaño del código                |     0 |     1 |     0 | B-2      |
| **Total**                                      | **2** | **2** | **0** | **4**    |

Sin hallazgos, y verificado: `Text`, `Title`, `Anchor`, `Highlight`, `Mark`, `Code`, `Blockquote`,
`List`, `GradientText`, `CodeHighlight`.

---

## 2. Hallazgos

### A-1 · El contenido de CMS no usa la escala del catálogo

Es el foco asignado a esta familia, y **diverge en las dos direcciones**: los títulos y el cuerpo.

- **Componentes**: `TypographyStylesProvider` vs `Title` y `Text` · **Magnitud 5** · **Severidad A**
- **Valores medidos** (`getComputedStyle`, idénticos en los cuatro temas):

  | Rol                   | Por prop                       | Por selector de etiqueta   | Coincide                   |
  | --------------------- | ------------------------------ | -------------------------- | -------------------------- |
  | `h2` — tamaño         | 40 px (`Title order={2}`)      | 40 px                      | ✅                         |
  | `h2` — peso           | **700**                        | **600**                    | ❌                         |
  | `h2` — tracking       | **−1.2 px**                    | **normal (0)**             | ❌                         |
  | `h2` — interlineado   | 48 px                          | 48 px                      | ✅                         |
  | cuerpo — tamaño       | **16 px** (`Text` por defecto) | **14 px** (`<p>`)          | ❌                         |
  | cuerpo — interlineado | 23.2 px (`normal`, ×1.45)      | 23.1 px (`relaxed`, ×1.65) | ⚠️ coinciden por accidente |

- **Valor esperado**: `docs/06` §2 lo dice literalmente en dos reglas:
  - «`Title` usa `tight`; **`h1–h2` son `bold`**, `h3–h6` son `semibold`» y «`letterSpacing.tight` se
    reserva a `h1–h3`». En el código: `TypographyStylesProvider.css.ts:18` aplica
    `fontWeight: semibold` **a los seis niveles** y **no declara `letterSpacing`** en ninguno.
  - «`Text` sin props usa **`body1`** + `lineHeight.normal`». El proveedor
    (`TypographyStylesProvider.css.ts:11-12`) fija la raíz en **`body2` + `relaxed`**.
- **Consecuencia para el usuario**: el mismo `<h2>` de 40 px se ve **más ligero y más ancho** cuando
  viene de un CMS que cuando lo pone el catálogo. Con un titular de 30 caracteres, −1.2 px de tracking
  son ~36 px de diferencia de ancho: no es un matiz, es otro titular. Y el cuerpo de un artículo se
  lee a 14 px mientras el de la aplicación se lee a 16 px, así que la parte editorial de un producto
  parece de otro sistema.
- **Detalle que enmascara el defecto**: los interlineados salen casi iguales —23.1 vs 23.2 px— porque
  14 × 1.65 ≈ 16 × 1.45. Es coincidencia aritmética entre dos decisiones distintas, no acuerdo.
- **Temas**: los cuatro, con los mismos valores.
- **Token propuesto**: `vars.font.weight.bold` para `h1`/`h2` y `vars.font.letterSpacing.tight` para
  `h1`–`h3` en el proveedor; y para la raíz, `vars.font.size.body1` + `lineHeight.normal` **o** una
  decisión escrita de que la prosa larga usa una escala propia. Hoy no hay ninguna de las dos.

### A-2 · `Kbd` escribe tamaños y alturas en literales, y dos bajan del suelo de 12 px

- **Componente**: `Kbd` · **Magnitud 5** y **4** · **Severidad A**
- **Valores medidos** (`Kbd.css.ts:29-33`, confirmados sobre el render en
  `data-display-primitives--keys`):

  | `size` |  `font-size` |  alto | ¿existe en `sizes.compact`? |
  | ------ | -----------: | ----: | --------------------------- |
  | `xs`   | **10 px** ❌ | 18 px | **no** (el mínimo es 20)    |
  | `sm`   | **11 px** ❌ | 20 px | sí — es `compact.xs`        |
  | `md`   |        12 px | 24 px | sí — es `compact.sm`        |
  | `lg`   |        14 px | 28 px | sí — es `compact.md`        |
  | `xl`   |        16 px | 34 px | **no** (`lg`=32, `xl`=36)   |

- **Valor esperado**: dos reglas de `docs/06`:
  - §2: «**Ningún texto informativo o interactivo baja de 12 px**». `xs` (10) y `sm` (11) la incumplen.
  - §4.1: «**Ningún componente declara alturas en literales.** Si una altura no cabe en ninguna de las
    dos escalas, la discusión es qué peldaño falta, no qué `rem` escribir». `Kbd` declara las cinco.
- **Consecuencia para el usuario**: una tecla `Esc` a 10 px es el texto más pequeño del catálogo y va
  dentro de una caja de 18 px, por debajo del peldaño más bajo que el sistema define para lo compacto.
  Y como los valores son literales, **`Kbd` no responde al tema**: medido en `nebula-dark` y en
  `sober-light`, los cinco tamaños salen idénticos al píxel. Un tema que recalibre la densidad mueve
  el catálogo entero menos esta pieza.
- **Temas**: los cuatro, con valores idénticos — que es justamente el síntoma.
- **Token propuesto**: `vars.size.compact.*` para el alto y `vars.font.size.caption`/`body3`/`body2`
  para el texto, previa decisión de qué peldaño le toca a cada `size` — porque la escalera actual está
  desplazada y le sobran dos extremos.

### B-1 · El disparador de `Spoiler` no usa la escala de labels de control

- **Componente**: `Spoiler` · **Magnitud 5** · **Severidad B**
- **Valor medido**: `Spoiler.css.ts:30-36` — el `<button>` que despliega lleva
  `fontSize: vars.font.size.body3` (13 px) y **no declara `fontWeight`**, así que hereda `regular`.
- **Valor esperado**: `docs/06` §2 — «Labels de controles usan **`button`** o el tamaño denso
  correspondiente, **`semibold`** y `lineHeight.normal`». El token `button` mide 14 px.
- **Consecuencia**: el único control de la familia tipográfica se lee más pequeño y más ligero que
  cualquier otro control del catálogo. Junto a un `Button` o un `Anchor` en la misma línea, «Mostrar
  más» no parece accionable.
- **Temas**: los cuatro.
- **Token propuesto**: `vars.font.size.button` + `vars.font.weight.semibold`.

### B-2 · Tres criterios para dimensionar el mismo código

- **Componentes**: `Code`, `TypographyStylesProvider`, `CodeHighlight` · **Magnitud 5** · **Severidad B**
- **Valores medidos**:

  | Dónde                  | Regla                                          | Resultado sobre cuerpo de 14 px | Sobre cuerpo de 16 px |
  | ---------------------- | ---------------------------------------------- | ------------------------------: | --------------------: |
  | `Code` (inline)        | `0.875em` (`Code.css.ts:22`)                   |                        12.25 px |                 14 px |
  | `code` dentro de prosa | `0.9em` (`TypographyStylesProvider.css.ts:93`) |            **12.6 px** (medido) |               14.4 px |
  | `pre` dentro de prosa  | `body3` absoluto                               |                           13 px |                 13 px |
  | `CodeHighlight`        | `body3` absoluto                               |                           13 px |                 13 px |

- **Valor esperado**: `docs/06` §2 fija la escala por rol; no contempla que el mismo rol —código— se
  dimensione de tres maneras. Dos relativas con multiplicadores distintos (0.875 y 0.9) y una
  absoluta.
- **Consecuencia**: el mismo fragmento de código se ve a **12.6 px** en un párrafo de CMS, a **14 px**
  dentro de un `Text` del catálogo y a **13 px** en un bloque resaltado. Un artículo que mezcle las
  tres —que es el caso normal de una documentación— muestra tres tamaños de monoespaciada.
- **Riesgo derivado del multiplicador relativo** (aritmética sobre dos valores medidos, no medido en
  render porque no hay lámina que lo produzca): dentro de un `<small>` de prosa —`caption`, 12 px— un
  `code` a `0.9em` da **10.8 px**, y un `Code` a `0.875em` da **10.5 px**. Los dos por debajo del
  suelo de 12 px de §2. **Es un riesgo, no un hallazgo confirmado**: hace falta una lámina que anide
  código en texto pequeño para verificarlo.
- **Temas**: los cuatro.
- **Token propuesto**: un solo criterio. Si el código hereda del contexto, un único multiplicador; si
  no, `body3` en los tres sitios.

---

## 3. Coherencia de familia

Lo que **sí** está coherente, y conviene dejarlo escrito para que no se «arregle»:

- **`Anchor`, `Highlight`, `Mark`, `List` y `GradientText` no declaran `font-size`**. Heredan del
  contexto, que es lo correcto para piezas que envuelven texto ajeno: un `<Mark>` dentro de un
  `caption` debe medir lo que el `caption`. Cinco componentes, un solo criterio.
- **`Blockquote` cumple §2 al pie de la letra**: `body1` + `normal` para la cita
  (`Blockquote.css.ts:22-23`) y `caption` + `normal` para la atribución (L49-51), que es exactamente
  lo que pide la regla «Blockquote usa `body1/normal` para la cita y `caption/normal` para la
  atribución».
- **`Title` cumple §2 en los seis niveles**: medido `h2` = 40 px / 700 / `−1.2 px` y `h3` = 32 px /
  600 / `−0.96 px`; peso `bold` en h1–h2, `semibold` en h3–h6, tracking `tight` en h1–h3.
- **`Text` cumple su regla**: 16 px / 400 / 23.2 px sin props.

Lo que **discrepa entre hermanos** son las tres cosas de §2: la prosa contra los componentes (A-1),
`Kbd` contra las dos escalas del sistema (A-2), y el código contra sí mismo (B-2). El patrón común es
que **los tres son los componentes que definen su tipografía sin pasar por `Text` ni por `Title`**.

---

## 4. Lo que el diseño resuelve y `docs/06` no dice

Vacío: el paso 4 no se ejecutó. Las hojas de Polaris asignadas a esta familia siguen sin medir, y
`type-scale.mjs` —el instrumento que deduce el tamaño de Geist a partir del ancho de tinta— no se ha
usado en este pase.

---

## 5. Pendiente de arbitraje del diseño

1. **¿La prosa larga puede tener su propia escala?** A-1 la trata como divergencia porque §2 fija un
   único baseline. Pero 14 px con interlineado `relaxed` es una decisión editorial defendible para
   textos largos, y `docs/06` **no distingue entre UI y prosa** en ningún punto. Si la distinción es
   deliberada, falta escribirla; si no lo es, A-1 es un defecto. Hoy no hay ADR ni nota que lo
   sostenga.
2. **Qué peldaño de `compact` le toca a cada `size` de `Kbd`.** La escalera actual (18/20/24/28/34)
   no encaja: le sobran los dos extremos. §4.1 dice que «la discusión es qué peldaño falta», y esa
   discusión no la puede cerrar una auditoría.

---

## 6. No medido

| Qué                                            | Por qué                                                                                                                                                                                                                                          |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`Title order={1}` sobre el render**          | El selector `document.querySelector("h1")` de la lámina `typography-title--orders` devolvió el encadenado de Storybook (14 px / 600), no el `Title`. Los valores de `h2` y `h3` sí son del componente. **`h1` está medido solo en el `.css.ts`** |
| **`<h1>`, `<h3>` y `<small>` en prosa**        | La lámina `Prosa` no los incluye. La divergencia de A-1 está medida sobre `h2`, `p`, `li` y `code`; para el resto de niveles vale el `.css.ts`, que aplica la misma regla uniforme                                                               |
| **El riesgo de `code` bajo 12 px**             | Derivado por aritmética de dos valores medidos, no reproducido: no hay lámina que anide código dentro de `small`                                                                                                                                 |
| **El paso 1: MIRAR**                           | Nadie ha leído un artículo completo en los cuatro temas. La regla de §2 sobre medida de línea —60–70 caracteres, nunca más de 75— **no se ha verificado**: requiere medir texto real renderizado a distintos anchos                              |
| **El paso 4: Figma**                           | No ejecutado; §4 vacía                                                                                                                                                                                                                           |
| **`CodeHighlight` y `Spoiler` en composición** | Medidos sus tokens; no se ha comprobado cómo conviven con el texto que los rodea                                                                                                                                                                 |
| **Peso variable / fallback de fuente**         | Se midió `font-family` resuelto, no si el peso 700 existe en la fuente cargada o lo sintetiza el navegador                                                                                                                                       |

**Lo que este informe sostiene**: cuatro hallazgos con valor medido —tres de ellos sobre el render en
los cuatro temas—, valor esperado citado a `docs/06` §2 y §4.1, y consecuencia. **Lo que no
sostiene**: que la prosa larga se lea bien, porque eso no se mide, se lee.

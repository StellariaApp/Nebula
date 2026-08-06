# WN · Auditoría de style props — qué hay, qué falta, y las dos preguntas abiertas

Base para el ADR de `StyleProps` v2. Responde a las decisiones 1, 4 y 5 del checkpoint del
2026-08-06. Medido sobre `packages/web/src/components/Box/Box.css.ts` y `utils/style-props.ts`.

---

## 1 · Hoy hay tres carriles, y ninguno hace las tres cosas

| Carril                       | Props   | Token | Valor abierto | Responsive |
| ---------------------------- | ------- | :---: | :-----------: | :--------: |
| **A** sprinkles responsive   | 29 + 27 |  sí   |    **no**     |     sí     |
| **B** sprinkles sin responsive | 21 + 17 |  sí   |    **no**     |   **no**   |
| **C** `style` en línea       | 15      | **no** |      sí      |   **no**   |

Ese reparto es el defecto de fondo: qué puede hacer una prop depende del carril donde cayó, no de lo
que la propiedad CSS admite. `p` es responsive pero no acepta `10px`; `w` acepta `240` pero no
responde al breakpoint; `overflow` no hace ninguna de las dos.

**El objetivo del ADR**: toda prop acepta token **o** valor abierto, y toda prop es responsive.

### Aclaración sobre lo que preguntaste

`pl`, `ml`, `px`, `py` **ya existen** — están en el carril A. Lo que no existe es pasarles un valor
crudo (`pl="10px"`, `pl={10}`). El inventario completo, para que no quede duda:

**Carril A (responsive, solo token)** — 27 atajos con su propiedad larga:

`p px py pt pb pl pr ps pe` · `m mx my mt mb ml mr ms me` · `gapx gapy` ·
`direction wrap align justify self ta fz` · y sin atajo: `display`, `gap`.

**Carril B (ni responsive ni abierto)** — 17 atajos:

`tt td ws` · `ff fw lh ls` · `r rt rb rl rr` · `c bg bdc` · `shadow z` · y sin atajo:
`position`, `overflow`, `overflowX`, `overflowY`.

**Carril C (abierto, sin token ni responsive)** — 15:

`w h miw maw mih mah` · `top right bottom left` · `grow shrink basis flex opacity`.

---

## 2 · Las que no se recortan

Tu criterio —`overflow`, `flex`, `wrap`, `display`— generalizado: **se conserva el nombre CSS cuando
la abreviatura sería críptica o ambigua**. `wrap`, `align`, `justify`, `self` y `direction` ya son
atajos y se leen bien; no son excepciones, son abreviaturas asentadas.

Se quedan con nombre completo: `display` · `position` · `overflow` · `overflowX` · `overflowY` ·
`gap` · `flex` · `opacity` · `order` · `cursor` · `visibility` · `aspectRatio` · `inset` ·
`objectFit` · `pointerEvents` · `userSelect` · `alignContent` · `justifyItems` · `justifySelf`.

---

## 3 · Lo que falta

### 3.1 · Borde — 20 props (tu especificación del punto 5)

Hoy solo existe `bdc`, y **`bdc` a solas no dibuja nada**: sin grosor ni estilo el navegador no
pinta. Es el hueco más visible del catálogo.

| Nivel               | Props                                    | Ejemplo                        |
| ------------------- | ---------------------------------------- | ------------------------------ |
| todo en uno         | `bd`                                     | `bd="1px solid #fffeed"`       |
| por faceta          | `bdw` `bds` `bdc`                        | `bds="dashed"`                 |
| por lado, en uno    | `bdt` `bdb` `bdl` `bdr`                  | `bdt="1px solid"`              |
| por lado y faceta   | `bdtw bdts bdtc` · `bdbw bdbs bdbc` · `bdlw bdls bdlc` · `bdrw bdrs bdrc` | `bdtc="border.strong"` |

`bdc` conserva su significado actual (color de los cuatro lados), así que no rompe nada.

### 3.2 · El resto, por familia

| Familia         | Faltan                                                                       |
| --------------- | ---------------------------------------------------------------------------- |
| Posición        | `inset`, `insetInline`, `insetBlock`                                          |
| Caja            | `aspectRatio`, `size` (ancho y alto en una), `objectFit`, `objectPosition`     |
| Flex            | `order`, `alignContent`                                                       |
| Grid            | `justifyItems`, `justifySelf`, `placeItems`, `gridColumn`, `gridRow`, `gridTemplateColumns`, `gridTemplateRows`, `gridAutoFlow` |
| Tipografía      | `fs` (`font-style`), `verticalAlign`                                          |
| Interacción     | `cursor`, `pointerEvents`, `userSelect`, `visibility`                          |

**`display: "grid"` está expuesto desde el primer día y no hay una sola prop para gobernarlo.** Es
la carencia más incoherente de la lista.

---

## 4 · Cómo se consiguen token + abierto + responsive a la vez

Los tres no caben en un solo mecanismo, porque **una media query no se puede escribir en `style`**.
La propuesta son dos carriles que conviven, elegidos por el valor:

**Valor de token** → clase atómica de sprinkles, como hoy. Coste cero añadido, CSS estático.

**Valor abierto** → variable CSS en línea + una clase estática por prop que la lee en cada
breakpoint:

```css
.px_open { padding-inline: var(--nb-px); }
@media (min-width: 768px) { .px_open { padding-inline: var(--nb-px-tablet, var(--nb-px)); } }
```

```tsx
<Box px={{ base: 10, tablet: "1.5rem" }} />
// -> class="px_open"  style={{ "--nb-px": "10px", "--nb-px-tablet": "1.5rem" }}
```

Las dos reglas que lo hacen funcionar:

1. **El fallback encadenado** (`var(--nb-px-tablet, var(--nb-px))`) hace que un objeto responsive
   parcial herede del escalón anterior sin emitir vars que nadie puso.
2. Es **una clase por prop, no por valor**. El CSS no crece con los valores que use el consumidor.

`ExtractStyleProps` ya sabe repartir por valor —lo hace con la opacidad de ADR-071—, así que la
decisión "¿token o abierto?" cae en el mismo sitio y con la misma forma.

### El coste, que hay que medir antes de comprometerlo

La vía abierta emite CSS **siempre**, la use alguien o no: vanilla-extract es estático. Son ~6
reglas por prop con vía abierta. Dos formas de acotarlo:

- **Las props de enumeración no llevan vía abierta.** En `display`, `position`, `overflow`,
  `textAlign`… el mapa de tokens **ya es** el conjunto completo de valores legales de CSS; un valor
  "abierto" no significa nada. Eso deja la vía abierta en ~55 props de longitud, color y número.
- **Hacer responsive el carril B multiplica sus clases por seis.** `position`, `overflow`, `r`, `c`,
  `bg`, `fw`… pasarían de 1 a 6 clases por valor. Con 77 peldaños de color eso no es gratis.

**Recomendación**: medir las dos cosas por separado con `size-limit` antes de fijar el ADR, y estar
dispuestos a dejar sin responsive el color de paleta si el número no sale. Hay 192 presupuestos y ya
subimos 17 esta semana.

---

## 5 · Las dos preguntas que no puedo decidir yo

### 5.1 · El borde lógico — RESUELTO (propietario, 2026-08-06)

`bds` no puede ser a la vez `border-style` y `border-inline-start`; `bdbs` no puede ser a la vez
`border-bottom-style` y `border-block-start-style`.

**Decisión: el físico se queda con los atajos cortos; el lógico usa el nombre CSS completo**
—`borderInlineStart`, `borderBlockStartStyle`, `borderInlineEndColor`…—. El lógico se usa mucho
menos, y el nombre largo es inequívoco.

No es una excepción a la poda del punto 1: es exactamente la regla ya escrita en §2 —se conserva el
nombre CSS cuando la abreviatura sería críptica o ambigua—, aplicada a un caso donde además choca.

### 5.2 · Las cuatro esquinas de radio

`rt` `rb` `rl` `rr` van **por pares** (`rt` = las dos de arriba). Al podar los nombres largos se
pierde poder redondear una sola esquina. Hace falta un atajo propio: `rtl` `rtr` `rbl` `rbr`. El
riesgo es que `rtl` se lea como *right-to-left*. Alternativa: `r1 r2 r3 r4` en orden CSS, que nadie
confunde pero tampoco nadie recuerda. **Recomiendo `rtl/rtr/rbl/rbr`** y decirlo en el `.md`.

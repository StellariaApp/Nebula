# WR2.7 — Fechas y media

> Auditoría de 13 componentes. 2026-07-31. **No se tocó código.**
>
> Dos pasadas: estática sobre los `.css.ts`/`.tsx` y sobre el DOM renderizado (Storybook estático +
> Playwright), en los **cuatro temas** para `Calendar`.
>
> **Cobertura: 2 de 13 con medida de render** (`Calendar` a fondo, `Charts` a medias). §6.
>
> **Sin paso 4 (Figma)**: §4 vacía.

## 1. Resumen

| Origen                               |     A |     B |     C | Hallazgo |
| ------------------------------------ | ----: | ----: | ----: | -------- |
| `Calendar` / `RangeCalendar` — rango |     1 |     0 |     0 | A-1      |
| `Charts` — series casi isoluminantes |     0 |     1 |     0 | B-1      |
| **Total**                            | **1** | **1** | **0** | **2**    |

Este informe **descartó dos hallazgos falsos** antes de escribirlos (§3). Es tan resultado como los
que quedaron.

---

## 2. Hallazgos

### A-1 · El rango de fechas desaparece en cualquier tema cuyo `primary` sea un gradiente

- **Componentes**: `Calendar` y `RangeCalendar` · **Magnitud 3** · **Severidad A**
- **Valor medido** — fondo del `<td>` con `data-range-selected="true"`:

  | Tema           | `background-color` del rango           | ¿Se ve?             |
  | -------------- | -------------------------------------- | ------------------- |
  | `nebula-dark`  | `color(srgb 0.549 0.608 1 / 0.16)`     | ✅                  |
  | `nebula-light` | `color(srgb 0.333 0.333 0.953 / 0.16)` | ✅                  |
  | `sober-light`  | `color(srgb 0 0.498 0.584 / 0.16)`     | ✅                  |
  | **`playful`**  | **`rgba(0, 0, 0, 0)`**                 | ❌ **transparente** |

- **Mecanismo, identificado en el código**: `Calendar.tsx:77` y `RangeCalendar.tsx:86` calculan

  ```
  [rangeBg]: `color-mix(in srgb, ${resolved.background} 16%, transparent)`
  ```

  `resolved.background` viene de `ResolveVariant`. En tres temas es **un color** y `color-mix`
  funciona. En `playful` es **un gradiente**: medido sobre el día seleccionado, su `background-image`
  es `linear-gradient(135deg, rgb(167,44,196) 0%, rgb(206,0,10…)`. `color-mix(in srgb,
linear-gradient(…) 16%, transparent)` **no es válido**, así que la declaración se descarta y el
  fondo cae a su valor inicial: transparente. El `fallbackVar(rangeBg, primary.100)` del CSS **no
  protege**, porque la variable sí está definida — lo que es inválido es su contenido.

- **Consecuencia para el usuario**: en `playful`, seleccionar un rango de fechas **no muestra el
  rango**. Solo se ven los dos extremos marcados; los días intermedios se pintan exactamente igual que
  los días fuera de la selección. El componente sigue funcionando —el valor es correcto— pero el
  usuario no ve qué ha seleccionado.
- **Alcance real**: no es «un defecto de `playful`». Es de **cualquier tema cuyo `variantMap` resuelva
  `primary` a un gradiente**, y el Theme Creator permite construirlos. `playful` es el que lo destapa,
  no el único afectado.
- **Temas**: los cuatro medidos; falla en uno.
- **Token propuesto**: no es de token. `color-mix` necesita un color, así que hay que resolver el
  gradiente a su primera parada —o usar un rol de color plano— antes de mezclarlo. Es la misma clase
  de problema que ADR-059 trata para glass: un efecto que no degrada solo.

### B-1 · Dos series consecutivas de la paleta por defecto son casi isoluminantes

- **Componente**: `Charts` · **Magnitud 3** · **Severidad B**
- **Valores medidos** (`data-display-charts--lineas`, `stroke` resuelto de cada serie):

  | Tema          | serie 0            | serie 1          | ratio de luminancia | Δrgb |
  | ------------- | ------------------ | ---------------- | ------------------: | ---: |
  | `nebula-dark` | `rgb(108,118,255)` | `rgb(237,65,66)` |            **1.04** |  235 |
  | `sober-light` | `rgb(0,153,179)`   | `rgb(237,65,66)` |            **1.14** |  277 |

- **Valor esperado**: `docs/06` no fija un mínimo de separación entre series (ver §5), pero la propia
  especificación insiste en que un estado no debe distinguirse **solo por color** (§6 lo exige para
  DnD; el mismo criterio aplica a una leyenda). Dos trazos con **ratio 1.04** tienen tonos muy
  distintos (Δrgb 235) y **casi la misma claridad**.
- **Consecuencia para el usuario**: en escala de grises —impresión, captura en blanco y negro— o para
  una persona con deficiencia de visión cromática de tipo protán/deután, las dos primeras series de
  cualquier gráfico se confunden. Es exactamente el orden por defecto: `primary` seguido de la
  siguiente del `FALLBACK` de `chart-theme.ts:6-13`.
- **Temas**: los dos medidos.
- **Token propuesto**: no procede — la corrección es de **orden** de la paleta (`FALLBACK` en
  `chart-theme.ts`), no de valor: basta con que dos roles adyacentes no sean isoluminantes.

---

## 3. Coherencia de familia

### Dos hallazgos que se cayeron al verificarlos

Los dos parecían defectos graves en la primera medida y **no lo son**. Quedan escritos porque la
próxima auditoría los va a encontrar igual:

1. **«El día seleccionado es invisible en `playful`».** La primera medida dio
   `background-color: rgba(0,0,0,0)` con `color: rgb(255,255,255)` — texto blanco sobre nada, sobre un
   lienzo blanco. **Falso**: `playful` pinta el día seleccionado con un **gradiente**, que vive en
   `background-image` y no en `background-color`. Contrastes reales del día seleccionado: **7.76**
   (dark), **5.28** (light), **4.70** (sober) — los tres pasan AA.
2. **«Los días del rango no se pintan».** La primera medida buscó el fondo en
   `[data-range-middle]`, que está en la celda interior. **Falso**: el rango se pinta en el `<td>`
   envolvente con `data-range-selected` (`Calendar.css.ts:116`), y ahí sí está — salvo en `playful`,
   que es A-1. La celda interior solo gobierna el hover.

Moraleja para el resto de WR2: **medir `background-color` sin mirar `background-image` produce falsos
positivos en cualquier tema con gradientes**, y en un compound hay que saber qué nodo pinta qué.

### Los cuatro estados del día, que era el punto 1 del foco

El encargo era verificar que el día seleccionado, el de hoy, el del rango y el deshabilitado **se
distinguen entre sí**, no solo del fondo. Lo verificado:

| Estado        | Cómo se marca                                                                    | ¿Distinto de los demás?                                                |
| ------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| seleccionado  | fondo sólido (o gradiente en `playful`) + texto invertido                        | **sí**, 4.70–7.76 de contraste                                         |
| hoy           | `box-shadow: inset 0 0 0 1px border.strong` + `semibold` (`Calendar.css.ts:173`) | **sí**, y por dos canales a la vez —anillo y peso—, que es lo correcto |
| rango         | fondo del `<td>` al 16 % del primario                                            | **sí** en tres temas, **no** en `playful` (A-1)                        |
| deshabilitado | `line-through` + `cursor: not-allowed` (`Calendar.css.ts:164`)                   | **sí**, y no depende solo del color                                    |

Tres de los cuatro estados **no dependen exclusivamente del color** —hoy usa anillo y peso,
deshabilitado usa tachado—, que es más de lo que `docs/06` exige. El único que sí depende solo del
color es el rango, y es justo el que falla en un tema.

---

## 4. Lo que el diseño resuelve y `docs/06` no dice

Vacío: el paso 4 no se ejecutó.

---

## 5. Pendiente de arbitraje del diseño

1. **¿Cuánto tienen que separarse dos series de un gráfico?** `docs/06` no da ningún criterio: ni
   ratio de luminancia mínimo, ni Δ perceptual, ni regla de orden. B-1 se apoya en una inferencia
   razonable —que dos series deben distinguirse sin color—, no en una regla escrita. **Falta
   especificar la paleta categórica**, y es un hueco del mismo tipo que el escalón de superficie que
   abrió WR2.5.
2. **¿Qué hace un tema con `primary` de gradiente donde el sistema espera un color?** A-1 es el primer
   caso medido, pero `color-mix`, `WithAlpha` y cualquier derivación de color tienen el mismo
   problema. La decisión —¿se prohíben los gradientes en `variantMap.primary`, o toda derivación
   resuelve el gradiente a un color antes de operar?— es de contrato.

---

## 6. No medido

**Cobertura: 2 de 13.**

| Qué                                                                               | Por qué                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Las seis series de `SeriesColor` en los cuatro temas**                          | Era el punto 2 del foco y **no está hecho**. La lámina `--lineas` solo pinta **dos** series, así que solo hay medida de un par consecutivo. Se intentó resolver los seis roles inyectando un elemento de prueba, pero quedó **fuera del ámbito del tema** y los `var()` no resolvieron: los seis devolvieron el mismo color. Esa medida se descartó por inválida en vez de reportarse. **Hace falta una lámina con cinco o seis series**, que es justo lo que el foco anticipaba |
| **`DatePicker`, `DateRangePicker`, `DateTimePicker`, `MonthPicker`, `TimeInput`** | Sin medida. Comparten el recipe `field`, que WR2.4 verificó correcto en las cinco alturas, pero su calendario en popover no se abrió                                                                                                                                                                                                                                                                                                                                             |
| **`Carousel`, `ImageGallery`, `Lightbox`, `Player`, `RichTextEditor`**            | Sin medida de ningún tipo                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **`EditorImage`**                                                                 | **No tiene lámina** — hallazgo 5 del censo de WR1.1, que el propietario dejó abierto. No auditable                                                                                                                                                                                                                                                                                                                                                                               |
| **La retícula densa del `Calendar`**                                              | El punto 1 del foco hablaba de «la única cuadrícula densa de texto del sistema». Se midieron los **estados**, no la **densidad**: tamaño de celda, gutter y medida del texto frente a `docs/06` §3–4 siguen sin verificar                                                                                                                                                                                                                                                        |
| **El paso 1: MIRAR**                                                              | A-1 se ve a ojo en dos segundos: seleccionar un rango en `playful` y comprobar que no pasa nada                                                                                                                                                                                                                                                                                                                                                                                  |
| **El paso 4: Figma**                                                              | No ejecutado                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

**Lo que este informe sostiene**: un defecto A con mecanismo identificado en el código y reproducido
en un tema de los cuatro, y un B con medida sobre dos series. **Lo que no sostiene**: el punto 2 del
foco, que queda sin hacer, ni nada sobre 11 de los 13 componentes.

# WR2.6 — Datos y feedback

> Auditoría de 32 componentes. 2026-07-31. **No se tocó código.**
>
> Dos pasadas: estática sobre los `.css.ts` y sobre el DOM renderizado (Storybook estático +
> Playwright), en `nebula-dark` y `sober-light` — los dos extremos de la base de espaciado (4 px y
> 3 px), que es lo que aquí discrimina.
>
> **Cobertura: 5 de 32 con medida de render**, más una verificación estática que cubre 2 más. §6.
>
> **Sin paso 4 (Figma)**: §4 vacía.

## 1. Resumen

| Origen                                  |     A |     B |     C | Hallazgo |
| --------------------------------------- | ----: | ----: | ----: | -------- |
| `Indicator`                             |     1 |     0 |     0 | A-1      |
| `Tag`                                   |     1 |     0 |     0 | A-2      |
| Transversal — las cinco piezas pequeñas |     0 |     1 |     0 | B-1      |
| **Total**                               | **2** | **1** | **0** | **3**    |

Los **tres puntos del foco** están respondidos: el 1 con B-1, el 2 en §3 y el 3 **verificado y
correcto** (§3).

---

## 2. Hallazgos

### A-1 · La tipografía de `Indicator` baja hasta 8 px

- **Componente**: `Indicator` · **Magnitud 5** y **4** · **Severidad A**
- **Valores medidos**: `Indicator.css.ts:82-86` declara los cinco tamaños en literales, **caja y
  fuente**:

  | `size` | caja (`minWidth`/`height`) | `font-size` | ¿Cumple el suelo de 12 px? |
  | ------ | -------------------------: | ----------: | -------------------------- |
  | `xs`   |                       8 px |    **8 px** | ❌                         |
  | `sm`   |                      12 px |    **9 px** | ❌                         |
  | `md`   |                      16 px |   **10 px** | ❌                         |
  | `lg`   |                      20 px |   **11 px** | ❌                         |
  | `xl`   |                      24 px |       12 px | justo                      |

  Confirmado sobre el render (`data-display-primitives--indicators`): puntos de **16 px con fuente de
  10 px** y de **12 px con fuente de 9 px**, **idénticos en `nebula-dark` y `sober-light`**.

- **Valor esperado**: `docs/06` §2 — «**Ningún texto informativo o interactivo baja de 12 px**» — y
  §4.1 — «Ningún componente declara alturas en literales».
- **Consecuencia para el usuario**: el contador de un `Indicator` es información —cuántas
  notificaciones hay— y en cuatro de sus cinco tamaños se rinde por debajo del suelo del sistema, con
  **8 px en el más pequeño**, que es la tipografía más pequeña de todo el catálogo. Y como son
  literales, no responden al tema: la pieza queda fuera de cualquier recalibración de densidad.
- **Temas**: los dos medidos, con valores idénticos — que es el síntoma.
- **Token propuesto**: `vars.size.compact.*` para la caja y `vars.font.size.caption` como suelo del
  texto, aceptando que por debajo de cierto tamaño el `Indicator` deja de llevar número y se queda en
  punto.

### A-2 · `Tag` crece con el tema a lo ancho pero no a lo alto

- **Componente**: `Tag` · **Magnitud 4** · **Severidad A**
- **Valores medidos**: `Tag.css.ts:62-66` mezcla las dos cosas en la misma regla —
  `minHeight` **literal** y `paddingInline` **con token**:

  | `size` | `minHeight` | ¿peldaño de `compact`? | `paddingInline` |
  | ------ | ----------: | ---------------------- | --------------- |
  | `xs`   |   **18 px** | no (`compact.xs` = 20) | `space.xs`      |
  | `sm`   |   **22 px** | no (`sm` = 24)         | `space.xs`      |
  | `md`   |   **26 px** | no (`md` = 28)         | `space.sm`      |
  | `lg`   |   **32 px** | sí                     | `space.sm`      |
  | `xl`   |   **38 px** | no (`xl` = 36)         | `space.md`      |

  Sobre el render (`data-display-primitives--tags`): `md` mide **26 px de alto en los dos temas**,
  mientras su ancho pasa de **67.3 px** en `nebula-dark` a **63.3 px** en `sober-light`.

- **Valor esperado**: `docs/06` §4.1 — «Ningún componente declara alturas en literales» — y ADR-033,
  que fija `compact` para exactamente esta clase de pieza.
- **Consecuencia para el usuario**: al cambiar de tema, un `Tag` se estrecha 4 px pero conserva su
  altura. Puesto en la misma fila que un `Badge` —que sí sigue `compact` y sí se recalibra entero—,
  la relación entre los dos cambia con el tema: en `nebula` un `Tag md` (26) es 2 px más bajo que un
  `Badge md` (28); la proporción no se mantiene al recalibrar porque solo uno de los dos responde.
- **Temas**: los dos medidos.
- **Token propuesto**: `vars.size.compact.*` en `minHeight`, que además arregla los cuatro peldaños
  que hoy no existen.

### B-1 · Las cinco piezas pequeñas no forman una escala

Es el punto 1 del foco: «Badge, Tag, StatusBadge, Chip e Indicator aparecen juntos en tablas y cards.
Mide altura, padding, radius y tamaño de texto de los cinco y ponlos en una tabla: **si no forman una
escala, se ve**».

- **Componentes**: `Badge`, `Tag`, `StatusBadge`, `Chip`, `Indicator` · **Magnitud 4** · **Severidad B**
- **Valores medidos**, altura por `size`:

  | `size`          |   `Badge` |    `Chip` |         `Tag` |   `Indicator` | `StatusBadge` |
  | --------------- | --------: | --------: | ------------: | ------------: | ------------- |
  | `xs`            |     20 px |         — |         18 px |          8 px | = `Badge`     |
  | `sm`            |     24 px |     24 px |         22 px |         12 px | = `Badge`     |
  | `md`            |     28 px |     28 px |         26 px |         16 px | = `Badge`     |
  | `lg`            |     32 px |     32 px |         32 px |         20 px | = `Badge`     |
  | `xl`            |     36 px |     36 px |         38 px |         24 px | = `Badge`     |
  | **Procedencia** | `compact` | `compact` | **literales** | **literales** | delegada      |

- **Consecuencia**: `size="md"` produce 28, 28, 26 y 16 px según la pieza. Los dos que salen de
  `compact` coinciden exactamente; los dos que salen de literales no coinciden ni con ellos ni entre
  sí. En una celda de tabla con un `Badge` de estado y un `Tag` de categoría, los dos se desalinean
  por 2 px — poco para verlo aislado, suficiente para que una columna entera se vea sucia.
- **Lo que sí forma escala**: `Badge`, `Chip` y `StatusBadge`. Tres de cinco.
- **Temas**: los dos medidos.
- **Token propuesto**: se resuelve al cerrar A-1 y A-2; no tiene arreglo propio.

---

## 3. Coherencia de familia

### Punto 3 del foco — verificado y **correcto**

`docs/06` §6 prohíbe glass y gradientes en superficies densas. Barrido de `Table/` y `DataGrid/`
completos buscando `glass`, `gradient`, `backdropFilter` y `blur`: **cero ocurrencias**. Las dos
superficies donde la prohibición importa la cumplen.

### Punto 2 del foco — `Card` vs `CardComplex` vs `Paper` vs `Section`

El encargo era «verifica que la diferencia se lee y que no hay dos que se vean igual». Medido:

|               | Superficie                                                                    | Borde            | Sombra  | ¿Se distingue del lienzo? |
| ------------- | ----------------------------------------------------------------------------- | ---------------- | ------- | ------------------------- |
| `Card`        | `surface.raised` — `rgb(8,10,18)` dark / `rgb(255,255,255)` light             | 1 px             | ninguna | **sí**                    |
| `CardComplex` | ninguna propia: sus 10 partes internas son transparentes y monta sobre `Card` | —                | —       | **sí**, por `Card`        |
| `Paper`       | `surface.base` — **igual que el lienzo**                                      | 0 px por defecto | ninguna | **no**                    |
| `Section`     | ninguna                                                                       | —                | ninguna | **no**                    |

Dos conclusiones distintas, y conviene no confundirlas:

- **`Card` ≡ `CardComplex` es correcto y deliberado.** `CardComplex` es «alto nivel construido sobre
  los compounds» (C1-Q4 del inventario): que se vea igual es su contrato, no un defecto. Sus diez
  partes internas —`mediaWrap`, `header`, `heading`, `badgeRow`, `title`, `slotRow`, `description`,
  `metaRow`, `person`, `body`— miden todas `rgba(0,0,0,0)`: no añaden ni una superficie.
- **`Paper` ≡ `Section` ≡ lienzo no es correcto, pero no es un hallazgo nuevo.** Es la consecuencia
  directa de **WR2.1 A-1** (`Paper` pinta `surface.base` por una regresión de `d08da37`). Se
  confirma aquí desde un segundo ángulo —comparando las cuatro superficies entre sí— y **no se cuenta
  otra vez**. Arreglado A-1, `Paper` pasa a `raised` y las cuatro se distinguen: `Card`/`CardComplex`
  y `Paper` sobre `raised`, `Section` sin superficie por diseño.

### `Badge` es la pieza de referencia, y lo cumple

Medido: **20 / 24 / 28 / 32 / 36 px** = `compact.xs…xl` exactos, con `paddingInline` que **sí** sigue
la base del tema (8/4/4/8/16 px en `nebula-dark` contra 6/3/3/6/12 px en `sober-light`) y fuentes
12/12/13/14/14 px, todas en el suelo o por encima. `docs/06` §4.1 lo nombra como el componente que
cumple el contrato de `compact` —«Badge lo cumple»— y la medida lo confirma.

---

## 4. Lo que el diseño resuelve y `docs/06` no dice

Vacío: el paso 4 no se ejecutó.

---

## 5. Pendiente de arbitraje del diseño

1. **¿Un `Indicator` puede llevar número en sus tamaños pequeños?** A-1 propone `caption` como suelo,
   pero un punto de 8 px no admite un dígito de 12 px. La alternativa —que por debajo de cierto
   peldaño el `Indicator` sea solo punto— **cambia su API**, no solo su CSS, y eso no lo decide una
   auditoría.
2. **Los peldaños que le faltan a `compact`.** `Tag` eligió 18/22/26/38 en vez de 20/24/28/36. Si esa
   elección respondía a una necesidad real de piezas más ajustadas, la discusión es «qué peldaño
   falta» (§4.1) y no «corrige el literal».

---

## 6. No medido

**Cobertura: 5 de 32 con medida de render** (`Badge`, `Tag`, `Indicator`, `Card`, `CardComplex`), más
`Table` y `DataGrid` verificados en estático para el punto 3 del foco.

| Qué                                               | Por qué                                                                                                                                                                                                                                                                                                                                                          |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **25 componentes sin tocar**                      | `GridList`, `InfiniteList`, `SearchableList`, `Timeline`, `Accordion`, `Stat`, `StatusBadge`, `Avatar`, `ThemeIcon`, `Image`, `Banderole`, `Banner`, `Feature`, `EmptyState`, `EmptyModule`, `Alert`, `Toast`, `Loader`, `Skeleton`, `Progress`, `NProgress`, `CurrencyDisplay`, `DateDisplay` y los dos de abajo. Ni medida de render ni revisión del `.css.ts` |
| **`Countdown` y `ScrollProgress`**                | **No tienen lámina** — es el hallazgo 5 del censo de WR1.1, que el propietario dejó abierto. WR2 no puede auditar lo que no se puede mirar; queda como consecuencia práctica de aquella decisión, tal como se anticipó                                                                                                                                           |
| **`StatusBadge`**                                 | Se declara «= `Badge`» por delegación leída en el código, **no medido sobre el render**. Si su mapa de estados inyectara tamaños propios, no se sabría                                                                                                                                                                                                           |
| **Densidad `data-dense` de `Table` y `DataGrid`** | El punto 3 del foco pedía comprobar la **densidad** además de la prohibición de efectos. Solo se verificó la prohibición                                                                                                                                                                                                                                         |
| **`nebula-light` y `playful`**                    | Este pase usó `nebula-dark` y `sober-light` por ser los extremos de la base de espaciado. Un defecto de color no estaría aquí                                                                                                                                                                                                                                    |
| **El paso 1: MIRAR**                              | La familia entera junta —que es donde se ve si las cinco piezas pequeñas forman escala— no se ha visto. B-1 se deduce de la tabla                                                                                                                                                                                                                                |
| **El paso 4: Figma**                              | No ejecutado                                                                                                                                                                                                                                                                                                                                                     |

**Lo que este informe sostiene**: los tres puntos del foco respondidos con medida, dos de ellos
—efectos en tablas y `Card` vs `CardComplex`— **verificados como correctos**. **Lo que no sostiene**:
nada sobre 25 de los 32 componentes.

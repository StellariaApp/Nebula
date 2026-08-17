# Auditoría visual — familia Campos de formulario · 2026-08-17

> **Fase 2 de VA1**, segunda familia. `TextInput` y hermanos, `Select`, `DatePicker`, `Pickers`.
> Alcance de [la rúbrica](rubrica-auditoria-visual.md) §0: **el color queda fuera**.
> **No se ha tocado código en esta familia.**

## Veredicto

**La familia está bien construida y es la más coherente del catálogo hasta ahora.** Tres componentes
distintos dan **exactamente la misma geometría** en las cinco tallas, los estados responden todos, y
no hay un solo desborde a 360 ni a 768.

Lo que aparece son **dos observaciones de escala** y **una divergencia con `docs/06` §4 que alcanza a
medio catálogo** — ninguna de aspecto, ninguna de color.

---

## 1. Lo que pasa

### Coherencia entre hermanos — impecable

| talla | alto            | radio       | padding-inline | fz  | borde |
| ----- | --------------- | ----------- | -------------- | --- | ----- |
| `xs`  | 28 `control.xs` | 12 `rad.md` | 12 `space.sm`  | 13  | 1 px  |
| `sm`  | 36 `control.sm` | 12 `rad.md` | 12 `space.sm`  | 14  | 1 px  |
| `md`  | 44 `control.md` | 12 `rad.md` | 16 `space.md`  | 16  | 1 px  |
| `lg`  | 52 `control.lg` | 12 `rad.md` | 16 `space.md`  | 16  | 1 px  |
| `xl`  | 60 `control.xl` | 12 `rad.md` | 22 `space.lg`  | 20  | 1 px  |

**`TextInput`, `Select` y `DatePicker` dan estos mismos valores, peldaño a peldaño, sin una sola
diferencia.** Es `styles/field.css.ts` haciendo exactamente lo que existe para hacer, y es la mejor
noticia de la fase 2 hasta ahora.

El cuerpo a `md` es 16 px = `body1`, que `docs/06` §2.1 asigna literalmente a «cuerpo por defecto,
**formularios** y lectura». Correcto por doc.

### Estados — responden todos

Recorridos en vivo sobre los cinco campos: **hover cambia** en los cuatro medidos, **el anillo de foco
es de 2 px** en todos (ADR-036), y **el borde cambia al enfocar**. Ninguno de los agujeros que
aparecieron en la familia Acciones se repite aquí.

### Responsive — limpio

A **360 px** y **768 px**, sobre `Foundations/Visual QA/Actions`, `Landing`, `Inputs` y `Select`:
**ningún desborde de documento y ningún elemento fuera de pantalla**. Cero hallazgos de eje 3.

---

## 2. Observaciones

### 2.1 · La escala de tallas del campo es más plana que la del botón

`md` y `lg` se distinguen **solo por la altura**:

|          | alto | padding | radio | fz  |
| -------- | ---- | ------- | ----- | --- |
| campo md | 44   | 16      | 12    | 16  |
| campo lg | 52   | **16**  | 12    | 16  |
| botón md | 44   | 22      | 12    | 14  |
| botón lg | 52   | **28**  | 12    | 16  |

El botón mueve las tres magnitudes en cada peldaño; el campo mueve una. De sus cinco tallas salen
**tres paddings y cuatro cuerpos**, así que `xs`/`sm` comparten inset y `md`/`lg` comparten inset **y**
tamaño de letra. No hay regla en `docs/` que exija lo contrario —y un campo tiene menos margen que un
botón porque su contenido es texto editable—, así que es observación y no fallo.

### 2.2 · A la misma talla, campo y botón no tienen el mismo inset

Un `md` da 16 px de padding en el campo y 22 en el botón. Puestos en la misma fila —un campo y su
botón de envío, que es la composición más común del catálogo— **su texto no arranca a la misma
distancia del borde**. Los dos valores están en la escala; lo que no existe es una regla que diga si
deben coincidir. Se anota para que se decida, no porque esté mal.

---

## 3. Divergencia con `docs/06` §4 — alcanza a medio catálogo

`docs/06` §4 fija, como regla y no como sugerencia:

> **Un control declara `minHeight`, nunca `height`.** … `height` fija está prohibida porque **recorta
> el contenido** en vez de responder a él.

Medido sobre el catálogo:

| Declaran `height` fija sobre `sizes.control`                                        | Declaran `minHeight`                                                   |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `ActionIcon` · `Button` · `Calendar` · `GlobalSearch` · `GridPicker` · `Pagination` | `Accordion` · `Header` · `Nav` · `NavLink` · `QuickAction` · `Segment` |

**Seis contra seis.** La regla se cumple en la mitad del catálogo y se incumple en la otra mitad.

**Pero la consecuencia que el doc predice no es la que ocurre.** Con `height` fija **y**
`white-space: nowrap`, una etiqueta larga no se recorta: **se sale de la caja por los lados**. Forzado
un `Button` a 120 px de ancho, el texto escapa del fondo por la izquierda y por la derecha —queda
blanco sobre el lienzo, fuera de la píldora—.

**Y no es alcanzable hoy.** Medido a 360 y 768 sobre cuatro composiciones reales: **ningún botón
desborda**. Las etiquetas del catálogo son lo bastante cortas. Por eso esto es **observación con regla
nombrada y no fallo**: le pasaría a una traducción larga o a un nombre de producto, no a lo que hay
hoy.

Se reporta igual porque la regla es explícita, el incumplimiento es exacto y la mitad del catálogo ya
la respeta — así que la divergencia es entre componentes, no entre el doc y la realidad.

---

## 4. Lo que NO se pudo juzgar

- **`MultiSelect`, `Combobox`, `Slider`, `Calendar`, `MonthPicker` y `FormField`**: sin historia de
  tallas, no entraron en la comparación geométrica.
- **`disabled`, `invalid` y `loading`** de los campos. Se midieron hover y foco; los tres estados que
  `wr-closure.md` declara sin verificar siguen sin verificarse en esta familia.
- **El tema claro y los nueve de producto.** Todo lo de arriba es `dark`.
- **La composición**, no solo las matrices: un formulario real con etiquetas, errores y ayuda.

---

## 5. Resumen

| Punto                                   | Grado       | Alcance                        |
| --------------------------------------- | ----------- | ------------------------------ |
| Coherencia entre hermanos               | **pasa**    | tres componentes, cinco tallas |
| Estados (hover, foco, borde)            | **pasa**    | cinco campos                   |
| Responsive 360 / 768                    | **pasa**    | cuatro composiciones           |
| §2.1 escala del campo más plana         | observación | familia                        |
| §2.2 inset distinto entre campo y botón | observación | catálogo — falta la regla      |
| §3 `height` fija contra `docs/06` §4    | observación | **catálogo, seis componentes** |

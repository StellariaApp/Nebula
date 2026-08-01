# WR2.3 — Acciones y navegación

> Auditoría de 15 componentes. 2026-07-31. **No se tocó código.**
>
> Dos pasadas: estática sobre los `.css.ts` y sobre el DOM renderizado (Storybook estático +
> Playwright, `getComputedStyle`, tema forzado por `?globals=theme:`), en los **cuatro temas**.
>
> **Sin paso 4 (Figma)**: §4 vacía. Medir el render no es mirarlo. Detalle en §6.

## 1. Resumen

| Origen                                  |     A |     B |     C | Hallazgo |
| --------------------------------------- | ----: | ----: | ----: | -------- |
| `NavLink`                               |     1 |     0 |     0 | A-1      |
| Transversal — dos recetas de `disabled` |     1 |     0 |     0 | A-2      |
| **Total**                               | **2** | **0** | **0** | **2**    |

Sin hallazgos, pero con **dos niveles de verificación distintos** — y la diferencia importa:

- **Medidos sobre el render en los cuatro temas y correctos** (6): `Button`, `ActionIcon`, `Segment`,
  `Pagination`, `Tabs` (delega en `Segment`), y `ButtonClose`/`ButtonCopy` por delegación en
  `ActionIcon`.
- **Solo verificados en el `.css.ts`** (7): `ButtonGroup`, `UnstyledButton`, `FileButton`, `Burger`,
  `QuickAction`, `Breadcrumbs`, `Stepper`. No aparecen en las láminas que este pase recorrió, así que
  **«sin hallazgos» aquí significa «sin medir sobre el render»**, no «correcto». Ver §6.

§3 es, en esta familia, la sección más informativa.

---

## 2. Hallazgos

### A-1 · `NavLink` es el único control de la familia cuya altura no es un peldaño, y además se mueve con el tema

Es el componente que el propietario señaló como el peor del catálogo. El foco de WR2.3 pedía un pase
propio; esto es lo que sale al medirlo.

- **Componente**: `NavLink` · **Magnitud 4** (espaciado) · **Severidad A**
- **Valores medidos** (`navigation-overview--nav-links`, altura real del `NavLink_root`):

  | Tema           | `min-height` declarado | `padding-block` | **Altura real** | ¿Es un peldaño?  |
  | -------------- | ---------------------: | --------------: | --------------: | ---------------- |
  | `nebula-dark`  |   36 px (`control.sm`) |           10 px |     **40.3 px** | **no**           |
  | `nebula-light` |                  36 px |           10 px |     **40.3 px** | **no**           |
  | `sober-light`  |                  36 px |          7.5 px |       **36 px** | sí, `control.sm` |
  | `playful`      |                  36 px |         12.5 px |     **45.3 px** | **no**           |

  Con descripción (dos líneas): 58.3 · 58.3 · 52.8 · 63.8 px.

- **Mecanismo, medido**: `NavLink.css.ts:19-21` declara `minHeight: vars.size.control.sm` pero el
  alto real lo fija el contenido, porque (a) el `padding-block` sale de `vars.space.u2_5`, que es un
  **múltiplo** de la base de espaciado —y esa base **sí** cambia por tema: los 10 / 7.5 / 12.5 px
  medidos son 2.5 × 4, 2.5 × 3 y 2.5 × 5—, y (b) la raíz **no declara `line-height`**: computa
  `normal`, la palabra clave de CSS, así que la caja de línea depende de las métricas de la fuente.
- **Valor esperado**: `docs/06` §4.1 — «**Lo interactivo va en `control`**, aunque parezca compacto» y
  «si una altura no cabe en ninguna de las dos escalas, la discusión es qué peldaño falta». Los
  peldaños son 30 / 36 / 42 / 50 / 60 y **`sizes` no se recalibra en ningún tema** (verificado: los
  cuatro importan el mismo objeto). 40.3 y 45.3 no existen en `control` ni en `compact`.
- **Consecuencia para el usuario**: un `NavLink` no alinea con nada de su propia familia, y **no falla
  igual en los cuatro temas**. Junto a un `Pagination` (36 px) y a un `Button` (42 px): en `sober`
  coincide con la paginación, en `nebula` cae entre los dos, y en `playful` sobrepasa al botón. Una
  barra lateral de ocho enlaces acumula **74 px de diferencia** entre `sober` y `playful` — el
  contenido de debajo se desplaza al cambiar de tema.
- **Contraste con sus hermanos**: `Button` mide 42 px, `ActionIcon` 42 px, `Pagination` 36 px y
  `Segment` 30/36/42/50 px — **idénticos al píxel en los cuatro temas**, porque declaran altura desde
  `sizes.control`, que no es temable. `NavLink` es el único que la deriva del espaciado, que sí lo es.
- **Temas**: los cuatro, con tres valores distintos.
- **Token propuesto**: `height` (no `minHeight`) desde `vars.size.control.*` con el padding derivado,
  como hace `Segment`; y una decisión explícita para la variante con descripción, que necesita dos
  líneas y por definición no cabe en un peldaño de una línea.

### A-2 · Dentro de esta familia conviven dos recetas de `disabled`

`docs/reviews/geometria-figma-vs-nebula-2026-07-28.md` §final ya documenta el problema **global** —
cinco recetas en el catálogo, una sola en el diseño— y **no lo repito**. Lo que aporta este pase es la
medida en los cuatro temas para los 15 de esta familia, que era el encargo del foco.

- **Componentes**: `Button` / `ActionIcon` frente a `NavLink` / `Pagination` / `Segment` ·
  **Magnitud 3** · **Severidad A**
- **Valores medidos** (`nebula-dark`; el patrón es idéntico en los cuatro):

  | Componente   | `opacity` off | `background` off                  | `color` off                             | Receta                |
  | ------------ | ------------: | --------------------------------- | --------------------------------------- | --------------------- |
  | `Button`     |      **0.55** | sin cambio (`rgb(140,155,255)`)   | sin cambio                              | atenúa la caja entera |
  | `ActionIcon` |      **0.55** | sin cambio                        | sin cambio                              | ídem                  |
  | `NavLink`    |             1 | pierde el tinte → `rgba(0,0,0,0)` | → `rgb(130,138,146)`                    | recolorea             |
  | `Pagination` |             1 | transparente en ambos estados     | `rgb(192,197,202)` → `rgb(130,138,146)` | recolorea             |
  | `Segment`    |             1 | transparente en ambos             | → `rgb(130,138,146)`                    | recolorea             |

- **Valor esperado**: una sola receta por clase de control. El archivo de diseño usa una
  (fill sólido + texto al 40 %), según §final del documento citado.
- **Consecuencia**: en una misma barra de herramientas, un `Button` deshabilitado conserva su fondo
  primario **a plena saturación** y se atenúa entero al 55 %, mientras un `Segment` deshabilitado
  mantiene su caja intacta y solo apaga el texto. No se leen como el mismo estado.
- **Lo que sí es coherente, y conviene anotarlo**: los tres que recolorean llegan **exactamente al
  mismo gris** —`rgb(130,138,146)` en dark, `rgb(87,95,102)` en light—, así que el desacuerdo es de
  receta, no de token.
- **Temas**: los cuatro, con el mismo patrón.
- **Token propuesto**: no procede resolverlo aquí — la decisión está planteada en el documento de julio
  (¿receta única o dos? ¿hace falta un rol `surface.disabled`? ¿la opacidad del texto es token?) y es
  entrada de WR3, no de esta auditoría.

---

## 3. Coherencia de familia

En esta familia la sección importante es lo que **está bien**, porque contradice la expectativa con la
que se entra: el foco daba por hecho que la familia estaría desalineada, y en altura solo lo está una
pieza.

**La escalera de control se cumple, y se cumple igual en los cuatro temas** (medido, no leído):

| Componente                    |        Altura medida | Peldaño               | Estable entre temas |
| ----------------------------- | -------------------: | --------------------- | ------------------- |
| `Button md` / `ActionIcon md` |                42 px | `control.md`          | ✅ idéntico         |
| `Button xs` / `ActionIcon xs` |                30 px | `control.xs`          | ✅ idéntico         |
| `Pagination`                  |                36 px | `control.sm`          | ✅ idéntico         |
| `Segment` sm/md/lg/xl         | 30 / 36 / 42 / 50 px | `control.xs/sm/md/lg` | ✅ idéntico         |
| `NavLink`                     |         36 – 45.3 px | **ninguno**           | ❌ (A-1)            |

Dos cosas verificadas que merecen quedar escritas para que nadie las «corrija»:

- **`Pagination` a 36 px es correcto, no un descuido.** `docs/06` §4.1 dice: «los items de una
  paginación son objetivos táctiles: usan `control` **desplazada un peldaño** — una paginación `md`
  alinea con un input `sm`». 36 px es exactamente `control.sm`. La regla se está cumpliendo al pie de
  la letra.
- **El `tab` interior de `Segment` mide menos que su control** (22/28/34/42 en nebula, 24/30/36/44 en
  sober, 20/26/32/40 en playful) y **eso también es correcto**: es el control el que declara la altura
  del peldaño, y el tab va inset por el padding, que sí es temable. Medirlo por el tab da la impresión
  falsa de que `Segment` no cumple la escala.

**Delegación bien resuelta**: `ButtonClose` y `ButtonCopy` renderizan un `ActionIcon`
(`ButtonClose.tsx:30`, `ButtonCopy.tsx:76`), así que heredan su receta de disabled y su altura sin
duplicar nada. `Tabs` delega en `Segment`. Cuatro componentes, cero criterios nuevos.

**Hueco ya conocido, no re-descubierto**: `FileButton` acepta `disabled` y lo pasa al `<input>`
(`FileButton.tsx:34`) pero no tiene `.css.ts` que lo estile — es el único hueco real de cobertura que
ya identificó el censo de julio. Se cita, no se cuenta como hallazgo nuevo.

---

## 4. Lo que el diseño resuelve y `docs/06` no dice

Vacío: el paso 4 no se ejecutó. El único material de diseño que entra en este informe es el ya
publicado en `geometria-figma-vs-nebula-2026-07-28.md` §final (la receta única de `disabled`, medida
en julio sobre `Pagination Item`, `Pill` y `Nav Tab Item`), y entra **citado**, no re-medido.

---

## 5. Pendiente de arbitraje del diseño

1. **La variante de `NavLink` con descripción.** Dos líneas no caben en un peldaño de una línea, y
   `docs/06` §4.1 no contempla controles multilínea: dice qué hacer cuando una altura «no cabe en
   ninguna de las dos escalas», pero no si un control puede legítimamente no tener altura fija. Es la
   mitad de A-1 que no puedo resolver midiendo.
2. **Las tres preguntas de `disabled`** siguen abiertas desde julio y son entrada de WR3: receta única
   o dos; si hace falta un rol `surface.disabled`; y si la opacidad del texto es token o literal.

---

## 6. No medido

| Qué                                                                                                  | Por qué                                                                                                                                                                                                                                                        |
| ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`Breadcrumbs`, `Stepper`, `Burger`, `QuickAction`, `ButtonGroup`, `UnstyledButton`, `FileButton`** | Sin medida de altura sobre el render: no aparecen en las láminas que este pase recorrió (`foundations-visual-qa-actions--*`, `navigation-*`). Solo están verificados en el `.css.ts`. **Siete de quince componentes de la familia no tienen medida de render** |
| **`focus-visible`**                                                                                  | La lámina `foundations-visual-qa-actions--focus-order` existe y **no se midió**. El anillo de foco (ADR-036, `styles/focus.css.ts`) no está verificado en ningún componente                                                                                    |
| **`loading`**                                                                                        | `docs/06` §8 lo nombra como estado de la lámina `Actions`; no se midió                                                                                                                                                                                         |
| **`hover` y `active`**                                                                               | El escalón de interacción de §5.1 (~1.08, y en `active` el doble del delta) **no se verificó en ningún control**. Requiere emular puntero                                                                                                                      |
| **El paso 1: MIRAR**                                                                                 | Nadie ha visto la familia junta. A-1 se ve a ojo en cuanto se pone un `NavLink` al lado de un `Button`; los demás defectos de alineación óptica siguen sin cubrir                                                                                              |
| **El paso 4: Figma**                                                                                 | No ejecutado                                                                                                                                                                                                                                                   |

**Lo que este informe sostiene**: dos hallazgos con valor medido en cuatro temas y consecuencia
cuantificada. **Lo que no sostiene**: que la familia esté limpia — casi la mitad de sus componentes no
se han medido sobre el render, y tres estados (`focus`, `hover`, `loading`) no se han tocado.

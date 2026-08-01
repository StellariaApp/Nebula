# WR2.8 — Efectos y DnD

> Auditoría de 10 componentes. 2026-07-31. **No se tocó código.**
>
> **Sin referencia de diseño, por contrato.** El archivo de Polaris no cubre efectos ni arrastre
> (baseline §5), así que esta familia se audita **solo** contra `docs/06` §6 y ADR-059, y su §4 va
> vacía **por diseño, no por omisión**. Es lo que el propio encargo pide declarar en vez de forzar
> comparaciones con hojas que no son de esta familia.
>
> Medido sobre el DOM renderizado en `nebula-dark`, `sober-light` y `playful` — los tres que
> discriminan aquí, porque `nebula-light` comparte con `nebula-dark` los ajustes de efectos.

## 1. Resumen

| Origen                            |     A |     B |     C | Hallazgo |
| --------------------------------- | ----: | ----: | ----: | -------- |
| `Kanban` — estados solo por color |     1 |     0 |     0 | A-1      |
| **Total**                         | **1** | **0** | **0** | **1**    |

Los dos primeros puntos del foco —degradación de `sober` y contención de `playful`— salen
**verificados y correctos** (§3). El tercero produce el único hallazgo.

---

## 2. Hallazgos

### A-1 · `Kanban` señala el destino de un arrastre solo con color; `DragDrop` no

- **Componentes**: `Kanban` frente a `DragDrop` · **Magnitud 3** · **Severidad A**
- **Valores medidos** (leídos de los `.css.ts`; los estados de arrastre solo existen durante el
  gesto):

  | Estado                     | `DragDrop`                                                                       | `Kanban`                                                                           |
  | -------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
  | origen arrastrándose       | `opacity: 0.4` + `cursor: grabbing` (`DragDrop.css.ts:20,33`)                    | —                                                                                  |
  | **destino activo**         | `background: surface.hover` **+ `outline: 1px dashed border.strong`** (`:75-78`) | `background: surface.hover` + `borderColor: border.strong` (`Kanban.css.ts:37-39`) |
  | overlay en vuelo           | `boxShadow: shadow.lg` + `radius.md` (`:119-124`)                                | —                                                                                  |
  | límite de columna superado | —                                                                                | `color: semantic.warning[700]` (`Kanban.css.ts:78`)                                |

- **Valor esperado**: el encargo de esta familia lo pide explícitamente —«los estados de arrastre se
  distinguen **sin depender solo del color**»— y es además **WCAG 2.2 criterio 1.4.1 (Use of Color)**,
  nivel A: el color no puede ser el único medio visual para transmitir información. Un destino de
  soltado y un límite de WIP superado son información.
- **Consecuencia para el usuario**: al arrastrar una tarjeta sobre una columna de `Kanban`, lo único
  que cambia es **el color del fondo y el del borde** — el borde mantiene su grosor y su estilo
  sólido. Para alguien con deficiencia de visión cromática, o en escala de grises, la columna de
  destino no se distingue de las demás. En la misma pantalla, un `SortableList` sí lo señala con un
  **contorno discontinuo**, que es un cambio de forma y se percibe sin color.
- **Lo que agrava la incoherencia**: no es que falte la idea en el sistema; **está implementada en su
  componente hermano**, en el mismo subpath `/dnd`, y no se aplicó aquí.
- **Temas**: los tres medidos. El defecto es estructural, no de tema.
- **Token propuesto**: replicar el patrón de `DragDrop`: `outline: 1px dashed vars.color.border.strong`
  con `outlineOffset: -1` en `&[data-over='true']` de la columna. Para `data-over-limit`, añadir un
  segundo canal al color de aviso —un icono o un cambio de peso—, no solo `warning[700]`.

---

## 3. Coherencia de familia

### Punto 1 del foco — `sober` neutraliza, y los gradientes sobreviven: **correcto**

Ajustes declarados por tema:

|                   | `glass.enabled` | `noiseOpacity` | `motion.tier` |
| ----------------- | --------------- | -------------: | ------------- |
| `nebula-dark`     | `true`          |           0.02 | `standard`    |
| `nebula-light`    | `true`          |        (token) | `standard`    |
| **`sober-light`** | **`false`**     |          **0** | **`minimal`** |
| `playful`         | `true`          |           0.03 | `expressive`  |

Y lo que hace el render, medido:

| Componente           | `nebula-dark`                                         | `sober-light`                                                                                 | `playful`                                 |
| -------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `GlassSurface` fondo | `rgba(15,17,25,0.56)`                                 | **`rgb(255,255,255)` opaco** ✅                                                               | `rgba(255,255,255,0.48)`                  |
| `AnimatedGradient`   | `data-animated=true`, `animation-name: DRIFT`, 7.56 s | **`false`, `animation-name: none`** ✅                                                        | `true`, `DRIFT`, 7.56 s                   |
| `GradientBackground` | `linear-gradient(135deg, rgb(140,155,…))`             | **`linear-gradient(135deg, rgb(0,105,12…))`** ✅ sigue siendo gradiente, con la paleta sobria | `linear-gradient(135deg, rgb(167,44,1…))` |
| `MeshGradientBg`     | `radial-gradient` + tinte al 24 %                     | `radial-gradient` + tinte teal al 24 % ✅                                                     | ídem, tinte naranja                       |
| `StarField` estrella | `rgb(145,65,208)`                                     | `rgb(6,193,144)`                                                                              | `rgb(250,110,157)`                        |

Las dos mitades del encargo se cumplen: **`sober` apaga el cristal** —el fondo pasa de translúcido a
sólido, que es exactamente la degradación de ADR-059— **y los gradientes no desaparecen**, solo
cambian a la paleta del tema. `AnimatedGradient` deja de animar por `motion.tier: minimal` sin dejar
de pintar su estado final, como pide `docs/06` §6.

### Punto 2 del foco — `playful` no se pasa: **correcto**

`playful` es «el tema que más fácil rompe el budget». Medido, no lo rompe:

- `GlassSurface`: alfa **0.48** frente a 0.56 de dark — mismo orden, no más agresivo.
- `MeshGradientBg`: tinte al **24 %**, idéntico en los tres temas.
- `noiseOpacity` **0.03** frente a 0.02 de dark: un punto por encima, no un salto.

Lo que sí cambia en `playful` es el **tono** (naranja/magenta frente al índigo de dark), no la
**intensidad** del efecto. Que es la distinción correcta: el tema recalibra la identidad, no el
presupuesto.

### `DragDrop`, el modelo que `Kanban` no siguió

Los tres estados de `DragDrop` usan **un canal no cromático cada uno**: el origen se atenúa
(`opacity`), el destino gana un **contorno discontinuo** (forma), y el overlay en vuelo gana
**sombra** (elevación). Es más de lo que `docs/06` exige, y es la razón de que A-1 sea una
incoherencia entre hermanos y no una carencia del sistema.

---

## 4. Lo que el diseño resuelve y `docs/06` no dice

**Vacía por contrato**, no por no haberlo intentado: el archivo de Polaris no cubre efectos ni
arrastre (`figma-baseline` §5). Esta familia no tiene hojas asignadas, así que no hay ningún C que
extraer. Es la única de las ocho donde §4 vacía es el resultado correcto.

---

## 5. Pendiente de arbitraje del diseño

1. **¿Qué cuenta como «un efecto dominante por región»?** `docs/06` §6 fija el presupuesto pero no da
   una regla operable: no dice si un `GlassSurface` que contiene un `GradientBorder` son uno o dos
   efectos, ni a qué llama «región». Sin eso, el presupuesto no es verificable — ni por una auditoría
   ni por un gate.
2. **`StarField` en `sober`.** Pinta estrellas en `rgb(6,193,144)`, un verde vivo, en el tema cuyo
   contrato apaga cristal, ruido y animación. Es coherente con su paleta —el acento de `sober` es
   teal— pero puede no serlo con la intención del tema. No lo marco como hallazgo porque **`docs/06`
   no dice que `sober` deba desaturar**, solo que degrade los efectos, y eso lo cumple.

---

## 6. No medido

| Qué                                                 | Por qué                                                                                                                                                                                                                                                                                   |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **El presupuesto de efectos en composición**        | Es el corazón del punto 2 del foco y **no es verificable con este instrumento**: «un efecto dominante por región» exige mirar composiciones reales, no componentes sueltos. Lo medido es que ningún componente individual se excede en `playful`; **no** que una pantalla no acumule tres |
| **`backdrop-filter` y `blur` reales**               | El headless **neutraliza los filtros** — verificado en WR2.7: un `blur(16px)` puesto inline computa a `blur(0px)`. Se puede afirmar que `sober` deja el fondo **opaco** (eso es `background-color`, fiable) pero **no** cuánto desenfoca `nebula-dark`. Hace falta un navegador con GPU   |
| **Los estados de arrastre en movimiento**           | A-1 sale de leer los `.css.ts`, no de arrastrar: los estados solo existen durante el gesto y no se simuló. Lo que está medido son las **reglas**, no su render                                                                                                                            |
| **`BlurOverlay`, `NoiseOverlay`, `GradientBorder`** | No aparecieron en las láminas recorridas. Tres de los diez sin medida                                                                                                                                                                                                                     |
| **`reduced-motion`**                                | Solo se verificó la degradación por `motion.tier`. El `@media (prefers-reduced-motion)` no se forzó en ningún tema                                                                                                                                                                        |
| **El paso 1: MIRAR**                                | Nadie ha visto los efectos juntos. El presupuesto de §6 es, por definición, un juicio visual                                                                                                                                                                                              |

**Lo que este informe sostiene**: la degradación de ADR-059 funciona en los dos ejes y en los tres
temas medidos, y hay una incoherencia real entre `Kanban` y `DragDrop` con criterio WCAG detrás.
**Lo que no sostiene**: que el presupuesto de efectos se respete en composición, que es justo lo que
§6 regula.

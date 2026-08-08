# WR3.1 — Consolidado de la auditoría visual

> 2026-08-01. Consolida los ocho informes de `docs/reviews/visual-audit/`. **No audita componentes
> nuevos y no toca código.**
>
> Los ocho informes de familia llevan fecha 2026-07-31; se ejecutaron en la sesión anterior a esta.

## 1. Recuento

| Familia                      | Componentes |      A |      B |     C | Cobertura de render          |
| ---------------------------- | ----------: | -----: | -----: | ----: | ---------------------------- |
| WR2.1 Layout y superficie    |          20 |      4 |      5 |     0 | 20/20 (parcial por magnitud) |
| WR2.2 Tipografía y contenido |          13 |      2 |      2 |     0 | 13/13                        |
| WR2.3 Acciones y navegación  |          15 |      2 |      0 |     0 | **6/15**                     |
| WR2.4 Campos de formulario   |          27 |      3 |      1 |     0 | **9/27**                     |
| WR2.5 Colecciones y overlays |          15 |      2 |      1 |     0 | **3/15**                     |
| WR2.6 Datos y feedback       |          32 |      2 |      1 |     0 | **5/32**                     |
| WR2.7 Fechas y media         |          13 |      1 |      1 |     0 | **2/13**                     |
| WR2.8 Efectos y DnD          |          10 |      1 |      0 |     0 | 7/10                         |
| **Total**                    |     **145** | **17** | **11** | **0** | **~65/145**                  |

**Los cero C son estructurales, no un resultado.** El paso 4 del método —abrir las hojas de `.figma/`
con `tools/figma-measure/`— **no se ejecutó en ninguna de las ocho familias**. Todo el cubo de
ESPECIFICACIÓN de este consolidado sale de huecos detectados contra `docs/06`, no del diseño.

## 2. Las causas

28 hallazgos, **16 causas**. Un plan por componente serían 145 tareas; por hallazgo, 28. Por causa
son 16, y seis de ellas cruzan familias.

| #       | Causa                                                            |     Comp. | Familias              | Cubo                 |
| ------- | ---------------------------------------------------------------- | --------: | --------------------- | -------------------- |
| **C1**  | Geometría escrita en literales de píxel: no responde al tema     |         6 | 2.1 · 2.2 · 2.4 · 2.6 | CALIBRACIÓN          |
| **C2**  | Peldaños que no existen en `sizes.control` ni en `sizes.compact` |         3 | 2.2 · 2.4 · 2.6       | **CONTRATO**         |
| **C3**  | Un control interactivo dimensionado con `compact`                |         1 | 2.4                   | CALIBRACIÓN          |
| **C4**  | El escalón entre niveles de superficie no está especificado      |       ~12 | 2.1 · 2.5             | ESPECIFICACIÓN       |
| **C5**  | La escalera de sombras del código no es la de §5                 |         8 | 2.1 · 2.5             | ESPECIFICACIÓN       |
| **C6**  | Separador y borde no calibrados por proporción entre esquemas    |         3 | 2.5                   | CALIBRACIÓN          |
| **C7**  | Dos criterios de borde para el mismo nivel de elevación          |         5 | 2.1 · 2.6             | CALIBRACIÓN          |
| **C8**  | Altura declarada con `minHeight` que el contenido desborda       |         2 | 2.3 · 2.4             | ESPECIFICACIÓN       |
| **C9**  | Cinco recetas de `disabled` en el catálogo                       |        14 | 2.3                   | **CONTRATO**         |
| **C10** | La prosa de CMS no usa la escala tipográfica del catálogo        |         3 | 2.2                   | ESPECIFICACIÓN       |
| **C11** | Ritmos y labels de campo fuera de lo que fija §2–§3              |         2 | 2.2 · 2.4             | CALIBRACIÓN          |
| **C12** | Tres criterios para dimensionar el código                        |         3 | 2.2                   | ESPECIFICACIÓN       |
| **C13** | Las derivaciones de color no aceptan gradientes                  |         2 | 2.7                   | **CONTRATO**         |
| **C14** | Estados que dependen solo del color                              |         2 | 2.7 · 2.8             | CALIBRACIÓN + ESPEC. |
| **C15** | Regresión de superficie en `Paper`                               |         1 | 2.1 · 2.6             | CALIBRACIÓN          |
| **C16** | La lámina de QA no ejerce ningún valor por defecto               |         — | 2.1                   | CALIBRACIÓN (método) |
| **C17** | La dirección de hover está horneada en el resolver               | 7 escalas | —                     | **CONTRATO**         |

C17 no sale de WR2 sino de `vibrancia-dark-vs-light-2026-07-31.md`, la investigación que el
propietario pidió el mismo día. Entra aquí porque es del mismo cubo y del mismo checkpoint.

### 2.1 Las seis causas que cruzan familias

Son la señal más valiosa: **significan un hueco del sistema, no un componente mal escrito**.

**C1 · Geometría en literales** — `Kbd` (WR2.2 A-2), `Slider`/`RangeSlider` (WR2.4 A-2), `Tag`
(WR2.6 A-2), `Indicator` (WR2.6 A-1), y los z-index de `AppShell` y `Main` (WR2.1 B-2). Cuatro
familias distintas, un síntoma idéntico y medible: **los valores salen iguales al píxel en todos los
temas**. Dos consecuencias derivadas que se creían independientes:

- **Texto bajo el suelo de 12 px de §2**: `Kbd` 10 y 11 px; `Indicator` 8, 9, 10 y 11 px.
- **Objetivos táctiles bajo los 24 px CSS de §4**: pulgar de `Slider` 12–20 px (16 en el tamaño por
  defecto), estrellas de `Rating` 20 px.

**C4 · El escalón de superficie no está especificado** — es el hueco más grande que encontró la fase.
`docs/06` da **1.08** para el escalón de interacción (§5.1) y **1.3–1.4** para el separador (§5.2),
pero **no dice cuánto debe separar un nivel de elevación del siguiente**. Medido:

| Par                                     |                      Relación | Familia |
| --------------------------------------- | ----------------------------: | ------- |
| `AppShell` header/navbar/aside ↔ lienzo | 1.012 · 1.017 · 1.073 · 1.017 | 2.1 A-4 |
| `Modal` contenedor ↔ cuerpo             |      1.062 (los dos esquemas) | 2.5 B-1 |
| `Paper` por defecto ↔ lienzo            |                     **1.000** | 2.1 A-1 |

Los escalones de superficie del sistema son **más pequeños que su propio escalón de hover**. Ningún
valor incumple una regla escrita porque esa regla no existe.

**C5 · La escalera de sombras** — `Popover`, `Menu`, `Dialog`, `HoverCard` y `Header floating`
comparten `shadow.lg`; `Modal` usa `xxl`; `Drawer` y las cuatro regiones de `AppShell` no usan
ninguna. §5 pide `sm`/`md`/`lg` para los niveles 2/3/4. **Y la lámina `Foundations/Surfaces` declara
`xs/sm/md/lg`, que coincide con §5 y no con el código**: la lámina y los componentes que representa
llevan meses discrepando sin que nadie los cruce.

**C7 · Dos criterios de borde** — `Paper` y `Card` usan `border.default`; `AppShell`, `Section` y
`Panel` usan `border.subtle`. §5 dice «border sutil» para los niveles 1 y 2. La card se separa del
fondo con un borde **más fuerte** que el del shell que la contiene.

**C9 · `disabled`** — cinco recetas (censo de `geometria-figma-vs-nebula-2026-07-28.md` §final),
dos de ellas conviviendo en la familia de acciones: `Button`/`ActionIcon` atenúan la caja entera con
`opacity: 0.55`; `NavLink`, `Pagination` y `Segment` mantienen la caja y solo recolorean. Los tres que
recolorean llegan **al mismo gris** (`rgb(130,138,146)` en dark), así que el desacuerdo es de receta,
no de token.

**C14 · Estados solo por color** — `Kanban` señala el destino de un arrastre y el límite de WIP solo
con color, mientras `DragDrop` —su hermano en el mismo subpath— añade un contorno discontinuo
(WR2.8 A-1). Y las dos primeras series de un gráfico tienen relación de luminancia **1.04** pese a
Δrgb de 235 (WR2.7 B-1): tonos muy distintos, casi la misma claridad. Es WCAG 1.4.1 en los dos casos.

## 3. Los tres cubos

### a. CALIBRACIÓN — 8 causas, ejecutables sin preguntar

C1 (parcialmente, ver bloqueo), C3, C6, C7, C11, C14 (la mitad de `Kanban`), C15, C16.

### b. CONTRATO — 4 causas presentadas · **resuelto el 2026-08-01 en 2 ADRs**

> **C2 salió del cubo**: el propietario decidió corregir `Tag`, `Kbd` y `Slider` a los peldaños
> existentes en vez de ampliar `sizes.compact`. Sin ADR, y **T4 queda desbloqueado**.
> **C9 → ADR-063** (dos recetas + rol `surface.disabled`). **C13 + C17 → ADR-064** (un solo ADR: las
> derivaciones reciben color y la dirección de hover deja de estar horneada).
> Lo que sigue es lo que se presentó.

| #       | Qué falta en `NebulaTheme`                                                                  | A cuántos afecta                                                 |
| ------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **C2**  | Peldaños intermedios en `sizes.compact` (18, 22, 26, 34, 38) o la decisión de que no faltan | `Tag`, `Kbd`, `Slider`                                           |
| **C9**  | Un rol `surface.disabled` y/o una opacidad de texto deshabilitado tokenizada                | 14 componentes                                                   |
| **C13** | Que las derivaciones (`color-mix`, `WithAlpha`) reciban siempre un color, no un gradiente   | `Calendar`, `RangeCalendar` y todo lo que derive de `variantMap` |
| **C17** | Dirección de hover por variante en `VariantRecipe`                                          | las 7 escalas de todo tema `dark`                                |

**Ver si en realidad son una**: C13 y C17 son la misma familia de problema —el resolver hace
suposiciones sobre lo que `variantMap` le va a dar—, así que probablemente se resuelvan en el mismo
ADR. C2 y C9 son independientes entre sí y de esos dos.

### c. ESPECIFICACIÓN — 6 causas, enmiendan `docs/06`

C4 (escalón de superficie), C5 (escalera de sombras: decidir si gana §5 o el código), C8
(¿`minHeight` o `height` en un control?), C10 (¿la prosa larga puede tener escala propia?), C12
(cómo se dimensiona el código), C14-charts (criterio de separación entre series categóricas).

**Ninguna sale de un hallazgo C**, porque no hay hallazgos C. Salen de que `docs/06` **calla** donde
los componentes discrepan — que es la otra mitad de lo que la fase buscaba.

## 4. Orden por dependencia

Un plan ordenado por severidad haría trabajo que luego se tira. El orden real:

```
T0  C15 + C16          sin bloqueos · lo más barato y lo que protege el resto
      ↓
T1  CHECKPOINT DE CONTRATO (C2 · C9 · C13 · C17)    ← bloquea T4 y parte de T5
      ↓
T2  ESPECIFICACIÓN (C4 · C5 · C8 · C10 · C12 · C14-charts)  ← bloquea T3
      ↓
T3  CALIBRACIÓN de superficie (C6 · C7)
      ↓
T4  CALIBRACIÓN de geometría (C1 · C3)              ← depende de C2
      ↓
T5  CALIBRACIÓN de campos, texto y estados (C11 · C14-Kanban)
```

Lo que bloquea a qué, explícito:

- **C2 bloquea C1** para `Tag`, `Kbd` y `Slider`: no se puede sustituir un literal por un token que no
  existe. Sí se puede ejecutar C1 para los z-index de `AppShell`/`Main`, cuyo token sí existe.
- **C4 bloquea C6 y C7**: recalibrar bordes y separadores sin saber cuánto debe separar un nivel del
  siguiente es elegir un número al azar. C4 fija la escala; C6 y C7 la aplican.
- **C5 bloquea la mitad de C4**: si la escalera de sombras cambia, el escalón de superficie necesario
  cambia con ella — en dark el paso lo carga la superficie **porque** la sombra no llega (§5).
- **C15 no bloquea nada y arregla la superficie del nivel 1 con una línea.** Va primero por eso.
- **C16 va con C15**: la lámina que no ejerce defaults es **la razón de que C15 sobreviviera** a un
  cierre de tramo con todos los gates en verde. Arreglar el defecto sin arreglar el detector deja el
  siguiente igual de invisible.

## 5. Decisiones que bloquean el plan

**Numeradas, para el checkpoint. Ninguna la puede tomar esta auditoría.**

1. **¿Se amplía `sizes.compact` con peldaños intermedios, o se corrigen `Tag`/`Kbd`/`Slider` a los
   peldaños existentes?** (C2) — §4.1 dice que «la discusión es qué peldaño falta». Ampliar toca los
   cinco temas, el schema Zod y la paridad native.
2. **¿`disabled` tiene una receta o dos, y hace falta un rol `surface.disabled`?** (C9) — pendiente
   desde julio. Afecta a 14 componentes y al baseline de ADR-037.
3. **¿La opacidad del texto deshabilitado es token o se expresa con `text.muted`?** (C9, segunda
   mitad).
4. **¿Se prohíben los gradientes en `variantMap.primary`, o toda derivación resuelve el gradiente a
   un color antes de operar?** (C13).
5. **¿`VariantRecipe` gana una dirección de hover por variante?** (C17) — es lo único que permite
   igualar el color de dark al de light conservando §5.1.
6. **¿Cuánto debe separar un nivel de elevación del siguiente?** (C4) — el hueco más grande. Sin un
   número, T3 no se puede ejecutar.
7. **¿Gana §5 o gana el código en la escalera de sombras?** (C5) — hoy la lámina de QA dice una cosa
   y los componentes otra.
8. **¿La prosa larga puede tener una escala propia?** (C10) — si sí, `TypographyStylesProvider` no
   tiene defecto y hay que escribirlo; si no, es un hallazgo A.
9. **¿Un control puede legítimamente no tener altura fija?** (C8) — la variante de `NavLink` con
   descripción necesita dos líneas y por definición no cabe en un peldaño.

## 6. Impacto en el baseline de ADR-037

**El screenshot diff se captura después de T5.** Qué cambia de aspecto en cada tramo:

| Tramo                       | Componentes que cambian de aspecto                                                                           | Alcance                                         |
| --------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| T0                          | `Paper` **y todo lo que lo use como superficie**                                                             | Amplio: `Paper` es el primitivo de nivel 1      |
| T3                          | `Paper`, `Card`, `AppShell`, `Section`, `Panel`, `Modal`, `Drawer`, `Menu`, `Popover`, `Dialog`, `HoverCard` | El más amplio de todos: toca la escalera entera |
| T4                          | `Kbd`, `Tag`, `Indicator`, `Slider`, `RangeSlider`, `Rating`                                                 | Acotado, pero cambia densidad                   |
| T5                          | `FormField` (y con él los 27 campos), `Spoiler`, `Kanban`                                                    | `FormField` propaga a toda la familia 2.4       |
| Si se aprueba la decisión 2 | 14 componentes más, en su estado `disabled`                                                                  | Transversal                                     |

**Si algún tramo se pospone, esto queda contaminado**: capturar antes de T3 deja el baseline con la
escalera de elevación vieja, y como T3 toca once componentes de tres familias, regenerarlo después no
es un ajuste — es rehacerlo. **T3 es el que manda sobre la fecha de captura.**

## 7. Lo que no se va a hacer, y por qué

Escrito aquí para que no desaparezca del plan sin explicación:

- **Los hallazgos C no existen.** No es que se descarten: **no se produjeron**, porque el paso 4 no se
  ejecutó. Si se quiere el cubo de ESPECIFICACIÓN alimentado por el diseño y no solo por los huecos
  de `docs/06`, hace falta ejecutar WR1.2b y volver a pasar por las hojas de `.figma/`.
- **`StarField` con los efectos apagados** pinta estrellas en verde vivo en un tema que apaga cristal, ruido y
  animación (WR2.8 §5). **No se marcó como hallazgo** y no entra en el plan: `docs/06` no dice que
  un tema así deba desaturar, solo que degrade los efectos, y eso lo cumple.
- **`Card` ≡ `CardComplex`** se verificó y **es correcto**: es el contrato de C1-Q4. No se toca.
- **`Pagination` a 36 px** es correcto (§4.1, «una paginación `md` alinea con un input `sm`»). No se
  toca — queda escrito porque parece un defecto y no lo es.

## 8. La frontera de confianza

Agregado de las ocho secciones §6. **Es la parte del informe que dice qué no sabemos.**

| Qué                                                                   | Alcance                                                                                                                                                                                                                     |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **El paso 1 del método: MIRAR**                                       | **No se hizo en ninguna familia.** Las ocho midieron el render con `getComputedStyle`; ninguna lo miró. Ritmo, alineación óptica y «si una composición se lee» siguen sin cubrir — y ese era el motivo declarado de la fase |
| **El paso 4: Figma**                                                  | No ejecutado en ninguna familia. De ahí los cero C                                                                                                                                                                          |
| **~80 de 145 componentes sin medida de render**                       | Concentrados en 2.5 (12 sin medir), 2.6 (25) y 2.7 (11)                                                                                                                                                                     |
| **`backdrop-filter` y `blur` reales**                                 | **No medibles con este instrumento**: el headless neutraliza los filtros — un `blur(16px)` inline computa a `blur(0px)`. Se sabe que con glass off el fondo queda opaco; **no** cuánto desenfoca `nebula-dark`              |
| **Tres encargos del foco sin hacer**                                  | Las cuatro listas de opciones (2.5), el ritmo con controles altos (2.4), y las seis series de charts en los cuatro temas (2.7)                                                                                              |
| **`hover`, `active`, `focus-visible`, `loading`**                     | El escalón de interacción de §5.1 **no se verificó en ningún control** del catálogo                                                                                                                                         |
| **`Countdown`, `ScrollProgress`, `EditorImage`, `ColorSchemeScript`** | Sin lámina: no auditables. Es el hallazgo 5 del censo de WR1.1, que quedó abierto por decisión del propietario                                                                                                              |
| **Cuatro falsos positivos descartados**                               | El `backdrop-filter`, los dos del `Calendar` y las seis series resueltas fuera de ámbito. Documentados en sus informes para que la próxima auditoría no los reencuentre                                                     |

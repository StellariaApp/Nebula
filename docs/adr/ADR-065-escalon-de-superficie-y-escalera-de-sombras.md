# ADR-065 — El escalón de superficie y la escalera de sombras

- **Estado**: **aceptada** · 2026-08-01 (checkpoint de ESPECIFICACIÓN de WR4/T2)
- **Resuelve**: las causas **C4** y **C5** de `docs/reviews/visual-audit-2026-08-01.md`. Se deciden
  juntas porque son la misma: la escalera de sombras se desvió **para compensar** un escalón de
  superficie que no existía.
- **Enmienda**: `docs/06-visual-language.md` §5, que describe cinco niveles y su tratamiento pero
  **no dice cuánto separa uno del siguiente**, y cuya asignación de sombras el catálogo lleva meses
  contradiciendo.
- **Alcance**: los cinco temas oficiales (rol `surface.*`), once componentes de tres familias y la
  lámina `Foundations/Visual QA/Surfaces`. Desbloquea el tramo **T3** y la calibración pendiente de
  [ADR-063](ADR-063-estado-disabled-dos-recetas-y-rol-de-superficie.md).

## Contexto

### Lo que se midió

`docs/06` §5 reparte cinco niveles sobre cuatro roles de superficie, pero nunca fijó la magnitud del
escalón. Medido sobre los valores de token de los cuatro temas oficiales (relación de luminancia
WCAG, no sobre el render, para aislar el contrato del componente):

| Par de roles         | nebula-dark | nebula-light |
| -------------------- | ----------: | -----------: |
| `sunken` → `base`    |       1.062 |        1.062 |
| `base` → `raised`    |   **1.012** |    **1.017** |
| `raised` → `overlay` |   **1.012** |    **1.017** |
| `base` → `overlay`   |   **1.000** |    **1.000** |
| `base` → `hover`     |       1.062 |        1.062 |

Dos hechos que la auditoría de WR2 no reportó:

1. **`surface.overlay` es el mismo hex que `surface.base` en los dos temas.** No es un
   escalón pequeño: es **ratio 1.000**. Un `Menu`, un `Popover`, un `Dialog`, un `Modal` y el
   skip-link de `AppShell` pintan **exactamente el color del lienzo** sobre el que flotan. Lo único
   que los separa es el borde y la sombra.
2. **El escalón de nivel es menor que el de interacción en los cuatro temas.** §5.1 fija el hover en
   **~1.08**. Todos los escalones de superficie medidos caen entre 1.012 y 1.073. Es decir: **mover
   el ratón sobre una tarjeta cambia su superficie más que subirla un nivel entero de elevación.**

Se verificó que no es un artefacto de medida: `effects.gradients.surface` está declarado en los
cuatro temas pero **no lo consume ningún componente del catálogo**, así que ninguna superficie por
defecto se pinta con gradiente y el colapso es real a nivel de token. Es la trampa 1 del README de
`tools/render-measure/`, descartada aquí explícitamente.

### La escalera de sombras, censada

`docs/06` §5 y la lámina `Foundations/Visual QA/Surfaces` **coinciden**: nivel 1 → `xs`, 2 → `sm`,
3 → `md`, 4 → `lg`. El catálogo hace otra cosa:

| Nivel | Lo que dice §5 | Lo que hace el catálogo                                                              |
| ----: | -------------- | ------------------------------------------------------------------------------------ |
|     3 | `md`           | **`lg`** en `Menu`, `Popover`, `Select`, `DatePicker`, `ColorPicker`, `HoverCard`    |
|     3 | `md`           | `md` en `Tooltip`, `FieldError` y el tooltip de `Charts` — los únicos que la cumplen |
|     4 | `lg`           | `lg` en `Dialog`, `Toast` y `Header` flotante · **`xxl`** en `Modal` **y `Drawer`**  |

**Corrección a la premisa del plan**: el plan de alineación afirma que `Drawer` no declara sombra.
No es cierto — `Drawer` renderiza `Modal` (`Drawer.tsx`), así que hereda su `xxl`. Quien no declara
sombra es `AppShell`, y eso es correcto: es el nivel 0.

El patrón es sistemático: el catálogo está **un peldaño por encima** del spec en el nivel 3 y **dos**
en `Modal`/`Drawer`. Y esa desviación tiene una explicación mecánica, no estética: **si la superficie
del overlay es idéntica al lienzo, la sombra es lo único que queda para separarlo**. Subirla es la
respuesta correcta a un sistema roto — y es exactamente lo que la primera regla de §5 prohíbe: «no
apilar sombras para compensar superficies indistinguibles».

## Decisión

### 1. El escalón mínimo entre niveles adyacentes es **1.08**

Relación de luminancia, **en los dos esquemas**, entre los roles de superficie de dos niveles
adyacentes — incluido el par `sunken`↔`base`.

El número **no se inventa**: es la magnitud que §5.1 ya fija para el hover. La regla que lo justifica
es una sola frase, y es verificable:

> **Un escalón de elevación nunca separa menos que un escalón de hover.**

Si subir un nivel se nota menos que pasar el ratón por encima, la escalera no es una jerarquía. Hoy
los cuatro temas están invertidos.

### 2. Ningún par de niveles comparte color exacto

`surface.overlay` ≠ `surface.base`, en todos los temas. Es un caso particular de la regla anterior,
pero se escribe aparte porque es el defecto concreto que hay que cerrar y porque un tema de terceros
puede reintroducirlo trivialmente.

### 3. Es el mismo número en los dos esquemas, y es alcanzable

`docs/06` §5.2 advierte que el espejo de paleta no funciona para el separador, y es cierto para
`gray`. Pero para las paletas neutras `dark` y `light` **sí**: son simétricas en ratio, verificado
peldaño a peldaño.

| Contra el peldaño 50 |   200 |   300 |   400 |   500 |   600 |   700 |
| -------------------- | ----: | ----: | ----: | ----: | ----: | ----: |
| paleta `dark`        | 1.032 | 1.062 | 1.098 | 1.142 | 1.202 | 1.264 |
| paleta `light`       | 1.035 | 1.062 | 1.110 | 1.150 | 1.203 | 1.260 |

Por eso un único número sirve para los dos esquemas sin recaer en el espejo que §5.2 descarta: **la
simetría aquí es de proporción, que es justo lo que §5.2 pide.**

Una escalera conforme **existe dentro de las paletas actuales**, sin ampliar el contrato. Para
`nebula-dark`, `base`=`dark.50` → `raised`=`dark.400` (1.098) → `overlay`=`dark.600` (1.095).

### 4. La escalera de sombras vuelve a `docs/06` §5, y se hace vinculante

| Nivel | Rol                | Sombra              | Componentes                                                                                    |
| ----: | ------------------ | ------------------- | ---------------------------------------------------------------------------------------------- |
|     0 | canvas / sunken    | ninguna             | `AppShell`, `Main`                                                                             |
|     1 | card / panel       | `xxs`/`xs` opcional | `Paper`, `Card`, `Section`, `Panel`, `Kanban` card                                             |
|     2 | elevado / sticky   | `sm`                | `Header` fijo, cabeceras pegajosas                                                             |
|     3 | dropdown / popover | `md`                | `Menu`, `Popover`, `Select`, `DatePicker`, `ColorPicker`, `HoverCard`, `Tooltip`, `FieldError` |
|     4 | modal / drawer     | `lg`                | `Modal`, `Drawer`, `Dialog`, `Toast`, `Header` flotante                                        |

`Modal` y `Drawer` bajan de `xxl` a `lg`; los seis overlays del nivel 3 bajan de `lg` a `md`.

**Condicionado a que T3 entregue primero el escalón del punto 1.** El orden importa y no es
negociable: bajar la sombra antes de subir la superficie deja los overlays **menos** separados que
hoy. La sombra se baja porque la superficie ya separa, no porque el documento lo diga.

Los peldaños `xl` y `xxl` siguen existiendo en la escala y siguen disponibles para `Paper`, `Card` y
`GlassSurface`, que exponen `shadow` como prop del consumidor. Lo que deja de existir es su uso como
**nivel estructural** del catálogo.

## Alternativas

- **Gana el código: §5 y la lámina se reescriben a `lg`/`xxl`.** Cambia dos documentos en vez de once
  componentes y el catálogo queda estable hoy mismo. Descartada en el checkpoint: consagra la
  compensación por sombra como norma justo cuando se ha medido su causa, y si T3 sube el escalón de
  superficie el resultado es elevación de más — habría que volver a bajarla.
- **Escalón ≥1.06 (dos peldaños de paleta).** Iguala el `sunken`→`base` que ya existe y preserva
  mejor el casi-negro de `nebula-dark`. Descartada: deja el escalón de nivel **por debajo** del de
  hover, o sea reduce la inversión medida sin corregirla.
- **Escalón ≥1.12.** Separación cómoda incluso con luz ambiente. Descartada: en dark empuja `overlay`
  hasta `dark.600`/`700`, visiblemente más claro que el casi-negro de ADR-020, y cambia el carácter
  del tema por defecto.
- **Un número por esquema.** Era la sospecha de partida, porque §5.2 avisa de que las superficies
  dark están comprimidas contra el negro. La medida de las dos paletas neutras la descarta: son
  simétricas en ratio, así que dos números serían dos formas de escribir el mismo.
- **Híbrido: forma del spec pero `Modal` conserva un peldaño superior (`xl`).** Formaliza lo que el
  código ya distingue. Descartada por ahora: con el escalón del punto 1 en su sitio, `Modal` ya se
  separa por superficie **y** por backdrop; el peldaño extra vuelve a ser compensación.

## Consecuencias

- **Los cinco temas oficiales recalibran `surface.base`, `raised` y `overlay`.** Es un cambio de
  valores, no de contrato: no aparecen roles nuevos.
- **Los temas light tienen que hacer sitio hacia abajo.** Es la consecuencia menos obvia y la que más
  trabajo da a T3: en un tema claro extremo, `surface.raised` ya es **blanco puro**, así que el nivel 3 no
  tiene ningún recorrido por encima. Con un escalón de 1.08, un `raised` conforme no puede pasar de
  luminancia 0.9222, y hoy `gray.50` está en 0.9289. La escalera light se construye **bajando el
  lienzo**, no subiendo el overlay. `nebula-light` tiene el mismo problema en su forma
  extrema: lienzo blanco con tarjetas casi blancas.
- **Once componentes de tres familias cambian de aspecto** — es el tramo más amplio del plan y **manda
  sobre la fecha de captura del baseline de ADR-037**, que se captura después de T3 y T5.
- **Desbloquea ADR-063**, cuyas consecuencias terminaban diciendo que la calibración de
  `surface.disabled` dependía «del escalón de superficie que fije el tramo T2, que a día de hoy sigue
  sin número». Ya tiene número.
- **`check:contrast` no cubre esto y seguirá sin cubrirlo.** El gate mide texto sobre fondo, no fondo
  contra fondo. Un escalón de superficie roto pasa los cinco temas en verde — como pasó. Cerrar el
  hueco con un check de escalón queda propuesto, no decidido, y va a la deuda de la fase.
- **Lo que este ADR no decide**: qué peldaño exacto toma cada rol en cada tema. Da el número que hay
  que cumplir y demuestra que hay solución dentro de las paletas actuales; la asignación es T3.

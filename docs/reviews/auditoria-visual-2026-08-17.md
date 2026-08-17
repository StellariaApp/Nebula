# Auditoría visual del catálogo — consolidado · 2026-08-17

> **Fase 2 de VA1.** Entregable que el encargo pide: hallazgos por gravedad, los que son de catálogo,
> lo que no se pudo juzgar, y el veredicto sobre si el aspecto está estable.
>
> Se apoya en la [auditoría del sistema](auditoria-sistema-2026-08-16.md) (fase 1) y en los cuatro
> informes de familia. Alcance de [la rúbrica](rubrica-auditoria-visual.md) §0: **el color queda
> fuera**; un hallazgo de color se reporta pero no lleva propuesta.

## Método, y qué lo distingue del gate

Storybook estático servido e instrumentado con Playwright, en tres registros que ninguna lámina da:

1. **Geometría real del DOM**, con cada valor nombrado contra la escala del tema. La conclusión es
   «esto no sale de la escala», no «esto me parece raro». Incluye un chequeo generalizado del defecto
   del `Tag`: **hijo interactivo más alto que la altura declarada de su padre**.
2. **Estados en vivo** —reposo, hover, foco por teclado, press— **con motion ACTIVO**. Es el hueco
   doble que el gate 8 tiene por construcción (corre bajo `prefers-reduced-motion`) y que
   `wr-closure.md` declara sin cubrir en ningún control.
3. **Barrido responsive** a 360 y 1280 sobre 136 historias.

## Veredicto

**El catálogo está mejor construido de lo que la fase 1 hacía temer, y sus defectos se concentran en
tres sitios muy concretos.**

Lo que pasa, y no es poco: la geometría sale de la escala **sin un solo píxel huérfano** en las
familias medidas; tres componentes de campo distintos dan valores **idénticos** peldaño a peldaño; el
contrato de reduced-motion se cumple en los siete componentes que animan; y de las 136 historias
barridas a escritorio **solo una esconde un defecto real** (§1.2).

Lo que falla se agrupa así:

- **A 360 px se rompe el layout.** Es donde se concentra el daño; a 1280 el catálogo aguanta.
- **Dos variantes no dan feedback** —`glass` y `gradient`— y es el único hallazgo de catálogo que
  estaba dentro de alcance sin arreglar.
- **Las escalas tienen huecos que los componentes pagan**: un peldaño de 8 px que no existe, un
  peldaño entre 28 y 32 que tampoco.

---

## 1. Hallazgos de CATÁLOGO

Los que valen por veinte hallazgos sueltos.

### 1.1 · ALTO · `glass` y `gradient` no respondían al puntero — **arreglado**

Verificado dos veces por caminos distintos: en la matriz de 49 celdas las dos filas son **idénticas en
las siete escalas**, y recorridos en vivo **ninguna de las dos cambia** fondo, borde ni sombra al pasar
el ratón. El press sí responde, así que no están muertas — pero hasta pulsarlas no dan señal de ser
accionables.

**Causa única**: su fondo no es una referencia `scale.*` —`glass` resuelve `surface.overlay`,
`gradient` resuelve `gradient.brand`— y el hover está implementado desplazando un peldaño de escala.
No hay peldaño que desplazar.

**Y el gate lo excluye por la misma condición**: `pairs.ts:105` se salta el par de hover con
`!background.startsWith("scale.")`. **Las dos sin hover son las dos que el gate no mira.**

Nielsen, _visibilidad del estado del sistema_. **La mitad del hallazgo —el hover— no es de color.**

**Aplicado el 2026-08-17.** `Button`, `ActionIcon` y `QuickAction` levantan el elemento **−2 px** al
pasar el puntero cuando su hover resuelve al mismo fondo que su reposo. El condicional no nombra
variantes —es `resolved.background === resolved.backgroundHover`—, así que **generaliza a cualquier
variante futura** que caiga en el mismo caso. Verificado en vivo: se mueven `glass` y `gradient`, y
solo esas dos.

Usa `transform`, que es lo que `docs/03` §2 regla 1 permite en hot paths, y **no toca un solo color**.
Queda abierta la mitad cromática: las dos variantes siguen ignorando la prop `color`.

### 1.2 · MEDIO · A 360 px se rompe el layout; a 1280 solo queda un defecto real

136 historias × 2 anchos. **13 hallazgos a 1280 y 15 a 360**, pero el número bruto engaña: de los 13
de escritorio, **seis son el falso positivo del radio de `Segment`** (§3), cuatro son estrellas
decorativas de `StarField` y un carrusel que scrollea por diseño, y uno es una lámina de matriz.
**Queda uno solo, y es real**:

> `Data/DataGrid` · un elemento declaraba **24 px** y su hijo medía **28**. Era exactamente la misma
> clase de defecto que el `Tag` de §2 — y **resultó ser el mismo `Tag`** dentro de una celda de
> estado. Lo cerró ADR-162 sin tocar `DataGrid`: verificado, ya no hay anidados que desborden.

A 360 el cuadro es distinto y peor: cuatro historias con **scroll horizontal de página**:

| historia                            | documento a 360 |
| ----------------------------------- | --------------- |
| `Layout/Shell` · Default            | **604 px**      |
| `Navigation/Overview` · Composition | **686 px**      |
| `Motion/Reveal` · Variants          | desborda        |
| `Foundations/QA/Actions` · Sizes    | desborda        |

En `Shell`, el carril de navegación y el contenido quedan **lado a lado** en vez de superponerse: la
página arranca en 610 px con un viewport de 360. Los otros cinco casos —`Media/Carrusel`, `Search`,
`Segment` en composición, `StarField`, `Effects/Gradientes`— tienen contenido fuera de pantalla sin
que el documento scrollee, lo que apunta a contenedores que sí recortan.

**Dos de los cuatro son historias de matriz** —`Reveal Variants` pone siete presets en fila,
`QA/Actions` cinco botones— y ahí el desborde es de la lámina, no del componente.

### 1.3 · MEDIO · Las escalas tienen huecos que los componentes pagan

Dos, y los dos aparecieron dentro de un componente antes que en la escala:

- **No existe el peldaño de 8 px.** Con `unit = 4`, el multiplicador 2 no está en ninguno de los 14
  miembros. Se ve en `Button`, cuyo `gap` salta **×3** entre `md` (4 px) y `lg` (12 px).
- **No existe nada entre 28 y 32.** `control` va 20 → 28 y `compact` 28 → 32. Por eso al `Tag` le
  quedan 2 px de desborde que **no se pueden cerrar**: haría falta un hijo de 26 o un padre de 30.

`docs/06` §4 lo anticipa: «si una altura no cabe en ninguna de las dos escalas, la discusión es **qué
peldaño falta**».

### 1.4 · BAJO · `height` fija contra `docs/06` §4, en seis de doce componentes

`ActionIcon`, `Button`, `Calendar`, `GlobalSearch`, `GridPicker` y `Pagination` declaran `height`;
`Accordion`, `Header`, `Nav`, `NavLink`, `QuickAction` y `Segment` declaran `minHeight`. La regla dice
«nunca `height`».

**La consecuencia que el doc predice no ocurre**: con `nowrap` la etiqueta no se recorta, **se sale de
la caja**. Y medido a 360 y 768, **hoy no le pasa a nadie**. Deuda latente, no fallo vivo.

---

## 2. Hallazgos por componente

| Componente                                             | Hallazgo                                              | Grado | Estado          |
| ------------------------------------------------------ | ----------------------------------------------------- | ----- | --------------- |
| `Tag`                                                  | el cierre desbordaba su peldaño +10 px                | alto  | **arreglado**   |
| `Code`                                                 | inline caía a 10.5 px dentro de `caption`             | alto  | **arreglado**   |
| `StarField`                                            | `AURORA_BLUR` 50 px, literal fuera de escala          | alto  | **arreglado**   |
| `Loader` `Progress` `Skeleton` `Indicator` `StarField` | 9 duraciones escritas a mano                          | medio | **arreglado**   |
| `ThemeIcon`                                            | 26 px y `fontSize` 17/21/27, fuera de las dos escalas | medio | abierto         |
| `Shell`                                                | scroll horizontal a 360                               | medio | abierto         |
| `DataGrid`                                             | un elemento declara 24 px y su hijo mide 28           | medio | abierto         |
| `Button`                                               | `gap` ×3 entre `md` y `lg`                            | bajo  | síntoma de §1.3 |
| `Button`                                               | cinco tallas, tres cuerpos; `lg`/`xl` usan `body1`    | bajo  | abierto         |
| campo                                                  | `md` y `lg` solo se distinguen por la altura          | bajo  | abierto         |

### Lo aplicado, verificado

| Cambio           | Antes     | Ahora         | Verificación                    |
| ---------------- | --------- | ------------- | ------------------------------- |
| `AURORA_BLUR`    | `"50px"`  | `blur.xxl`    | landing **idéntica** a 50/24/16 |
| 9 duraciones     | literales | tokens        | desvío ≤5 %                     |
| Cierre del `Tag` | `sm` (36) | `xs` (28)     | +10 px → **+2 px**, hijo ≥24 AA |
| `Code` inline    | `0.875em` | `max(…,12px)` | 10.5 px → **12 px**             |

Los cuatro son geometría o motion. **Cero cambios de color.**

---

## 3. Lo que se refutó — y por qué importa

Cuatro veces esta auditoría estuvo a punto de reportar algo que no se sostenía:

1. **El texto de `ghost` y `light` en oscuro** parecía flojo a ojo; medido da **9.2–14.5**.
2. **Los cinco `"linear"`** parecían easings sin token; son **la ausencia de curva**, correcta en un
   bucle. Ampliar el contrato habría sido _breaking_ sin motivo.
3. **Cuatro `em` relativos** parecían caer bajo el suelo de 12 px; son **iconos** (`lineHeight: 0`) o
   viven en prosa a 16. Solo `Code` era real.
4. **Los radios «fuera de escala» de `Segment`** son `calc(control + padding × 2)` — **la geometría de
   una píldora**, derivada de la escala, no un valor suelto.

Sin ese paso, este informe tendría **cuatro hallazgos falsos de doce**.

### Y una vez el proceso falló al revés

Al aplicar el hover de §1.1, `typecheck` y `lint` salieron verdes — y **diez minutos después ya no era
cierto**: una edición en paralelo sobre el mismo `Button.tsx` reescribió el fichero y se llevó la línea
que declaraba la variable, dejando la referencia dentro del `animate`. Lo cazó la suite con un
`ReferenceError`.

Dos lecciones, y la segunda es la que cuesta:

1. **En un árbol con dos manos escribiendo, verificar una vez no basta.** El verde hay que repetirlo
   justo antes de cerrar, no solo justo después del cambio.
2. **Vitest señaló el test equivocado.** El primer reporte culpaba a «en loading anuncia aria-busy»
   —que es justo lo que la otra edición tocaba— y aislado ese test **pasaba**. El culpable real era
   «dispara onClick al pulsar con el ratón». Un error de render tumba el primer test que lo encuentra,
   no el que lo causa: **el nombre del test que falla es una pista, no un diagnóstico.**

---

## 4. Lo que NO se pudo juzgar

- **El tema claro y los nueve de producto.** Todo lo medido es `dark`. Es el hueco más grande.
- **Cuatro familias sin auditoría propia**: overlays, layout y superficie, fechas y media, rich
  content. Entraron en el barrido responsive, no en la medición de geometría ni de estados.
- **`loading`, `disabled` e `invalid`** en cualquier familia. `wr-closure.md` los declara sin
  verificar y **siguen sin verificarse**.
- **`Reveal`, `Transition` y `Segment` con motion**: dan cero movimiento porque son animaciones de
  entrada ya terminadas al medir. Haría falta capturar desde el montaje.
- **`Segment` con y sin `lazy`** (ADR-154).
- **El coste real en CPU/GPU** de cualquier hallazgo de efectos.
- **Figma.** `WR1.2b` nunca se ejecutó; sigue sin haber contraste contra el diseño de referencia.

---

## 5. Veredicto sobre si el aspecto está estable — lo que ADR-037 espera

**El aspecto es estable en el sentido que ADR-037 necesita, y esta auditoría no encuentra motivo para
retrasar el baseline. Pero la declaración no la firma un informe.**

Lo que se puede afirmar desde la medición:

- **A 1280, en 136 historias, no hay un solo hallazgo.** El aspecto de escritorio es coherente.
- **La geometría sale de la escala** en todas las familias medidas, y los hermanos concuerdan.
- **Los defectos que quedan son puntuales y están nombrados**, no difusos.
- **Los cuatro cambios aplicados mueven píxeles**, así que el baseline hay que recapturarlo de todos
  modos — y este es el mejor momento, no el peor.

Lo que **no** puede afirmar un informe, y por eso queda en
[decisiones pendientes](decisiones-pendientes-2026-08-17.md) §1:

- Que el propietario esté conforme con el aspecto. **De hecho ya lo dijo** al rechazar las cuatro
  propuestas de color tras verlas renderizadas: eso es exactamente la declaración que ADR-037 espera,
  y solo falta firmarla.
- Que se acepten a sabiendas los tres huecos de color —campo sin frontera, escalera bajo el 1.08,
  tramo claro de las paletas comprimido—, que **siguen abiertos y no van a cerrarse dentro del alcance
  actual**.

**Recomendación**: firmar la declaración, recapturar el baseline de `win32`, y generar por fin el de
`linux` que ADR-149 dejó vacío. Con eso WR cierra y el gate 8 empieza a verificar algo.

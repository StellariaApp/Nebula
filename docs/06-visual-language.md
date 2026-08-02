# 06 — Lenguaje visual de Nebula

> Especificación vinculante para Web y Native desde W2.V. Complementa el contrato de temas de
> `02-theming.md`, los guardrails de `03-a11y-motion-performance.md` y la identidad de ADR-020.

## 1. Dirección

Nebula es **premium enterprise vibrante**. La calidad no proviene de acumular glow, blur o gradientes,
sino de una jerarquía fuerte, espacio intencional, superficies distinguibles y efectos escasos que
señalan qué merece atención.

Orden de lectura de toda composición:

1. contenido y acción principal;
2. agrupación y jerarquía tipográfica;
3. superficie y borde;
4. motion y efectos.

Si un efecto compite con el contenido, el efecto pierde.

## 2. Tipografía

### 2.1 Baseline de tokens

| Token     | Valor | Uso dominante                                |
| --------- | ----: | -------------------------------------------- |
| `h1`      | 48 px | título de página o hero; uno por vista       |
| `h2`      | 40 px | sección primaria o heading de overlay grande |
| `h3`      | 32 px | subsección principal                         |
| `h4`      | 28 px | título de panel/card prominente              |
| `h5`      | 24 px | título de grupo                              |
| `h6`      | 20 px | título compacto, nunca metadata              |
| `body1`   | 16 px | cuerpo por defecto, formularios y lectura    |
| `body2`   | 14 px | cuerpo secundario y UI compacta              |
| `body3`   | 13 px | apoyo denso; no para párrafos largos         |
| `button`  | 14 px | label de controles                           |
| `caption` | 12 px | metadata, ayuda y estados secundarios        |

Reglas:

- Ningún texto informativo o interactivo baja de 12 px.
- `Text` sin props usa `body1` + `lineHeight.normal`; no hereda el default del navegador.
- `Title` usa `tight`; `h1–h2` son `bold`, `h3–h6` son `semibold`.
- `letterSpacing.tight` se reserva a `h1–h3`; headings compactos y cuerpo usan `normal`.
- Labels de controles usan `button` o el tamaño denso correspondiente, `semibold` y
  `lineHeight.normal`; no se corrige su presencia agregando padding local.
- Blockquote usa `body1/normal` para la cita y `caption/normal` para la atribución.
- Una línea de lectura mide idealmente 60–70 caracteres y nunca supera 75; headings largos se limitan
  a 20–32 caracteres antes de envolver.
- La semántica HTML no se elige por apariencia. `order` define jerarquía; si se necesita otra escala
  visual, debe conservarse el heading correcto con composición/polimorfismo explícito.

### 2.2 La escala de prosa (ADR-066)

`TypographyStylesProvider` —la lectura larga— es **el único componente del catálogo con escala
propia**. No es un defecto: es contrato, y por eso está escrito aquí. Lo que puede y no puede
apartarse de §2.1:

| Puede cambiar                          | No puede cambiar                                          |
| -------------------------------------- | --------------------------------------------------------- |
| `lineHeight` → `relaxed`               | El suelo de 12 px                                         |
| La medida de línea (60–70 caracteres)  | Los pesos de heading (`h1`–`h2` bold, `h3`–`h6` semibold) |
| El ritmo vertical entre bloques        | El tracking (`tight` en `h1`–`h3`)                        |
| El dimensionado del código, según §2.3 | El tamaño del cuerpo de lectura                           |

**El cuerpo de la prosa es `body1`**, no `body2`: §2.1 ya asigna `body1` a «cuerpo por defecto,
formularios y lectura», y el componente dedicado a leer no puede ser el que no usa el tamaño de
lectura. Lo que distingue a la prosa de la UI es el interlineado, no un cuerpo más pequeño.

### 2.3 El dimensionado del código (ADR-066)

Un solo criterio para todo el catálogo:

| Caso                   | Regla                | Resultado                    |
| ---------------------- | -------------------- | ---------------------------- |
| Código **inline**      | `max(0.875em, 12px)` | 14 px dentro de `body1`      |
| Código en **bloque**   | `body3` absoluto     | 13 px                        |
| `code` dentro de `pre` | hereda (`1em`)       | 13 px, no vuelve a reducirse |

El `max()` no es defensivo, es el mecanismo: convierte el suelo de §2.1 en algo que garantiza el CSS
en vez de algo que hay que recordar. A `0.875em` puro, un `code` dentro de `body3` cae a 11.4 px y
dentro de `caption` a 10.5 px.

Un bloque ya fijó su tamaño; volver a aplicarle el factor inline es contarlo dos veces. `0.9em` no
existe en el sistema.

## 3. Ritmo espacial

La escala tiene **dos ejes** (ADR-045), y confundirlos es el error que hay que evitar:

- **Tallas** —`none` … `xxxl`— para **layout**: márgenes, huecos entre bloques, separación de
  secciones. Son las únicas que los style props (`p`, `m`, `gap`) exponen.
- **Múltiplos** —`u1_5`=6, `u2_5`=10, `u3`=12, `u3_5`=14, `u5`=20 px— para **densidad interna de un
  control**: su padding y el hueco entre sus partes. Viven en el `.css.ts` del componente y **no** son
  style props: un consumidor no decide la densidad interna de un control, la decide el tema.

La regla práctica: si el valor separa dos cosas, es talla; si define cuánto respira una sola, es
múltiplo.

### 3.1 Las tallas (layout)

Forman una cuadrícula base de 4 px:

| Token  | Nebula default | Significado                                      |
| ------ | -------------: | ------------------------------------------------ |
| `xxs`  |           2 px | corrección óptica; no separa elementos distintos |
| `xs`   |           4 px | icono+label muy compacto, label+required         |
| `sm`   |           8 px | relación interna directa                         |
| `md`   |          16 px | padding/gap base de componente                   |
| `lg`   |          24 px | separación de grupos relacionados                |
| `xl`   |          32 px | separación de secciones                          |
| `xxl`  |          48 px | regiones de página                               |
| `xxxl` |          64 px | separación editorial/hero                        |

Reglas de composición:

- Dentro < entre: el espacio interno siempre es menor que el espacio que separa grupos.
- Un componente no fija margen exterior; el padre gobierna el ritmo.
- Gutter recomendado: `md` en phone, `lg` en tablet y `xl` en desktop.
- Formulario: label→ayuda `xxs/xs`, ayuda→control `sm`, control→error `xs`, field→field `md/lg`,
  grupo→grupo `xl`.
- FormField separa internamente encabezado (label+ayuda) y cuerpo (control+error); un único `gap`
  uniforme para las cuatro piezas no representa sus relaciones.
- Cards: padding `md` compacto, `lg` default y `xl` prominente. No mezclar los tres dentro de una
  misma colección.

## 4. Densidad y controles

`sizes.control` expresa densidad, no importancia. La escala vive sobre una **rejilla de 8**, con
distancia constante entre peldaños para que un tema pueda recalibrarla sin recalcular a mano
(ADR-072):

- `xs` (32) solo para toolbars densas y acciones auxiliares;
- `sm` (40) para data-dense;
- `md` (48) es el default de producto, y es la medida de acción de la marca;
- `lg` (56) para formularios prominentes y touch frecuente;
- `xl` (64) para hero/onboarding, no para tablas.

La acción principal se distingue primero por variante y jerarquía, no inflando su tamaño. Los targets
mantienen WCAG 2.2: 24 px CSS mínimo en web y 44 pt en native.

En un control solo-icono, el glifo ocupa aproximadamente la mitad del lado útil del control y deriva
de `sizes.control`; no reutiliza tamaños de texto como escala de iconos. Un `ActionIcon md` de 48 px
produce así un icono cercano a 24 px antes de correcciones ópticas propias del SVG.

### 4.1 La segunda escala: `sizes.compact` (ADR-033)

`sizes.control` expresa densidad **de control**, y forzar dentro de ella todo lo que tiene altura
produce el defecto contrario: un badge tan alto como un botón. De ahí una segunda escala para lo que
muestra metadata o navegación compacta y **no es un objetivo táctil**:

- `xs` (20) · `sm` (24) · `md` (28) · `lg` (32) · `xl` (36), sobre la misma rejilla de 4 px de §3.
- **Lo que separa a las dos escalas es el objetivo táctil, no una proporción** (ADR-072). Hasta
  ADR-072 este documento afirmaba una relación 2:3 «en los cinco peldaños» que **solo se cumplía en
  tres**: `lg` daba 32/50 = 0.64 y `xl` 36/60 = 0.60. Se retiró en vez de fingirla. Las dos escalas
  conviven porque una es objetivo táctil y la otra no —que es verificable—, no porque sus números
  rimen.

Reglas:

- **Ningún componente declara alturas en literales.** Si una altura no cabe en ninguna de las dos
  escalas, la discusión es qué peldaño falta, no qué `rem` escribir.
- **Un control declara `minHeight`, nunca `height`.** Su render de **una línea** cae exacto en el
  peldaño; puede excederlo cuando su contenido es multilínea. Un control con descripción —la variante
  de `NavLink`— es legítimo que mida más que su peldaño: lo que no es legítimo es que lo mida sin
  motivo. `height` fija está prohibida porque recorta el contenido en vez de responder a él.
- **Un hijo interactivo no desborda el peldaño de su padre.** Si un control anida otro, el interior
  sale de un peldaño inferior o el exterior sube. Medido: un `Tag sm` declara 28 px y renderiza
  **38** porque el `ActionIcon` de su botón de cierre mide 36. La altura declarada que el contenido
  desborda no es una altura, es una intención.
- **Lo interactivo va en `control`, aunque parezca compacto.** Los items de una paginación son
  objetivos táctiles: usan `control` desplazada un peldaño —una paginación `md` alinea con un input
  `sm`— y así toda su escala queda sobre el mínimo de 24 px CSS de WCAG 2.2. Es también la razón de que
  Pagination no ofrezca `xs`: por debajo de `control.xs` no hay peldaño.
- **`compact` no satisface el mínimo táctil de 44 pt de native por definición.** Lo que la consuma no
  puede ser interactivo; Badge lo cumple.

El mismo nombre de tamaño sigue significando densidades distintas en escalas distintas, pero ahora la
diferencia está declarada en el contrato y un tema puede recalibrar las dos.

## 5. Superficies y elevación

| Nivel | Rol                          | Tratamiento esperado                                      |
| ----: | ---------------------------- | --------------------------------------------------------- |
|     0 | canvas/sunken                | sin sombra; diferencia por superficie                     |
|     1 | card/panel                   | `surface.raised` + border sutil; sombra `xxs/xs` opcional |
|     2 | elemento elevado/sticky      | border sutil + `sm`                                       |
|     3 | dropdown/popover             | `surface.overlay` + border + `md`                         |
|     4 | modal/drawer                 | overlay + `lg`; el backdrop aporta separación             |
|     5 | hero o selección excepcional | glow o gradient; no es elevación estructural              |

Reglas:

- **El escalón mínimo entre dos niveles adyacentes es 1.08** (ADR-065), medido como relación de
  luminancia entre sus roles de superficie, **en los dos esquemas** y en todo par adyacente —incluido
  `sunken`↔`base`—. La regla que lo justifica cabe en una frase: **un escalón de elevación nunca
  separa menos que un escalón de hover**, que §5.1 fija en ~1.08. Si subir un nivel entero se nota
  menos que pasar el ratón por encima, la escalera no es una jerarquía.
- **Ningún par de niveles comparte color exacto.** En particular `surface.overlay` ≠ `surface.base`:
  un overlay que pinta el color del lienzo depende del borde y de la sombra para existir.
- **Es el mismo número en los dos esquemas.** §5.2 avisa de que el espejo de paleta no sirve para el
  separador, y es cierto para `gray`; pero las paletas neutras `dark` y `light` son **simétricas en
  ratio** peldaño a peldaño (50→400 da 1.098 y 1.110), así que aquí el espejo _es_ proporción, que es
  justo lo que §5.2 pide. Una escalera conforme existe dentro de las paletas actuales sin ampliar el
  contrato.
- **En un esquema light la escalera se construye bajando el lienzo, no subiendo el overlay.** Es la
  consecuencia menos obvia del número: cuando `surface.raised` ya es blanco puro no queda recorrido
  por encima, y los niveles 3–4 se quedan sin sitio. Con escalón 1.08, un `raised` conforme no pasa de
  luminancia 0.9222.
- No apilar sombras para compensar superficies indistinguibles.
- En dark el paso lo carga la **superficie**, no la sombra: negro sobre casi-negro no tiene recorrido.
  El rim (`inset` claro del borde superior) progresa con el nivel y es el cue que separa dos niveles que
  comparten superficie. Como los cinco niveles se reparten sobre cuatro roles, en dark se perciben tres
  escalones de superficie —sunken, raised (1–2) y overlay (3–4)— más esa progresión; los pares que
  colapsan no conviven adyacentes y no se compensan ampliando el contrato (ADR-028).
- Una colección de cards usa el mismo nivel; hover no “salta” más de un nivel.
- `withBorder` es parte del lenguaje de elevación, no una decoración arbitraria.

### 5.1 El escalón de interacción

Una superficie que responde al puntero **no cambia de nivel de elevación**: usa los roles
`surface.hover` y `surface.active`, que no participan en la escalera anterior (ADR-044).

- **Magnitud ~1.08** de relación contra la superficie sobre la que se apoya el elemento. Medido en el
  diseño de referencia sobre dos componentes independientes: 1.075 en light y 1.078 en dark.
- **El signo depende del esquema**: en light el hover **oscurece**; en dark **aclara**. Es la razón de
  que un rol de elevación no pueda hacer de hover — su dirección la fija el nivel, no el esquema.
- `active` se calibra al **doble del delta** de `hover`, no al doble del ratio.

### 5.2 Regiones dentro de un contenedor elevado

Cabecera, cuerpo y pie de un overlay son **dos superficies**: cabecera y pie comparten la del
contenedor, el cuerpo contrasta. El borde de 1 px acompaña esa separación y no la duplica.

El separador se calibra **por proporción, no por espejo de paleta**: el mismo peldaño reflejado
(`gray.200` ↔ `gray.800`) produce 1.39 en light y 1.98 en dark, porque las superficies dark están
comprimidas contra el negro. El objetivo es **~1.3–1.4 en ambos esquemas**.

### 5.3 La escalera de sombras (ADR-065)

La asignación de sombra por nivel es **vinculante**, no orientativa:

| Nivel | Rol                | Sombra              | Dónde                                                                                          |
| ----: | ------------------ | ------------------- | ---------------------------------------------------------------------------------------------- |
|     0 | canvas / sunken    | ninguna             | `AppShell`, `Main`                                                                             |
|     1 | card / panel       | `xxs`/`xs` opcional | `Paper`, `Card`, `Section`, `Panel`, card de `Kanban`                                          |
|     2 | elevado / sticky   | `sm`                | `Header` fijo, cabeceras pegajosas                                                             |
|     3 | dropdown / popover | `md`                | `Menu`, `Popover`, `Select`, `DatePicker`, `ColorPicker`, `HoverCard`, `Tooltip`, `FieldError` |
|     4 | modal / drawer     | `lg`                | `Modal`, `Drawer`, `Dialog`, `Toast`, `Header` flotante                                        |

`xl` y `xxl` siguen en la escala y siguen disponibles como prop de consumidor en `Paper`, `Card` y
`GlassSurface`. Lo que no son es **nivel estructural**: ningún componente del catálogo los usa para
declarar su elevación.

**El orden de aplicación no es negociable**: la sombra baja _después_ de que el escalón de superficie
suba. Bajarla antes deja los overlays menos separados que hoy. La sombra se baja porque la superficie
ya separa, no porque este documento lo diga.

### 5.4 La opacidad en las referencias de color (ADR-071)

Un rol de color admite un sufijo de opacidad —`border.subtle.40`, `surface.raised.60`— en las tres
props de color de los style props. Es la misma gramática que las escalas ya usaban internamente
(`scale.500.10` en el hover transparente de `variantMap`), extendida a `surface`, `text` y `border`.

Dónde se usa y dónde no:

| Se usa en                                       | No se usa en                                          |
| ----------------------------------------------- | ----------------------------------------------------- |
| Superficies, bordes y separadores               | **Texto informativo o interactivo**                   |
| Decoración que se apoya sobre un fondo conocido | Cualquier par que `check:contrast` deba poder validar |

La razón del segundo lado de la tabla es que **ningún gate ve la opacidad compuesta**:
`check:contrast` mide el token, no el color resultante, así que un `text.primary.40` puede pasar el
gate y ser ilegible. Un texto a opacidad parcial se mide sobre el render antes de darlo por bueno.

## 6. Effects budget

- Máximo un efecto dominante por región: glow, glass o gradient.
- Las tres superficies de glass usan `blur.md` (subtle), `blur.xl` (default) y `blur.xxl` (strong) con
  saturación de 130–140 % (ADR-028). El glass nunca se anida. La calibración anterior (`sm/md`) dejaba
  el efecto por debajo del umbral perceptible; la escala `blur` en sí no cambió y sigue disponible para
  otros usos.
- `effects.glass.enabled=false` degrada a superficie sólida sin perder jerarquía.
- Glow identifica una acción primaria, selección o feedback excepcional; no se aplica a listas
  completas.
- Gradients son acento de marca en CTA, badge, header o hero. No son fondo dominante en tablas,
  formularios ni lectura larga y nunca pintan texto principal.
- Sombras no animan. Glow ambiental anima solo `opacity/transform` y deriva su duración de motion
  tokens (`expressive × 6` para breathing, `expressive × 12` para recorridos largos).
- Reduced motion elimina loops ambientales y conserva el estado final legible.

### 6.1 Física por superficie (ADR-034)

Una sola física para todo el catálogo aplana la jerarquía: un tooltip y un modal no pesan lo mismo, y
moverlos igual lo desmiente. La física la elige la **superficie**, no la transformada:

| Superficie     | Entrada          | Por qué                                                            |
| -------------- | ---------------- | ------------------------------------------------------------------ |
| Tooltip        | tween `fast`     | no tiene masa; es una etiqueta que aparece, no un objeto que llega |
| Popover · Menu | `spring.snappy`  | responden a una acción directa y deben sentirse inmediatos         |
| Modal · Drawer | `spring.default` | ocupan la vista entera; su peso es parte del mensaje               |
| Toast          | `spring.gentle`  | entra sin ser llamado, así que no debe irrumpir                    |

**Toda salida es más rápida que su entrada**, con un tween acelerado a dos tercios de su duración. Al
cerrar, el usuario ya decidió: sostener la animación es hacerle esperar por una confirmación que ya
tiene.

La curva con rebase (`easing.emphasized`) se reserva a la **confirmación de estado** —la marca de un
checkbox, el punto de un radio, la aparición de un indicador de selección—, donde el rebase comunica
que la acción se registró. En hover y en transiciones de color se lee como imprecisión, y ahí no se
usa.

Las colecciones que aparecen como unidad entran **escalonadas**, con el paso derivado de
`duration.instant` y tope de ocho elementos: pasado ese punto el retardo deja de crecer para que una
lista larga no haga esperar a su último item.

## 7. Calidad visual de un componente

Además del testing contract, cada componente visual debe demostrar:

1. **Specimen**: tamaños, variantes y estados alineados sobre una cuadrícula común.
2. **Composition**: uso real con contenido creíble; no lorem de una palabra ni cajas aisladas.
3. **Themes**: `nebula-dark`, `nebula-light`, `sober-light` y `playful` con la misma estructura.
4. **Responsive**: phone y desktop cuando el componente o su composición dependen del ancho.
5. **Density**: default y data-dense cuando aplique.
6. **Motion**: estado normal y reduced motion.

En galerías de iconos, el nombre es la identificación principal y usa al menos `body3`; `caption` se
reserva para metadata secundaria. El tamaño default `1em` de Icon se conserva para uso inline y el
contenedor interactivo gobierna el tamaño cuando el icono representa una acción.

Una review visual responde, en este orden:

- ¿Se entiende qué leer/hacer primero?
- ¿Los grupos se perciben sin depender de bordes adicionales?
- ¿El cuerpo se lee sin esfuerzo y la metadata sigue siendo legible?
- ¿Las superficies se distinguen en light y dark?
- ¿El efecto refuerza un estado o solo agrega ruido?
- ¿Sober y playful siguen siendo el mismo componente, no dos forks visuales?

## 8. Láminas de referencia y gate

El playground mantiene una sección `Foundations/Visual QA` con cinco láminas:

- `Typography`: jerarquía, cuerpo, metadata y medidas de línea;
- `Spacing`: ritmos inline/componente/grupo/sección/página;
- `Surfaces`: niveles 0–4 en los cuatro temas;
- `Actions`: tamaños, variantes, focus, disabled y loading;
- `Forms`: label, ayuda, control, error y grupos en densidad default/compacta.

Estas láminas son el baseline de W2.V. Axe y contrast-check siguen siendo gates automáticos; la
lámina añade el gate humano que hoy falta. Automatizar diffs de captura queda como requisito antes
del cierre de W2, sin introducir una dependencia hasta decidir la herramienta por ADR.

## 9. Color categórico en datos (ADR-067)

Una serie de datos **no significa nada**: es la tercera, no es un error ni un aviso. Por eso los roles
semánticos no son una paleta categórica, y reutilizarlos como tal es el defecto — no su calibración.
Un rol semántico no tiene ninguna obligación de distinguirse de otro, porque no es lo que se le pide.

Tres criterios, calculables sobre los valores del tema sin necesidad de render:

| Criterio                                                         | Umbral | Se aplica a         |
| ---------------------------------------------------------------- | -----: | ------------------- |
| Relación de luminancia entre series **adyacentes** en la leyenda |  ≥1.10 | pares consecutivos  |
| ΔE2000 en visión normal                                          |    ≥15 | **todos** los pares |
| ΔE2000 bajo simulación protán **y** deután                       |    ≥10 | **todos** los pares |

Los umbrales están calibrados contra **Okabe-Ito**, que los cumple con margen (1.118 · 22.2 · 11.6).
Se validan contra una referencia y no a ojo por un motivo concreto: la primera versión de este
criterio pedía ΔE ≥12 para dicromatismo, y **ni Okabe-Ito lo alcanza**. Un umbral que la referencia
del campo no cumple no es exigente, es inservible.

**El ratio de luminancia se exige solo entre series adyacentes, y es deliberado**: exigirlo a todos
los pares es imposible incluso para Okabe-Ito, cuyo peor par global cae a 1.025 — seis colores
distinguibles no caben en seis niveles de gris distintos. Lo que se confunde en la práctica es lo que
se toca: líneas vecinas, segmentos contiguos de una barra apilada.

Reglas:

- Las series sin color explícito salen de `colors.chartCategorical`, la secuencia ordenada del tema,
  **no** de los roles semánticos. Un rol semántico se usa cuando la serie significa eso.
- El color no es el único canal (WCAG 1.4.1). Cuando el tipo de gráfico lo permita, la serie se
  distingue además por trazo, marcador, textura o etiqueta directa. Los tres umbrales son el suelo,
  no el sustituto.

## 10. Deuda detectada al abrir W2.V

| Deuda                                                        | Estado                                                                                                                                                   |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `caption=8`, `body3=10` y `body2=12` por debajo del baseline | resuelta en W2.V (ADR-024)                                                                                                                               |
| `Text` no fija tamaño ni line-height por defecto             | resuelta en W2.V                                                                                                                                         |
| `Title` usa el mismo peso y tracking en los seis niveles     | resuelta en W2.V; el tracking se volvió efectivo en ADR-027                                                                                              |
| Los temas dark reutilizan sombras negras de light            | **resuelta 2026-07-27 (ADR-028)**: `darkShadows` con oclusión + rim, superficies ensanchadas y semilla `dark` fría                                       |
| Button con duraciones/easings libres                         | resuelta en W2.V                                                                                                                                         |
| Las stories prueban matrices, casi ninguna composición real  | **parcial**: existen las cinco láminas `Foundations/Visual QA` y `Composition`/`AllThemes` en la base y en W2.4–W2.5; falta cubrir el resto del catálogo |
| `FormField.stories.tsx` con radius y padding libres          | resuelta en W2.V                                                                                                                                         |

El checkpoint W2.V corrigió el grueso de esta lista; la calibración de elevación se completó en el
checkpoint de convergencia visual del 2026-07-27
(`docs/reviews/stellaria-ui-convergence-2026-07-27.md`).

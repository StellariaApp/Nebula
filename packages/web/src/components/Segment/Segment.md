# Segment

Compound que agrupa un control de segmentos con sus paneles, siguiendo la forma del `Segment` de fonicredito (ADR-026). El valor vive en el contexto del root, así que el consumidor no cablea estado entre el control y el contenido.

```tsx
<Segment defaultValue="resumen">
  <Segment.Header>…</Segment.Header>
  <Segment.Control data={[{ value: "resumen", label: "Resumen" }, …]} />
  <Segment.Content>
    <Segment.Content.Item value="resumen">…</Segment.Content.Item>
  </Segment.Content>
  <Segment.Footer>…</Segment.Footer>
</Segment>
```

## Qué piezas del compound aceptan style props

Las cuatro que renderizan un elemento propio: `Segment` (la columna raíz), `Segment.Control` (la barra), `Segment.Content` (el viewport) y `Segment.Header` / `Segment.Footer`. Cada una las aplica a su propio nodo, así que `Segment.Control` puede llevar `maw` sin que la raíz cambie de ancho.

`Segment.Control.Item` y `Segment.Content.Item` **no** las aceptan: devuelven `null` y existen solo para declarar datos que lee el padre, como `Conditional` o `Portal`. La consecuencia práctica es que el panel de un `Content.Item` se sigue estilando por su `className`, que es lo que el padre le pasa al `div` del panel. Abrirlo exigiría que `SegmentContent` extrajese las style props de las props de cada hijo, y eso se decidirá con evidencia de uso.

## Qué hace la barra cuando no cabe (ADR-135)

`overflowMode` vive en la raíz y viaja por el contexto, como `size` o `fullWidth`. `Tabs` lo hereda.

| modo        | qué hace la barra                              | arrastre |
| ----------- | ---------------------------------------------- | -------- |
| `"visible"` | desborda a su padre — el defecto de siempre    | sí       |
| `"scroll"`  | se desliza en una fila, con la barra oculta    | no       |
| `"wrap"`    | rompe en filas y el indicador se mueve en 2 ejes | no      |

No se llama `overflow` porque **ese nombre ya está cogido**: `overflow`, `overflowX` y `wrap` son
style props, y `SegmentProps extends StyleProps`. La style prop `overflow` sigue cayendo en el `div`
del control y es cosa distinta de esta.

**El gesto se apaga en `scroll` y en `wrap`.** En `scroll` porque el `onPan` del indicador y el
scroll táctil se pelean por el mismo dedo en el mismo eje, y debe ganar el del sistema, que trae
inercia y rebote. En `wrap` porque `Rubber` acota un eje y un arrastre que cruza filas no es el gesto
de un segmento. Click y teclado siguen completos: el gesto siempre fue mejora progresiva.

Con `scroll`, el tab activo **se trae a la vista** al cambiar de valor, desplazando solo la barra
—nunca la página—, porque si no el teclado deja el foco fuera de la ventana visible.

`fullWidth` es aparte y compone con los tres: sus tabs llevan `min-width: 0` y `overflow: hidden`,
que es lo que hace que `width: 100%` se cumpla de verdad. El recorte es duro, sin puntos
suspensivos: `text-overflow: ellipsis` no se aplica a un contenedor flex y el rótulo de un item es
`ReactNode`, así que envolverlo en un bloque le cambiaría la caja a quien hoy le pasa un nodo. Con
rótulos largos, el modo es `scroll`.

## El rol ARIA depende de si hay paneles

`Segment.Control` emite `tablist` + `tab` + `aria-controls` **solo cuando el Segment tiene un `Segment.Content`**; sin paneles cae a `radiogroup` + `radio`. Un `tablist` cuyas pestañas no controlan nada es ARIA incorrecto, y ese es también el motivo de que `SegmentedControl` siga existiendo aparte: es el selector de valor suelto y siempre es un radiogroup.

El root descubre los paneles porque `Segment.Content` los registra en el contexto; hasta ese registro el control se comporta como radiogroup.

## El alto tiene tres modos y `fill` manda (ADR-123)

El carril es un flex row, así que **por defecto todos los paneles se estiran al más alto**. Es estable
—la caja no salta al cambiar de sección— pero un panel corto paga el alto del más largo.

| modo        | qué mide la caja                     | cuándo                                     |
| ----------- | ------------------------------------ | ------------------------------------------ |
| defecto     | el panel más alto, por `align-items` | contenidos de alto parecido                |
| `auto`      | el panel **activo**, con muelle      | contenidos dispares y sin alto de contexto |
| `fill`      | el 100 % de la caja                  | el consumidor ya fija el alto (`h`, grid)  |
| `autoWidth` | el **ancho** del panel activo        | diapositivas con ancho propio              |

**`fill` gana sobre `auto`**: los dos gobiernan lo mismo y `fill` es el que ya existía. Con `fill`,
`auto` no hace nada.

`auto` mide con un `ResizeObserver` sobre el panel activo y **la altura salta al soltar**, no
interpola con el arrastre: durante el gesto la caja conserva el alto del panel de salida y un vecino
más alto se recorta. Interpolar exigiría medir los `n` paneles en vez de uno, y el corte es
invisible salvo con diferencias de alto grandes.

Hasta la primera medida no hay alto en línea, así que el HTML servido no fija altura: `auto` no
introduce un salto desde cero en la hidratación. Antes de hidratar la caja se comporta como el modo por
defecto —la altura del panel más alto—, que es la degradación buena.

### `autoWidth` es lo mismo en horizontal, pero no sale gratis

El alto es gratis porque cada panel se mide solo. El ancho no: **por defecto todos los paneles miden
exactamente la ventana**, y eso es lo que hace que el paso del swipe sea uniforme. Con `autoWidth` cada
panel pasa a `width: max-content` y el paso deja de serlo, así que la geometría se mide panel a panel:
posición y ancho de cada uno con `offsetLeft`/`offsetWidth`, que **no ven los transforms** —ni el del
carril ni el del bucle— y por eso se pueden leer en cualquier momento del gesto.

Medido en el hero del sitio: la caja va de **320×386** (la tarjeta) a **555×420** (el bloque de código)
con muelle en los dos ejes, y el vecino asoma con su propio ancho al arrastrar.

### El primer pintado se ciñe al panel activo, sin esperar a la medida

Entre el primer pintado y la hidratación **no hay medida**, así que la caja valdría el 100 % de su
padre. Con paneles de ancho propio eso deja dos defectos, y se veían los dos en el hero del sitio: el
panel siguiente **asoma por el borde** si el padre es más ancho que el activo —basta con que la fuente
aún no haya cargado y una fila hermana mida de más—, y el panel activo, que ya es `max-content`, se
apoya a la izquierda dejando **un hueco a la derecha**.

La caja emite `data-ready` y `data-fit`, y mientras no hay geometría:

- los paneles inactivos se ocultan, y con `autoWidth` además **salen del flujo** —`position: absolute`—,
  así que no cuentan para el ancho de la caja pero **sí se pueden medir**: un absoluto con
  `width: max-content` mide lo mismo que medirá en flujo, de modo que una sola pasada basta;
- la caja pasa a `width: fit-content` y suelta la contención, así que se ciñe al único panel que queda
  en flujo. Medido: 320 px exactos desde el primer pintado, en vez de los 350 del padre.

Va en CSS y no en JavaScript porque los atributos viajan en el HTML servido: el primer pintado ya sale
bien en vez de corregirse al hidratar. En cuanto hay geometría pasan a `true` y todo vuelve a su sitio,
que es lo que hace falta para que los vecinos asomen al arrastrar.

**Las posiciones se calculan, no se leen.** `offsetLeft` daría la posición real, pero es la que está
mal justo en ese estado —los inactivos están apilados en el absoluto—, así que el carril se reconstruye
sumando anchos y `gap`, que es exactamente como reparte un flex row. El ancho sí se lee, con
`getBoundingClientRect`, que da fracción de píxel y **no se ve afectado por los transforms** del bucle
porque una traslación no cambia el ancho.

Es el mismo trato que `auto`, en el otro eje: **un panel sin ancho propio colapsa**. No sirve para
texto que deba fluir, porque `max-content` es la línea sin partir. La caja se acota con
`max-width: 100%`, que se resuelve contra el padre; si ese padre también se dimensiona por su contenido
—un `max-content`, un `inline-block`— crecerá con ella, porque la contención mata la aportación
intrínseca pero no un ancho explícito.

## El bucle recoloca paneles, no los clona (ADR-123)

`loop` no duplica nada. Cada panel lleva un desplazamiento modular propio, `round((pos − p) / n)`
vueltas de `n · paso`, que lo lleva a la copia más cercana a la ventana. Con cuatro paneles parados
en el primero, el cuarto se sitúa en `−4 · paso`: **justo a la izquierda del primero**, que es lo que
un carrusel infinito necesita.

Clonar era la alternativa obvia y está descartada por dos razones que no se arreglan: el clon
duplicaría el `id` del `tabpanel` al que apunta `aria-controls` —HTML inválido y mapeo roto para AT— y
duplicaría el contenido del consumidor, con su estado; un formulario dentro de un panel existiría dos
veces.

**El desplazamiento se calcula desde la posición viva del carril, no desde el índice asentado.** Esa
es la diferencia que hace que el bucle funcione **con dos paneles**, que es el caso real del catálogo
(código/resultado): con el índice asentado, el otro panel viviría fijo en un lado y arrastrar hacia el
contrario dejaría hueco. Por eso cada panel necesita su propio `MotionValue` derivado
(`components/Panel.tsx`) y no basta con estado de React: un `setState` por cruce llega un fotograma
tarde y en un flick rápido ese fotograma se ve.

**Un gesto mueve un panel como mucho.** El destino se acota a ±1 desde la página en la que empezó el
arrastre, no desde donde acabó el dedo. Sin esa cota, `loop` no tiene banda elástica que frene el
arrastre y un manotazo de 1.400 px sobre paneles de 496 aterrizaba tres pantallas más allá: eso era el
salto raro. Medido en navegador, ese mismo arrastre avanza ahora exactamente un panel.

Con `loop`, **el click en una pestaña también toma el camino corto**: la página interna es un entero
sin límites y el valor es su módulo, así que ir del último al primero avanza un paso en vez de
recorrer los de en medio. Sin `loop` la página es el índice y nada cambia.

Cuando el camino corto **empata** —dos paneles, o los antípodas de un número par— gana el sentido de
las pestañas: pulsar la de la izquierda desliza hacia la derecha. El componente semilla resuelve el
empate siempre hacia delante, y con dos paneles eso hace que el contenido entre siempre por el mismo
lado sin importar qué pestaña pulses.

Con menos de dos paneles `loop` se ignora. El teclado del `Control` ya daba la vuelta antes de este
ADR y no depende de la prop: `loop` gobierna el carril, no la navegación.

## La caja no puede medir la suma de sus diapositivas (ADR-123)

Cada panel es `width: 100%` **del carril**, y el carril es `width: 100%` de la caja. Eso funciona
mientras el ancho baje desde fuera. Cuando un ancestro se dimensiona por su contenido —`max-content`,
`fit-content`, un `inline-block`, una celda de tabla— el navegador pregunta a la caja cuánto mide, y
la respuesta que salía era **la suma de todos los paneles**: cada uno aporta el ancho intrínseco de su
contenido, más los `gap`. Medido en el playground, tres paneles dentro de un `max-content` daban una
caja de **998 px** en vez de 480, y con ella tres paneles de 998.

Por eso la caja lleva `contain: inline-size`: declara que **su ancho no depende de su contenido**, que
es justo lo que es una ventana con `overflow: hidden`. Su aportación intrínseca pasa a ser cero y el
ancestro se dimensiona por lo demás que tenga —en el caso medido, la barra de pestañas: 239 px—.

La consecuencia a tener presente: dentro de un contenedor que se encoge a su contenido, **el ancho
tiene que venir de otra cosa**. Un `Segment.Content` que sea el único hijo de un `inline-block` mide
cero, y eso es correcto: no hay ancho que un carrusel pueda inventarse a partir de sus diapositivas.

## `gap` es la separación entre paneles

La style prop `gap` de `Segment.Content` **no cae en la caja exterior** —que no es flex y la ignoraría—
sino en el carril, así que es el aire entre diapositivas mientras se deslizan. El paso del swipe deja
de ser el ancho y pasa a ser `ancho + gap`, leído del `columnGap` computado del carril para no
depender de cómo se expresó el token.

## Motion y gesto

El indicador y los paneles se mueven con `MotionValue` + `useSpring` usando `theme.motion.spring`, no con transiciones CSS. Se eligió el gesto `onPan` en vez de `drag` de motion porque `drag` mueve el elemento 1:1 con el puntero: alimentando el `MotionValue` a mano y leyendo su versión con spring, el arrastre sale suavizado en vez de lineal.

Al soltar, el destino se resuelve por **posición o velocidad**: si el gesto supera el umbral de flick se avanza un paso en su dirección; si no, gana el segmento cuyo centro queda más cerca. Los segmentos deshabilitados se saltan.

El arrastre está acotado por una banda elástica con resistencia asintótica (`utils/rubber.ts`): pasado el extremo el desplazamiento se comprime y **nunca supera el límite configurado**, en vez de crecer sin fin.

Todo el motion —animación y gesto— se apaga con `prefers-reduced-motion` y con `motion.tier: "minimal"`. Sin él, el control sigue siendo operable por click y teclado: el gesto es una mejora progresiva, nunca el único camino.

## Por qué el catálogo entero carga `domMax`

`domAnimation` **no incluye gestos de arrastre**, y aquí hacen falta: el indicador de `Segment.Control` y el viewport de `Segment.Content` se mueven con `onPan`, igual que `Switch` y `SegmentedControl`. Cuando cada componente montaba su propio `LazyMotion`, esos cuatro cargaban `domMax` y los otros once `domAnimation`, de modo que bastaba con juntar un Switch y un botón en la misma vista para descargar los dos paquetes.

Desde ADR-034 hay un solo `LazyMotion`, en `NebulaProvider`, y sus features son `domMax` precisamente porque este componente lo exige. El invariante lo vigila `src/__tests__/motion-provider.test.tsx`.

## Por qué el indicador es `surface.overlay` y no `surface.base`

Era `base`, y en `dark` eso es **exactamente el color del canvas** (`#080a12`) sobre una pista de `#06080f`: la píldora activa quedaba a 1.01 de su fondo, el mismo umbral que ADR-044 declaró como «no es un hover débil, es ninguno». En light no se notaba porque allí `base` es blanco puro contra una pista gris.

`overlay` es la superficie más elevada del contrato, que es lo que la píldora es: la pieza que flota sobre la ranura. El cambio deja el paso en 1.14 en dark y **no toca light**, donde `overlay` y `base` valen lo mismo.

| Tema  | antes | después |
| ----- | ----: | ------: |
| dark  |  1.01 |    1.14 |
| light |  1.06 |    1.06 |

**Residual anotado**: la pista sigue en `surface.sunken`, que en dark está por debajo del canvas (1.01 contra él), así que el control no tiene contorno propio en ese tema — se lee por la píldora, no por la ranura. Corregirlo es el mismo problema de simetría entre esquemas que la calibración del 2026-07-28 dejó fuera a propósito: obligaría a recalibrar `sunken` u `overlay` globalmente. Se resuelve en el tramo de ADR-038, cuando Segment pase a resolver su superficie desde `variantMap`.

## La píldora activa sale del `variantMap`

`SegmentVariant` es `Extract<Variant, "filled" | "light">` y viaja por el contexto hasta
`Segment.Control`, que resuelve `indicatorColor` ← `resolved.background` e `indicatorFg` ←
`resolved.foreground` para el label del item activo. Sin `variant`, la píldora conserva la calibración
de `surface.overlay` documentada arriba: el cambio es aditivo.

**`ghost` se excluyó a propósito**, aunque ADR-038 lo listaba. Su fondo es transparente, de modo que la
píldora desaparecería y la selección quedaría expresada **solo** por el color del texto. Eso es
información de estado de un componente de UI, que WCAG 2.2 exige que sea perceptible con 3:1 (criterio
1.4.11), y dos labels que solo difieren en tono no lo garantizan. `Tabs`, que es un atajo sobre este
compound, hereda el mismo subconjunto.

## La escala está desplazada un peldaño (ADR-047)

`docs/06` §4.1 fija que lo interactivo usa `sizes.control` **desplazada un peldaño**, y que por debajo
de `control.xs` no hay peldaño al que desplazarse. Un `radiogroup` o un `tablist` son objetivos
táctiles, así que la otra escala —`sizes.compact`— está vedada aquí: la propia sección dice que lo que
la consuma no puede ser interactivo, aunque sus valores (20–36) aterricen casi exactos sobre el diseño.

De ahí que `md` sea `control.sm` (32) y no `control.md` (40). Es la misma decisión que ya tomó
`Pagination`, y por el mismo motivo: **un `Segment md` alinea con un input `sm`**. `Tabs` lo hereda
porque es un atajo sobre este compound.

## `xs` encoge el cromado, no el objetivo (ADR-151)

Esta sección decía que `SegmentSize` no ofrecía `xs`, y la razón que daba —no hay peldaño de
`control` por debajo de `xs`— sigue siendo cierta. Lo que estaba mal era la conclusión: en un
`Segment sm` de 48 px, **solo 28 son el tab**; los otros 20 son el `padding` del contenedor. Lo que
sobra cuando el control se ve grande es el aire, no el objetivo.

```
             tab      padding    alto total    fuente
  xs         28         6          40 px       caption (12)
  sm         28        10          48 px       body3   (13)
```

`xs` comparte `minHeight` con `sm` a propósito. Bajarlo a `control.xxs` (20) daba el tamaño que se
pedía e incumplía **WCAG 2.2 SC 2.5.8 «Target Size (Minimum)», que es AA** y exige 24×24: la
excepción de espaciado no aplica porque los tabs de un segmento se tocan. El suelo táctil no se
negocia peldaño a peldaño, así que por debajo de `sm` la escala da menos aire y el mismo objetivo.

Cualquier peldaño futuro por debajo de `xs` sigue esa regla. Si hace falta un control realmente
diminuto, no es un `Segment`.

## Los dos `4px` del contenedor son el mismo valor

`control` tiene `padding: space.xs` y el indicador tiene `top`/`bottom: space.xs`. **Deben leer el mismo
token**: el indicador se posiciona en absoluto dentro del contenedor, así que si el padding y sus insets
se separan, la píldora deja de encajar en el hueco. Antes eran dos literales `"3px"` sincronizados a
mano, que es exactamente lo que ADR-033 prohíbe y lo que el censo de los `.css.ts` no vio.

El radio del contenedor, del indicador y de cada tab es `full` en los tres, no `md`/`sm`: el control se
lee como conmutador y no como caja, que era el defecto reportado en dark.

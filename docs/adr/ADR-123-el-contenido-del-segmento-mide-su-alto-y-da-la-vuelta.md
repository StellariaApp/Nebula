# ADR-123 — El contenido del segmento mide su alto y da la vuelta sin clonar paneles

- **Estado**: aceptada · 2026-08-10 (checkpoint del propietario: gana `fill`, la altura salta al
  soltar, `gap` separa los paneles) · **WN**
- **Cambia API pública**: sí, y es **aditivo**: `auto` y `loop` en `SegmentContentProps` y en
  `TabsProps`. No rompe ninguna llamada existente.
- Lo destapó el propietario escribiendo el sitio de llamada antes que el contrato:
  `packages/demos/src/Patterns/CodePeek.tsx` ya pedía `auto` y `loop`, que no existían.

## Contexto

`Segment.Content` tenía `swipeable` y `fill`. El contrato semilla de fonicredito
—`docs/api/fonicredito-components.md`, línea 622— declaraba **`swipeable`, `loop`, `fill` y
`delay`**, así que `loop` no es API nueva: es paridad que W3 no migró.

El alto sí es hueco propio. El carril es un `flex row`, de modo que `align-items: stretch` estira
**todos** los paneles al más alto. Es estable pero caro: un panel de 180 px paga los 420 del vecino.
`fill` resolvía el caso contrario —el consumidor fija el alto y los paneles lo llenan— y entre los dos
faltaba el más natural: que la caja sea la del panel activo.

## Decisión

### 1. Tres modos de alto, excluyentes, con `fill` por delante

| modo    | qué mide la caja    |
| ------- | ------------------- |
| defecto | el panel más alto   |
| `auto`  | el panel **activo** |
| `fill`  | el 100 % de la caja |

Se piden con dos booleanos y no con un `height?: "max" \| "auto" \| "fill"`, que sería el tipo
honesto —tres estados, una sola combinación ilegal—. `fill` ya existía y ya estaba escrito en demos y
stories; convertirlo en enum rompe llamadas para expresar lo mismo. **`fill` gana sobre `auto`** y se
documenta; la combinación no se prohíbe en el tipo porque hacerlo obliga a una unión que se propaga a
`TabsProps` y al reenvío.

`auto` mide con **un** `ResizeObserver` sobre el panel activo y salta al soltar. Interpolar el alto
con el arrastre —la alternativa que se ofreció en el checkpoint— exige medir los `n` paneles y
mantener un vector de alturas vivo durante el gesto, y el recorte que evita solo se ve con paneles de
alto muy distinto.

### 2. El bucle recoloca, no clona

Cada panel lleva su propio desplazamiento modular: `round((pos − p) / n)` vueltas de `n · paso`, que
lo sitúa en la copia más cercana a la ventana. Parado en el primero de cuatro, el cuarto se va a
`−4 · paso`, o sea justo a la izquierda del primero.

**Clonar está descartado y no por coste.** Un `tabpanel` clonado duplica el `id` al que apunta
`aria-controls` —HTML inválido, mapeo roto para AT— y duplica el contenido del consumidor con su
estado: un formulario dentro de un panel existiría dos veces.

**El desplazamiento se calcula desde la posición viva del carril, no desde el índice asentado.** Esto
no es un refinamiento: es lo que hace que el bucle funcione **con dos paneles**, que es el caso real
del catálogo. Con el índice asentado, el otro panel de un par vive fijo en un lado y arrastrar hacia
el contrario deja hueco; con la posición viva, el salto ocurre cuando el panel está exactamente a un
ancho de la ventana, o sea fuera de ella.

De ahí sale el único archivo nuevo: **`Segment/components/Panel.tsx`**. Cada panel necesita un
`MotionValue` derivado y los hooks no se llaman dentro de un `map`. Estado de React no sirve: un
`setState` por cruce se aplica un fotograma tarde, y en un flick de 2.000 px/s ese fotograma son
~33 px de panel equivocado asomando por el borde.

El panel pasa de `Box` a `m.create(Box)` para poder llevar ese valor. **Sigue siendo un `Box`**, así
que `panelProps` conserva su tipo `BoxSlotProps` y con él las style props (ADR-104).

Con `loop`, el click en una pestaña también toma el **camino corto**: la página interna es un entero
sin límites y el valor es su módulo. Sin `loop`, la página es el índice y no cambia nada. Con menos de
dos paneles `loop` se ignora.

**Enmienda del 2026-08-10 — un gesto mueve un panel como mucho.** El destino se acota a ±1 desde la
página en la que **empezó** el arrastre, como hace el componente semilla. Sin `loop` la banda elástica
ya frenaba el arrastre en los extremos; con `loop` no hay extremos, así que el destino salía de
`round(posición del dedo / paso)` y un manotazo de 1.400 px sobre paneles de 496 aterrizaba tres
pantallas más allá. Ese era el «salta de manera extraña» del reporte. Verificado en navegador: el mismo
arrastre avanza ahora un panel.

**Y el empate del camino corto lo rompe el sentido de las pestañas**, no el signo. Con dos paneles
—o con los antípodas de cualquier número par— las dos direcciones miden lo mismo, y el semilla resuelve
siempre hacia delante: pulsar la pestaña de la izquierda hacía entrar el contenido por la derecha,
siempre, contradiciendo el orden visible de las pestañas. Es la única divergencia deliberada respecto
al semilla y solo afecta al click; el gesto no empata nunca porque tiene dirección.

### 3. La ventana declara que su ancho no sale de su contenido

**Enmienda del 2026-08-10**, tras medir en navegador con `tools/render-measure`. El propietario
reportó que el panel «no toma el ancho automáticamente» y la captura mostraba un panel de **755,99 px**
dentro de un contenedor más estrecho. Ese número no era arbitrario: era `320` (la tarjeta del panel
`result`) + `16` (el `gap`) + `420` (el bloque de código del panel `code`). **La suma de las
diapositivas.**

El origen está en `apps/docs/src/islands/hero-preview.tsx`, que envuelve la demo en
`w={{ base: "max-content" }}`. Con un ancestro que se dimensiona por su contenido, el navegador
pregunta a la caja cuánto mide y la caja contestaba con la aportación intrínseca del carril, que es la
de todos sus paneles sumados. Reproducido en el playground: tres paneles dentro de un `max-content`
daban **998 px** de caja donde tocaban 480, y con ella tres paneles de 998.

`styles.content` gana `contain: inline-size`. Es la declaración exacta del caso —una ventana con
`overflow: hidden` cuyo ancho baja desde fuera— y deja la caja en los 239 px que pide el resto del
contenido. **No es una regresión de este ADR**: el defecto existía desde que `Segment.Content` tiene
paneles; el `gap` solo le añadió 16 px y lo hizo visible.

Se descartó dar al panel el ancho medido en píxeles, que es lo que hace el componente semilla. En React
Native no existe `max-content`, así que allí la medida es la única vía; en web introduce un pintado
inicial sin ancho —el HTML servido no lo lleva— y un fotograma de retraso en cada `resize`, a cambio de
nada que el `contain` no dé ya.

### 4. `autoWidth` es prop aparte, no un segundo eje de `auto`

**Enmienda del 2026-08-10**, a petición del propietario tras ver `auto` funcionando en vertical. La
caja también sigue el **ancho** del panel activo, y entra como prop propia.

No se metió dentro de `auto` porque los dos ejes no cuestan lo mismo. El alto es gratis: cada panel se
mide solo y la caja es un bloque. El ancho no: por defecto **todos los paneles miden exactamente la
ventana**, y de ahí sale que el paso del swipe sea uniforme (`ancho + gap`). Con `autoWidth` cada panel
pasa a `width: max-content` y el paso deja de serlo. Fundirlos en un prop además quitaría el caso
normal de un `tablist` —alto que respira, ancho fijo—, que es lo que quiere el resto del catálogo.

La geometría pasa a medirse **panel a panel**: `offsetLeft` y `offsetWidth` de cada uno, que no ven los
transforms —ni el del carril ni el del bucle— y por eso se leen en cualquier momento del gesto, a
diferencia de `getBoundingClientRect`. Con eso, un solo camino sirve para los dos casos: el uniforme
sale como el particular donde todos los anchos coinciden. El aterrizaje del gesto deja de ser
`round(posición / paso)` y pasa a ser el panel más cercano por posición medida; el periodo del bucle
deja de ser `n · paso` y pasa a ser el ancho total del contenido más un `gap`.

Medido en el hero del sitio: **320×386 ↔ 555×420** con muelle en los dos ejes.

**Y el primer pintado se ciñe al panel activo sin esperar a la medida.** Entre el primer pintado y la
hidratación no hay geometría, así que la caja valdría el 100 % de su padre, y con paneles de ancho
propio eso deja dos defectos que se vieron los dos en el hero: el panel siguiente asomando por el borde
—un trozo de bloque de código colgando fuera de la tarjeta mientras cargaba la fuente— y el activo
apoyado a la izquierda con un hueco a la derecha.

La caja emite `data-ready` y `data-fit`. Mientras no hay medida, los inactivos se ocultan y con
`autoWidth` **salen del flujo**, y la caja pasa a `fit-content` soltando la contención: se ciñe al único
panel que queda. Medido, 320 px exactos desde el primer pintado en vez de los 350 del padre.

Sacarlos con `position: absolute` en vez de `display: none` no es indiferente: **un absoluto con
`width: max-content` mide lo que medirá en flujo**, así que una sola pasada de medida basta. Con
`display: none` la primera pasada leería ceros y haría falta una segunda, con un fotograma de geometría
falsa por medio.

De ahí sale también que las posiciones se **calculen** sumando anchos y `gap` en vez de leerse con
`offsetLeft`: en ese estado los inactivos están apilados y `offsetLeft` mentiría. El ancho se lee con
`getBoundingClientRect`, que da fracción de píxel y no lo afectan los transforms del bucle, porque una
traslación no cambia el ancho.

Todo esto va en CSS y no en JavaScript porque los atributos viajan en el HTML servido: el primer
pintado ya sale bien en vez de corregirse después.

El trato es el mismo que en `auto`, en el otro eje: un panel sin ancho propio colapsa, así que no sirve
para texto que deba fluir. La caja se acota con `max-width: 100%`; si el padre también se dimensiona por
su contenido, crecerá con ella, porque `contain: inline-size` mata la aportación **intrínseca** pero no
un ancho explícito.

### 5. `gap` cae en el carril

La style prop `gap` de `Segment.Content` aterrizaba en la caja exterior, que no es flex: **era una
prop muerta**. Pasa al carril, donde significa el aire entre diapositivas, y el paso del swipe deja
de ser el ancho para ser `ancho + gap`.

El paso se lee del `columnGap` computado del carril en vez de reconstruirse desde el token, porque
`gap` admite token, valor abierto y responsive (ADR-103) y solo el computed style conoce las tres.
Es también la razón de que el `ResizeObserver` observe carril **y** ventana: un `gap` que cambia en un
breakpoint sin cambiar el ancho de la caja sí cambia el del carril.

## Alternativas descartadas

**Reutilizar `Carousel` para el bucle.** `Carousel` es embla y trae `loop` hecho. No sirve: es un
`section` con `aria-roledescription="carousel"`, no un `tablist` con paneles vinculados por
`aria-controls`, y meter embla dentro de `Segment` significa dos motores de gesto en el mismo
compound —el indicador del `Control` ya usa `onPan` con `MotionValue`— y una segunda física de
arrastre que no lee `theme.motion.spring`.

**`height` como enum en vez de dos booleanos.** El tipo correcto si `fill` no existiera ya.

**Interpolar el alto durante el arrastre.** Ofrecida al propietario, descartada por él.

## Consecuencias

- `Tabs` reenvía `auto` y `loop`, como ya hacía con `fill` y `swipeable`.
- **Un `VisualElement` más por panel**, por `m.create(Box)`, y uno más por `Segment.Content`, porque
  la caja exterior necesita ser `m.div` para llevar el alto con muelle.
- `auto` no fija alto en línea hasta la primera medida, así que **el HTML servido no introduce un
  salto desde cero** en la hidratación.
- El posicionamiento inicial deja de animarse: `first` ya no se consume con `paso = 0`, así que un
  `defaultValue` que apunte al tercer panel aparece ahí en vez de deslizarse hasta él.
- `delay` del contrato semilla **sigue sin migrar**. Es autoavance, no bucle, y con un `tablist` que
  cambia solo hay que decidir antes qué pasa con el foco y con `prefers-reduced-motion`.
- `CodePeek` pedía `h={420} fill auto`: se le quita `auto`, que con `fill` no hacía nada y cuyo panel
  `result` —`Card h="100%"`— habría colapsado si hubiera ganado.

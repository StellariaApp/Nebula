# GradientBorder

## Por qué `mask-composite` y no dos capas

La alternativa obvia —un contenedor con el gradiente de fondo y un hijo con la superficie encima— es
más simple y se descarta por una razón concreta: obliga a que el interior sea **opaco**. Un anillo de
gradiente alrededor de una card translúcida, de un `GlassSurface` o de un fondo con imagen quedaría
tapado por el relleno del hijo.

El anillo se recorta con dos máscaras compuestas sobre un `::before`:

```
mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
mask-composite: exclude;
```

La primera máscara cubre solo la caja de contenido, la segunda la caja entera; `exclude` deja
justamente el `padding`, que es el grosor del anillo. El interior queda transparente de verdad, y por
eso `surface` es opcional y su default es `"none"`.

`-webkit-mask` y `-webkit-mask-composite: xor` acompañan a las propiedades sin prefijo por Safari; son
la misma operación con otro nombre (`xor` ≡ `exclude` para dos capas opacas).

## Las dos degradaciones

1. **Sin `mask-composite`** — `@supports not ((mask-composite: exclude) or (-webkit-mask-composite:
xor))` oculta el `::before` y pone un `border: 1px solid` con el **primer stop** del gradiente
   (`ResolveGradientEdge`). Sin esa rama el `::before` pintaría un rectángulo de gradiente macizo
   encima de todo, que es peor que no tener anillo.
2. **Forced colors** — mismo camino con `CanvasText`. El sistema no repinta un `background` de
   gradiente, así que el anillo tiene que volver a ser un borde real para existir en alto contraste.

## `z-index: -1` en el `::before`

El anillo es hermano del contenido en el orden de pintado, no un fondo. Con `z-index: auto` se pintaría
encima del texto del hijo; con `-1` cae debajo del contenido y encima del fondo del contexto de
apilamiento, que el `isolation: isolate` de la raíz garantiza que sea el propio componente.

## `width` es un número, no un token

No hay escala de grosores de borde en `NebulaTheme` —los componentes usan 1 px— y este es el único
sitio del catálogo donde un anillo de 2–3 px tiene sentido visual. Se expone como número en px en vez
de inventar un token que ningún otro componente consumiría.

## `beam` — el arco que orbita el marco

Trae la maqueta de producto de Rosette (`.product-preview::before` en su `globals.css`): un arco de
luz que recorre el marco mientras el resto del borde se queda quieto.

**Con `beam` el anillo estático deja de ser el gradiente y pasa a `border.default`.** Es la parte que
más se nota si se omite: con el anillo entero teñido de marca, el arco no se lee como luz viajando
sino como un neón con halo alrededor de todo el marco. El gradiente sigue mandando, pero solo en el
arco.

### Los lados se eligen, y son cuatro

`edges` toma los lados por número en sentido horario —**1 arriba, 2 derecha, 3 abajo, 4 izquierda**— y
por defecto van los cuatro. El orden de la prop no importa: `edges={[3, 1]}` y `edges={[1, 3]}` dan lo
mismo, porque la secuencia la marca el recorrido del marco, no el orden en que se escriban.

### `sequence`: qué pasa con los lados que no están

|                            | recorrido                                                                 | ciclo con N lados |
| -------------------------- | ------------------------------------------------------------------------- | ----------------- |
| `continuous` (por defecto) | al acabar un lado la luz salta al siguiente **elegido**                   | `slot × N`        |
| `spaced`                   | cada lado espera su turno del marco completo; los que faltan son silencio | `slot × 4`        |

`slot` es constante —`duration.expressive × 3.25`, ≈1.37 s— y ese es el punto: **la luz recorre un
lado a la misma velocidad se elijan los que se elijan**. Un ciclo fijo repartido entre los lados haría
que con dos lados la luz fuera al doble de lento, que se lee como otro efecto, no como el mismo con
menos lados. Con los cuatro y `continuous` el ciclo son 5.46 s, que es la órbita de 5.5 s de la
referencia.

### Cómo está montado, y por qué no con `@property`

La forma directa sería animar el ángulo de un `conic-gradient` con `@property --angle`, que es como lo
hace la referencia. No se usa: vanilla-extract no emite `@property`, y registrarlo desde JS con
`CSS.registerProperty` dejaría el primer pintado sin animación hasta que corriera el cliente.

En su lugar cada lado es un `<span>` que **recorre el marco** con `offset-path: border-box`, animando
`offset-distance`. El contenedor lleva la misma máscara de anillo que el `::before`, así que la estela
solo se ve en la banda del borde; `offset-rotate: auto` la orienta con la tangente, de modo que sigue
la curva del radio en las esquinas en vez de cortarse en seco.

Cada `<span>` corre dos animaciones a la vez: el **barrido**, que va del principio al final de su lado
y dura `slot`; y la **compuerta**, que lo enciende durante su turno y dura el ciclo. Los dos ejes
viajan como nombre de keyframe en una var en línea en vez de como clases combinadas: las 16
combinaciones de lado × turno eran 16 módulos de vanilla-extract, y esos tienen efecto, así que no se
sacuden del barrel y engordaban el presupuesto de cualquiera que importara del índice.

`offset-distance` no es `transform` ni `opacity`, y `docs/03` §2 solo admite esos dos. Cumple igual:
el navegador lo resuelve **a una transformada** sobre la estela ya rasterizada —es la misma traslación
más rotación que escribiríamos a mano— y no refluye ni repinta nada del marco. Lo que `docs/03`
prohíbe es animar propiedades que disparan layout o paint por frame; esta no es una de ellas.

### Por qué ya no es una rotación cónica

La primera versión daba a cada lado un `<span>` sobredimensionado con un arco en cónico que **giraba**
90° dentro de su cuadrante. Esa geometría solo es correcta en un cuadrado, y no por un margen
pequeño: la luz recorre el borde superior de `x = -h/2` a `x = +h/2`, o sea **una fracción `h/w` del
lado**. A 16:9 ilumina el 56% del borde y jamás llega a los vértices; en una card de 8:1 —las tiras
de la landing— ilumina el 12% y cruza el resto de golpe, que en pantalla se lee como un pegote quieto
en el centro y un fogonazo después. El barrido angular no es el barrido del perímetro salvo en 1:1.

`offset-distance` recorre longitud, no ángulo, así que el problema desaparece en cualquier
proporción, y de paso la velocidad de la luz deja de depender de en qué punto del lado esté.

### Con los cuatro lados no hay tramos: hay una vuelta

El caso por defecto —`continuous` y los cuatro lados— monta **un solo arco** que va de `0%` a `100%`
del recorrido en un ciclo. El porcentaje lo resuelve el navegador contra la longitud real del
trazado, así que sale gratis lo que en tramos cuesta: la velocidad es constante y el radio está
contado.

No es una optimización, es el arreglo de un fallo medido. Repartir el ciclo en cuatro tramos de
`slot` cada uno da **la misma duración a longitudes distintas**: en una card de 476×82 el lado
superior corría a 348 px/s y el derecho a 60, un salto de 5.8× en cada esquina. Y como los tramos se
escribían sumando `100cqw` y `100cqh`, trataban el marco como un rectángulo recto: el perímetro real
de uno redondeado es más corto —`(8 − 2π)r ≈ 1.72r` en la vuelta—, así que el reparto se pasaba de
largo y cada lado entraba ya empezado. Con `r: 20` el lado derecho arrancaba 24.8 px por debajo del
vértice en vez de en él.

### Los tramos siguen existiendo para los subconjuntos

`edges` con menos de cuatro lados, o `sequence="spaced"`, sí necesitan saber dónde acaba cada lado, y
eso en CSS solo se puede escribir en unidades de contenedor —en porcentaje no, porque las cuatro
fracciones dependen de la proporción de la caja y `offset-distance` las mide contra el recorrido
entero—. Ahí hay dos trampas que el reparto ingenuo no ve:

**Las unidades `cq` miden la caja de contenido y el trazado recorre la de borde.** El contenedor del
haz lleva `padding: ringWidth` para recortar el anillo, así que `100cqw` se queda corto en
`2 · ringWidth`. Hay que devolvérselo.

**El radio acorta el recorrido.** Un rectángulo redondeado mide `2w + 2h − (8 − 2π)r`, y cada esquina
se come `(2 − π/2)r` del vértice recto. Sin descontarlo, cada lado entra ya empezado y el desfase se
acumula vuelta a vuelta.

Lo que los tramos **no** pueden arreglar es el tiempo: cada lado dura lo mismo recorriendo longitudes
distintas, así que la velocidad salta en las esquinas. Es el precio de poder elegir lados, y por eso
el camino de una sola vuelta se reserva al caso en que no hay nada que elegir.

### Por qué la cola son piezas y no una estela (ADR-152)

`offset-rotate` orienta el **ancla**, no deforma la caja. Una estela larga es un rectángulo rígido, y
donde el trazado curva sus extremos siguen rectos: en una esquina de radio `r`, un segmento de largo
`L` se desvía `r − sqrt(r² − (L/2)²)` de la banda, y lo que se salga lo recorta la máscara. Con
`r: 20`, por encima de unos 13px el recorte ya se ve — la luz se acorta en los lados cortos y parece
saltar al doblar.

Acortarla hasta que quepa la deja demasiado tenue para leerse como luz. Así que la cola no es un
objeto largo: son `parts` piezas cortas escalonadas sobre el mismo trazado. Cada una cabe en la
curva, y la longitud la da la **separación** entre ellas, no el tamaño de ninguna.

El escalón va en fracción de vuelta y no en píxeles porque en CSS una duración no se deriva de una
longitud. La cola mide entonces `parts · gap` del perímetro y crece con el marco.

### `ARC_RISE` y `ARC_FALL` son el perfil de la luz, y lo comparten los dos montajes

`transparent 0% → from 36% → to 64% → transparent 100%`. Marcan dónde la luz alcanza opacidad plena
entrando y dónde empieza a apagarse saliendo, y el color solo manda en ese cuerpo central.

`BeamArc` los pinta como gradiente dentro de la estela única —el camino de `edges` parcial y de
`spaced`—, y `TrailStop` reparte **ese mismo perfil** entre las piezas de la cola: la opacidad sube
hasta el 36%, se mantiene hasta el 64% y baja desde ahí, que es de donde salen las dos puntas
difuminadas. Son una sola definición a propósito: con números propios en cada camino, un
`edges={[1, 3]}` se vería como otro componente en vez de como el mismo con menos lados.

### El desenfoque va en el contenedor, no en cada pieza

`filter` se aplica **antes** que `mask`, así que un blur en el contenedor funde las piezas entre sí y
la máscara recorta después. Pieza a pieza cada una se difuminaría por su cuenta y el troceado
seguiría leyéndose. Es bajo a propósito: hay animación en la misma capa y `effects-guardrails`
prohíbe encadenar blur alto con movimiento.

### La banda del haz es la del anillo, y no puede ser otra

La máscara solo pinta dentro de la caja, así que ensanchar la banda del haz **solo puede crecer hacia
dentro**: un haz más grueso que su borde es, por construcción, un haz metido en el relleno. Para una
luz más gruesa se sube `width`, que engorda el borde entero.

De ahí que **no haya halo posible aquí**: todo lo que pinta el haz, incluido el `drop-shadow` de las
piezas, está recortado a la banda. Un derrame hacia fuera exigiría una segunda capa sin máscara, o
sea duplicar las piezas.

### `trail` afina los tres ejes, y por eso son tres

```tsx
<GradientBorder beam trail={{ parts: 32, gap: 0.00385, bloom: 0.5 }} />
```

`parts` es **resolución** —más muestras del gradiente, misma longitud— y `gap` es **longitud** —mismo
detalle, más recorrido—. Confundirlos es el error a evitar: alargar la cola agrandando las piezas la
vuelve tosca, y alargarla subiendo `gap` sin subir `parts` la deja rala. Un solo peldaño no dejaría
corregir un eje sin mover los otros.

`parts` lleva suelo de 2: por debajo no hay rampa que repartir, y en `0` o negativo el haz
desaparecería sin dar error.

### Las tres paradas

`prefers-reduced-motion`, `motion.tier: "minimal"` y `edges={[]}` dejan el marco **estático**, no roto:
las capas no se montan (o no animan) y queda el anillo de siempre. Igual que en `StarField`, el tier se
decide en JS y el media query en CSS.

Las capas son `aria-hidden` y `pointer-events: none`, y las dos degradaciones del anillo —sin
`mask-composite` y en `forced-colors`— también las apagan.

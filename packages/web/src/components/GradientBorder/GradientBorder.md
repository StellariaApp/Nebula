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

## `beam` — la luz que orbita el marco

Trae la maqueta de producto de Rosette (`.product-preview::before` en su `globals.css`): una cola de
luz que recorre el marco mientras el resto del borde se queda quieto.

**Con `beam` el anillo estático deja de ser el gradiente y pasa a `border.default`.** Es la parte que
más se nota si se omite: con el anillo entero teñido de marca, la luz no se lee como algo que viaja
sino como un neón con halo alrededor de todo el marco. El gradiente sigue mandando, pero solo en la
cola.

### Una sola animación, y la velocidad no cambia nunca (ADR-177)

Hay **una sola animación**: `offset-distance` de una punta a otra del recorrido. Por defecto son la
vuelta entera —`0%` a `100%` en `duration.expressive × 13` ≈ 5.5 s, la órbita de la referencia— y el
porcentaje lo resuelve el navegador contra la longitud real del trazado, así que la velocidad es
constante y el radio está contado sin escribir geometría ninguna.

No es una preferencia, es el arreglo de un fallo medido. La versión anterior repartía el ciclo en
cuatro tramos de igual duración, y eso da **la misma duración a longitudes distintas**: en una card de
476×82 el lado superior corría a 348 px/s y el derecho a 60, un salto de 5.8× en cada esquina.

Cuando `continuous` recorta el recorrido a los lados encendidos, **el ciclo se acorta en la misma
proporción**, así que la luz sigue yendo a la misma velocidad: lo único que cambia es cuánto camino
hace.

### Los lados se eligen, y son una ventana

`edges` toma los lados por número en sentido horario —**1 arriba, 2 derecha, 3 abajo, 4 izquierda**— y
por defecto van los cuatro. El orden de la prop no importa: `edges={[3, 1]}` y `edges={[1, 3]}` dan lo
mismo, porque el recorrido lo marca el marco.

Lo que hay que tener claro es que **`edges` no es una ruta, es una ventana**. La luz pasa siempre por
los cuatro lados; los que no están en la lista se limitan a taparla. De ahí las tres consecuencias que
la distinguen de un reparto:

- **La velocidad no depende de cuántos lados haya.** Lo que cambia es cuánto camino hace, y con
  `sequence="continuous"` también cuánto dura el ciclo.
- **La luz entra y sale por la boca de la franja**, a mitad de la curva y deslizándose, en vez de
  aparecer ya montada sobre el lado. Es lo que el reparto no podía dar sin pintar en los apagados.
- **Un lado suelto se enciende una vez por tramo**, no una vez por vuelta: con `continuous` el ciclo
  se queda en lo que mide ese lado, así que la luz vuelve enseguida. Con `spaced` sí espera la vuelta
  entera (~5.5 s).

### Cómo se recorta: cuatro franjas centradas en su lado

La ventana es una capa de máscara por lado encendido sobre un envoltorio propio (`edge_window`), cada
una con su `mask-position` y su `mask-size`. Una franja es lo que le toca a un lado: **media curva de
entrada, su tramo recto y media curva de salida**.

Los cortes van a mitad de curva y no en sus extremos, y esa es la diferencia que se ve: la luz aparece
y desaparece **doblando**, no al entrar o salir del tramo recto. El punto medio de una esquina está a
`(1 − 1/√2)·r` del vértice de la caja —ahí cruza el arco la bisectriz—, así que ese, y no el radio
entero, es el ancho del corte.

**Los dos cortes son los lados de la franja, nunca su fondo.** Es lo que la hace ir centrada en su
lado, recortada por los dos extremos por igual (`50%`). Si un extremo lo marcara el fondo, ese lado
entraría antes que sale el otro —el fondo cae más adentro que el corte— y la luz asomaría antes de
llegar al punto medio.

El fondo, entonces, no decide nada de lo que se ve: cae en el relleno, que la máscara del anillo ya se
come. Solo tiene que dar para tapar la cara interior de la banda, que en el punto del corte queda hasta
`1.5 · ringWidth` más adentro que la exterior porque ahí la banda cruza en diagonal.

### El parche de esquina, y por qué la entrega no se puede dejar a dos capas

**Las capas de una máscara no se suman: se componen una sobre otra.** Donde el borde de una franja
cruza el de su vecina, las dos valen `0.5` por el antialias y el resultado es `1 − 0.5·0.5 = 0.75`:
una muesca de un píxel exactamente en el punto donde la luz cambia de franja, que es el sitio donde
más se mira. Es la razón de que el corte sobreviviera a dos intentos de moverlo — cambiaba de sitio,
no desaparecía. Y no hay reparto que lo evite: cualquier partición exacta hace que los dos bordes se
toquen sobre la banda.

Así que el cruce se tapa con una **tercera capa opaca**: un cuadrado de lado `DEPTH` en la esquina,
que se emite **solo cuando los dos lados de esa esquina están encendidos** —que es cuando la luz tiene
que cruzarla entera—. Sus propios bordes caen donde una franja ya es opaca, así que no añade muescas.

Por eso el parche no desplaza ningún corte: con un lado suelto no hay parche, y su franja sigue
empezando y acabando en el punto medio de la curva. Y con los cuatro lados no hay ventana en absoluto
—la unión sería el anillo entero—, así que no se escribe ninguna capa y no hay cruce que tapar.

El radio hay que resolverlo a una longitud en JS (`BeamRadius`), y un valor responsive manda su
peldaño `base`.

**Máscara y no `clip-path`**: la máscara admite lista, así que la ventana es la unión de las franjas
elegidas. La unión de las del 1 y el 3 son dos rectángulos sueltos, y eso no es un polígono que
`clip-path` pueda escribir.

### `sequence`: qué pasa con los lados apagados

|                            | recorrido                                                        | ciclo                       |
| -------------------------- | ---------------------------------------------------------------- | --------------------------- |
| `continuous` (por defecto) | se salta lo apagado: al acabar el tramo vuelve a su principio    | proporcional al tramo       |
| `spaced`                   | la vuelta entera; lo apagado cuesta su parte del ciclo a oscuras | siempre la vuelta completa  |

La diferencia solo existe con lados apagados, y **en las dos la luz va igual de rápida**: `continuous`
no acelera, acorta.

`continuous` necesita que los lados encendidos formen **un tramo seguido**. Con `edges={[1, 3]}` hay
dos tramos sueltos y una sola animación no puede recorrer los dos saltándose lo de en medio, así que
ahí sale la vuelta entera aunque se pida `continuous`.

### Por qué hay que medir el marco

Para acortar el ciclo «lo mismo» que el recorrido hay que saber cuánto mide el recorrido, y **en CSS
una duración no se deriva de una longitud**. Esa es la pared con la que chocaron los dos montajes
anteriores: el de tramos mantenía el ciclo y cambiaba la velocidad; el de la vuelta entera mantiene la
velocidad y cobra el tiempo de lo que no se ve.

Así que `continuous` mide: ancho, alto y el radio ya resuelto a píxeles (`getBoundingClientRect` y
`getComputedStyle` sobre la capa del haz, que es del tamaño del marco), y con eso calcula el perímetro
real —`2w + 2h − (8 − 2π)r`—, dónde empieza y acaba el tramo encendido, y escribe tres cosas: las dos
puntas en porcentaje (`beamFrom`, `beamTo`) y el ciclo ya escalado.

Tres detalles que hacen que se vea bien:

- **El trazado es cerrado**, así que un valor negativo o mayor que `100%` da la vuelta en vez de
  recortarse. De eso vive el tramo que cruza el origen del trazado —`edges={[4, 1]}`—, que va de
  `79.55%` a `131.21%`.
- **El salto de vuelta se esconde.** Las dos puntas se meten una pieza de cola más allá de las bocas
  de la ventana, donde la máscara ya no deja ver nada: la cola desaparece por una boca y reaparece por
  la otra sin que se vea saltar.
- **La cola conserva su longitud.** Su escalón va en fracción del recorrido, así que al acortarse el
  recorrido la cola encogería; el escalón se reescala por el mismo factor para que mida lo mismo en
  píxeles.

Sin medida —servidor, primer pintado, `spaced`, o lados que no forman un tramo— sale la vuelta entera.
Es el mismo HTML que hidrata: la medida solo refina lo que ya se está viendo.

### Por qué `offset-path` y no `@property`

La forma directa sería animar el ángulo de un `conic-gradient` con `@property --angle`, que es como lo
hace la referencia. No se usa: vanilla-extract no emite `@property`, y registrarlo desde JS con
`CSS.registerProperty` dejaría el primer pintado sin animación hasta que corriera el cliente.

En su lugar la cola **recorre el marco** con `offset-path: border-box`, animando `offset-distance`. El
contenedor lleva la misma máscara de anillo que el `::before`, así que solo se ve en la banda del
borde; `offset-rotate: auto` la orienta con la tangente, de modo que sigue la curva del radio en las
esquinas en vez de cortarse en seco.

`offset-distance` no es `transform` ni `opacity`, y `docs/03` §2 solo admite esos dos. Cumple igual:
el navegador lo resuelve **a una transformada** sobre la pieza ya rasterizada —es la misma traslación
más rotación que escribiríamos a mano— y no refluye ni repinta nada del marco. Lo que `docs/03`
prohíbe es animar propiedades que disparan layout o paint por frame; esta no es una de ellas.

### Por qué no es una rotación cónica

La primera versión daba a cada lado un `<span>` sobredimensionado con un arco en cónico que **giraba**
90° dentro de su cuadrante. Esa geometría solo es correcta en un cuadrado, y no por un margen
pequeño: la luz recorre el borde superior de `x = -h/2` a `x = +h/2`, o sea **una fracción `h/w` del
lado**. A 16:9 ilumina el 56% del borde y jamás llega a los vértices; en una card de 8:1 —las tiras
de la landing— ilumina el 12% y cruza el resto de golpe, que en pantalla se lee como un pegote quieto
en el centro y un fogonazo después. El barrido angular no es el barrido del perímetro salvo en 1:1.

`offset-distance` recorre longitud, no ángulo, así que el problema desaparece en cualquier proporción,
y de paso la velocidad de la luz deja de depender de en qué punto del lado esté.

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

### `ARC_RISE` y `ARC_FALL` son el perfil de la luz

`transparent 0% → from 36% → to 64% → transparent 100%`. Marcan dónde la luz alcanza opacidad plena
entrando y dónde empieza a apagarse saliendo, y el color solo manda en ese cuerpo central.

`TrailStop` reparte ese perfil entre las piezas de la cola: la opacidad sube hasta el 36%, se mantiene
hasta el 64% y baja desde ahí, que es de donde salen las dos puntas difuminadas. Antes había una
segunda definición —un gradiente dentro de la estela única de los subconjuntos— y desapareció con
ella: con una sola cola no hay dos perfiles que mantener a juego.

### El desenfoque va arriba del todo, no en cada pieza

`filter` se aplica **antes** que la máscara del elemento que lo lleva y **después** que las de sus
hijos. Puesto en el contenedor del haz —encima de la ventana— hace las dos cosas que hacen falta:
funde las piezas entre sí y **ablanda la boca de la franja**, que sin él sería un corte recto. En la
ventana fundiría igual pero dejaría la boca dura; pieza a pieza cada una se difuminaría por su cuenta
y el troceado seguiría leyéndose.

Es bajo a propósito: hay animación en la misma capa y `effects-guardrails` prohíbe encadenar blur alto
con movimiento. Y hasta ADR-177 no hacía nada — `beamBloom` se asignaba y ninguna hoja lo leía.

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

Los tres se leen **siempre**, se enciendan los lados que se enciendan: `edges` decide dónde se ve la
cola, nunca cómo está hecha.

### Las tres paradas

`prefers-reduced-motion`, `motion.tier: "minimal"` y `edges={[]}` dejan el marco **estático**, no roto:
las capas no se montan (o no animan) y queda el anillo de siempre. Igual que en `StarField`, el tier se
decide en JS y el media query en CSS.

Las capas son `aria-hidden` y `pointer-events: none`, y las dos degradaciones del anillo —sin
`mask-composite` y en `forced-colors`— también las apagan.

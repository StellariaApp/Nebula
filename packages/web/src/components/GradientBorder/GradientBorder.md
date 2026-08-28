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

### Una sola animación, y la velocidad no cambia nunca (ADR-177, ADR-186)

Hay **una sola animación**: `rotate` de `0deg` a `360deg` sobre un cuadrado con el gradiente cónico
de la luz, en `duration.expressive × 13` ≈ 5.5 s, la órbita de la referencia. El ciclo dura lo mismo
se enciendan los lados que se enciendan.

No es una preferencia, es el arreglo de un fallo medido. La versión más antigua repartía el ciclo en
cuatro tramos de igual duración, y eso da **la misma duración a longitudes distintas**: en una card de
476×82 el lado superior corría a 348 px/s y el derecho a 60, un salto de 5.8× en cada esquina.

Un giro uniforme tiene el mismo vicio en pequeño, y por eso la curva no es `linear`. El punto donde el
rayo corta el borde avanza como `sec²θ`: se arrastra en mitad de cada lado y se dispara en las
esquinas. Medido sobre una tarjeta de 410×307, con giro uniforme el avance por paso iba de 41 a 87 px
—**2.12×**— y en una tira de 16:5 llegaba a **6.06×**. Se lee exactamente como un ease por lado.

Lo que lo corrige es una **`linear()` de 192 paradas generada a medida del marco**: se muestrea la
longitud de arco recorrida a cada ángulo y se reparte el tiempo por perímetro en vez de por ángulo. Es
el mismo recurso que `SpringToEasing` usa para muestrear un muelle. Con ella el avance queda plano
—razón **1.00** en 4:3 y en 16:5— y la luz nunca se aparta más de **0.14 px** de donde tocaría.

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

|                            | qué hace                                                          | ciclo                      |
| -------------------------- | ----------------------------------------------------------------- | -------------------------- |
| `continuous` (por defecto) | reparte varias cuñas: al salir una por una boca, entra otra       | la vuelta entera, siempre  |
| `spaced`                   | una sola cuña; lo apagado cuesta su parte del ciclo a oscuras      | la vuelta entera, siempre  |

La diferencia solo existe con lados apagados, y **en las dos la luz va igual de rápida**: `continuous`
no acelera, sino que no deja hueco. El ciclo no cambia nunca — lo que cambia es cada cuánto pasa una
cuña por la ventana.

`continuous` necesita que los lados encendidos formen **un tramo seguido**. Con `edges={[1, 3]}` hay
dos tramos sueltos y no hay un reparto que sirva a los dos, así que ahí sale una sola cuña aunque se
pida `continuous`.

### Por qué hay que medir el marco

La curva de arco **es** el marco: sin ancho, alto y radio no se sabe cuánto perímetro hay por grado, y
en CSS eso no se deriva de nada. Así que se mide —`getBoundingClientRect` y `getComputedStyle` sobre
la capa del haz, que es del tamaño del marco— y con eso se calculan dos cosas: la `linear()` y cuántas
cuñas hacen falta.

**Y la esquina hay que modelarla redonda.** Con el marco tratado como rectángulo en pico la curva
converge malísimo, porque una esquina en pico es un pliegue: subiendo paradas de 48 a 768 la razón se
estancaba en 1.07 y no bajaba. Modelando rectas más cuartos de círculo —perímetro
`2w + 2h − (8 − 2π)r`— la función es suave y 192 paradas bastan.

Sin medida —servidor o primer pintado— sale `linear` y una sola cuña: la vuelta entera, a giro
uniforme. Es el mismo HTML que hidrata; la medida solo refina lo que ya se está viendo.

### Por qué ahora sí es una rotación cónica (ADR-186)

Hubo una versión con un `<span>` por lado que giraba 90° dentro de su cuadrante, y se descartó con
razón: esa geometría solo es correcta en un cuadrado. La luz recorría el borde superior de `x = -h/2`
a `x = +h/2`, o sea **una fracción `h/w` del lado** — a 16:9 iluminaba el 56% y jamás llegaba a los
vértices.

Lo que la rescata no es la cónica, es **la curva de arco**. Aquella versión rotaba a ángulo uniforme y
por cuadrantes; ésta gira los 360° enteros sobre el marco completo y reparte el tiempo por perímetro,
que es justo lo que le faltaba. El barrido angular sigue sin ser el barrido del perímetro — pero la
`linear()` traduce uno en el otro, y el resultado se mide plano en cualquier proporción.

Tampoco hace falta `@property`. La referencia anima `--angle` de un cónico, que vanilla-extract no
emite y que registrado desde JS dejaría el primer pintado sin animación; aquí lo que se anima es
`rotate`, propiedad nativa y de las que el compositor acelera.

### Por qué un solo elemento y no piezas (ADR-186, deroga ADR-152)

El montaje anterior recorría el marco con `offset-path: border-box` animando `offset-distance`, y
como `offset-rotate` orienta el ancla pero no deforma la caja, una estela larga no cabía en la curva:
había que partirla en `parts` piezas cortas escalonadas. Treinta y dos por haz.

**`offset-distance` no se anima en el compositor.** Chrome solo acelera `transform`, `opacity`,
`filter`, `backdrop-filter`, `rotate`, `scale` y `translate`; lo demás recalcula estilo y repinta en
el hilo principal, una vez por fotograma y por elemento. Medido sobre una landing con seis haces
—Edge, 1440×900, `Performance.getMetrics`—: 230 animaciones vivas, **192 de ellas piezas de cola**, el
22% de los nodos de la página. El recálculo de estilo se comía el **37%** del tiempo de reloj con la
página quieta y la CPU no bajaba del 91%.

Prueba de que el mecanismo era ése y no otro: apagar el desenfoque, el `drop-shadow` de la pieza o el
`backdrop-filter` de los cristales no movía el recálculo ni un punto, y apagar 33 estrellas que animan
`transform` y `opacity` tampoco. Ésas van en el compositor; la cola no.

Con el barrido cónico son **ocho animaciones en vez de 256** para ocho haces a la vista, y **144 fps
frente a 22**, con el recálculo en el 3%.

### Las cuñas repartidas, y por qué más de una

Con la ventana recortada a un tramo, un solo cometa entra por una boca y sale por la otra dejando
hueco: se apaga hasta que vuelve. La cola de piezas no lo hacía porque su banda de fases **envuelve el
punto de vuelta** — unas piezas salen por el final mientras otras entran por el principio.

Se reproduce repartiendo varias cuñas por el giro, separadas `360° / n` con `n = ceil(360° / (ventana
+ cuña))`. Así, cuando una sale por la boca de arriba la siguiente ya entra por la de abajo, y como el
giro es de 360° enteros no hay punto de vuelta que romper. Medido sobre un ciclo completo con `[1, 2]`
encendidos, el mínimo de píxeles encendidos sube de 26 a 92 y el salto máximo entre instantes
—incluida la vuelta— baja de 101 a 23.

`n` está topado para que las cuñas no se pisen entre sí: nunca hay menos de `cuña × 1.15` grados de
separación. Con los cuatro lados, con `spaced` o con un tramo roto sale **una sola cuña**, que es la
vuelta entera de siempre.

### El desenfoque va en la pieza que gira

`bloom` es `filter: blur()` sobre el propio barrido, no sobre su contenedor. Puesto arriba obligaría a
volver a desenfocar la capa entera en cada fotograma, porque su contenido se mueve; puesto en la pieza
se rasteriza una vez y lo que se anima después es solo la transformada.

### La banda del haz es la del anillo, y no puede ser otra

La máscara solo pinta dentro de la caja, así que ensanchar la banda del haz **solo puede crecer hacia
dentro**: un haz más grueso que su borde es, por construcción, un haz metido en el relleno. Para una
luz más gruesa se sube `width`, que engorda el borde entero.

De ahí que **no haya halo posible aquí**: todo lo que pinta el haz, incluido el `drop-shadow` de las
piezas, está recortado a la banda. Un derrame hacia fuera exigiría una segunda capa sin máscara, o
sea duplicar las piezas.

### `trail`: la cola mide `parts · gap`, y ese producto es lo que manda

```tsx
<GradientBorder beam trail={{ parts: 32, gap: 0.00385, bloom: 0.5 }} />
```

La cola mide **`parts · gap` del perímetro** —de fábrica el 12.32%, que sobre un marco de 410×307 son
172 px— y eso es exactamente lo que medía la cola de piezas con los mismos valores. Los montajes que
consumen `trail` no notan el cambio de motor.

Lo que sí cambió es que **`parts` ya no es resolución**. Con la cola partida en piezas, `parts` decidía
cuántas muestras del gradiente había y `gap` cuánto se separaban; con un gradiente cónico la rampa es
continua y no hay nada que muestrear. Los dos peldaños siguen ahí porque el producto es el mando real y
romperlos habría cambiado la API, pero mover cualquiera de los dos hace lo mismo: alargar o acortar.

`parts` conserva su suelo de 2, y la cuña se topa a la vuelta entera: una cola más larga que el marco
no significa nada.

Los tres se leen **siempre**, se enciendan los lados que se enciendan: `edges` decide dónde se ve la
cola, nunca cómo está hecha.

### Las tres paradas

`prefers-reduced-motion`, `motion.tier: "minimal"` y `edges={[]}` dejan el marco **estático**, no roto:
las capas no se montan (o no animan) y queda el anillo de siempre. Igual que en `StarField`, el tier se
decide en JS y el media query en CSS.

Las capas son `aria-hidden` y `pointer-events: none`, y las dos degradaciones del anillo —sin
`mask-composite` y en `forced-colors`— también las apagan.

## El haz sólo corre mientras se ve

Aunque el barrido vaya en el compositor, un haz fuera de pantalla sigue costando: el compositor lo
sigue transformando y rasterizando cada fotograma.

De ahí `data-onscreen`. Un `IntersectionObserver` **compartido** (`utils/visibility.ts`, uno por
`rootMargin` para todo el catálogo, no uno por instancia) marca el contenedor del haz cuando sale de
pantalla y la hoja le pone `animation-play-state: paused`. Con la cola de piezas bajaba el recálculo
del 37% al 22% sobre la landing de Rosette; con el barrido lo que ahorra es trabajo de compositor, y
sigue valiendo lo mismo: en una landing hay seis haces y sólo uno o dos caben a la vez.

Arranca en `true` a propósito. Con `false` el haz nace congelado y se destapa cuando el observador
contesta, un fotograma después: se leía como un tirón justo en la pieza que marca el LCP.

# AnimatedGradient

## Lo que ADR-043 dejó pendiente

El `.md` de `GradientText` cerró W3.1 diciendo que animar un gradiente exige mover
`background-position`, que no es `transform` ni `opacity` y por tanto incumple `docs/03` §2. Esa
afirmación es cierta **para el texto**, donde el gradiente está recortado sobre las glifas y la única
forma de moverlo es desplazar el fondo.

Aquí no. El gradiente no se anima: se anima **una capa que lo lleva pintado**. La capa `drift` es un
absoluto sobredimensionado que gira y se traslada con `transform`, y la raíz la recorta con
`overflow: hidden`. El resultado en pantalla es un gradiente que deriva; el trabajo del compositor es
una transformada sobre una textura ya rasterizada. `background-position` no se toca en ningún frame.

## Por qué la capa es cuadrada y no un `inset` negativo

La primera versión sobredimensionaba con `inset: -40%`, que da una capa de `1.8w × 1.8h` — **con la
misma proporción que la raíz**. Eso sobrevive en una caja casi cuadrada y se rompe en cuanto se
aplasta: al girar 90°, el semiancho de la capa pasa a valer `1.26h`, y tiene que cubrir `0.5w` de
raíz más el `0.144w` que la aleja el `translate`. Sale `h ≥ 0.51w`. Por debajo de esa proporción la
rotación descubre el borde de la capa y se ve un corte diagonal cruzando la card — que es justo lo
que el sobredimensionado pretendía evitar.

La capa es ahora **un cuadrado de lado `100cqw + 100cqh`** centrado en la raíz, y la raíz expone las
unidades de contenedor desde `drift_frame`, un absoluto `inset: 0` con `container-type: size` (la
raíz no puede llevarlo: su alto sale del contenido, y contener el tamaño lo colapsaría).

El lado sale de una desigualdad, no de un tanteo: un cuadrado de semilado `r` girado mantiene `r`
como distancia del centro a sus lados, así que basta con que `r` supere la circunradio de la raíz más
el desplazamiento. Con `scale(1.4)` mínimo, `r = 0.7(w + h)`; la circunradio es `0.5√(w² + h²) ≤
0.5(w + h)` y el `translate` de 8%/6% aporta `0.1(w + h)`. `0.6(w + h) ≤ 0.7(w + h)` se cumple
**para cualquier proporción**, y con `scale(1.62)` sobra más. Ninguna caja descubre ya una esquina.

## Duración derivada de tokens

`docs/06` §6 fija que un loop ambiental deriva su duración de motion tokens: «`expressive × 6` para
breathing, `expressive × 12` para recorridos largos». Este es un recorrido largo, así que `speed`
multiplica `duration.expressive` por 18 / 12 / 8. No hay ningún número de milisegundos escrito a mano y
un tema que baje `duration.expressive` frena el loop entero.

Se usa `keyframes` de CSS y no `motion`: el loop es ambiental y no reacciona a nada: ni estado, ni
gesto, ni entrada/salida. Montar `m.div` aquí añadiría el runtime de animación por un `animation` de
dos líneas que el compositor ya sabe hacer solo.

## Las dos paradas

`prefers-reduced-motion` y `motion.tier: "minimal"` paran el loop, y las dos por caminos
distintos porque una es CSS y la otra data del tema:

- El media query aplica `still` de `styles/motion.css.ts`;
- el tier llega como `data-animated="false"` desde JS y aplica el mismo `still`.

Las dos **componen el sustituto estático** en vez de sustituir la animación (ADR-034): reponen el
`transform` del frame 0. Sin eso la capa volvería a su posición sin escalar y se verían las esquinas
del recorte — que es exactamente el «spinner congelado a media vuelta» que ADR-034 prohíbe, con otra
forma.

## `scrim`

Igual que en `GradientBackground`: un gradiente en movimiento tiene un contraste que cambia con el
tiempo, así que cualquier texto encima necesita velo. Aquí es más importante todavía, porque un ratio
que se cumple en el frame 0 puede fallar en el frame 300.

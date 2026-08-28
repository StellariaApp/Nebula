# ADR-186 — El haz es un barrido cónico compuesto, no una cola de piezas

- **Estado**: **aceptada** · 2026-08-28 — decidida por el propietario
- **Cambia API pública**: **no**. Ni una prop nueva ni una retirada. `trail.parts · gap` sigue siendo
  la longitud de la cola con el mismo resultado en píxeles; lo que cambia es que `parts` deja de ser
  «resolución» porque ya no hay nada que muestrear.
- **Deroga**: ADR-152 (la cola son piezas y no una estela). Mantiene ADR-177 (una sola animación, la
  velocidad no cambia nunca).
- **Toca**: `packages/web/src/components/GradientBorder`, `packages/web/src/utils/visibility.ts`.

## Contexto

`beam` montaba la cola como `parts` piezas cortas escalonadas sobre `offset-path: border-box`, cada
una animando `offset-distance`. Treinta y dos por haz, por defecto.

**`offset-distance` no se anima en el compositor.** Chrome solo acelera `transform`, `opacity`,
`filter`, `backdrop-filter`, `rotate`, `scale` y `translate`. Lo demás recalcula estilo y repinta en
el hilo principal, una vez por fotograma y por elemento.

Medido sobre la landing de Rosette con seis haces (Edge, 1440×900, `Performance.getMetrics`):

| | |
| --- | --- |
| animaciones vivas | 230 |
| de ellas, piezas de cola | **192** — el 22% de los nodos de la página |
| recálculo de estilo, con la página quieta | **37%** del tiempo de reloj |
| CPU | **91%**, sostenido desde el primer segundo |

Ablación, quitando cada cosa en caliente y midiendo 6 s:

| corte | fps | CPU | recálculo |
| --- | --- | --- | --- |
| base | 54 | 91% | 37% |
| **sin las colas** | **144** | **31%** | 16% |
| sin el desenfoque del contenedor | 72 | 95% | 40% |
| sin el `drop-shadow` de la pieza | 77 | 97% | 43% |
| sin las estrellas de `StarField` | 80 | 96% | 40% |
| sin `backdrop-filter` en los cristales | 74 | 95% | 39% |

Las estrellas animan `transform` y `opacity` y no cuestan nada medible: van en el compositor. Las
colas no. Con la CPU frenada 4× —un portátil corriente— la diferencia era de **17 a 98 fps**.

No hay fuga: nodos, listeners y heap quedan planos en siete vueltas de navegación con GC forzado. El
coste es constante y está desde el primer fotograma; lo que el usuario percibe como degradación es la
máquina bajando de frecuencia con un núcleo clavado al 100%.

## Decisión

Un **solo elemento** con `conic-gradient`, animando `rotate` de `0deg` a `360deg`. Compositable.

Tres piezas lo hacen equivalente a lo que había:

1. **Curva de arco.** Un giro uniforme no es un barrido uniforme del perímetro: el punto de corte
   avanza como `sec²θ`. Se genera una `linear()` de 192 paradas muestreando la longitud de arco por
   ángulo, de modo que el tiempo se reparte por perímetro. La esquina se modela **redonda** —rectas
   más cuartos de círculo—; con esquina en pico la curva es un pliegue y la razón se estanca en 1.07
   por más paradas que se pongan.
2. **Cuñas repartidas.** Con la ventana recortada a un tramo, una sola cuña deja hueco al volver. Se
   reparten `ceil(360° / (ventana + cuña))` cuñas por el giro, topadas para que no se pisen, y como
   el giro es de 360° enteros no hay punto de vuelta que romper.
3. **Pausa fuera de pantalla.** `data-onscreen` desde un `IntersectionObserver` compartido, y
   `animation-play-state: paused` en la hoja.

La ventana de lados, el parche de esquina, las tres paradas y las dos degradaciones del anillo se
quedan como estaban: son máscara, y la máscara es independiente de cómo se mueva la luz.

## Consecuencias

**Rendimiento.** Con ocho haces a la vista: de 256 animaciones a **8**, de 22 a **144 fps**, p95 de
fotograma de 56 a **7 ms**, recálculo del 10% al **3%**.

**Movimiento.** Uniformidad del avance —máximo entre mínimo por paso— medida a 720 muestras:

| forma | giro uniforme | con la curva de arco |
| --- | --- | --- |
| cuadrada 1:1 | 2.09 | **1.007** |
| tarjeta 4:3 | 2.12 | **1.006** |
| alta 3:4 | 2.09 | **1.011** |
| ancha 16:5 | **6.06** | **1.017** |

La luz nunca se aparta más de **0.14 px** de donde la pondría un avance perfectamente uniforme.

**Continuidad.** Sobre un ciclo completo con `edges={[1, 2]}`, el mínimo de píxeles encendidos sube de
26 a **92** y el salto máximo entre instantes consecutivos —incluida la vuelta— baja de 101 a **23**.

**Lo que se pierde.** La cuña es un ángulo fijo del cónico, así que **el largo del cometa varía con la
posición**: 1.5× entre su mínimo y su máximo en 4:3, y **4.2× en 16:5**. La cola de piezas mantenía el
largo constante porque medía sobre el trazado. Igualarlo pediría animar las paradas del gradiente
—propiedad personalizada, hilo principal, repintado por fotograma—, que es exactamente el coste que
este ADR viene a quitar. Se acepta a cambio de los 144 fps.

**Lo que se recupera.** Se cae la razón por la que ADR-152 partió la cola en piezas: `offset-rotate`
orientaba el ancla pero no deformaba la caja, y una estela rígida no cabía en la curva. Un gradiente
cónico dobla con el marco por construcción.

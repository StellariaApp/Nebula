# ADR-069 — Indicadores de borde por scroll y momentum opt-in fuera de `Scroll`

- **Estado**: **aceptada** · 2026-08-01 (checkpoint del propietario, tres preguntas: motor de las
  sombras, alcance del scroll suave y reparto del momentum)
- **Resuelve**: dos peticiones sobre `Scroll` —(1) sombras automáticas que avisen de que queda
  contenido por desplazar y (2) inercia con spring al soltar la rueda— sin sacar al primitivo de su
  clase de presupuesto ni de RSC.
- **Amplía**: la API pública de `Scroll` (`docs/00-inventory.md` §1.1, fila `Scroll`) y añade una
  fila web-only al catálogo.
- **Depende de**: [ADR-034](ADR-034-capa-de-motion-compartida.md) (idioma único de motion),
  [ADR-022](ADR-022-budget-primitivos-temables-runtime.md) (banda de presupuesto del primitivo) y la
  fila **RSC** de [`docs/03`](../03-a11y-motion-performance.md) §3 (`"use client"` solo si es
  interactivo).

## Contexto

`Scroll` es hoy una primitiva Tier 1 **presentacional y server-safe**: compone `Box`, resuelve una
var local (`scrollbarSize`) y no monta ni un `useEffect`. Su presupuesto medido es la banda
«primitivo temable en runtime», **13 kB/módulo**.

Las dos peticiones tiran en direcciones opuestas:

- **Los indicadores de borde** son un problema de estado visual derivado de la posición de scroll.
  Se puede resolver sin JS.
- **El momentum** es imposible sin JS: hay que interceptar `wheel` e integrar una física por frame.
  Y si se implementa con `motion` —el motor del resto del catálogo— son **+27,7 kB** medidos en
  ADR-018: el primitivo saldría de su banda por un factor de tres.

Además, el momentum sobre la rueda es _scroll-jacking_: sustituye la inercia que ya pone el sistema
operativo por una simulada en el hilo principal. Hecho a la ligera rompe el encadenamiento al
contenedor padre, los scrollers anidados, el zoom con `ctrl`+rueda, el arrastre de la barra y la
navegación por teclado.

## Decisión

### A. Los indicadores viven en `Scroll` y no cuestan JS

1. **Dos props nuevas, ambas apagadas por defecto**: `shadows` (indicador de borde) y `smooth`
   (`scroll-behavior: smooth`). `Scroll` **sigue sin `"use client"`**: quien no las usa no paga
   nada y quien las usa tampoco paga JS.

2. **El indicador son capas de fondo del propio contenedor, y lo que anima la posición de scroll es
   su `background-size`.** Cada borde es un `linear-gradient` colocado con `background-position` en
   su extremo; su grosor viaja en una longitud registrada con `@property` que una animación con
   `animation-timeline: scroll(self block | inline)` interpola entre `0` y el grosor de banda, a lo
   largo de un `animation-range` tomado del spacing del tema. Todo dentro de
   `@supports (animation-timeline: scroll())`.

   Consecuencia buscada: **el caso «no hay overflow» se resuelve solo**. Un _timeline_ de scroll
   cuyo scroller no desborda está inactivo, la animación no se aplica y la longitud se queda en su
   `0px` inicial. No hace falta medir nada para saber si hay contenido oculto.

   **Esto fue la segunda implementación. La primera —dos pseudos `sticky` con la opacidad
   animada— era incorrecta y el gate no podía verlo**: un elemento `sticky` calcula su offset contra
   el _content box_, así que con `p="sm"` la banda quedaba 8 px por dentro del filo en los cuatro
   lados. Medido en Chromium con `padding: 8px`: `gapTop`, `gapLeft` y `gapRight` = **8 px**, y el
   desfase **no** se corrige al desplazar —no es el clamp, es el rectángulo desde el que se calcula
   el offset—. Los márgenes negativos rescatan el eje inline (el overflow recorta en el _padding
   box_: medido `-992` con `margin-inline: -1000px`) pero el de bloque no tiene salida. El fondo del
   elemento, en cambio, se pinta sobre el _padding box_ por definición de `background-origin`.

   En el camino se pagó también la trampa de `scroll(self)`: aplicada **sobre un pseudo** toma como
   scroller el pseudo, que no desborda, y el indicador no aparece jamás sin error ni aviso. Aplicada
   sobre el contenedor —que es donde está ahora— `self` es exactamente lo que se quiere.

   **Verificado en Chromium** midiendo píxeles del render, no la hoja emitida. Geometría: partiendo
   del filo, la luminancia cae de forma continua hasta la superficie limpia en los offsets
   `1·2·4·8·12·20·30 px` — es decir, **tinta desde el primer píxel**, mismo perfil en el borde
   opuesto y en el eje inline, y nada en absoluto sin desbordamiento. Y separación en los cuatro
   temas, que es lo que ningún gate mide (`docs/03` §4 no compara fondo contra fondo): el filo
   separa de su superficie **53 · 47 · 50 · 65** puntos de luminancia en `nebula-dark`,
   `nebula-light`.

3. **La tinta es un rol de borde del contrato mezclado con `color-mix`, no `vars.shadow.*` ni un
   hex.** Vive en una sola constante (`INK` en `Scroll.css.ts`) y **no es prop**: retintarla por
   llamada rompería lo único que hace sistémico al indicador. El valor concreto es decisión de
   diseño y se ajusta ahí —hoy `border.focus` al 40 %, con la banda a `vars.space.xl`—; lo que este
   ADR fija es de **dónde** puede salir.

   **Por qué no el token de sombra**, que sería lo primero que uno intenta: `vars.shadow.*` es
   **direccional** (`0 4px 10px …`). Sirve para el borde superior y para ninguno de los otros tres;
   invertirlo exige reescribir sus offsets, que es justo lo que un token opaco no permite. En
   esquemas oscuros la escalera además apuesta al **rim** (`inset 0 1px 0` blanco, `shadows.md` de
   `packages/themes`), que es una línea de luz sobre el filo de una superficie elevada — un borde de
   scroll no es una superficie elevada y copiarle el rim mentiría sobre la elevación.

4. **`axis="xy"` indica los cuatro bordes**: cuatro capas y dos _timelines_, uno por eje. No hay
   límite de dos como lo había con los pseudos.

5. **Coste aceptado: las cinco declaraciones de fondo llevan `!important`.** La style prop `bg`
   emite el atajo `background`, que resetea `background-image` a `none`, y su clase atómica va **sin
   capa**: sin `!important`, un `<Scroll shadows bg="surface.sunken">` —el caso normal— perdería el
   indicador en silencio. Es la regla 3 de ADR-032 —_gana siempre la prop del componente_— aplicada
   en el único punto donde la colisión no se puede resolver en el tipo, porque no es entre dos props
   sino entre un atajo CSS y su longhand. El color de `bg` se conserva; lo que no gana es un
   `background-image` propio del consumidor sobre el mismo elemento.

   **Y una nota sobre `docs/03` §2 regla 1**: lo que anima aquí no es `transform` ni `opacity`, sino
   `background-size`. No es una excepción a la regla: la regla prohíbe animar **layout** en
   interacciones continuas, y `background-size` es pintura, sin reflow. Además no añade frames — se
   pinta en el mismo frame en que el scroller ya se estaba repintando.

6. **`smooth` se apaga con `prefers-reduced-motion`** (`scroll-behavior: auto`), como exige
   `docs/03` §2 regla 2.

### B. El momentum no entra en `Scroll`

> **Esta mitad quedó enmendada el mismo día. Ver §Enmienda 1**: el momentum sí entra en `Scroll`,
> como prop. Lo que sigue es el texto original; la decisión 7 es la que cambia.

7. ~~**La física vive en `useMomentumScroll` (`@stellaria/nebula-hooks`) y el cableado en
   `ScrollMomentum` (`@stellaria/nebula-web`)**~~, un cliente delgado que compone `Scroll`. `Scroll`
   conserva RSC y su presupuesto; quien quiere inercia la pide por su nombre y paga solo entonces.
   Es el mismo reparto que ADR-062 §11 aplicó a `useScrolled` y ADR-068 a `useScrollSpy`: la
   detección es genérica y no pertenece a ninguna caja. **La mitad del hook sigue en pie; la del
   componente aparte, no.**

8. **Integrador propio, no `motion`.** El hook resuelve el spring a mano
   (`a = (k·d − c·v) / m`, integración por frame con `dt` acotado a 1/30 s) alimentado por
   `theme.motion.spring[name]` — **los mismos tres números** que consumen `motion` y Reanimated, así
   que la física es la del tema y la paridad W/N se mantiene. Coste: ~1 kB frente a 27,7.

   **El muelle del scroll es el del token a media frecuencia**, derivado en `ScrollSpring`
   (`utils/motion.ts`, junto al resto de la física — ADR-034 regla 6 prohíbe que un componente
   escriba la suya, y el test de `motion-provider` lo verifica escaneando las fuentes):
   `stiffness × 0.25` y `damping × 0.5`. Los springs del tema están calibrados para gestos de UI —4 px en 200 ms— y con
   esos números una inercia de 400 px se para tan seca que no se percibe como inercia. Los dos
   factores son √0.25 y su cuadrado, de modo que **ζ = c / (2·√(k·m)) no cambia**: el tema sigue
   decidiendo _cómo_ frena y solo se altera _cuánto tarda_. Es la única transformación de un token
   en todo el componente, y la alternativa era ampliar el contrato del tema con tres springs de
   scroll para un solo consumidor.

   **La ganancia de rueda por defecto es 1,5** (`multiplier`): una muesca que solo recorre su propio
   delta se siente floja cuando además decelera. Medido en Chromium con una rueda de 300: el destino
   pasa a 450 px y la posición avanza `43 · 117 · 177 · 243 · 296 · 330` en muestras de 60 ms antes
   de posarse — deceleración visible, sin rebote.

9. **Ocho reglas de convivencia**, que es lo que separa el momentum de un secuestro del scroll:

   | Situación                                           | Comportamiento                                                             |
   | --------------------------------------------------- | -------------------------------------------------------------------------- |
   | Gesto táctil                                        | **Intacto**: no genera `wheel`; la inercia del SO es mejor que la simulada |
   | `ctrl`+rueda (zoom) o evento ya cancelado           | **Intacto**: no se toca                                                    |
   | Scroller anidado que aún puede desplazarse          | **Intacto**: el gesto es suyo                                              |
   | El contenedor ya está en el tope en esa dirección   | **No se cancela** el evento: el encadenamiento al padre se conserva        |
   | Barra arrastrada, teclado, `scrollIntoView`, anclas | **Resincroniza**: el destino pasa a ser la posición real y el muelle muere |
   | `prefers-reduced-motion` o `motion.tier: "minimal"` | **Apagado entero**: el scroll vuelve a ser el nativo, sin ramas visuales   |
   | `scroll-behavior: smooth` en el mismo elemento      | Las escrituras del muelle van con `behavior: "instant"` y no se pelean     |
   | Desmontaje                                          | Listeners fuera y frame cancelado                                          |

10. **`prefers-reduced-motion` se lee con `useMediaQuery` de `nebula-hooks`, no con
    `useReducedMotion` de `motion/react`**, y se combina con el tier en `MotionOff()` — el único
    sitio donde se resuelven los dos (ADR-034). El resto del catálogo importa el de `motion` porque
    ya paga la librería por animar; aquí no se anima con `motion`, así que importarla solo
    para leer una media query costaría 27,7 kB. La regla de ADR-034 se cumple igual: la decisión
    sigue centralizada en `MotionOff`.

11. **La inercia es `W`, no `WN`.** En React Native el momentum es el comportamiento nativo de
    `ScrollView` y `decelerationRate` ya lo gradúa: replicarlo allí sería reimplementar lo que la
    plataforma regala. La prop existe solo en web, y la fila del inventario lo dice.

## Enmienda 1 — el momentum entra en `Scroll` como prop (2026-08-01)

Decisión del propietario el mismo día, tras ver funcionar las dos cajas. **Sustituye a la decisión
7**; el resto de la sección B sigue en pie palabra por palabra.

12. **`ScrollMomentum` desaparece del catálogo y su función pasa a `Scroll.momentum`**, con `spring`
    y `multiplier` acompañándola. Apagada por defecto, como `shadows` y `smooth`: las tres props
    opcionales de este ADR se comportan igual.

13. **`Scroll` sigue sin `"use client"`.** Es lo que hace viable la fusión: cuando `momentum` está
    encendido, `Scroll` delega el render en `components/Momentum.tsx`, que es el único módulo
    cliente y el único que monta hooks. Un componente de servidor puede rendir uno de cliente, así
    que **el árbol RSC del consumidor no cambia por existir la prop**. La alternativa —marcar
    `Scroll` entero como cliente— sacaba de RSC a los ~155 consumidores del primitivo y era la razón
    original de separarlos.

14. **El precio se paga en bytes, no en arquitectura, y va medido**: `Scroll` pasa de 12,97 a
    **14,34 kB** y estrena entrada propia de 14,5. Con un empaquetador sin frontera RSC el módulo
    arrastra el subcomponente aunque nadie encienda la prop, de modo que **quien solo quiere un
    contenedor con overflow paga 1,37 kB por una funcionalidad que no usa**. Es exactamente lo que
    la decisión 7 evitaba; el propietario lo asume a cambio de una sola caja en el catálogo. Está
    anotado en `docs/03` §3.

15. **El subcomponente vive en `Scroll/components/Momentum.tsx`**, primera carpeta anidada dentro de
    un componente del catálogo. El resto de compuestos —`Calendar`, `Menu`, `Nav`— reparten sus
    piezas en ficheros planos dentro de la carpeta del componente. Es una excepción declarada, no un
    patrón nuevo: si aparece una segunda, la convención de `docs/patterns` §1 debe decidirse.

16. **Coste de la retirada: cero consumidores.** Los paquetes son `private` y `ScrollMomentum` vivió
    unas horas sin llegar a commitearse.

## Alternativas

- **Sombras con `background-attachment: local`** (truco clásico de Verou). Universal y sin JS, pero
  el «cover» que tapa la sombra en el extremo tiene que pintarse **del color de la superficie**. Un
  `Scroll` sobre `surface.raised` que no lo ajuste enseña una banda del color equivocado en los
  cuatro temas: exactamente la clase de defecto que la auditoría WR está persiguiendo (`docs/06`
  §5). Descartada por el propietario. La implementación final usa fondos igualmente, pero **sin
  covers**: el extremo se oculta llevando su `background-size` a cero, que no requiere conocer la
  superficie.
- **Pseudos `sticky` con la opacidad animada.** Implementada y retirada el mismo día: no puede
  llegar al filo cuando el contenedor tiene padding (decisión 2). Su ventaja era animar solo
  `opacity` y no necesitar `!important`.
- **Sombras con JS** (`"use client"` + observador que publica `data-overflow-start|end`). Universal
  y exacta, pero saca de RSC a **todos** los consumidores de un primitivo Tier 1, usen o no la
  prop. Descartada por el propietario.
- ~~**Momentum dentro de `Scroll` con una prop.**~~ Descartada en el checkpoint y **elegida al final
  del día** (§Enmienda 1). La premisa con la que se descartó era falsa a medias: no obliga a
  `"use client"` para todos —basta con delegar en un subcomponente cliente— pero el problema de
  presupuesto sí era real, y es lo que se acabó pagando.
- **Momentum con `animate()` de `motion`.** Física idéntica y cero código propio, a cambio de
  +27,7 kB en un primitivo con banda de 13.

## Consecuencias

- **Los indicadores no existen por debajo de Chrome 115, Safari 26 y Firefox 144.** Es una
  degradación silenciosa: no hay banda, no hay hueco, no hay salto de layout. Queda escrito aquí
  para que una auditoría posterior no lo redescubra como hallazgo.
- **`Scroll` conserva `"use client"` ausente** aunque ahora incluya la inercia, y **estrena entrada
  propia de 14,5 kB** (medido **14,34**): 12,97 el contenedor con su indicador de CSS más 1,37 del
  subcomponente cliente. Criterio de entrada propia igual que `StatusBadge` (W3.3) y
  `TypographyStylesProvider` (W4.3), anotado en `docs/03` §3.
- **El catálogo web se queda en 156 filas** (`Nav` entró con ADR-068): la inercia es una prop de
  `Scroll`, no una fila nueva.
- **Deuda declarada**: el indicador gana a un `background-image` propio del consumidor sobre el
  mismo elemento (decisión 5). No hay ninguna otra: el cambio de mecanismo cerró las dos que la
  primera implementación traía —el eje `xy` a medias y el `gap` contando pseudos en contenedores
  flex.
- **Lo que este ADR no decide**: si `Table`/`DataGrid` deben heredar el indicador en su propio
  contenedor de scroll. Son compuestos con su propia caja y su propia auditoría pendiente.

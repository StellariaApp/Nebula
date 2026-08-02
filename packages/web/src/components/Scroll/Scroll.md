# Scroll

Contenedor con overflow y scrollbar temada (color de `border.strong`, radio `full`), presentacional y server-safe. Es la primitiva de scroll de Tier 1; no reimplementa scrollbars custom (patrón ScrollArea) — usa la barra nativa estilizada por `scrollbar-color`/`scrollbar-width` y `::-webkit-scrollbar`, que cubre el caso común sin coste de JS.

`axis` decide qué ejes hacen overflow; `gutter` reserva el hueco de la barra (`scrollbar-gutter: stable`) para evitar saltos de layout. El grosor se puede fijar con `scrollbarSize` (var local `--scrollbar-size`, 8px por defecto).

Si el contenido es desplazable, el consumidor debe hacer la región alcanzable por teclado (`tabIndex={0}` + `role`/`aria-label`) según su caso; Scroll no lo impone para no ensuciar la a11y de contenedores no desplazables.

## `shadows` — el indicador de que queda contenido

Apagado por defecto ([ADR-069](../../../../../docs/adr/ADR-069-indicadores-de-scroll-y-momentum.md)). Cuando se enciende, el contenedor pinta una banda en cada extremo del eje que desplaza, y **el grosor de cada banda lo gobierna la propia posición de scroll**: una animación con `animation-timeline: scroll(self …)` interpola la longitud registrada con `@property` que alimenta `background-size`. No hay JS, no hay listener y el componente sigue sin `"use client"`.

La tinta es un **rol de borde del contrato mezclado con `color-mix`** —hoy `border.focus` al 40 %, en la constante `INK` de `Scroll.css.ts`— y el grosor sale de `vars.space.xl`. Los dos se cambian en un sitio y valen para los cuatro temas: medido sobre el render, el filo separa de la superficie 53 · 47 · 50 · 65 puntos de luminancia en `nebula-dark`, `nebula-light`, `sober-light` y `playful`.

El caso «el contenido no desborda» se resuelve solo: un _timeline_ de scroll sin recorrido está inactivo, la animación no se aplica y la longitud se queda en su `0px` inicial. No hay nada que medir.

### Por qué son capas de fondo y no pseudoelementos

La primera implementación usaba dos pseudos `position: sticky` con la opacidad animada. **Funcionaba y estaba mal**: un elemento `sticky` se ancla al _content box_ de su contenedor, así que con `p="sm"` la banda aparecía 8 px por dentro del filo — por arriba, por abajo y por los lados—. Medido en Chromium: `gapTop`, `gapLeft` y `gapRight` = 8 px con `padding: 8px`, y el desfase **no** desaparece al desplazar, porque no es el clamp del `sticky` sino el rectángulo desde el que se calcula su offset. Los márgenes negativos arreglan el eje inline (el recorte del overflow ocurre en el _padding box_) pero no el de bloque.

El fondo del elemento sí se pinta sobre el _padding box_ (`background-origin: padding-box`), de modo que la banda llega al filo por construcción. Con `background-attachment: scroll` —el valor inicial— queda fija respecto al elemento y no se desplaza con el contenido.

### Las tres consecuencias de ese mecanismo

- **`background-image` y compañía van con `!important`.** La style prop `bg` de sprinkles emite el atajo `background`, que resetea `background-image` a `none`, y su clase atómica va sin capa: sin `!important` un `<Scroll shadows bg="surface.sunken">` perdería el indicador **en silencio**. Es la regla 3 de ADR-032 aplicada donde se puede aplicar —gana la prop del componente—, y el color de `bg` se conserva intacto. El precio: un `background-image` propio puesto por el consumidor en ese mismo elemento no gana.
- **`axis="xy"` indica los cuatro bordes**, con cuatro capas y dos _timelines_ (bloque e inline).
- **Cero cajas en el flujo**: el indicador no añade hijos, así que no altera flex ni grid, no cuenta para el `gap` y no obliga a tocar el `display` del contenedor.

**Por debajo de Chrome 115, Safari 26 y Firefox 144 no aparece.** Todo va dentro de `@supports (animation-timeline: scroll())`: sin soporte no hay banda, ni hueco, ni salto de layout.

## `smooth`

`scroll-behavior: smooth` sobre el contenedor: afecta a los desplazamientos programáticos, a los del teclado y a los saltos de ancla, nunca a la rueda. Se anula a `auto` bajo `prefers-reduced-motion`.

## `momentum` — la inercia de la rueda

Apagado por defecto. Con él, un muelle persigue el destino que fija cada muesca: `spring` elige la física del tema (`gentle` · `default` · `snappy`) y `multiplier` gradúa cuánto avanza —**1,5 por defecto**, porque una muesca que solo recorre su propio delta se siente floja cuando además decelera—.

Convive con `smooth`: las escrituras del muelle van con `behavior: "instant"` y no se pelean con él, de modo que la rueda tiene inercia y el teclado sigue teniendo su transición suave.

### `Scroll` no deja de ser server-safe por tenerlo

La inercia necesita JS, pero **`Scroll` no lleva `"use client"`**. Cuando `momentum` está encendido delega el render en [`components/Momentum.tsx`](components/Momentum.tsx), que sí es cliente y es el único que monta hooks; cuando está apagado, `Scroll` renderiza su `Box` como siempre. Un componente de servidor puede rendir uno de cliente, así que el árbol RSC del consumidor no cambia por existir la prop.

Lo que sí cambia es el **bundle**: con un empaquetador normal —sin frontera RSC— el módulo de `Scroll` arrastra el subcomponente aunque nadie encienda la prop. Son 1,15 kB medidos, y por eso el presupuesto de `Scroll` sube (ver `docs/03` §3). Es el precio de tener una sola caja en vez de dos.

### Lo que no hace, a propósito

El gesto táctil no genera `wheel`, así que en móvil manda la inercia del sistema operativo, que es mejor que cualquier simulación en el hilo principal. `ctrl`+rueda sigue haciendo zoom. Un scroller anidado con recorrido se queda su gesto. En el tope el evento **no** se cancela, de modo que el scroll encadena al contenedor padre como haría sin la prop. Y cualquier scroll ajeno —barra arrastrada, teclado, `scrollIntoView`, un ancla— resincroniza el destino y mata el muelle en el acto.

Se apaga entero con `prefers-reduced-motion` y con `motion.tier: "minimal"`: sin muelle, el scroll vuelve a ser exactamente el nativo.

### El muelle del scroll es el del tema a media frecuencia

Los tres springs del tema están calibrados para gestos de UI: un press recorre 4 px y debe responder en 200 ms. Un scroll recorre cientos de píxeles, y con esos mismos números la parada es tan seca que la inercia no se percibe.

`ScrollSpring` —en `utils/motion.ts`, con el resto de la física, porque ADR-034 regla 6 prohíbe que un componente escriba la suya y hay un test que lo comprueba— deriva el muelle del token **bajando la frecuencia a la mitad y conservando el amortiguamiento**: `stiffness × 0.25` y `damping × 0.5`. La relación ζ = c / (2·√(k·m)) queda igual, de modo que el tema sigue decidiendo _cómo_ frena y solo cambia _cuánto tarda_. Con `default` (170 · 26 · 1) el muelle del scroll es 42,5 · 13 · 1.

### Dos decisiones que sorprenden al leer el código

**`prefers-reduced-motion` se lee con `useMediaQuery`, no con `useReducedMotion` de `motion/react`.** El resto del catálogo usa el de `motion` porque ya paga la librería para animar; aquí no se anima con `motion` —la física la integra el hook— y arrastrarla solo para leer una media query costaría 27,7 kB medidos (ADR-018) en un primitivo con banda de 13. La regla de ADR-034 se respeta igual: los dos ejes se resuelven en `MotionOff`.

**La ref se compone a mano y no con `useObjectRef` de React Aria.** El componente no usa nada más de React Aria; importarla para tres líneas de fusión de refs metería su runtime en el módulo.

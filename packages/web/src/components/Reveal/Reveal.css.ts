import { createVar, style } from "@vanilla-extract/css";

import { composite_layer } from "../../theme/layers.css.js";

/**
 * La entrada, en CSS.
 *
 * `Reveal` no monta un componente de motion: el hook decide CUANDO —eso sigue siendo un
 * `IntersectionObserver`— y el navegador se encarga del COMO. Dos razones, y ninguna es el peso:
 *
 *  1. Es la unica animacion del catalogo que se dispara MIENTRAS el usuario hace scroll, o sea en
 *     el peor momento posible para pedirle trabajo al hilo principal. Una transicion de `opacity` y
 *     `transform` la lleva el compositor y no compite con el scroll.
 *  2. Es la que mas instancias tiene: una por banda, mas las que ponga el consumidor. Cada una
 *     costaba un componente de motion con su propio bucle.
 *
 * La fisica no se pierde: el muelle del tema se muestrea a `linear()` en `SpringToEasing`, rebote
 * incluido, asi que `spring="snappy"` sigue significando lo que decia.
 */

/** El transform en reposo: de donde entra. `none` para los presets que solo desvanecen. */
export const from = createVar();

/** Lo que tarda el desplazamiento. Sale del muelle o del `duration` que pidan. */
export const duration = createVar();

/** La curva del desplazamiento: el `linear()` del muelle, o el bezier del tween. */
export const easing = createVar();

/** El escalonado, para una lista que entra en cascada. */
export const delay = createVar();

/** La opacidad va por su cuenta, igual que en motion, donde `Fade` es un tween aparte. */
export const fade_duration = createVar();
export const fade_easing = createVar();

/**
 * DONDE SE ESCONDE, Y POR QUE CON ESA CONSULTA.
 *
 * El elemento arranca oculto desde el primer pintado —dentro o fuera del viewport, da igual— y solo
 * lo destapa el `data-reveal="shown"` que pone el observador cuando ya esta todo montado. Es lo que
 * hace que la entrada se VEA siempre en vez de que el contenido aparezca de golpe.
 *
 * Un `opacity: 0` a secas en la hoja tiene un fallo grave y conocido: si el JavaScript no llega
 * —desactivado, bloqueado, caido— la pagina se queda en blanco para siempre. `(scripting: enabled)`
 * lo cierra sin depender de nadie: la regla que esconde solo existe cuando hay motor de scripts que
 * pueda volver a mostrarlo. Sin scripts no se declara, y el contenido esta ahi.
 *
 * `(prefers-reduced-motion: no-preference)` va en la MISMA consulta y no en una regla aparte a
 * proposito: asi no hay dos reglas compitiendo por especificidad ni por orden de emision. Quien
 * pidio menos movimiento no ve nada esconderse.
 */
const HIDDEN_WHEN = "(scripting: enabled) and (prefers-reduced-motion: no-preference)";

export const reveal = style({
  "@layer": {
    [composite_layer]: {
      /*
       * AQUI NO SE DECIDE EL LAYOUT. Esta clase la puede llevar cualquier cosa —una banda, una
       * tarjeta, una fila de tabla, un `<span>`— y forzar un `display` la convierte en otra cosa:
       * un `<tr>` con `display: flex` deja de ser fila y la tabla se descuadra. Lo unico que toca
       * aqui es de donde viene el elemento y cuanto tarda en llegar.
       */
      transition: [
        `opacity ${fade_duration} ${fade_easing} ${delay}`,
        `transform ${duration} ${easing} ${delay}`,
      ].join(", "),

      "@media": {
        [HIDDEN_WHEN]: {
          selectors: {
            "&:not([data-reveal='shown'])": {
              opacity: 0,
              transform: from,
            },
          },
        },
      },

      selectors: {
        "&[data-reveal='shown']": {
          opacity: 1,
          transform: "none",
        },
      },
    },
  },
});

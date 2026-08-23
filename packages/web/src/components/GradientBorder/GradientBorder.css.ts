import { fallbackVar, globalStyle, keyframes, style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import { primitive_layer } from "../../theme/layers.css.js";

import { card_base } from "../Card/Card.css.js";
import * as variables from "./GradientBorder.vars.css.js";

const SOLID_MASK = "linear-gradient(#000 0 0)";
const NO_MASK_COMPOSITE = "not ((mask-composite: exclude) or (-webkit-mask-composite: xor))";
const REDUCED = "(prefers-reduced-motion: reduce)";
const RING_MASK = {
  WebkitMask: `${SOLID_MASK} content-box, ${SOLID_MASK}`,
  WebkitMaskComposite: "xor",
  mask: `${SOLID_MASK} content-box, ${SOLID_MASK}`,
  maskComposite: "exclude",
} as const;

export const gradient_base = style({});

globalStyle(`${gradient_base} > ${card_base}`, {
  borderRadius: "inherit",
});

export const gradient_border = recipe({
  base: {
    "@layer": {
      [primitive_layer]: {
        position: "relative",
        isolation: "isolate",
        boxSizing: "border-box",
        background: variables.innerBg,
        overflow: "hidden",
        selectors: {
          "&::before": {
            content: "",
            position: "absolute",
            inset: 0,
            zIndex: -1,
            borderRadius: "inherit",
            padding: variables.ringWidth,
            background: variables.image,
            ...RING_MASK,
            pointerEvents: "none",
          },
        },
        "@supports": {
          [NO_MASK_COMPOSITE]: {
            border: `1px solid ${variables.fallbackBorder}`,
            selectors: {
              "&::before": { display: "none" },
            },
          },
        },
        "@media": {
          "(forced-colors: active)": {
            border: "1px solid CanvasText",
            selectors: {
              "&::before": { display: "none" },
            },
          },
        },
      },
    },
  },
  variants: {},
  defaultVariants: {},
});

export type GradientBorderRecipeVariants = NonNullable<RecipeVariants<typeof gradient_border>>;

/**
 * La banda por la que se ve el haz: la misma que el anillo, para que la luz caiga **sobre** el borde.
 * Ensancharla no lo engorda de forma simétrica, porque la máscara solo puede pintar dentro de la caja
 * y el excedente crece hacia dentro. Un haz más grueso que su borde es, por construcción, un haz
 * metido en el relleno.
 */
const BEAM_BAND = variables.ringWidth;

/**
 * Las unidades de contenedor miden la caja de **contenido**, y tanto el recorrido (`offset-path:
 * border-box`) como la ventana miden la de **borde**. El contenedor del haz lleva `padding:
 * BEAM_BAND`, así que hay que devolverle ese grosor por los dos lados.
 */
const CQ_W = `(100cqw + (2 * ${BEAM_BAND}))`;
const CQ_H = `(100cqh + (2 * ${BEAM_BAND}))`;

/** El radio efectivo: el navegador recorta el declarado a la mitad del lado más corto. */
const R = `min(${variables.beamRadius}, ${CQ_W} * 0.5, ${CQ_H} * 0.5)`;

/**
 * Del vértice de la caja al **punto medio** de su curva: `1 − 1/√2` del radio, que es donde el arco
 * cruza la bisectriz de la esquina. Ahí es donde se parten dos franjas, para que la luz aparezca y
 * desaparezca a mitad de curva y no en sus extremos, que es donde la corta el radio entero.
 */
const MID = `calc(${R} * 0.2928932)`;

/**
 * Lo que la franja se mete hacia dentro. **No decide nada de lo que se ve**: los cortes son los lados
 * de la franja, y el fondo cae en el relleno, que la máscara del anillo ya se come. Solo tiene que dar
 * para tapar la cara interior de la banda, que en el punto del corte queda hasta `1.5 · ringWidth` más
 * adentro que la exterior porque ahí la banda cruza en diagonal. Con dos anchos sobra.
 */
const DEPTH = `calc(${MID} + (2 * ${variables.ringWidth}))`;

/**
 * Las cuatro franjas de la ventana. Cada una es lo que le toca a un lado: **media curva de entrada,
 * su tramo recto y media curva de salida**. Van centradas en su lado y recortadas por los dos
 * extremos por igual —de ahí el `50%`—, así que entrada y salida caen justo en el punto medio de la
 * curva y la luz no asoma antes por un lado que por el otro.
 *
 * Van como capas de una máscara y no como `clip-path` porque la máscara admite lista: la ventana es
 * la unión de las franjas elegidas, y la unión de dos rectángulos sueltos —el 1 y el 3— no es un
 * polígono que `clip-path` pueda escribir.
 */
export const EDGE_WINDOW = {
  1: `${SOLID_MASK} 50% 0 / calc(${CQ_W} - (2 * ${MID})) ${DEPTH} no-repeat`,
  2: `${SOLID_MASK} 100% 50% / ${DEPTH} calc(${CQ_H} - (2 * ${MID})) no-repeat`,
  3: `${SOLID_MASK} 50% 100% / calc(${CQ_W} - (2 * ${MID})) ${DEPTH} no-repeat`,
  4: `${SOLID_MASK} 0 50% / ${DEPTH} calc(${CQ_H} - (2 * ${MID})) no-repeat`,
} as const;

/**
 * El parche de la esquina en la que **acaba** cada lado, y la pieza que hace que la entrega no se
 * vea. Las capas de una máscara no se suman: se componen una sobre otra, así que donde el borde de
 * una franja cruza el de la vecina las dos valen `0.5` y el resultado es `0.75` — una muesca de un
 * píxel justo en el punto donde la luz cambia de franja, que es el sitio donde más se mira. Moverla
 * no sirve de nada; hay que tapar el cruce con una tercera capa opaca.
 *
 * Solo se emite cuando los dos lados de la esquina están encendidos, que es cuando la luz tiene que
 * cruzarla entera. Por eso no desplaza ningún corte: con un lado suelto no hay parche, y su franja
 * sigue empezando y acabando en el punto medio.
 */
export const CORNER_PATCH = {
  1: `${SOLID_MASK} 100% 0 / ${DEPTH} ${DEPTH} no-repeat`,
  2: `${SOLID_MASK} 100% 100% / ${DEPTH} ${DEPTH} no-repeat`,
  3: `${SOLID_MASK} 0 100% / ${DEPTH} ${DEPTH} no-repeat`,
  4: `${SOLID_MASK} 0 0 / ${DEPTH} ${DEPTH} no-repeat`,
} as const;

/**
 * La pieza de la cola, en un solo sitio: la hoja la escribe como `clamp()` y el cálculo del tramo la
 * necesita en números para saber cuánto tiene que esconderse el salto.
 */
export const TRAIL_SPAN = { min: 6, ratio: 0.022, max: 13 } as const;

const TRAIL_LENGTH = `clamp(${String(TRAIL_SPAN.min)}px, (${CQ_W} + ${CQ_H}) * ${String(TRAIL_SPAN.ratio)}, ${String(TRAIL_SPAN.max)}px)`;
const TRAIL_DEPTH = `calc(${BEAM_BAND} * 2)`;

/**
 * La única animación del componente: del principio al final del recorrido que le toque. Por defecto
 —sin nadie que escriba las vars— es la vuelta entera, `0%` a `100%`, y el porcentaje lo resuelve el
 * navegador contra la longitud real del trazado: velocidad constante y radio contado sin escribir
 * geometría. Cuando `continuous` recorta el tramo, las dos puntas llegan medidas desde JS.
 *
 * `offset-path: border-box` es un trazado **cerrado**, así que un valor negativo o mayor que `100%`
 * da la vuelta en vez de recortarse. De eso vive el tramo que cruza el origen del trazado.
 */
export const loop = keyframes({
  from: { offsetDistance: fallbackVar(variables.beamFrom, "0%") },
  to: { offsetDistance: fallbackVar(variables.beamTo, "100%") },
});

export const beam = style({
  "@layer": {
    [primitive_layer]: {
      position: "absolute",
      inset: 0,
      zIndex: 1,
      borderRadius: "inherit",
      padding: BEAM_BAND,
      ...RING_MASK,
      containerType: "size",
      filter: `blur(${fallbackVar(variables.beamBloom, "0px")})`,
      pointerEvents: "none",
      "@supports": {
        [NO_MASK_COMPOSITE]: { display: "none" },
      },
      "@media": {
        "(forced-colors: active)": { display: "none" },
      },
    },
  },
});

/**
 * La ventana: la máscara que decide en qué lados se ve la luz.
 *
 * **El radio no es decorativo aquí, es el recorrido.** Las piezas cuelgan de esta capa, y
 * `offset-path: border-box` traza la caja de su bloque contenedor: sin `border-radius: inherit` la
 * ventana es un rectángulo en pico, la luz sigue recta hasta el vértice en vez de doblar, se sale de
 * la banda curva y la máscara del anillo se la come. Se lee como un corte justo donde empieza la
 * curva — y con `r={0}` no se nota, porque ahí las dos cajas coinciden. La cola cruza siempre el marco entero,
 * así que entra y sale por la boca de la franja en vez de aparecer hecha — por eso no hay nada que
 * apagar por tiempo.
 *
 * El desenfoque no está aquí sino en el contenedor de arriba, y en ese orden importa: `filter` se
 * aplica **antes** que la máscara del elemento que lo lleva y **después** que las de sus hijos, así
 * que puesto arriba funde las piezas entre sí y además ablanda la boca de la franja. Puesto aquí
 * dejaría el corte de la boca duro.
 */
export const edge_window = style({
  "@layer": {
    [primitive_layer]: {
      position: "absolute",
      inset: 0,
      borderRadius: "inherit",
      WebkitMask: fallbackVar(variables.beamWindow, SOLID_MASK),
      mask: fallbackVar(variables.beamWindow, SOLID_MASK),
    },
  },
});

/**
 * Una pieza de la cola. Es corta para que quepa en la curva: un rectángulo rígido se desvía
 * `r - sqrt(r^2 - (L/2)^2)` de la banda en una esquina de radio `r`, y por debajo de ~13px eso queda
 * en el orden del propio grosor del anillo. La cola larga la hacen muchas de estas escalonadas en el
 * recorrido, no una sola estirada, que es lo que no podía doblar.
 */
export const trail = style({
  "@layer": {
    [primitive_layer]: {
      position: "absolute",
      insetBlockStart: 0,
      insetInlineStart: 0,
      inlineSize: TRAIL_LENGTH,
      blockSize: TRAIL_DEPTH,
      opacity: variables.beamFade,
      background: variables.beamCore,
      filter: `drop-shadow(0 0 4px ${variables.beamGlow})`,
      offsetPath: "border-box",
      offsetRotate: "auto",
      willChange: "offset-distance",
      animationName: loop,
      animationDuration: variables.beamCycle,
      animationDelay: variables.beamDelay,
      animationTimingFunction: "linear",
      animationIterationCount: "infinite",
      "@media": {
        [REDUCED]: { animationName: "none" },
      },
    },
  },
});

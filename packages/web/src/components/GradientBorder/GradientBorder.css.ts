import { globalStyle, keyframes, style } from "@vanilla-extract/css";
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

const EDGES = [1, 2, 3, 4] as const;

/**
 * La banda por la que se ve el haz: la misma que el anillo, para que la luz caiga **sobre** el borde.
 * Ensancharla no lo engorda de forma simétrica, porque la máscara solo puede pintar dentro de la caja
 * y el excedente crece hacia dentro. Un haz más grueso que su borde es, por construcción, un haz
 * metido en el relleno.
 */
const BEAM_BAND = variables.ringWidth;

/**
 * Las unidades de contenedor miden la caja de **contenido**, y `offset-path: border-box` recorre la de
 * **borde**. El contenedor del haz lleva `padding: BEAM_BAND`, así que hay que devolverle ese grosor
 * por los dos lados o el reparto se queda corto y cada tramo entra desplazado.
 */
const CQ_W = `(100cqw + (2 * ${BEAM_BAND}))`;
const CQ_H = `(100cqh + (2 * ${BEAM_BAND}))`;

/** El radio efectivo: el navegador recorta el declarado a la mitad del lado más corto. */
const R = `min(${variables.beamRadius}, ${CQ_W} * 0.5, ${CQ_H} * 0.5)`;

/**
 * Fin de cada lado sobre el recorrido real, contando su esquina. Un rectángulo redondeado mide
 * `2w + 2h - (8 - 2pi)r`, y cada esquina se come `(2 - pi/2)r` del vértice recto: por eso los
 * coeficientes son multiplos de 0.4292037 y no hay ninguno redondo.
 */
const BOUND = {
  0: "0px",
  1: `calc(${CQ_W} - (0.4292037 * ${R}))`,
  2: `calc(${CQ_W} + ${CQ_H} - (0.8584073 * ${R}))`,
  3: `calc((2 * ${CQ_W}) + ${CQ_H} - (1.2876110 * ${R}))`,
  4: `calc((2 * ${CQ_W}) + (2 * ${CQ_H}) - (1.7168147 * ${R}))`,
} as const;

const RUN = {
  1: [BOUND[0], BOUND[1]],
  2: [BOUND[1], BOUND[2]],
  3: [BOUND[2], BOUND[3]],
  4: [BOUND[3], BOUND[4]],
} as const satisfies Record<(typeof EDGES)[number], readonly [string, string]>;

const STREAK_LENGTH = `calc((${CQ_W} + ${CQ_H}) * 0.22)`;
const STREAK_DEPTH = `calc(${variables.ringWidth} * 3)`;
const TRAIL_LENGTH = `clamp(6px, (${CQ_W} + ${CQ_H}) * 0.022, 13px)`;
const TRAIL_DEPTH = `calc(${BEAM_BAND} * 2)`;

/**
 * La vuelta entera en una sola animación, para el caso en que no hay lados que elegir. El porcentaje
 * lo resuelve el navegador contra la longitud real del trazado: velocidad constante, radio contado y
 * ninguna entrega entre arcos que sincronizar.
 */
export const loop = keyframes({
  from: { offsetDistance: "0%" },
  to: { offsetDistance: "100%" },
});

export const sweep = Object.fromEntries(
  EDGES.map((edge) => [
    edge,
    keyframes({
      from: { offsetDistance: RUN[edge][0] },
      to: { offsetDistance: RUN[edge][1] },
    }),
  ]),
) as Record<(typeof EDGES)[number], string>;

export const gate = Object.fromEntries(
  EDGES.map((share) => {
    const open = 100 / share;
    return [
      share,
      keyframes(
        share === 1
          ? { "0%": { opacity: 1 }, "100%": { opacity: 1 } }
          : {
              "0%": { opacity: 1 },
              [`${String(open - 0.01)}%`]: { opacity: 1 },
              [`${String(open)}%`]: { opacity: 0 },
              "100%": { opacity: 0 },
            },
      ),
    ];
  }),
) as Record<(typeof EDGES)[number], string>;

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

export const arc = style({
  "@layer": {
    [primitive_layer]: {
      position: "absolute",
      insetBlockStart: 0,
      insetInlineStart: 0,
      inlineSize: STREAK_LENGTH,
      blockSize: STREAK_DEPTH,
      opacity: 0,
      background: variables.beamArc,
      filter: `drop-shadow(0 0 4px ${variables.beamGlow})`,
      offsetPath: "border-box",
      offsetRotate: "auto",
      willChange: "offset-distance, opacity",
      animationName: `${variables.beamSweep}, ${variables.beamGate}`,
      animationDuration: `${variables.beamSlot}, ${variables.beamCycle}`,
      animationDelay: `0s, ${variables.beamDelay}`,
      animationTimingFunction: "linear, linear",
      animationIterationCount: "infinite, infinite",
      "@media": {
        [REDUCED]: { animationName: "none" },
      },
    },
  },
});

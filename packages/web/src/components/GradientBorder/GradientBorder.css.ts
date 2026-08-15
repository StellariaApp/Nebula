import { keyframes, style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import { primitive_layer } from "../../theme/layers.css.js";

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

const CQ_W = "100cqw";
const CQ_H = "100cqh";

const RUN = {
  1: ["0px", CQ_W],
  2: [CQ_W, `calc(${CQ_W} + ${CQ_H})`],
  3: [`calc(${CQ_W} + ${CQ_H})`, `calc((2 * ${CQ_W}) + ${CQ_H})`],
  4: [`calc((2 * ${CQ_W}) + ${CQ_H})`, `calc((2 * ${CQ_W}) + (2 * ${CQ_H}))`],
} as const satisfies Record<(typeof EDGES)[number], readonly [string, string]>;

const STREAK_LENGTH = `calc((${CQ_W} + ${CQ_H}) * 0.22)`;
const STREAK_DEPTH = `calc(${variables.ringWidth} * 3)`;

/**
 * El recorrido entero en una sola animación. El porcentaje lo resuelve el navegador contra la
 * longitud real del trazado, así que respeta el radio y la velocidad no cambia en las esquinas.
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
              [`${String(open)}%`]: { opacity: 1 },
              [`${String(open + 0.01)}%`]: { opacity: 0 },
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
      padding: variables.ringWidth,
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

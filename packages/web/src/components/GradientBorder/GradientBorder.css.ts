import { keyframes, style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

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
      [base_layer]: {
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
  variants: {
    radius: {
      none: { borderRadius: vars.radius.none },
      xxs: { borderRadius: vars.radius.xxs },
      xs: { borderRadius: vars.radius.xs },
      sm: { borderRadius: vars.radius.sm },
      md: { borderRadius: vars.radius.md },
      lg: { borderRadius: vars.radius.lg },
      xl: { borderRadius: vars.radius.xl },
      xxl: { borderRadius: vars.radius.xxl },
      full: { borderRadius: vars.radius.full },
    },
  },
  defaultVariants: {
    radius: "lg",
  },
});

export type GradientBorderRecipeVariants = NonNullable<RecipeVariants<typeof gradient_border>>;

const EDGES = [1, 2, 3, 4] as const;
const SWEEP_ARC = 90;
const SWEEP_HALF = SWEEP_ARC / 2;

export const sweep = Object.fromEntries(
  EDGES.map((edge) => {
    const center = (edge - 1) * SWEEP_ARC;
    return [
      edge,
      keyframes({
        from: { transform: `rotate(${String(center - SWEEP_HALF)}deg)` },
        to: { transform: `rotate(${String(center + SWEEP_HALF)}deg)` },
      }),
    ];
  }),
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
    [base_layer]: {
      position: "absolute",
      inset: 0,
      zIndex: 1,
      borderRadius: "inherit",
      padding: variables.ringWidth,
      ...RING_MASK,
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
    [base_layer]: {
      position: "absolute",
      inset: "-100%",
      opacity: 0,
      background: variables.beamArc,
      filter: `drop-shadow(0 0 4px ${variables.beamGlow})`,
      willChange: "transform, opacity",
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

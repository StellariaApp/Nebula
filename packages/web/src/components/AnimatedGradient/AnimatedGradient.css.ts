import { keyframes, style, styleVariants } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import { reduced_media, still } from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { primitive_layer } from "../../theme/layers.css.js";

import * as variables from "./AnimatedGradient.vars.css.js";

const SQUARE = "calc(100cqw + 100cqh)";
const SQUARE_HALF = "calc((100cqw + 100cqh) * -0.5)";

const REST = "translate3d(-8%, -6%, 0) rotate(0deg) scale(1.4)";

const DRIFT = keyframes({
  "0%": { transform: REST },
  "50%": { transform: "translate3d(8%, 6%, 0) rotate(180deg) scale(1.62)" },
  "100%": { transform: "translate3d(-8%, -6%, 0) rotate(360deg) scale(1.4)" },
});

export const animated_gradient = recipe({
  base: {
    "@layer": {
      [primitive_layer]: {
        position: "relative",
        isolation: "isolate",
        overflow: "hidden",
        boxSizing: "border-box",
        background: vars.color.surface.base,
        color: vars.color.text.primary,
      },
    },
  },
  variants: {},
  defaultVariants: {},
});

export const drift_frame = style({
  "@layer": {
    [primitive_layer]: {
      position: "absolute",
      inset: 0,
      zIndex: -1,
      pointerEvents: "none",
      containerType: "size",
      "@media": {
        "(forced-colors: active)": { display: "none" },
      },
    },
  },
});

export const drift = style({
  "@layer": {
    [primitive_layer]: {
      position: "absolute",
      insetBlockStart: "50%",
      insetInlineStart: "50%",
      inlineSize: SQUARE,
      blockSize: SQUARE,
      marginBlockStart: SQUARE_HALF,
      marginInlineStart: SQUARE_HALF,
      backgroundImage: variables.gradientImage,
      transform: REST,
      transformOrigin: "50% 50%",
      willChange: "transform",
      animationName: DRIFT,
      animationTimingFunction: vars.motion.easing.standard,
      animationIterationCount: "infinite",
      selectors: {
        "&[data-animated='false']": { ...still, transform: REST },
      },
      "@media": {
        [reduced_media]: { ...still, transform: REST },
      },
    },
  },
});

export const speed = styleVariants({
  slow: { animationDuration: `calc(${vars.motion.duration.expressive} * 18)` },
  base: { animationDuration: `calc(${vars.motion.duration.expressive} * 12)` },
  fast: { animationDuration: `calc(${vars.motion.duration.expressive} * 8)` },
});

export const scrim = style({
  "@layer": {
    [primitive_layer]: {
      position: "absolute",
      inset: 0,
      zIndex: -1,
      pointerEvents: "none",
      background: vars.color.surface.base,
      opacity: variables.scrimAlpha,
      "@media": {
        "(forced-colors: active)": { display: "none" },
      },
    },
  },
});

export type AnimatedGradientRecipeVariants = NonNullable<RecipeVariants<typeof animated_gradient>>;

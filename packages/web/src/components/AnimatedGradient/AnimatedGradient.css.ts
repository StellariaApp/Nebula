import { keyframes, style, styleVariants } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import { reducedMedia, still } from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { gradientImage, scrimAlpha } from "./AnimatedGradient.vars.css.js";

const REST = "translate3d(-8%, -6%, 0) rotate(0deg) scale(1.4)";

const DRIFT = keyframes({
  "0%": { transform: REST },
  "50%": { transform: "translate3d(8%, 6%, 0) rotate(180deg) scale(1.62)" },
  "100%": { transform: "translate3d(-8%, -6%, 0) rotate(360deg) scale(1.4)" },
});

export const animatedGradient = recipe({
  base: {
    "@layer": {
      [baseLayer]: {
        position: "relative",
        isolation: "isolate",
        overflow: "hidden",
        boxSizing: "border-box",
        background: vars.color.surface.base,
        color: vars.color.text.primary,
      },
    },
  },
  variants: {
    radius: {
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

export const drift = style({
  "@layer": {
    [baseLayer]: {
      position: "absolute",
      inset: "-40%",
      zIndex: -1,
      pointerEvents: "none",
      backgroundImage: gradientImage,
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
        [reducedMedia]: { ...still, transform: REST },
        "(forced-colors: active)": { display: "none" },
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
    [baseLayer]: {
      position: "absolute",
      inset: 0,
      zIndex: -1,
      pointerEvents: "none",
      background: vars.color.surface.base,
      opacity: scrimAlpha,
      "@media": {
        "(forced-colors: active)": { display: "none" },
      },
    },
  },
});

export type AnimatedGradientRecipeVariants = NonNullable<RecipeVariants<typeof animatedGradient>>;

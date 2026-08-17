import { keyframes, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import * as motion from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { primitive_layer } from "../../theme/layers.css.js";

import * as variables from "./Skeleton.vars.css.js";

const SHIMMER = keyframes({
  from: { transform: "translateX(-100%)" },
  to: { transform: "translateX(100%)" },
});

const PULSE = keyframes({
  "0%, 100%": { opacity: 1 },
  "50%": { opacity: 0.45 },
});

export const skeleton = recipe({
  base: {
    "@layer": {
      [primitive_layer]: {
        display: "block",
        boxSizing: "border-box",
        width: variables.width,
        height: variables.height,
        borderRadius: variables.radius,
        background: vars.color.surface.sunken,
        "@media": {
          "(prefers-reduced-motion: reduce)": motion.still,
        },
      },
    },
  },
  variants: {
    animation: {
      shimmer: {
        position: "relative",
        overflow: "hidden",
        selectors: {
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(90deg, transparent 20%, ${vars.color.surface.raised} 50%, transparent 80%)`,
            animationName: SHIMMER,
            animationDuration: `calc(${vars.motion.duration.slow} * 5)`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          },
        },
        "@media": {
          "(prefers-reduced-motion: reduce)": {
            selectors: { "&::after": { content: "none" } },
          },
        },
      },
      pulse: {
        animationName: PULSE,
        animationDuration: `calc(${vars.motion.duration.slow} * 5)`,
        animationTimingFunction: vars.motion.easing.standard,
        animationIterationCount: "infinite",
      },
      none: {},
    },
    circle: {
      true: { borderRadius: vars.radius.full },
      false: {},
    },
  },
  defaultVariants: { animation: "shimmer", circle: false },
});

export const stack = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.xs,
});

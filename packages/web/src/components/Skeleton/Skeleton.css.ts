import { keyframes, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import * as motion from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

import { skeletonHeight, skeletonRadius, skeletonWidth } from "./Skeleton.vars.css.js";

const SHIMMER = keyframes({
  from: { backgroundPosition: "200% 0" },
  to: { backgroundPosition: "-200% 0" },
});

const PULSE = keyframes({
  "0%, 100%": { opacity: 1 },
  "50%": { opacity: 0.45 },
});

export const skeleton = recipe({
  base: {
    "@layer": {
      [base_layer]: {
        display: "block",
        boxSizing: "border-box",
        width: skeletonWidth,
        height: skeletonHeight,
        borderRadius: skeletonRadius,
        background: vars.color.surface.sunken,
        "@media": {
          "(prefers-reduced-motion: reduce)": { ...motion.still, backgroundImage: "none" },
        },
      },
    },
  },
  variants: {
    animation: {
      shimmer: {
        backgroundImage: `linear-gradient(90deg, transparent 20%, ${vars.color.surface.raised} 50%, transparent 80%)`,
        backgroundSize: "200% 100%",
        animationName: SHIMMER,
        animationDuration: "1.4s",
        animationTimingFunction: "linear",
        animationIterationCount: "infinite",
      },
      pulse: {
        animationName: PULSE,
        animationDuration: "1.4s",
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

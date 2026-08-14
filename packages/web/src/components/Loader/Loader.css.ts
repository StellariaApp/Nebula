import { keyframes, style, styleVariants } from "@vanilla-extract/css";

import * as motion from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { primitive_layer } from "../../theme/layers.css.js";

import * as variables from "./Loader.vars.css.js";

const SPIN = keyframes({ to: { transform: "rotate(360deg)" } });
const PULSE = keyframes({
  "0%, 80%, 100%": { opacity: 0.25, transform: "scale(0.7)" },
  "40%": { opacity: 1, transform: "scale(1)" },
});
const STRETCH = keyframes({
  "0%, 40%, 100%": { transform: "scaleY(0.45)" },
  "20%": { transform: "scaleY(1)" },
});

export const root = style({
  "@layer": {
    [primitive_layer]: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: `calc(${variables.size} / 5)`,
      color: variables.color,
      verticalAlign: "middle",
    },
  },
});

export const spinner = style({
  "@layer": {
    [primitive_layer]: {
      width: variables.size,
      height: variables.size,
      borderRadius: vars.radius.full,
      borderStyle: "solid",
      borderWidth: `calc(${variables.size} / 8)`,
      borderColor: "currentColor",
      borderTopColor: "transparent",
      animationName: SPIN,
      animationDuration: "0.7s",
      animationTimingFunction: "linear",
      animationIterationCount: "infinite",
      "@media": {
        "(prefers-reduced-motion: reduce)": {
          ...motion.still,
          borderTopColor: "currentColor",
          opacity: 0.5,
        },
      },
    },
  },
});

const dot_base = style({
  "@layer": {
    [primitive_layer]: {
      width: `calc(${variables.size} / 3.2)`,
      height: `calc(${variables.size} / 3.2)`,
      borderRadius: vars.radius.full,
      background: "currentColor",
      animationName: PULSE,
      animationDuration: "1.1s",
      animationTimingFunction: vars.motion.easing.standard,
      animationIterationCount: "infinite",
      "@media": {
        "(prefers-reduced-motion: reduce)": { ...motion.still, opacity: 0.55 },
      },
    },
  },
});

const bar_base = style({
  "@layer": {
    [primitive_layer]: {
      width: `calc(${variables.size} / 5)`,
      height: variables.size,
      borderRadius: vars.radius.xs,
      background: "currentColor",
      animationName: STRETCH,
      animationDuration: "1s",
      animationTimingFunction: vars.motion.easing.standard,
      animationIterationCount: "infinite",
      "@media": {
        "(prefers-reduced-motion: reduce)": { ...motion.still, transform: "scaleY(0.7)" },
      },
    },
  },
});

export const dot = styleVariants({
  0: [dot_base, { animationDelay: "0ms" }],
  1: [dot_base, { animationDelay: "140ms" }],
  2: [dot_base, { animationDelay: "280ms" }],
});

export const bar = styleVariants({
  0: [bar_base, { animationDelay: "0ms" }],
  1: [bar_base, { animationDelay: "110ms" }],
  2: [bar_base, { animationDelay: "220ms" }],
  3: [bar_base, { animationDelay: "330ms" }],
});

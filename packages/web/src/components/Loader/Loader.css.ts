import { keyframes, style, styleVariants } from "@vanilla-extract/css";

import * as motion from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { loaderColor, loaderSize } from "./Loader.vars.css.js";

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
    [baseLayer]: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: `calc(${loaderSize} / 5)`,
      color: loaderColor,
      verticalAlign: "middle",
    },
  },
});

export const spinner = style({
  "@layer": {
    [baseLayer]: {
      width: loaderSize,
      height: loaderSize,
      borderRadius: vars.radius.full,
      borderStyle: "solid",
      borderWidth: `calc(${loaderSize} / 8)`,
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

const dotBase = style({
  "@layer": {
    [baseLayer]: {
      width: `calc(${loaderSize} / 3.2)`,
      height: `calc(${loaderSize} / 3.2)`,
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

const barBase = style({
  "@layer": {
    [baseLayer]: {
      width: `calc(${loaderSize} / 5)`,
      height: loaderSize,
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
  0: [dotBase, { animationDelay: "0ms" }],
  1: [dotBase, { animationDelay: "140ms" }],
  2: [dotBase, { animationDelay: "280ms" }],
});

export const bar = styleVariants({
  0: [barBase, { animationDelay: "0ms" }],
  1: [barBase, { animationDelay: "110ms" }],
  2: [barBase, { animationDelay: "220ms" }],
  3: [barBase, { animationDelay: "330ms" }],
});

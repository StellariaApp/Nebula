import { keyframes, style } from "@vanilla-extract/css";

import { reducedMedia, still } from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import {
  accentColor,
  accentGlow,
  gridCell,
  gridColor,
  starColor,
  starGlow,
} from "./StarField.vars.css.js";

const FADE_MASK =
  "radial-gradient(ellipse at 50% 30%, #000 28%, rgba(0, 0, 0, 0.82) 66%, transparent 96%)";

const TWINKLE = keyframes({
  "0%, 100%": { opacity: 0.2, transform: "scale(0.8)" },
  "50%": { opacity: 1, transform: "scale(1)" },
});

export const starField = style({
  "@layer": {
    [baseLayer]: {
      position: "absolute",
      inset: 0,
      overflow: "hidden",
      pointerEvents: "none",
      selectors: {
        "&[data-fixed='true']": { position: "fixed" },
      },
      "@media": {
        "(forced-colors: active)": { display: "none" },
      },
    },
  },
});

export const layer = style({
  "@layer": {
    [baseLayer]: {
      position: "absolute",
      inset: "-8%",
      willChange: "transform",
    },
  },
});

export const grid = style({
  "@layer": {
    [baseLayer]: {
      backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
      backgroundSize: `${gridCell} ${gridCell}`,
    },
  },
});

export const faded = style({
  "@layer": {
    [baseLayer]: {
      WebkitMaskImage: FADE_MASK,
      maskImage: FADE_MASK,
    },
  },
});

export const star = style({
  "@layer": {
    [baseLayer]: {
      position: "absolute",
      borderRadius: vars.radius.full,
      background: starColor,
      boxShadow: starGlow,
      opacity: 0.6,
      animationName: TWINKLE,
      animationDuration: `calc(${vars.motion.duration.expressive} * 6)`,
      animationTimingFunction: vars.motion.easing.standard,
      animationIterationCount: "infinite",
      selectors: {
        "&[data-accent='true']": { background: accentColor, boxShadow: accentGlow },
        "&[data-twinkle='false']": { ...still, opacity: 0.6, transform: "scale(1)" },
      },
      "@media": {
        [reducedMedia]: { ...still, opacity: 0.6, transform: "scale(1)" },
      },
    },
  },
});

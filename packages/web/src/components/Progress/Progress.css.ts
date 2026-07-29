import { fallbackVar, keyframes, style } from "@vanilla-extract/css";

import * as motion from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import {
  ringSize,
  trackBg,
  trackBorder,
  trackBorderWidth,
  trackHeight,
  trackRadius,
} from "./Progress.vars.css.js";

const SLIDE = keyframes({
  from: { transform: "translateX(-100%)" },
  to: { transform: "translateX(400%)" },
});

const STRIPES = keyframes({
  from: { backgroundPosition: "0 0" },
  to: { backgroundPosition: "1rem 0" },
});

const SPIN = keyframes({ to: { transform: "rotate(360deg)" } });

export const track = style({
  "@layer": {
    [baseLayer]: {
      position: "relative",
      display: "flex",
      overflow: "hidden",
      boxSizing: "border-box",
      width: "100%",
      height: trackHeight,
      borderRadius: trackRadius,
      background: fallbackVar(trackBg, vars.color.surface.sunken),
      borderStyle: "solid",
      borderWidth: fallbackVar(trackBorderWidth, "0"),
      borderColor: fallbackVar(trackBorder, "transparent"),
    },
  },
});

export const fill = style({
  "@layer": {
    [baseLayer]: {
      height: "100%",
      borderRadius: "inherit",
      ...motion.value,
      ...motion.reducedMotion,
    },
  },
});

const STRIPE_TINT = `color-mix(in srgb, ${vars.color.text.onPrimary} 20%, transparent)`;

export const striped = style({
  backgroundImage: `linear-gradient(45deg, ${STRIPE_TINT} 25%, transparent 25%, transparent 50%, ${STRIPE_TINT} 50%, ${STRIPE_TINT} 75%, transparent 75%, transparent)`,
  backgroundSize: "1rem 1rem",
  animationName: STRIPES,
  animationDuration: "0.8s",
  animationTimingFunction: "linear",
  animationIterationCount: "infinite",
  ...motion.reducedMotion,
});

export const indeterminate = style({
  "@layer": {
    [baseLayer]: {
      position: "absolute",
      insetBlock: 0,
      insetInlineStart: 0,
      width: "25%",
      borderRadius: "inherit",
      animationName: SLIDE,
      animationDuration: "1.2s",
      animationTimingFunction: vars.motion.easing.standard,
      animationIterationCount: "infinite",
      "@media": { "(prefers-reduced-motion: reduce)": { ...motion.still, width: "100%" } },
    },
  },
});

export const ring = style({
  "@layer": {
    [baseLayer]: {
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: ringSize,
      height: ringSize,
      flexShrink: 0,
    },
  },
});

export const ringSvg = style({
  width: "100%",
  height: "100%",
  transform: "rotate(-90deg)",
});

export const ringSpin = style({
  animationName: SPIN,
  animationDuration: "1.1s",
  animationTimingFunction: "linear",
  animationIterationCount: "infinite",
  transformOrigin: "center",
  ...motion.reducedMotion,
});

export const ringArc = style({
  ...motion.value,
  ...motion.reducedMotion,
});

export const ringLabel = style({
  "@layer": {
    [baseLayer]: {
      position: "absolute",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.caption,
      fontWeight: vars.font.weight.semibold,
      color: vars.color.text.primary,
    },
  },
});

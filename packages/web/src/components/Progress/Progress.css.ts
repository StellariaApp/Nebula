import { fallbackVar, keyframes, style, styleVariants } from "@vanilla-extract/css";

import * as motion from "../../styles/motion.css.js";
import { vars } from "@stellaria/nebula-themes/web";
import { component_layer } from "../../theme/layers.css.js";

import * as variables from "./Progress.vars.css.js";

const SLIDE = keyframes({
  from: { transform: "translateX(-100%)" },
  to: { transform: "translateX(400%)" },
});

const STRIPES = keyframes({
  from: { backgroundPosition: "0 0" },
  to: { backgroundPosition: "1rem 0" },
});

const SPIN = keyframes({ to: { transform: "rotate(360deg)" } });

const MATRIX_VARIANTS = [
  "filled",
  "outline",
  "light",
  "glass",
  "ghost",
  "glow",
  "gradient",
] as const;

const MATRIX_SCALES = ["primary", "accent", "gray", "success", "warning", "error", "info"] as const;

const MATRIX = Object.fromEntries(
  MATRIX_VARIANTS.flatMap((variant) =>
    MATRIX_SCALES.map((scale) => [`${variant}-${scale}`, vars.variant[variant][scale]] as const),
  ),
) as Record<string, (typeof vars.variant)["filled"]["primary"]>;

export const tone = styleVariants(MATRIX, (slot) => ({
  "@layer": {
    [component_layer]: {
      vars: {
        [variables.trackBg]: slot.background,
        [variables.trackBorder]: slot.borderColor,
        [variables.trackBorderWidth]: slot.borderWidth,
      },
    },
  },
}));

export const track = style({
  "@layer": {
    [component_layer]: {
      position: "relative",
      display: "flex",
      overflow: "hidden",
      boxSizing: "border-box",
      width: "100%",
      height: variables.trackHeight,
      borderRadius: variables.trackRadius,
      background: fallbackVar(variables.trackBg, vars.color.surface.sunken),
      borderStyle: "solid",
      borderWidth: fallbackVar(variables.trackBorderWidth, "0"),
      borderColor: fallbackVar(variables.trackBorder, "transparent"),
    },
  },
});

export const fill = style({
  "@layer": {
    [component_layer]: {
      height: "100%",
      borderRadius: "inherit",
      ...motion.value,
      ...motion.reduced_motion,
    },
  },
});

const STRIPE_TINT = `color-mix(in srgb, ${vars.color.text.onPrimary} 20%, transparent)`;

export const striped = style({
  backgroundImage: `linear-gradient(45deg, ${STRIPE_TINT} 25%, transparent 25%, transparent 50%, ${STRIPE_TINT} 50%, ${STRIPE_TINT} 75%, transparent 75%, transparent)`,
  backgroundSize: "1rem 1rem",
  animationName: STRIPES,
  animationDuration: `calc(${vars.motion.duration.fast} * 7)`,
  animationTimingFunction: "linear",
  animationIterationCount: "infinite",
  ...motion.reduced_motion,
});

export const indeterminate = style({
  "@layer": {
    [component_layer]: {
      position: "absolute",
      insetBlock: 0,
      insetInlineStart: 0,
      width: "25%",
      borderRadius: "inherit",
      animationName: SLIDE,
      animationDuration: `calc(${vars.motion.duration.fast} * 10)`,
      animationTimingFunction: vars.motion.easing.standard,
      animationIterationCount: "infinite",
      "@media": { "(prefers-reduced-motion: reduce)": { ...motion.still, width: "100%" } },
    },
  },
});

export const ring = style({
  "@layer": {
    [component_layer]: {
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: variables.ringSize,
      height: variables.ringSize,
      flexShrink: 0,
    },
  },
});

export const ring_svg = style({
  width: "100%",
  height: "100%",
  transform: "rotate(-90deg)",
});

export const ring_spin = style({
  animationName: SPIN,
  animationDuration: `calc(${vars.motion.duration.fast} * 9)`,
  animationTimingFunction: "linear",
  animationIterationCount: "infinite",
  transformOrigin: "center",
  ...motion.reduced_motion,
});

export const ring_track = style({
  "@layer": {
    [component_layer]: { stroke: fallbackVar(variables.trackBg, vars.color.surface.raised) },
  },
});

export const ring_arc = style({
  ...motion.value,
  ...motion.reduced_motion,
});

export const ring_label = style({
  "@layer": {
    [component_layer]: {
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

import { style } from "@vanilla-extract/css";

import { vars } from "@stellaria/nebula-themes/web";

import * as focus from "../../styles/focus.css.js";
import { still } from "../../styles/motion.css.js";
import { composite_layer } from "../../theme/layers.css.js";

const REDUCED = "(prefers-reduced-motion: reduce)";

export const shell = style({
  "@layer": {
    [composite_layer]: {
      background: vars.color.surface.sunken,
      borderRadius: vars.radius.lg,
      overflow: "hidden",
      position: "relative",
      width: "100%",
    },
  },
});

export const shell_fill = style({
  "@layer": {
    [composite_layer]: { height: "100%" },
  },
});

export const video = style({
  "@layer": {
    [composite_layer]: {
      display: "block",
      height: "100%",
      maxHeight: "100%",
      objectFit: "cover",
      width: "100%",
    },
  },
});

const REVEALS = {
  opacity: 0,
  transitionProperty: "opacity",
  transitionDuration: vars.motion.duration.fast,
  transitionTimingFunction: vars.motion.easing.standard,
  selectors: {
    '&[data-show="true"]': { opacity: 1 },
    [`${shell}:hover &`]: { opacity: 1 },
    [`${shell}:focus-within &`]: { opacity: 1 },
  },
  "@media": { [REDUCED]: still },
} as const;

export const bar = style({
  "@layer": {
    [composite_layer]: {
      ...REVEALS,
      background: `linear-gradient(to top, color-mix(in srgb, ${vars.color.surface.base} 92%, transparent), transparent)`,
      bottom: 0,
      display: "flex",
      flexDirection: "column",
      gap: 2,
      insetInline: 0,
      padding: `${vars.space.lg} ${vars.space.md} ${vars.space.sm}`,
      position: "absolute",
      zIndex: 2,
    },
  },
});

export const foot = style({
  "@layer": {
    [composite_layer]: {
      alignItems: "center",
      display: "flex",
      gap: vars.space.xs,
      justifyContent: "space-between",
      width: "100%",
    },
  },
});

export const grow = style({
  "@layer": {
    [composite_layer]: {
      ...REVEALS,
      position: "absolute",
      right: vars.space.sm,
      top: vars.space.sm,
      zIndex: 3,
    },
  },
});

export const big = style({
  "@layer": {
    [composite_layer]: {
      alignItems: "center",
      background: "none",
      border: 0,
      cursor: "pointer",
      display: "flex",
      inset: 0,
      justifyContent: "center",
      padding: 0,
      position: "absolute",
      width: "100%",
      zIndex: 1,
      ":focus-visible": focus.ring,
    },
  },
});

export const big_dot = style({
  "@layer": {
    [composite_layer]: {
      alignItems: "center",
      background: vars.glass.band.background,
      backdropFilter: vars.glass.band.backdropFilter,
      border: `1px solid ${vars.glass.band.borderColor}`,
      borderRadius: vars.radius.full,
      color: vars.color.text.primary,
      display: "flex",
      fontSize: 24,
      height: vars.size.control.xl,
      justifyContent: "center",
      width: vars.size.control.xl,
    },
  },
});

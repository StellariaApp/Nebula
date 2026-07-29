import { style, styleVariants } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import * as motion from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { ratingColor } from "./Rating.vars.css.js";

export const group = style({
  "@layer": {
    [baseLayer]: {
      display: "inline-flex",
      alignItems: "center",
      gap: vars.space.xxs,
      color: vars.color.text.muted,
      selectors: {
        "&[data-disabled='true']": { color: vars.color.text.disabled, cursor: "not-allowed" },
      },
    },
  },
});

export const item = style({
  "@layer": {
    [baseLayer]: {
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      appearance: "none",
      border: "none",
      background: "transparent",
      padding: 0,
      cursor: "pointer",
      outline: "none",
      color: "inherit",
      lineHeight: 0,
      ...motion.interaction,
      ...motion.reducedMotion,
      selectors: {
        "&[data-active='true']": { color: ratingColor },
        "&[data-focus-visible='true']": focus.ring,
        "&[data-readonly='true']": { cursor: "default" },
        "&[data-disabled='true']": { cursor: "not-allowed" },
      },
    },
  },
});

export const partial = style({
  "@layer": {
    [baseLayer]: {
      position: "absolute",
      inset: 0,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      color: ratingColor,
      pointerEvents: "none",
    },
  },
});

export const itemSize = styleVariants({
  xs: { width: vars.size.compact.xs, height: vars.size.compact.xs },
  sm: { width: vars.size.compact.sm, height: vars.size.compact.sm },
  md: { width: vars.size.compact.md, height: vars.size.compact.md },
  lg: { width: vars.size.compact.lg, height: vars.size.compact.lg },
  xl: { width: vars.size.compact.xl, height: vars.size.compact.xl },
});

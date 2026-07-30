import { keyframes, style, styleVariants } from "@vanilla-extract/css";

import * as motion from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { dotColor, dotOffset } from "./Indicator.vars.css.js";

const pulse = keyframes({
  "0%": { transform: "scale(1)", opacity: 1 },
  "70%": { transform: "scale(1.7)", opacity: 0 },
  "100%": { transform: "scale(1.7)", opacity: 0 },
});

export const root = style({
  "@layer": {
    [baseLayer]: { position: "relative", display: "inline-flex" },
  },
});

export const dot = style({
  "@layer": {
    [baseLayer]: {
      position: "absolute",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      boxSizing: "border-box",
      background: dotColor,
      color: vars.color.text.onPrimary,
      borderRadius: vars.radius.full,
      fontFamily: vars.font.family.sans,
      fontWeight: vars.font.weight.semibold,
      fontVariantNumeric: "tabular-nums",
      lineHeight: 1,
      pointerEvents: "none",
      zIndex: 1,
    },
  },
});

export const bordered = style({
  "@layer": {
    [baseLayer]: {
      borderWidth: 2,
      borderStyle: "solid",
      borderColor: vars.color.surface.base,
    },
  },
});

export const bare = style({});

export const badge = style({
  "@layer": {
    [baseLayer]: { paddingInline: 4 },
  },
});

export const processing = style({
  "@layer": {
    [baseLayer]: {
      selectors: {
        "&::after": {
          content: "",
          position: "absolute",
          inset: -2,
          borderRadius: vars.radius.full,
          background: dotColor,
          animationName: pulse,
          animationDuration: "1.6s",
          animationIterationCount: "infinite",
          animationTimingFunction: "ease-out",
        },
      },
      "@media": { "(prefers-reduced-motion: reduce)": motion.still },
    },
  },
});

export const size = styleVariants({
  xs: { minWidth: 8, height: 8, fontSize: 8 },
  sm: { minWidth: 12, height: 12, fontSize: 9 },
  md: { minWidth: 16, height: 16, fontSize: 10 },
  lg: { minWidth: 20, height: 20, fontSize: 11 },
  xl: { minWidth: 24, height: 24, fontSize: 12 },
});

export const placement = styleVariants({
  "top-start": { top: dotOffset, insetInlineStart: dotOffset, transform: "translate(-40%, -40%)" },
  "top-end": { top: dotOffset, insetInlineEnd: dotOffset, transform: "translate(40%, -40%)" },
  "bottom-start": {
    bottom: dotOffset,
    insetInlineStart: dotOffset,
    transform: "translate(-40%, 40%)",
  },
  "bottom-end": { bottom: dotOffset, insetInlineEnd: dotOffset, transform: "translate(40%, 40%)" },
});

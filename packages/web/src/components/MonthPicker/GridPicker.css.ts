import { fallbackVar, style, styleVariants } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import * as motion from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { dayBg, dayBorder, dayFg } from "../Calendar/Calendar.vars.css.js";

export const grid = style({
  "@layer": {
    [baseLayer]: {
      display: "grid",
      gap: vars.space.xs,
      fontFamily: vars.font.family.sans,
      color: vars.color.text.primary,
    },
  },
});

export const cell = style({
  "@layer": {
    [baseLayer]: {
      boxSizing: "border-box",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: vars.radius.sm,
      cursor: "pointer",
      outline: "none",
      userSelect: "none",
      textTransform: "capitalize",
      ...motion.interaction,
      ...motion.reducedMotion,
      selectors: {
        "&:hover:not([data-disabled='true']):not([data-selected='true'])": {
          background: vars.color.surface.hover,
        },
        "&:focus-visible": focus.ring,
        "&[data-selected='true']": {
          background: fallbackVar(dayBg, vars.color.primary["500"]),
          color: fallbackVar(dayFg, vars.color.text.onPrimary),
          borderColor: fallbackVar(dayBorder, "transparent"),
          fontWeight: vars.font.weight.semibold,
        },
        "&[data-disabled='true']": { color: vars.color.text.disabled, cursor: "not-allowed" },
      },
    },
  },
});

export const cellSize = styleVariants({
  xs: { height: vars.size.control.xs, fontSize: vars.font.size.body3 },
  sm: { height: vars.size.control.sm, fontSize: vars.font.size.body3 },
  md: { height: vars.size.control.md, fontSize: vars.font.size.body2 },
  lg: { height: vars.size.control.lg, fontSize: vars.font.size.body1 },
  xl: { height: vars.size.control.xl, fontSize: vars.font.size.body1 },
});

export const header = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: vars.space.sm,
      marginBlockEnd: vars.space.u3,
    },
  },
});

export const root = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      flexDirection: "column",
      fontFamily: vars.font.family.sans,
      color: vars.color.text.primary,
    },
  },
});

import { fallbackVar, style, styleVariants } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import * as motion from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { composite_layer } from "../../theme/layers.css.js";

import * as calendar_vars from "../Calendar/Calendar.vars.css.js";

export const grid = style({
  "@layer": {
    [composite_layer]: {
      display: "grid",
      gap: vars.space.xs,
      fontFamily: vars.font.family.sans,
      color: vars.color.text.primary,
    },
  },
});

export const cell = style({
  "@layer": {
    [composite_layer]: {
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
      ...motion.reduced_motion,
      selectors: {
        "&:hover:not([data-disabled='true']):not([data-selected='true'])": {
          background: vars.color.surface.hover,
        },
        "&:focus-visible": focus.ring,
        "&[data-selected='true']": {
          background: fallbackVar(calendar_vars.dayBg, vars.color.primary["500"]),
          color: fallbackVar(calendar_vars.dayFg, vars.color.text.onPrimary),
          borderColor: fallbackVar(calendar_vars.dayBorder, "transparent"),
          fontWeight: vars.font.weight.semibold,
        },
        "&[data-selected='true']:hover:not([data-disabled='true'])": {
          background: fallbackVar(calendar_vars.dayBgHover, vars.color.primary["600"]),
        },
        "&[data-disabled='true']": { color: vars.color.text.disabled, cursor: "not-allowed" },
      },
    },
  },
});

export const cell_size = styleVariants({
  xs: { minHeight: vars.size.control.xs, fontSize: vars.font.size.body3 },
  sm: { minHeight: vars.size.control.sm, fontSize: vars.font.size.body3 },
  md: { minHeight: vars.size.control.md, fontSize: vars.font.size.body2 },
  lg: { minHeight: vars.size.control.lg, fontSize: vars.font.size.body1 },
  xl: { minHeight: vars.size.control.xl, fontSize: vars.font.size.body1 },
});

export const header = style({
  "@layer": {
    [composite_layer]: {
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
    [composite_layer]: {
      display: "flex",
      flexDirection: "column",
      fontFamily: vars.font.family.sans,
      color: vars.color.text.primary,
    },
  },
});

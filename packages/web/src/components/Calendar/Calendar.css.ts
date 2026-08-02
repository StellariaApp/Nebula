import { fallbackVar, style, styleVariants } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import * as motion from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { dayBg, dayBorder, dayFg, rangeBg } from "./Calendar.vars.css.js";

export const root = style({
  "@layer": {
    [baseLayer]: {
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      gap: vars.space.u3,
      fontFamily: vars.font.family.sans,
      color: vars.color.text.primary,
    },
  },
});

export const header = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: vars.space.sm,
    },
  },
});

export const heading = style({
  "@layer": {
    [baseLayer]: {
      flex: 1,
      textAlign: "center",
      fontSize: vars.font.size.body2,
      fontWeight: vars.font.weight.semibold,
      lineHeight: vars.font.lineHeight.tight,
      textTransform: "capitalize",
    },
  },
});

export const nav = style({
  "@layer": {
    [baseLayer]: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      appearance: "none",
      border: "none",
      background: "transparent",
      color: vars.color.text.secondary,
      borderRadius: vars.radius.sm,
      cursor: "pointer",
      outline: "none",
      padding: 0,
      ...motion.interaction,
      ...motion.reducedMotion,
      selectors: {
        "&:hover:not(:disabled)": {
          background: vars.color.surface.hover,
          color: vars.color.text.primary,
        },
        "&[data-focus-visible='true']": focus.ring,
        "&:disabled": { color: vars.color.text.disabled, cursor: "not-allowed" },
      },
    },
  },
});

export const months = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      gap: vars.space.lg,
      alignItems: "flex-start",
    },
  },
});

export const grid = style({
  "@layer": {
    [baseLayer]: {
      borderCollapse: "collapse",
      borderSpacing: 0,
      width: "100%",
    },
  },
});

export const weekday = style({
  "@layer": {
    [baseLayer]: {
      fontSize: vars.font.size.caption,
      fontWeight: vars.font.weight.medium,
      lineHeight: vars.font.lineHeight.tight,
      color: vars.color.text.muted,
      textTransform: "capitalize",
      paddingBlockEnd: vars.space.xs,
      textAlign: "center",
    },
  },
});

export const cellWrapper = style({
  "@layer": {
    [baseLayer]: {
      padding: 0,
      textAlign: "center",
      selectors: {
        "&[data-range-selected='true']": {
          background: fallbackVar(rangeBg, vars.color.primary["100"]),
        },
        "&[data-range-start='true']": {
          borderStartStartRadius: vars.radius.full,
          borderEndStartRadius: vars.radius.full,
        },
        "&[data-range-end='true']": {
          borderStartEndRadius: vars.radius.full,
          borderEndEndRadius: vars.radius.full,
        },
      },
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
      width: "100%",
      borderRadius: vars.radius.full,
      cursor: "pointer",
      outline: "none",
      userSelect: "none",
      color: vars.color.text.primary,
      ...motion.interaction,
      ...motion.reducedMotion,
      selectors: {
        "&[data-hovered='true']:not([data-disabled='true'])": {
          background: vars.color.surface.hover,
        },
        "&[data-focus-visible='true']": focus.ring,
        "&[data-selected='true']:not([data-range-middle='true'])": {
          background: fallbackVar(dayBg, vars.color.primary["600"]),
          color: fallbackVar(dayFg, vars.color.text.onPrimary),
          borderColor: fallbackVar(dayBorder, "transparent"),
          fontWeight: vars.font.weight.semibold,
        },
        "&[data-range-middle='true']": {
          background: "transparent",
          borderRadius: 0,
          fontWeight: vars.font.weight.medium,
        },
        "&[data-range-middle='true'][data-hovered='true']:not([data-disabled='true'])": {
          background: vars.color.surface.hover,
        },
        "&[data-disabled='true']": {
          color: vars.color.text.disabled,
          cursor: "not-allowed",
        },
        "&[data-unavailable='true']": {
          color: vars.color.text.disabled,
          textDecoration: "line-through",
          cursor: "not-allowed",
        },
        "&[data-today='true']:not([data-selected='true'])": {
          boxShadow: `inset 0 0 0 1px ${vars.color.border.strong}`,
          fontWeight: vars.font.weight.semibold,
        },
      },
    },
  },
});

export const cellSize = styleVariants({
  xs: {
    height: vars.size.control.xs,
    minWidth: vars.size.control.xs,
    fontSize: vars.font.size.body3,
  },
  sm: {
    height: vars.size.control.sm,
    minWidth: vars.size.control.sm,
    fontSize: vars.font.size.body3,
  },
  md: {
    height: vars.size.control.md,
    minWidth: vars.size.control.md,
    fontSize: vars.font.size.body2,
  },
  lg: {
    height: vars.size.control.lg,
    minWidth: vars.size.control.lg,
    fontSize: vars.font.size.body1,
  },
  xl: {
    height: vars.size.control.xl,
    minWidth: vars.size.control.xl,
    fontSize: vars.font.size.body1,
  },
});

export const navSize = styleVariants({
  xs: { width: vars.size.control.xs, height: vars.size.control.xs },
  sm: { width: vars.size.control.sm, height: vars.size.control.sm },
  md: { width: vars.size.control.md, height: vars.size.control.md },
  lg: { width: vars.size.control.lg, height: vars.size.control.lg },
  xl: { width: vars.size.control.xl, height: vars.size.control.xl },
});

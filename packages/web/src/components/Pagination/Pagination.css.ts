import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import * as motion from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { accent, activeFg } from "./Pagination.vars.css.js";

export const root = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.xxs,
      listStyle: "none",
      margin: 0,
      padding: 0,
      fontFamily: vars.font.family.sans,
    },
  },
});

export const control = recipe({
  base: {
    "@layer": {
      [baseLayer]: {
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        border: "none",
        background: "transparent",
        borderRadius: vars.radius.sm,
        font: "inherit",
        fontWeight: vars.font.weight.semibold,
        lineHeight: vars.font.lineHeight.normal,
        color: vars.color.text.secondary,
        cursor: "pointer",
        ...motion.interaction,
        selectors: {
          "&:hover:not(:disabled):not([data-active='true'])": {
            background: vars.color.surface.sunken,
            color: vars.color.text.primary,
          },
          "&[data-active='true']": { color: activeFg },
          "&:disabled": { cursor: "not-allowed", color: vars.color.text.muted },
          "&:focus-visible": {
            outline: `2px solid ${vars.color.border.focus}`,
            outlineOffset: "2px",
          },
        },
        ...motion.reducedMotion,
      },
    },
  },
  variants: {
    size: {
      sm: {
        minWidth: vars.size.control.xs,
        height: vars.size.control.xs,
        fontSize: vars.font.size.body3,
      },
      md: {
        minWidth: vars.size.control.sm,
        height: vars.size.control.sm,
        fontSize: vars.font.size.body2,
      },
      lg: {
        minWidth: vars.size.control.md,
        height: vars.size.control.md,
        fontSize: vars.font.size.body1,
      },
      xl: {
        minWidth: vars.size.control.lg,
        height: vars.size.control.lg,
        fontSize: vars.font.size.body1,
      },
    },
  },
  defaultVariants: { size: "md" },
});

export const pill = style({
  "@layer": {
    [baseLayer]: {
      position: "absolute",
      inset: 0,
      borderRadius: vars.radius.sm,
      background: accent,
      zIndex: 0,
    },
  },
});

export const value = style({ position: "relative", zIndex: 1 });

export const dots = style({
  "@layer": {
    [baseLayer]: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: vars.size.control.xs,
      color: vars.color.text.muted,
      userSelect: "none",
    },
  },
});

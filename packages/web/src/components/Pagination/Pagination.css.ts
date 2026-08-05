import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import * as motion from "../../styles/motion.css.js";
import * as focus from "../../styles/focus.css.js";
import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

import { accent, accentHover, activeFg } from "./Pagination.vars.css.js";

export const root = style({
  "@layer": {
    [base_layer]: {
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
      [base_layer]: {
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
            background: vars.color.surface.hover,
            color: vars.color.text.primary,
          },
          "&[data-active='true']": { color: activeFg },
          "&:disabled": { cursor: "not-allowed", color: vars.color.text.muted },
          "&:focus-visible": {
            ...focus.ring,
          },
        },
        ...motion.reduced_motion,
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
    [base_layer]: {
      position: "absolute",
      inset: 0,
      borderRadius: vars.radius.sm,
      background: accent,
      zIndex: 0,
      selectors: {
        "[data-active='true']:hover:not(:disabled) &": { background: accentHover },
      },
    },
  },
});

export const value = style({ position: "relative", zIndex: 1 });

export const dots = style({
  "@layer": {
    [base_layer]: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: vars.size.control.xs,
      color: vars.color.text.muted,
      userSelect: "none",
    },
  },
});

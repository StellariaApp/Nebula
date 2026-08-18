import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import * as motion from "../../styles/motion.css.js";
import * as focus from "../../styles/focus.css.js";
import { vars } from "@stellaria/nebula-themes/web";
import { primitive_layer } from "../../theme/layers.css.js";

import * as variables from "./Pagination.vars.css.js";

export const root = style({
  "@layer": {
    [primitive_layer]: {
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      rowGap: vars.space.xxs,
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
      [primitive_layer]: {
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
          "&[data-active='true']": { color: variables.activeFg },
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
        minHeight: vars.size.control.xs,
        fontSize: vars.font.size.body3,
      },
      md: {
        minWidth: vars.size.control.sm,
        minHeight: vars.size.control.sm,
        fontSize: vars.font.size.body2,
      },
      lg: {
        minWidth: vars.size.control.md,
        minHeight: vars.size.control.md,
        fontSize: vars.font.size.body1,
      },
      xl: {
        minWidth: vars.size.control.lg,
        minHeight: vars.size.control.lg,
        fontSize: vars.font.size.body1,
      },
    },
  },
  defaultVariants: { size: "md" },
});

export const pill = style({
  "@layer": {
    [primitive_layer]: {
      position: "absolute",
      inset: 0,
      borderRadius: vars.radius.sm,
      background: variables.accent,
      zIndex: 0,
      selectors: {
        "[data-active='true']:hover:not(:disabled) &": { background: variables.accentHover },
      },
    },
  },
});

export const value = style({ position: "relative", zIndex: 1 });

export const dots = style({
  "@layer": {
    [primitive_layer]: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: vars.size.control.xs,
      color: vars.color.text.muted,
      userSelect: "none",
    },
  },
});

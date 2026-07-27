import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

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
        color: vars.color.text.secondary,
        cursor: "pointer",
        transitionProperty: "background, color",
        transitionDuration: vars.motion.duration.fast,
        transitionTimingFunction: vars.motion.easing.standard,
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
        "@media": { "(prefers-reduced-motion: reduce)": { transitionDuration: "0.01ms" } },
      },
    },
  },
  variants: {
    size: {
      xs: { minWidth: "1.5rem", height: "1.5rem", fontSize: vars.font.size.caption },
      sm: { minWidth: "1.75rem", height: "1.75rem", fontSize: vars.font.size.body3 },
      md: { minWidth: "2rem", height: "2rem", fontSize: vars.font.size.body2 },
      lg: { minWidth: "2.5rem", height: "2.5rem", fontSize: vars.font.size.body1 },
      xl: { minWidth: "3rem", height: "3rem", fontSize: vars.font.size.h6 },
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
      minWidth: "1.5rem",
      color: vars.color.text.muted,
      userSelect: "none",
    },
  },
});

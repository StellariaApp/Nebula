import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { bg, fg } from "./Pagination.vars.css.js";

export const root = style({ display: "inline-flex" });

export const list = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.xxs,
      listStyle: "none",
      margin: 0,
      padding: 0,
    },
  },
});

export const item = recipe({
  base: {
    "@layer": {
      [baseLayer]: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        padding: 0,
        borderRadius: vars.radius.md,
        border: "none",
        background: bg,
        color: fg,
        font: "inherit",
        fontWeight: vars.font.weight.medium,
        cursor: "pointer",
        userSelect: "none",
        transitionProperty: "background, color, opacity",
        transitionDuration: vars.motion.duration.fast,
        transitionTimingFunction: vars.motion.easing.standard,
        selectors: {
          "&:not([data-active='true']):hover:not(:disabled)": {
            background: vars.color.surface.sunken,
          },
          "&[data-active='true']:hover:not(:disabled)": {
            filter: "brightness(0.92)",
          },
          "&:focus-visible": {
            outline: `2px solid ${vars.color.border.focus}`,
            outlineOffset: "2px",
          },
          "&:disabled": { cursor: "not-allowed", opacity: 0.4 },
        },
        "@media": { "(prefers-reduced-motion: reduce)": { transitionDuration: "0.01ms" } },
      },
    },
  },
  variants: {
    size: {
      xs: { width: vars.size.xs, height: vars.size.xs, fontSize: vars.font.size.caption },
      sm: { width: vars.size.sm, height: vars.size.sm, fontSize: vars.font.size.caption },
      md: { width: vars.size.md, height: vars.size.md, fontSize: vars.font.size.body3 },
      lg: { width: vars.size.lg, height: vars.size.lg, fontSize: vars.font.size.body2 },
      xl: { width: vars.size.xl, height: vars.size.xl, fontSize: vars.font.size.body2 },
    },
  },
  defaultVariants: { size: "md" },
});

export const control = recipe({
  base: {
    "@layer": {
      [baseLayer]: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        padding: 0,
        borderRadius: vars.radius.md,
        border: "none",
        background: "transparent",
        color: vars.color.text.secondary,
        cursor: "pointer",
        transitionProperty: "background, color, opacity",
        transitionDuration: vars.motion.duration.fast,
        transitionTimingFunction: vars.motion.easing.standard,
        selectors: {
          "&:hover:not(:disabled)": {
            background: vars.color.surface.sunken,
            color: vars.color.text.primary,
          },
          "&:focus-visible": {
            outline: `2px solid ${vars.color.border.focus}`,
            outlineOffset: "2px",
          },
          "&:disabled": { cursor: "not-allowed", opacity: 0.4 },
        },
        "@media": { "(prefers-reduced-motion: reduce)": { transitionDuration: "0.01ms" } },
      },
    },
  },
  variants: {
    size: {
      xs: { width: vars.size.xs, height: vars.size.xs },
      sm: { width: vars.size.sm, height: vars.size.sm },
      md: { width: vars.size.md, height: vars.size.md },
      lg: { width: vars.size.lg, height: vars.size.lg },
      xl: { width: vars.size.xl, height: vars.size.xl },
    },
  },
  defaultVariants: { size: "md" },
});

export const dots = style({
  "@layer": {
    [baseLayer]: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: vars.size.md,
      height: vars.size.md,
      color: vars.color.text.muted,
    },
  },
});

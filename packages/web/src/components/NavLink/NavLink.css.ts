import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { bg, fg } from "./NavLink.vars.css.js";

export const wrapper = style({
  display: "flex",
  flexDirection: "column",
});

export const root = recipe({
  base: {
    "@layer": {
      [baseLayer]: {
        display: "flex",
        alignItems: "center",
        gap: vars.space.sm,
        width: "100%",
        boxSizing: "border-box",
        paddingInline: vars.space.md,
        paddingBlock: vars.space.sm,
        borderRadius: vars.radius.md,
        border: "none",
        background: bg,
        color: fg,
        font: "inherit",
        fontSize: vars.font.size.body2,
        fontWeight: vars.font.weight.medium,
        textAlign: "start",
        textDecoration: "none",
        cursor: "pointer",
        minHeight: "2.75rem",
        transitionProperty: "background, color",
        transitionDuration: vars.motion.duration.fast,
        transitionTimingFunction: vars.motion.easing.standard,
        selectors: {
          "&:not([data-active='true']):hover:not(:disabled):not([data-disabled='true'])": {
            background: vars.color.surface.sunken,
          },
          "&[data-active='true']:hover:not(:disabled):not([data-disabled='true'])": {
            background: `color-mix(in srgb, ${bg} 85%, ${vars.color.surface.sunken})`,
          },
          "&:focus-visible": {
            outline: `2px solid ${vars.color.border.focus}`,
            outlineOffset: "-2px",
          },
          "&:disabled, &[data-disabled='true']": {
            cursor: "not-allowed",
            opacity: 0.55,
          },
        },
        "@media": { "(prefers-reduced-motion: reduce)": { transitionDuration: "0.01ms" } },
      },
    },
  },
  variants: {
    withDescription: {
      true: { alignItems: "flex-start" },
      false: {},
    },
  },
  defaultVariants: { withDescription: false },
});

export const icon = style({
  "@layer": {
    [baseLayer]: {
      display: "inline-flex",
      flexShrink: 0,
      color: "currentColor",
    },
  },
});

export const body = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      flexDirection: "column",
      flex: 1,
      minWidth: 0,
      gap: 2,
    },
  },
});

export const label = style({
  "@layer": {
    [baseLayer]: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  },
});

export const description = style({
  "@layer": {
    [baseLayer]: {
      fontSize: vars.font.size.caption,
      fontWeight: vars.font.weight.regular,
      color: vars.color.text.secondary,
    },
  },
});

export const chevron = style({
  "@layer": {
    [baseLayer]: {
      display: "inline-flex",
      flexShrink: 0,
      color: vars.color.text.secondary,
    },
  },
});

export const children = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      flexDirection: "column",
      gap: 2,
      paddingInlineStart: vars.space.lg,
      paddingBlockStart: 2,
    },
  },
});

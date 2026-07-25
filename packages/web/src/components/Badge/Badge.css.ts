import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { bg, borderColor, fg } from "./Badge.vars.css.js";

export const badge = recipe({
  base: {
    "@layer": {
      [baseLayer]: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: vars.space.xxs,
        boxSizing: "border-box",
        fontFamily: vars.font.family.sans,
        fontWeight: vars.font.weight.semibold,
        lineHeight: vars.font.lineHeight.tight,
        whiteSpace: "nowrap",
        background: bg,
        color: fg,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: borderColor,
      },
    },
  },
  variants: {
    size: {
      xs: {
        height: "1rem",
        paddingInline: vars.space.xs,
        fontSize: vars.font.size.caption,
      },
      sm: {
        height: "1.25rem",
        paddingInline: vars.space.xs,
        fontSize: vars.font.size.caption,
      },
      md: {
        height: "1.5rem",
        paddingInline: vars.space.sm,
        fontSize: vars.font.size.body3,
      },
      lg: {
        height: "1.75rem",
        paddingInline: vars.space.sm,
        fontSize: vars.font.size.body2,
      },
      xl: {
        height: "2rem",
        paddingInline: vars.space.md,
        fontSize: vars.font.size.body2,
      },
    },
    radius: {
      sm: { borderRadius: vars.radius.sm },
      md: { borderRadius: vars.radius.md },
      full: { borderRadius: vars.radius.full },
    },
    fullWidth: {
      true: { display: "flex", width: "100%" },
      false: {},
    },
  },
  defaultVariants: { size: "md", radius: "full", fullWidth: false },
});

export const section = style({
  display: "inline-flex",
  alignItems: "center",
  flexShrink: 0,
});

export const dot = style({
  "@layer": {
    [baseLayer]: {
      width: "0.5em",
      height: "0.5em",
      borderRadius: vars.radius.full,
      background: "currentColor",
      flexShrink: 0,
    },
  },
});

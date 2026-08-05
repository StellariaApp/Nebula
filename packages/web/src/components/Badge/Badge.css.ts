import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

import { bg, borderColor, fg } from "./Badge.vars.css.js";

export const badge = recipe({
  base: {
    "@layer": {
      [base_layer]: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: vars.space.xxs,
        boxSizing: "border-box",
        fontFamily: vars.font.family.sans,
        fontWeight: vars.font.weight.semibold,
        lineHeight: "100%",
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
        height: vars.size.compact.xs,
        paddingInline: vars.space.sm,
        fontSize: vars.font.size.caption,
      },
      sm: {
        height: vars.size.compact.sm,
        paddingInline: vars.space.sm,
        fontSize: vars.font.size.caption,
      },
      md: {
        height: vars.size.compact.md,
        paddingInline: vars.space.md,
        fontSize: vars.font.size.body3,
      },
      lg: {
        height: vars.size.compact.lg,
        paddingInline: vars.space.lg,
        fontSize: vars.font.size.body2,
      },
      xl: {
        height: vars.size.compact.xl,
        paddingInline: vars.space.xl,
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
    [base_layer]: {
      width: "0.5em",
      height: "0.5em",
      borderRadius: vars.radius.full,
      background: "currentColor",
      flexShrink: 0,
    },
  },
});

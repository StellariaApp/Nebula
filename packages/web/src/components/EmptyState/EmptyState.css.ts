import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const root = recipe({
  base: {
    "@layer": {
      [baseLayer]: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        boxSizing: "border-box",
        fontFamily: vars.font.family.sans,
        color: vars.color.text.primary,
      },
    },
  },
  variants: {
    size: {
      sm: { gap: vars.space.xs, paddingBlock: vars.space.lg, paddingInline: vars.space.md },
      md: { gap: vars.space.sm, paddingBlock: vars.space.xxl, paddingInline: vars.space.lg },
      lg: { gap: vars.space.md, paddingBlock: vars.space.xxxl, paddingInline: vars.space.xl },
    },
  },
  defaultVariants: { size: "md" },
});

export const icon = style({
  "@layer": {
    [baseLayer]: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      color: vars.color.text.muted,
      fontSize: vars.font.size.h2,
      lineHeight: 1,
    },
  },
});

export const title = style({
  "@layer": {
    [baseLayer]: {
      margin: 0,
      fontSize: vars.font.size.h6,
      fontWeight: vars.font.weight.semibold,
      lineHeight: vars.font.lineHeight.tight,
      color: vars.color.text.primary,
    },
  },
});

export const description = style({
  "@layer": {
    [baseLayer]: {
      margin: 0,
      maxWidth: "42ch",
      fontSize: vars.font.size.body2,
      lineHeight: vars.font.lineHeight.relaxed,
      color: vars.color.text.secondary,
    },
  },
});

export const actions = style({
  display: "flex",
  flexWrap: "wrap",
  gap: vars.space.xs,
  justifyContent: "center",
  marginBlockStart: vars.space.xs,
});

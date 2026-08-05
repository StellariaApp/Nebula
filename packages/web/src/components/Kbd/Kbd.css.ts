import { style, styleVariants } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

export const kbd = style({
  "@layer": {
    [base_layer]: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      boxSizing: "border-box",
      fontFamily: vars.font.family.mono,
      fontWeight: vars.font.weight.medium,
      lineHeight: 1,
      whiteSpace: "nowrap",
      background: vars.color.surface.sunken,
      color: vars.color.text.secondary,
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: vars.color.border.default,
      borderBottomWidth: 2,
      borderRadius: vars.radius.xs,
    },
  },
});

export const size = styleVariants({
  xs: {
    minWidth: vars.size.compact.xs,
    height: vars.size.compact.xs,
    paddingInline: vars.space.xxs,
    fontSize: vars.font.size.caption,
  },
  sm: {
    minWidth: vars.size.compact.sm,
    height: vars.size.compact.sm,
    paddingInline: vars.space.xs,
    fontSize: vars.font.size.caption,
  },
  md: {
    minWidth: vars.size.compact.md,
    height: vars.size.compact.md,
    paddingInline: vars.space.xs,
    fontSize: vars.font.size.body3,
  },
  lg: {
    minWidth: vars.size.compact.lg,
    height: vars.size.compact.lg,
    paddingInline: vars.space.sm,
    fontSize: vars.font.size.body2,
  },
  xl: {
    minWidth: vars.size.compact.xl,
    height: vars.size.compact.xl,
    paddingInline: vars.space.sm,
    fontSize: vars.font.size.body1,
  },
});

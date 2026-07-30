import { style, styleVariants } from "@vanilla-extract/css";

import * as motion from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { bg, borderColor, fg } from "./Tag.vars.css.js";

export const tag = style({
  "@layer": {
    [baseLayer]: {
      display: "inline-flex",
      alignItems: "center",
      gap: vars.space.xxs,
      maxWidth: "100%",
      boxSizing: "border-box",
      fontFamily: vars.font.family.sans,
      fontWeight: vars.font.weight.medium,
      lineHeight: vars.font.lineHeight.tight,
      background: bg,
      color: fg,
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: borderColor,
      ...motion.interaction,
      ...motion.reducedMotion,
      selectors: {
        "&[data-disabled='true']": {
          background: vars.color.surface.sunken,
          borderColor: vars.color.border.disabled,
          color: vars.color.text.muted,
        },
      },
    },
  },
});

export const label = style({
  "@layer": {
    [baseLayer]: {
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  },
});

export const section = style({
  "@layer": {
    [baseLayer]: { display: "inline-flex", flexShrink: 0, lineHeight: 0 },
  },
});

export const remove = style({
  "@layer": {
    [baseLayer]: { flexShrink: 0, marginInlineEnd: `calc(-1 * ${vars.space.xxs})` },
  },
});

export const size = styleVariants({
  xs: { minHeight: 18, paddingInline: vars.space.xs, fontSize: vars.font.size.caption },
  sm: { minHeight: 22, paddingInline: vars.space.xs, fontSize: vars.font.size.caption },
  md: { minHeight: 26, paddingInline: vars.space.sm, fontSize: vars.font.size.body3 },
  lg: { minHeight: 32, paddingInline: vars.space.sm, fontSize: vars.font.size.body2 },
  xl: { minHeight: 38, paddingInline: vars.space.md, fontSize: vars.font.size.body1 },
});

export const radius = styleVariants({
  sm: { borderRadius: vars.radius.sm },
  md: { borderRadius: vars.radius.md },
  full: { borderRadius: vars.radius.full },
});

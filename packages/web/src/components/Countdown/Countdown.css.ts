import { style, styleVariants } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const root = style({
  "@layer": {
    [baseLayer]: {
      display: "inline-flex",
      alignItems: "baseline",
      gap: vars.space.xs,
      fontVariantNumeric: "tabular-nums",
      color: vars.color.text.primary,
    },
  },
});

export const unit = style({
  "@layer": {
    [baseLayer]: {
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 2,
    },
  },
});

export const value = style({
  "@layer": {
    [baseLayer]: {
      fontWeight: vars.font.weight.semibold,
      lineHeight: vars.font.lineHeight.tight,
    },
  },
});

export const caption = style({
  "@layer": {
    [baseLayer]: {
      fontSize: vars.font.size.caption,
      color: vars.color.text.muted,
    },
  },
});

export const size = styleVariants({
  sm: { fontSize: vars.font.size.body2 },
  md: { fontSize: vars.font.size.h5 },
  lg: { fontSize: vars.font.size.h3 },
});

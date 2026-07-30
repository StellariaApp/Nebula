import { style, styleVariants } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const kbd = style({
  "@layer": {
    [baseLayer]: {
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
  xs: { minWidth: 18, height: 18, paddingInline: 4, fontSize: 10 },
  sm: { minWidth: 20, height: 20, paddingInline: 5, fontSize: 11 },
  md: { minWidth: 24, height: 24, paddingInline: 6, fontSize: 12 },
  lg: { minWidth: 28, height: 28, paddingInline: 8, fontSize: 14 },
  xl: { minWidth: 34, height: 34, paddingInline: 10, fontSize: 16 },
});

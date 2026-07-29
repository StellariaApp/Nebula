import { style, styleVariants } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const group = style({
  "@layer": {
    [baseLayer]: {
      display: "inline-flex",
      alignItems: "center",
      gap: vars.space.sm,
    },
  },
});

export const cell = style({
  "@layer": {
    [baseLayer]: {
      textAlign: "center",
      fontVariantNumeric: "tabular-nums",
      fontFeatureSettings: '"tnum"',
      padding: 0,
    },
  },
});

export const cellWidth = styleVariants({
  xs: { width: vars.size.control.xs },
  sm: { width: vars.size.control.sm },
  md: { width: vars.size.control.md },
  lg: { width: vars.size.control.lg },
  xl: { width: vars.size.control.xl },
});

import { style, styleVariants } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const fixed = style({
  "@layer": {
    [baseLayer]: { position: "fixed" },
  },
});

export const radius = styleVariants({
  none: { borderRadius: 0 },
  xxs: { borderRadius: vars.radius.xxs },
  xs: { borderRadius: vars.radius.xs },
  sm: { borderRadius: vars.radius.sm },
  md: { borderRadius: vars.radius.md },
  lg: { borderRadius: vars.radius.lg },
  xl: { borderRadius: vars.radius.xl },
  xxl: { borderRadius: vars.radius.xxl },
  full: { borderRadius: vars.radius.full },
});

import { createVar, style, styleVariants } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const tint = createVar();
export const alpha = createVar();

export const overlay = style({
  "@layer": {
    [baseLayer]: {
      position: "absolute",
      inset: 0,
      background: tint,
      opacity: alpha,
      selectors: {
        "&[data-fixed='true']": { position: "fixed" },
        "&[data-center='true']": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 1,
        },
      },
    },
  },
});

export const blur = styleVariants({
  none: {},
  sm: { backdropFilter: `blur(${vars.blur.sm})` },
  md: { backdropFilter: `blur(${vars.blur.md})` },
  lg: { backdropFilter: `blur(${vars.blur.lg})` },
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

export const veil = style({
  "@layer": {
    [baseLayer]: {
      position: "absolute",
      inset: 0,
      background: tint,
      opacity: alpha,
      borderRadius: "inherit",
    },
  },
});

export const content = style({
  "@layer": {
    [baseLayer]: { position: "relative" },
  },
});

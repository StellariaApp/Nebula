import { style, styleVariants } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

import * as variables from "./Overlay.vars.css.js";

export const overlay = style({
  "@layer": {
    [base_layer]: {
      position: "absolute",
      inset: 0,
      background: variables.tint,
      opacity: variables.alpha,
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
    [base_layer]: {
      position: "absolute",
      inset: 0,
      background: variables.tint,
      opacity: variables.alpha,
      borderRadius: "inherit",
    },
  },
});

export const content = style({
  "@layer": {
    [base_layer]: { position: "relative" },
  },
});

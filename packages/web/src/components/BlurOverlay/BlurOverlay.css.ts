import { style, styleVariants } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { alpha, backdrop, tint } from "./BlurOverlay.vars.css.js";

const NO_BACKDROP = "not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))";

export const blurOverlay = style({
  "@layer": {
    [baseLayer]: {
      position: "absolute",
      inset: 0,
      backdropFilter: backdrop,
      WebkitBackdropFilter: backdrop,
      selectors: {
        "&[data-fixed='true']": { position: "fixed" },
        "&[data-center='true']": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      },
      "@media": {
        "(forced-colors: active)": {
          backdropFilter: "none",
          WebkitBackdropFilter: "none",
        },
      },
    },
  },
});

export const veil = style({
  "@layer": {
    [baseLayer]: {
      position: "absolute",
      inset: 0,
      background: tint,
      opacity: alpha,
      borderRadius: "inherit",
      "@supports": {
        [NO_BACKDROP]: { opacity: 1 },
      },
      "@media": {
        "(forced-colors: active)": { background: "Canvas", opacity: 1 },
      },
    },
  },
});

export const content = style({
  "@layer": {
    [baseLayer]: { position: "relative" },
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

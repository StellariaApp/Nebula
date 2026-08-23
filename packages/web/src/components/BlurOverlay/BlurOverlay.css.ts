import { style } from "@vanilla-extract/css";

import { primitive_layer } from "../../theme/layers.css.js";

import * as variables from "./BlurOverlay.vars.css.js";

const NO_BACKDROP = "not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))";

export const blur_overlay = style({
  "@layer": {
    [primitive_layer]: {
      position: "absolute",
      inset: 0,
      backdropFilter: variables.backdrop,
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
        },
      },
    },
  },
});

export const veil = style({
  "@layer": {
    [primitive_layer]: {
      position: "absolute",
      inset: 0,
      background: variables.tint,
      opacity: variables.alpha,
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
    [primitive_layer]: { position: "relative" },
  },
});

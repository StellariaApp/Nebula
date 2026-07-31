import { createVar, style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const frameRatio = createVar();

export const frame = style({
  "@layer": {
    [baseLayer]: {
      position: "relative",
      width: "100%",
      aspectRatio: frameRatio,
      overflow: "hidden",
      borderRadius: vars.radius.md,
      background: "#000000",
    },
  },
});

export const surface = style({
  "@layer": {
    [baseLayer]: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
    },
  },
});

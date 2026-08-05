import { style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

import * as variables from "./Player.vars.css.js";

export const frame = style({
  "@layer": {
    [base_layer]: {
      position: "relative",
      width: "100%",
      aspectRatio: variables.frameRatio,
      overflow: "hidden",
      borderRadius: vars.radius.md,
      background: "#000000",
    },
  },
});

export const surface = style({
  "@layer": {
    [base_layer]: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
    },
  },
});

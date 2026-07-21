import { style } from "@vanilla-extract/css";

import { baseLayer } from "../../theme/layers.css.js";

import { containerSize } from "./Container.vars.css.js";

export const container = style({
  "@layer": {
    [baseLayer]: {
      boxSizing: "border-box",
      width: "100%",
      maxWidth: containerSize,
      marginInline: "auto",
    },
  },
});

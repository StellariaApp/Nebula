import { style } from "@vanilla-extract/css";

import { baseLayer } from "../../theme/layers.css.js";

export const amount = style({
  "@layer": {
    [baseLayer]: {
      fontVariantNumeric: "tabular-nums",
      textAlign: "end",
    },
  },
});

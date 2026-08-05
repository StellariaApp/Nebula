import { style } from "@vanilla-extract/css";

import { base_layer } from "../../theme/layers.css.js";

export const amount = style({
  "@layer": {
    [base_layer]: {
      fontVariantNumeric: "tabular-nums",
      textAlign: "end",
    },
  },
});

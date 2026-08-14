import { style } from "@vanilla-extract/css";

import { composite_layer } from "../../theme/layers.css.js";

export const amount = style({
  "@layer": {
    [composite_layer]: {
      fontVariantNumeric: "tabular-nums",
      textAlign: "end",
    },
  },
});

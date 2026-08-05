import { style } from "@vanilla-extract/css";

import { base_layer } from "../../theme/layers.css.js";

export const space = style({
  "@layer": {
    [base_layer]: {
      display: "block",
      flex: "0 0 auto",
    },
  },
});

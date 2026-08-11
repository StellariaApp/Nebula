import { style } from "@vanilla-extract/css";

import { base_layer } from "../../theme/layers.css.js";

export const fixed = style({
  "@layer": {
    [base_layer]: { position: "fixed" },
  },
});

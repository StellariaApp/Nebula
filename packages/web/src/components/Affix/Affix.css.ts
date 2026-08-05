import { style } from "@vanilla-extract/css";

import { base_layer } from "../../theme/layers.css.js";

export const affix = style({
  "@layer": {
    [base_layer]: { position: "fixed" },
  },
});

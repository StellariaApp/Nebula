import { style } from "@vanilla-extract/css";

import { primitive_layer } from "../../theme/layers.css.js";

export const fixed = style({
  "@layer": {
    [primitive_layer]: { position: "fixed" },
  },
});

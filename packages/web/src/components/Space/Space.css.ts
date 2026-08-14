import { style } from "@vanilla-extract/css";

import { primitive_layer } from "../../theme/layers.css.js";

export const space = style({
  "@layer": {
    [primitive_layer]: {
      display: "block",
      flex: "0 0 auto",
    },
  },
});

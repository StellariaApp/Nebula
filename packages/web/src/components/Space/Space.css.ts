import { style } from "@vanilla-extract/css";

import { baseLayer } from "../../theme/layers.css.js";

export const space = style({
  "@layer": {
    [baseLayer]: {
      display: "block",
      flex: "0 0 auto",
    },
  },
});

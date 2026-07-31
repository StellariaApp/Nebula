import { style } from "@vanilla-extract/css";

import { baseLayer } from "../../theme/layers.css.js";

export const affix = style({
  "@layer": {
    [baseLayer]: { position: "fixed" },
  },
});

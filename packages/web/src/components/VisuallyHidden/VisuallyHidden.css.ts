import { style } from "@vanilla-extract/css";

import { HIDDEN } from "../../styles/hidden.js";
import { primitive_layer } from "../../theme/layers.css.js";

export const visually_hidden = style({
  "@layer": {
    [primitive_layer]: HIDDEN,
  },
});

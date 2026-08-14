import { style } from "@vanilla-extract/css";

import { primitive_layer } from "../../theme/layers.css.js";

import * as variables from "./Container.vars.css.js";

export const container = style({
  "@layer": {
    [primitive_layer]: {
      boxSizing: "border-box",
      width: "100%",
      maxWidth: variables.size,
      marginInline: "auto",
    },
  },
});

import { style } from "@vanilla-extract/css";

import { base_layer } from "../../theme/layers.css.js";

import * as variables from "./Container.vars.css.js";

export const container = style({
  "@layer": {
    [base_layer]: {
      boxSizing: "border-box",
      width: "100%",
      maxWidth: variables.size,
      marginInline: "auto",
    },
  },
});

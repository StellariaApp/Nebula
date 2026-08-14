import { style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { primitive_layer } from "../../theme/layers.css.js";

import * as variables from "./Mark.vars.css.js";

export const mark = style({
  "@layer": {
    [primitive_layer]: {
      borderRadius: vars.radius.xs,
      paddingInline: "0.15em",
      background: variables.bg,
      color: variables.fg,
    },
  },
});

import { style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { markBg, markFg } from "./Mark.vars.css.js";

export const mark = style({
  "@layer": {
    [baseLayer]: {
      borderRadius: vars.radius.xs,
      paddingInline: "0.15em",
      background: markBg,
      color: markFg,
    },
  },
});

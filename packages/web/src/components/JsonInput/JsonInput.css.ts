import { style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const editor = style({
  "@layer": {
    [baseLayer]: {
      fontFamily: vars.font.family.mono,
      fontSize: vars.font.size.body3,
      lineHeight: vars.font.lineHeight.relaxed,
      tabSize: 2,
      whiteSpace: "pre",
      overflowWrap: "normal",
      overflowX: "auto",
    },
  },
});

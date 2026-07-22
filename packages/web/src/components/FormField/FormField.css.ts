import { style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export { description, error, label, required, root } from "../../styles/field.css.js";

export const header = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      flexDirection: "column",
    },
  },
});

export const body = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.xs,
    },
  },
});

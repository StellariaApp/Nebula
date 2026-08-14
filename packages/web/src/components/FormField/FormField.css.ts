import { style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { component_layer } from "../../theme/layers.css.js";

export { description, error, label, required, root } from "../../styles/field.css.js";

export const header = style({
  "@layer": {
    [component_layer]: {
      display: "flex",
      flexDirection: "column",
    },
  },
});

export const body = style({
  "@layer": {
    [component_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.xs,
    },
  },
});

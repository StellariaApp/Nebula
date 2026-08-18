import { style } from "@vanilla-extract/css";

import { vars } from "@stellaria/nebula-themes/web";
import { component_layer } from "../../theme/layers.css.js";

export { description, error, label, required, root } from "../../styles/field.css.js";

export const header = style({
  "@layer": {
    [component_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.xxs,
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

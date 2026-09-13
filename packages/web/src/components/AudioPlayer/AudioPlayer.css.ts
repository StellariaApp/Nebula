import { style } from "@vanilla-extract/css";

import { vars } from "@stellaria/nebula-themes/web";

import { composite_layer } from "../../theme/layers.css.js";

export const player = style({
  "@layer": {
    [composite_layer]: {
      alignItems: "center",
      display: "flex",
      gap: vars.space.xs,
      width: "100%",
      minWidth: 0,
    },
  },
});

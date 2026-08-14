import { style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { component_layer } from "../../theme/layers.css.js";

export const root = style({
  "@layer": {
    [component_layer]: { position: "absolute", inset: 0 },
  },
});

export const body = style({
  "@layer": {
    [component_layer]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: vars.space.xs,
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.body3,
      color: vars.color.text.secondary,
    },
  },
});

export const label = style({
  "@layer": {
    [component_layer]: { textAlign: "center" },
  },
});

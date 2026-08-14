import { style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { composite_layer } from "../../theme/layers.css.js";

export const root = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.sm,
      minWidth: 0,
    },
  },
});

export const toolbar = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.sm,
      minWidth: 0,
    },
  },
});

export const search = style({
  "@layer": {
    [composite_layer]: { flex: 1, minWidth: 0 },
  },
});

export const count = style({
  "@layer": {
    [composite_layer]: {
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.body3,
      color: vars.color.text.muted,
    },
  },
});

import { style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

export const root = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.sm,
      minWidth: 0,
    },
  },
});

export const toolbar = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.sm,
      minWidth: 0,
    },
  },
});

export const search = style({
  "@layer": {
    [base_layer]: { flex: 1, minWidth: 0 },
  },
});

export const count = style({
  "@layer": {
    [base_layer]: {
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.body3,
      color: vars.color.text.muted,
    },
  },
});

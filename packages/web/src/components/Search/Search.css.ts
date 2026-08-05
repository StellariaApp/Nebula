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
      width: "100%",
    },
  },
});

export const bar = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.xs,
      flexWrap: "wrap",
      minWidth: 0,
    },
  },
});

export const field = style({
  "@layer": {
    [base_layer]: { flex: 1, minWidth: 180 },
  },
});

export const slot = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.xs,
      flexShrink: 0,
    },
  },
});

import { style } from "@vanilla-extract/css";

import { vars } from "@stellaria/nebula-themes/web";
import { composite_layer } from "../../theme/layers.css.js";

export const root = style({
  "@layer": {
    [composite_layer]: {
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
    [composite_layer]: {
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
    [composite_layer]: { flex: 1, minWidth: 180 },
  },
});

export const slot = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.xs,
      flexShrink: 0,
    },
  },
});

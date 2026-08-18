import { style } from "@vanilla-extract/css";

import { vars } from "@stellaria/nebula-themes/web";
import { composite_layer } from "../../theme/layers.css.js";

export const root = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.xs,
      minWidth: 0,
    },
  },
});

export const content = style({
  "@layer": {
    [composite_layer]: { minWidth: 0 },
  },
});

export const clipped = style({
  "@layer": {
    [composite_layer]: {
      overflow: "hidden",
      maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
      WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
    },
  },
});

export const toggle = style({
  "@layer": {
    [composite_layer]: {
      alignSelf: "flex-start",
      background: "none",
      border: "none",
      padding: 0,
      cursor: "pointer",
      fontSize: vars.font.size.button,
      fontWeight: vars.font.weight.semibold,
    },
  },
});

import { style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const root = style({
  "@layer": {
    [baseLayer]: { display: "flex", flexDirection: "column", gap: vars.space.xs, minWidth: 0 },
  },
});

export const content = style({
  "@layer": {
    [baseLayer]: { minWidth: 0 },
  },
});

export const clipped = style({
  "@layer": {
    [baseLayer]: {
      overflow: "hidden",
      maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
      WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
    },
  },
});

export const toggle = style({
  "@layer": {
    [baseLayer]: {
      alignSelf: "flex-start",
      background: "none",
      border: "none",
      padding: 0,
      cursor: "pointer",
      fontSize: vars.font.size.body3,
    },
  },
});

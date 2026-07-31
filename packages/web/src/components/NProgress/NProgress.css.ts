import { createVar, style } from "@vanilla-extract/css";

import * as motion from "../../styles/motion.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const accent = createVar();
export const thickness = createVar();

export const track = style({
  "@layer": {
    [baseLayer]: {
      position: "fixed",
      insetBlockStart: 0,
      insetInline: 0,
      height: thickness,
      pointerEvents: "none",
    },
  },
});

export const bar = style({
  "@layer": {
    [baseLayer]: {
      height: "100%",
      background: accent,
      transformOrigin: "left center",
      boxShadow: `0 0 8px 0 ${accent}`,
      ...motion.value,
      "@media": {
        "(prefers-reduced-motion: reduce)": motion.still,
      },
    },
  },
});

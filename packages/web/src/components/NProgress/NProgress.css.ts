import { style } from "@vanilla-extract/css";

import * as motion from "../../styles/motion.css.js";
import { base_layer } from "../../theme/layers.css.js";

import { accent, thickness } from "./NProgress.vars.css.js";

export const track = style({
  "@layer": {
    [base_layer]: {
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
    [base_layer]: {
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

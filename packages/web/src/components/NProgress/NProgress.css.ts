import { style } from "@vanilla-extract/css";

import * as motion from "../../styles/motion.css.js";
import { component_layer } from "../../theme/layers.css.js";

import * as variables from "./NProgress.vars.css.js";

export const track = style({
  "@layer": {
    [component_layer]: {
      position: "fixed",
      insetBlockStart: 0,
      insetInline: 0,
      height: variables.thickness,
      pointerEvents: "none",
    },
  },
});

export const bar = style({
  "@layer": {
    [component_layer]: {
      height: "100%",
      background: variables.accent,
      transformOrigin: "left center",
      boxShadow: `0 0 8px 0 ${variables.accent}`,
      ...motion.value,
      "@media": {
        "(prefers-reduced-motion: reduce)": motion.still,
      },
    },
  },
});

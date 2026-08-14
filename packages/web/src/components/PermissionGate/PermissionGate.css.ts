import { style } from "@vanilla-extract/css";

import { component_layer } from "../../theme/layers.css.js";

export const denied = style({
  "@layer": {
    [component_layer]: {
      display: "contents",
    },
  },
});

export const disabled = style({
  "@layer": {
    [component_layer]: {
      opacity: 0.45,
      filter: "grayscale(1)",
      userSelect: "none",
    },
  },
});

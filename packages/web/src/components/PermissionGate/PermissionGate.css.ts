import { style } from "@vanilla-extract/css";

import { baseLayer } from "../../theme/layers.css.js";

export const denied = style({
  "@layer": {
    [baseLayer]: {
      display: "contents",
    },
  },
});

export const disabled = style({
  "@layer": {
    [baseLayer]: {
      opacity: 0.45,
      filter: "grayscale(1)",
      userSelect: "none",
    },
  },
});

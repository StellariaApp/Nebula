import { style } from "@vanilla-extract/css";

import { primitive_layer } from "../../theme/layers.css.js";

export const visually_hidden = style({
  "@layer": {
    [primitive_layer]: {
      position: "absolute",
      width: 1,
      height: 1,
      padding: 0,
      margin: -1,
      overflow: "hidden",
      clip: "rect(0, 0, 0, 0)",
      clipPath: "inset(50%)",
      whiteSpace: "nowrap",
      border: 0,
    },
  },
});

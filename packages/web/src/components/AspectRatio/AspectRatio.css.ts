import { globalStyle, style } from "@vanilla-extract/css";

import { base_layer } from "../../theme/layers.css.js";

import { ratio } from "./AspectRatio.vars.css.js";

export const aspect_ratio = style({
  "@layer": {
    [base_layer]: {
      position: "relative",
      width: "100%",
      aspectRatio: ratio,
    },
  },
});

globalStyle(`${aspect_ratio} > *`, {
  "@layer": {
    [base_layer]: {
      width: "100%",
      height: "100%",
    },
  },
});

globalStyle(`${aspect_ratio} > img, ${aspect_ratio} > video`, {
  "@layer": {
    [base_layer]: { objectFit: "cover" },
  },
});

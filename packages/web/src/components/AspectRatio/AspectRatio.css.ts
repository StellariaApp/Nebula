import { globalStyle, style } from "@vanilla-extract/css";

import { baseLayer } from "../../theme/layers.css.js";

import { ratio } from "./AspectRatio.vars.css.js";

export const aspectRatio = style({
  "@layer": {
    [baseLayer]: {
      position: "relative",
      width: "100%",
      aspectRatio: ratio,
    },
  },
});

globalStyle(`${aspectRatio} > *`, {
  "@layer": {
    [baseLayer]: {
      width: "100%",
      height: "100%",
    },
  },
});

globalStyle(`${aspectRatio} > img, ${aspectRatio} > video`, {
  "@layer": {
    [baseLayer]: { objectFit: "cover" },
  },
});

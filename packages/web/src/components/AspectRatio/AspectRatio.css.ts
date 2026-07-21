import { globalStyle, style } from "@vanilla-extract/css";

import { ratio } from "./AspectRatio.vars.css.js";

export const aspectRatio = style({
  position: "relative",
  width: "100%",
  aspectRatio: ratio,
});

globalStyle(`${aspectRatio} > *`, {
  width: "100%",
  height: "100%",
});

globalStyle(`${aspectRatio} > img, ${aspectRatio} > video`, {
  objectFit: "cover",
});

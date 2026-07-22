import { style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const text = style({
  "@layer": {
    [baseLayer]: {
      margin: 0,
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.body1,
      fontWeight: vars.font.weight.regular,
      lineHeight: vars.font.lineHeight.normal,
      letterSpacing: vars.font.letterSpacing.normal,
      color: vars.color.text.primary,
    },
  },
});

export const truncate = style({
  "@layer": {
    [baseLayer]: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  },
});

export const clamp = style({
  "@layer": {
    [baseLayer]: {
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    },
  },
});

export const inheritStyles = style({
  "@layer": {
    [baseLayer]: {
      fontFamily: "inherit",
      fontSize: "inherit",
      fontWeight: "inherit",
      lineHeight: "inherit",
      color: "inherit",
    },
  },
});

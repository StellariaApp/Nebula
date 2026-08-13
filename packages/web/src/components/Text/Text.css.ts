import { style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

export const nomalize = style({
  "@layer": {
    [base_layer]: {
      margin: 0,
      padding: 0,
      border: 0,
      fontFamily: "inherit",
      fontSize: "inherit",
      fontWeight: "inherit",
      lineHeight: "inherit",
      color: "inherit",
      font: "inherit",
      verticalAlign: "baseline",
    },
  },
});

export const text = style({
  "@layer": {
    [base_layer]: {
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.body1,
      fontWeight: vars.font.weight.regular,
      lineHeight: vars.font.leading.body1,
      letterSpacing: vars.font.letterSpacing.normal,
      color: vars.color.text.primary,
    },
  },
});

export const truncate = style({
  "@layer": {
    [base_layer]: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  },
});

export const clamp = style({
  "@layer": {
    [base_layer]: {
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    },
  },
});

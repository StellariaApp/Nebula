import { globalStyle, style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

import * as variables from "./List.vars.css.js";

export const list = style({
  "@layer": {
    [base_layer]: {
      margin: 0,
      paddingInlineStart: 0,
      color: vars.color.text.primary,
      fontFamily: vars.font.family.sans,
      listStylePosition: "inside",
    },
  },
});

export const with_padding = style({
  "@layer": {
    [base_layer]: {
      paddingInlineStart: vars.space.lg,
      listStylePosition: "outside",
    },
  },
});

export const unstyled = style({
  "@layer": { [base_layer]: { listStyleType: "none", paddingInlineStart: 0 } },
});

export const item = style({});

export const item_with_icon = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      alignItems: "flex-start",
      gap: vars.space.xs,
      listStyleType: "none",
    },
  },
});

export const item_icon = style({
  flexShrink: 0,
  display: "inline-flex",
  alignItems: "center",
});

globalStyle(`${list} > li`, { marginBlockEnd: variables.spacing });
globalStyle(`${list} > li:last-child`, { marginBlockEnd: 0 });

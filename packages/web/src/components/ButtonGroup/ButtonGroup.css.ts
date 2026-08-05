import { globalStyle, style } from "@vanilla-extract/css";

import { base_layer } from "../../theme/layers.css.js";

export const group = style({
  "@layer": {
    [base_layer]: { display: "inline-flex" },
  },
});

export const horizontal = style({
  "@layer": { [base_layer]: { flexDirection: "row" } },
});

export const vertical = style({
  "@layer": { [base_layer]: { flexDirection: "column" } },
});

globalStyle(`${horizontal} > *:not(:last-child)`, {
  "@layer": {
    [base_layer]: {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
  },
});
globalStyle(`${horizontal} > *:not(:first-child)`, {
  "@layer": {
    [base_layer]: {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      marginInlineStart: "-1px",
    },
  },
});

globalStyle(`${vertical} > *:not(:last-child)`, {
  "@layer": {
    [base_layer]: {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
  },
});
globalStyle(`${vertical} > *:not(:first-child)`, {
  "@layer": {
    [base_layer]: {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      marginBlockStart: "-1px",
    },
  },
});

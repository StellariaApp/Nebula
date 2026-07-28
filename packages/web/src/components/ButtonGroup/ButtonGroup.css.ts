import { globalStyle, style } from "@vanilla-extract/css";

import { baseLayer } from "../../theme/layers.css.js";

export const group = style({
  "@layer": {
    [baseLayer]: { display: "inline-flex" },
  },
});

export const horizontal = style({
  "@layer": { [baseLayer]: { flexDirection: "row" } },
});

export const vertical = style({
  "@layer": { [baseLayer]: { flexDirection: "column" } },
});

globalStyle(`${horizontal} > *:not(:last-child)`, {
  "@layer": {
    [baseLayer]: {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
  },
});
globalStyle(`${horizontal} > *:not(:first-child)`, {
  "@layer": {
    [baseLayer]: {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      marginInlineStart: "-1px",
    },
  },
});

globalStyle(`${vertical} > *:not(:last-child)`, {
  "@layer": {
    [baseLayer]: {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
  },
});
globalStyle(`${vertical} > *:not(:first-child)`, {
  "@layer": {
    [baseLayer]: {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      marginBlockStart: "-1px",
    },
  },
});

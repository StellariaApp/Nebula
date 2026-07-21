import { globalStyle, style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { listSpacing } from "./List.vars.css.js";

export const list = style({
  "@layer": {
    [baseLayer]: {
      margin: 0,
      paddingInlineStart: 0,
      color: vars.color.text.primary,
      fontFamily: vars.font.family.sans,
      listStylePosition: "inside",
    },
  },
});

export const withPadding = style({
  "@layer": {
    [baseLayer]: {
      paddingInlineStart: vars.space.lg,
      listStylePosition: "outside",
    },
  },
});

export const unstyled = style({
  "@layer": { [baseLayer]: { listStyleType: "none", paddingInlineStart: 0 } },
});

export const item = style({});

export const itemWithIcon = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      alignItems: "flex-start",
      gap: vars.space.xs,
      listStyleType: "none",
    },
  },
});

export const itemIcon = style({
  flexShrink: 0,
  display: "inline-flex",
  alignItems: "center",
});

globalStyle(`${list} > li`, { marginBlockEnd: listSpacing });
globalStyle(`${list} > li:last-child`, { marginBlockEnd: 0 });

import { globalStyle, style } from "@vanilla-extract/css";

import { baseLayer } from "../../theme/layers.css.js";

import { groupCount, groupGap } from "./Group.vars.css.js";

export const group = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      flexDirection: "row",
      gap: groupGap,
    },
  },
});

export const wrapOn = style({
  "@layer": { [baseLayer]: { flexWrap: "wrap" } },
});

export const wrapOff = style({
  "@layer": { [baseLayer]: { flexWrap: "nowrap" } },
});

globalStyle(`${group}[data-grow="true"] > *`, {
  "@layer": {
    [baseLayer]: {
      flexGrow: 1,
      flexBasis: 0,
    },
  },
});

globalStyle(`${group}[data-grow="true"][data-prevent-overflow="true"] > *`, {
  "@layer": {
    [baseLayer]: {
      maxWidth: `calc((100% - (${groupCount} - 1) * ${groupGap}) / ${groupCount})`,
    },
  },
});

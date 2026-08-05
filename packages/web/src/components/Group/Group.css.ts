import { globalStyle, style } from "@vanilla-extract/css";

import { base_layer } from "../../theme/layers.css.js";

import { groupCount, groupGap } from "./Group.vars.css.js";

export const group = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      flexDirection: "row",
      gap: groupGap,
    },
  },
});

export const wrap_on = style({
  "@layer": { [base_layer]: { flexWrap: "wrap" } },
});

export const wrap_off = style({
  "@layer": { [base_layer]: { flexWrap: "nowrap" } },
});

globalStyle(`${group}[data-grow="true"] > *`, {
  "@layer": {
    [base_layer]: {
      flexGrow: 1,
      flexBasis: 0,
    },
  },
});

globalStyle(`${group}[data-grow="true"][data-prevent-overflow="true"] > *`, {
  "@layer": {
    [base_layer]: {
      maxWidth: `calc((100% - (${groupCount} - 1) * ${groupGap}) / ${groupCount})`,
    },
  },
});

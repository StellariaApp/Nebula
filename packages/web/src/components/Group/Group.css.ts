import { globalStyle, style } from "@vanilla-extract/css";

import { primitive_layer } from "../../theme/layers.css.js";

import * as variables from "./Group.vars.css.js";

export const group = style({
  "@layer": {
    [primitive_layer]: {
      display: "flex",
      flexDirection: "row",
      gap: variables.gap,
    },
  },
});

export const wrap_on = style({
  "@layer": { [primitive_layer]: { flexWrap: "wrap" } },
});

export const wrap_off = style({
  "@layer": { [primitive_layer]: { flexWrap: "nowrap" } },
});

globalStyle(`${group}[data-grow="true"] > *`, {
  "@layer": {
    [primitive_layer]: {
      flexGrow: 1,
      flexBasis: 0,
    },
  },
});

globalStyle(`${group}[data-grow="true"][data-prevent-overflow="true"] > *`, {
  "@layer": {
    [primitive_layer]: {
      maxWidth: `calc((100% - (${variables.count} - 1) * ${variables.gap}) / ${variables.count})`,
    },
  },
});

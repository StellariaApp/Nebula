import { style } from "@vanilla-extract/css";

import { vars } from "../theme/contract.css.js";
import { component_layer } from "../theme/layers.css.js";

export const root = style({
  "@layer": {
    [component_layer]: {
      display: "inline-flex",
      alignItems: "center",
      gap: vars.space.xs,
      minWidth: 0,
      flex: "1 1 auto",
    },
  },
});

export const compact = style({
  "@layer": {
    [component_layer]: {
      flex: "0 0 auto",
      paddingInlineEnd: vars.space.xs,
      marginInlineEnd: vars.space.xs,
      borderInlineEndWidth: 1,
      borderInlineEndStyle: "solid",
      borderInlineEndColor: vars.color.border.subtle,
    },
  },
});

export const input = style({
  "@layer": {
    [component_layer]: {
      minWidth: 0,
      fontVariantNumeric: "tabular-nums",
    },
  },
});

export const input_compact = style({
  "@layer": {
    [component_layer]: {
      width: "5ch",
      flex: "0 0 auto",
    },
  },
});

export const flag = style({
  "@layer": {
    [component_layer]: {
      flexShrink: 0,
      lineHeight: 1,
      fontSize: "1.15em",
    },
  },
});

export const dropdown = style({
  "@layer": {
    [component_layer]: {
      minWidth: 260,
    },
  },
});

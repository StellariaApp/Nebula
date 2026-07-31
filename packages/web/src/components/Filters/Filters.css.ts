import { style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const panel = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.md,
      minWidth: 0,
    },
  },
});

export const list = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.sm,
      minWidth: 0,
    },
  },
});

export const item = style({
  "@layer": {
    [baseLayer]: { minWidth: 0 },
  },
});

export const range = style({
  "@layer": {
    [baseLayer]: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: vars.space.xs,
      alignItems: "end",
    },
  },
});

export const foot = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: vars.space.xs,
      paddingBlockStart: vars.space.xs,
      borderBlockStart: `1px solid ${vars.color.border.subtle}`,
    },
  },
});

export const empty = style({
  "@layer": {
    [baseLayer]: {
      margin: 0,
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.body3,
      color: vars.color.text.muted,
    },
  },
});

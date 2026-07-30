import { style, styleVariants } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const root = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      flexDirection: "column",
      minWidth: 0,
    },
  },
});

export const list = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      flexDirection: "column",
      listStyle: "none",
      margin: 0,
      padding: 0,
      minWidth: 0,
    },
  },
});

export const gap = styleVariants({
  none: { gap: vars.space.none },
  xs: { gap: vars.space.xxs },
  sm: { gap: vars.space.xs },
  md: { gap: vars.space.sm },
  lg: { gap: vars.space.md },
});

export const item = style({
  "@layer": {
    [baseLayer]: { minWidth: 0 },
  },
});

export const foot = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: vars.space.xs,
      paddingBlock: vars.space.md,
    },
  },
});

export const end = style({
  "@layer": {
    [baseLayer]: {
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.body3,
      color: vars.color.text.muted,
    },
  },
});

export const live = style({
  "@layer": {
    [baseLayer]: {
      position: "absolute",
      width: 1,
      height: 1,
      margin: -1,
      padding: 0,
      overflow: "hidden",
      clipPath: "inset(50%)",
      whiteSpace: "nowrap",
      border: 0,
    },
  },
});

export const sentinel = style({
  "@layer": {
    [baseLayer]: { height: 1, width: "100%", flexShrink: 0 },
  },
});

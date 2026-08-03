import { globalStyle, style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const header = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: vars.space.sm,
      minWidth: 0,
    },
  },
});

export const heading = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.xxs,
      minWidth: 0,
      flex: 1,
    },
  },
});

export const title = style({
  "@layer": {
    [baseLayer]: {
      margin: 0,
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.body1,
      fontWeight: vars.font.weight.semibold,
      lineHeight: vars.font.lineHeight.tight,
      color: vars.color.text.primary,
    },
  },
});

export const description = style({
  "@layer": {
    [baseLayer]: {
      margin: 0,
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.body2,
      lineHeight: vars.font.lineHeight.relaxed,
      color: vars.color.text.secondary,
      overflow: "hidden",
    },
  },
});

export const mediaWrap = style({
  "@layer": {
    [baseLayer]: { position: "relative" },
  },
});

export const mediaActions = style({
  "@layer": {
    [baseLayer]: {
      position: "absolute",
      insetBlockStart: vars.space.xs,
      insetInlineEnd: vars.space.xs,
      display: "flex",
      gap: vars.space.xxs,
    },
  },
});

export const slotRow = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.xxs,
      flexShrink: 0,
    },
  },
});

export const badgeRow = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.xxs,
      minWidth: 0,
      selectors: {
        "&[data-wrap='true']": { flexWrap: "wrap" },
      },
    },
  },
});

globalStyle(`${badgeRow}[data-grow='true'] > *`, {
  "@layer": {
    [baseLayer]: { flex: 1 },
  },
});

export const body = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.sm,
      minWidth: 0,
    },
  },
});

export const foot = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: vars.space.sm,
      flexWrap: "wrap",
      minWidth: 0,
    },
  },
});

export const metaRow = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.sm,
      flexWrap: "wrap",
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.caption,
      color: vars.color.text.muted,
    },
  },
});

export const person = style({
  "@layer": {
    [baseLayer]: {
      display: "inline-flex",
      alignItems: "center",
      gap: vars.space.xxs,
    },
  },
});

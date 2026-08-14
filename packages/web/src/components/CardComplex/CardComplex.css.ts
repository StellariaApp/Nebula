import { globalStyle, style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { composite_layer } from "../../theme/layers.css.js";

export const header = style({
  "@layer": {
    [composite_layer]: {
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
    [composite_layer]: {
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
    [composite_layer]: {
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
    [composite_layer]: {
      margin: 0,
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.body2,
      lineHeight: vars.font.lineHeight.relaxed,
      color: vars.color.text.secondary,
      overflow: "hidden",
    },
  },
});

export const media_wrap = style({
  "@layer": {
    [composite_layer]: { position: "relative" },
  },
});

export const media_actions = style({
  "@layer": {
    [composite_layer]: {
      position: "absolute",
      insetBlockStart: vars.space.xs,
      insetInlineEnd: vars.space.xs,
      display: "flex",
      gap: vars.space.xxs,
    },
  },
});

export const slot_row = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.xxs,
      flexShrink: 0,
    },
  },
});

export const badge_row = style({
  "@layer": {
    [composite_layer]: {
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

globalStyle(`${badge_row}[data-grow='true'] > *`, {
  "@layer": {
    [composite_layer]: { flex: 1 },
  },
});

export const body = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.sm,
      minWidth: 0,
    },
  },
});

export const foot = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: vars.space.sm,
      flexWrap: "wrap",
      minWidth: 0,
    },
  },
});

export const meta_row = style({
  "@layer": {
    [composite_layer]: {
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
    [composite_layer]: {
      display: "inline-flex",
      alignItems: "center",
      gap: vars.space.xxs,
    },
  },
});

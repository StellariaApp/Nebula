import { globalStyle, style } from "@vanilla-extract/css";

import { vars } from "../theme/contract.css.js";
import { baseLayer } from "../theme/layers.css.js";

export const listbox = style({
  "@layer": {
    [baseLayer]: {
      boxSizing: "border-box",
      listStyle: "none",
      margin: 0,
      padding: vars.space.xxs,
      maxHeight: "min(50vh, 18rem)",
      overflowY: "auto",
      outline: "none",
    },
  },
});

export const option = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.sm,
      paddingInline: vars.space.sm,
      paddingBlock: vars.space.xs,
      borderRadius: vars.radius.sm,
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.body3,
      lineHeight: vars.font.lineHeight.normal,
      color: vars.color.text.primary,
      cursor: "pointer",
      outline: "none",
      minHeight: vars.size.compact.lg,
      selectors: {
        "&[data-focused='true']": {
          background: vars.color.primary["600"],
          color: vars.color.text.onPrimary,
        },
        "&[data-selected='true']": { fontWeight: vars.font.weight.semibold },
        "&[data-disabled='true']": { color: vars.color.text.muted, cursor: "default" },
      },
    },
  },
});

export const icon = style({
  display: "inline-flex",
  alignItems: "center",
  flexShrink: 0,
});

export const labels = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.xxs,
  flex: 1,
  minWidth: 0,
});

export const description = style({
  "@layer": {
    [baseLayer]: {
      fontSize: vars.font.size.caption,
      color: vars.color.text.secondary,
    },
  },
});

export const check = style({
  "@layer": {
    [baseLayer]: {
      marginInlineStart: "auto",
      flexShrink: 0,
      color: vars.color.primary["600"],
      fontSize: vars.font.size.body3,
    },
  },
});

export const empty = style({
  "@layer": {
    [baseLayer]: {
      paddingInline: vars.space.sm,
      paddingBlock: vars.space.sm,
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.body3,
      color: vars.color.text.secondary,
    },
  },
});

globalStyle(`${option}[data-focused='true'] ${description}`, {
  "@layer": { [baseLayer]: { color: "inherit" } },
});

globalStyle(`${option}[data-focused='true'] ${check}`, {
  "@layer": { [baseLayer]: { color: "inherit" } },
});

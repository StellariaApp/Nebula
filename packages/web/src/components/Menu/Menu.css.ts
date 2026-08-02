import { globalStyle, style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const menu = style({
  "@layer": {
    [baseLayer]: {
      boxSizing: "border-box",
      listStyle: "none",
      margin: 0,
      padding: vars.space.xxs,
      background: vars.color.surface.overlay,
      color: vars.color.text.primary,
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: vars.color.border.default,
      borderRadius: vars.radius.md,
      boxShadow: vars.shadow.lg,
      zIndex: vars.zIndex.dropdown,
      minWidth: "12rem",
      maxHeight: "min(60vh, 24rem)",
      overflowY: "auto",
      outline: "none",
    },
  },
});

export const item = style({
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
      fontWeight: vars.font.weight.medium,
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
        "&[data-disabled='true']": {
          color: vars.color.text.muted,
          cursor: "default",
        },
        "&[data-danger='true']": { color: vars.color.semantic.error["600"] },
        "&[data-danger='true'][data-focused='true']": {
          background: vars.color.semantic.error["600"],
          color: vars.color.text.onPrimary,
        },
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

export const shortcut = style({
  "@layer": {
    [baseLayer]: {
      marginInlineStart: "auto",
      paddingInlineStart: vars.space.md,
      fontFamily: vars.font.family.mono,
      fontSize: vars.font.size.caption,
      color: vars.color.text.muted,
    },
  },
});

globalStyle(`${item}[data-focused='true'] ${description}`, {
  "@layer": { [baseLayer]: { color: "inherit" } },
});

globalStyle(`${item}[data-focused='true'] ${shortcut}`, {
  "@layer": { [baseLayer]: { color: "inherit" } },
});

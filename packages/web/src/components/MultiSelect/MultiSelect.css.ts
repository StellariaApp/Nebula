import { globalStyle, style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const control = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: vars.space.xxs,
      flex: 1,
      minWidth: 0,
      paddingBlock: vars.space.xxs,
    },
  },
});

export const chip = style({
  "@layer": {
    [baseLayer]: {
      display: "inline-flex",
      alignItems: "center",
      gap: vars.space.xxs,
      paddingInlineStart: vars.space.xs,
      paddingInlineEnd: vars.space.xxs,
      paddingBlock: "2px",
      borderRadius: vars.radius.sm,
      background: vars.color.primary["100"],
      color: vars.color.primary["900"],
      fontSize: vars.font.size.caption,
      lineHeight: vars.font.lineHeight.tight,
      maxWidth: "100%",
    },
  },
});

globalStyle(`[data-disabled="true"] ${chip}`, {
  "@layer": {
    [baseLayer]: {
      background: vars.color.surface.raised,
      color: vars.color.text.secondary,
    },
  },
});

export const chipLabel = style({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const chipRemove = style({
  "@layer": {
    [baseLayer]: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: vars.space.md,
      height: vars.space.md,
      borderRadius: vars.radius.full,
      color: "inherit",
      flexShrink: 0,
      selectors: {
        "&[data-hovered='true']": { background: vars.color.primary["200"] },
      },
    },
  },
});

export const search = style({
  "@layer": {
    [baseLayer]: {
      flex: 1,
      minWidth: "6ch",
      appearance: "none",
      border: "none",
      outline: "none",
      background: "transparent",
      color: "inherit",
      font: "inherit",
      padding: 0,
      selectors: {
        "&::placeholder": { color: vars.color.text.placeholder },
      },
    },
  },
});

export const placeholder = style({
  "@layer": { [baseLayer]: { color: vars.color.text.muted } },
});

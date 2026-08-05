import { style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

import { scrollHeight } from "./CodeHighlight.vars.css.js";

export const root = style({
  "@layer": {
    [base_layer]: {
      position: "relative",
      boxSizing: "border-box",
      borderRadius: vars.radius.md,
      border: `1px solid ${vars.color.border.subtle}`,
      background: vars.color.surface.sunken,
      overflow: "hidden",
    },
  },
});

export const header = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: vars.space.sm,
      padding: `${vars.space.xxs} ${vars.space.xs}`,
      borderBottom: `1px solid ${vars.color.border.subtle}`,
      background: vars.color.surface.base,
      fontSize: vars.font.size.caption,
      color: vars.color.text.muted,
      fontFamily: vars.font.family.mono,
    },
  },
});

export const floating_copy = style({
  "@layer": {
    [base_layer]: {
      position: "absolute",
      insetBlockStart: vars.space.xxs,
      insetInlineEnd: vars.space.xxs,
      zIndex: 1,
    },
  },
});

export const scroll = style({
  "@layer": {
    [base_layer]: {
      maxHeight: scrollHeight,
      overflow: "auto",
    },
  },
});

export const pre = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      margin: 0,
      padding: 0,
      fontFamily: vars.font.family.mono,
      fontSize: vars.font.size.body3,
      lineHeight: vars.font.lineHeight.relaxed,
      color: vars.color.text.primary,
      direction: "ltr",
      textAlign: "left",
    },
  },
});

export const gutter = style({
  "@layer": {
    [base_layer]: {
      flex: "0 0 auto",
      padding: `${vars.space.sm} ${vars.space.xs}`,
      borderInlineEnd: `1px solid ${vars.color.border.subtle}`,
      color: vars.color.text.muted,
      textAlign: "right",
      userSelect: "none",
      fontVariantNumeric: "tabular-nums",
      whiteSpace: "pre",
    },
  },
});

export const source = style({
  "@layer": {
    [base_layer]: {
      flex: 1,
      minWidth: 0,
      padding: vars.space.sm,
      whiteSpace: "pre",
      fontFamily: "inherit",
      fontSize: "inherit",
      lineHeight: "inherit",
    },
  },
});

export const tab_list = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.xxs,
      padding: `${vars.space.xxs} ${vars.space.xs}`,
      borderBottom: `1px solid ${vars.color.border.subtle}`,
      background: vars.color.surface.base,
      overflowX: "auto",
    },
  },
});

export const bare = style({
  "@layer": {
    [base_layer]: { border: "none", borderRadius: 0, background: "transparent" },
  },
});

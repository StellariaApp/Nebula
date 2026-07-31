import { style } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const root = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.sm,
      minWidth: 0,
      width: "100%",
      fontFamily: vars.font.family.sans,
    },
  },
});

export const scroller = style({
  "@layer": {
    [baseLayer]: {
      position: "relative",
      overflow: "auto",
      minWidth: 0,
      border: `1px solid ${vars.color.border.subtle}`,
      borderRadius: vars.radius.md,
    },
  },
});

export const table = style({
  "@layer": {
    [baseLayer]: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: 0,
      fontSize: vars.font.size.body3,
      color: vars.color.text.primary,
    },
  },
});

export const caption = style({
  "@layer": {
    [baseLayer]: {
      captionSide: "top",
      textAlign: "start",
      paddingBlockEnd: vars.space.xs,
      fontSize: vars.font.size.body3,
      color: vars.color.text.secondary,
    },
  },
});

export const head = style({
  "@layer": {
    [baseLayer]: {
      position: "sticky",
      insetBlockStart: 0,
      zIndex: 1,
      background: vars.color.surface.sunken,
    },
  },
});

export const th = style({
  "@layer": {
    [baseLayer]: {
      textAlign: "start",
      whiteSpace: "nowrap",
      paddingInline: vars.space.sm,
      paddingBlock: vars.space.xs,
      fontWeight: vars.font.weight.semibold,
      color: vars.color.text.primary,
      borderBlockEnd: `1px solid ${vars.color.border.default}`,
    },
  },
});

export const sortButton = style({
  "@layer": {
    [baseLayer]: {
      display: "inline-flex",
      alignItems: "center",
      gap: vars.space.xxs,
      background: "none",
      border: 0,
      padding: 0,
      margin: 0,
      font: "inherit",
      color: "inherit",
      cursor: "pointer",
      selectors: { "&:focus-visible": { ...focus.ring } },
    },
  },
});

export const sortIcon = style({
  "@layer": {
    [baseLayer]: { fontSize: "0.75em", color: vars.color.text.muted, lineHeight: 0 },
  },
});

export const td = style({
  "@layer": {
    [baseLayer]: {
      paddingInline: vars.space.sm,
      paddingBlock: vars.space.xs,
      borderBlockEnd: `1px solid ${vars.color.border.subtle}`,
      verticalAlign: "middle",
    },
  },
});

export const row = style({
  "@layer": {
    [baseLayer]: {
      selectors: {
        "&[data-selected='true']": { background: vars.color.surface.active },
        "&[data-clickable='true']": { cursor: "pointer" },
        "&[data-clickable='true']:hover": { background: vars.color.surface.hover },
        "&:focus-visible": { ...focus.ring },
      },
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
    },
  },
});

export const status = style({
  "@layer": {
    [baseLayer]: {
      margin: 0,
      fontSize: vars.font.size.body3,
      color: vars.color.text.muted,
    },
  },
});

export const empty = style({
  "@layer": {
    [baseLayer]: {
      padding: vars.space.xxl,
      textAlign: "center",
      color: vars.color.text.muted,
    },
  },
});

export const spacer = style({
  "@layer": {
    [baseLayer]: { padding: 0, border: 0 },
  },
});

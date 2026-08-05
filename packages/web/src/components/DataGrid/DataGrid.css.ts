import { style } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

export const root = style({
  "@layer": {
    [base_layer]: {
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
    [base_layer]: {
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
    [base_layer]: {
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
    [base_layer]: {
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
    [base_layer]: {
      position: "sticky",
      insetBlockStart: 0,
      zIndex: 1,
      background: vars.color.surface.sunken,
    },
  },
});

export const th = style({
  "@layer": {
    [base_layer]: {
      position: "relative",
      textAlign: "start",
      whiteSpace: "nowrap",
      padding: vars.space.sm,
      fontWeight: vars.font.weight.semibold,
      color: vars.color.text.primary,
      borderBlockEnd: `1px solid ${vars.color.border.default}`,
    },
  },
});

export const sort_button = style({
  "@layer": {
    [base_layer]: {
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

export const sort_icon = style({
  "@layer": {
    [base_layer]: { fontSize: "0.75em", color: vars.color.text.muted, lineHeight: 0 },
  },
});

export const td = style({
  "@layer": {
    [base_layer]: {
      paddingInline: vars.space.sm,
      paddingBlock: vars.space.xs,
      borderBlockEnd: `1px solid ${vars.color.border.subtle}`,
      verticalAlign: "middle",
    },
  },
});

export const row = style({
  "@layer": {
    [base_layer]: {
      background: vars.color.surface.raised,
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
    [base_layer]: {
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
    [base_layer]: {
      margin: 0,
      fontSize: vars.font.size.body3,
      color: vars.color.text.muted,
    },
  },
});

export const empty = style({
  "@layer": {
    [base_layer]: {
      padding: vars.space.xxl,
      textAlign: "center",
      color: vars.color.text.muted,
    },
  },
});

export const spacer = style({
  "@layer": {
    [base_layer]: { padding: 0, border: 0 },
  },
});

export const toolbar = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: vars.space.sm,
      padding: vars.space.sm,
      borderBottom: `1px solid ${vars.color.border.subtle}`,
      background: vars.color.surface.sunken,
    },
  },
});

export const toolbar_search = style({
  "@layer": {
    [base_layer]: { flex: "1 1 220px", minWidth: 180 },
  },
});

export const toolbar_gap = style({
  "@layer": {
    [base_layer]: {
      marginInlineStart: "auto",
      display: "flex",
      alignItems: "center",
      gap: vars.space.xxs,
    },
  },
});

export const chips = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: vars.space.xxs,
      width: "100%",
    },
  },
});

export const bulk_bar = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: vars.space.xs,
      width: "100%",
      padding: vars.space.xs,
      borderRadius: vars.radius.sm,
      background: vars.color.surface.hover,
    },
  },
});

export const bulk_count = style({
  "@layer": {
    [base_layer]: {
      margin: 0,
      fontSize: vars.font.size.body3,
      fontWeight: vars.font.weight.medium,
      color: vars.color.text.secondary,
    },
  },
});

export const panel = style({
  "@layer": {
    [base_layer]: {
      padding: vars.space.sm,
      borderBottom: `1px solid ${vars.color.border.subtle}`,
      background: vars.color.surface.raised,
    },
  },
});

export const head_cell = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.xxs,
      minWidth: 0,
    },
  },
});

export const resizer = style({
  "@layer": {
    [base_layer]: {
      position: "absolute",
      insetBlock: 0,
      insetInlineEnd: 0,
      width: 8,
      padding: 0,
      border: "none",
      background: "transparent",
      cursor: "col-resize",
      touchAction: "none",
      selectors: {
        "&::after": {
          content: "",
          position: "absolute",
          insetBlock: 6,
          insetInlineEnd: 3,
          width: 2,
          borderRadius: 1,
          background: vars.color.border.subtle,
        },
        "&:hover::after, &[data-resizing='true']::after": {
          background: vars.color.border.focus,
        },
        "&:focus-visible": { ...focus.ring },
      },
    },
  },
});

export const cell_focus = style({
  "@layer": {
    [base_layer]: {
      selectors: {
        "&:focus-visible": { ...focus.ring, outlineOffset: "-2px" },
      },
    },
  },
});

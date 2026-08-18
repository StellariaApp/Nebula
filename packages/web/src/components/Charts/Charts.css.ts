import { globalStyle, style, styleVariants } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import { vars } from "@stellaria/nebula-themes/web";
import { component_layer } from "../../theme/layers.css.js";

import * as variables from "./Charts.vars.css.js";

export const root = style({
  "@layer": {
    [component_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.xs,
      margin: 0,
      minWidth: 0,
      width: "100%",
      fontFamily: vars.font.family.sans,
    },
  },
});

export const title = style({
  "@layer": {
    [component_layer]: {
      fontSize: vars.font.size.body2,
      fontWeight: vars.font.weight.semibold,
      color: vars.color.text.primary,
    },
  },
});

export const canvas = style({
  "@layer": {
    [component_layer]: { width: "100%", minWidth: 0 },
  },
});

export const summary = style({
  "@layer": {
    [component_layer]: {
      margin: 0,
      fontSize: vars.font.size.body3,
      color: vars.color.text.secondary,
    },
  },
});

export const details = style({
  "@layer": {
    [component_layer]: { fontSize: vars.font.size.body3 },
  },
});

export const details_summary = style({
  "@layer": {
    [component_layer]: {
      cursor: "pointer",
      color: vars.color.text.secondary,
      paddingBlock: vars.space.xxs,
    },
  },
});

export const table_wrap = style({
  "@layer": {
    [component_layer]: { overflowX: "auto", maxHeight: 280, overflowY: "auto" },
  },
});

export const table = style({
  "@layer": {
    [component_layer]: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: vars.font.size.caption,
      color: vars.color.text.secondary,
    },
  },
});

globalStyle(`${table} th, ${table} td`, {
  "@layer": {
    [component_layer]: {
      textAlign: "start",
      padding: vars.space.xxs,
      borderBlockEnd: `1px solid ${vars.color.border.subtle}`,
      whiteSpace: "nowrap",
    },
  },
});

globalStyle(`${table} th`, {
  "@layer": {
    [component_layer]: {
      color: vars.color.text.primary,
      fontWeight: vars.font.weight.semibold,
    },
  },
});

export const spark = style({
  "@layer": {
    [component_layer]: { display: "inline-block", verticalAlign: "middle", lineHeight: 0 },
  },
});

export const trend = style({
  "@layer": {
    [component_layer]: {
      display: "inline-flex",
      alignItems: "center",
      gap: vars.space.xxs,
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.body3,
      fontWeight: vars.font.weight.medium,
      fontVariantNumeric: "tabular-nums",
      color: vars.color.text.primary,
    },
  },
});

export const arrow = style({
  "@layer": {
    [component_layer]: {
      lineHeight: 0,
      fontSize: "0.85em",
      selectors: {
        "[data-direction='up'] &": { color: vars.color.semantic.success["600"] },
        "[data-direction='down'] &": { color: vars.color.semantic.error["600"] },
        "[data-direction='flat'] &": { color: vars.color.text.muted },
      },
    },
  },
});

export const legend = style({
  "@layer": {
    [component_layer]: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: vars.space.sm,
      margin: 0,
      padding: 0,
      listStyle: "none",
    },
  },
});

export const legend_item = style({
  "@layer": {
    [component_layer]: {
      display: "inline-flex",
      alignItems: "center",
      gap: vars.space.xxs,
      padding: 0,
      border: "none",
      background: "transparent",
      color: vars.color.text.secondary,
      fontSize: vars.font.size.caption,
      cursor: "default",
      selectors: {
        "&[data-interactive='true']": { cursor: "pointer" },
        "&[aria-pressed='true']": { color: vars.color.text.muted, opacity: 0.55 },
        "&:focus-visible": { ...focus.ring },
      },
    },
  },
});

export const swatch = style({
  "@layer": {
    [component_layer]: {
      width: 10,
      height: 10,
      borderRadius: vars.radius.xxs,
      background: variables.swatchColor,
      flex: "0 0 auto",
    },
  },
});

export const tooltip = style({
  "@layer": {
    [component_layer]: {
      minWidth: 140,
      padding: vars.space.xs,
      borderRadius: vars.radius.md,
      border: `1px solid ${vars.color.border.default}`,
      background: vars.color.surface.overlay,
      boxShadow: vars.shadow.md,
      fontSize: vars.font.size.caption,
      color: vars.color.text.primary,
    },
  },
});

export const tooltip_title = style({
  "@layer": {
    [component_layer]: {
      margin: 0,
      marginBlockEnd: vars.space.xxs,
      fontWeight: vars.font.weight.semibold,
      color: vars.color.text.secondary,
    },
  },
});

export const tooltip_row = style({
  "@layer": {
    [component_layer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.xxs,
      justifyContent: "space-between",
    },
  },
});

export const tooltip_value = style({
  "@layer": {
    [component_layer]: {
      marginInlineStart: "auto",
      fontVariantNumeric: "tabular-nums",
      fontWeight: vars.font.weight.medium,
    },
  },
});

export const panel_grid = style({
  "@layer": {
    [component_layer]: {
      display: "grid",
      gridTemplateColumns: `repeat(${variables.panelCols}, minmax(0, 1fr))`,
      "@media": {
        "(max-width: 720px)": { gridTemplateColumns: "1fr" },
      },
    },
  },
});

export const panel_gap = styleVariants({
  sm: { gap: vars.space.sm },
  md: { gap: vars.space.md },
  lg: { gap: vars.space.lg },
});

export const panel_span = styleVariants({
  1: { gridColumn: "span 1" },
  2: { gridColumn: "span 2" },
  3: { gridColumn: "span 3" },
});

export const panel_card = style({
  "@layer": {
    [component_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.xs,
      minWidth: 0,
      padding: vars.space.md,
      borderRadius: vars.radius.lg,
      border: `1px solid ${vars.color.border.subtle}`,
      background: vars.color.surface.raised,
    },
  },
});

export const panel_head = style({
  "@layer": {
    [component_layer]: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: vars.space.sm,
    },
  },
});

export const panel_title = style({
  "@layer": {
    [component_layer]: {
      margin: 0,
      fontSize: vars.font.size.body2,
      fontWeight: vars.font.weight.semibold,
      color: vars.color.text.primary,
    },
  },
});

export const panel_description = style({
  "@layer": {
    [component_layer]: {
      margin: 0,
      fontSize: vars.font.size.body3,
      color: vars.color.text.secondary,
    },
  },
});

import { createVar, globalStyle, style, styleVariants } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const swatchColor = createVar();
export const panelCols = createVar();

export const root = style({
  "@layer": {
    [baseLayer]: {
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
    [baseLayer]: {
      fontSize: vars.font.size.body2,
      fontWeight: vars.font.weight.semibold,
      color: vars.color.text.primary,
    },
  },
});

export const canvas = style({
  "@layer": {
    [baseLayer]: { width: "100%", minWidth: 0 },
  },
});

export const summary = style({
  "@layer": {
    [baseLayer]: {
      margin: 0,
      fontSize: vars.font.size.body3,
      color: vars.color.text.secondary,
    },
  },
});

export const details = style({
  "@layer": {
    [baseLayer]: { fontSize: vars.font.size.body3 },
  },
});

export const detailsSummary = style({
  "@layer": {
    [baseLayer]: {
      cursor: "pointer",
      color: vars.color.text.secondary,
      paddingBlock: vars.space.xxs,
    },
  },
});

export const tableWrap = style({
  "@layer": {
    [baseLayer]: { overflowX: "auto", maxHeight: 280, overflowY: "auto" },
  },
});

export const table = style({
  "@layer": {
    [baseLayer]: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: vars.font.size.caption,
      color: vars.color.text.secondary,
    },
  },
});

globalStyle(`${table} th, ${table} td`, {
  "@layer": {
    [baseLayer]: {
      textAlign: "start",
      padding: vars.space.xxs,
      borderBlockEnd: `1px solid ${vars.color.border.subtle}`,
      whiteSpace: "nowrap",
    },
  },
});

globalStyle(`${table} th`, {
  "@layer": {
    [baseLayer]: {
      color: vars.color.text.primary,
      fontWeight: vars.font.weight.semibold,
    },
  },
});

export const spark = style({
  "@layer": {
    [baseLayer]: { display: "inline-block", verticalAlign: "middle", lineHeight: 0 },
  },
});

export const trend = style({
  "@layer": {
    [baseLayer]: {
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
    [baseLayer]: {
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
    [baseLayer]: {
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

export const legendItem = style({
  "@layer": {
    [baseLayer]: {
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
    [baseLayer]: {
      width: 10,
      height: 10,
      borderRadius: vars.radius.xxs,
      background: swatchColor,
      flex: "0 0 auto",
    },
  },
});

export const tooltip = style({
  "@layer": {
    [baseLayer]: {
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

export const tooltipTitle = style({
  "@layer": {
    [baseLayer]: {
      margin: 0,
      marginBlockEnd: vars.space.xxs,
      fontWeight: vars.font.weight.semibold,
      color: vars.color.text.secondary,
    },
  },
});

export const tooltipRow = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.xxs,
      justifyContent: "space-between",
    },
  },
});

export const tooltipValue = style({
  "@layer": {
    [baseLayer]: {
      marginInlineStart: "auto",
      fontVariantNumeric: "tabular-nums",
      fontWeight: vars.font.weight.medium,
    },
  },
});

export const panelGrid = style({
  "@layer": {
    [baseLayer]: {
      display: "grid",
      gridTemplateColumns: `repeat(${panelCols}, minmax(0, 1fr))`,
      "@media": {
        "(max-width: 720px)": { gridTemplateColumns: "1fr" },
      },
    },
  },
});

export const panelGap = styleVariants({
  sm: { gap: vars.space.sm },
  md: { gap: vars.space.md },
  lg: { gap: vars.space.lg },
});

export const panelSpan = styleVariants({
  1: { gridColumn: "span 1" },
  2: { gridColumn: "span 2" },
  3: { gridColumn: "span 3" },
});

export const panelCard = style({
  "@layer": {
    [baseLayer]: {
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

export const panelHead = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: vars.space.sm,
    },
  },
});

export const panelTitle = style({
  "@layer": {
    [baseLayer]: {
      margin: 0,
      fontSize: vars.font.size.body2,
      fontWeight: vars.font.weight.semibold,
      color: vars.color.text.primary,
    },
  },
});

export const panelDescription = style({
  "@layer": {
    [baseLayer]: {
      margin: 0,
      fontSize: vars.font.size.body3,
      color: vars.color.text.secondary,
    },
  },
});

import { globalStyle, style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

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

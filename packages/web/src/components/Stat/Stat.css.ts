import { style, styleVariants } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { component_layer } from "../../theme/layers.css.js";

export const root = style({
  "@layer": {
    [component_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.xs,
      minWidth: 0,
      fontFamily: vars.font.family.sans,
    },
  },
});

export const align = styleVariants({
  start: { alignItems: "flex-start", textAlign: "start" },
  center: { alignItems: "center", textAlign: "center" },
  end: { alignItems: "flex-end", textAlign: "end" },
});

export const head = style({
  "@layer": {
    [component_layer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.xs,
      minWidth: 0,
    },
  },
});

export const label = style({
  "@layer": {
    [component_layer]: {
      fontSize: vars.font.size.caption,
      fontWeight: vars.font.weight.medium,
      textTransform: "uppercase",
      letterSpacing: vars.font.letterSpacing.wide,
      color: vars.color.text.muted,
    },
  },
});

export const icon = style({
  "@layer": {
    [component_layer]: { display: "inline-flex", lineHeight: 0, color: vars.color.text.muted },
  },
});

export const value = style({
  "@layer": {
    [component_layer]: {
      fontWeight: vars.font.weight.bold,
      fontVariantNumeric: "tabular-nums",
      lineHeight: vars.font.lineHeight.tight,
      color: vars.color.text.primary,
    },
  },
});

export const foot = style({
  "@layer": {
    [component_layer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.xs,
      flexWrap: "wrap",
      fontSize: vars.font.size.caption,
    },
  },
});

export const diff = style({
  "@layer": {
    [component_layer]: {
      display: "inline-flex",
      alignItems: "center",
      gap: 2,
      fontWeight: vars.font.weight.medium,
      fontVariantNumeric: "tabular-nums",
      color: vars.color.text.primary,
    },
  },
});

export const arrow = style({
  "@layer": {
    [component_layer]: {
      selectors: {
        "[data-trend='up'] &": { color: vars.color.semantic.success["600"] },
        "[data-trend='down'] &": { color: vars.color.semantic.error["600"] },
        "[data-trend='flat'] &": { color: vars.color.text.muted },
      },
    },
  },
});

export const description = style({
  "@layer": {
    [component_layer]: { color: vars.color.text.muted },
  },
});

export const size = styleVariants({
  xs: { fontSize: vars.font.size.body2 },
  sm: { fontSize: vars.font.size.body1 },
  md: { fontSize: vars.font.size.h4 },
  lg: { fontSize: vars.font.size.h3 },
  xl: { fontSize: vars.font.size.h2 },
});

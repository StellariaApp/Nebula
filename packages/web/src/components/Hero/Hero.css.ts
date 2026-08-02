import { fallbackVar, style, styleVariants } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import {
  backdropFilter,
  bg,
  borderColor,
  borderWidth,
  contentMax,
  fg,
  veil,
} from "./Hero.vars.css.js";

export const hero = style({
  "@layer": {
    [baseLayer]: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: vars.space.md,
      boxSizing: "border-box",
      width: "100%",
      overflow: "hidden",
      borderStyle: "solid",
      borderWidth,
      borderColor,
      background: bg,
      color: fg,
      backdropFilter,
      fontFamily: vars.font.family.sans,
      selectors: {
        "&[data-align='center']": { justifyContent: "center", textAlign: "center" },
      },
    },
  },
});

export const media = style({
  "@layer": {
    [baseLayer]: {
      position: "absolute",
      inset: 0,
      zIndex: 0,
      objectFit: "cover",
      width: "100%",
      height: "100%",
    },
  },
});

export const scrim = style({
  "@layer": {
    [baseLayer]: {
      position: "absolute",
      inset: 0,
      zIndex: 0,
      background: veil,
    },
  },
});

export const body = style({
  "@layer": {
    [baseLayer]: {
      position: "relative",
      zIndex: 1,
      display: "flex",
      flexDirection: "column",
      gap: vars.space.md,
      minWidth: 0,
      flex: 1,
      boxSizing: "border-box",
      maxWidth: fallbackVar(contentMax, "none"),
      marginInline: "auto",
    },
  },
});

export const slot = style({
  "@layer": {
    [baseLayer]: { position: "relative", zIndex: 1, flexShrink: 0 },
  },
});

export const hiper = style({
  "@layer": {
    [baseLayer]: {
      margin: 0,
      fontSize: vars.font.size.caption,
      fontWeight: vars.font.weight.semibold,
      textTransform: "uppercase",
      letterSpacing: vars.font.letterSpacing.wide,
    },
  },
});

export const header = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.sm,
    },
  },
});

export const title = style({
  "@layer": {
    [baseLayer]: {
      margin: 0,
      fontWeight: vars.font.weight.bold,
      lineHeight: vars.font.lineHeight.tight,
    },
  },
});

export const subtitle = style({
  "@layer": {
    [baseLayer]: {
      margin: 0,
      fontSize: vars.font.size.body1,
    },
  },
});

export const description = style({
  "@layer": {
    [baseLayer]: {
      margin: 0,
      maxWidth: "62ch",
      fontSize: vars.font.size.body3,
      lineHeight: vars.font.lineHeight.relaxed,
    },
  },
});

export const actions = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      gap: vars.space.md,
      flexWrap: "wrap",
      marginBlockStart: vars.space.xs,
    },
  },
});

export const bottom = style({
  "@layer": {
    [baseLayer]: { position: "relative", zIndex: 1, width: "100%" },
  },
});

export const size = styleVariants({
  xl: {
    "@layer": {
      [baseLayer]: { paddingInline: vars.space.xl, paddingBlock: 90, minHeight: 240 },
    },
  },
  lg: {
    "@layer": {
      [baseLayer]: { paddingInline: vars.space.xl, paddingBlock: 60, minHeight: 160 },
    },
  },
  md: {
    "@layer": {
      [baseLayer]: { paddingInline: vars.space.lg, paddingBlock: 40, minHeight: 120 },
    },
  },
  sm: {
    "@layer": {
      [baseLayer]: { paddingInline: vars.space.md, paddingBlock: 20, minHeight: 80 },
    },
  },
});

export const titleSize = styleVariants({
  sm: { "@layer": { [baseLayer]: { fontSize: vars.font.size.h5 } } },
  md: { "@layer": { [baseLayer]: { fontSize: vars.font.size.h4 } } },
  lg: { "@layer": { [baseLayer]: { fontSize: vars.font.size.h3 } } },
  xl: { "@layer": { [baseLayer]: { fontSize: vars.font.size.h2 } } },
});

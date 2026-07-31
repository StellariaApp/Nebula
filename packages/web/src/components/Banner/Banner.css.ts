import { style, styleVariants } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { backdropFilter, bg, borderColor, borderWidth, fg, veil } from "./Banner.vars.css.js";

export const banner = style({
  "@layer": {
    [baseLayer]: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: vars.space.lg,
      boxSizing: "border-box",
      overflow: "hidden",
      borderRadius: vars.radius.lg,
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
      gap: vars.space.xs,
      minWidth: 0,
      flex: 1,
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
      opacity: 0.85,
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
      opacity: 0.9,
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
      opacity: 0.85,
    },
  },
});

export const actions = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      gap: vars.space.xs,
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
  sm: { padding: vars.space.md, minHeight: 120 },
  md: { padding: vars.space.lg, minHeight: 180 },
  lg: { padding: vars.space.xl, minHeight: 260 },
  xl: { padding: vars.space.xxl, minHeight: 340 },
});

export const titleSize = styleVariants({
  sm: { fontSize: vars.font.size.h5 },
  md: { fontSize: vars.font.size.h4 },
  lg: { fontSize: vars.font.size.h3 },
  xl: { fontSize: vars.font.size.h2 },
});

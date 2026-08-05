import { fallbackVar, style, styleVariants } from "@vanilla-extract/css";

import { BAND_MIN_HEIGHT, BAND_PADDING } from "../../styles/band.js";
import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";
import { SmallerThan } from "../../theme/media.js";
import * as variables from "./Hero.vars.css.js";

export const hero = style({
  "@layer": {
    [base_layer]: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: vars.space.xxxl,
      boxSizing: "border-box",
      width: "100%",
      overflow: "hidden",
      borderStyle: "solid",
      borderWidth: variables.borderWidth,
      borderColor: variables.borderColor,
      background: variables.bg,
      color: variables.fg,
      backdropFilter: variables.backdropFilter,
      fontFamily: vars.font.family.sans,
      "@media": {
        [SmallerThan("laptop")]: {
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: vars.space.xl,
        },
      },
    },
  },
});

export const media = style({
  "@layer": {
    [base_layer]: {
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
    [base_layer]: {
      position: "absolute",
      inset: 0,
      zIndex: 0,
      background: variables.veil,
    },
  },
});

export const body = style({
  "@layer": {
    [base_layer]: {
      position: "relative",
      zIndex: 1,
      display: "flex",
      flexDirection: "column",
      gap: vars.space.md,
      minWidth: 0,
      flex: 1,
      boxSizing: "border-box",
      maxWidth: fallbackVar(variables.contentMax, "none"),
      "@media": { [SmallerThan("laptop")]: { alignItems: "center", width: "100%" } },
    },
  },
});

export const slot = style({
  "@layer": {
    [base_layer]: {
      position: "relative",
      zIndex: 1,
      flexShrink: 0,
      maxWidth: "100%",
      "@media": { [SmallerThan("laptop")]: { flexShrink: 1, minWidth: 0 } },
    },
  },
});

export const hiper = style({
  "@layer": {
    [base_layer]: {
      margin: 0,
      fontSize: vars.font.size.caption,
      fontWeight: vars.font.weight.semibold,
      textTransform: "uppercase",
      letterSpacing: vars.font.letterSpacing.wide,
      color: vars.color.accent[600],
    },
  },
});

export const header = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.sm,
    },
  },
});

export const title = style({
  "@layer": {
    [base_layer]: {
      margin: 0,
      fontWeight: vars.font.weight.bold,
      lineHeight: vars.font.lineHeight.tight,
    },
  },
});

export const subtitle = style({
  "@layer": {
    [base_layer]: {
      margin: 0,
      fontSize: vars.font.size.body1,
    },
  },
});

export const description = style({
  "@layer": {
    [base_layer]: {
      margin: 0,
      maxWidth: "62ch",
      fontSize: vars.font.size.body1,
      lineHeight: vars.font.lineHeight.relaxed,
    },
  },
});

export const actions = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      gap: vars.space.md,
      flexWrap: "wrap",
      marginBlockStart: vars.space.xs,
      "@media": { [SmallerThan("laptop")]: { justifyContent: "center" } },
    },
  },
});

export const bottom = style({
  "@layer": {
    [base_layer]: { position: "relative", zIndex: 1, width: "100%" },
  },
});

export const size = styleVariants({
  xl: {
    "@layer": {
      [base_layer]: {
        paddingInline: vars.space.xl,
        paddingBlock: BAND_PADDING.xl,
        minHeight: BAND_MIN_HEIGHT.xl,
      },
    },
  },
  lg: {
    "@layer": {
      [base_layer]: {
        paddingInline: vars.space.xl,
        paddingBlock: BAND_PADDING.lg,
        minHeight: BAND_MIN_HEIGHT.lg,
      },
    },
  },
  md: {
    "@layer": {
      [base_layer]: {
        paddingInline: vars.space.lg,
        paddingBlock: BAND_PADDING.md,
        minHeight: BAND_MIN_HEIGHT.md,
      },
    },
  },
  sm: {
    "@layer": {
      [base_layer]: {
        paddingInline: vars.space.md,
        paddingBlock: BAND_PADDING.sm,
        minHeight: BAND_MIN_HEIGHT.sm,
      },
    },
  },
});

export const title_size = styleVariants({
  sm: { "@layer": { [base_layer]: { fontSize: vars.font.size.h5 } } },
  md: { "@layer": { [base_layer]: { fontSize: vars.font.size.h4 } } },
  lg: { "@layer": { [base_layer]: { fontSize: vars.font.size.h3 } } },
  xl: {
    "@layer": {
      [base_layer]: {
        fontSize: vars.font.display.size,
        lineHeight: vars.font.display.lineHeight,
        letterSpacing: vars.font.display.letterSpacing,
        "@media": {
          [SmallerThan("tablet")]: { fontSize: vars.font.size.h2 },
          [SmallerThan("phone")]: { fontSize: vars.font.size.h3 },
        },
      },
    },
  },
});

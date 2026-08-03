import { style, styleVariants } from "@vanilla-extract/css";

import { fallbackVar } from "@vanilla-extract/css";

import { BAND_MIN_HEIGHT, BAND_PADDING } from "../../styles/band.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { contentMax } from "./Section.vars.css.js";

export const section = style({
  "@layer": {
    [baseLayer]: {
      position: "relative",
      boxSizing: "border-box",
      width: "100%",
      minWidth: 0,
      fontFamily: vars.font.family.sans,
      selectors: {
        "&[data-glass='true']": {
          background: vars.glass.band.background,
          backdropFilter: vars.glass.band.backdropFilter,
          borderBlock: `1px solid ${vars.glass.band.borderColor}`,
        },
      },
    },
  },
});

export const rail = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.md,
      minWidth: 0,
      boxSizing: "border-box",
      width: "100%",
      maxWidth: fallbackVar(contentMax, "none"),
      marginInline: "auto",
      selectors: {
        "&[data-divided='true']": {
          paddingBlockEnd: vars.space.lg,
          borderBlockEnd: `1px solid ${vars.color.border.subtle}`,
        },
      },
    },
  },
});

export const head = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: vars.space.md,
      flexWrap: "wrap",
      minWidth: 0,
    },
  },
});

export const heading = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.xxs,
      minWidth: 0,
    },
  },
});

export const title = style({
  "@layer": {
    [baseLayer]: {
      margin: 0,
      fontSize: vars.font.size.h5,
      fontWeight: vars.font.weight.semibold,
      lineHeight: vars.font.lineHeight.tight,
      color: vars.color.text.primary,
    },
  },
});

export const description = style({
  "@layer": {
    [baseLayer]: {
      margin: 0,
      maxWidth: "62ch",
      fontSize: vars.font.size.body1,
      lineHeight: vars.font.lineHeight.relaxed,
      color: vars.color.text.secondary,
    },
  },
});

export const actions = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.xs,
      flexShrink: 0,
    },
  },
});

export const body = style({
  "@layer": {
    [baseLayer]: { position: "relative", minWidth: 0 },
  },
});

export const foot = style({
  "@layer": {
    [baseLayer]: { minWidth: 0 },
  },
});

export const size = styleVariants({
  xl: {
    "@layer": {
      [baseLayer]: { paddingBlock: BAND_PADDING.xl, minHeight: BAND_MIN_HEIGHT.xl },
    },
  },
  lg: {
    "@layer": {
      [baseLayer]: { paddingBlock: BAND_PADDING.lg, minHeight: BAND_MIN_HEIGHT.lg },
    },
  },
  md: {
    "@layer": {
      [baseLayer]: { paddingBlock: BAND_PADDING.md, minHeight: BAND_MIN_HEIGHT.md },
    },
  },
  sm: {
    "@layer": {
      [baseLayer]: { paddingBlock: BAND_PADDING.sm, minHeight: BAND_MIN_HEIGHT.sm },
    },
  },
});

export const railSize = styleVariants({
  xl: { "@layer": { [baseLayer]: { paddingInline: vars.space.xl } } },
  lg: { "@layer": { [baseLayer]: { paddingInline: vars.space.xl } } },
  md: { "@layer": { [baseLayer]: { paddingInline: vars.space.lg } } },
  sm: { "@layer": { [baseLayer]: { paddingInline: vars.space.md } } },
});

import { style, styleVariants } from "@vanilla-extract/css";

import { fallbackVar } from "@vanilla-extract/css";

import { BAND_MIN_HEIGHT, BAND_PADDING } from "../../styles/band.js";
import { vars } from "@stellaria/nebula-themes/web";
import { composite_layer } from "../../theme/layers.css.js";

import * as variables from "./Section.vars.css.js";

export const section = style({
  "@layer": {
    [composite_layer]: {
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
    [composite_layer]: {
      display: "flex",
      flexDirection: "column",
      minWidth: 0,
      boxSizing: "border-box",
      width: "100%",
      maxWidth: fallbackVar(variables.contentMax, "none"),
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
    [composite_layer]: {
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
    [composite_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.xxs,
      minWidth: 0,
    },
  },
});

export const title = style({
  "@layer": {
    [composite_layer]: {
      fontSize: vars.font.size.h5,
      fontWeight: vars.font.weight.semibold,
      lineHeight: vars.font.lineHeight.tight,
    },
  },
});

export const description = style({
  "@layer": {
    [composite_layer]: {
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
    [composite_layer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.xs,
      flexShrink: 0,
    },
  },
});

export const aside = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.xs,
      minWidth: 0,
    },
  },
});

export const body = style({
  "@layer": {
    [composite_layer]: {
      position: "relative",
      minWidth: 0,
      flexDirection: "column",
      display: "flex",
      gap: "inherit",
    },
  },
});

export const foot = style({
  "@layer": {
    [composite_layer]: { minWidth: 0 },
  },
});

export const size = styleVariants({
  xl: {
    "@layer": {
      [composite_layer]: {
        paddingBlock: BAND_PADDING.xl,
        minHeight: BAND_MIN_HEIGHT.xl,
      },
    },
  },
  lg: {
    "@layer": {
      [composite_layer]: {
        paddingBlock: BAND_PADDING.lg,
        minHeight: BAND_MIN_HEIGHT.lg,
      },
    },
  },
  md: {
    "@layer": {
      [composite_layer]: {
        paddingBlock: BAND_PADDING.md,
        minHeight: BAND_MIN_HEIGHT.md,
      },
    },
  },
  sm: {
    "@layer": {
      [composite_layer]: {
        paddingBlock: BAND_PADDING.sm,
        minHeight: BAND_MIN_HEIGHT.sm,
      },
    },
  },
});

export const rail_size = styleVariants({
  xl: { "@layer": { [composite_layer]: { paddingInline: vars.space.xl, gap: vars.space.xxxl } } },
  lg: { "@layer": { [composite_layer]: { paddingInline: vars.space.xl, gap: vars.space.xxl } } },
  md: { "@layer": { [composite_layer]: { paddingInline: vars.space.lg, gap: vars.space.xl } } },
  sm: { "@layer": { [composite_layer]: { paddingInline: vars.space.md, gap: vars.space.lg } } },
});

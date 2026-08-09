import { style, styleVariants } from "@vanilla-extract/css";

import { fallbackVar } from "@vanilla-extract/css";

import { BAND_MIN_HEIGHT, BAND_PADDING } from "../../styles/band.js";
import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

import * as variables from "./Section.vars.css.js";

export const section = style({
  "@layer": {
    [base_layer]: {
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
    [base_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.xl,
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
    [base_layer]: {
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
    [base_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.xxs,
      minWidth: 0,
    },
  },
});

export const title = style({
  "@layer": {
    [base_layer]: {
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
    [base_layer]: {
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
    [base_layer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.xs,
      flexShrink: 0,
    },
  },
});

export const aside = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.xs,
      minWidth: 0,
    },
  },
});

export const body = style({
  "@layer": {
    [base_layer]: { position: "relative", minWidth: 0 },
  },
});

export const foot = style({
  "@layer": {
    [base_layer]: { minWidth: 0 },
  },
});

export const size = styleVariants({
  xl: {
    "@layer": {
      [base_layer]: { paddingBlock: BAND_PADDING.xl, minHeight: BAND_MIN_HEIGHT.xl },
    },
  },
  lg: {
    "@layer": {
      [base_layer]: { paddingBlock: BAND_PADDING.lg, minHeight: BAND_MIN_HEIGHT.lg },
    },
  },
  md: {
    "@layer": {
      [base_layer]: { paddingBlock: BAND_PADDING.md, minHeight: BAND_MIN_HEIGHT.md },
    },
  },
  sm: {
    "@layer": {
      [base_layer]: { paddingBlock: BAND_PADDING.sm, minHeight: BAND_MIN_HEIGHT.sm },
    },
  },
});

export const rail_size = styleVariants({
  xl: { "@layer": { [base_layer]: { paddingInline: vars.space.xl } } },
  lg: { "@layer": { [base_layer]: { paddingInline: vars.space.xl } } },
  md: { "@layer": { [base_layer]: { paddingInline: vars.space.lg } } },
  sm: { "@layer": { [base_layer]: { paddingInline: vars.space.md } } },
});

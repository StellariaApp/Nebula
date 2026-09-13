import { style, styleVariants } from "@vanilla-extract/css";

import { vars } from "@stellaria/nebula-themes/web";
import { composite_layer } from "../../theme/layers.css.js";

export const root = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      boxSizing: "border-box",
      width: "100%",
      borderRadius: vars.radius.lg,
    },
  },
});

export const side = style({
  "@layer": {
    [composite_layer]: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: vars.space.lg,
      textAlign: "start",
    },
  },
});

export const fill = style({
  "@layer": {
    [composite_layer]: {
      flex: 1,
      alignSelf: "stretch",
      minHeight: 0,
    },
  },
});

export const state_side = style({
  "@layer": {
    [composite_layer]: {
      flex: "1 1 280px",
      alignItems: "flex-start",
      textAlign: "start",
      maxWidth: 480,
    },
  },
});

export const media_side = style({
  "@layer": {
    [composite_layer]: {
      width: "auto",
      flexShrink: 0,
    },
  },
});

export const surface = styleVariants({
  none: {},
  glass: {},
  paper: {
    background: vars.color.surface.sunken,
  },
  outline: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: vars.color.border.default,
  },
  dashed: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: vars.color.border.default,
  },
});

export const illustration = styleVariants({
  sm: {
    maxWidth: 120,
    marginBlockEnd: vars.space.xs,
    selectors: { [`${side} &`]: { marginBlockEnd: 0 } },
  },
  md: {
    maxWidth: 180,
    marginBlockEnd: vars.space.sm,
    selectors: { [`${side} &`]: { marginBlockEnd: 0 } },
  },
  lg: {
    maxWidth: 240,
    marginBlockEnd: vars.space.md,
    selectors: { [`${side} &`]: { marginBlockEnd: 0 } },
  },
});

export const media = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
  },
});

export const footer = style({
  "@layer": {
    [composite_layer]: {
      marginBlockStart: vars.space.md,
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.body3,
      color: vars.color.text.muted,
      textAlign: "center",
    },
  },
});

export const actions = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "center",
      gap: vars.space.xs,
    },
  },
});

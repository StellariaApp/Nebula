import { style, styleVariants } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const root = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      boxSizing: "border-box",
      width: "100%",
      borderRadius: vars.radius.lg,
      borderStyle: "solid",
      borderWidth: 0,
      borderColor: "transparent",
    },
  },
});

export const surface = styleVariants({
  none: {},
  paper: {
    background: vars.color.surface.sunken,
  },
  outline: {
    borderWidth: 1,
    borderColor: vars.color.border.default,
  },
  dashed: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: vars.color.border.default,
  },
});

export const illustration = styleVariants({
  sm: { maxWidth: 120, marginBlockEnd: vars.space.xs },
  md: { maxWidth: 180, marginBlockEnd: vars.space.sm },
  lg: { maxWidth: 240, marginBlockEnd: vars.space.md },
});

export const media = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
  },
});

export const footer = style({
  "@layer": {
    [baseLayer]: {
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
    [baseLayer]: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "center",
      gap: vars.space.xs,
    },
  },
});

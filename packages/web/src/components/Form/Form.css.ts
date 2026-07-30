import { style, styleVariants } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { banderoleColor } from "./Form.vars.css.js";

export const root = style({
  "@layer": {
    [baseLayer]: {
      display: "block",
      width: "100%",
      fontFamily: vars.font.family.sans,
    },
  },
});

export const fieldset = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.lg,
      border: "none",
      margin: 0,
      padding: 0,
      minWidth: 0,
    },
  },
});

export const header = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: vars.space.md,
    },
  },
});

export const headerText = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.xxs,
      minWidth: 0,
    },
  },
});

export const headerActions = style({
  "@layer": {
    [baseLayer]: { display: "flex", gap: vars.space.xs, flexShrink: 0 },
  },
});

export const title = style({
  "@layer": {
    [baseLayer]: { margin: 0 },
  },
});

export const banderole = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.sm,
      padding: vars.space.sm,
      borderRadius: vars.radius.sm,
      background: vars.color.surface.sunken,
      color: vars.color.text.secondary,
      fontSize: vars.font.size.body3,
      borderInlineStartWidth: 3,
      borderInlineStartStyle: "solid",
      borderInlineStartColor: banderoleColor,
    },
  },
});

export const banderoleSide = styleVariants({
  start: { alignSelf: "stretch" },
  end: { alignSelf: "stretch", order: 1 },
});

export const content = style({
  "@layer": {
    [baseLayer]: {
      display: "grid",
      gap: vars.space.md,
      minWidth: 0,
    },
  },
});

export const columns = styleVariants({
  1: { gridTemplateColumns: "1fr" },
  2: {
    gridTemplateColumns: "1fr",
    "@media": {
      "(min-width: 640px)": { gridTemplateColumns: "1fr 1fr" },
    },
  },
});

export const footer = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.sm,
    },
  },
});

export const error = style({
  "@layer": {
    [baseLayer]: {
      padding: vars.space.sm,
      borderRadius: vars.radius.sm,
      background: vars.color.semantic.error["50"],
      color: vars.color.semantic.error["700"],
      fontSize: vars.font.size.body3,
    },
  },
});

export const actions = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.sm,
    },
  },
});

export const align = styleVariants({
  start: { justifyContent: "flex-start" },
  end: { justifyContent: "flex-end" },
  between: { justifyContent: "space-between" },
});

import { style, styleVariants } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { composite_layer } from "../../theme/layers.css.js";

import * as variables from "./Form.vars.css.js";

export const root = style({
  "@layer": {
    [composite_layer]: {
      display: "block",
      width: "100%",
      fontFamily: vars.font.family.sans,
    },
  },
});

export const fieldset = style({
  "@layer": {
    [composite_layer]: {
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
    [composite_layer]: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: vars.space.md,
    },
  },
});

export const header_text = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.xxs,
      minWidth: 0,
    },
  },
});

export const header_actions = style({
  "@layer": {
    [composite_layer]: { display: "flex", gap: vars.space.xs, flexShrink: 0 },
  },
});

export const title = style({
  "@layer": {
    [composite_layer]: { margin: 0 },
  },
});

export const banderole = style({
  "@layer": {
    [composite_layer]: {
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
      borderInlineStartColor: variables.banderoleColor,
    },
  },
});

export const banderole_side = styleVariants({
  start: { alignSelf: "stretch" },
  end: { alignSelf: "stretch", order: 1 },
});

export const content = style({
  "@layer": {
    [composite_layer]: {
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
    [composite_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.sm,
    },
  },
});

export const error = style({
  "@layer": {
    [composite_layer]: {
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
    [composite_layer]: {
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

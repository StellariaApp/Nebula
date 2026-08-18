import { style, styleVariants } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import { interaction, reduced_media, still } from "../../styles/motion.css.js";
import { vars } from "@stellaria/nebula-themes/web";
import { primitive_layer } from "../../theme/layers.css.js";

import * as variables from "./DragDrop.vars.css.js";

export const draggable = style({
  "@layer": {
    [primitive_layer]: {
      position: "relative",
      boxSizing: "border-box",
      touchAction: "none",
      transform: variables.transform,
      transition: variables.transition,
      selectors: {
        "&[data-dragging='true']": { zIndex: 1, opacity: 0.4 },
        "&[data-disabled='true']": { touchAction: "auto", cursor: "default" },
        "&:focus-visible": { ...focus.ring },
      },
    },
  },
});

export const grabbable = style({
  "@layer": {
    [primitive_layer]: {
      cursor: "grab",
      selectors: {
        "&[data-dragging='true']": { cursor: "grabbing" },
        "&[data-disabled='true']": { cursor: "default" },
      },
    },
  },
});

export const handle = style({
  "@layer": {
    [primitive_layer]: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: vars.size.compact.md,
      height: vars.size.compact.md,
      padding: 0,
      border: "none",
      borderRadius: vars.radius.xs,
      background: "transparent",
      color: vars.color.text.muted,
      cursor: "grab",
      touchAction: "none",
      ...interaction,
      selectors: {
        "&:hover": { background: vars.color.surface.hover, color: vars.color.text.secondary },
        "&[data-dragging='true']": { cursor: "grabbing" },
        "&:disabled": { cursor: "default", color: vars.color.text.disabled },
        "&:focus-visible": { ...focus.ring },
      },
      "@media": { [reduced_media]: still },
    },
  },
});

export const droppable = style({
  "@layer": {
    [primitive_layer]: {
      position: "relative",
      boxSizing: "border-box",
      borderRadius: vars.radius.md,
      ...interaction,
      selectors: {
        "&[data-over='true']": {
          background: vars.color.surface.hover,
          outline: `1px dashed ${vars.color.border.strong}`,
          outlineOffset: -1,
        },
      },
      "@media": { [reduced_media]: still },
    },
  },
});

export const list = style({
  "@layer": {
    [primitive_layer]: {
      display: "flex",
      listStyle: "none",
      margin: 0,
      padding: 0,
    },
  },
});

export const axis = styleVariants({
  x: { flexDirection: "row" },
  y: { flexDirection: "column" },
});

export const gap = styleVariants({
  xs: { gap: vars.space.xxs },
  sm: { gap: vars.space.xs },
  md: { gap: vars.space.sm },
  lg: { gap: vars.space.md },
});

export const row = style({
  "@layer": {
    [primitive_layer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.xs,
    },
  },
});

export const overlay = style({
  "@layer": {
    [primitive_layer]: {
      cursor: "grabbing",
      boxShadow: vars.shadow.lg,
      borderRadius: vars.radius.md,
    },
  },
});

export const empty_slot = style({
  "@layer": {
    [primitive_layer]: {
      padding: vars.space.md,
      color: vars.color.text.muted,
      fontSize: vars.font.size.body2,
      textAlign: "center",
    },
  },
});

import { style } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import { layout, reduced_media, still } from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

import * as variables from "./Lightbox.vars.css.js";

export const stage = style({
  "@layer": {
    [base_layer]: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      minHeight: 240,
      height: "60vh",
      borderRadius: vars.radius.md,
      background: vars.color.surface.sunken,
      touchAction: "none",
      selectors: {
        "&[data-zoomed='true']": { cursor: "grab" },
        "&[data-panning='true']": { cursor: "grabbing" },
        "&:focus-visible": { ...focus.ring },
      },
    },
  },
});

export const image = style({
  "@layer": {
    [base_layer]: {
      maxWidth: "100%",
      maxHeight: "100%",
      objectFit: "contain",
      transform: variables.imageTransform,
      transformOrigin: "center center",
      userSelect: "none",
      WebkitUserSelect: "none",
      pointerEvents: "none",
      ...layout,
      selectors: {
        "&[data-panning='true']": { transitionProperty: "none" },
      },
      "@media": { [reduced_media]: still },
    },
  },
});

export const bar = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: vars.space.sm,
      marginTop: vars.space.sm,
    },
  },
});

export const group = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.xxs,
    },
  },
});

export const counter = style({
  "@layer": {
    [base_layer]: {
      fontSize: vars.font.size.caption,
      fontVariantNumeric: "tabular-nums",
      color: vars.color.text.muted,
    },
  },
});

export const caption = style({
  "@layer": {
    [base_layer]: {
      margin: 0,
      marginTop: vars.space.xs,
      fontSize: vars.font.size.body3,
      color: vars.color.text.secondary,
      textAlign: "center",
    },
  },
});

export const filmstrip = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      gap: vars.space.xxs,
      margin: 0,
      marginTop: vars.space.sm,
      padding: 0,
      listStyle: "none",
      overflowX: "auto",
    },
  },
});

export const thumb = style({
  "@layer": {
    [base_layer]: {
      display: "block",
      width: 64,
      height: 48,
      padding: 0,
      border: `1px solid ${vars.color.border.subtle}`,
      borderRadius: vars.radius.xs,
      overflow: "hidden",
      background: vars.color.surface.sunken,
      cursor: "pointer",
      selectors: {
        "&[aria-current='true']": { borderColor: vars.color.border.focus, borderWidth: 2 },
        "&:focus-visible": { ...focus.ring },
      },
    },
  },
});

export const thumb_image = style({
  "@layer": {
    [base_layer]: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    },
  },
});

export const empty = style({
  "@layer": {
    [base_layer]: {
      padding: vars.space.xl,
      textAlign: "center",
      color: vars.color.text.muted,
    },
  },
});

import { style, styleVariants } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import { interaction, reduced_media, still } from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

import * as variables from "./ImageGallery.vars.css.js";

export const gallery = style({
  "@layer": {
    [base_layer]: {
      display: "grid",
      gridTemplateColumns: variables.columns,
      margin: 0,
      padding: 0,
      listStyle: "none",
    },
  },
});

export const gap = styleVariants({
  xs: { gap: vars.space.xxs },
  sm: { gap: vars.space.xs },
  md: { gap: vars.space.sm },
  lg: { gap: vars.space.md },
});

export const tile = style({
  "@layer": {
    [base_layer]: {
      display: "block",
      width: "100%",
      padding: 0,
      border: `1px solid ${vars.color.border.subtle}`,
      borderRadius: variables.tileRadius,
      overflow: "hidden",
      background: vars.color.surface.sunken,
      aspectRatio: variables.ratio,
      cursor: "pointer",
      ...interaction,
      selectors: {
        "&:hover": { borderColor: vars.color.border.strong },
        "&:focus-visible": { ...focus.ring },
      },
      "@media": { [reduced_media]: still },
    },
  },
});

export const tile_static = style({
  "@layer": {
    [base_layer]: { cursor: "default" },
  },
});

export const tile_image = style({
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
      padding: vars.space.lg,
      textAlign: "center",
      color: vars.color.text.muted,
      fontSize: vars.font.size.body2,
    },
  },
});

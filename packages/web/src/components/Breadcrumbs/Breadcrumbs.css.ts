import { style, styleVariants } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import { interaction, reduced_media, still } from "../../styles/motion.css.js";
import { vars } from "@stellaria/nebula-themes/web";
import { primitive_layer } from "../../theme/layers.css.js";

export const list = style({
  "@layer": {
    [primitive_layer]: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: vars.space.xxs,
      margin: 0,
      padding: 0,
      listStyle: "none",
    },
  },
});

export const item = style({
  "@layer": {
    [primitive_layer]: {
      display: "inline-flex",
      alignItems: "center",
      gap: vars.space.xxs,
      minWidth: 0,
    },
  },
});

export const link = style({
  "@layer": {
    [primitive_layer]: {
      display: "inline-flex",
      alignItems: "center",
      gap: vars.space.xxs,
      maxWidth: "22ch",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      padding: 0,
      border: "none",
      background: "transparent",
      color: vars.color.text.secondary,
      textDecoration: "none",
      cursor: "pointer",
      font: "inherit",
      fontWeight: vars.font.weight.semibold,
      ...interaction,
      selectors: {
        "&:hover": { color: vars.color.text.primary, textDecoration: "underline" },
        "&:focus-visible": { ...focus.ring },
      },
      "@media": { [reduced_media]: still },
    },
  },
});

export const current = style({
  "@layer": {
    [primitive_layer]: {
      maxWidth: "28ch",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      color: vars.color.primary[600],
      fontWeight: vars.font.weight.semibold,
    },
  },
});

export const separator = style({
  "@layer": {
    [primitive_layer]: {
      fontWeight: vars.font.weight.medium,
      color: vars.color.text.muted,
      userSelect: "none",
    },
  },
});

export const expand = style({
  "@layer": {
    [primitive_layer]: {
      padding: `0 ${vars.space.xxs}`,
      border: "none",
      borderRadius: vars.radius.xs,
      background: "transparent",
      color: vars.color.text.muted,
      cursor: "pointer",
      font: "inherit",
      ...interaction,
      selectors: {
        "&:hover": { background: vars.color.surface.hover, color: vars.color.text.secondary },
        "&:focus-visible": { ...focus.ring },
      },
      "@media": { [reduced_media]: still },
    },
  },
});

export const size = styleVariants({
  sm: { fontSize: vars.font.size.caption },
  md: { fontSize: vars.font.size.body3 },
});

import { style, styleVariants } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import { interaction, reducedMedia, still } from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const list = style({
  "@layer": {
    [baseLayer]: {
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
    [baseLayer]: {
      display: "inline-flex",
      alignItems: "center",
      gap: vars.space.xxs,
      minWidth: 0,
    },
  },
});

export const link = style({
  "@layer": {
    [baseLayer]: {
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
      ...interaction,
      selectors: {
        "&:hover": { color: vars.color.text.primary, textDecoration: "underline" },
        "&:focus-visible": { ...focus.ring },
      },
      "@media": { [reducedMedia]: still },
    },
  },
});

export const current = style({
  "@layer": {
    [baseLayer]: {
      maxWidth: "28ch",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      color: vars.color.text.primary,
      fontWeight: vars.font.weight.medium,
    },
  },
});

export const separator = style({
  "@layer": {
    [baseLayer]: {
      color: vars.color.text.muted,
      userSelect: "none",
    },
  },
});

export const expand = style({
  "@layer": {
    [baseLayer]: {
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
      "@media": { [reducedMedia]: still },
    },
  },
});

export const size = styleVariants({
  sm: { fontSize: vars.font.size.caption },
  md: { fontSize: vars.font.size.body3 },
});

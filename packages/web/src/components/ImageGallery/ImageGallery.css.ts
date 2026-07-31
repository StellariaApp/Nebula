import { createVar, style, styleVariants } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import { interaction, reducedMedia, still } from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const columns = createVar();
export const ratio = createVar();
export const tileRadius = createVar();

export const gallery = style({
  "@layer": {
    [baseLayer]: {
      display: "grid",
      gridTemplateColumns: columns,
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
    [baseLayer]: {
      display: "block",
      width: "100%",
      padding: 0,
      border: `1px solid ${vars.color.border.subtle}`,
      borderRadius: tileRadius,
      overflow: "hidden",
      background: vars.color.surface.sunken,
      aspectRatio: ratio,
      cursor: "pointer",
      ...interaction,
      selectors: {
        "&:hover": { borderColor: vars.color.border.strong },
        "&:focus-visible": { ...focus.ring },
      },
      "@media": { [reducedMedia]: still },
    },
  },
});

export const tileStatic = style({
  "@layer": {
    [baseLayer]: { cursor: "default" },
  },
});

export const tileImage = style({
  "@layer": {
    [baseLayer]: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    },
  },
});

export const empty = style({
  "@layer": {
    [baseLayer]: {
      padding: vars.space.lg,
      textAlign: "center",
      color: vars.color.text.muted,
      fontSize: vars.font.size.body2,
    },
  },
});

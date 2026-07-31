import { createVar, style, styleVariants } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import { interaction, reducedMedia, still } from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const slideSize = createVar();
export const slideGap = createVar();

export const carousel = style({
  "@layer": {
    [baseLayer]: {
      position: "relative",
      boxSizing: "border-box",
    },
  },
});

export const viewport = style({
  "@layer": {
    [baseLayer]: {
      overflow: "hidden",
      borderRadius: "inherit",
    },
  },
});

export const container = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      gap: slideGap,
      backfaceVisibility: "hidden",
      touchAction: "pan-y pinch-zoom",
      selectors: {
        "&[data-axis='y']": { flexDirection: "column", height: "100%", touchAction: "pan-x" },
      },
    },
  },
});

export const slide = style({
  "@layer": {
    [baseLayer]: {
      flex: `0 0 ${slideSize}`,
      minWidth: 0,
      boxSizing: "border-box",
    },
  },
});

export const gap = styleVariants({
  none: { vars: { [slideGap]: "0px" } },
  xs: { vars: { [slideGap]: vars.space.xxs } },
  sm: { vars: { [slideGap]: vars.space.xs } },
  md: { vars: { [slideGap]: vars.space.sm } },
  lg: { vars: { [slideGap]: vars.space.md } },
});

export const controls = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: vars.space.sm,
      marginTop: vars.space.sm,
    },
  },
});

export const indicators = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: vars.space.xxs,
      margin: 0,
      padding: 0,
      listStyle: "none",
      flex: 1,
    },
  },
});

export const indicator = style({
  "@layer": {
    [baseLayer]: {
      width: 8,
      height: 8,
      padding: 0,
      border: "none",
      borderRadius: vars.radius.full,
      background: vars.color.border.default,
      cursor: "pointer",
      ...interaction,
      selectors: {
        "&[aria-current='true']": { background: vars.color.primary["600"], width: 20 },
        "&:hover": { background: vars.color.border.strong },
        "&:focus-visible": { ...focus.ring },
      },
      "@media": { [reducedMedia]: still },
    },
  },
});

export const emptySlot = style({
  "@layer": {
    [baseLayer]: {
      padding: vars.space.lg,
      textAlign: "center",
      color: vars.color.text.muted,
      fontSize: vars.font.size.body2,
    },
  },
});

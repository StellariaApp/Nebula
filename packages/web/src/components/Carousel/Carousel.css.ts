import { style, styleVariants } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import { interaction, reduced_media, still } from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

import * as variables from "./Carousel.vars.css.js";

export const carousel = style({
  "@layer": {
    [base_layer]: {
      position: "relative",
      boxSizing: "border-box",
    },
  },
});

export const viewport = style({
  "@layer": {
    [base_layer]: {
      overflow: "hidden",
      borderRadius: "inherit",
    },
  },
});

export const container = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      gap: variables.slideGap,
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
    [base_layer]: {
      flex: `0 0 ${variables.slideSize}`,
      minWidth: 0,
      boxSizing: "border-box",
    },
  },
});

export const gap = styleVariants({
  none: { vars: { [variables.slideGap]: "0px" } },
  xs: { vars: { [variables.slideGap]: vars.space.xxs } },
  sm: { vars: { [variables.slideGap]: vars.space.xs } },
  md: { vars: { [variables.slideGap]: vars.space.sm } },
  lg: { vars: { [variables.slideGap]: vars.space.md } },
});

export const controls = style({
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

export const indicators = style({
  "@layer": {
    [base_layer]: {
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
    [base_layer]: {
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
        "&[aria-current='true']:hover": { background: vars.color.primary["700"] },
        "&:focus-visible": { ...focus.ring },
      },
      "@media": { [reduced_media]: still },
    },
  },
});

export const empty_slot = style({
  "@layer": {
    [base_layer]: {
      padding: vars.space.lg,
      textAlign: "center",
      color: vars.color.text.muted,
      fontSize: vars.font.size.body2,
    },
  },
});

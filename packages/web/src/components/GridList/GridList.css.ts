import { style, styleVariants } from "@vanilla-extract/css";

import { vars } from "@stellaria/nebula-themes/web";
import { component_layer } from "../../theme/layers.css.js";

import * as variables from "./GridList.vars.css.js";

export const root = style({
  "@layer": {
    [component_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.md,
      minWidth: 0,
    },
  },
});

export const toolbar = style({
  "@layer": {
    [component_layer]: { display: "flex", justifyContent: "flex-end" },
  },
});

export const container = style({
  "@layer": {
    [component_layer]: {
      listStyle: "none",
      margin: 0,
      padding: 0,
      minWidth: 0,
    },
  },
});

export const item = style({
  "@layer": {
    [component_layer]: {
      minWidth: 0,
      selectors: {
        "[data-mode='carousel'] &": { scrollSnapAlign: "start" },
      },
    },
  },
});

export const mode = styleVariants({
  list: { display: "flex", flexDirection: "column" },
  grid: {
    display: "grid",
    gridTemplateColumns: `repeat(${variables.cols}, minmax(${variables.minCol}, 1fr))`,
  },
  carousel: {
    display: "grid",
    gridAutoFlow: "column",
    gridAutoColumns: variables.minCol,
    overflowX: "auto",
    scrollSnapType: "x mandatory",
    scrollPaddingInline: vars.space.md,
  },
});

export const gap = styleVariants({
  xs: { gap: vars.space.xs },
  sm: { gap: vars.space.sm },
  md: { gap: vars.space.md },
  lg: { gap: vars.space.lg },
});

import { style, styleVariants } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

import { cols, minCol } from "./GridList.vars.css.js";

export const root = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.md,
      minWidth: 0,
    },
  },
});

export const toolbar = style({
  "@layer": {
    [base_layer]: { display: "flex", justifyContent: "flex-end" },
  },
});

export const container = style({
  "@layer": {
    [base_layer]: {
      listStyle: "none",
      margin: 0,
      padding: 0,
      minWidth: 0,
    },
  },
});

export const item = style({
  "@layer": {
    [base_layer]: {
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
    gridTemplateColumns: `repeat(${cols}, minmax(${minCol}, 1fr))`,
  },
  carousel: {
    display: "grid",
    gridAutoFlow: "column",
    gridAutoColumns: minCol,
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

import { fallbackVar, style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import { baseLayer } from "../../theme/layers.css.js";

import { colOffset, colSpan, gridColumns, gridGrow, gridGutter } from "./Grid.vars.css.js";

const unit = `((100% - (${gridColumns} - 1) * ${gridGutter}) / ${gridColumns})`;
const spanWidth = `calc(${colSpan} * ${unit} + (${colSpan} - 1) * ${gridGutter})`;
const offsetMargin = `calc(${colOffset} * ${unit} + ${colOffset} * ${gridGutter})`;

export const grid = recipe({
  base: {
    "@layer": {
      [baseLayer]: {
        display: "flex",
        boxSizing: "border-box",
        gap: gridGutter,
      },
    },
  },
  variants: {
    wrap: {
      true: { "@layer": { [baseLayer]: { flexWrap: "wrap" } } },
      false: { "@layer": { [baseLayer]: { flexWrap: "nowrap" } } },
    },
  },
  defaultVariants: {
    wrap: true,
  },
});

export type GridRecipeVariants = NonNullable<RecipeVariants<typeof grid>>;

export const colBase = style({
  "@layer": {
    [baseLayer]: {
      boxSizing: "border-box",
      minWidth: 0,
      marginInlineStart: offsetMargin,
    },
  },
});

export const colNumeric = style({
  "@layer": {
    [baseLayer]: {
      flexGrow: fallbackVar(gridGrow, "0"),
      flexShrink: 0,
      flexBasis: spanWidth,
      maxWidth: spanWidth,
    },
  },
});

export const colAuto = style({
  "@layer": {
    [baseLayer]: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
      maxWidth: "100%",
    },
  },
});

export const colContent = style({
  "@layer": {
    [baseLayer]: {
      flexGrow: 0,
      flexShrink: 0,
      flexBasis: "auto",
      maxWidth: "100%",
    },
  },
});

import { fallbackVar, style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import { base_layer } from "../../theme/layers.css.js";

import { colOffset, colSpan, gridColumns, gridGrow, gridGutter } from "./Grid.vars.css.js";

const unit = `((100% - (${gridColumns} - 1) * ${gridGutter}) / ${gridColumns})`;
const span_width = `calc(${colSpan} * ${unit} + (${colSpan} - 1) * ${gridGutter})`;
const offset_margin = `calc(${colOffset} * ${unit} + ${colOffset} * ${gridGutter})`;

export const grid = recipe({
  base: {
    "@layer": {
      [base_layer]: {
        display: "flex",
        boxSizing: "border-box",
        gap: gridGutter,
      },
    },
  },
  variants: {
    wrap: {
      true: { "@layer": { [base_layer]: { flexWrap: "wrap" } } },
      false: { "@layer": { [base_layer]: { flexWrap: "nowrap" } } },
    },
  },
  defaultVariants: {
    wrap: true,
  },
});

export type GridRecipeVariants = NonNullable<RecipeVariants<typeof grid>>;

export const col_base = style({
  "@layer": {
    [base_layer]: {
      boxSizing: "border-box",
      minWidth: 0,
      marginInlineStart: offset_margin,
    },
  },
});

export const col_numeric = style({
  "@layer": {
    [base_layer]: {
      flexGrow: fallbackVar(gridGrow, "0"),
      flexShrink: 0,
      flexBasis: span_width,
      maxWidth: span_width,
    },
  },
});

export const col_auto = style({
  "@layer": {
    [base_layer]: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
      maxWidth: "100%",
    },
  },
});

export const col_content = style({
  "@layer": {
    [base_layer]: {
      flexGrow: 0,
      flexShrink: 0,
      flexBasis: "auto",
      maxWidth: "100%",
    },
  },
});

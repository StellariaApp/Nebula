import { fallbackVar, style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import { base_layer } from "../../theme/layers.css.js";

import * as variables from "./Grid.vars.css.js";

const unit = `((100% - (${variables.columns} - 1) * ${variables.gutter}) / ${variables.columns})`;
const span_width = `calc(${variables.colSpan} * ${unit} + (${variables.colSpan} - 1) * ${variables.gutter})`;
const offset_margin = `calc(${variables.colOffset} * ${unit} + ${variables.colOffset} * ${variables.gutter})`;

export const grid = recipe({
  base: {
    "@layer": {
      [base_layer]: {
        display: "flex",
        boxSizing: "border-box",
        gap: variables.gutter,
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
      flexGrow: fallbackVar(variables.grow, "0"),
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

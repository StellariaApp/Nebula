import { fallbackVar, style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import { colOffset, colSpan, gridColumns, gridGrow, gridGutter } from "./Grid.vars.css.js";

const unit = `((100% - (${gridColumns} - 1) * ${gridGutter}) / ${gridColumns})`;
const spanWidth = `calc(${colSpan} * ${unit} + (${colSpan} - 1) * ${gridGutter})`;
const offsetMargin = `calc(${colOffset} * ${unit} + ${colOffset} * ${gridGutter})`;

export const grid = recipe({
  base: {
    display: "flex",
    boxSizing: "border-box",
    gap: gridGutter,
  },
  variants: {
    wrap: {
      true: { flexWrap: "wrap" },
      false: { flexWrap: "nowrap" },
    },
  },
  defaultVariants: {
    wrap: true,
  },
});

export type GridRecipeVariants = NonNullable<RecipeVariants<typeof grid>>;

export const colBase = style({
  boxSizing: "border-box",
  minWidth: 0,
  marginInlineStart: offsetMargin,
});

export const colNumeric = style({
  flexGrow: fallbackVar(gridGrow, "0"),
  flexShrink: 0,
  flexBasis: spanWidth,
  maxWidth: spanWidth,
});

export const colAuto = style({
  flexGrow: 1,
  flexShrink: 1,
  flexBasis: 0,
  maxWidth: "100%",
});

export const colContent = style({
  flexGrow: 0,
  flexShrink: 0,
  flexBasis: "auto",
  maxWidth: "100%",
});

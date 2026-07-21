import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const mark = recipe({
  base: {
    "@layer": {
      [baseLayer]: {
        borderRadius: vars.radius.xs,
        paddingInline: "0.15em",
      },
    },
  },
  variants: {
    color: {
      primary: {
        "@layer": {
          [baseLayer]: { background: vars.color.primary["200"], color: vars.color.primary["900"] },
        },
      },
      accent: {
        "@layer": {
          [baseLayer]: { background: vars.color.accent["200"], color: vars.color.accent["900"] },
        },
      },
      gray: {
        "@layer": {
          [baseLayer]: { background: vars.color.gray["200"], color: vars.color.gray["900"] },
        },
      },
      success: {
        "@layer": {
          [baseLayer]: {
            background: vars.color.semantic.success["200"],
            color: vars.color.semantic.success["900"],
          },
        },
      },
      warning: {
        "@layer": {
          [baseLayer]: {
            background: vars.color.semantic.warning["200"],
            color: vars.color.semantic.warning["900"],
          },
        },
      },
      error: {
        "@layer": {
          [baseLayer]: {
            background: vars.color.semantic.error["200"],
            color: vars.color.semantic.error["900"],
          },
        },
      },
      info: {
        "@layer": {
          [baseLayer]: {
            background: vars.color.semantic.info["200"],
            color: vars.color.semantic.info["900"],
          },
        },
      },
    },
  },
  defaultVariants: {
    color: "warning",
  },
});

export type MarkRecipeVariants = NonNullable<RecipeVariants<typeof mark>>;

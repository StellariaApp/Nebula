import { fallbackVar } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

import * as variables from "./Paper.vars.css.js";

export const paper = recipe({
  base: {
    "@layer": {
      [base_layer]: {
        boxSizing: "border-box",
        background: fallbackVar(variables.bg, vars.color.surface.raised),
        color: fallbackVar(variables.fg, vars.color.text.primary),
        borderStyle: "solid",
        borderWidth: 0,
        borderColor: fallbackVar(variables.borderColor, vars.color.border.default),
        backdropFilter: fallbackVar(variables.backdropFilter, "none"),
      },
    },
  },
  variants: {
    glowing: {
      true: { "@layer": { [base_layer]: { boxShadow: variables.glow } } },
      false: {},
    },
    shadow: {
      none: {},
      xxs: { boxShadow: vars.shadow.xxs },
      xs: { boxShadow: vars.shadow.xs },
      sm: { boxShadow: vars.shadow.sm },
      md: { boxShadow: vars.shadow.md },
      lg: { boxShadow: vars.shadow.lg },
      xl: { boxShadow: vars.shadow.xl },
      xxl: { boxShadow: vars.shadow.xxl },
    },
    withBorder: {
      true: { "@layer": { [base_layer]: { borderWidth: 1 } } },
      false: {},
    },
  },
  defaultVariants: {
    shadow: "none",
    withBorder: false,
    glowing: false,
  },
});

export type PaperRecipeVariants = NonNullable<RecipeVariants<typeof paper>>;

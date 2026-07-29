import { fallbackVar } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { backdropFilter, bg, borderColor, fg, glow } from "./Paper.vars.css.js";

export const paper = recipe({
  base: {
    "@layer": {
      [baseLayer]: {
        boxSizing: "border-box",
        background: fallbackVar(bg, vars.color.surface.base),
        color: fallbackVar(fg, vars.color.text.primary),
        borderStyle: "solid",
        borderWidth: 0,
        borderColor: fallbackVar(borderColor, vars.color.border.default),
        backdropFilter: fallbackVar(backdropFilter, "none"),
      },
    },
  },
  variants: {
    glowing: {
      true: { "@layer": { [baseLayer]: { boxShadow: glow } } },
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
    radius: {
      xxs: { borderRadius: vars.radius.xxs },
      xs: { borderRadius: vars.radius.xs },
      sm: { borderRadius: vars.radius.sm },
      md: { borderRadius: vars.radius.md },
      lg: { borderRadius: vars.radius.lg },
      xl: { borderRadius: vars.radius.xl },
      xxl: { borderRadius: vars.radius.xxl },
      full: { borderRadius: vars.radius.full },
    },
    withBorder: {
      true: { "@layer": { [baseLayer]: { borderWidth: 1 } } },
      false: {},
    },
  },
  defaultVariants: {
    shadow: "none",
    radius: "md",
    withBorder: false,
    glowing: false,
  },
});

export type PaperRecipeVariants = NonNullable<RecipeVariants<typeof paper>>;

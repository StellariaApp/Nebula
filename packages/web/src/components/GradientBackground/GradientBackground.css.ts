import { style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

import * as variables from "./GradientBackground.vars.css.js";

export const gradient_background = recipe({
  base: {
    "@layer": {
      [base_layer]: {
        isolation: "isolate",
        boxSizing: "border-box",
        backgroundImage: variables.image,
        color: vars.color.text.primary,
        "@media": {
          "(forced-colors: active)": {
            backgroundImage: "none",
            background: "Canvas",
          },
        },
      },
    },
  },
  variants: {
  },
  defaultVariants: {
  },
});

export const scrim = style({
  "@layer": {
    [base_layer]: {
      position: "absolute",
      inset: 0,
      zIndex: -1,
      borderRadius: "inherit",
      pointerEvents: "none",
      background: vars.color.surface.base,
      opacity: variables.scrimAlpha,
      "@media": {
        "(forced-colors: active)": { display: "none" },
      },
    },
  },
});

export const grain_layer = style({
  "@layer": {
    [base_layer]: { zIndex: -1 },
  },
});

export type GradientBackgroundRecipeVariants = NonNullable<
  RecipeVariants<typeof gradient_background>
>;

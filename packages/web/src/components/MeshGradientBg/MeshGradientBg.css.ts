import { style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

import * as variables from "./MeshGradientBg.vars.css.js";

export const mesh_gradient_bg = recipe({
  base: {
    "@layer": {
      [base_layer]: {
        position: "relative",
        isolation: "isolate",
        boxSizing: "border-box",
        backgroundColor: variables.base,
        backgroundImage: variables.image,
        color: vars.color.text.primary,
        "@media": {
          "(forced-colors: active)": {
            backgroundImage: "none",
            backgroundColor: "Canvas",
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

export type MeshGradientBgRecipeVariants = NonNullable<RecipeVariants<typeof mesh_gradient_bg>>;

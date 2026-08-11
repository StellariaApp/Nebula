import { style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

import * as variables from "./GlassSurface.vars.css.js";

const NO_BACKDROP = "not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))";

export const glass_surface = recipe({
  base: {
    "@layer": {
      [base_layer]: {
        isolation: "isolate",
        boxSizing: "border-box",
        background: variables.bg,
        color: vars.color.text.primary,
        backdropFilter: variables.backdrop,
        WebkitBackdropFilter: variables.backdrop,
        "@supports": {
          [NO_BACKDROP]: { background: variables.solidBg },
        },
        "@media": {
          "(forced-colors: active)": {
            background: "Canvas",
            backdropFilter: "none",
            WebkitBackdropFilter: "none",
          },
        },
      },
    },
  },
  variants: {
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
      true: {
        "@layer": {
          [base_layer]: {
            borderColor: variables.borderColor,
            borderStyle: "solid",
            borderWidth: 1,
            "@supports": {
              [NO_BACKDROP]: { borderColor: variables.solidBorderColor },
            },
          },
        },
      },
      false: { "@layer": { [base_layer]: { borderWidth: 0 } } },
    },
  },
  defaultVariants: {
    shadow: "none",
    withBorder: true,
  },
});

export const grain_layer = style({
  "@layer": {
    [base_layer]: { zIndex: -1 },
  },
});

export type GlassSurfaceRecipeVariants = NonNullable<RecipeVariants<typeof glass_surface>>;

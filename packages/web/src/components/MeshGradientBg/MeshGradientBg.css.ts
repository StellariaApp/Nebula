import { style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { meshBase, meshImage, scrimAlpha } from "./MeshGradientBg.vars.css.js";

export const meshGradientBg = recipe({
  base: {
    "@layer": {
      [baseLayer]: {
        position: "relative",
        isolation: "isolate",
        boxSizing: "border-box",
        backgroundColor: meshBase,
        backgroundImage: meshImage,
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
    radius: {
      none: { borderRadius: vars.radius.none },
      xxs: { borderRadius: vars.radius.xxs },
      xs: { borderRadius: vars.radius.xs },
      sm: { borderRadius: vars.radius.sm },
      md: { borderRadius: vars.radius.md },
      lg: { borderRadius: vars.radius.lg },
      xl: { borderRadius: vars.radius.xl },
      xxl: { borderRadius: vars.radius.xxl },
      full: { borderRadius: vars.radius.full },
    },
  },
  defaultVariants: {
    radius: "lg",
  },
});

export const scrim = style({
  "@layer": {
    [baseLayer]: {
      position: "absolute",
      inset: 0,
      zIndex: -1,
      pointerEvents: "none",
      background: vars.color.surface.base,
      opacity: scrimAlpha,
      "@media": {
        "(forced-colors: active)": { display: "none" },
      },
    },
  },
});

export const grainLayer = style({
  "@layer": {
    [baseLayer]: { zIndex: -1 },
  },
});

export type MeshGradientBgRecipeVariants = NonNullable<RecipeVariants<typeof meshGradientBg>>;

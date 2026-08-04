import { style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { backdrop, bg, borderRule, solidBg } from "./GlassSurface.vars.css.js";

const NO_BACKDROP = "not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))";

export const glassSurface = recipe({
  base: {
    "@layer": {
      [baseLayer]: {
        isolation: "isolate",
        boxSizing: "border-box",
        background: bg,
        color: vars.color.text.primary,
        backdropFilter: backdrop,
        WebkitBackdropFilter: backdrop,
        "@supports": {
          [NO_BACKDROP]: { background: solidBg },
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
    radius: {
      none: { borderRadius: 0 },
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
      true: { "@layer": { [baseLayer]: { border: borderRule } } },
      false: { "@layer": { [baseLayer]: { border: "none" } } },
    },
  },
  defaultVariants: {
    shadow: "none",
    radius: "lg",
    withBorder: true,
  },
});

export const grainLayer = style({
  "@layer": {
    [baseLayer]: { zIndex: -1 },
  },
});

export type GlassSurfaceRecipeVariants = NonNullable<RecipeVariants<typeof glassSurface>>;

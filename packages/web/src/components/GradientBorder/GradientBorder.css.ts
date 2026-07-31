import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { fallbackBorder, gradientImage, innerBg, ringWidth } from "./GradientBorder.vars.css.js";

const SOLID_MASK = "linear-gradient(#000 0 0)";
const NO_MASK_COMPOSITE = "not ((mask-composite: exclude) or (-webkit-mask-composite: xor))";

export const gradientBorder = recipe({
  base: {
    "@layer": {
      [baseLayer]: {
        position: "relative",
        isolation: "isolate",
        boxSizing: "border-box",
        background: innerBg,
        selectors: {
          "&::before": {
            content: "",
            position: "absolute",
            inset: 0,
            zIndex: -1,
            borderRadius: "inherit",
            padding: ringWidth,
            background: gradientImage,
            WebkitMask: `${SOLID_MASK} content-box, ${SOLID_MASK}`,
            WebkitMaskComposite: "xor",
            mask: `${SOLID_MASK} content-box, ${SOLID_MASK}`,
            maskComposite: "exclude",
            pointerEvents: "none",
          },
        },
        "@supports": {
          [NO_MASK_COMPOSITE]: {
            border: `1px solid ${fallbackBorder}`,
            selectors: {
              "&::before": { display: "none" },
            },
          },
        },
        "@media": {
          "(forced-colors: active)": {
            border: "1px solid CanvasText",
            selectors: {
              "&::before": { display: "none" },
            },
          },
        },
      },
    },
  },
  variants: {
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
  },
  defaultVariants: {
    radius: "lg",
  },
});

export type GradientBorderRecipeVariants = NonNullable<RecipeVariants<typeof gradientBorder>>;

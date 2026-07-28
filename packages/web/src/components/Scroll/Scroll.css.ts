import { fallbackVar } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { scrollbarSize } from "./Scroll.vars.css.js";

const size = fallbackVar(scrollbarSize, "8px");

export const scroll = recipe({
  base: {
    "@layer": {
      [baseLayer]: {
        boxSizing: "border-box",
        scrollbarWidth: "thin",
        scrollbarColor: `${vars.color.border.strong} transparent`,
        selectors: {
          "&::-webkit-scrollbar": { width: size, height: size },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            background: vars.color.border.strong,
            borderRadius: vars.radius.full,
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: vars.color.border.default,
          },
        },
      },
    },
  },
  variants: {
    axis: {
      x: { "@layer": { [baseLayer]: { overflowX: "auto", overflowY: "hidden" } } },
      y: { "@layer": { [baseLayer]: { overflowX: "hidden", overflowY: "auto" } } },
      xy: { "@layer": { [baseLayer]: { overflow: "auto" } } },
    },
    gutter: {
      true: { "@layer": { [baseLayer]: { scrollbarGutter: "stable" } } },
      false: {},
    },
  },
  defaultVariants: {
    axis: "y",
    gutter: false,
  },
});

export type ScrollRecipeVariants = NonNullable<RecipeVariants<typeof scroll>>;

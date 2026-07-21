import { fallbackVar } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import { vars } from "../../theme/contract.css.js";

import { scrollbarSize } from "./Scroll.vars.css.js";

const size = fallbackVar(scrollbarSize, "8px");

export const scroll = recipe({
  base: {
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
  variants: {
    axis: {
      x: { overflowX: "auto", overflowY: "hidden" },
      y: { overflowX: "hidden", overflowY: "auto" },
      xy: { overflow: "auto" },
    },
    gutter: {
      true: { scrollbarGutter: "stable" },
      false: {},
    },
  },
  defaultVariants: {
    axis: "y",
    gutter: false,
  },
});

export type ScrollRecipeVariants = NonNullable<RecipeVariants<typeof scroll>>;

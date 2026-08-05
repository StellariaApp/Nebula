import { style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

import * as variables from "./Divider.vars.css.js";

const line_border = {
  borderColor: variables.color,
  borderStyle: variables.style,
};

export const root = recipe({
  base: {
    "@layer": {
      [base_layer]: {
        boxSizing: "border-box",
        border: 0,
        margin: 0,
      },
    },
  },
  variants: {
    orientation: {
      horizontal: {
        width: "100%",
      },
      vertical: {
        height: "100%",
        alignSelf: "stretch",
        minHeight: "1em",
        borderInlineStartWidth: variables.thickness,
        ...line_border,
      },
    },
    withLabel: {
      true: {
        display: "flex",
        alignItems: "center",
        gap: vars.space.sm,
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      variants: { orientation: "horizontal", withLabel: false },
      style: {
        borderTopWidth: variables.thickness,
        ...line_border,
      },
    },
  ],
  defaultVariants: {
    orientation: "horizontal",
    withLabel: false,
  },
});

export type DividerRecipeVariants = NonNullable<RecipeVariants<typeof root>>;

export const line = style({
  borderTopWidth: variables.thickness,
  borderColor: variables.color,
  borderStyle: variables.style,
});

export const grow = style({ flexGrow: 1 });

export const fixed = style({ flexGrow: 0, flexBasis: vars.space.lg });

export const label = style({
  "@layer": {
    [base_layer]: {
      flexShrink: 0,
      color: vars.color.text.secondary,
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.caption,
      lineHeight: vars.font.lineHeight.tight,
      whiteSpace: "nowrap",
    },
  },
});

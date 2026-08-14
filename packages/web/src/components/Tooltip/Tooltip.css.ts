import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import { vars } from "../../theme/contract.css.js";
import { primitive_layer } from "../../theme/layers.css.js";

const ARROW_SIZE = "8px";

export const tooltip = recipe({
  base: {
    "@layer": {
      [primitive_layer]: {
        boxSizing: "border-box",
        paddingInline: vars.space.sm,
        paddingBlock: vars.space.sm,
        borderRadius: vars.radius.sm,
        fontFamily: vars.font.family.sans,
        fontSize: vars.font.size.caption,
        fontWeight: vars.font.weight.medium,
        lineHeight: vars.font.lineHeight.tight,
        boxShadow: vars.shadow.md,
        zIndex: vars.zIndex.tooltip,
        pointerEvents: "none",
        maxWidth: "min(90vw, 20rem)",
      },
    },
  },
  variants: {
    color: {
      neutral: {
        "@layer": {
          [primitive_layer]: {
            background: vars.color.surface.overlay,
            color: vars.color.text.primary,
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: vars.color.border.default,
          },
        },
      },
      inverted: {
        "@layer": {
          [primitive_layer]: {
            background: vars.color.gray["900"],
            color: vars.color.text.inverted,
          },
        },
      },
    },
  },
  defaultVariants: { color: "neutral" },
});

export const arrow = style({
  "@layer": {
    [primitive_layer]: {
      position: "absolute",
      width: ARROW_SIZE,
      height: ARROW_SIZE,
      transform: "rotate(45deg)",
      background: "inherit",
      selectors: {
        "&[data-placement='top']": { bottom: `calc(${ARROW_SIZE} / -2)` },
        "&[data-placement='bottom']": { top: `calc(${ARROW_SIZE} / -2)` },
        "&[data-placement='left']": { right: `calc(${ARROW_SIZE} / -2)` },
        "&[data-placement='right']": { left: `calc(${ARROW_SIZE} / -2)` },
      },
    },
  },
});

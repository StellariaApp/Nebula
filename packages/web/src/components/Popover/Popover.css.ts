import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import { vars } from "../../theme/contract.css.js";
import { primitive_layer } from "../../theme/layers.css.js";

const ARROW_SIZE = "8px";

export const popover = recipe({
  base: {
    "@layer": {
      [primitive_layer]: {
        boxSizing: "border-box",
        background: vars.color.surface.overlay,
        color: vars.color.text.primary,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: vars.color.border.default,
        boxShadow: vars.shadow.md,
        zIndex: vars.zIndex.popover,
        maxWidth: "min(92vw, 28rem)",
        outline: "none",
      },
    },
  },
  variants: {
    radius: {
      sm: { borderRadius: vars.radius.sm },
      md: { borderRadius: vars.radius.md },
      lg: { borderRadius: vars.radius.lg },
    },
    padding: {
      none: { padding: 0 },
      sm: { padding: vars.space.sm },
      md: { padding: vars.space.md },
      lg: { padding: vars.space.lg },
    },
  },
  defaultVariants: { radius: "md", padding: "md" },
});

export const arrow = style({
  "@layer": {
    [primitive_layer]: {
      position: "absolute",
      width: ARROW_SIZE,
      height: ARROW_SIZE,
      background: vars.color.surface.overlay,
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: vars.color.border.default,
      transform: "rotate(45deg)",
      selectors: {
        "&[data-placement='top']": {
          bottom: `calc(${ARROW_SIZE} / -2)`,
          borderTopWidth: 0,
          borderLeftWidth: 0,
        },
        "&[data-placement='bottom']": {
          top: `calc(${ARROW_SIZE} / -2)`,
          borderBottomWidth: 0,
          borderRightWidth: 0,
        },
        "&[data-placement='left']": {
          right: `calc(${ARROW_SIZE} / -2)`,
          borderBottomWidth: 0,
          borderLeftWidth: 0,
        },
        "&[data-placement='right']": {
          left: `calc(${ARROW_SIZE} / -2)`,
          borderTopWidth: 0,
          borderRightWidth: 0,
        },
      },
    },
  },
});

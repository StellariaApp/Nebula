import { globalStyle, style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { segCount, segIndex } from "./SegmentedControl.vars.css.js";

export const root = recipe({
  base: {
    "@layer": {
      [baseLayer]: {
        position: "relative",
        display: "inline-flex",
        boxSizing: "border-box",
        padding: "3px",
        background: vars.color.surface.sunken,
        borderRadius: vars.radius.md,
        fontFamily: vars.font.family.sans,
        selectors: { "&[data-disabled='true']": { opacity: 0.55, cursor: "not-allowed" } },
      },
    },
  },
  variants: {
    size: {
      xs: { height: vars.size.xs, fontSize: vars.font.size.body3 },
      sm: { height: vars.size.sm, fontSize: vars.font.size.body2 },
      md: { height: vars.size.md, fontSize: vars.font.size.body1 },
      lg: { height: vars.size.lg, fontSize: vars.font.size.body1 },
      xl: { height: vars.size.xl, fontSize: vars.font.size.h6 },
    },
    fullWidth: {
      true: { display: "flex", width: "100%" },
      false: {},
    },
  },
  defaultVariants: { size: "md", fullWidth: false },
});

export type SegmentedRecipeVariants = NonNullable<RecipeVariants<typeof root>>;

export const indicator = style({
  position: "absolute",
  top: "3px",
  bottom: "3px",
  insetInlineStart: "3px",
  width: `calc((100% - 6px) / ${segCount})`,
  transform: `translateX(calc(${segIndex} * 100%))`,
  background: vars.color.surface.raised,
  borderRadius: vars.radius.sm,
  boxShadow: vars.shadow.xs,
  transitionProperty: "transform",
  transitionDuration: vars.motion.duration.base,
  transitionTimingFunction: vars.motion.easing.standard,
  "@media": { "(prefers-reduced-motion: reduce)": { transitionDuration: "0.01ms" } },
});

export const segment = style({
  position: "relative",
  zIndex: 1,
  flex: 1,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  paddingInline: vars.space.md,
  cursor: "pointer",
  color: vars.color.text.secondary,
  whiteSpace: "nowrap",
  userSelect: "none",
  transition: `color ${vars.motion.duration.fast} ${vars.motion.easing.standard}`,
  selectors: {
    "&[data-active='true']": { color: vars.color.text.primary },
    "&[data-disabled='true']": { cursor: "not-allowed", opacity: 0.55 },
  },
});

export const input = style({
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: 0,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
});

export const segmentLabel = style({ lineHeight: vars.font.lineHeight.tight });

globalStyle(`${input}:focus-visible + ${segmentLabel}`, {
  outline: `2px solid ${vars.color.border.focus}`,
  outlineOffset: "3px",
  borderRadius: vars.radius.xs,
});

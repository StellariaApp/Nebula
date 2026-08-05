import { fallbackVar, globalStyle, style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import * as motion from "../../styles/motion.css.js";
import * as focus from "../../styles/focus.css.js";
import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

import { indicatorColor, indicatorFg } from "./Segment.vars.css.js";

export const root = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.md,
      fontFamily: vars.font.family.sans,
      minWidth: 0,
    },
  },
});

export const control = recipe({
  base: {
    "@layer": {
      [base_layer]: {
        position: "relative",
        display: "inline-flex",
        boxSizing: "border-box",
        padding: vars.space.xs,
        background: vars.color.surface.sunken,
        borderRadius: vars.radius.full,
        fontFamily: vars.font.family.sans,
        alignSelf: "flex-start",
        selectors: {
          "&[data-disabled='true']": { cursor: "not-allowed" },
        },
      },
    },
  },
  variants: {
    size: {
      sm: { height: vars.size.control.xs, fontSize: vars.font.size.body3 },
      md: { height: vars.size.control.sm, fontSize: vars.font.size.body2 },
      lg: { height: vars.size.control.md, fontSize: vars.font.size.button },
      xl: { height: vars.size.control.lg, fontSize: vars.font.size.body1 },
    },
    fullWidth: {
      true: { display: "flex", width: "100%", alignSelf: "stretch" },
      false: {},
    },
  },
  defaultVariants: { size: "md", fullWidth: false },
});

export type SegmentControlVariants = NonNullable<RecipeVariants<typeof control>>;

export const indicator = style({
  "@layer": {
    [base_layer]: {
      position: "absolute",
      top: vars.space.xs,
      bottom: vars.space.xs,
      insetInlineStart: 0,
      background: indicatorColor,
      borderRadius: vars.radius.full,
      boxShadow: vars.shadow.xxs,
      touchAction: "none",
      zIndex: 0,
    },
  },
});

export const tab = style({
  "@layer": {
    [base_layer]: {
      position: "relative",
      zIndex: 1,
      flex: 1,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      paddingInline: vars.space.u3,
      border: "none",
      background: "transparent",
      font: "inherit",
      fontWeight: vars.font.weight.semibold,
      lineHeight: vars.font.lineHeight.normal,
      cursor: "pointer",
      color: vars.color.text.secondary,
      whiteSpace: "nowrap",
      userSelect: "none",
      borderRadius: vars.radius.full,
      ...motion.interaction,
      outline: "none",
      selectors: {
        "&[data-active='true']": { color: fallbackVar(indicatorFg, vars.color.text.primary) },
        "&[data-disabled='true']": { cursor: "not-allowed", color: vars.color.text.muted },
        "&:focus-visible": {
          ...focus.ring,
        },
      },
      "@media": {
        "(prefers-reduced-motion: reduce)": motion.still,
      },
    },
  },
});

export const content = style({
  "@layer": {
    [base_layer]: {
      position: "relative",
      overflow: "hidden",
      width: "100%",
      minWidth: 0,
    },
  },
});

export const viewport = style({
  display: "flex",
  flexDirection: "row",
  touchAction: "pan-y",
});

export const panel = recipe({
  base: {
    flexShrink: 0,
    width: "100%",
    minWidth: 0,
  },
  variants: {
    fill: {
      true: { height: "100%" },
      false: {},
    },
  },
  defaultVariants: { fill: false },
});

export const section = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.xs,
      minWidth: 0,
    },
  },
});

globalStyle(`${panel.classNames.base}[aria-hidden='true']`, { pointerEvents: "none" });

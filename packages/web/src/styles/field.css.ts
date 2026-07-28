import { style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import * as focus from "./focus.css.js";
import * as motion from "../styles/motion.css.js";
import { vars } from "../theme/contract.css.js";
import { baseLayer } from "../theme/layers.css.js";

export const root = style({
  "@layer": {
    [baseLayer]: { display: "flex", flexDirection: "column", gap: vars.space.sm },
  },
});

export const label = style({
  "@layer": {
    [baseLayer]: {
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.body2,
      fontWeight: vars.font.weight.medium,
      lineHeight: vars.font.lineHeight.tight,
      color: vars.color.text.primary,
    },
  },
});

export const required = style({
  "@layer": {
    [baseLayer]: { color: vars.color.semantic.error["500"], marginInlineStart: "0.15em" },
  },
});

export const description = style({
  "@layer": {
    [baseLayer]: {
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.caption,
      lineHeight: vars.font.lineHeight.normal,
      color: vars.color.text.muted,
    },
  },
});

export const error = style({
  "@layer": {
    [baseLayer]: {
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.caption,
      lineHeight: vars.font.lineHeight.normal,
      color: vars.color.semantic.error["600"],
    },
  },
});

export const field = recipe({
  base: {
    "@layer": {
      [baseLayer]: {
        display: "flex",
        alignItems: "center",
        gap: vars.space.xs,
        boxSizing: "border-box",
        width: "100%",
        fontFamily: vars.font.family.sans,
        color: vars.color.text.primary,
        background: vars.color.surface.raised,
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: vars.color.border.default,
        borderRadius: vars.radius.md,
        ...motion.interaction,
        ...motion.reducedMotion,
        selectors: {
          "&:hover:not([data-disabled='true']):not([data-invalid='true'])": {
            borderColor: vars.color.border.strong,
          },
          "&:focus-within": focus.ring,
          "&[data-invalid='true']": { borderColor: vars.color.semantic.error["500"] },
          "&[data-invalid='true']:focus-within": {
            vars: { [focus.halo]: vars.color.semantic.error["500"] },
          },
          "&[data-disabled='true']": {
            cursor: "not-allowed",
            background: vars.color.surface.sunken,
            borderColor: vars.color.border.subtle,
            color: vars.color.text.secondary,
          },
        },
      },
    },
  },
  variants: {
    size: {
      xs: { minHeight: vars.size.control.xs, paddingInline: vars.space.sm, fontSize: vars.font.size.body3 },
      sm: { minHeight: vars.size.control.sm, paddingInline: vars.space.sm, fontSize: vars.font.size.body2 },
      md: { minHeight: vars.size.control.md, paddingInline: vars.space.md, fontSize: vars.font.size.body1 },
      lg: { minHeight: vars.size.control.lg, paddingInline: vars.space.md, fontSize: vars.font.size.body1 },
      xl: { minHeight: vars.size.control.xl, paddingInline: vars.space.lg, fontSize: vars.font.size.h6 },
    },
    multiline: {
      true: { alignItems: "stretch", paddingBlock: vars.space.sm },
      false: {},
    },
  },
  defaultVariants: { size: "md", multiline: false },
});

export type FieldRecipeVariants = NonNullable<RecipeVariants<typeof field>>;

export const input = style({
  "@layer": {
    [baseLayer]: {
      flex: 1,
      minWidth: 0,
      margin: 0,
      padding: 0,
      border: 0,
      background: "transparent",
      color: "inherit",
      font: "inherit",
      lineHeight: vars.font.lineHeight.normal,
      outline: "none",
      appearance: "none",
      selectors: {
        "&::placeholder": { color: vars.color.text.muted },
        "&:disabled": { cursor: "not-allowed" },
      },
    },
  },
});

export const textarea = style({
  "@layer": {
    [baseLayer]: {
      resize: "vertical",
      minHeight: "4.5em",
    },
  },
});

export const section = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  color: vars.color.text.muted,
  lineHeight: 0,
});

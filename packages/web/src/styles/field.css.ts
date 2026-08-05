import { style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import * as focus from "./focus.css.js";
import * as focus_vars from "./focus.vars.css.js";
import * as motion from "../styles/motion.css.js";
import { vars } from "../theme/contract.css.js";
import { base_layer } from "../theme/layers.css.js";

import * as variables from "./field.vars.css.js";

export const root = style({
  "@layer": {
    [base_layer]: { display: "flex", flexDirection: "column", gap: vars.space.sm },
  },
});

export const label = style({
  "@layer": {
    [base_layer]: {
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
    [base_layer]: { color: vars.color.semantic.error["600"], marginInlineStart: "0.15em" },
  },
});

export const description = style({
  "@layer": {
    [base_layer]: {
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.caption,
      lineHeight: vars.font.lineHeight.normal,
      color: vars.color.text.muted,
    },
  },
});

export const error = style({
  "@layer": {
    [base_layer]: {
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
      [base_layer]: {
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box",
        width: "100%",
        fontFamily: vars.font.family.sans,
        color: vars.color.text.primary,
        background: variables.bg,
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: variables.bd,
        borderRadius: vars.radius.md,
        ...motion.interaction,
        ...motion.reduced_motion,
        selectors: {
          "&:hover:not([data-disabled='true']):not([data-invalid='true'])": {
            background: variables.bgHover,
            borderColor: variables.bdHover,
          },
          "&:focus-within": focus.ring,
          "&[data-invalid='true']": { borderColor: vars.color.semantic.error["500"] },
          "&[data-invalid='true']:focus-within": {
            vars: { [focus_vars.halo]: vars.color.semantic.error["500"] },
          },
          "&[data-disabled='true']": {
            cursor: "not-allowed",
            background: variables.bgDisabled,
            borderColor: variables.bdDisabled,
            color: vars.color.text.disabled,
          },
        },
      },
    },
  },
  variants: {
    size: {
      xs: {
        minHeight: vars.size.control.xs,
        paddingInline: vars.space.sm,
        gap: vars.space.sm,
        fontSize: vars.font.size.body3,
      },
      sm: {
        minHeight: vars.size.control.sm,
        paddingInline: vars.space.sm,
        gap: vars.space.sm,
        fontSize: vars.font.size.body2,
      },
      md: {
        minHeight: vars.size.control.md,
        paddingInline: vars.space.md,
        gap: vars.space.u3,
        fontSize: vars.font.size.body1,
      },
      lg: {
        minHeight: vars.size.control.lg,
        paddingInline: vars.space.md,
        gap: vars.space.u3,
        fontSize: vars.font.size.body1,
      },
      xl: {
        minHeight: vars.size.control.xl,
        paddingInline: vars.space.lg,
        gap: vars.space.md,
        fontSize: vars.font.size.h6,
      },
    },
    multiline: {
      true: { alignItems: "stretch", paddingBlock: vars.space.sm },
      false: {},
    },
    surface: {
      outline: {
        vars: {
          [variables.bg]: vars.color.surface.sunken,
          [variables.bd]: vars.color.border.default,
          [variables.bgHover]: vars.color.surface.sunken,
          [variables.bdHover]: vars.color.border.strong,
          [variables.bgDisabled]: vars.color.surface.disabled,
          [variables.bdDisabled]: vars.color.border.disabled,
        },
      },
      filled: {
        vars: {
          [variables.bg]: vars.color.surface.sunken,
          [variables.bd]: "transparent",
          [variables.bgHover]: vars.color.surface.sunken,
          [variables.bdHover]: vars.color.border.default,
          [variables.bgDisabled]: vars.color.surface.disabled,
          [variables.bdDisabled]: "transparent",
        },
      },
      underline: {
        borderWidth: "0 0 1px",
        borderRadius: 0,
        paddingInline: 0,
        vars: {
          [variables.bg]: "transparent",
          [variables.bd]: vars.color.border.default,
          [variables.bgHover]: "transparent",
          [variables.bdHover]: vars.color.border.strong,
          [variables.bgDisabled]: "transparent",
          [variables.bdDisabled]: vars.color.border.disabled,
        },
      },
      unstyled: {
        borderWidth: 0,
        borderRadius: 0,
        paddingInline: 0,
        vars: {
          [variables.bg]: "transparent",
          [variables.bd]: "transparent",
          [variables.bgHover]: "transparent",
          [variables.bdHover]: "transparent",
          [variables.bgDisabled]: "transparent",
          [variables.bdDisabled]: "transparent",
        },
      },
    },
  },
  defaultVariants: { size: "md", multiline: false, surface: "outline" },
});

export type FieldRecipeVariants = NonNullable<RecipeVariants<typeof field>>;

export const input = style({
  "@layer": {
    [base_layer]: {
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
        "&::placeholder": { color: vars.color.text.placeholder },
        "&:disabled": { cursor: "not-allowed" },
        "&:disabled::placeholder": { color: vars.color.text.disabled },
      },
    },
  },
});

export const textarea = style({
  "@layer": {
    [base_layer]: {
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

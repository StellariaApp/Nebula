import { keyframes, style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import {
  backdropFilter,
  bg,
  bgActive,
  bgHover,
  borderColor,
  borderWidth,
  fg,
  glow,
} from "./Button.vars.css.js";

export const button = recipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    boxSizing: "border-box",
    margin: 0,
    fontFamily: vars.font.family.sans,
    fontWeight: vars.font.weight.medium,
    lineHeight: vars.font.lineHeight.tight,
    letterSpacing: vars.font.letterSpacing.normal,
    textDecoration: "none",
    whiteSpace: "nowrap",
    cursor: "pointer",
    userSelect: "none",
    appearance: "none",
    borderRadius: vars.radius.md,
    borderStyle: "solid",
    borderWidth,
    borderColor,
    background: bg,
    color: fg,
    backdropFilter,
    boxShadow: glow,
    transitionProperty: "background, border-color, box-shadow, opacity",
    transitionDuration: vars.motion.duration.fast,
    transitionTimingFunction: vars.motion.easing.standard,
    selectors: {
      "&[data-hovered='true']:not([data-disabled='true'])": { background: bgHover },
      "&[data-pressed='true']:not([data-disabled='true'])": { background: bgActive },
      "&[data-focus-visible='true']": {
        outline: `2px solid ${vars.color.border.focus}`,
        outlineOffset: "2px",
      },
      "&[data-disabled='true']": { cursor: "not-allowed", opacity: 0.55 },
      "&[data-loading='true']": { cursor: "progress" },
    },
    "@media": {
      "(prefers-reduced-motion: reduce)": { transitionDuration: "0.01ms" },
    },
  },
  variants: {
    size: {
      xs: {
        height: vars.size.xs,
        paddingInline: vars.space.sm,
        gap: vars.space.xxs,
        fontSize: vars.font.size.body3,
      },
      sm: {
        height: vars.size.sm,
        paddingInline: vars.space.sm,
        gap: vars.space.xs,
        fontSize: vars.font.size.body2,
      },
      md: {
        height: vars.size.md,
        paddingInline: vars.space.md,
        gap: vars.space.xs,
        fontSize: vars.font.size.button,
      },
      lg: {
        height: vars.size.lg,
        paddingInline: vars.space.md,
        gap: vars.space.sm,
        fontSize: vars.font.size.button,
      },
      xl: {
        height: vars.size.xl,
        paddingInline: vars.space.lg,
        gap: vars.space.sm,
        fontSize: vars.font.size.h6,
      },
    },
    fullWidth: {
      true: { width: "100%" },
      false: {},
    },
  },
  defaultVariants: {
    size: "md",
    fullWidth: false,
  },
});

export type ButtonRecipeVariants = NonNullable<RecipeVariants<typeof button>>;

export const section = style({
  "@layer": {
    [baseLayer]: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
  },
});

export const labelLoading = style({
  opacity: 0,
});

const SPIN = keyframes({
  to: { transform: "rotate(360deg)" },
});

export const spinner = style({
  position: "absolute",
  width: "1em",
  height: "1em",
  borderRadius: vars.radius.full,
  border: "2px solid currentColor",
  borderTopColor: "transparent",
  animation: `${SPIN} 700ms linear infinite`,
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animationDuration: "1800ms",
    },
  },
});

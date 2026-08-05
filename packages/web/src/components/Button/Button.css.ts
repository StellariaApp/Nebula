import { keyframes, style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import * as motion from "../../styles/motion.css.js";
import * as focus from "../../styles/focus.css.js";
import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

import * as variables from "./Button.vars.css.js";

const GRADIENT_SHIFT = keyframes({
  "0%": { backgroundPosition: "0% 50%" },
  "50%": { backgroundPosition: "100% 50%" },
  "100%": { backgroundPosition: "0% 50%" },
});

const GLOW_PULSE = keyframes({
  "0%": { opacity: 0.45 },
  "50%": { opacity: 0.7 },
  "100%": { opacity: 0.45 },
});

export const button = recipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    boxSizing: "border-box",
    margin: 0,
    fontFamily: vars.font.family.sans,
    fontWeight: vars.font.weight.semibold,
    lineHeight: vars.font.lineHeight.normal,
    letterSpacing: vars.font.letterSpacing.normal,
    textDecoration: "none",
    whiteSpace: "nowrap",
    cursor: "pointer",
    userSelect: "none",
    appearance: "none",
    borderRadius: vars.radius.md,
    borderStyle: "solid",
    borderWidth: variables.borderWidth,
    borderColor: variables.borderColor,
    background: variables.bg,
    color: variables.fg,
    backdropFilter: variables.backdropFilter,
    ...motion.interaction,
    "::after": {
      content: '""',
      position: "absolute",
      inset: 0,
      zIndex: -1,
      borderRadius: "inherit",
      boxShadow: variables.glow,
      opacity: 0,
      pointerEvents: "none",
      ...motion.interaction,
    },
    selectors: {
      "&[data-hovered='true']:not([data-disabled='true'])": { background: variables.bgHover },
      "&[data-pressed='true']:not([data-disabled='true'])": { background: variables.bgActive },
      "&[data-focus-visible='true']": {
        ...focus.ring,
      },
      "&[data-disabled='true']": { cursor: "not-allowed", opacity: 0.55 },
      "&[data-loading='true']": { cursor: "progress" },
      "&[data-gradient-animated='true']": {
        backgroundSize: "200% 200%",
        animationName: GRADIENT_SHIFT,
        animationDuration: `calc(${vars.motion.duration.expressive} * 12)`,
        animationTimingFunction: vars.motion.easing.standard,
        animationIterationCount: "infinite",
      },
      "&[data-variant='glow']::after": { opacity: 0.55 },
      "&[data-glow-idle='true']::after": {
        animationName: GLOW_PULSE,
        animationDuration: `calc(${vars.motion.duration.expressive} * 6)`,
        animationTimingFunction: vars.motion.easing.standard,
        animationIterationCount: "infinite",
      },
      "&[data-variant='glow'][data-hovered='true']::after": {
        animationName: "none",
        opacity: 1,
      },
    },
    "@media": {
      "(prefers-reduced-motion: reduce)": motion.still,
    },
  },
  variants: {
    size: {
      xs: {
        height: vars.size.control.xs,
        paddingInline: vars.space.sm,
        gap: vars.space.xxs,
        fontSize: vars.font.size.body3,
      },
      sm: {
        height: vars.size.control.sm,
        paddingInline: vars.space.md,
        gap: vars.space.xs,
        fontSize: vars.font.size.body2,
      },
      md: {
        height: vars.size.control.md,
        paddingInline: vars.space.lg,
        gap: vars.space.xs,
        fontSize: vars.font.size.button,
      },
      lg: {
        height: vars.size.control.lg,
        paddingInline: vars.space.xl,
        gap: vars.space.sm,
        fontSize: vars.font.size.button,
      },
      xl: {
        height: vars.size.control.xl,
        paddingInline: vars.space.xxl,
        gap: vars.space.sm,
        fontSize: vars.font.size.body1,
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
    [base_layer]: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
  },
});

export const label_loading = style({
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
  animationName: SPIN,
  animationDuration: vars.motion.duration.expressive,
  animationTimingFunction: vars.motion.easing.standard,
  animationIterationCount: "infinite",
  "@media": {
    "(prefers-reduced-motion: reduce)": motion.still,
  },
});

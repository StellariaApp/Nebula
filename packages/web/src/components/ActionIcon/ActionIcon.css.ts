import { keyframes, style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import * as motion from "../../styles/motion.css.js";
import * as focus from "../../styles/focus.css.js";
import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

import {
  backdropFilter,
  bg,
  bgActive,
  bgHover,
  borderColor,
  borderWidth,
  fg,
  glow,
} from "./ActionIcon.vars.css.js";

export const action_icon = recipe({
  base: {
    "@layer": {
      [base_layer]: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        boxSizing: "border-box",
        padding: 0,
        margin: 0,
        flexShrink: 0,
        appearance: "none",
        cursor: "pointer",
        userSelect: "none",
        borderRadius: vars.radius.md,
        borderStyle: "solid",
        borderWidth,
        borderColor,
        background: bg,
        color: fg,
        backdropFilter,
        boxShadow: glow,
        ...motion.interaction,
        selectors: {
          "&[data-hovered='true']:not([data-disabled='true'])": { background: bgHover },
          "&[data-pressed='true']:not([data-disabled='true'])": { background: bgActive },
          "&[data-focus-visible='true']": {
            ...focus.ring,
          },
          "&[data-disabled='true']": { cursor: "not-allowed", opacity: 0.55 },
          "&[data-loading='true']": { cursor: "progress" },
        },
        "@media": {
          "(prefers-reduced-motion: reduce)": motion.still,
        },
      },
    },
  },
  variants: {
    size: {
      xs: {
        "@layer": {
          [base_layer]: {
            width: vars.size.control.xs,
            height: vars.size.control.xs,
            fontSize: `calc(${vars.size.control.xs} / 2)`,
          },
        },
      },
      sm: {
        "@layer": {
          [base_layer]: {
            width: vars.size.control.sm,
            height: vars.size.control.sm,
            fontSize: `calc(${vars.size.control.sm} / 2)`,
          },
        },
      },
      md: {
        "@layer": {
          [base_layer]: {
            width: vars.size.control.md,
            height: vars.size.control.md,
            fontSize: `calc(${vars.size.control.md} / 2)`,
          },
        },
      },
      lg: {
        "@layer": {
          [base_layer]: {
            width: vars.size.control.lg,
            height: vars.size.control.lg,
            fontSize: `calc(${vars.size.control.lg} / 2)`,
          },
        },
      },
      xl: {
        "@layer": {
          [base_layer]: {
            width: vars.size.control.xl,
            height: vars.size.control.xl,
            fontSize: `calc(${vars.size.control.xl} / 2)`,
          },
        },
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export type ActionIconRecipeVariants = NonNullable<RecipeVariants<typeof action_icon>>;

export const icon_wrap = style({
  "@layer": {
    [base_layer]: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      lineHeight: 0,
    },
  },
});

export const icon_loading = style({ opacity: 0 });

const SPIN = keyframes({ to: { transform: "rotate(360deg)" } });

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

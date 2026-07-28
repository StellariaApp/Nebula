import { keyframes, style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import * as motion from "../../styles/motion.css.js";
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
} from "./ActionIcon.vars.css.js";

export const actionIcon = recipe({
  base: {
    "@layer": {
      [baseLayer]: {
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
            outline: `2px solid ${vars.color.border.focus}`,
            outlineOffset: "2px",
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
          [baseLayer]: {
            width: vars.size.xs,
            height: vars.size.xs,
            fontSize: `calc(${vars.size.xs} / 2)`,
          },
        },
      },
      sm: {
        "@layer": {
          [baseLayer]: {
            width: vars.size.sm,
            height: vars.size.sm,
            fontSize: `calc(${vars.size.sm} / 2)`,
          },
        },
      },
      md: {
        "@layer": {
          [baseLayer]: {
            width: vars.size.md,
            height: vars.size.md,
            fontSize: `calc(${vars.size.md} / 2)`,
          },
        },
      },
      lg: {
        "@layer": {
          [baseLayer]: {
            width: vars.size.lg,
            height: vars.size.lg,
            fontSize: `calc(${vars.size.lg} / 2)`,
          },
        },
      },
      xl: {
        "@layer": {
          [baseLayer]: {
            width: vars.size.xl,
            height: vars.size.xl,
            fontSize: `calc(${vars.size.xl} / 2)`,
          },
        },
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export type ActionIconRecipeVariants = NonNullable<RecipeVariants<typeof actionIcon>>;

export const iconWrap = style({
  "@layer": {
    [baseLayer]: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      lineHeight: 0,
    },
  },
});

export const iconLoading = style({ opacity: 0 });

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

import { keyframes, style, styleVariants } from "@vanilla-extract/css";

import * as motion from "../../styles/motion.css.js";
import { vars } from "@stellaria/nebula-themes/web";
import { component_layer } from "../../theme/layers.css.js";

import * as variables from "./Indicator.vars.css.js";

const pulse = keyframes({
  "0%": { transform: "scale(1)", opacity: 1 },
  "70%": { transform: "scale(1.7)", opacity: 0 },
  "100%": { transform: "scale(1.7)", opacity: 0 },
});

export const root = style({
  "@layer": {
    [component_layer]: { position: "relative", display: "inline-flex" },
  },
});

export const dot = style({
  "@layer": {
    [component_layer]: {
      position: "absolute",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      boxSizing: "border-box",
      background: variables.dotColor,
      color: vars.color.text.onPrimary,
      borderRadius: vars.radius.full,
      fontFamily: vars.font.family.sans,
      fontWeight: vars.font.weight.semibold,
      fontVariantNumeric: "tabular-nums",
      lineHeight: 1,
      pointerEvents: "none",
      zIndex: 1,
    },
  },
});

export const bordered = style({
  "@layer": {
    [component_layer]: {
      borderWidth: 2,
      borderStyle: "solid",
      borderColor: vars.color.surface.base,
    },
  },
});

export const bare = style({});

export const badge = style({
  "@layer": {
    [component_layer]: { paddingInline: vars.space.xxs },
  },
});

export const processing = style({
  "@layer": {
    [component_layer]: {
      selectors: {
        "&::after": {
          content: "",
          position: "absolute",
          inset: -2,
          borderRadius: vars.radius.full,
          background: variables.dotColor,
          animationName: pulse,
          animationDuration: `calc(${vars.motion.duration.base} * 9)`,
          animationIterationCount: "infinite",
          animationTimingFunction: "ease-out",
        },
      },
      "@media": { "(prefers-reduced-motion: reduce)": motion.still },
    },
  },
});

const Dot = (step: string): string => `calc(${step} / 2)`;

export const size = styleVariants({
  xs: {
    minWidth: Dot(vars.size.compact.xs),
    height: Dot(vars.size.compact.xs),
    fontSize: vars.font.size.caption,
  },
  sm: {
    minWidth: Dot(vars.size.compact.sm),
    height: Dot(vars.size.compact.sm),
    fontSize: vars.font.size.caption,
  },
  md: {
    minWidth: Dot(vars.size.compact.md),
    height: Dot(vars.size.compact.md),
    fontSize: vars.font.size.caption,
  },
  lg: {
    minWidth: Dot(vars.size.compact.lg),
    height: Dot(vars.size.compact.lg),
    fontSize: vars.font.size.body3,
  },
  xl: {
    minWidth: Dot(vars.size.compact.xl),
    height: Dot(vars.size.compact.xl),
    fontSize: vars.font.size.body2,
  },
});

export const placement = styleVariants({
  "top-start": {
    top: variables.dotOffset,
    insetInlineStart: variables.dotOffset,
    transform: "translate(-40%, -40%)",
  },
  "top-end": {
    top: variables.dotOffset,
    insetInlineEnd: variables.dotOffset,
    transform: "translate(40%, -40%)",
  },
  "bottom-start": {
    bottom: variables.dotOffset,
    insetInlineStart: variables.dotOffset,
    transform: "translate(-40%, 40%)",
  },
  "bottom-end": {
    bottom: variables.dotOffset,
    insetInlineEnd: variables.dotOffset,
    transform: "translate(40%, 40%)",
  },
});

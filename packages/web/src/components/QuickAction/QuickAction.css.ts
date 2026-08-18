import { keyframes, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import * as focus from "../../styles/focus.css.js";
import * as motion from "../../styles/motion.css.js";
import { vars } from "@stellaria/nebula-themes/web";
import { component_layer } from "../../theme/layers.css.js";

import * as variables from "./QuickAction.vars.css.js";

const GLOW_PULSE = keyframes({
  "0%": { opacity: 0.45 },
  "50%": { opacity: 0.7 },
  "100%": { opacity: 0.45 },
});

export const tile = recipe({
  base: {
    display: "inline-flex",
    position: "relative",
    boxSizing: "border-box",
    margin: 0,
    textAlign: "start",
    textDecoration: "none",
    cursor: "pointer",
    userSelect: "none",
    appearance: "none",
    fontFamily: vars.font.family.sans,
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
      "&[data-focus-visible='true']": { ...focus.ring },
      "&[data-disabled='true']": { cursor: "not-allowed", opacity: 0.55 },
      "&[data-loading='true']": { cursor: "progress" },
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
    orientation: {
      vertical: { flexDirection: "column", alignItems: "flex-start" },
      horizontal: { flexDirection: "row", alignItems: "center" },
    },
    size: {
      xs: { padding: vars.space.xs, gap: vars.space.xxs, minHeight: vars.size.compact.xl },
      sm: { padding: vars.space.sm, gap: vars.space.xxs, minHeight: vars.size.control.lg },
      md: { padding: vars.space.md, gap: vars.space.xs, minHeight: vars.size.control.xl },
      lg: { padding: vars.space.md, gap: vars.space.sm, minHeight: vars.size.control.xl },
      xl: { padding: vars.space.lg, gap: vars.space.sm, minHeight: vars.size.control.xl },
    },
    fullWidth: {
      true: { display: "flex", width: "100%" },
      false: {},
    },
  },
  defaultVariants: { orientation: "vertical", size: "md", fullWidth: false },
});

export const icon = recipe({
  base: {
    "@layer": {
      [component_layer]: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        borderRadius: vars.radius.md,
        background: "color-mix(in srgb, currentColor 14%, transparent)",
        lineHeight: 0,
      },
    },
  },
  variants: {
    size: {
      xs: {
        width: vars.size.compact.md,
        height: vars.size.compact.md,
        fontSize: vars.font.size.body3,
      },
      sm: {
        width: vars.size.compact.lg,
        height: vars.size.compact.lg,
        fontSize: vars.font.size.body2,
      },
      md: {
        width: vars.size.control.sm,
        height: vars.size.control.sm,
        fontSize: vars.font.size.body1,
      },
      lg: {
        width: vars.size.control.md,
        height: vars.size.control.md,
        fontSize: vars.font.size.h6,
      },
      xl: {
        width: vars.size.control.lg,
        height: vars.size.control.lg,
        fontSize: vars.font.size.h5,
      },
    },
  },
  defaultVariants: { size: "md" },
});

export const body = style({
  "@layer": {
    [component_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.xxs,
      minWidth: 0,
      flex: 1,
    },
  },
});

export const label = style({
  "@layer": {
    [component_layer]: {
      fontWeight: vars.font.weight.semibold,
      fontSize: vars.font.size.body2,
      lineHeight: vars.font.lineHeight.tight,
    },
  },
});

export const description = style({
  "@layer": {
    [component_layer]: {
      fontSize: vars.font.size.body3,
      lineHeight: vars.font.lineHeight.normal,
      opacity: 0.75,
    },
  },
});

export const badge = style({
  "@layer": {
    [component_layer]: {
      position: "absolute",
      insetBlockStart: vars.space.xs,
      insetInlineEnd: vars.space.xs,
      display: "inline-flex",
    },
  },
});

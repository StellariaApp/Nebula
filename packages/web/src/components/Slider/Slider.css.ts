import { fallbackVar, style, styleVariants } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import * as motion from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { sliderColor, trackBg, trackBorder, trackBorderWidth } from "./Slider.vars.css.js";

const TOUCH_TARGET = 24;

export const root = style({
  "@layer": {
    [baseLayer]: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      width: "100%",
      touchAction: "none",
      selectors: {
        "&[data-disabled='true']": { cursor: "not-allowed" },
      },
    },
  },
});

export const track = style({
  "@layer": {
    [baseLayer]: {
      position: "relative",
      width: "100%",
      boxSizing: "border-box",
      borderRadius: vars.radius.full,
      background: fallbackVar(trackBg, vars.color.surface.sunken),
      borderStyle: "solid",
      borderWidth: fallbackVar(trackBorderWidth, "0"),
      borderColor: fallbackVar(trackBorder, "transparent"),
      selectors: {
        "&[data-disabled='true']": {
          background: vars.color.surface.disabled,
          borderColor: "transparent",
        },
      },
    },
  },
});

export const fill = style({
  "@layer": {
    [baseLayer]: {
      position: "absolute",
      insetBlock: 0,
      borderRadius: vars.radius.full,
      background: sliderColor,
      selectors: {
        "&[data-disabled='true']": { background: vars.color.border.disabled },
      },
    },
  },
});

export const thumb = style({
  "@layer": {
    [baseLayer]: {
      position: "absolute",
      top: "50%",
      boxSizing: "border-box",
      borderRadius: vars.radius.full,
      background: vars.color.surface.raised,
      borderWidth: 3,
      borderStyle: "solid",
      borderColor: sliderColor,
      boxShadow: vars.shadow.xs,
      outline: "none",
      cursor: "grab",
      ...motion.interaction,
      ...motion.reducedMotion,
      "::after": {
        content: "",
        position: "absolute",
        top: "50%",
        insetInlineStart: "50%",
        translate: "-50% -50%",
        minWidth: TOUCH_TARGET,
        minHeight: TOUCH_TARGET,
        width: "100%",
        height: "100%",
      },
      selectors: {
        "&[data-focus-visible='true']": focus.ring,
        "&[data-dragging='true']": { cursor: "grabbing" },
        "&[data-disabled='true']": {
          borderColor: vars.color.border.disabled,
          cursor: "not-allowed",
        },
      },
    },
  },
});

export const rootWithMarks = style({
  "@layer": {
    [baseLayer]: {
      marginBlockEnd: vars.space.lg,
    },
  },
});

export const marks = style({
  "@layer": {
    [baseLayer]: {
      position: "absolute",
      insetInline: 0,
      top: "100%",
      marginBlockStart: vars.space.sm,
      height: 0,
    },
  },
});

export const mark = style({
  "@layer": {
    [baseLayer]: {
      position: "absolute",
      transform: "translateX(-50%)",
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.caption,
      fontWeight: vars.font.weight.bold,
      lineHeight: vars.font.lineHeight.tight,
      color: vars.color.text.muted,
      whiteSpace: "nowrap",
    },
  },
});

export const output = style({
  "@layer": {
    [baseLayer]: {
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.body3,
      fontVariantNumeric: "tabular-nums",
      color: vars.color.text.secondary,
      flexShrink: 0,
      minWidth: "4ch",
      textAlign: "end",
    },
  },
});

export const row = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.md,
      width: "100%",
    },
  },
});

const Track = (step: string): string => `calc(${step} / 8)`;
const Thumb = (step: string): string => `calc(${step} / 2)`;

export const trackSize = styleVariants({
  xs: { height: Track(vars.size.control.xs) },
  sm: { height: Track(vars.size.control.sm) },
  md: { height: Track(vars.size.control.md) },
  lg: { height: Track(vars.size.control.lg) },
  xl: { height: Track(vars.size.control.xl) },
});

export const thumbSize = styleVariants({
  xs: { width: Thumb(vars.size.control.xs), height: Thumb(vars.size.control.xs) },
  sm: { width: Thumb(vars.size.control.sm), height: Thumb(vars.size.control.sm) },
  md: { width: Thumb(vars.size.control.md), height: Thumb(vars.size.control.md) },
  lg: { width: Thumb(vars.size.control.lg), height: Thumb(vars.size.control.lg) },
  xl: { width: Thumb(vars.size.control.xl), height: Thumb(vars.size.control.xl) },
});

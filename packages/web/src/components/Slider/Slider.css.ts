import { style, styleVariants } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import * as motion from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { sliderColor } from "./Slider.vars.css.js";

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
      borderRadius: vars.radius.full,
      background: vars.color.surface.sunken,
      selectors: {
        "&[data-disabled='true']": { background: vars.color.surface.disabled },
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

export const trackSize = styleVariants({
  xs: { height: 4 },
  sm: { height: 5 },
  md: { height: 6 },
  lg: { height: 8 },
  xl: { height: 10 },
});

export const thumbSize = styleVariants({
  xs: { width: 12, height: 12 },
  sm: { width: 14, height: 14 },
  md: { width: 16, height: 16 },
  lg: { width: 20, height: 20 },
  xl: { width: 24, height: 24 },
});

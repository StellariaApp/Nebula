import { keyframes, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import * as motion from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { backdropBlur, modalWidth } from "./Modal.vars.css.js";

const FADE_IN = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });

const TOP_INSET = "10vh";

export const dialog = recipe({
  base: {
    "@layer": {
      [baseLayer]: {
        boxSizing: "border-box",
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100dvh",
        maxWidth: "100vw",
        maxHeight: "100dvh",
        margin: 0,
        padding: 0,
        border: "none",
        background: "transparent",
        color: vars.color.text.primary,
        overflow: "hidden",
        display: "flex",
        selectors: {
          "&::backdrop": {
            background: `color-mix(in srgb, ${vars.color.gray["950"]} 62%, transparent)`,
            backdropFilter: backdropBlur,
            animationName: FADE_IN,
            animationDuration: vars.motion.duration.base,
            animationTimingFunction: vars.motion.easing.standard,
            ...motion.overlay,
          },
          "&:not([data-open='true'])::backdrop": { opacity: 0 },
          "&:not([open])": { display: "none" },
        },
        "@media": {
          "(prefers-reduced-motion: reduce)": {
            selectors: {
              "&::backdrop": motion.still,
            },
          },
        },
      },
    },
  },
  variants: {
    layout: {
      centered: { alignItems: "center", justifyContent: "center", padding: vars.space.md },
      top: {
        alignItems: "flex-start",
        justifyContent: "center",
        paddingInline: vars.space.md,
        paddingBlock: `${TOP_INSET} ${vars.space.md}`,
      },
      fullScreen: { alignItems: "stretch" },
      "drawer-start": { alignItems: "stretch", justifyContent: "flex-start" },
      "drawer-end": { alignItems: "stretch", justifyContent: "flex-end" },
      "drawer-top": { alignItems: "flex-start" },
      "drawer-bottom": { alignItems: "flex-end" },
    },
  },
  defaultVariants: { layout: "centered" },
});

export const surface = recipe({
  base: {
    "@layer": {
      [baseLayer]: {
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        background: vars.color.surface.overlay,
        color: vars.color.text.primary,
        boxShadow: vars.shadow.xxl,
        outline: "none",
      },
    },
  },
  variants: {
    layout: {
      centered: {
        width: modalWidth,
        maxWidth: "100%",
        maxHeight: "100%",
        borderRadius: vars.radius.lg,
      },
      top: {
        width: modalWidth,
        maxWidth: "100%",
        maxHeight: "100%",
        borderRadius: vars.radius.lg,
      },
      fullScreen: { width: "100%", height: "100%", borderRadius: 0 },
      "drawer-start": { width: modalWidth, maxWidth: "100%", height: "100%", borderRadius: 0 },
      "drawer-end": { width: modalWidth, maxWidth: "100%", height: "100%", borderRadius: 0 },
      "drawer-top": { width: "100%", maxHeight: "100%", borderRadius: 0 },
      "drawer-bottom": { width: "100%", maxHeight: "100%", borderRadius: 0 },
    },
    radius: {
      none: { borderRadius: 0 },
      sm: { borderRadius: vars.radius.sm },
      md: { borderRadius: vars.radius.md },
      lg: { borderRadius: vars.radius.lg },
    },
  },
  defaultVariants: { layout: "centered" },
});

export const header = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      alignItems: "flex-start",
      gap: vars.space.md,
      paddingInline: vars.space.lg,
      paddingBlock: vars.space.md,
      borderBottomStyle: "solid",
      borderBottomWidth: 1,
      borderBottomColor: vars.color.border.subtle,
    },
  },
});

export const heading = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.xxs,
  flex: 1,
  minWidth: 0,
});

export const title = style({
  "@layer": {
    [baseLayer]: {
      margin: 0,
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.h5,
      fontWeight: vars.font.weight.semibold,
      lineHeight: vars.font.lineHeight.tight,
      color: vars.color.text.primary,
    },
  },
});

export const subtitle = style({
  "@layer": {
    [baseLayer]: {
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.body3,
      color: vars.color.text.secondary,
    },
  },
});

export const body = recipe({
  base: { flex: 1, minHeight: 0, overflowY: "auto" },
  variants: {
    padding: {
      none: { padding: 0 },
      sm: { padding: vars.space.sm },
      md: { padding: vars.space.md },
      lg: { padding: vars.space.lg },
    },
  },
  defaultVariants: { padding: "lg" },
});

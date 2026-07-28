import { keyframes, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import * as motion from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { backdropBlur, modalWidth } from "./Modal.vars.css.js";

const FADE_IN = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });

export const dialog = recipe({
  base: {
    "@layer": {
      [baseLayer]: {
        boxSizing: "border-box",
        padding: 0,
        border: "none",
        background: vars.color.surface.overlay,
        color: vars.color.text.primary,
        boxShadow: vars.shadow.xxl,
        maxWidth: "none",
        maxHeight: "none",
        overflow: "visible",
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
      centered: {
        width: modalWidth,
        maxWidth: "calc(100vw - 2rem)",
        maxHeight: "calc(100vh - 2rem)",
        margin: "auto",
        borderRadius: vars.radius.lg,
      },
      top: {
        width: modalWidth,
        maxWidth: "calc(100vw - 2rem)",
        maxHeight: "calc(100vh - 2rem)",
        marginInline: "auto",
        marginBlock: "10vh auto",
        borderRadius: vars.radius.lg,
      },
      fullScreen: {
        width: "100vw",
        height: "100vh",
        maxWidth: "100vw",
        maxHeight: "100vh",
        margin: 0,
        borderRadius: 0,
      },
      "drawer-start": {
        width: modalWidth,
        maxWidth: "100vw",
        height: "100vh",
        maxHeight: "100vh",
        margin: 0,
        marginInlineEnd: "auto",
        borderRadius: 0,
      },
      "drawer-end": {
        width: modalWidth,
        maxWidth: "100vw",
        height: "100vh",
        maxHeight: "100vh",
        margin: 0,
        marginInlineStart: "auto",
        borderRadius: 0,
      },
      "drawer-top": {
        width: "100vw",
        maxWidth: "100vw",
        margin: 0,
        marginBlockEnd: "auto",
        borderRadius: 0,
      },
      "drawer-bottom": {
        width: "100vw",
        maxWidth: "100vw",
        margin: 0,
        marginBlockStart: "auto",
        borderRadius: 0,
      },
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

export const surface = style({
  display: "flex",
  flexDirection: "column",
  maxHeight: "inherit",
  height: "100%",
  outline: "none",
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

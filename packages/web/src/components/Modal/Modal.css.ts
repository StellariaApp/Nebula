import { keyframes, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import * as motion from "../../styles/motion.css.js";
import { vars } from "@stellaria/nebula-themes/web";
import { composite_layer } from "../../theme/layers.css.js";

import * as variables from "./Modal.vars.css.js";
import { palettes } from "@stellaria/nebula-tokens";

const FADE_IN = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });

const TOP_INSET = "10vh";

export const dialog = recipe({
  base: {
    "@layer": {
      [composite_layer]: {
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
        overflow: "clip",
        display: "flex",
        selectors: {
          "&::backdrop": {
            background: `color-mix(in srgb, ${palettes.dark[200]} 62%, transparent)`,
            backdropFilter: variables.backdropBlur,
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
      "drawer-end": { alignItems: "stretch", justifyContent: "flex-start" },
      "drawer-top": { alignItems: "flex-start" },
      "drawer-bottom": { alignItems: "flex-start" },
    },
  },
  defaultVariants: { layout: "centered" },
});

export const portal = style({
  "@layer": {
    [composite_layer]: {
      display: "contents",
    },
  },
});

export const surface = recipe({
  base: {
    "@layer": {
      [composite_layer]: {
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        background: vars.color.surface.overlay,
        color: vars.color.text.primary,
        boxShadow: vars.shadow.lg,
        outline: "none",
      },
    },
  },
  variants: {
    layout: {
      centered: {
        width: variables.width,
        maxWidth: "100%",
        maxHeight: "100%",
        borderRadius: vars.radius.lg,
      },
      top: {
        width: variables.width,
        maxWidth: "100%",
        maxHeight: "100%",
        borderRadius: vars.radius.lg,
      },
      fullScreen: { width: "100%", height: "100%", borderRadius: 0 },
      "drawer-start": { width: variables.width, maxWidth: "100%", height: "100%", borderRadius: 0 },
      "drawer-end": {
        width: variables.width,
        maxWidth: "100%",
        height: "100%",
        borderRadius: 0,
        position: "absolute",
        insetBlock: 0,
        insetInlineEnd: 0,
      },
      "drawer-top": { width: "100%", maxHeight: "100%", borderRadius: 0 },
      "drawer-bottom": {
        width: "100%",
        maxHeight: "100%",
        borderRadius: 0,
        position: "absolute",
        insetInline: 0,
        insetBlockEnd: 0,
      },
    },
    radius: {
      none: { borderRadius: 0 },
      sm: { borderRadius: vars.radius.sm },
      md: { borderRadius: vars.radius.md },
      lg: { borderRadius: vars.radius.lg },
    },
    /*
     * Lo que enciende `content`: la superficie conserva el sitio, el ancho y el movimiento, y suelta
     * todo lo que se ve, para que el panel lo dibuje quien lo trae. Va declarada la ultima a
     * proposito, para pisar el redondeo que ponen `layout` y `radius`.
     */
    bare: {
      true: {
        "@layer": {
          [composite_layer]: {
            background: "transparent",
            boxShadow: "none",
            borderRadius: 0,
          },
        },
      },
      false: {},
    },
  },
  defaultVariants: { layout: "centered", bare: false },
});

export const header = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      alignItems: "center",
      justifyItems: "center",
      gap: vars.space.md,
      paddingInline: vars.space.lg,
      paddingBlock: vars.space.u5,
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
    [composite_layer]: {
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
    [composite_layer]: {
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.body3,
      color: vars.color.text.secondary,
    },
  },
});

export const footer = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      alignItems: "center",
      justifyItems: "center",
      flexWrap: "wrap",
      gap: vars.space.u3,
      paddingInline: vars.space.lg,
      paddingBlock: vars.space.md,
      borderTopStyle: "solid",
      borderTopWidth: 1,
      borderTopColor: vars.color.border.subtle,
    },
  },
});

export const body = recipe({
  base: {
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    background: vars.color.surface.sunken,
    selectors: {
      "&:last-child": {
        borderBottomLeftRadius: vars.radius.sm,
        borderBottomRightRadius: vars.radius.sm,
      },
    },
  },
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

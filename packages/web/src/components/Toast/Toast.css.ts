import { fallbackVar, style, styleVariants } from "@vanilla-extract/css";

import { vars } from "@stellaria/nebula-themes/web";
import { composite_layer } from "../../theme/layers.css.js";

import * as variables from "./Toast.vars.css.js";

const EDGE = vars.space.md;

export const region = style({
  "@layer": {
    [composite_layer]: {
      position: "fixed",
      display: "flex",
      flexDirection: "column",
      gap: vars.space.xs,
      zIndex: vars.zIndex.toast,
      pointerEvents: "none",
      maxWidth: "min(24rem, calc(100vw - 2rem))",
      width: "100%",
    },
  },
});

export const placement = styleVariants({
  "top-start": { top: EDGE, insetInlineStart: EDGE },
  top: { top: EDGE, insetInline: 0, marginInline: "auto" },
  "top-end": { top: EDGE, insetInlineEnd: EDGE },
  "bottom-start": { bottom: EDGE, insetInlineStart: EDGE, flexDirection: "column-reverse" },
  bottom: {
    bottom: EDGE,
    insetInline: 0,
    marginInline: "auto",
    flexDirection: "column-reverse",
  },
  "bottom-end": { bottom: EDGE, insetInlineEnd: EDGE, flexDirection: "column-reverse" },
});

export const toast = style({
  "@layer": {
    [composite_layer]: {
      pointerEvents: "auto",
      display: "flex",
      alignItems: "flex-start",
      gap: vars.space.sm,
      boxSizing: "border-box",
      paddingInline: vars.space.md,
      paddingBlock: vars.space.sm,
      borderRadius: vars.radius.md,
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: fallbackVar(variables.border, vars.color.border.default),
      borderInlineStartWidth: "3px",
      borderInlineStartColor: variables.accent,
      background: fallbackVar(variables.bg, vars.color.surface.overlay),
      color: fallbackVar(variables.fg, vars.color.text.primary),
      backdropFilter: fallbackVar(variables.backdrop, "none"),
      boxShadow: vars.shadow.lg,
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.body2,
    },
  },
});

export const icon = style({
  "@layer": {
    [composite_layer]: {
      display: "inline-flex",
      flexShrink: 0,
      color: variables.accent,
      marginBlockStart: "1px",
    },
  },
});

export const body = style({
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
      fontSize: vars.font.size.body2,
      fontWeight: vars.font.weight.semibold,
      lineHeight: vars.font.lineHeight.tight,
    },
  },
});

export const message = style({
  "@layer": { [composite_layer]: { color: vars.color.text.secondary } },
});

export const action = style({ marginBlockStart: vars.space.xxs });

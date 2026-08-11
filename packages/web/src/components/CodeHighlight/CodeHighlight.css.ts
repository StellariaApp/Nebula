import { fallbackVar, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

import * as variables from "./CodeHighlight.vars.css.js";

export const root = recipe({
  base: {
    "@layer": {
      [base_layer]: {
        position: "relative",
        boxSizing: "border-box",
        borderRadius: vars.radius.md,
        border: `1px solid ${fallbackVar(variables.borderColor, vars.color.border.subtle)}`,
        background: fallbackVar(variables.bg, vars.color.surface.sunken),
        color: fallbackVar(variables.fg, vars.color.text.primary),
        overflow: "hidden",
      },
    },
  },
  variants: {
    dressed: {
      true: {
        "@layer": {
          [base_layer]: { backdropFilter: variables.backdropFilter },
        },
      },
      false: {},
    },
  },
  defaultVariants: { dressed: false },
});

export const header = recipe({
  base: {
    "@layer": {
      [base_layer]: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: vars.space.sm,
        padding: `${vars.space.xxs} ${vars.space.sm}`,
        borderBottom: `1px solid ${fallbackVar(variables.borderColor, vars.color.border.subtle)}`,
        fontSize: vars.font.size.caption,
        fontFamily: vars.font.family.mono,
      },
    },
  },
  variants: {
    dressed: {
      true: { "@layer": { [base_layer]: { background: "transparent", color: "inherit" } } },
      false: {
        "@layer": {
          [base_layer]: { background: vars.color.surface.base, color: vars.color.text.muted },
        },
      },
    },
  },
  defaultVariants: { dressed: false },
});

export const floating_copy = style({
  "@layer": {
    [base_layer]: {
      position: "absolute",
      insetBlockStart: vars.space.xxs,
      insetInlineEnd: vars.space.xxs,
      zIndex: 1,
    },
  },
});

export const scroll = style({
  "@layer": {
    [base_layer]: {
      maxHeight: variables.scrollHeight,
      overflow: "auto",
    },
  },
});

export const pre = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      margin: 0,
      padding: 0,
      fontFamily: vars.font.family.mono,
      fontSize: vars.font.size.body3,
      lineHeight: vars.font.lineHeight.relaxed,
      color: "inherit",
      direction: "ltr",
      textAlign: "left",
    },
  },
});

export const gutter = style({
  "@layer": {
    [base_layer]: {
      flex: "0 0 auto",
      padding: `${vars.space.sm} ${vars.space.xs}`,
      borderInlineEnd: `1px solid ${vars.color.border.subtle}`,
      color: vars.color.text.muted,
      textAlign: "right",
      userSelect: "none",
      fontVariantNumeric: "tabular-nums",
      whiteSpace: "pre",
    },
  },
});

export const source = style({
  "@layer": {
    [base_layer]: {
      flex: 1,
      minWidth: 0,
      padding: vars.space.sm,
      whiteSpace: "pre",
      fontFamily: "inherit",
      fontSize: "inherit",
      lineHeight: "inherit",
    },
  },
});

export const tab_list = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.xxs,
      padding: `${vars.space.xxs} ${vars.space.xs}`,
      borderBottom: `1px solid ${vars.color.border.subtle}`,
      background: vars.color.surface.base,
      overflowX: "auto",
    },
  },
});

export const bare = style({
  "@layer": {
    [base_layer]: { border: "none", borderRadius: 0, background: "transparent" },
  },
});

export const fold = style({
  "@layer": {
    [base_layer]: {
      position: "absolute",
      insetInline: 0,
      insetBlockEnd: 0,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      paddingBlock: `${vars.space.xl} ${vars.space.xs}`,
      background: `linear-gradient(to bottom, transparent, ${fallbackVar(variables.bg, vars.color.surface.sunken)})`,
      pointerEvents: "none",
      selectors: {
        "&[data-open='true']": {
          position: "static",
          background: "none",
          paddingBlock: vars.space.xs,
        },
      },
      "@media": {
        "(prefers-reduced-motion: reduce)": { background: "none" },
      },
    },
  },
});

export const fold_button = style({
  "@layer": {
    [base_layer]: { pointerEvents: "auto" },
  },
});

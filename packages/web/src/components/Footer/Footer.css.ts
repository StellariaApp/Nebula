import { fallbackVar, globalStyle, style } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import { interaction, reduced_media, still } from "../../styles/motion.css.js";
import { vars } from "@stellaria/nebula-themes/web";
import { component_layer } from "../../theme/layers.css.js";

import * as variables from "./Footer.vars.css.js";

export const root = style({
  "@layer": {
    [component_layer]: {
      width: "100%",
      minWidth: 0,
      flexShrink: 0,
      boxSizing: "border-box",
      paddingBlock: vars.space.xl,
      paddingInline: vars.space.lg,
      color: vars.color.text.secondary,
      fontFamily: vars.font.family.sans,
      background: vars.color.surface.overlay,

      selectors: {
        "&[data-with-border='true']": {
          borderBlockStart: `1px solid ${vars.color.border.subtle}`,
        },
        "&[data-glass='true']": {
          background: vars.glass.subtle.background,
          borderBlockStart: `1px solid ${vars.glass.subtle.borderColor}`,
          backdropFilter: vars.glass.subtle.backdropFilter,
        },
        "&[data-sticky='true']": {
          position: "sticky",
          insetBlockEnd: 0,
          zIndex: vars.zIndex.sticky,
        },
      },
    },
  },
});

export const inner = style({
  "@layer": {
    [component_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: fallbackVar(variables.contentGap, vars.space.xl),
      minWidth: 0,
      boxSizing: "border-box",
      width: "100%",
      maxWidth: fallbackVar(variables.contentMax, "none"),
      marginInline: "auto",
    },
  },
});

export const columns = style({
  "@layer": {
    [component_layer]: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "flex-start",
      gap: vars.space.xl,
      minWidth: 0,
    },
  },
});

export const brand = style({
  "@layer": {
    [component_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.md,
      minWidth: 0,
      maxWidth: "34ch",
      marginInlineEnd: "auto",
    },
  },
});

export const brand_link = style({
  "@layer": {
    [component_layer]: {
      display: "inline-flex",
      alignItems: "center",
      gap: vars.space.xs,
      color: vars.color.text.primary,
      fontWeight: vars.font.weight.semibold,
      textDecoration: "none",
      borderRadius: vars.radius.sm,
      outline: "none",
      selectors: {
        "&:focus-visible": { ...focus.ring },
      },
    },
  },
});

globalStyle(`${brand_link} :is(img, svg)`, {
  display: "block",
  width: "auto",
  height: fallbackVar(variables.logoHeight, vars.size.compact.md),
});

export const brand_description = style({
  "@layer": {
    [component_layer]: {
      margin: 0,
      fontSize: vars.font.size.body3,
      lineHeight: vars.font.lineHeight.relaxed,
      color: vars.color.text.secondary,
    },
  },
});

export const group = style({
  "@layer": {
    [component_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.xs,
      minWidth: 0,
    },
  },
});

export const group_title = style({
  "@layer": {
    [component_layer]: {
      margin: 0,
      fontSize: vars.font.size.caption,
      fontWeight: vars.font.weight.semibold,
      letterSpacing: vars.font.letterSpacing.wide,
      textTransform: "uppercase",
      color: vars.color.text.muted,
    },
  },
});

export const group_list = style({
  "@layer": {
    [component_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.xxs,
      margin: 0,
      padding: 0,
      listStyle: "none",
    },
  },
});

export const link = style({
  "@layer": {
    [component_layer]: {
      display: "inline-flex",
      alignItems: "center",
      minHeight: vars.size.compact.sm,
      border: "none",
      padding: 0,
      background: "transparent",
      fontFamily: "inherit",
      fontSize: vars.font.size.body3,
      color: vars.color.text.secondary,
      textDecoration: "none",
      cursor: "pointer",
      borderRadius: vars.radius.xs,
      outline: "none",
      ...interaction,

      selectors: {
        "&:hover": { color: vars.color.text.primary, textDecoration: "underline" },
        "&:focus-visible": { ...focus.ring },
      },

      "@media": { [reduced_media]: still },
    },
  },
});

export const legal = style({
  "@layer": {
    [component_layer]: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "space-between",
      gap: vars.space.sm,
      paddingBlockStart: vars.space.lg,
      borderBlockStart: `1px solid ${vars.color.border.subtle}`,
      fontSize: vars.font.size.caption,
      color: vars.color.text.muted,
    },
  },
});

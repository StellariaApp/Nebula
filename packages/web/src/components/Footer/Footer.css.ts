import { fallbackVar, globalStyle, style } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import { interaction, reducedMedia, still } from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { contentGap, contentMax, logoHeight } from "./Footer.vars.css.js";

export const root = style({
  "@layer": {
    [baseLayer]: {
      width: "100%",
      minWidth: 0,
      flexShrink: 0,
      boxSizing: "border-box",
      paddingBlock: vars.space.xl,
      paddingInline: vars.space.lg,
      color: vars.color.text.secondary,
      fontFamily: vars.font.family.sans,

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
          background: vars.color.surface.base,
        },
      },
    },
  },
});

export const inner = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      flexDirection: "column",
      gap: fallbackVar(contentGap, vars.space.xl),
      minWidth: 0,
      boxSizing: "border-box",
      width: "100%",
      maxWidth: fallbackVar(contentMax, "none"),
      marginInline: "auto",
    },
  },
});

export const columns = style({
  "@layer": {
    [baseLayer]: {
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
    [baseLayer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.md,
      minWidth: 0,
      maxWidth: "34ch",
      marginInlineEnd: "auto",
    },
  },
});

export const brandLink = style({
  "@layer": {
    [baseLayer]: {
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

globalStyle(`${brandLink} :is(img, svg)`, {
  display: "block",
  width: "auto",
  height: fallbackVar(logoHeight, vars.size.compact.md),
});

export const brandDescription = style({
  "@layer": {
    [baseLayer]: {
      margin: 0,
      fontSize: vars.font.size.body3,
      lineHeight: vars.font.lineHeight.relaxed,
      color: vars.color.text.secondary,
    },
  },
});

export const group = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.xs,
      minWidth: 0,
    },
  },
});

export const groupTitle = style({
  "@layer": {
    [baseLayer]: {
      margin: 0,
      fontSize: vars.font.size.caption,
      fontWeight: vars.font.weight.semibold,
      letterSpacing: vars.font.letterSpacing.wide,
      textTransform: "uppercase",
      color: vars.color.text.muted,
    },
  },
});

export const groupList = style({
  "@layer": {
    [baseLayer]: {
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
    [baseLayer]: {
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

      "@media": { [reducedMedia]: still },
    },
  },
});

export const legal = style({
  "@layer": {
    [baseLayer]: {
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

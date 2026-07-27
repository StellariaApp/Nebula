import { style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { accent, activeBg } from "./NavLink.vars.css.js";

export const root = style({
  "@layer": {
    [baseLayer]: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: vars.space.sm,
      width: "100%",
      boxSizing: "border-box",
      paddingInline: vars.space.sm,
      paddingBlock: vars.space.xs,
      minHeight: "2.25rem",
      border: "none",
      background: "transparent",
      borderRadius: vars.radius.sm,
      font: "inherit",
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.body2,
      color: vars.color.text.secondary,
      textAlign: "start",
      textDecoration: "none",
      cursor: "pointer",
      transitionProperty: "background, color",
      transitionDuration: vars.motion.duration.fast,
      transitionTimingFunction: vars.motion.easing.standard,
      selectors: {
        "&:hover:not([data-disabled='true'])": {
          background: vars.color.surface.sunken,
          color: vars.color.text.primary,
        },
        "&[data-active='true']": { background: activeBg, color: accent },
        "&[data-disabled='true']": { cursor: "not-allowed", color: vars.color.text.muted },
        "&:focus-visible": {
          outline: `2px solid ${vars.color.border.focus}`,
          outlineOffset: "-2px",
        },
      },
      "@media": { "(prefers-reduced-motion: reduce)": { transitionDuration: "0.01ms" } },
    },
  },
});

export const indicator = style({
  "@layer": {
    [baseLayer]: {
      position: "absolute",
      insetInlineStart: 0,
      insetBlock: "20%",
      width: "3px",
      borderRadius: vars.radius.full,
      background: accent,
    },
  },
});

export const section = style({
  display: "inline-flex",
  alignItems: "center",
  flexShrink: 0,
});

export const body = style({
  display: "flex",
  flexDirection: "column",
  gap: "1px",
  flex: 1,
  minWidth: 0,
});

export const label = style({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const description = style({
  "@layer": {
    [baseLayer]: {
      fontSize: vars.font.size.caption,
      color: vars.color.text.muted,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  },
});

export const chevron = style({
  "@layer": { [baseLayer]: { display: "inline-flex", flexShrink: 0, color: "inherit" } },
});

export const children = style({
  "@layer": {
    [baseLayer]: {
      paddingInlineStart: vars.space.md,
      borderInlineStartStyle: "solid",
      borderInlineStartWidth: 1,
      borderInlineStartColor: vars.color.border.subtle,
      marginInlineStart: vars.space.sm,
      display: "flex",
      flexDirection: "column",
      gap: "2px",
    },
  },
});

import { style } from "@vanilla-extract/css";

import { vars } from "@stellaria/nebula-themes/web";
import * as focus from "../../styles/focus.css.js";
import * as motion from "../../styles/motion.css.js";
import { component_layer } from "../../theme/layers.css.js";
import { SmallerThan } from "../../theme/media.js";

import * as variables from "./NavLink.vars.css.js";

export const root = style({
  "@layer": {
    [component_layer]: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: vars.space.u2_5,
      width: "100%",
      boxSizing: "border-box",
      paddingInline: vars.space.u3,
      paddingBlock: vars.space.u2_5,
      minHeight: vars.size.control.sm,
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
      ...motion.interaction,
      selectors: {
        "&:hover:not([data-disabled='true'])": {
          background: vars.color.surface.hover,
          color: vars.color.text.primary,
        },
        "&[data-active='true']": { background: variables.activeBg, color: variables.accent },
        "&[data-active='true']:hover:not([data-disabled='true'])": {
          background: variables.activeBgHover,
          color: variables.accent,
        },
        "&[data-disabled='true']": {
          cursor: "not-allowed",
          color: vars.color.text.disabled,
          background: vars.glass.control.background,
          backdropFilter: vars.glass.control.backdropFilter,
        },
        "&:focus-visible": {
          ...focus.ring,
        },
      },
      ...motion.reduced_motion,
    },
  },
});

export const indicator = style({
  "@layer": {
    [component_layer]: {
      position: "absolute",
      insetInlineStart: 0,
      insetBlock: "20%",
      width: "3px",
      borderRadius: vars.radius.full,
      background: variables.accent,
      transitionProperty: "transform, opacity",
      transitionDuration: vars.motion.duration.base,
      transitionTimingFunction: vars.motion.easing.decelerate,
      transformOrigin: "center",
      "@starting-style": {
        transform: "scaleY(0)",
        opacity: 0,
      },
      "@media": {
        [SmallerThan("tablet")]: {
          insetInline: "20%",
          insetBlock: "auto",
          insetBlockEnd: 0,
          width: "auto",
          height: "3px",
        },
      },
    },
  },
});

export const section_left = style({
  display: "inline-flex",
  alignItems: "center",
  flexShrink: 0,
});

export const section_right = style({
  display: "inline-flex",
  alignItems: "center",
  flexShrink: 0,
});

export const body = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.xxs,
  flex: 1,
  minWidth: 0,
});

export const label = style({
  "@layer": {
    [component_layer]: {
      fontWeight: vars.font.weight.medium,
      lineHeight: vars.font.lineHeight.normal,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  },
});

export const description = style({
  "@layer": {
    [component_layer]: {
      fontSize: vars.font.size.caption,
      color: vars.color.text.muted,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  },
});

export const chevron = style({
  "@layer": {
    [component_layer]: {
      display: "inline-flex",
      flexShrink: 0,
      color: "inherit",
      transitionProperty: "transform",
      transitionDuration: vars.motion.duration.base,
      transitionTimingFunction: vars.motion.easing.standard,

      selectors: {
        "&[data-open='true']": { transform: "rotate(180deg)" },
        "&[data-motion='off']": { transitionProperty: "none" },
      },

      "@media": {
        "(prefers-reduced-motion: reduce)": { transitionProperty: "none" },
      },
    },
  },
});

export const children = style({
  "@layer": {
    [component_layer]: {
      paddingInlineStart: vars.space.md,
      borderInlineStartStyle: "solid",
      borderInlineStartWidth: 1,
      borderInlineStartColor: vars.color.border.subtle,
      marginInlineStart: vars.space.sm,
      display: "flex",
      flexDirection: "column",
      gap: vars.space.xxs,
    },
  },
});

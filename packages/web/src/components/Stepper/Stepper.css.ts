import { style, styleVariants } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import * as motion from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

import * as variables from "./Stepper.vars.css.js";

export const root = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.lg,
      width: "100%",
      fontFamily: vars.font.family.sans,
    },
  },
});

export const list = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      listStyle: "none",
      margin: 0,
      padding: 0,
      gap: vars.space.xs,
    },
  },
});

export const orientation = styleVariants({
  horizontal: { flexDirection: "row", alignItems: "flex-start" },
  vertical: { flexDirection: "column" },
});

export const item = style({
  "@layer": {
    [base_layer]: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: vars.space.sm,
      flex: "1 1 0",
      minWidth: 0,
      selectors: {
        "[data-orientation='vertical'] &": { flex: "0 0 auto", alignItems: "flex-start" },
      },
    },
  },
});

export const step = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.sm,
      minWidth: 0,
      padding: 0,
      margin: 0,
      border: "none",
      background: "none",
      font: "inherit",
      color: "inherit",
      textAlign: "start",
      cursor: "pointer",
      borderRadius: vars.radius.sm,
      selectors: {
        "&[data-static='true']": { cursor: "default" },
        "&:focus-visible": focus.ring,
      },
    },
  },
});

export const bullet = style({
  "@layer": {
    [base_layer]: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      boxSizing: "border-box",
      borderRadius: vars.radius.full,
      borderStyle: "solid",
      borderWidth: variables.bulletBorderWidth,
      borderColor: vars.color.border.default,
      background: "transparent",
      color: vars.color.text.muted,
      fontWeight: vars.font.weight.semibold,
      fontVariantNumeric: "tabular-nums",
      ...motion.interaction,
      ...motion.reduced_motion,
      selectors: {
        "&[data-state='completed'], &[data-state='current']": {
          background: variables.bulletBg,
          borderColor: variables.bulletBorder,
          color: variables.bulletFg,
        },
        "&[data-state='error']": {
          background: "transparent",
          borderColor: vars.color.semantic.error["500"],
          color: vars.color.semantic.error["600"],
        },
      },
    },
  },
});

export const body = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      flexDirection: "column",
      minWidth: 0,
    },
  },
});

export const label = style({
  "@layer": {
    [base_layer]: {
      fontSize: vars.font.size.body3,
      fontWeight: vars.font.weight.medium,
      color: vars.color.text.primary,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      selectors: {
        "[data-state='pending'] &": { color: vars.color.text.muted },
      },
    },
  },
});

export const description = style({
  "@layer": {
    [base_layer]: {
      fontSize: vars.font.size.caption,
      color: vars.color.text.muted,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  },
});

export const track = style({
  "@layer": {
    [base_layer]: {
      flex: "1 1 auto",
      minWidth: vars.space.md,
      height: 2,
      borderRadius: vars.radius.full,
      background: vars.color.border.subtle,
      ...motion.interaction,
      ...motion.reduced_motion,
      selectors: {
        "&[data-state='completed']": { background: variables.trackDone },
        "[data-orientation='vertical'] &": {
          position: "absolute",
          insetInlineStart: 15,
          top: "100%",
          width: 2,
          height: vars.space.md,
          minWidth: 0,
          flex: "none",
        },
      },
    },
  },
});

export const panel = style({
  "@layer": {
    [base_layer]: { minWidth: 0 },
  },
});

export const bullet_size = styleVariants({
  xs: { width: 24, height: 24, fontSize: vars.font.size.caption },
  sm: { width: 28, height: 28, fontSize: vars.font.size.caption },
  md: { width: 32, height: 32, fontSize: vars.font.size.body3 },
  lg: { width: 38, height: 38, fontSize: vars.font.size.body2 },
  xl: { width: 44, height: 44, fontSize: vars.font.size.body1 },
});

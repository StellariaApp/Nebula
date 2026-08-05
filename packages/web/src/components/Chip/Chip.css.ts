import { style, styleVariants } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import * as motion from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

import { chipBg, chipBorder, chipFg } from "./Chip.vars.css.js";

export const group_root = style({
  "@layer": {
    [base_layer]: {
      border: "none",
      margin: 0,
      padding: 0,
      minWidth: 0,
    },
  },
});

export const group = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      flexWrap: "wrap",
      gap: vars.space.sm,
    },
  },
});

export const group_label = style({
  "@layer": {
    [base_layer]: {
      padding: 0,
      marginBlockEnd: vars.space.sm,
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.body2,
      fontWeight: vars.font.weight.medium,
      color: vars.color.text.primary,
    },
  },
});

export const root = style({
  "@layer": {
    [base_layer]: {
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      gap: vars.space.xs,
      boxSizing: "border-box",
      fontFamily: vars.font.family.sans,
      lineHeight: vars.font.lineHeight.tight,
      cursor: "pointer",
      userSelect: "none",
      borderWidth: 1,
      borderStyle: "solid",
      background: chipBg,
      color: chipFg,
      borderColor: chipBorder,
      ...motion.interaction,
      ...motion.reduced_motion,
      selectors: {
        "&[data-disabled='true']": {
          cursor: "not-allowed",
          background: vars.color.surface.disabled,
          borderColor: vars.color.border.disabled,
          color: vars.color.text.disabled,
        },
        "&[data-focus-visible='true']": focus.ring,
      },
    },
  },
});

export const input = style({
  "@layer": {
    [base_layer]: {
      position: "absolute",
      width: 1,
      height: 1,
      padding: 0,
      margin: -1,
      overflow: "hidden",
      clipPath: "inset(50%)",
      whiteSpace: "nowrap",
      border: 0,
    },
  },
});

export const icon = style({
  "@layer": {
    [base_layer]: { display: "inline-flex", flexShrink: 0, lineHeight: 0 },
  },
});

export const size = styleVariants({
  xs: {
    minHeight: vars.size.compact.sm,
    paddingInline: vars.space.sm,
    fontSize: vars.font.size.caption,
  },
  sm: {
    minHeight: vars.size.compact.md,
    paddingInline: vars.space.u3,
    fontSize: vars.font.size.body3,
  },
  md: {
    minHeight: vars.size.compact.lg,
    paddingInline: vars.space.md,
    fontSize: vars.font.size.body3,
  },
  lg: {
    minHeight: vars.size.compact.xl,
    paddingInline: vars.space.md,
    fontSize: vars.font.size.body2,
  },
  xl: {
    minHeight: vars.size.control.md,
    paddingInline: vars.space.lg,
    fontSize: vars.font.size.body1,
  },
});

export const radius = styleVariants({
  sm: { borderRadius: vars.radius.sm },
  md: { borderRadius: vars.radius.md },
  full: { borderRadius: vars.radius.full },
});

import { style, styleVariants } from "@vanilla-extract/css";

import * as motion from "../../styles/motion.css.js";
import { vars } from "@stellaria/nebula-themes/web";
import { composite_layer } from "../../theme/layers.css.js";

import * as variables from "./Tag.vars.css.js";

const MATRIX_VARIANTS = [
  "filled",
  "outline",
  "light",
  "glass",
  "ghost",
  "glow",
  "gradient",
] as const;

const MATRIX_SCALES = ["primary", "accent", "gray", "success", "warning", "error", "info"] as const;

const MATRIX = Object.fromEntries(
  MATRIX_VARIANTS.flatMap((variant) =>
    MATRIX_SCALES.map((scale) => [`${variant}-${scale}`, vars.variant[variant][scale]] as const),
  ),
) as Record<string, (typeof vars.variant)["filled"]["primary"]>;

export const tone = styleVariants(MATRIX, (slot) => ({
  "@layer": {
    [composite_layer]: {
      vars: {
        [variables.bg]: slot.background,
        [variables.fg]: slot.foreground,
        [variables.borderColor]: slot.borderColor,
      },
    },
  },
}));

export const tag = style({
  "@layer": {
    [composite_layer]: {
      display: "inline-flex",
      alignItems: "center",
      gap: vars.space.xxs,
      maxWidth: "100%",
      boxSizing: "border-box",
      fontFamily: vars.font.family.sans,
      fontWeight: vars.font.weight.medium,
      lineHeight: vars.font.lineHeight.tight,
      background: variables.bg,
      color: variables.fg,
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: variables.borderColor,
      ...motion.interaction,
      ...motion.reduced_motion,
      selectors: {
        "&[data-disabled='true']": {
          background: vars.color.surface.sunken,
          borderColor: vars.color.border.disabled,
          color: vars.color.text.muted,
        },
      },
    },
  },
});

export const label = style({
  "@layer": {
    [composite_layer]: {
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  },
});

export const section = style({
  "@layer": {
    [composite_layer]: { display: "inline-flex", flexShrink: 0, lineHeight: 0 },
  },
});

export const remove = style({
  "@layer": {
    [composite_layer]: {
      flexShrink: 0,
      marginInlineEnd: `calc(-1 * ${vars.space.xxs})`,
      minWidth: vars.size.control.xxs,
      width: vars.size.control.xxs,
      height: vars.size.control.xxs,
    },
  },
});

export const size = styleVariants({
  xs: {
    minHeight: vars.size.compact.xs,
    paddingInline: vars.space.xs,
    fontSize: vars.font.size.caption,
  },
  sm: {
    minHeight: vars.size.compact.sm,
    paddingInline: vars.space.xs,
    fontSize: vars.font.size.caption,
  },
  md: {
    minHeight: vars.size.compact.md,
    paddingInline: vars.space.sm,
    fontSize: vars.font.size.body3,
  },
  lg: {
    minHeight: vars.size.compact.lg,
    paddingInline: vars.space.sm,
    fontSize: vars.font.size.body2,
  },
  xl: {
    minHeight: vars.size.compact.xl,
    paddingInline: vars.space.md,
    fontSize: vars.font.size.body1,
  },
});

export const radius = styleVariants({
  sm: { borderRadius: vars.radius.sm },
  md: { borderRadius: vars.radius.md },
  full: { borderRadius: vars.radius.full },
});

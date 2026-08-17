import { style, styleVariants } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { primitive_layer } from "../../theme/layers.css.js";

import * as variables from "./ThemeIcon.vars.css.js";

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
    [primitive_layer]: {
      vars: {
        [variables.bg]: slot.background,
        [variables.fg]: slot.foreground,
        [variables.borderColor]: slot.borderColor,
        [variables.borderWidth]: slot.borderWidth,
      },
    },
  },
}));

export const icon = style({
  "@layer": {
    [primitive_layer]: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      boxSizing: "border-box",
      lineHeight: 0,
      background: variables.bg,
      color: variables.fg,
      borderStyle: "solid",
      borderWidth: variables.borderWidth,
      borderColor: variables.borderColor,
    },
  },
});

export const size = styleVariants({
  xs: {
    width: vars.size.compact.xs,
    height: vars.size.compact.xs,
    fontSize: vars.font.size.caption,
  },
  sm: {
    width: vars.size.control.xxs,
    height: vars.size.control.xxs,
    fontSize: vars.font.size.body2,
  },
  md: {
    width: vars.size.compact.lg,
    height: vars.size.compact.lg,
    fontSize: vars.font.size.body1,
  },
  lg: {
    width: vars.size.compact.xxl,
    height: vars.size.compact.xxl,
    fontSize: vars.font.size.h6,
  },
  xl: {
    width: vars.size.control.lg,
    height: vars.size.control.lg,
    fontSize: vars.font.size.h5,
  },
});

export const radius = styleVariants({
  sm: { borderRadius: vars.radius.sm },
  md: { borderRadius: vars.radius.md },
  full: { borderRadius: vars.radius.full },
});

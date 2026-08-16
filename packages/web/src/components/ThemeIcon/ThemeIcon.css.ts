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
  xs: { width: 20, height: 20, fontSize: 12 },
  sm: { width: 26, height: 26, fontSize: 14 },
  md: { width: 32, height: 32, fontSize: 17 },
  lg: { width: 40, height: 40, fontSize: 21 },
  xl: { width: 52, height: 52, fontSize: 27 },
});

export const radius = styleVariants({
  sm: { borderRadius: vars.radius.sm },
  md: { borderRadius: vars.radius.md },
  full: { borderRadius: vars.radius.full },
});

import { style, styleVariants } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import { vars } from "../../theme/contract.css.js";
import { primitive_layer } from "../../theme/layers.css.js";

import * as variables from "./Badge.vars.css.js";

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

/**
 * Las 49 combinaciones de ADR-150, cada una atando las tres vars locales a la matriz que el tema ya
 * resolvio. Es lo que sustituye al `assignInlineVars` de antes: el color deja de calcularse en el
 * render y pasa a elegirse con una clase.
 */
export const tone = styleVariants(MATRIX, (slot) => ({
  "@layer": {
    [primitive_layer]: {
      vars: {
        [variables.bg]: slot.background,
        [variables.fg]: slot.foreground,
        [variables.borderColor]: slot.borderColor,
      },
    },
  },
}));

export const badge = recipe({
  base: {
    "@layer": {
      [primitive_layer]: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: vars.space.xxs,
        boxSizing: "border-box",
        fontFamily: vars.font.family.sans,
        fontWeight: vars.font.weight.semibold,
        lineHeight: "100%",
        whiteSpace: "nowrap",
        background: variables.bg,
        color: variables.fg,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: variables.borderColor,
      },
    },
  },
  variants: {
    size: {
      xs: {
        height: vars.size.compact.xs,
        paddingInline: vars.space.sm,
        fontSize: vars.font.size.caption,
      },
      sm: {
        height: vars.size.compact.sm,
        paddingInline: vars.space.sm,
        fontSize: vars.font.size.caption,
      },
      md: {
        height: vars.size.compact.md,
        paddingInline: vars.space.md,
        fontSize: vars.font.size.body3,
      },
      lg: {
        height: vars.size.compact.lg,
        paddingInline: vars.space.lg,
        fontSize: vars.font.size.body2,
      },
      xl: {
        height: vars.size.compact.xl,
        paddingInline: vars.space.xl,
        fontSize: vars.font.size.body2,
      },
    },
    radius: {
      sm: { borderRadius: vars.radius.sm },
      md: { borderRadius: vars.radius.md },
      full: { borderRadius: vars.radius.full },
    },
    fullWidth: {
      true: { display: "flex", width: "100%" },
      false: {},
    },
  },
  defaultVariants: { size: "md", radius: "full", fullWidth: false },
});

export const section = style({
  display: "inline-flex",
  alignItems: "center",
  flexShrink: 0,
});

export const dot = style({
  "@layer": {
    [primitive_layer]: {
      width: "0.5em",
      height: "0.5em",
      borderRadius: vars.radius.full,
      background: "currentColor",
      flexShrink: 0,
    },
  },
});

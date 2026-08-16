import { style, styleVariants } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { composite_layer } from "../../theme/layers.css.js";

import * as variables from "./Banderole.vars.css.js";

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
        [variables.blur]: slot.backdropFilter,
      },
    },
  },
}));

export const root = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.sm,
      width: "100%",
      boxSizing: "border-box",
      paddingBlock: vars.space.sm,
      paddingInline: vars.space.md,
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.body3,
      background: variables.bg,
      color: variables.fg,
      borderBottomWidth: 1,
      borderBottomStyle: "solid",
      borderBottomColor: variables.borderColor,
      backdropFilter: variables.blur,
    },
  },
});

export const sticky = style({
  "@layer": {
    [composite_layer]: { position: "sticky", top: 0, zIndex: vars.zIndex.sticky },
  },
});

export const icon = style({
  "@layer": {
    [composite_layer]: { display: "inline-flex", flexShrink: 0, lineHeight: 0 },
  },
});

export const body = style({
  "@layer": {
    [composite_layer]: { flex: "1 1 auto", minWidth: 0 },
  },
});

export const actions = style({
  "@layer": {
    [composite_layer]: { display: "flex", alignItems: "center", gap: vars.space.xs, flexShrink: 0 },
  },
});

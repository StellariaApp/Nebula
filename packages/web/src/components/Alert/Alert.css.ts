import { style, styleVariants } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { composite_layer } from "../../theme/layers.css.js";
import { ResolveAccent } from "../../utils/scale.js";

import * as variables from "./Alert.vars.css.js";

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

interface MatrixSlot {
  slot: (typeof vars.variant)["filled"]["primary"];
  accent: string;
}

const MATRIX = Object.fromEntries(
  MATRIX_VARIANTS.flatMap((variant) =>
    MATRIX_SCALES.map(
      (scale) =>
        [
          `${variant}-${scale}`,
          {
            slot: vars.variant[variant][scale],
            accent: variant === "filled" ? vars.color.text.onPrimary : ResolveAccent(scale, "600"),
          },
        ] as const,
    ),
  ),
) as Record<string, MatrixSlot>;

export const tone = styleVariants(MATRIX, (entry) => ({
  "@layer": {
    [composite_layer]: {
      vars: {
        [variables.bg]: entry.slot.background,
        [variables.fg]: entry.slot.foreground,
        [variables.accent]: entry.accent,
        [variables.borderColor]: entry.slot.borderColor,
      },
    },
  },
}));

export const root = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      alignItems: "flex-start",
      gap: vars.space.sm,
      boxSizing: "border-box",
      paddingInline: vars.space.md,
      paddingBlock: vars.space.sm,
      borderRadius: vars.radius.md,
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: variables.borderColor,
      background: variables.bg,
      color: variables.fg,
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.body2,
      lineHeight: vars.font.lineHeight.normal,
    },
  },
});

export const icon = style({
  "@layer": {
    [composite_layer]: {
      display: "inline-flex",
      flexShrink: 0,
      color: variables.accent,
      marginBlockStart: "1px",
    },
  },
});

export const body = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.xxs,
  flex: 1,
  minWidth: 0,
});

export const title = style({
  "@layer": {
    [composite_layer]: {
      margin: 0,
      fontSize: vars.font.size.body2,
      fontWeight: vars.font.weight.semibold,
      lineHeight: vars.font.lineHeight.tight,
      color: "inherit",
    },
  },
});

export const message = style({
  "@layer": { [composite_layer]: { color: "inherit" } },
});

export const actions = style({
  display: "flex",
  gap: vars.space.xs,
  marginBlockStart: vars.space.xxs,
});

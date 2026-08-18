import { style, styleVariants } from "@vanilla-extract/css";

import * as motion from "../../styles/motion.css.js";
import { vars } from "@stellaria/nebula-themes/web";
import { component_layer } from "../../theme/layers.css.js";

import * as variables from "./Timeline.vars.css.js";

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
    [component_layer]: {
      vars: {
        [variables.bulletBg]: slot.background,
        [variables.bulletFg]: slot.foreground,
        [variables.bulletBorder]: slot.borderColor,
      },
    },
  },
}));

export const root = style({
  "@layer": {
    [component_layer]: {
      display: "flex",
      flexDirection: "column",
      listStyle: "none",
      margin: 0,
      padding: 0,
      fontFamily: vars.font.family.sans,
    },
  },
});

export const align = styleVariants({
  start: {},
  end: { textAlign: "end" },
});

export const item = style({
  "@layer": {
    [component_layer]: {
      position: "relative",
      display: "grid",
      gridTemplateColumns: `${variables.bulletSize} 1fr`,
      columnGap: vars.space.sm,
      paddingBlockEnd: vars.space.lg,
      selectors: {
        "&:last-child": { paddingBlockEnd: 0 },
      },
    },
  },
});

export const bullet = style({
  "@layer": {
    [component_layer]: {
      gridColumn: 1,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: variables.bulletSize,
      height: variables.bulletSize,
      boxSizing: "border-box",
      borderRadius: vars.radius.full,
      borderWidth: 2,
      borderStyle: "solid",
      borderColor: vars.color.border.default,
      background: vars.color.surface.raised,
      color: vars.color.text.muted,
      fontSize: vars.font.size.caption,
      lineHeight: 0,
      zIndex: 1,
      ...motion.interaction,
      ...motion.reduced_motion,
      selectors: {
        "&[data-reached='true']": {
          background: variables.bulletBg,
          borderColor: variables.bulletBorder,
          color: variables.bulletFg,
        },
      },
    },
  },
});

export const line = style({
  "@layer": {
    [component_layer]: {
      position: "absolute",
      insetInlineStart: `calc((${variables.bulletSize} - ${variables.lineWidth}) / 2)`,
      top: variables.bulletSize,
      bottom: 0,
      width: variables.lineWidth,
      background: vars.color.border.subtle,
      selectors: {
        "&[data-reached='true']": { background: variables.bulletBg },
        "li:last-child &": { display: "none" },
      },
    },
  },
});

export const body = style({
  "@layer": {
    [component_layer]: {
      gridColumn: 2,
      display: "flex",
      flexDirection: "column",
      gap: vars.space.xxs,
      minWidth: 0,
    },
  },
});

export const title = style({
  "@layer": {
    [component_layer]: {
      fontSize: vars.font.size.body3,
      fontWeight: vars.font.weight.medium,
      color: vars.color.text.primary,
    },
  },
});

export const meta = style({
  "@layer": {
    [component_layer]: { fontSize: vars.font.size.caption, color: vars.color.text.muted },
  },
});

export const description = style({
  "@layer": {
    [component_layer]: { fontSize: vars.font.size.body3, color: vars.color.text.secondary },
  },
});

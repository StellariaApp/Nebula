import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const root = recipe({
  base: {
    "@layer": {
      [baseLayer]: {
        boxSizing: "border-box",
        margin: 0,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: vars.space.md,
        fontFamily: vars.font.family.sans,
        color: vars.color.text.primary,
        selectors: {
          "&[disabled]": { color: vars.color.text.disabled },
        },
      },
    },
  },
  variants: {
    surface: {
      outline: {
        padding: vars.space.md,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: vars.color.border.default,
        borderRadius: vars.radius.md,
        background: "transparent",
      },
      filled: {
        padding: vars.space.md,
        border: "none",
        borderRadius: vars.radius.md,
        background: vars.color.surface.sunken,
      },
      unstyled: { padding: 0, border: "none", background: "transparent" },
    },
  },
  defaultVariants: { surface: "outline" },
});

export const legend = style({
  "@layer": {
    [baseLayer]: {
      paddingInline: vars.space.xs,
      fontSize: vars.font.size.body2,
      fontWeight: vars.font.weight.semibold,
      lineHeight: vars.font.lineHeight.tight,
      color: "inherit",
    },
  },
});

export const description = style({
  "@layer": {
    [baseLayer]: {
      fontSize: vars.font.size.caption,
      lineHeight: vars.font.lineHeight.normal,
      color: vars.color.text.muted,
      marginBlockStart: `calc(-1 * ${vars.space.xs})`,
    },
  },
});

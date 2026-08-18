import { fallbackVar, globalStyle, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import { vars } from "@stellaria/nebula-themes/web";
import { primitive_layer } from "../../theme/layers.css.js";

import * as variables from "./Avatar.vars.css.js";

export const avatar = recipe({
  base: {
    "@layer": {
      [primitive_layer]: {
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        flexShrink: 0,
        width: variables.size,
        height: variables.size,
        overflow: "hidden",
        background: variables.bg,
        color: variables.fg,
        borderStyle: "solid",
        borderWidth: fallbackVar(variables.borderWidth, "0"),
        borderColor: fallbackVar(variables.border, "transparent"),
        fontFamily: vars.font.family.sans,
        fontWeight: vars.font.weight.semibold,
        fontSize: `calc(${variables.size} / 3)`,
        lineHeight: 1,
        userSelect: "none",
      },
    },
  },
  variants: {
    radius: {
      sm: { borderRadius: vars.radius.sm },
      md: { borderRadius: vars.radius.md },
      full: { borderRadius: vars.radius.full },
    },
  },
  defaultVariants: { radius: "full" },
});

export const image = style({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
});

export const group = style({
  "@layer": {
    [primitive_layer]: {
      display: "inline-flex",
      alignItems: "center",
      flexDirection: "row",
    },
  },
});

globalStyle(`${group} > *`, {
  marginInlineStart: `calc(${variables.overlap} * -1)`,
  borderStyle: "solid",
  borderWidth: 2,
  borderColor: vars.color.surface.base,
});

globalStyle(`${group} > *:first-child`, { marginInlineStart: 0 });

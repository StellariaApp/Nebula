import { fallbackVar, globalStyle, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import {
  avatarBg,
  avatarBorder,
  avatarBorderWidth,
  avatarFg,
  avatarOverlap,
  avatarSize,
} from "./Avatar.vars.css.js";

export const avatar = recipe({
  base: {
    "@layer": {
      [baseLayer]: {
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        flexShrink: 0,
        width: avatarSize,
        height: avatarSize,
        overflow: "hidden",
        background: avatarBg,
        color: avatarFg,
        borderStyle: "solid",
        borderWidth: fallbackVar(avatarBorderWidth, "0"),
        borderColor: fallbackVar(avatarBorder, "transparent"),
        fontFamily: vars.font.family.sans,
        fontWeight: vars.font.weight.semibold,
        fontSize: `calc(${avatarSize} / 2.6)`,
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
    [baseLayer]: {
      display: "inline-flex",
      alignItems: "center",
      flexDirection: "row",
    },
  },
});

globalStyle(`${group} > *`, {
  marginInlineStart: `calc(${avatarOverlap} * -1)`,
  borderStyle: "solid",
  borderWidth: 2,
  borderColor: vars.color.surface.base,
});

globalStyle(`${group} > *:first-child`, { marginInlineStart: 0 });

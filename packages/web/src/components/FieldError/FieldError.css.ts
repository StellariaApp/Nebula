import { fallbackVar, style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { primitive_layer } from "../../theme/layers.css.js";

import * as variables from "./FieldError.vars.css.js";

const GAP = fallbackVar(variables.gap, "12px");

export const wrapper = style({
  position: "relative",
  display: "block",
  width: "100%",
});

export const bubble = style({
  "@layer": {
    [primitive_layer]: {
      position: "absolute",
      maxWidth: "100%",
      width: "max-content",
      boxSizing: "border-box",
      paddingInline: vars.space.sm,
      paddingBlock: vars.space.xs,
      borderRadius: vars.radius.sm,
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.caption,
      fontWeight: vars.font.weight.semibold,
      lineHeight: vars.font.lineHeight.normal,
      color: variables.bubbleFg,
      background: variables.bubbleBg,
      boxShadow: vars.shadow.md,
      zIndex: vars.zIndex.tooltip,
      pointerEvents: "none",
      whiteSpace: "normal",
      selectors: {
        "&::after": {
          content: '""',
          position: "absolute",
          borderWidth: "5px",
          borderStyle: "solid",
          borderColor: "transparent",
        },
      },
    },
  },
});

export const top = style({
  bottom: `calc(100% + ${GAP})`,
  selectors: { "&::after": { top: "100%", borderTopColor: variables.bubbleBg } },
});

export const bottom = style({
  top: `calc(100% + ${GAP})`,
  selectors: { "&::after": { bottom: "100%", borderBottomColor: variables.bubbleBg } },
});

export const start = style({
  insetInlineStart: vars.space.xs,
  selectors: { "&::after": { insetInlineStart: vars.space.md } },
});

export const end = style({
  insetInlineEnd: vars.space.xs,
  selectors: { "&::after": { insetInlineEnd: vars.space.md } },
});

export const center = style({
  insetInline: 0,
  marginInline: "auto",
  selectors: { "&::after": { insetInlineStart: "calc(50% - 5px)" } },
});

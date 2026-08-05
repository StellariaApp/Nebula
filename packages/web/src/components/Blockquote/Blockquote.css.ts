import { style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

import { accent } from "./Blockquote.vars.css.js";

export const blockquote = style({
  "@layer": {
    [base_layer]: {
      margin: 0,
      paddingInline: vars.space.md,
      paddingBlock: vars.space.sm,
      borderInlineStartWidth: "3px",
      borderInlineStartStyle: "solid",
      borderInlineStartColor: accent,
      borderStartEndRadius: vars.radius.sm,
      borderEndEndRadius: vars.radius.sm,
      background: vars.color.surface.raised,
      color: vars.color.text.secondary,
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.body1,
      lineHeight: vars.font.lineHeight.normal,
    },
  },
});

export const with_icon = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      gap: vars.space.sm,
      alignItems: "flex-start",
    },
  },
});

export const icon_wrap = style({
  flexShrink: 0,
  color: accent,
  display: "inline-flex",
});

export const cite = style({
  "@layer": {
    [base_layer]: {
      display: "block",
      marginBlockStart: vars.space.xs,
      fontSize: vars.font.size.caption,
      lineHeight: vars.font.lineHeight.normal,
      fontStyle: "normal",
      color: vars.color.text.muted,
    },
  },
});

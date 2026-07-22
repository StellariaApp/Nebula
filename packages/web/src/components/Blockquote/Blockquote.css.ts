import { style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { accent } from "./Blockquote.vars.css.js";

export const blockquote = style({
  "@layer": {
    [baseLayer]: {
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

export const withIcon = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      gap: vars.space.sm,
      alignItems: "flex-start",
    },
  },
});

export const iconWrap = style({
  flexShrink: 0,
  color: accent,
  display: "inline-flex",
});

export const cite = style({
  "@layer": {
    [baseLayer]: {
      display: "block",
      marginBlockStart: vars.space.xs,
      fontSize: vars.font.size.caption,
      lineHeight: vars.font.lineHeight.normal,
      fontStyle: "normal",
      color: vars.color.text.muted,
    },
  },
});

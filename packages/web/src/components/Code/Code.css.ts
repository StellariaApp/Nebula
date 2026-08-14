import { style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { primitive_layer } from "../../theme/layers.css.js";

export const base = style({
  "@layer": {
    [primitive_layer]: {
      fontFamily: vars.font.family.mono,
      background: vars.color.surface.sunken,
      color: vars.color.text.primary,
      borderRadius: vars.radius.sm,
    },
  },
});

export const inline = style({
  "@layer": {
    [primitive_layer]: {
      paddingInline: "0.35em",
      paddingBlock: "0.12em",
      fontSize: "0.875em",
      whiteSpace: "nowrap",
    },
  },
});

export const block = style({
  "@layer": {
    [primitive_layer]: {
      display: "block",
      margin: 0,
      padding: vars.space.md,
      fontSize: vars.font.size.body3,
      lineHeight: vars.font.lineHeight.normal,
      overflowX: "auto",
      whiteSpace: "pre",
    },
  },
});

import { style } from "@vanilla-extract/css";

import { vars } from "@stellaria/nebula-themes/web";
import { composite_layer } from "../../theme/layers.css.js";

export const select = style({
  "@layer": {
    [composite_layer]: {
      cursor: "pointer",
      paddingInlineEnd: vars.space.lg,
      selectors: {
        "&:disabled": { cursor: "not-allowed" },
      },
    },
  },
});

export const chevron = style({
  "@layer": {
    [composite_layer]: {
      display: "inline-flex",
      flexShrink: 0,
      marginInlineStart: `calc(-1 * ${vars.space.md})`,
      color: vars.color.text.secondary,
      pointerEvents: "none",
    },
  },
});

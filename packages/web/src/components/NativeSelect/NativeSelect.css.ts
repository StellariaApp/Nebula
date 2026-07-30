import { style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const select = style({
  "@layer": {
    [baseLayer]: {
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
    [baseLayer]: {
      display: "inline-flex",
      flexShrink: 0,
      marginInlineStart: `calc(-1 * ${vars.space.md})`,
      color: vars.color.text.secondary,
      pointerEvents: "none",
    },
  },
});

import { style } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const unstyled = style({
  "@layer": {
    [baseLayer]: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      appearance: "none",
      margin: 0,
      padding: 0,
      border: 0,
      background: "transparent",
      color: "inherit",
      font: "inherit",
      textAlign: "inherit",
      cursor: "pointer",
      borderRadius: vars.radius.xs,
      selectors: {
        "&[data-focus-visible='true']": {
          ...focus.ring,
        },
        "&[data-disabled='true']": {
          cursor: "not-allowed",
          opacity: 0.55,
        },
      },
    },
  },
});

import { style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

export const trigger = style({
  "@layer": {
    [base_layer]: {
      appearance: "none",
      flex: 1,
      minWidth: 0,
      background: "transparent",
      border: "none",
      padding: 0,
      font: "inherit",
      color: "inherit",
      textAlign: "start",
      cursor: "pointer",
      outline: "none",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      selectors: {
        "&:disabled": { cursor: "not-allowed" },
        "&[data-placeholder='true']": { color: vars.color.text.muted },
      },
    },
  },
});

export const hidden = style({
  "@layer": {
    [base_layer]: {
      position: "absolute",
      width: 1,
      height: 1,
      padding: 0,
      margin: -1,
      overflow: "hidden",
      clipPath: "inset(50%)",
      whiteSpace: "nowrap",
      border: 0,
    },
  },
});

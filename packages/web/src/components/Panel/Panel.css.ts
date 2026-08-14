import { style } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import { vars } from "../../theme/contract.css.js";
import { primitive_layer } from "../../theme/layers.css.js";

import * as variables from "./Panel.vars.css.js";

export const panel = style({
  "@layer": {
    [primitive_layer]: {
      display: "grid",
      minWidth: 0,
      minHeight: 0,
      width: "100%",
      selectors: {
        "&[data-orientation='horizontal']": {
          gridTemplateColumns: `${variables.masterSize} auto 1fr`,
        },
        "&[data-orientation='vertical']": {
          gridTemplateRows: `${variables.masterSize} auto 1fr`,
        },
      },
    },
  },
});

export const pane = style({
  "@layer": {
    [primitive_layer]: { minWidth: 0, minHeight: 0, overflow: "auto" },
  },
});

export const separator = style({
  "@layer": {
    [primitive_layer]: {
      appearance: "none",
      margin: 0,
      padding: 0,
      border: 0,
      background: vars.color.border.subtle,
      flexShrink: 0,
      selectors: {
        "&:focus-visible": { ...focus.ring },
        "&[data-orientation='horizontal']": {
          inlineSize: 4,
          blockSize: "100%",
          cursor: "col-resize",
        },
        "&[data-orientation='vertical']": {
          blockSize: 4,
          inlineSize: "100%",
          cursor: "row-resize",
        },
        "&[data-resizable='false']": { cursor: "default" },
        "&:hover:not([data-resizable='false'])": { background: vars.color.border.strong },
      },
    },
  },
});

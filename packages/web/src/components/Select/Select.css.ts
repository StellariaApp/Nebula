import { style } from "@vanilla-extract/css";

import * as motion from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const trigger = style({
  "@layer": {
    [baseLayer]: {
      appearance: "none",
      width: "100%",
      background: "transparent",
      border: "none",
      padding: 0,
      font: "inherit",
      color: "inherit",
      textAlign: "start",
      cursor: "pointer",
      outline: "none",
      display: "flex",
      alignItems: "center",
      gap: vars.space.sm,
      selectors: {
        "&:disabled": { cursor: "not-allowed" },
      },
    },
  },
});

export const value = style({
  "@layer": {
    [baseLayer]: {
      flex: 1,
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  },
});

export const placeholder = style({
  "@layer": { [baseLayer]: { color: vars.color.text.muted } },
});

export const chevron = style({
  "@layer": {
    [baseLayer]: {
      display: "inline-flex",
      flexShrink: 0,
      color: vars.color.text.secondary,
      ...motion.layout,
      selectors: {
        "&[data-open='true']": { transform: "rotate(180deg)" },
      },
      "@media": {
        "(prefers-reduced-motion: reduce)": motion.still,
      },
    },
  },
});

export const dropdown = style({
  "@layer": {
    [baseLayer]: {
      boxSizing: "border-box",
      background: vars.color.surface.overlay,
      color: vars.color.text.primary,
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: vars.color.border.default,
      borderRadius: vars.radius.md,
      boxShadow: vars.shadow.md,
      zIndex: vars.zIndex.dropdown,
      overflow: "hidden",
    },
  },
});

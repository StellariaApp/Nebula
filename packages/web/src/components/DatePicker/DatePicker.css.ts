import { style } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import * as motion from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { composite_layer } from "../../theme/layers.css.js";

export const group = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.xs,
      flex: 1,
      minWidth: 0,
    },
  },
});

export const trigger = style({
  "@layer": {
    [composite_layer]: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      appearance: "none",
      border: "none",
      background: "transparent",
      color: vars.color.text.secondary,
      borderRadius: vars.radius.sm,
      cursor: "pointer",
      outline: "none",
      padding: vars.space.xxs,
      lineHeight: 0,
      ...motion.interaction,
      ...motion.reduced_motion,
      selectors: {
        "&:hover:not(:disabled)": { color: vars.color.text.primary },
        "&[data-focus-visible='true']": focus.ring,
        "&:disabled": { color: vars.color.text.disabled, cursor: "not-allowed" },
      },
    },
  },
});

export const text_trigger = style({
  "@layer": {
    [composite_layer]: {
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

export const dialog = style({
  "@layer": {
    [composite_layer]: {
      boxSizing: "border-box",
      background: vars.color.surface.overlay,
      color: vars.color.text.primary,
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: vars.color.border.default,
      borderRadius: vars.radius.md,
      boxShadow: vars.shadow.md,
      zIndex: vars.zIndex.dropdown,
      padding: vars.space.md,
      outline: "none",
    },
  },
});

export const range_separator = style({
  "@layer": {
    [composite_layer]: { color: vars.color.text.muted, flexShrink: 0 },
  },
});

import { style, styleVariants } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

const CHECKER = `linear-gradient(45deg, ${vars.color.border.subtle} 25%, transparent 25%),
linear-gradient(-45deg, ${vars.color.border.subtle} 25%, transparent 25%),
linear-gradient(45deg, transparent 75%, ${vars.color.border.subtle} 75%),
linear-gradient(-45deg, transparent 75%, ${vars.color.border.subtle} 75%)`;

export const root = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.u3,
      fontFamily: vars.font.family.sans,
      color: vars.color.text.primary,
    },
  },
});

export const area = style({
  "@layer": {
    [baseLayer]: {
      position: "relative",
      width: "100%",
      height: 140,
      borderRadius: vars.radius.sm,
      outline: "none",
      touchAction: "none",
      selectors: {
        "&[data-focus-visible='true']": focus.ring,
        "&[data-disabled='true']": { opacity: 0.6, cursor: "not-allowed" },
      },
    },
  },
});

export const track = style({
  "@layer": {
    [baseLayer]: {
      position: "relative",
      width: "100%",
      height: 14,
      borderRadius: vars.radius.full,
      outline: "none",
      touchAction: "none",
      selectors: {
        "&[data-focus-visible='true']": focus.ring,
        "&[data-disabled='true']": { opacity: 0.6, cursor: "not-allowed" },
      },
    },
  },
});

export const checker = style({
  "@layer": {
    [baseLayer]: {
      backgroundImage: CHECKER,
      backgroundSize: "8px 8px",
      backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0",
    },
  },
});

export const thumb = style({
  "@layer": {
    [baseLayer]: {
      boxSizing: "border-box",
      width: 16,
      height: 16,
      borderRadius: vars.radius.full,
      borderWidth: 2,
      borderStyle: "solid",
      borderColor: vars.color.text.inverted,
      boxShadow: vars.shadow.sm,
      outline: "none",
      selectors: {
        "&[data-focus-visible='true']": focus.ring,
      },
    },
  },
});

export const swatches = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      flexWrap: "wrap",
      gap: vars.space.xs,
    },
  },
});

export const swatch = style({
  "@layer": {
    [baseLayer]: {
      appearance: "none",
      width: vars.size.compact.md,
      height: vars.size.compact.md,
      padding: 0,
      borderRadius: vars.radius.sm,
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: vars.color.border.default,
      cursor: "pointer",
      outline: "none",
      selectors: {
        "&[data-focus-visible='true']": focus.ring,
        "&[data-selected='true']": {
          borderColor: vars.color.border.strong,
          borderWidth: 2,
        },
      },
    },
  },
});

export const preview = style({
  "@layer": {
    [baseLayer]: {
      boxSizing: "border-box",
      flexShrink: 0,
      width: "1.25em",
      height: "1.25em",
      borderRadius: vars.radius.xs,
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: vars.color.border.default,
    },
  },
});

export const trigger = style({
  "@layer": {
    [baseLayer]: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      appearance: "none",
      border: "none",
      background: "transparent",
      padding: 0,
      cursor: "pointer",
      outline: "none",
      selectors: {
        "&[data-focus-visible='true']": focus.ring,
        "&:disabled": { cursor: "not-allowed" },
      },
    },
  },
});

export const dropdown = style({
  "@layer": {
    [baseLayer]: {
      boxSizing: "border-box",
      width: 232,
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

export const previewSize = styleVariants({
  xs: { width: "1em", height: "1em" },
  sm: { width: "1.1em", height: "1.1em" },
  md: { width: "1.25em", height: "1.25em" },
  lg: { width: "1.4em", height: "1.4em" },
  xl: { width: "1.5em", height: "1.5em" },
});

import { style, styleVariants } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import { vars } from "../../theme/contract.css.js";
import { composite_layer } from "../../theme/layers.css.js";

export const root = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.xs,
      width: "100%",
    },
  },
});

export const canvas = style({
  "@layer": {
    [composite_layer]: {
      display: "block",
      width: "100%",
      boxSizing: "border-box",
      background: vars.color.surface.raised,
      color: vars.color.text.primary,
      borderWidth: 1,
      borderStyle: "dashed",
      borderColor: vars.color.border.default,
      borderRadius: vars.radius.md,
      touchAction: "none",
      cursor: "crosshair",
      selectors: {
        "&:focus-visible": focus.ring,
        "&[data-invalid='true']": { borderColor: vars.color.semantic.error["500"] },
        "&[data-disabled='true']": {
          background: vars.color.surface.disabled,
          borderColor: vars.color.border.disabled,
          cursor: "not-allowed",
        },
      },
    },
  },
});

export const actions = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      justifyContent: "flex-end",
      gap: vars.space.xs,
    },
  },
});

export const size = styleVariants({
  xs: { borderRadius: vars.radius.xs },
  sm: { borderRadius: vars.radius.sm },
  md: { borderRadius: vars.radius.md },
  lg: { borderRadius: vars.radius.lg },
  xl: { borderRadius: vars.radius.xl },
});

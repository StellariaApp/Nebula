import { style, styleVariants } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

export const dialog = style({
  "@layer": {
    [base_layer]: {
      position: "fixed",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      gap: vars.space.xs,
      padding: vars.space.md,
      borderRadius: vars.radius.md,
      background: vars.color.surface.overlay,
      border: `1px solid ${vars.color.border.default}`,
      boxShadow: vars.shadow.lg,
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.body3,
      color: vars.color.text.primary,
      maxWidth: "min(90vw, 420px)",
    },
  },
});

export const head = style({
  "@layer": {
    [base_layer]: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: vars.space.sm,
    },
  },
});

export const title = style({
  "@layer": {
    [base_layer]: {
      margin: 0,
      fontSize: vars.font.size.body2,
      fontWeight: vars.font.weight.semibold,
    },
  },
});

export const corner = styleVariants({
  "bottom-end": {},
  "bottom-start": {},
  "top-end": {},
  "top-start": {},
});

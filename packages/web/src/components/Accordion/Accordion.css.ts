import { style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const root = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: vars.color.border.subtle,
      borderRadius: vars.radius.md,
      overflow: "hidden",
      fontFamily: vars.font.family.sans,
      background: vars.color.surface.raised,
    },
  },
});

export const item = style({
  "@layer": {
    [baseLayer]: {
      borderBottomStyle: "solid",
      borderBottomWidth: 1,
      borderBottomColor: vars.color.border.subtle,
      selectors: { "&:last-child": { borderBottomWidth: 0 } },
    },
  },
});

export const trigger = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.sm,
      width: "100%",
      boxSizing: "border-box",
      paddingInline: vars.space.md,
      paddingBlock: vars.space.sm,
      border: "none",
      background: "transparent",
      font: "inherit",
      fontSize: vars.font.size.body2,
      fontWeight: vars.font.weight.medium,
      color: vars.color.text.primary,
      textAlign: "start",
      cursor: "pointer",
      minHeight: "2.75rem",
      transitionProperty: "background",
      transitionDuration: vars.motion.duration.fast,
      transitionTimingFunction: vars.motion.easing.standard,
      selectors: {
        "&:hover:not(:disabled)": { background: vars.color.surface.sunken },
        "&:focus-visible": {
          outline: `2px solid ${vars.color.border.focus}`,
          outlineOffset: "-2px",
        },
        "&:disabled": { cursor: "not-allowed", color: vars.color.text.muted },
      },
      "@media": { "(prefers-reduced-motion: reduce)": { transitionDuration: "0.01ms" } },
    },
  },
});

export const label = style({ flex: 1, minWidth: 0 });

export const icon = style({ display: "inline-flex", flexShrink: 0 });

export const chevron = style({
  "@layer": {
    [baseLayer]: {
      display: "inline-flex",
      flexShrink: 0,
      color: vars.color.text.secondary,
    },
  },
});

export const panel = style({
  "@layer": {
    [baseLayer]: {
      paddingInline: vars.space.md,
      paddingBlock: vars.space.sm,
      fontSize: vars.font.size.body2,
      color: vars.color.text.secondary,
      lineHeight: vars.font.lineHeight.relaxed,
    },
  },
});

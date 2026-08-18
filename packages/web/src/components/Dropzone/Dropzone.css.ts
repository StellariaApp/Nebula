import { style, styleVariants } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import * as motion from "../../styles/motion.css.js";
import { vars } from "@stellaria/nebula-themes/web";
import { composite_layer } from "../../theme/layers.css.js";

import * as variables from "./Dropzone.vars.css.js";

export const root = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.sm,
      width: "100%",
    },
  },
});

export const zone = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: vars.space.xs,
      width: "100%",
      minHeight: 140,
      boxSizing: "border-box",
      padding: vars.space.lg,
      textAlign: "center",
      fontFamily: vars.font.family.sans,
      background: vars.color.surface.sunken,
      color: vars.color.text.secondary,
      borderWidth: 1,
      borderStyle: "dashed",
      borderColor: vars.color.border.default,
      cursor: "pointer",
      ...motion.interaction,
      ...motion.reduced_motion,
      selectors: {
        "&:hover:not(:disabled)": { borderColor: variables.dropColor },
        "&:focus-visible": focus.ring,
        "&[data-drag='accept']": {
          borderColor: variables.dropColor,
          color: vars.color.text.primary,
        },
        "&[data-drag='reject']": {
          borderColor: vars.color.semantic.error["500"],
          color: vars.color.semantic.error["600"],
        },
        "&[data-invalid='true']": { borderColor: vars.color.semantic.error["500"] },
        "&:disabled": {
          background: vars.color.surface.disabled,
          borderColor: vars.color.border.disabled,
          color: vars.color.text.disabled,
          cursor: "not-allowed",
        },
      },
    },
  },
});

export const icon = style({
  "@layer": {
    [composite_layer]: { display: "inline-flex", lineHeight: 0, color: variables.dropColor },
  },
});

export const title = style({
  "@layer": {
    [composite_layer]: {
      fontSize: vars.font.size.body2,
      fontWeight: vars.font.weight.medium,
    },
  },
});

export const hint = style({
  "@layer": {
    [composite_layer]: {
      fontSize: vars.font.size.caption,
      color: vars.color.text.muted,
    },
  },
});

export const native_input = style({
  "@layer": {
    [composite_layer]: {
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

export const list = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.space.xs,
      listStyle: "none",
      margin: 0,
      padding: 0,
    },
  },
});

export const item = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.sm,
      padding: vars.space.xs,
      borderRadius: vars.radius.sm,
      background: vars.color.surface.sunken,
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.body3,
      color: vars.color.text.primary,
    },
  },
});

export const file_name = style({
  "@layer": {
    [composite_layer]: {
      flex: "1 1 auto",
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  },
});

export const preview = style({
  "@layer": {
    [composite_layer]: {
      flexShrink: 0,
      width: 36,
      height: 36,
      objectFit: "cover",
      borderRadius: vars.radius.xs,
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

import { style } from "@vanilla-extract/css";

import * as motion from "../../styles/motion.css.js";
import * as focus from "../../styles/focus.css.js";
import { vars } from "@stellaria/nebula-themes/web";
import { component_layer } from "../../theme/layers.css.js";

export const root = style({
  "@layer": {
    [component_layer]: {
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
    [component_layer]: {
      borderBottomStyle: "solid",
      borderBottomWidth: 1,
      borderBottomColor: vars.color.border.subtle,
      selectors: { "&:last-child": { borderBottomWidth: 0 } },
    },
  },
});

export const trigger = style({
  "@layer": {
    [component_layer]: {
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
      minHeight: vars.size.control.md,
      ...motion.interaction,
      selectors: {
        "&:hover:not(:disabled)": { background: vars.color.surface.hover },
        "&:focus-visible": {
          ...focus.ring,
        },
        "&:disabled": { cursor: "not-allowed", color: vars.color.text.muted },
      },
      ...motion.reduced_motion,
    },
  },
});

export const label = style({ flex: 1, minWidth: 0 });

export const icon = style({ display: "inline-flex", flexShrink: 0 });

/**
 * El chevron, que gira media vuelta al abrir.
 *
 * Era un `m.span` con `animate={{ rotate }}` y un muelle. Un giro entre dos estados fijos es lo que
 * una transicion de CSS hace mejor: sin componente animado, sin bucle y sin nada que suscribir.
 */
export const chevron = style({
  "@layer": {
    [component_layer]: {
      display: "inline-flex",
      flexShrink: 0,
      color: vars.color.text.secondary,
      transitionProperty: "transform",
      transitionDuration: vars.motion.duration.base,
      transitionTimingFunction: vars.motion.easing.standard,

      selectors: {
        "&[data-open='true']": { transform: "rotate(180deg)" },
        // El escalon de movimiento del tema no lo puede leer una hoja; llega como atributo.
        "&[data-motion='off']": { transitionProperty: "none" },
      },

      "@media": {
        "(prefers-reduced-motion: reduce)": { transitionProperty: "none" },
      },
    },
  },
});

export const panel = style({
  "@layer": {
    [component_layer]: {
      paddingInline: vars.space.md,
      paddingBlock: vars.space.sm,
      fontSize: vars.font.size.body2,
      color: vars.color.text.secondary,
      lineHeight: vars.font.lineHeight.relaxed,
    },
  },
});

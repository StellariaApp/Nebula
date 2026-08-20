import { style } from "@vanilla-extract/css";

import { vars } from "@stellaria/nebula-themes/web";
import { primitive_layer } from "../../theme/layers.css.js";

import * as variables from "./Image.vars.css.js";

export const root = style({
  "@layer": {
    [primitive_layer]: {
      position: "relative",
      display: "block",
      boxSizing: "border-box",
      width: variables.width,
      height: variables.height,
      borderRadius: variables.radius,
      overflow: "hidden",
      background: vars.color.surface.sunken,
    },
  },
});

/**
 * La imagen aparece cuando termina de cargar.
 *
 * Era `initial={{ opacity: 0 }}` con `animate` atado al estado: un componente animado por imagen
 * para un desvanecido de una propiedad. El estado ya viajaba como `data-loaded`.
 */
export const img = style({
  display: "block",
  width: "100%",
  height: "100%",
  opacity: 0,
  transitionProperty: "opacity",
  transitionDuration: vars.motion.duration.base,
  transitionTimingFunction: vars.motion.easing.decelerate,

  selectors: {
    "&[data-loaded='true']": { opacity: 1 },
  },

  "@media": {
    // Sin transicion, pero visible igual: lo que no se puede es dejarla en cero.
    "(prefers-reduced-motion: reduce)": { transitionProperty: "none" },
  },
});

export const state = style({
  "@layer": {
    [primitive_layer]: {
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: vars.color.text.muted,
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.caption,
      textAlign: "center",
      padding: vars.space.sm,
    },
  },
});

export const background = style({
  "@layer": {
    [primitive_layer]: {
      position: "relative",
      display: "block",
      boxSizing: "border-box",
      borderRadius: variables.radius,
      overflow: "hidden",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },
  },
});

export const overlay = style({
  "@layer": {
    [primitive_layer]: {
      position: "absolute",
      inset: 0,
      background: `color-mix(in srgb, ${vars.color.gray["950"]} ${variables.overlayAlpha}, transparent)`,
      pointerEvents: "none",
    },
  },
});

export const background_content = style({
  position: "relative",
  zIndex: 1,
});

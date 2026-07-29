import {
  animation,
  blur,
  breakpoints,
  font,
  gray,
  palettes,
  radius,
  sizes,
  spacing,
  zIndex,
  type NebulaTheme,
} from "@stellaria/nebula-tokens";

import { FlipScale } from "./scales.js";
import { darkShadows } from "./shadows.js";

export const nebulaDark = {
  meta: { name: "nebula-dark", scheme: "dark", version: "0.1.0" },
  palettes,
  colors: {
    ...palettes,
    primary: FlipScale(palettes.indigo),
    accent: FlipScale(palettes.violet),
    gray: FlipScale(gray),
    semantic: {
      success: FlipScale(palettes.green),
      warning: FlipScale(palettes.yellow),
      error: FlipScale(palettes.red),
      info: FlipScale(palettes.blue),
    },
    surface: {
      base: palettes.dark["50"],
      raised: palettes.dark["100"],
      overlay: palettes.dark["50"],
      sunken: palettes.dark["300"],
      hover: palettes.dark["300"],
      active: palettes.dark["500"],
      disabled: palettes.dark["600"],
    },
    text: {
      primary: gray["50"],
      secondary: gray["300"],
      muted: gray["400"],
      inverted: gray["900"],
      onPrimary: palettes.dark["100"],
      disabled: gray["800"],
    },
    border: {
      subtle: gray["950"],
      default: gray["800"],
      strong: gray["600"],
      focus: palettes.indigo["400"],
      disabled: gray["900"],
    },
  },
  font,
  radius,
  spacing,
  sizes,
  motion: {
    tier: "standard",
    duration: animation.duration,
    easing: animation.easing,
    spring: animation.spring,
  },
  effects: {
    blur,
    glass: {
      surface: {
        subtle: {
          background: "rgba(15, 17, 25, 0.56)",
          border: "1px solid rgba(255, 255, 255, 0.09)",
          backdropFilter: `blur(${blur.md}) saturate(130%)`,
        },
        default: {
          background: "rgba(15, 17, 25, 0.66)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          backdropFilter: `blur(${blur.xl}) saturate(140%)`,
        },
        strong: {
          background: "rgba(15, 17, 25, 0.76)",
          border: "1px solid rgba(255, 255, 255, 0.14)",
          backdropFilter: `blur(${blur.xxl}) saturate(140%)`,
        },
      },
      noiseOpacity: 0.02,
      enabled: true,
    },
    shadows: darkShadows,
    gradients: {
      brand: {
        type: "linear",
        angle: 135,
        stops: [
          { color: palettes.indigo["400"], position: 0 },
          { color: palettes.violet["400"], position: 100 },
        ],
      },
      accent: {
        type: "linear",
        angle: 90,
        stops: [
          { color: palettes.violet["400"], position: 0 },
          { color: palettes.pink["400"], position: 100 },
        ],
      },
      surface: {
        type: "radial",
        angle: 0,
        stops: [
          { color: palettes.indigo["950"], position: 0 },
          { color: palettes.dark["100"], position: 100 },
        ],
      },
    },
  },
  variantMap: {
    filled: { background: "scale.600", foreground: "text.onPrimary", border: "none" },
    outline: { background: "transparent", foreground: "scale.700", border: "scale.600" },
    light: { background: "scale.500.12", foreground: "scale.800", border: "none" },
    glass: {
      background: "surface.overlay",
      foreground: "text.primary",
      border: "border.subtle",
      glass: "default",
    },
    ghost: { background: "transparent", foreground: "scale.700", border: "none" },
    glow: { background: "scale.600", foreground: "text.onPrimary", border: "none", glow: "lg" },
    gradient: { background: "gradient.brand", foreground: "text.onPrimary", border: "none" },
    unstyled: { background: "transparent", foreground: "currentColor", border: "none" },
  },
  zIndex,
  breakpoints,
} satisfies NebulaTheme;

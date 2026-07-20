import {
  animation,
  blur,
  breakpoints,
  font,
  gray,
  palettes,
  radius,
  shadows,
  sizes,
  spacing,
  zIndex,
  type NebulaTheme,
} from "@stellaria/nebula-tokens";

import { FlipScale } from "./scales.js";

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
      base: palettes.dark["100"],
      raised: palettes.dark["300"],
      overlay: palettes.dark["400"],
      sunken: palettes.dark["50"],
    },
    text: {
      primary: gray["50"],
      secondary: gray["300"],
      muted: gray["400"],
      inverted: gray["900"],
      onPrimary: palettes.dark["100"],
    },
    border: {
      subtle: gray["800"],
      default: gray["700"],
      strong: gray["500"],
      focus: palettes.indigo["400"],
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
          background: "rgba(24, 24, 27, 0.48)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          backdropFilter: `blur(${blur.sm})`,
        },
        default: {
          background: "rgba(24, 24, 27, 0.58)",
          border: "1px solid rgba(255, 255, 255, 0.10)",
          backdropFilter: `blur(${blur.md})`,
        },
        strong: {
          background: "rgba(24, 24, 27, 0.68)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          backdropFilter: `blur(${blur.lg})`,
        },
      },
      noiseOpacity: 0.02,
      enabled: true,
    },
    shadows,
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
    outline: { background: "transparent", foreground: "scale.600", border: "scale.600" },
    light: { background: "scale.500.12", foreground: "scale.700", border: "none" },
    glass: {
      background: "surface.overlay",
      foreground: "text.primary",
      border: "border.subtle",
      glass: "default",
    },
    ghost: { background: "transparent", foreground: "scale.600", border: "none" },
    glow: { background: "scale.600", foreground: "text.onPrimary", border: "none", glow: "lg" },
    gradient: { background: "gradient.brand", foreground: "text.onPrimary", border: "none" },
    unstyled: { background: "transparent", foreground: "currentColor", border: "none" },
  },
  zIndex,
  breakpoints,
} satisfies NebulaTheme;

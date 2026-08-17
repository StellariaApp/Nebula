import {
  animation,
  blur,
  breakpoints,
  font,
  gray,
  ink,
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
  meta: { name: "nebula", scheme: "dark", version: "0.1.0" },
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
      overlay: palettes.dark["400"],
      base: palettes.dark["600"],
      raised: palettes.dark["700"],
      sunken: palettes.dark["800"],
      hover: palettes.dark["700"],
      active: palettes.dark["700"],
      hoverActive: palettes.dark["800"],
      disabled: palettes.dark["700"],
    },
    text: {
      primary: gray["50"],
      secondary: gray["300"],
      muted: gray["400"],
      placeholder: gray["400"],
      inverted: gray["900"],
      onPrimary: palettes.dark["100"],
      onGradient: palettes.dark["100"],
      disabled: gray["800"],
    },
    border: {
      subtle: palettes.dark["700"],
      default: palettes.dark["700"],
      strong: gray["500"],
      focus: palettes.indigo["400"],
      disabled: gray["900"],
    },
  },
  ink,
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
        veil: {
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: `blur(${blur.xxs}) saturate(120%)`,
          borderColor: "#3f4249",
        },
        band: {
          background: "rgba(15, 17, 25, 0.78)",
          backdropFilter: `blur(${blur.xxs}) saturate(110%)`,
          borderColor: "#23252c",
        },
        control: {
          background: "rgba(15, 17, 25, 0.81)",
          backdropFilter: `blur(${blur.xs}) saturate(120%)`,
          borderColor: "#23252c",
        },
        subtle: {
          background: "rgba(15, 17, 25, 0.84)",
          backdropFilter: `blur(${blur.sm}) saturate(130%)`,
          borderColor: "#23252c",
        },
        default: {
          background: "rgba(15, 17, 25, 0.87)",
          backdropFilter: `blur(${blur.lg}) saturate(140%)`,
          borderColor: "#23252c",
        },
        strong: {
          background: "rgba(15, 17, 25, 0.90)",
          backdropFilter: `blur(${blur.xl}) saturate(140%)`,
          borderColor: "#23252c",
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
          { color: palettes.indigo["500"], position: 0 },
          { color: palettes.violet["500"], position: 100 },
        ],
      },
      accent: {
        type: "linear",
        angle: 90,
        stops: [
          { color: palettes.violet["500"], position: 0 },
          { color: palettes.pink["500"], position: 100 },
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
    filled: { background: "scale.500", foreground: "text.onPrimary", border: "none" },
    outline: { background: "transparent", foreground: "scale.700", border: "scale.600" },
    light: { background: "scale.500.12", foreground: "scale.800", border: "none" },
    glass: {
      background: "surface.overlay",
      foreground: "text.primary",
      border: "border.subtle",
      glass: "control",
    },
    ghost: { background: "transparent", foreground: "scale.700", border: "none" },
    glow: { background: "scale.500", foreground: "text.onPrimary", border: "none", glow: "lg" },
    gradient: { background: "gradient.brand", foreground: "text.onPrimary", border: "none" },
    unstyled: { background: "transparent", foreground: "currentColor", border: "none" },
  },
  zIndex,
  breakpoints,
} satisfies NebulaTheme;

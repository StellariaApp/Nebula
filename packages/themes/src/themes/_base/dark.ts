import {
  animation,
  blur,
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

import { FlipScale } from "../scales.js";
import { darkShadows } from "../shadows.js";
import { THEME_VERSION } from "../../version.js";

export const baseDark = {
  meta: { name: "base", scheme: "dark", version: THEME_VERSION },
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
          borderColor: "rgba(255, 255, 255, 0.05)",
        },
        band: {
          background: "rgba(15, 17, 25, 0.46)",
          backdropFilter: `blur(${blur.xs}) saturate(110%)`,
          borderColor: "rgba(255, 255, 255, 0.06)",
        },
        control: {
          background: "rgba(15, 17, 25, 0.48)",
          backdropFilter: `blur(${blur.sm}) saturate(120%)`,
          borderColor: "rgba(255, 255, 255, 0.07)",
        },
        subtle: {
          background: "rgba(15, 17, 25, 0.56)",
          backdropFilter: `blur(${blur.md}) saturate(130%)`,
          borderColor: "rgba(255, 255, 255, 0.08)",
        },
        default: {
          background: "rgba(15, 17, 25, 0.69)",
          backdropFilter: `blur(${blur.lg}) saturate(140%)`,
          borderColor: "rgba(255, 255, 255, 0.10)",
        },
        strong: {
          background: "rgba(15, 17, 25, 0.90)",
          backdropFilter: `blur(${blur.xl}) saturate(140%)`,
          borderColor: "rgba(255, 255, 255, 0.12)",
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
      glass: "veil",
    },
    ghost: { background: "transparent", foreground: "scale.700", border: "none" },
    glow: { background: "scale.500", foreground: "text.onPrimary", border: "none", glow: "lg" },
    gradient: { background: "gradient.brand", foreground: "text.onPrimary", border: "none" },
    unstyled: { background: "transparent", foreground: "currentColor", border: "none" },
  },
  zIndex,
} satisfies NebulaTheme;

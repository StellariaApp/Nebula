/**
 * nebula-light — tema default (docs/02 §3): enterprise vibrante, indigo/violet,
 * Geist, motion standard, glass on (decisión Stellaria).
 *
 * Mapa rol→paso (validado por tools/contrast-check):
 * - surface: light.50 / light.100 / light.50 / light.300
 * - text: gray.900 / gray.700 / gray.600 / gray.50 / light.50
 * - border: gray.200 / gray.300 / gray.600 / indigo.600
 * - texto de estado: semantic.*.700 sobre surface.base
 */
import {
  animation,
  blur,
  breakpoints,
  font,
  glass,
  gray,
  palettes,
  radius,
  shadows,
  sizes,
  spacing,
  zIndex,
  type NebulaTheme,
} from "@stellaria/nebula-tokens";

export const nebulaLight = {
  meta: { name: "nebula-light", scheme: "light", version: "0.1.0" },
  palettes,
  colors: {
    // Las 16 paletas accesibles por nombre (`colors.teal`…); los roles de abajo
    // las sobrescriben donde comparten nombre. Identidad sin invertir.
    ...palettes,
    primary: palettes.indigo,
    accent: palettes.violet,
    gray,
    semantic: {
      success: palettes.green,
      warning: palettes.yellow,
      error: palettes.red,
      info: palettes.blue,
    },
    surface: {
      base: palettes.light["50"],
      raised: palettes.light["100"],
      overlay: palettes.light["50"],
      sunken: palettes.light["300"],
    },
    text: {
      primary: gray["900"],
      secondary: gray["700"],
      muted: gray["600"],
      inverted: gray["50"],
      onPrimary: palettes.light["50"],
    },
    border: {
      subtle: gray["200"],
      default: gray["300"],
      strong: gray["600"],
      focus: palettes.indigo["600"],
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
    glass: { surface: glass.surface, noiseOpacity: glass.noiseOpacity, enabled: true },
    shadows,
    gradients: {
      brand: {
        type: "linear",
        angle: 135,
        stops: [
          { color: palettes.indigo["600"], position: 0 },
          { color: palettes.violet["600"], position: 100 },
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
          { color: palettes.indigo["50"], position: 0 },
          { color: palettes.light["50"], position: 100 },
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

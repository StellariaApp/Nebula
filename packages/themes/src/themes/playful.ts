/**
 * playful — preset demostrativo (docs/02 §3, borrador aprobado): radius full,
 * densidad comfortable (unit 5), motion tier expressive, gradients agresivos.
 * `filled` pinta con gradient.brand (docs/02 §2.6: hasta el significado visual
 * de una variante es temable). Valores iniciales razonables; calibración visual
 * en W1.3/W1.4.
 *
 * Mapa rol→paso: surface light.50 / light.100 / light.50 / light.300 ·
 * text gray.900 / gray.700 / gray.600 / gray.50 / light.50 ·
 * border gray.200 / gray.300 / gray.600 / grape.600 · estado semantic.*.700.
 */
import {
  animation,
  blur,
  breakpoints,
  font,
  glass,
  gray,
  palettes,
  shadows,
  sizes,
  spacing,
  zIndex,
  type NebulaTheme,
} from "@stellaria/nebula-tokens";

export const playful = {
  meta: { name: "playful", scheme: "light", version: "0.1.0" },
  palettes,
  colors: {
    ...palettes,
    primary: palettes.grape,
    accent: palettes.pink,
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
      focus: palettes.grape["600"],
    },
  },
  font,
  // Radius full: todo muy redondeado.
  radius: { xxs: 4, xs: 6, sm: 10, md: 16, lg: 20, xl: 28, xxl: 36, full: 9999 },
  spacing: { unit: 5, scale: spacing.scale },
  sizes,
  motion: {
    tier: "expressive",
    duration: animation.duration,
    easing: animation.easing,
    spring: animation.spring,
  },
  effects: {
    blur,
    glass: { surface: glass.surface, noiseOpacity: 0.03, enabled: true },
    shadows,
    gradients: {
      brand: {
        type: "linear",
        angle: 135,
        stops: [
          { color: palettes.grape["500"], position: 0 },
          { color: palettes.pink["500"], position: 55 },
          { color: palettes.orange["400"], position: 100 },
        ],
      },
      accent: {
        type: "linear",
        angle: 90,
        stops: [
          { color: palettes.cyan["400"], position: 0 },
          { color: palettes.lime["400"], position: 100 },
        ],
      },
      surface: {
        type: "radial",
        angle: 0,
        stops: [
          { color: palettes.pink["50"], position: 0 },
          { color: palettes.light["50"], position: 100 },
        ],
      },
    },
  },
  variantMap: {
    // filled temable con gradiente (02 §2.6) — el gate AA de filled se valida
    // igualmente sobre primary.600/700 en pairs.ts.
    filled: { background: "gradient.brand", foreground: "text.onPrimary", border: "none" },
    outline: { background: "transparent", foreground: "scale.600", border: "scale.600" },
    light: { background: "scale.500.16", foreground: "scale.700", border: "none" },
    glass: {
      background: "surface.overlay",
      foreground: "text.primary",
      border: "border.subtle",
      glass: "strong",
    },
    ghost: { background: "transparent", foreground: "scale.600", border: "none" },
    glow: { background: "scale.600", foreground: "text.onPrimary", border: "none", glow: "xl" },
    gradient: { background: "gradient.accent", foreground: "text.primary", border: "none" },
    unstyled: { background: "transparent", foreground: "currentColor", border: "none" },
  },
  zIndex,
  breakpoints,
} satisfies NebulaTheme;

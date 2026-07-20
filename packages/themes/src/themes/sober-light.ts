/**
 * sober-light — preset demostrativo (docs/02 §3, borrador aprobado): banca /
 * enterprise sobrio. Radius mínimo, densidad compacta (unit 3), motion tier
 * minimal, glass OFF, y variantMap plano: `gradient` pinta sólido y `glow` no
 * emite halo — demuestra que hasta el significado de una variante es temable.
 * Valores iniciales razonables; calibración visual en W1.3/W1.4.
 *
 * Mapa rol→paso: surface gray.50 / light.50 / light.50 / gray.100 ·
 * text gray.950 / gray.800 / gray.700 / gray.50 / light.50 ·
 * border gray.200 / gray.300 / gray.700 / blue.600 · estado semantic.*.700.
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

export const soberLight = {
  meta: { name: "sober-light", scheme: "light", version: "0.1.0" },
  palettes,
  colors: {
    ...palettes,
    primary: palettes.blue,
    accent: palettes.teal,
    gray,
    semantic: {
      success: palettes.green,
      warning: palettes.yellow,
      error: palettes.red,
      info: palettes.blue,
    },
    surface: {
      base: gray["50"],
      raised: palettes.light["50"],
      overlay: palettes.light["50"],
      sunken: gray["100"],
    },
    text: {
      primary: gray["950"],
      secondary: gray["800"],
      muted: gray["700"],
      inverted: gray["50"],
      onPrimary: palettes.light["50"],
    },
    border: {
      subtle: gray["200"],
      default: gray["300"],
      strong: gray["700"],
      focus: palettes.blue["600"],
    },
  },
  font,
  // Radius mínimo: esquinas casi rectas; `full` se conserva para pills/avatars.
  radius: { xxs: 0, xs: 0, sm: 2, md: 2, lg: 4, xl: 6, xxl: 8, full: 9999 },
  spacing: { unit: 3, scale: spacing.scale },
  sizes,
  motion: {
    tier: "minimal",
    duration: animation.duration,
    easing: animation.easing,
    spring: animation.spring,
  },
  effects: {
    blur,
    // Recetas glass presentes por contrato pero apagadas (enabled: false).
    glass: { surface: glass.surface, noiseOpacity: 0, enabled: false },
    shadows,
    gradients: {
      brand: {
        type: "linear",
        angle: 135,
        stops: [
          { color: palettes.blue["700"], position: 0 },
          { color: palettes.blue["500"], position: 100 },
        ],
      },
      accent: {
        type: "linear",
        angle: 90,
        stops: [
          { color: palettes.teal["700"], position: 0 },
          { color: palettes.teal["500"], position: 100 },
        ],
      },
      surface: {
        type: "radial",
        angle: 0,
        stops: [
          { color: gray["50"], position: 0 },
          { color: palettes.light["50"], position: 100 },
        ],
      },
    },
  },
  variantMap: {
    filled: { background: "scale.600", foreground: "text.onPrimary", border: "none" },
    outline: { background: "transparent", foreground: "scale.700", border: "scale.600" },
    light: { background: "scale.500.10", foreground: "scale.700", border: "none" },
    // Sin receta glass: cae a superficie elevada con borde (glass.enabled = false).
    glass: { background: "surface.raised", foreground: "text.primary", border: "border.default" },
    ghost: { background: "transparent", foreground: "scale.700", border: "none" },
    // Sin halo: en sober `glow` pinta como filled profundo.
    glow: { background: "scale.700", foreground: "text.onPrimary", border: "none" },
    // Sin gradiente: pinta sólido profundo.
    gradient: { background: "scale.700", foreground: "text.onPrimary", border: "none" },
    unstyled: { background: "transparent", foreground: "currentColor", border: "none" },
  },
  zIndex,
  breakpoints,
} satisfies NebulaTheme;

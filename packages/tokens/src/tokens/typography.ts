/**
 * Tipografía base migrada de Stellaria (04 §1: "tal cual") con la escala
 * reorganizada en plano según el contrato ThemeFont (02 §2.2).
 */
import type { ThemeFont } from "../theme/theme";

export const family = {
  sans: "Geist, Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
  mono: "Geist Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
} as const;

export const size = {
  h1: 44,
  h2: 36,
  h3: 30,
  h4: 24,
  h5: 20,
  h6: 18,
  body1: 14,
  body2: 12,
  body3: 10,
  button: 14,
  // TODO(calibración F1/F2): probable ajuste por legibilidad AA (roadmap, supuesto 9).
  caption: 8,
} as const;

export const lineHeight = {
  tight: 1.2,
  normal: 1.45,
  relaxed: 1.65,
} as const;

export const weight = {
  thin: 100,
  extralight: 200,
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
} as const;

export const letterSpacing = {
  tight: -0.16,
  normal: 0,
  wide: 0.16,
} as const;

export const font = {
  family,
  size,
  lineHeight,
  weight,
  letterSpacing,
} as const satisfies ThemeFont;

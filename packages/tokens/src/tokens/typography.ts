import type { ThemeFont } from "../theme/theme.js";

export const family = {
  sans: "Geist, Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
  mono: "Geist Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
} as const;

export const size = {
  h1: 48,
  h2: 40,
  h3: 32,
  h4: 28,
  h5: 24,
  h6: 20,
  body1: 16,
  body2: 14,
  body3: 13,
  button: 14,
  caption: 12,
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

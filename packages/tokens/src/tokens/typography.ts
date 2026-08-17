import type { TextSizeName } from "../theme/primitives.js";
import type { ThemeFont } from "../theme/theme.js";

export const family = {
  sans: "Geist Variable, Geist, Geist Sans, Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
  mono: "Geist Mono Variable, Geist Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
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

export const leading = {
  h1: 1.1,
  h2: 1.12,
  h3: 1.14,
  h4: 1.15,
  h5: 1.2,
  h6: 1.25,
  body1: 1.6,
  body2: 1.55,
  body3: 1.5,
  button: 1.2,
  caption: 1.45,
} as const satisfies Record<TextSizeName, number>;

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
  tight: -0.03,
  normal: 0,
  wide: 0.08,
} as const;

export const display = {
  size: "clamp(3.75rem, 5.7vw, 4.75rem)",
  lineHeight: 0.95,
  letterSpacing: -0.055,
} as const;

export const font = {
  family,
  size,
  leading,
  lineHeight,
  weight,
  letterSpacing,
  display,
} as const satisfies ThemeFont;

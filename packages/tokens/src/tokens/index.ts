import { animation } from "./animation";
import { effects } from "./effects";
import { breakpoints, radius, sizes, spacing, zIndex } from "./layout";
import { paletteNames } from "./palettes";
import { font } from "./typography";

export { animation } from "./animation";
export { blur, effects, glass, shadows } from "./effects";
export { breakpoints, radius, sizes, spacing, zIndex } from "./layout";
export { paletteNames } from "./palettes";
export { family, font, letterSpacing, lineHeight, size, weight } from "./typography";

/** Agregado base (sin colores — las paletas 50–950 llegan en F0.3). */
export const tokens = {
  animation,
  font,
  spacing,
  radius,
  sizes,
  effects,
  breakpoints,
  zIndex,
  paletteNames,
} as const;

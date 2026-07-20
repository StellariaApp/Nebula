import type { BreakpointName, RadiusName, SpacingName, ZIndexName } from "../theme/primitives.js";
import type { ThemeSizes, ThemeSpacing } from "../theme/theme.js";
import type { Size } from "../types/variants.js";

export const spacing = {
  unit: 4,
  scale: {
    none: 0,
    xxs: 0.5,
    xs: 1,
    sm: 2,
    md: 4,
    lg: 6,
    xl: 8,
    xxl: 12,
    xxxl: 16,
  } satisfies Record<SpacingName, number>,
} as const satisfies ThemeSpacing;

export const radius = {
  xxs: 0,
  xs: 2,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  xxl: 28,
  full: 9999,
} as const satisfies Record<RadiusName, number>;

export const sizes = {
  control: {
    xs: 30,
    sm: 36,
    md: 42,
    lg: 50,
    xl: 60,
  } satisfies Record<Size, number>,
} as const satisfies ThemeSizes;

export const breakpoints = {
  phone: 576,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
  wide: 1536,
} as const satisfies Record<BreakpointName, number>;

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  overlay: 1200,
  modal: 1300,
  popover: 1400,
  toast: 1500,
  tooltip: 1600,
} as const satisfies Record<ZIndexName, number>;

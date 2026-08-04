import type { BreakpointName, RadiusName, SpacingName, ZIndexName } from "../theme/primitives.js";
import type { ThemeSizes, ThemeSpacing } from "../theme/theme.js";
import type { Size } from "../types/variants.js";

export const spacing = {
  unit: 4,
  scale: {
    none: 0,
    xxs: 0.5,
    xs: 1,
    u1_5: 1.5,
    sm: 3,
    u2_5: 2.5,
    u3: 3,
    u3_5: 3.5,
    md: 4,
    u5: 5,
    lg: 5.5,
    xl: 7,
    xxl: 9.5,
    xxxl: 12.5,
  } satisfies Record<SpacingName, number>,
} as const satisfies ThemeSpacing;

export const radius = {
  none: 0,
  xxs: 0,
  xs: 4,
  sm: 9,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 32,
  full: 9999,
} as const satisfies Record<RadiusName, number>;

export const sizes = {
  control: {
    xs: 32,
    sm: 40,
    md: 48,
    lg: 56,
    xl: 64,
  } satisfies Record<Size, number>,
  compact: {
    xs: 20,
    sm: 24,
    md: 28,
    lg: 32,
    xl: 36,
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

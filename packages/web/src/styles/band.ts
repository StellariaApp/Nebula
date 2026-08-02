import type { Size } from "@stellaria/nebula-tokens";

type BandSize = Exclude<Size, "xs">;

export const BAND_PADDING = {
  xl: 120,
  lg: 80,
  md: 48,
  sm: 24,
} as const satisfies Record<BandSize, number>;

export const BAND_MIN_HEIGHT = {
  xl: 320,
  lg: 224,
  md: 144,
  sm: 80,
} as const satisfies Record<BandSize, number>;

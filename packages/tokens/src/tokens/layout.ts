/**
 * Geometría, densidad y layout global migrados de Stellaria (04 §1) y adaptados
 * al contrato (02 §2.3): spacing pasa a `unit × scale` para densidad temable.
 */
import type {
  BreakpointName,
  RadiusName,
  SpacingName,
  ZIndexName,
} from "../theme/primitives";
import type { ThemeSizes, ThemeSpacing } from "../theme/theme";
import type { Size } from "../types/variants";

/**
 * px resueltos = `unit × scale[token]`. Con unit 4 reproduce EXACTAMENTE la
 * escala absoluta de Stellaria (0/2/4/8/16/24/32/48/64).
 * Densidad: compact (unit 3) ↔ comfortable (unit 5).
 */
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

/** Alturas de control compartidas W/N (02 §2.3 — valores cerrados). */
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

export const SHADES = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "950",
] as const;

export type Shade = (typeof SHADES)[number];

export type CurveProfile = "chromatic" | "surface-light" | "surface-dark";

export const CHROMATIC_L: readonly number[] = [
  0.975, 0.94, 0.89, 0.82, 0.7, 0.63, 0.49, 0.43, 0.37, 0.31, 0.24,
];

/**
 * Peso del `lift` por paso. Maximo en el 500 y nulo en los extremos para no romper la rampa, y se
 * apaga rapido hacia el lado oscuro: del 700 en adelante son los pasos que se usan como TEXTO, y
 * ahi subir la luminosidad cuesta contraste sobre el lienzo.
 */
export const LIFT_WEIGHT: readonly number[] = [0, 0.15, 0.35, 0.6, 0.85, 1, 0.35, 0, 0, 0, 0];

export const CHROMA_MULT: readonly number[] = [
  0.1, 0.2, 0.36, 0.56, 0.78, 0.95, 1.0, 0.94, 0.84, 0.72, 0.58,
];

export const SURFACE_LIGHT_L: readonly number[] = [
  1.0, 0.995, 0.988, 0.978, 0.965, 0.952, 0.938, 0.922, 0.905, 0.885, 0.862,
];

export const SURFACE_DARK_L: readonly number[] = [
  0.135, 0.148, 0.162, 0.178, 0.196, 0.215, 0.235, 0.256, 0.278, 0.3, 0.322,
];

export function LCurveFor(profile: CurveProfile): readonly number[] {
  switch (profile) {
    case "chromatic":
      return CHROMATIC_L;
    case "surface-light":
      return SURFACE_LIGHT_L;
    case "surface-dark":
      return SURFACE_DARK_L;
  }
}

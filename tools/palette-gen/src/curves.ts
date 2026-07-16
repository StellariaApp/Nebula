/**
 * Curvas de luminancia y chroma del generador (ADR-009).
 * Las semillas SOLO orientan hue/carácter; la curva la define el generador
 * (decisión cerrada — los hex legacy no se portan 1:1).
 */

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

/**
 * Curva L (OKLCH, 0–1) compartida por TODAS las paletas cromáticas —
 * garantiza pasos equivalentes entre paletas (mismo rol ⇒ misma luminancia).
 */
export const CHROMATIC_L: readonly number[] = [
  0.975, 0.94, 0.89, 0.82, 0.72, 0.63, 0.55, 0.48, 0.41, 0.35, 0.27,
];

/**
 * Multiplicador de chroma por paso (campana con pico en 600): los extremos
 * se destiñen hacia superficie, el centro concentra la identidad del color.
 * El chroma absoluto se ancla al de la semilla en su paso más cercano.
 */
export const CHROMA_MULT: readonly number[] = [
  0.1, 0.2, 0.36, 0.56, 0.78, 0.95, 1.0, 0.94, 0.84, 0.72, 0.58,
];

/**
 * Perfil de superficie clara (paleta `light`): rampa comprimida de blancos.
 * Preserva el carácter legacy (#ffffff→#d6d6d6) extendido a 11 pasos.
 */
export const SURFACE_LIGHT_L: readonly number[] = [
  1.0, 0.995, 0.988, 0.978, 0.965, 0.952, 0.938, 0.922, 0.905, 0.885, 0.862,
];

/**
 * Perfil de superficie oscura (paleta `dark`): rampa comprimida de negros.
 * Dirección legacy preservada: 50 = más oscuro → 950 = más claro.
 */
export const SURFACE_DARK_L: readonly number[] = [
  0.135, 0.148, 0.162, 0.178, 0.196, 0.215, 0.235, 0.256, 0.278, 0.3, 0.322,
];

export function lCurveFor(profile: CurveProfile): readonly number[] {
  switch (profile) {
    case "chromatic":
      return CHROMATIC_L;
    case "surface-light":
      return SURFACE_LIGHT_L;
    case "surface-dark":
      return SURFACE_DARK_L;
  }
}

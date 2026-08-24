import type { ColorScheme, GlassLevel, GlassSurfaceRecipe, RadiusName } from "@stellaria/nebula-tokens";

import { GlassOf, ShiftRamp, type Ramp } from "./ramp.js";

/**
 * Los ejes que un producto elige y el catálogo no conoce: no son contrato nuevo, son **presets sobre
 * lo que el contrato ya tiene** —`radius`, `spacing.unit`, `motion.tier` y `effects.glass`—.
 *
 * Viven aquí y no en la capa de demo porque la semilla tiene que poder declararlos: es lo que hace
 * que un producto traiga sus valores puestos y que el panel, que deriva la elección del tema, los
 * enseñe solos sin que nadie los seleccione.
 */
export type Corner = "sharp" | "crisp" | "soft" | "plush" | "round";

export type Density = "compact" | "cosy" | "roomy";

export type Glass = "off" | "sheer" | "frosted" | "milky";

export const CORNERS: readonly Corner[] = ["sharp", "crisp", "soft", "plush", "round"];
export const DENSITIES: readonly Density[] = ["compact", "cosy", "roomy"];
export const GLASSES: readonly Glass[] = ["off", "sheer", "frosted", "milky"];

export const DENSITY_UNIT: Record<Density, number> = { compact: 3, cosy: 4, roomy: 5 };

/**
 * Cuánto empuja cada opción los dos extremos de la rampa del tema, en puntos. `frosted` es el tema
 * tal cual y `off` no toca el material, solo lo apaga.
 */
export const GLASS_SHIFT = {
  sheer: [-10, -20],
  milky: [10, 10],
} as const satisfies Record<"sheer" | "milky", readonly [number, number]>;

type Radii = Record<RadiusName, number>;

const SHARP: Radii = { none: 0, xxs: 0, xs: 0, sm: 0, md: 0, lg: 0, xl: 0, xxl: 0, full: 0 };

const ROUND: Radii = {
  none: 0,
  xxs: 10,
  xs: 14,
  sm: 20,
  md: 26,
  lg: 32,
  xl: 40,
  xxl: 48,
  full: 9999,
};

function Between(a: Radii, b: Radii): Radii {
  return Object.fromEntries(
    Object.keys(a).map((name) => {
      const key = name as RadiusName;
      return [key, key === "full" ? Math.max(a[key], b[key]) : Math.round((a[key] + b[key]) / 2)];
    }),
  ) as Radii;
}

/**
 * El radio de cada peldaño. Los tres extremos son tablas —`sharp` a cero, `soft` el del tema y
 * `round` el suyo— y **los dos intermedios se calculan**: `crisp` a medio camino entre recto y el del
 * tema, `plush` entre el del tema y redondo. Escribirlos a mano sería inventar dos tablas que se
 * desincronizan en cuanto una de las tres cambie.
 *
 * `full` no se interpola: es la píldora, y media píldora no significa nada.
 */
export function RadiusOf(soft: Radii, corner: Corner): Radii {
  if (corner === "soft") return soft;
  if (corner === "sharp") return SHARP;
  if (corner === "round") return ROUND;
  return corner === "crisp" ? Between(SHARP, soft) : Between(soft, ROUND);
}

/** El cristal de una opción sobre la rampa del tema. `off` deja el material como está: solo se apaga. */
export function GlassFor(
  ramp: Ramp,
  glass: Glass,
  scheme: ColorScheme,
): Record<GlassLevel, GlassSurfaceRecipe> {
  if (glass === "off" || glass === "frosted") return GlassOf(ramp, scheme);
  const [floor, ceiling] = GLASS_SHIFT[glass];
  return GlassOf(ShiftRamp(ramp, floor, ceiling), scheme);
}

import type {
  BlurLevel,
  ColorScheme,
  GlassLevel,
  GlassSurfaceRecipe,
} from "@stellaria/nebula-tokens";
import { blur } from "@stellaria/nebula-tokens";

/**
 * Los tres puntos del cristal, en enteros 0-100: el velo suelto, el suelo y el techo de la rampa
 * tintada. Los números **son las alfas**, así que 0-100 es el rango de verdad y se sujeta.
 */
export type Ramp = readonly [veil: number, bottom: number, top: number];

/**
 * El ascenso no es lineal, y el exponente no es una elección nueva: ajustando los cinco velos que el
 * tema tenía escritos a mano —`.46 .48 .56 .69 .90`— sale `2.2` en los tres puntos interiores. La
 * fórmula reproduce esa tabla clavada; lo único que cambia al mover la rampa son sus dos extremos.
 */
const CURVE = 2.2;

/**
 * Lo que el velo se aparta del valor declarado según el esquema, y por qué no es simétrico por
 * casualidad: es blanco sobre el fondo, y blanco sobre oscuro se lee al 5 % mientras que sobre claro
 * necesita más para existir. Light suma, dark resta.
 */
const VEIL_SPLIT = 5;

/** Los cinco niveles tintados, en orden. `veil` va aparte porque no es un escalón de la misma serie. */
const TINTED = ["band", "control", "subtle", "default", "strong"] as const;

/** La rampa de fábrica. `[10, 30, 70]` deja el velo de dark en `.05`, que es el que ya tenía. */
export const BASE_RAMP: Ramp = [10, 30, 70];

const BLUR: Record<GlassLevel, BlurLevel> = {
  veil: "xxs",
  band: "xs",
  control: "sm",
  subtle: "md",
  default: "lg",
  strong: "xl",
};

const SATURATE: Record<GlassLevel, number> = {
  veil: 120,
  band: 110,
  control: 120,
  subtle: 130,
  default: 140,
  strong: 140,
};

/** El filo, que no depende de la rampa: sube con el nivel y cambia de color con el esquema. */
const EDGE: Record<ColorScheme, Record<GlassLevel, number>> = {
  dark: { veil: 0.05, band: 0.06, control: 0.07, subtle: 0.08, default: 0.1, strong: 0.12 },
  light: { veil: 0.07, band: 0.07, control: 0.08, subtle: 0.08, default: 0.09, strong: 0.1 },
};

/** La tinta del velo por esquema. El escalón `veil` va en blanco en los dos, y por eso queda fuera. */
const TINT: Record<ColorScheme, string> = { dark: "15, 17, 25", light: "255, 255, 255" };
const EDGE_TINT: Record<ColorScheme, string> = { dark: "255, 255, 255", light: "0, 0, 0" };

/** El escalón `index` de `steps` entre los dos extremos, con el ascenso de la rampa. */
export function RampAt(from: number, to: number, index: number, steps: number): number {
  const t = steps <= 1 ? 1 : index / (steps - 1);
  return from + (to - from) * t ** CURVE;
}

/** Mueve los dos extremos sin tocar el velo: es lo que hace un eje de intensidad. */
export function ShiftRamp([veil, bottom, top]: Ramp, floor: number, ceiling: number): Ramp {
  return [veil, Math.max(0, bottom + floor), Math.min(100, top + ceiling)];
}

function Round(value: number): number {
  return Math.round(value * 100) / 100;
}

/** El velo del escalón suelto, ya repartido por esquema. */
export function VeilOf([veil]: Ramp, scheme: ColorScheme): number {
  const shifted = scheme === "dark" ? veil - VEIL_SPLIT : veil + VEIL_SPLIT;
  return Round(Math.min(100, Math.max(0, shifted)) / 100);
}

/**
 * Los seis niveles del cristal a partir de la rampa. El desenfoque, la saturación y el filo no salen
 * de ella —son la forma del material y no cambian con la cantidad—; lo único que reparte la rampa es
 * cuánto velo lleva cada nivel.
 */
export function GlassOf(ramp: Ramp, scheme: ColorScheme): Record<GlassLevel, GlassSurfaceRecipe> {
  const [, bottom, top] = ramp;
  const Recipe = (level: GlassLevel, background: string): GlassSurfaceRecipe => ({
    background,
    backdropFilter: `blur(${blur[BLUR[level]]}) saturate(${String(SATURATE[level])}%)`,
    borderColor: `rgba(${EDGE_TINT[scheme]}, ${String(EDGE[scheme][level])})`,
  });

  const out: Record<string, GlassSurfaceRecipe> = {
    veil: Recipe("veil", `rgba(255, 255, 255, ${String(VeilOf(ramp, scheme))})`),
  };
  TINTED.forEach((level, index) => {
    // Se sujeta porque aqui el numero ES la alfa, no una proporcion como en las superficies: un
    // valor fuera de rango deja un `rgba()` invalido, y un nivel invalido no pinta nada.
    const alpha = Round(Math.min(100, Math.max(0, RampAt(bottom, top, index, TINTED.length))) / 100);
    out[level] = Recipe(level, `rgba(${TINT[scheme]}, ${String(alpha)})`);
  });
  return out;
}

import type { ColorScheme, NebulaTheme } from "@stellaria/nebula-tokens";

import { baseDark } from "../themes/_base/dark.js";
import { baseLight } from "../themes/_base/light.js";
import type { ThemeSeed } from "../themes/_seed/index.js";
import { FlipScale } from "../themes/scales.js";

const FOCUS_STEP = { dark: "400", light: "600" } as const;
const CHANNEL_MAX = 255;

const PRODUCT_INK_FLOOR = 2;

function Channels(hex: string): [number, number, number] {
  const raw = hex.replace("#", "");
  return [
    Number.parseInt(raw.slice(0, 2), 16),
    Number.parseInt(raw.slice(2, 4), 16),
    Number.parseInt(raw.slice(4, 6), 16),
  ];
}

function Shade(hex: string, seed: ThemeSeed, sign: number): string {
  const base = Channels(hex);
  const tint = Channels(seed.tint);
  const mixed = base.map((value, index) => {
    const blended = value * (1 - seed.wash) + (tint[index] as number) * seed.wash;
    return Math.max(0, Math.min(CHANNEL_MAX, Math.round(blended + seed.lift * sign)));
  });
  return `#${mixed.map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

function Canvas<T extends Record<string, string>>(surface: T, seed: ThemeSeed, sign: number): T {
  return Object.fromEntries(
    Object.entries(surface).map(([role, hex]) => [role, Shade(hex, seed, sign)]),
  ) as T;
}

/**
 * Un tema de producto entero a partir de dos semillas de paleta. Es la prueba del argumento de
 * Nebula: lo único que cambia entre dos productos es esto, y el catálogo no se entera.
 */
export function BuildProduct(seed: ThemeSeed, scheme: ColorScheme): NebulaTheme {
  const base = scheme === "dark" ? baseDark : baseLight;
  const dark = scheme === "dark";

  return {
    ...base,
    meta: { name: seed.name, scheme, version: "0.1.0" },
    ink: { floor: seed.inkFloor ?? PRODUCT_INK_FLOOR },
    colors: {
      ...base.colors,
      primary: dark ? FlipScale(seed.primary) : seed.primary,
      accent: dark ? FlipScale(seed.accent) : seed.accent,
      surface: Canvas(base.colors.surface, seed, dark ? 1 : -1),
      border: { ...base.colors.border, focus: seed.primary[FOCUS_STEP[scheme]] },
    },
    effects: {
      ...base.effects,
      gradients: {
        ...base.effects.gradients,
        brand: {
          type: "linear",
          angle: 100,
          stops: [
            { color: seed.from, position: 0 },
            { color: seed.to, position: 100 },
          ],
        },
      },
    },
  };
}

/**
 * Los dos extremos del gradiente de marca de cada tema, que es lo único que hace falta para el
 * swatch del selector. Salen de la semilla y NO dependen del esquema: `BuildProduct` los copia tal
 * cual a `effects.gradients.brand`. Leerlos de aquí evita construir el tema para pintar un punto.
 */

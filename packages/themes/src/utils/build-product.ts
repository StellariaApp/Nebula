import {
  palettes,
  type ColorScheme,
  type GradientRole,
  type GradientToken,
  type NebulaTheme,
} from "@stellaria/nebula-tokens";

import { baseDark } from "../themes/_base/dark.js";
import { baseLight } from "../themes/_base/light.js";
import type { ThemeSeed } from "../themes/_seed/index.js";
import { FlipScale } from "../themes/scales.js";
import { THEME_VERSION } from "../version.js";
import { DENSITY_UNIT, GlassFor, RadiusOf } from "./axes.js";
import { BorderLiftOf, LiftOf } from "./lift.js";
import { BASE_RAMP } from "./ramp.js";

const FOCUS_STEP = { dark: "400", light: "600" } as const;
const CHANNEL_MAX = 255;

const PRODUCT_INK_FLOOR = 2;

const PRODUCT_ANGLE = 100;

function Channels(hex: string): [number, number, number] {
  const raw = hex.replace("#", "");
  return [
    Number.parseInt(raw.slice(0, 2), 16),
    Number.parseInt(raw.slice(2, 4), 16),
    Number.parseInt(raw.slice(4, 6), 16),
  ];
}

function Shade(hex: string, seed: ThemeSeed, sign: number, lift: number): string {
  const base = Channels(hex);
  const tint = Channels(seed.tint);
  const mixed = base.map((value, index) => {
    const blended = value * (1 - seed.wash) + (tint[index] as number) * seed.wash;
    return Math.max(0, Math.min(CHANNEL_MAX, Math.round(blended + lift * sign)));
  });
  return `#${mixed.map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

/**
 * Los filos, con el mismo lavado y el mismo desplazamiento que la superficie que bordean. Sin esto el
 * borde se queda quieto mientras su superficie se mueve y acaba invirtiendose: filo mas oscuro que su
 * fondo en dark, y en light directamente invisible. `focus` no entra —sale de `primary`— y se
 * sobreescribe despues.
 */
function Edges<T extends Record<string, string>>(border: T, seed: ThemeSeed, sign: number): T {
  return Object.fromEntries(
    Object.entries(border).map(([role, hex]) => [
      role,
      role === "focus" ? hex : Shade(hex, seed, sign, BorderLiftOf(seed.lift, role)),
    ]),
  ) as T;
}

function Canvas<T extends Record<string, string>>(surface: T, seed: ThemeSeed, sign: number): T {
  return Object.fromEntries(
    Object.entries(surface).map(([role, hex]) => [
      role,
      Shade(hex, seed, sign, LiftOf(seed.lift, role)),
    ]),
  ) as T;
}

/**
 * Los degradados que salen de la semilla. `brand` es el eje del producto —y tiene que ser `brand`,
 * porque es el rol que el catalogo pide por defecto: escribirlo en `accent` deja a los dieciseis
 * pintando el de la base—. `surface` es el fondo de la pagina, y por eso no lo toca `lift`.
 */
function GenerateGradients(
  seed: ThemeSeed,
  scheme: ColorScheme,
): Partial<Record<GradientRole, GradientToken>> {
  return {
    brand: {
      type: "linear",
      angle: seed.angle ?? PRODUCT_ANGLE,
      stops: [
        { color: seed.from, position: 0 },
        { color: seed.to, position: 100 },
      ],
    },
    surface: {
      type: "radial",
      angle: 0,
      stops:
        scheme === "dark"
          ? [
              { color: seed.primary["950"], position: 0 },
              { color: palettes.dark["100"], position: 100 },
            ]
          : [
              { color: seed.primary["50"], position: 0 },
              { color: palettes.light["50"], position: 100 },
            ],
    },
  };
}

export function BuildProduct(seed: ThemeSeed, scheme: ColorScheme): NebulaTheme {
  const base = scheme === "dark" ? baseDark : baseLight;
  const dark = scheme === "dark";

  return {
    ...base,
    meta: { name: seed.name, scheme, version: THEME_VERSION },
    ink: { floor: seed.inkFloor ?? PRODUCT_INK_FLOOR },
    motion: { ...base.motion, tier: seed.motion ?? base.motion.tier },
    radius: seed.corner === undefined ? base.radius : RadiusOf(base.radius, seed.corner),
    spacing: {
      ...base.spacing,
      unit: seed.density === undefined ? base.spacing.unit : DENSITY_UNIT[seed.density],
    },
    colors: {
      ...base.colors,
      primary: dark ? FlipScale(seed.primary) : seed.primary,
      accent: dark ? FlipScale(seed.accent) : seed.accent,
      surface: Canvas(base.colors.surface, seed, dark ? 1 : -1),
      border: { ...Edges(base.colors.border, seed, dark ? 1 : -1), focus: seed.primary[FOCUS_STEP[scheme]] },
    },
    effects: {
      ...base.effects,
      glass: {
        ...base.effects.glass,
        surface:
          seed.ramp === undefined && seed.glass === undefined
            ? base.effects.glass.surface
            : GlassFor(seed.ramp ?? BASE_RAMP, seed.glass ?? "frosted", scheme),
        enabled: seed.glass === undefined ? base.effects.glass.enabled : seed.glass !== "off",
      },
      gradients: {
        ...base.effects.gradients,
        ...GenerateGradients(seed, scheme),
      },
    },
  };
}

/**
 * Los dos extremos del gradiente de marca de cada tema, que es lo único que hace falta para el
 * swatch del selector. Salen de la semilla y NO dependen del esquema: `BuildProduct` los copia tal
 * cual a `effects.gradients.brand`. Leerlos de aquí evita construir el tema para pintar un punto.
 */

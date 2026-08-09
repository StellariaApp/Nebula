import { FlipScale, nebulaDark, nebulaLight } from "@stellaria/nebula-themes";
import { palettes, type NebulaTheme, type Scale11 } from "@stellaria/nebula-tokens";

export type ProductName =
  "rosette" | "stellaria" | "lagrange" | "polaris" | "aurora" | "nova" | "eclipse" | "cosmos";

interface ProductSeed {
  primary: Scale11;
  accent: Scale11;
  from: string;
  to: string;
  tint: string;
  wash: number;
  lift: number;
}

const PRODUCT_SEEDS: Record<ProductName, ProductSeed> = {
  rosette: {
    primary: palettes.rose,
    accent: palettes.pink,
    from: palettes.rose["500"],
    to: palettes.pink["400"],
    tint: palettes.rose["900"],
    wash: 0.009,
    lift: -12,
  },
  stellaria: {
    primary: palettes.blue,
    accent: palettes.cyan,
    from: palettes.blue["500"],
    to: palettes.cyan["400"],
    tint: palettes.blue["800"],
    wash: 0.05,
    lift: -6,
  },
  polaris: {
    primary: palettes.cyan,
    accent: palettes.indigo,
    from: palettes.cyan["500"],
    to: palettes.indigo["400"],
    tint: palettes.cyan["800"],
    wash: 0.05,
    lift: -6,
  },
  lagrange: {
    primary: palettes.orange,
    accent: palettes.rose,
    from: palettes.rose["500"],
    to: palettes.orange["400"],
    tint: palettes.orange["200"],
    wash: 0.009,
    lift: 6,
  },
  aurora: {
    primary: palettes.grape,
    accent: palettes.pink,
    from: palettes.grape["500"],
    to: palettes.pink["400"],
    tint: palettes.grape["800"],
    wash: 0.05,
    lift: -6,
  },
  nova: {
    primary: palettes.cyan,
    accent: palettes.violet,
    from: palettes.cyan["500"],
    to: palettes.violet["400"],
    tint: palettes.cyan["800"],
    wash: 0.05,
    lift: -6,
  },
  eclipse: {
    primary: palettes.blue,
    accent: palettes.slate,
    from: palettes.blue["500"],
    to: palettes.slate["400"],
    tint: palettes.blue["800"],
    wash: 0.05,
    lift: -6,
  },
  cosmos: {
    primary: palettes.indigo,
    accent: palettes.grape,
    from: palettes.indigo["500"],
    to: palettes.grape["400"],
    tint: palettes.indigo["800"],
    wash: 0.05,
    lift: -6,
  },
};

const FOCUS_STEP = { dark: "400", light: "600" } as const;
const CHANNEL_MAX = 255;

function Channels(hex: string): [number, number, number] {
  const raw = hex.replace("#", "");
  return [
    Number.parseInt(raw.slice(0, 2), 16),
    Number.parseInt(raw.slice(2, 4), 16),
    Number.parseInt(raw.slice(4, 6), 16),
  ];
}

function Shade(hex: string, seed: ProductSeed, sign: number): string {
  const base = Channels(hex);
  const tint = Channels(seed.tint);
  const mixed = base.map((value, index) => {
    const blended = value * (1 - seed.wash) + (tint[index] as number) * seed.wash;
    return Math.max(0, Math.min(CHANNEL_MAX, Math.round(blended + seed.lift * sign)));
  });
  return `#${mixed.map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

function Canvas<T extends Record<string, string>>(surface: T, seed: ProductSeed, sign: number): T {
  return Object.fromEntries(
    Object.entries(surface).map(([role, hex]) => [role, Shade(hex, seed, sign)]),
  ) as T;
}

/**
 * Un tema de producto entero a partir de dos semillas de paleta. Es la prueba del argumento de
 * Nebula: lo único que cambia entre dos productos es esto, y el catálogo no se entera.
 */
export function BuildProduct(name: ProductName, scheme: "dark" | "light"): NebulaTheme {
  const seed = PRODUCT_SEEDS[name];
  const base = scheme === "dark" ? nebulaDark : nebulaLight;
  const dark = scheme === "dark";

  return {
    ...base,
    meta: { name: dark ? name : `${name}-light`, scheme, version: "0.1.0" },
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
          ink: "light",
          stops: [
            { color: seed.from, position: 0 },
            { color: seed.to, position: 100 },
          ],
        },
      },
    },
  };
}

export const PRODUCTS: Record<ProductName, Record<"dark" | "light", NebulaTheme>> = {
  rosette: { dark: BuildProduct("rosette", "dark"), light: BuildProduct("rosette", "light") },
  stellaria: { dark: BuildProduct("stellaria", "dark"), light: BuildProduct("stellaria", "light") },
  polaris: { dark: BuildProduct("polaris", "dark"), light: BuildProduct("polaris", "light") },
  lagrange: { dark: BuildProduct("lagrange", "dark"), light: BuildProduct("lagrange", "light") },
  aurora: { dark: BuildProduct("aurora", "dark"), light: BuildProduct("aurora", "light") },
  nova: { dark: BuildProduct("nova", "dark"), light: BuildProduct("nova", "light") },
  eclipse: { dark: BuildProduct("eclipse", "dark"), light: BuildProduct("eclipse", "light") },
  cosmos: { dark: BuildProduct("cosmos", "dark"), light: BuildProduct("cosmos", "light") },
};

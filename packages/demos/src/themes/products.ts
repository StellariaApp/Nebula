import { FlipScale, nebulaDark, nebulaLight } from "@stellaria/nebula-themes";
import {
  palettes,
  type ColorScheme,
  type MotionTier,
  type NebulaTheme,
  type Scale11,
} from "@stellaria/nebula-tokens";

export type ProductName =
  | "rosette"
  | "stellaria"
  | "lagrange"
  | "polaris"
  | "aurora"
  | "nova"
  | "eclipse"
  | "cosmos"
  | "star";

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
    accent: palettes.slate,
    from: palettes.cyan["400"],
    to: palettes.slate["300"],
    tint: palettes.slate["800"],
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
    primary: palettes.pink,
    accent: palettes.cyan,
    from: palettes.pink["500"],
    to: palettes.cyan["400"],
    tint: palettes.pink["800"],
    wash: 0.05,
    lift: -6,
  },
  nova: {
    primary: palettes.teal,
    accent: palettes.green,
    from: palettes.teal["500"],
    to: palettes.green["400"],
    tint: palettes.teal["800"],
    wash: 0.05,
    lift: -6,
  },
  eclipse: {
    primary: palettes.red,
    accent: palettes.gold,
    from: palettes.red["500"],
    to: palettes.gold["400"],
    tint: palettes.red["800"],
    wash: 0.05,
    lift: -6,
  },
  cosmos: {
    primary: palettes.brown,
    accent: palettes.orange,
    from: palettes.brown["500"],
    to: palettes.orange["400"],
    tint: palettes.brown["800"],
    wash: 0.05,
    lift: -6,
  },
  star: {
    primary: palettes.gold,
    accent: palettes.yellow,
    from: palettes.gold["500"],
    to: palettes.gold["400"],
    tint: palettes.gold["600"],
    wash: 0.05,
    lift: -6,
  },
};

const FOCUS_STEP = { dark: "400", light: "600" } as const;
const CHANNEL_MAX = 255;

const PRODUCT_INK_FLOOR = 1;

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
    meta: { name, scheme, version: "0.1.0" },
    ink: { floor: PRODUCT_INK_FLOOR },
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

export type ThemeName = "nebula" | ProductName;

const BUILT = new Map<string, NebulaTheme>();

/**
 * Un tema concreto, construido la primera vez que se pide y memorizado. Antes existía una tabla
 * `THEMES` de módulo, y eso construía los VEINTE al importar este archivo — aunque quien importara
 * solo quisiera un hex para pintar un punto de color.
 */
export function ThemeOf(name: ThemeName, scheme: "dark" | "light"): NebulaTheme {
  if (name === "nebula") return scheme === "dark" ? nebulaDark : nebulaLight;
  const key = `${name}-${scheme}`;
  const hit = BUILT.get(key);
  if (hit !== undefined) return hit;
  const built = BuildProduct(name, scheme);
  BUILT.set(key, built);
  return built;
}

/**
 * Los dos extremos del gradiente de marca de cada tema, que es lo único que hace falta para el
 * swatch del selector. Salen de la semilla y NO dependen del esquema: `BuildProduct` los copia tal
 * cual a `effects.gradients.brand`. Leerlos de aquí evita construir el tema para pintar un punto.
 */
export const BRAND_STOPS: Record<ThemeName, readonly [string, string]> = {
  nebula: [
    nebulaDark.effects.gradients.brand.stops[0]?.color ?? "#000",
    nebulaDark.effects.gradients.brand.stops.at(-1)?.color ?? "#000",
  ],
  ...(Object.fromEntries(
    Object.entries(PRODUCT_SEEDS).map(([name, seed]) => [name, [seed.from, seed.to]]),
  ) as unknown as Record<ProductName, readonly [string, string]>),
};

export const PRODUCT_NAMES: readonly ProductName[] = [
  "rosette",
  "stellaria",
  "polaris",
  "lagrange",
  "aurora",
  "nova",
  "eclipse",
  "cosmos",
  "star",
];

export const THEME_NAMES: readonly ThemeName[] = ["nebula", ...PRODUCT_NAMES];

export type Corner = "sharp" | "soft" | "round";

export type Density = "compact" | "cosy" | "roomy";

export type Face = "sans" | "serif";

export interface ThemeChoice {
  name: ThemeName;
  scheme: "dark" | "light";
  motion: MotionTier;
  glass: boolean;
  corner: Corner;
  density: Density;
  face: Face;
}

const SHARP = { none: 0, xxs: 0, xs: 0, sm: 0, md: 0, lg: 0, xl: 0, xxl: 0, full: 0 } as const;

const ROUND = {
  none: 0,
  xxs: 10,
  xs: 14,
  sm: 20,
  md: 26,
  lg: 32,
  xl: 40,
  xxl: 48,
  full: 9999,
} as const;

const UNIT: Record<Density, number> = { compact: 3, cosy: 4, roomy: 5 };

const SERIF =
  'Iowan Old Style, Palatino Linotype, Palatino, "Book Antiqua", Georgia, Cambria, "Times New Roman", ui-serif, serif';

export const BASE_CHOICE: ThemeChoice = {
  name: "nebula",
  scheme: "dark",
  motion: nebulaDark.motion.tier,
  glass: nebulaDark.effects.glass.enabled,
  corner: "soft",
  density: "cosy",
  face: "sans",
};

export function NameFromTheme(theme: NebulaTheme): ThemeName {
  const name = theme.meta.name;
  return name in PRODUCT_SEEDS || name === "nebula" ? (name as ThemeName) : "nebula";
}

function CornerFromTheme(theme: NebulaTheme): Corner {
  if (theme.radius.md === 0) return "sharp";
  if (theme.radius.md >= 24) return "round";
  return "soft";
}

function DensityFromTheme(theme: NebulaTheme): Density {
  if (theme.spacing.unit <= 3) return "compact";
  if (theme.spacing.unit >= 5) return "roomy";
  return "cosy";
}

export function ChoiceFromTheme(theme: NebulaTheme): ThemeChoice {
  return {
    name: NameFromTheme(theme),
    scheme: theme.meta.scheme,
    motion: theme.motion.tier,
    glass: theme.effects.glass.enabled,
    corner: CornerFromTheme(theme),
    density: DensityFromTheme(theme),
    face: theme.font.family.sans === SERIF ? "serif" : "sans",
  };
}

export function ResolveChoice(choice: ThemeChoice): ColorScheme | NebulaTheme {
  const base = ThemeOf(choice.name, choice.scheme);
  const pristine = ChoiceFromTheme(base);
  const untouched =
    choice.motion === pristine.motion &&
    choice.glass === pristine.glass &&
    choice.corner === pristine.corner &&
    choice.density === pristine.density &&
    choice.face === pristine.face;

  if (untouched) return choice.name === "nebula" ? choice.scheme : base;

  return {
    ...base,
    motion: { ...base.motion, tier: choice.motion },
    radius: choice.corner === "sharp" ? SHARP : choice.corner === "round" ? ROUND : base.radius,
    spacing: { ...base.spacing, unit: UNIT[choice.density] },
    font: {
      ...base.font,
      family: {
        ...base.font.family,
        sans: choice.face === "serif" ? SERIF : base.font.family.sans,
      },
    },
    effects: { ...base.effects, glass: { ...base.effects.glass, enabled: choice.glass } },
  };
}

import { FlipScale, nebulaDark, nebulaLight } from "@stellaria/nebula-themes";
import {
  palettes,
  type MotionTier,
  type NebulaTheme,
  type Scale11,
} from "@stellaria/nebula-tokens";

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
    primary: palettes.indigo,
    accent: palettes.cyan,
    from: palettes.cyan["500"],
    to: palettes.indigo["400"],
    tint: palettes.indigo["800"],
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
    primary: palettes.teal,
    accent: palettes.green,
    from: palettes.teal["500"],
    to: palettes.green["400"],
    tint: palettes.teal["800"],
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

export type ThemeName = "nebula" | ProductName;

export const THEMES: Record<ThemeName, Record<"dark" | "light", NebulaTheme>> = {
  nebula: { dark: nebulaDark, light: nebulaLight },
  ...PRODUCTS,
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

const LIGHT_SUFFIX = /-light$/;

export function NameFromTheme(theme: NebulaTheme): ThemeName {
  const stem = theme.meta.name.replace(LIGHT_SUFFIX, "");
  return stem in PRODUCTS ? (stem as ThemeName) : "nebula";
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

export function ResolveChoice(choice: ThemeChoice): string | NebulaTheme {
  const base = THEMES[choice.name][choice.scheme];
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

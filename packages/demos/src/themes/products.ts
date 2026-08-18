import type { MotionTier, NebulaTheme, ThemeChoice as CoreChoice } from "@stellaria/nebula-tokens";
import {
  BRAND_STOPS,
  SEED_NAMES,
  THEMES_SEEDS,
  THEME_NAMES,
  Themes,
  ThemeScheme,
  type SeedName,
  type ThemeName,
} from "@stellaria/nebula-themes";

export { BRAND_STOPS, SEED_NAMES, THEMES_SEEDS, THEME_NAMES, ThemeScheme };
export type { SeedName, ThemeName };

const nebulaDark = Themes.nebula.dark;

export type Corner = "sharp" | "soft" | "round";

export type Density = "compact" | "cosy" | "roomy";

export type Face = "sans" | "serif";

export interface ThemeChoice {
  theme: ThemeName;
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
  theme: "nebula",
  scheme: "dark",
  motion: nebulaDark.motion.tier,
  glass: nebulaDark.effects.glass.enabled,
  corner: "soft",
  density: "cosy",
  face: "sans",
};

export function NameFromTheme(theme: NebulaTheme): ThemeName {
  const name = theme.meta.name;
  return name in THEMES_SEEDS || name === "nebula" ? (name as ThemeName) : "nebula";
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
    theme: NameFromTheme(theme),
    scheme: theme.meta.scheme,
    motion: theme.motion.tier,
    glass: theme.effects.glass.enabled,
    corner: CornerFromTheme(theme),
    density: DensityFromTheme(theme),
    face: theme.font.family.sans === SERIF ? "serif" : "sans",
  };
}

export function ResolveChoice(choice: ThemeChoice): CoreChoice | NebulaTheme {
  const base = ThemeScheme(choice.theme, choice.scheme);
  const pristine = ChoiceFromTheme(base);
  const untouched =
    choice.motion === pristine.motion &&
    choice.glass === pristine.glass &&
    choice.corner === pristine.corner &&
    choice.density === pristine.density &&
    choice.face === pristine.face;

  // Sin ejes tocados, el tema es uno REGISTRADO: se devuelve por sus dos nombres para que el
  // provider lo aplique como clase (ADR-163). Devolver el objeto lo mandaba a vars inline, que es
  // lo que borraba la clase que el script acababa de poner y producia el parpadeo.
  if (untouched) return { theme: choice.theme, scheme: choice.scheme };

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

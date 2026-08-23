import type {
  GlassLevel,
  GlassSurfaceRecipe,
  MotionTier,
  NebulaTheme,
  ThemeChoice as CoreChoice,
} from "@stellaria/nebula-tokens";
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

export type Glass = "off" | "sheer" | "frosted" | "milky";

export interface ThemeChoice {
  theme: ThemeName;
  scheme: "dark" | "light";
  motion: MotionTier;
  glass: Glass;
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

/**
 * Cuánto velo lleva cada nivel, sin contar `veil` — ese es el escalón más fino del material y no se
 * mueve. `frosted` es el del tema, así que no tiene tabla: se devuelve la del propio tema y la
 * elección sigue contando como intacta, que es lo que la deja viajar como clase (ADR-163).
 *
 * El ascenso es exponencial y no lineal a propósito: los tres de abajo se agrupan como cristal de
 * verdad y `strong` se despega como material macizo, en vez de cinco tonos del mismo gris.
 */
const VEILS = {
  sheer: { band: 0.32, control: 0.35, subtle: 0.45, default: 0.63, strong: 0.9 },
  milky: { band: 0.6, control: 0.61, subtle: 0.67, default: 0.76, strong: 0.9 },
} as const satisfies Record<"sheer" | "milky", Record<Exclude<GlassLevel, "veil">, number>>;

/** La tinta del velo por esquema. `veil` va en blanco en los dos, y por eso queda fuera. */
const TINT: Record<"dark" | "light", string> = {
  dark: "15, 17, 25",
  light: "255, 255, 255",
};

function GlassSurfaces(
  base: NebulaTheme,
  glass: Glass,
): Record<GlassLevel, GlassSurfaceRecipe> {
  const surface = base.effects.glass.surface;
  if (glass === "off" || glass === "frosted") return surface;

  const tint = TINT[base.meta.scheme];
  const veils = VEILS[glass];
  const next = { ...surface };
  for (const level in veils) {
    const key = level as keyof typeof veils;
    next[key] = { ...surface[key], background: `rgba(${tint}, ${String(veils[key])})` };
  }
  return next;
}

const SERIF =
  'Iowan Old Style, Palatino Linotype, Palatino, "Book Antiqua", Georgia, Cambria, "Times New Roman", ui-serif, serif';

export const BASE_CHOICE: ThemeChoice = {
  theme: "nebula",
  scheme: "dark",
  motion: nebulaDark.motion.tier,
  glass: "frosted",
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

function GlassFromTheme(theme: NebulaTheme): Glass {
  if (!theme.effects.glass.enabled) return "off";
  const band = theme.effects.glass.surface.band.background;
  const tint = TINT[theme.meta.scheme];
  if (band === `rgba(${tint}, ${String(VEILS.sheer.band)})`) return "sheer";
  if (band === `rgba(${tint}, ${String(VEILS.milky.band)})`) return "milky";
  return "frosted";
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
    glass: GlassFromTheme(theme),
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
    effects: {
      ...base.effects,
      glass: {
        ...base.effects.glass,
        surface: GlassSurfaces(base, choice.glass),
        enabled: choice.glass !== "off",
      },
    },
  };
}

import type {
  GlassLevel,
  GlassSurfaceRecipe,
  MotionTier,
  NebulaTheme,
  ThemeChoice as CoreChoice,
} from "@stellaria/nebula-tokens";
import {
  BASE_RAMP,
  BRAND_STOPS,
  CORNERS,
  DENSITIES,
  DENSITY_UNIT,
  GLASSES,
  GlassFor,
  RadiusOf,
  SEED_NAMES,
  THEMES_SEEDS,
  THEME_NAMES,
  Themes,
  ThemeScheme,
  type Corner,
  type Density,
  type Glass,
  type Ramp,
  type SeedName,
  type ThemeName,
  type ThemeSeed,
} from "@stellaria/nebula-themes";

export { BRAND_STOPS, CORNERS, DENSITIES, GLASSES, SEED_NAMES, THEMES_SEEDS, THEME_NAMES, ThemeScheme };
export type { Corner, Density, Glass, SeedName, ThemeName };

const nebulaDark = Themes.nebula.dark;

export type Face = "sans" | "serif";

export interface ThemeChoice {
  theme: ThemeName;
  scheme: "dark" | "light";
  motion: MotionTier;
  glass: Glass;
  corner: Corner;
  density: Density;
  face: Face;
}

/** La rampa de la que parte cada tema: la suya si la declara, la de fábrica si no. */
function RampOf(name: ThemeName): Ramp {
  const seeds: Record<string, ThemeSeed> = THEMES_SEEDS;
  return seeds[name]?.ramp ?? BASE_RAMP;
}

function GlassSurfaces(base: NebulaTheme, glass: Glass): Record<GlassLevel, GlassSurfaceRecipe> {
  if (glass === "off" || glass === "frosted") return base.effects.glass.surface;
  return GlassFor(RampOf(NameFromTheme(base)), glass, base.meta.scheme);
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

/**
 * El peldaño se deduce comparando el radio contra lo que `RadiusOf` produciría, no contra umbrales
 * escritos: con cinco peldaños —y dos de ellos calculados— un umbral se queda desfasado en cuanto
 * cambie cualquiera de las tres tablas de las que salen.
 */
function CornerFromTheme(theme: NebulaTheme): Corner {
  const soft = ThemeScheme(NameFromTheme(theme), theme.meta.scheme).radius;
  return (
    CORNERS.find((corner) => RadiusOf(soft, corner).md === theme.radius.md) ?? "soft"
  );
}

/**
 * El inverso, y por eso compara contra lo que `GlassOf` produciria: la opcion no se guarda en el
 * tema, se deduce de su banda. Derivarla en vez de tabularla es lo que hace que siga acertando
 * cuando el producto parte de otra rampa.
 */
function GlassFromTheme(theme: NebulaTheme): Glass {
  if (!theme.effects.glass.enabled) return "off";
  const band = theme.effects.glass.surface.band.background;
  const ramp = RampOf(NameFromTheme(theme));
  for (const option of ["sheer", "milky"] as const) {
    if (band === GlassFor(ramp, option, theme.meta.scheme).band.background) return option;
  }
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
    radius: RadiusOf(base.radius, choice.corner),
    spacing: { ...base.spacing, unit: DENSITY_UNIT[choice.density] },
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

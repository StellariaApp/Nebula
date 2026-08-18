import type { ColorScheme, NebulaTheme } from "@stellaria/nebula-tokens";

import { nebulaDark } from "./nebula/dark.js";
import { nebulaLight } from "./nebula/light.js";
import { rosetteDark } from "./rosette/dark.js";
import { rosetteLight } from "./rosette/light.js";
import { stellariaDark } from "./stellaria/dark.js";
import { stellariaLight } from "./stellaria/light.js";
import { polarisDark } from "./polaris/dark.js";
import { polarisLight } from "./polaris/light.js";
import { lagrangeDark } from "./lagrange/dark.js";
import { lagrangeLight } from "./lagrange/light.js";
import { auroraDark } from "./aurora/dark.js";
import { auroraLight } from "./aurora/light.js";
import { novaDark } from "./nova/dark.js";
import { novaLight } from "./nova/light.js";
import { eclipseDark } from "./eclipse/dark.js";
import { eclipseLight } from "./eclipse/light.js";
import { cosmosDark } from "./cosmos/dark.js";
import { cosmosLight } from "./cosmos/light.js";
import { sunDark } from "./sun/dark.js";
import { sunLight } from "./sun/light.js";

/** Un tema con sus dos esquemas (ADR-166). La clave de dentro es el esquema; la de fuera, la identidad. */
export type ThemeSchemes = Record<ColorScheme, NebulaTheme>;

/**
 * Los temas del paquete. `nebula` es **el de por defecto**, no el unico oficial: con diez dentro,
 * "oficial" dejo de distinguir nada (ADR-168).
 *
 * Los nueve de producto son variantes —la prueba de que el catalogo se retine sin tocar codigo— y
 * **no entran en el gate de contraste**, que sigue recorriendo el par por defecto y el de humo.
 */
export const Themes = {
  nebula: { dark: nebulaDark, light: nebulaLight },
  rosette: { dark: rosetteDark, light: rosetteLight },
  stellaria: { dark: stellariaDark, light: stellariaLight },
  polaris: { dark: polarisDark, light: polarisLight },
  lagrange: { dark: lagrangeDark, light: lagrangeLight },
  aurora: { dark: auroraDark, light: auroraLight },
  nova: { dark: novaDark, light: novaLight },
  eclipse: { dark: eclipseDark, light: eclipseLight },
  cosmos: { dark: cosmosDark, light: cosmosLight },
  sun: { dark: sunDark, light: sunLight },
} as const satisfies Record<string, ThemeSchemes>;

export type ThemeName = keyof typeof Themes;

export const DEFAULT_THEME = "nebula" satisfies ThemeName;

export const THEME_NAMES = Object.keys(Themes) as readonly ThemeName[];

/** El par por defecto, que es lo que la mayoria de consumidores quiere y todo lo que el gate mira. */
export const Dark = Themes.nebula.dark;
export const Light = Themes.nebula.light;

export function ThemeScheme(name: ThemeName, scheme: ColorScheme): NebulaTheme {
  return Themes[name][scheme];
}

/**
 * Los dos extremos del degradado de marca de cada tema. Se derivan del propio tema en vez de
 * mantenerse en una tabla aparte, que es como se desincronizan.
 */
export const BRAND_STOPS = Object.fromEntries(
  THEME_NAMES.map((name) => {
    const stops = Themes[name].dark.effects.gradients.brand.stops;
    return [name, [stops[0]?.color ?? "#000", stops.at(-1)?.color ?? "#000"] as const];
  }),
) as Record<ThemeName, readonly [string, string]>;

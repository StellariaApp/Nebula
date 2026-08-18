import type { ColorScheme, NebulaTheme } from "@stellaria/nebula-tokens";

import { nebulaDark } from "./nebula/dark.js";
import { nebulaLight } from "./nebula/light.js";
import { rosetaDark } from "./roseta/dark.js";
import { rosetaLight } from "./roseta/light.js";
import { rigelDark } from "./rigel/dark.js";
import { rigelLight } from "./rigel/light.js";
import { arcturusDark } from "./arcturus/dark.js";
import { arcturusLight } from "./arcturus/light.js";
import { vegaDark } from "./vega/dark.js";
import { vegaLight } from "./vega/light.js";
import { auroraDark } from "./aurora/dark.js";
import { auroraLight } from "./aurora/light.js";
import { helixDark } from "./helix/dark.js";
import { helixLight } from "./helix/light.js";
import { antaresDark } from "./antares/dark.js";
import { antaresLight } from "./antares/light.js";
import { titanDark } from "./titan/dark.js";
import { titanLight } from "./titan/light.js";
import { sunDark } from "./sun/dark.js";
import { sunLight } from "./sun/light.js";
import { halleyDark } from "./halley/dark.js";
import { halleyLight } from "./halley/light.js";
import { velaDark } from "./vela/dark.js";
import { velaLight } from "./vela/light.js";
import { eclipseDark } from "./eclipse/dark.js";
import { eclipseLight } from "./eclipse/light.js";
import { coronaDark } from "./corona/dark.js";
import { coronaLight } from "./corona/light.js";


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
  roseta: { dark: rosetaDark, light: rosetaLight },
  rigel: { dark: rigelDark, light: rigelLight },
  arcturus: { dark: arcturusDark, light: arcturusLight },
  vega: { dark: vegaDark, light: vegaLight },
  aurora: { dark: auroraDark, light: auroraLight },
  helix: { dark: helixDark, light: helixLight },
  antares: { dark: antaresDark, light: antaresLight },
  titan: { dark: titanDark, light: titanLight },
  sun: { dark: sunDark, light: sunLight },
  halley: { dark: halleyDark, light: halleyLight },
  vela: { dark: velaDark, light: velaLight },
  eclipse: { dark: eclipseDark, light: eclipseLight },
  corona: { dark: coronaDark, light: coronaLight },
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

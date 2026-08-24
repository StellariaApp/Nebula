import { palettes, type MotionTier, type Scale11 } from "@stellaria/nebula-tokens";

import type { Corner, Density, Glass } from "../../utils/axes.js";
import type { Lift } from "../../utils/lift.js";
import type { Ramp } from "../../utils/ramp.js";

export type SeedName =
  | "nebula"
  | "roseta"
  | "zenit"
  | "apolo"
  | "halo"
  | "aurora"
  | "helix"
  | "marte"
  | "titan"
  | "sol"
  | "cometa"
  | "vela"
  | "grafito"
  | "nova"
  | "quasar"
  | "eclipse";

export interface ThemeSeed {
  /**
   * La identidad del tema. **No es `SeedName`**, y no por descuido: los dieciseis del catalogo son
   * los que hay aqui, pero un producto que construye el suyo con `BuildProduct` tiene su propio
   * nombre y tenia que colarlo con un cast. El tipo cerrado no protegia nada —`meta.name` es
   * `string`— y obligaba a mentir en los cuatro consumidores.
   */
  name: string;
  primary: Scale11;
  accent: Scale11;
  from: string;
  to: string;
  tint: string;
  wash: number;
  lift: Lift;
  inkFloor?: number;
  /** Inclinacion del degradado de marca. Sin declararla, la de producto. */
  angle?: number;
  /**
   * El reparto del material, en porcentaje: `[velo, suelo, techo]` (ADR-179).
   *
   * Los numeros SON las alfas del cristal, asi que 0-100 es el rango y fuera de el se sujeta. Sin
   * declararla, el cristal es el de la base. Las superficies no la usan: esas van por `lift`.
   */
  ramp?: Ramp;
  /**
   * Los cuatro ejes que el producto elige y el catalogo no conoce. No son contrato nuevo: son
   * presets sobre `motion.tier`, `effects.glass`, `radius` y `spacing.unit`, que `BuildProduct`
   * materializa en el tema. Sin declararlos, lo de la base.
   *
   * Declararlos es lo que hace que un producto **traiga sus valores puestos**: el panel deriva la
   * eleccion del tema, asi que los ensena solos sin que nadie los seleccione.
   */
  motion?: MotionTier;
  glass?: Glass;
  corner?: Corner;
  density?: Density;
}

export const THEMES_SEEDS = {
  nebula: {
    name: "nebula",
    primary: palettes.indigo,
    accent: palettes.violet,
    from: palettes.indigo["500"],
    to: palettes.violet["500"],
    tint: palettes.dark["600"],
    wash: 0,
    lift: 0,
    inkFloor: 2,
    angle: 135,
  },
  roseta: {
    name: "roseta",
    primary: palettes.rose,
    accent: palettes.pink,
    from: palettes.rose["500"],
    to: palettes.rose["400"],
    tint: palettes.rose["900"],
    wash: 0.009,
    glass: "sheer",
    lift: { base: -14, raised: -4, overlay: -8 },
    inkFloor: 2,
  },
  zenit: {
    name: "zenit",
    primary: palettes.blue,
    accent: palettes.cyan,
    from: palettes.blue["500"],
    to: palettes.cyan["400"],
    tint: palettes.blue["800"],
    wash: 0.08,
    lift: { base: -6, raised: -6, overlay: -8 },
    ramp: [10, 20, 60],
    inkFloor: 1,
  },
  apolo: {
    name: "apolo",
    primary: palettes.orange,
    accent: palettes.rose,
    from: palettes.rose["500"],
    to: palettes.orange["400"],
    tint: palettes.orange["200"],
    wash: 0.009,
    lift: { base: 4, raised: 2, overlay: 5 },
    ramp: [10, 20, 60],
    glass: "sheer",
    inkFloor: 1,
  },
  halo: {
    name: "halo",
    primary: palettes.cyan,
    accent: palettes.blue,
    from: palettes.cyan["500"],
    to: palettes.blue["300"],
    tint: palettes.cyan["900"],
    wash: 0.09,
    glass: "sheer",
    lift: { base: 12, raised: 4, overlay: 0 },
    ramp: [10, 20, 80],
    inkFloor: 1,
    angle: 135,
  },
  aurora: {
    name: "aurora",
    primary: palettes.pink,
    accent: palettes.cyan,
    from: palettes.pink["500"],
    to: palettes.cyan["400"],
    tint: palettes.pink["800"],
    wash: 0.05,
    glass: "sheer",
    lift: { base: 6, raised: 0, overlay: 4 },
    ramp: [10, 20, 70],
    inkFloor: 2,
  },
  helix: {
    name: "helix",
    primary: palettes.teal,
    accent: palettes.green,
    from: palettes.teal["500"],
    to: palettes.green["400"],
    tint: palettes.teal["800"],
    wash: 0.05,
    lift: { base: 6, raised: 0, overlay: 4 },
    ramp: [10, 20, 70],
    inkFloor: 2,
  },
  marte: {
    name: "marte",
    primary: palettes.red,
    accent: palettes.gold,
    from: palettes.red["500"],
    to: palettes.gold["400"],
    tint: palettes.red["800"],
    wash: 0.05,
    lift: { base: -6, raised: 0, overlay: -4 },
    ramp: [10, 20, 70],
    inkFloor: 1,
  },
  titan: {
    name: "titan",
    primary: palettes.brown,
    accent: palettes.orange,
    from: palettes.brown["500"],
    to: palettes.orange["400"],
    tint: palettes.brown["800"],
    wash: 0.05,
    lift: { base: -6, raised: 0, overlay: -4 },
    ramp: [10, 20, 70],
    inkFloor: 1,
  },
  sol: {
    name: "sol",
    primary: palettes.gold,
    accent: palettes.yellow,
    from: palettes.gold["500"],
    to: palettes.gold["400"],
    tint: palettes.gold["600"],
    wash: 0.05,
    lift: { base: -6, raised: 0, overlay: -4 },
    ramp: [10, 20, 70],
    inkFloor: 1,
  },
  cometa: {
    name: "cometa",
    primary: palettes.lime,
    accent: palettes.green,
    from: palettes.lime["500"],
    to: palettes.green["400"],
    tint: palettes.lime["800"],
    wash: 0.05,
    lift: { base: -6, raised: 0, overlay: -4 },
    ramp: [10, 20, 70],
  },
  vela: {
    name: "vela",
    primary: palettes.lime,
    accent: palettes.rose,
    from: palettes.lime["500"],
    to: palettes.rose["400"],
    tint: palettes.lime["800"],
    wash: 0.05,
    lift: { base: -6, raised: 0, overlay: -4 },
    ramp: [10, 20, 70],
  },
  eclipse: {
    name: "eclipse",
    primary: palettes.red,
    accent: palettes.rose,
    from: palettes.red["600"],
    to: palettes.rose["500"],
    tint: palettes.red["950"],
    wash: 0.12,
    lift: { base: -22, raised: 0, overlay: -15 },
    ramp: [10, 20, 70],
    inkFloor: 1,
  },
  grafito: {
    name: "grafito",
    primary: palettes.slate,
    accent: palettes.cyan,
    from: palettes.slate["500"],
    to: palettes.cyan["300"],
    tint: palettes.slate["800"],
    wash: 0.05,
    lift: { base: -6, raised: 0, overlay: -4 },
    ramp: [10, 20, 70],
    inkFloor: 1,
    motion: "minimal",
    glass: "off",
  },
  nova: {
    name: "nova",
    primary: palettes.yellow,
    accent: palettes.cyan,
    from: palettes.yellow["400"],
    to: palettes.cyan["400"],
    tint: palettes.yellow["800"],
    wash: 0.2,
    lift: { base: -26, raised: 0, overlay: -17 },
    ramp: [10, 20, 70],
    inkFloor: 1,
  },
  quasar: {
    name: "quasar",
    primary: palettes.yellow,
    accent: palettes.violet,
    from: palettes.yellow["500"],
    to: palettes.violet["400"],
    tint: palettes.yellow["800"],
    wash: 0.05,
    lift: { base: -6, raised: 0, overlay: -4 },
    ramp: [10, 20, 70],
    inkFloor: 1,
  },
} as const satisfies Record<SeedName, ThemeSeed>;

export const SEED_NAMES = Object.keys(THEMES_SEEDS) as readonly SeedName[];

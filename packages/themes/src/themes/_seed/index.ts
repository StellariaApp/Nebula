import { palettes, type MotionTier, type Scale11 } from "@stellaria/nebula-tokens";

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
  | "sun"
  | "cometa"
  | "vela"
  | "grafito"
  | "nova"
  | "quasar"
  | "eclipse";

export interface ThemeSeed {
  name: SeedName;
  primary: Scale11;
  accent: Scale11;
  from: string;
  to: string;
  tint: string;
  wash: number;
  lift: number;
  inkFloor?: number;
  /** Inclinacion del degradado de marca. Sin declararla, la de producto. */
  angle?: number;
  /** Intensidad del motion. Sin declararla, la de la base. */
  motion?: MotionTier;
  /** Materiales de compositor —cristal, blur, ruido—. Sin declararlo, lo de la base (ADR-059). */
  glass?: boolean;
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
    to: palettes.pink["400"],
    tint: palettes.rose["900"],
    wash: 0.009,
    lift: -12,
    inkFloor: 2,
  },
  zenit: {
    name: "zenit",
    primary: palettes.blue,
    accent: palettes.cyan,
    from: palettes.blue["500"],
    to: palettes.cyan["400"],
    tint: palettes.blue["800"],
    wash: 0.05,
    lift: -6,
    inkFloor: 1,
  },
  halo: {
    name: "halo",
    primary: palettes.cyan,
    accent: palettes.slate,
    from: palettes.cyan["400"],
    to: palettes.slate["300"],
    tint: palettes.slate["800"],
    wash: 0.05,
    lift: -6,
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
    lift: 6,
    inkFloor: 1,
  },
  aurora: {
    name: "aurora",
    primary: palettes.pink,
    accent: palettes.cyan,
    from: palettes.pink["500"],
    to: palettes.cyan["400"],
    tint: palettes.pink["800"],
    wash: 0.05,
    lift: -6,
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
    lift: -6,
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
    lift: -6,
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
    lift: -6,
    inkFloor: 1,
  },
  sun: {
    name: "sun",
    primary: palettes.gold,
    accent: palettes.yellow,
    from: palettes.gold["500"],
    to: palettes.gold["400"],
    tint: palettes.gold["600"],
    wash: 0.05,
    lift: -6,
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
    lift: -6,
  },
  vela: {
    name: "vela",
    primary: palettes.violet,
    accent: palettes.grape,
    from: palettes.violet["500"],
    to: palettes.grape["400"],
    tint: palettes.violet["800"],
    wash: 0.05,
    lift: -6,
  },
  eclipse: {
    name: "eclipse",
    primary: palettes.red,
    // Lo que lo separa de `marte` no es el tono —comparten el rojo— sino a donde va: el degradado
    // de marte sube hacia el oro y el de eclipse cae al negro, y el lienzo se hunde con el. Es el
    // unico tema donde el acento es neutro: rojo y negro, sin tercer color.
    accent: palettes.dark,
    from: palettes.red["600"],
    to: palettes.dark["800"],
    tint: palettes.red["950"],
    wash: 0.12,
    lift: -22,
    inkFloor: 1,
  },
  grafito: {
    name: "grafito",
    primary: palettes.slate,
    accent: palettes.blue,
    from: palettes.slate["500"],
    to: palettes.blue["400"],
    tint: palettes.slate["800"],
    wash: 0.05,
    lift: -6,
    inkFloor: 2,
    motion: "minimal",
    glass: false,
  },
  nova: {
    name: "nova",
    primary: palettes.yellow,
    accent: palettes.red,
    from: palettes.yellow["500"],
    to: palettes.red["400"],
    tint: palettes.yellow["800"],
    wash: 0.2,
    lift: -26,
    inkFloor: 1,
  },
  quasar: {
    name: "quasar",
    primary: palettes.grape,
    accent: palettes.pink,
    from: palettes.grape["500"],
    to: palettes.pink["400"],
    tint: palettes.grape["800"],
    wash: 0.05,
    lift: -6,
    inkFloor: 1,
  },
} as const satisfies Record<SeedName, ThemeSeed>;

export const SEED_NAMES = Object.keys(THEMES_SEEDS) as readonly SeedName[];

import { palettes, type Scale11 } from "@stellaria/nebula-tokens";

export type SeedName =
  | "nebula"
  | "rosette"
  | "stellaria"
  | "lagrange"
  | "polaris"
  | "aurora"
  | "nova"
  | "eclipse"
  | "cosmos"
  | "sun";

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
  },
  rosette: {
    name: "rosette",
    primary: palettes.rose,
    accent: palettes.pink,
    from: palettes.rose["500"],
    to: palettes.pink["400"],
    tint: palettes.rose["900"],
    wash: 0.009,
    lift: -12,
    inkFloor: 2,
  },
  stellaria: {
    name: "stellaria",
    primary: palettes.blue,
    accent: palettes.cyan,
    from: palettes.blue["500"],
    to: palettes.cyan["400"],
    tint: palettes.blue["800"],
    wash: 0.05,
    lift: -6,
    inkFloor: 1,
  },
  polaris: {
    name: "polaris",
    primary: palettes.cyan,
    accent: palettes.slate,
    from: palettes.cyan["400"],
    to: palettes.slate["300"],
    tint: palettes.slate["800"],
    wash: 0.05,
    lift: -6,
    inkFloor: 1,
  },
  lagrange: {
    name: "lagrange",
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
  nova: {
    name: "nova",
    primary: palettes.teal,
    accent: palettes.green,
    from: palettes.teal["500"],
    to: palettes.green["400"],
    tint: palettes.teal["800"],
    wash: 0.05,
    lift: -6,
    inkFloor: 2,
  },
  eclipse: {
    name: "eclipse",
    primary: palettes.red,
    accent: palettes.gold,
    from: palettes.red["500"],
    to: palettes.gold["400"],
    tint: palettes.red["800"],
    wash: 0.05,
    lift: -6,
    inkFloor: 2,
  },
  cosmos: {
    name: "cosmos",
    primary: palettes.brown,
    accent: palettes.orange,
    from: palettes.brown["500"],
    to: palettes.orange["400"],
    tint: palettes.brown["800"],
    wash: 0.05,
    lift: -6,
    inkFloor: 2,
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
    inkFloor: 2,
  },
} as const satisfies Record<SeedName, ThemeSeed>;

export const SEED_NAMES = Object.keys(THEMES_SEEDS) as readonly SeedName[];

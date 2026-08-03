import type { CurveProfile } from "./curves.ts";

export interface SeedSpec {
  name: string;
  seed: string;
  profile: CurveProfile;
}

export const PALETTE_SEEDS: readonly SeedSpec[] = [
  { name: "indigo", seed: "#3F37C9", profile: "chromatic" },
  { name: "violet", seed: "#9D4EDD", profile: "chromatic" },
  { name: "green", seed: "#14bb62", profile: "chromatic" },
  { name: "yellow", seed: "#cfb300", profile: "chromatic" },
  { name: "red", seed: "#ef4444", profile: "chromatic" },
  { name: "blue", seed: "#0087f0", profile: "chromatic" },
  { name: "orange", seed: "#f37700", profile: "chromatic" },
  { name: "teal", seed: "#00c7af", profile: "chromatic" },
  { name: "pink", seed: "#e568b5", profile: "chromatic" },
  { name: "cyan", seed: "#00abcf", profile: "chromatic" },
  { name: "lime", seed: "#9ad723", profile: "chromatic" },
  { name: "grape", seed: "#d066c9", profile: "chromatic" },
  { name: "rose", seed: "#e73070", profile: "chromatic" },
  { name: "gold", seed: "#e0a217", profile: "chromatic" },
  { name: "light", seed: "#f0f0f0", profile: "surface-light" },
  { name: "dark", seed: "#161821", profile: "surface-dark" },
];

export const GRAY_SEED: SeedSpec = { name: "gray", seed: "#868e96", profile: "chromatic" };

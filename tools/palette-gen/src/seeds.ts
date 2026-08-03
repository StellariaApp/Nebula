import type { CurveProfile } from "./curves.ts";

export interface SeedSpec {
  name: string;
  seed: string;
  profile: CurveProfile;
  /** Tinta que lleva el paso 500. Las familias claras la piden oscura (ADR-085). */
  ink?: "light" | "dark";
}

export const PALETTE_SEEDS: readonly SeedSpec[] = [
  { name: "indigo", seed: "#3F37C9", profile: "chromatic" },
  { name: "violet", seed: "#9D4EDD", profile: "chromatic" },
  { name: "green", seed: "#14bb62", profile: "chromatic" },
  { name: "yellow", seed: "#cfb300", profile: "chromatic", ink: "dark" },
  { name: "red", seed: "#ef4444", profile: "chromatic" },
  { name: "blue", seed: "#0087f0", profile: "chromatic" },
  { name: "orange", seed: "#f37700", profile: "chromatic", ink: "dark" },
  { name: "teal", seed: "#00c7af", profile: "chromatic", ink: "dark" },
  { name: "pink", seed: "#e568b5", profile: "chromatic", ink: "dark" },
  { name: "cyan", seed: "#00abcf", profile: "chromatic", ink: "dark" },
  { name: "lime", seed: "#9ad723", profile: "chromatic", ink: "dark" },
  { name: "grape", seed: "#d066c9", profile: "chromatic" },
  { name: "rose", seed: "#e73070", profile: "chromatic" },
  { name: "gold", seed: "#e0a217", profile: "chromatic", ink: "dark" },
  { name: "light", seed: "#f0f0f0", profile: "surface-light" },
  { name: "dark", seed: "#161821", profile: "surface-dark" },
];

export const GRAY_SEED: SeedSpec = { name: "gray", seed: "#868e96", profile: "chromatic" };

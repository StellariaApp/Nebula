import type { CurveProfile } from "./curves.ts";

export interface SeedSpec {
  name: string;
  seed: string;
  profile: CurveProfile;
}

export const PALETTE_SEEDS: readonly SeedSpec[] = [
  { name: "indigo", seed: "#3F37C9", profile: "chromatic" },
  { name: "violet", seed: "#9D4EDD", profile: "chromatic" },
  { name: "green", seed: "#10b981", profile: "chromatic" },
  { name: "yellow", seed: "#f59e0b", profile: "chromatic" },
  { name: "red", seed: "#ef4444", profile: "chromatic" },
  { name: "blue", seed: "#06b6d4", profile: "chromatic" },
  { name: "orange", seed: "#ff922b", profile: "chromatic" },
  { name: "teal", seed: "#20c997", profile: "chromatic" },
  { name: "pink", seed: "#f06595", profile: "chromatic" },
  { name: "cyan", seed: "#22b8cf", profile: "chromatic" },
  { name: "lime", seed: "#94d82d", profile: "chromatic" },
  { name: "grape", seed: "#cc5de8", profile: "chromatic" },
  { name: "rose", seed: "#e73070", profile: "chromatic" },
  { name: "gold", seed: "#d6a80f", profile: "chromatic" },
  { name: "light", seed: "#f0f0f0", profile: "surface-light" },
  { name: "dark", seed: "#161821", profile: "surface-dark" },
];

export const GRAY_SEED: SeedSpec = { name: "gray", seed: "#868e96", profile: "chromatic" };

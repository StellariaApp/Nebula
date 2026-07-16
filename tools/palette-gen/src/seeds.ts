/**
 * Semillas de carácter: el paso 500 legacy de cada paleta de Stellaria
 * (colors.ts 100–900). Orientan hue/chroma — la curva la pone el generador.
 */
import type { CurveProfile } from "./curves.ts";

export interface SeedSpec {
  name: string;
  seed: string;
  profile: CurveProfile;
}

export const PALETTE_SEEDS: readonly SeedSpec[] = [
  { name: "indigo", seed: "#6366f1", profile: "chromatic" },
  { name: "violet", seed: "#8b5cf6", profile: "chromatic" },
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
  { name: "dark", seed: "#1c1c1c", profile: "surface-dark" },
];

/**
 * Gray canónico: con 50–950 (extremos incluidos) una sola escala neutra sirve
 * a ambos schemes — los temas eligen extremos opuestos. Semilla: el gris frío
 * de Stellaria (gray.light 700).
 */
export const GRAY_SEED: SeedSpec = { name: "gray", seed: "#868e96", profile: "chromatic" };

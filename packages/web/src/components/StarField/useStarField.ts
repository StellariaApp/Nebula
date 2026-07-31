import { useMemo } from "react";

import type { StarDensity } from "./StarField.types.js";

export interface Star {
  left: number;
  top: number;
  size: number;
  phase: number;
  accent: boolean;
}

const COUNT: Record<StarDensity, number> = { xs: 12, sm: 20, md: 32, lg: 48, xl: 72 };

const GOLDEN = 0.618033988749895;
const SILVER = 0.7548776662466927;

function Fract(value: number): number {
  return value - Math.floor(value);
}

export function BuildStars(density: StarDensity, seed: number, accentEvery: number): Star[] {
  const total = COUNT[density];
  const offset = Fract(seed * GOLDEN);
  const stars: Star[] = [];

  for (let index = 0; index < total; index += 1) {
    const left = Fract(offset + (index + 1) * GOLDEN);
    const top = Fract(offset + (index + 1) * SILVER);
    const phase = Fract(offset + (index + 1) * GOLDEN * SILVER);
    stars.push({
      left: Math.round(left * 9800) / 100,
      top: Math.round(top * 9600) / 100,
      size: index % 4 === 0 ? 2 : 1,
      phase: Math.round(phase * 1000) / 1000,
      accent: accentEvery > 0 && index % accentEvery === 0,
    });
  }

  return stars;
}

export function useStarField(density: StarDensity, seed: number, accentEvery: number): Star[] {
  return useMemo(() => BuildStars(density, seed, accentEvery), [density, seed, accentEvery]);
}

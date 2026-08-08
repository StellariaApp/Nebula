import { nebulaLight } from "@stellaria/nebula-themes";
import type { GradientToken, MotionTier, NebulaTheme } from "@stellaria/nebula-tokens";

const BASE = nebulaLight;

export function GlassOff(theme: NebulaTheme = BASE): NebulaTheme {
  return {
    ...theme,
    effects: { ...theme.effects, glass: { ...theme.effects.glass, enabled: false } },
  };
}

export function MotionAt(tier: MotionTier, theme: NebulaTheme = BASE): NebulaTheme {
  return { ...theme, motion: { ...theme.motion, tier } };
}

export function NoiseAt(opacity: number, theme: NebulaTheme = BASE): NebulaTheme {
  return {
    ...theme,
    effects: { ...theme.effects, glass: { ...theme.effects.glass, noiseOpacity: opacity } },
  };
}

export function BrandGradient(
  stops: GradientToken["stops"],
  theme: NebulaTheme = BASE,
): NebulaTheme {
  return {
    ...theme,
    effects: {
      ...theme.effects,
      gradients: {
        ...theme.effects.gradients,
        brand: { ...theme.effects.gradients.brand, stops },
      },
    },
  };
}

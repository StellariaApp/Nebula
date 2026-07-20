import type { NebulaTheme } from "@stellaria/nebula-tokens";

function MapValues<K extends string, V, R>(
  record: Record<K, V>,
  fn: (value: V) => R,
): Record<K, R> {
  const out = {} as Record<K, R>;
  for (const key of Object.keys(record) as K[]) {
    out[key] = fn(record[key]);
  }
  return out;
}

const Px = (n: number): string => `${String(n)}px`;
const Ms = (n: number): string => `${String(n)}ms`;
const Num = (n: number): string => String(n);

export function ThemeToVars(theme: NebulaTheme) {
  const { colors, font, radius, spacing, sizes, motion, effects, zIndex } = theme;
  return {
    color: {
      primary: colors.primary,
      accent: colors.accent,
      gray: colors.gray,
      semantic: {
        success: colors.semantic.success,
        warning: colors.semantic.warning,
        error: colors.semantic.error,
        info: colors.semantic.info,
      },
      surface: colors.surface,
      text: colors.text,
      border: colors.border,
    },
    font: {
      family: font.family,
      size: MapValues(font.size, Px),
      weight: MapValues(font.weight, Num),
      lineHeight: MapValues(font.lineHeight, Num),
      letterSpacing: MapValues(font.letterSpacing, Px),
    },
    radius: MapValues(radius, Px),
    space: MapValues(spacing.scale, (mult) => Px(spacing.unit * mult)),
    size: MapValues(sizes.control, Px),
    motion: {
      duration: MapValues(motion.duration, Ms),
      easing: motion.easing,
    },
    blur: effects.blur,
    shadow: MapValues(effects.shadows, (s) => s.web),
    glass: {
      subtle: effects.glass.surface.subtle,
      default: effects.glass.surface.default,
      strong: effects.glass.surface.strong,
      noiseOpacity: Num(effects.glass.noiseOpacity),
    },
    zIndex: MapValues(zIndex, Num),
  };
}

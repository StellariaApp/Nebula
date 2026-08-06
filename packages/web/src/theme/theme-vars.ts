import type { NebulaTheme } from "@stellaria/nebula-tokens";

import { INK_DARK, INK_LIGHT, OnColor, WorstInk } from "./ink.js";

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
const Em = (n: number): string => `${String(n)}em`;
const Ms = (n: number): string => `${String(n)}ms`;
const Num = (n: number): string => String(n);

const FILL_SCALE = "scale.";
const GRADIENT_REF = "gradient.";

const INK_SCALES = ["primary", "accent", "gray", "success", "warning", "error", "info"] as const;

type InkScale = (typeof INK_SCALES)[number];

function ScaleOf(theme: NebulaTheme, scale: InkScale): Record<string, string> {
  if (scale === "primary") return theme.colors.primary;
  if (scale === "accent") return theme.colors.accent;
  if (scale === "gray") return theme.colors.gray;
  return theme.colors.semantic[scale];
}

/** Un degradado lo declara el autor, y si no lo declara manda su peor extremo (ADR-089). */
function GradientInk(theme: NebulaTheme, ref: string): string | undefined {
  if (!ref.startsWith(GRADIENT_REF)) return undefined;
  const role = ref.slice(GRADIENT_REF.length);
  const token = theme.effects.gradients[role as keyof NebulaTheme["effects"]["gradients"]];
  if (token === undefined) return undefined;
  if (token.ink !== undefined) return token.ink === "dark" ? INK_DARK : INK_LIGHT;
  return WorstInk(token.stops.map((stop) => stop.color));
}

/** La tinta la decide el propio relleno de cada escala, no el autor del tema (ADR-085). */
function OnFill(theme: NebulaTheme, scale: InkScale): string {
  const ref = theme.variantMap.filled.background;
  const gradient = GradientInk(theme, ref);
  if (gradient !== undefined) return gradient;
  if (!ref.startsWith(FILL_SCALE)) return theme.colors.text.onPrimary;
  const fill = ScaleOf(theme, scale)[ref.slice(FILL_SCALE.length)];
  return fill === undefined ? theme.colors.text.onPrimary : OnColor(fill);
}

function Inks(theme: NebulaTheme): Record<InkScale, string> {
  const out = {} as Record<InkScale, string>;
  for (const scale of INK_SCALES) out[scale] = OnFill(theme, scale);
  return out;
}

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
      text: {
        ...colors.text,
        onPrimary: OnFill(theme, "primary"),
        onGradient:
          GradientInk(theme, theme.variantMap.gradient.background) ?? OnFill(theme, "primary"),
      },
      ink: Inks(theme),
      border: colors.border,
    },
    font: {
      family: font.family,
      size: MapValues(font.size, Px),
      weight: MapValues(font.weight, Num),
      leading: MapValues(font.leading, Num),
      lineHeight: MapValues(font.lineHeight, Num),
      letterSpacing: MapValues(font.letterSpacing, Em),
      display: {
        size: font.display.size,
        lineHeight: Num(font.display.lineHeight),
        letterSpacing: Em(font.display.letterSpacing),
      },
    },
    radius: MapValues(radius, Px),
    space: MapValues(spacing.scale, (mult) => Px(spacing.unit * mult)),
    size: {
      control: MapValues(sizes.control, Px),
      compact: MapValues(sizes.compact, Px),
    },
    motion: {
      duration: MapValues(motion.duration, Ms),
      easing: motion.easing,
    },
    blur: effects.blur,
    shadow: MapValues(effects.shadows, (s) => s.web),
    glass: {
      band: effects.glass.surface.band,
      control: effects.glass.surface.control,
      subtle: effects.glass.surface.subtle,
      default: effects.glass.surface.default,
      strong: effects.glass.surface.strong,
      noiseOpacity: Num(effects.glass.noiseOpacity),
    },
    zIndex: MapValues(zIndex, Num),
  };
}

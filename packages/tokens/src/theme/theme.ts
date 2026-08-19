import type { Variant, VariantRecipe } from "../types/variants.js";
import type {
  BlurLevel,
  BorderRole,
  ColorScheme,
  DurationName,
  EasingName,
  FontFamilyName,
  FontWeightName,
  GlassLevel,
  GradientRole,
  LetterSpacingName,
  LineHeightName,
  MotionTier,
  PaletteName,
  RadiusName,
  Scale11,
  SemanticStatus,
  ShadowLevel,
  SizeName,
  SpacingName,
  SpringConfig,
  SpringName,
  SurfaceRole,
  TextRole,
  TextSizeName,
  ZIndexName,
} from "./primitives.js";

export interface ThemeMeta {
  name: string;
  scheme: ColorScheme;
  version: string;
}

export type ThemeColors = {
  [K in PaletteName]: Scale11;
} & {
  primary: Scale11;
  accent: Scale11;
  gray: Scale11;
  semantic: Record<SemanticStatus, Scale11>;
  surface: Record<SurfaceRole, string>;
  text: Record<TextRole, string>;
  border: Record<BorderRole, string>;
};

export interface ThemeDisplay {
  size: string;
  lineHeight: number;
  letterSpacing: number;
}

export interface ThemeFont {
  family: Record<FontFamilyName, string>;
  size: Record<TextSizeName, number>;
  leading: Record<TextSizeName, number>;
  weight: Record<FontWeightName, number>;
  lineHeight: Record<LineHeightName, number>;
  letterSpacing: Record<LetterSpacingName, number>;
  display: ThemeDisplay;
}

export type ThemeRadius = Record<RadiusName, number>;

export interface ThemeSpacing {
  unit: number;
  scale: Record<SpacingName, number>;
}

export interface ThemeSizes {
  control: Record<SizeName, number>;
  compact: Record<SizeName, number>;
}

export interface ThemeMotion {
  tier: MotionTier;
  duration: Record<DurationName, number>;
  easing: Record<EasingName, string>;
  spring: Record<SpringName, SpringConfig>;
}

export interface GlassSurfaceRecipe {
  background: string;
  backdropFilter: string;
  /**
   * The edge of the material, as a colour. Translucent by design: an opaque edge does not
   * composite with what is behind the glass, so it reads as a dead line over a gradient and as
   * nothing at all over a flat surface. The width is the consumer's, never the token's.
   */
  borderColor: string;
}

export interface ThemeGlass {
  surface: Record<GlassLevel, GlassSurfaceRecipe>;
  noiseOpacity: number;
  enabled: boolean;
}

export interface DualShadow {
  web: string;
  native: {
    elevation: number;
    shadowColor: string;
    shadowOpacity: number;
    shadowRadius: number;
    shadowOffset: { width: number; height: number };
  };
}

export interface GradientStop {
  color: string;
  position: number;
}

export interface GradientToken {
  type: "linear" | "radial";
  angle: number;
  stops: GradientStop[];
  ink?: "light" | "dark";
}

export interface ThemeEffects {
  blur: Record<BlurLevel, string>;
  glass: ThemeGlass;
  shadows: Record<ShadowLevel, DualShadow>;
  gradients: Record<GradientRole, GradientToken>;
}

export type ThemeZIndex = Record<ZIndexName, number>;
export interface ThemeInk {
  /**
   * Contrast ratio below which light ink gives way to dark over a fill or a gradient.
   *
   * Light ink is the default and wins ties, so this is the only thing that ever forces dark:
   * raise it to keep text legible on pale fills, lower it to keep the type light no matter what.
   * At `0` every fill takes light ink, including a yellow one, which is a deliberate choice a
   * product makes about its own look — not something the library decides for it.
   *
   * The official themes ship `2`, which puts light ink on every surface except `warning`.
   * A gradient overrides the outcome outright with {@link GradientToken.ink}.
   */
  floor: number;
}

export interface NebulaTheme {
  meta: ThemeMeta;
  palettes: Record<PaletteName, Scale11>;
  colors: ThemeColors;
  ink: ThemeInk;
  font: ThemeFont;
  radius: ThemeRadius;
  spacing: ThemeSpacing;
  sizes: ThemeSizes;
  motion: ThemeMotion;
  effects: ThemeEffects;
  variantMap: Record<Variant, VariantRecipe>;
  zIndex: ThemeZIndex;
}

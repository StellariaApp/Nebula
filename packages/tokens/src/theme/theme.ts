import type { Size, Variant, VariantRecipe } from "../types/variants.js";
import type {
  BlurLevel,
  BorderRole,
  BreakpointName,
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
  control: Record<Size, number>;
  compact: Record<Size, number>;
}

export interface ThemeMotion {
  tier: MotionTier;
  duration: Record<DurationName, number>;
  easing: Record<EasingName, string>;
  spring: Record<SpringName, SpringConfig>;
}

export interface GlassSurfaceRecipe {
  background: string;
  border: string;
  backdropFilter: string;
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
}

export interface ThemeEffects {
  blur: Record<BlurLevel, string>;
  glass: ThemeGlass;
  shadows: Record<ShadowLevel, DualShadow>;
  gradients: Record<GradientRole, GradientToken>;
}

export type ThemeZIndex = Record<ZIndexName, number>;
export type ThemeBreakpoints = Record<BreakpointName, number>;

export interface NebulaTheme {
  meta: ThemeMeta;
  palettes: Record<PaletteName, Scale11>;
  colors: ThemeColors;
  font: ThemeFont;
  radius: ThemeRadius;
  spacing: ThemeSpacing;
  sizes: ThemeSizes;
  motion: ThemeMotion;
  effects: ThemeEffects;
  variantMap: Record<Variant, VariantRecipe>;
  zIndex: ThemeZIndex;
  breakpoints: ThemeBreakpoints;
}

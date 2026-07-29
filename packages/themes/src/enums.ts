import type {
  BlurLevel,
  BorderRole,
  BreakpointName,
  ColorScheme,
  ColorShade,
  DurationName,
  EasingName,
  FontFamilyName,
  FontWeightName,
  GlassLevel,
  GradientRole,
  GradientToken,
  LetterSpacingName,
  LineHeightName,
  MotionTier,
  RadiusName,
  SemanticStatus,
  ShadowLevel,
  Size,
  SpacingName,
  SpringName,
  SurfaceRole,
  TextRole,
  TextSizeName,
  Variant,
  ZIndexName,
} from "@stellaria/nebula-tokens";

export const enumValues =
  <Union extends string>() =>
  <const Values extends readonly Union[]>(
    values: [Union] extends [Values[number]] ? Values : never,
  ): Values =>
    values;

export const colorSchemes = enumValues<ColorScheme>()(["light", "dark"]);

export const colorShades = enumValues<ColorShade>()([
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "950",
]);

export const semanticStatuses = enumValues<SemanticStatus>()([
  "success",
  "warning",
  "error",
  "info",
]);

export const surfaceRoles = enumValues<SurfaceRole>()([
  "base",
  "raised",
  "overlay",
  "sunken",
  "hover",
  "active",
]);

export const textRoles = enumValues<TextRole>()([
  "primary",
  "secondary",
  "muted",
  "inverted",
  "onPrimary",
]);

export const borderRoles = enumValues<BorderRole>()(["subtle", "default", "strong", "focus"]);

export const fontFamilyNames = enumValues<FontFamilyName>()(["sans", "mono"]);

export const textSizeNames = enumValues<TextSizeName>()([
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "body1",
  "body2",
  "body3",
  "button",
  "caption",
]);

export const fontWeightNames = enumValues<FontWeightName>()([
  "thin",
  "extralight",
  "light",
  "regular",
  "medium",
  "semibold",
  "bold",
  "extrabold",
  "black",
]);

export const lineHeightNames = enumValues<LineHeightName>()(["tight", "normal", "relaxed"]);

export const letterSpacingNames = enumValues<LetterSpacingName>()(["tight", "normal", "wide"]);

export const radiusNames = enumValues<RadiusName>()([
  "xxs",
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "xxl",
  "full",
]);

export const spacingNames = enumValues<SpacingName>()([
  "none",
  "xxs",
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "xxl",
  "xxxl",
]);

export const sizeNames = enumValues<Size>()(["xs", "sm", "md", "lg", "xl"]);

export const motionTiers = enumValues<MotionTier>()(["minimal", "standard", "expressive"]);

export const durationNames = enumValues<DurationName>()([
  "instant",
  "fast",
  "base",
  "slow",
  "expressive",
]);

export const easingNames = enumValues<EasingName>()([
  "standard",
  "emphasized",
  "decelerate",
  "accelerate",
]);

export const springNames = enumValues<SpringName>()(["gentle", "default", "snappy"]);

export const blurLevels = enumValues<BlurLevel>()([
  "none",
  "xxs",
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "xxl",
]);

export const shadowLevels = enumValues<ShadowLevel>()(["xxs", "xs", "sm", "md", "lg", "xl", "xxl"]);

export const glassLevels = enumValues<GlassLevel>()(["subtle", "default", "strong"]);

export const gradientRoles = enumValues<GradientRole>()(["brand", "accent", "surface"]);

export const gradientTypes = enumValues<GradientToken["type"]>()(["linear", "radial"]);

export const variants = enumValues<Variant>()([
  "filled",
  "outline",
  "light",
  "glass",
  "ghost",
  "glow",
  "gradient",
  "unstyled",
]);

export const zIndexNames = enumValues<ZIndexName>()([
  "base",
  "dropdown",
  "sticky",
  "overlay",
  "modal",
  "popover",
  "toast",
  "tooltip",
]);

export const breakpointNames = enumValues<BreakpointName>()([
  "phone",
  "tablet",
  "laptop",
  "desktop",
  "wide",
]);

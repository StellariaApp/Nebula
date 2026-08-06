export type ColorScheme = "light" | "dark";

export type ColorShade =
  "50" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | "950";

export type Scale11 = Record<ColorShade, string>;

export type PaletteName =
  | "indigo"
  | "violet"
  | "green"
  | "yellow"
  | "red"
  | "blue"
  | "orange"
  | "teal"
  | "pink"
  | "cyan"
  | "lime"
  | "grape"
  | "rose"
  | "gold"
  | "sand"
  | "slate"
  | "brown"
  | "light"
  | "dark";

export type SemanticStatus = "success" | "warning" | "error" | "info";

export type SurfaceRole =
  "base" | "raised" | "overlay" | "sunken" | "hover" | "active" | "hoverActive" | "disabled";

export type TextRole =
  | "primary"
  | "secondary"
  | "muted"
  | "placeholder"
  | "inverted"
  | "onPrimary"
  | "onGradient"
  | "disabled";

export type BorderRole = "subtle" | "default" | "strong" | "focus" | "disabled";

export type FontFamilyName = "sans" | "mono";

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type BodyLevel = "body1" | "body2" | "body3";
export type TextSizeName = HeadingLevel | BodyLevel | "button" | "caption";

export type FontWeightName =
  | "thin"
  | "extralight"
  | "light"
  | "regular"
  | "medium"
  | "semibold"
  | "bold"
  | "extrabold"
  | "black";

export type FontWeightValue = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export type LineHeightName = "tight" | "normal" | "relaxed";
export type LetterSpacingName = "tight" | "normal" | "wide";

export type RadiusName = "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "full" | "none";

export type SizeName = "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

export type SpacingName =
  | "none"
  | "xxs"
  | "xs"
  | "u1_5"
  | "sm"
  | "u2_5"
  | "u3"
  | "u3_5"
  | "md"
  | "u5"
  | "lg"
  | "xl"
  | "xxl"
  | "xxxl";

export type MotionTier = "minimal" | "standard" | "expressive";

export type DurationName = "instant" | "fast" | "base" | "slow" | "expressive";

export type EasingName = "standard" | "emphasized" | "decelerate" | "accelerate";

export type SpringName = "gentle" | "default" | "snappy";

export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

export type BlurLevel = "none" | "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

export type ShadowLevel = "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

export type GlassLevel = "band" | "control" | "subtle" | "default" | "strong";

export type GradientRole = "brand" | "accent" | "surface";

export type BreakpointName = "phone" | "tablet" | "laptop" | "desktop" | "wide";

export type ZIndexName =
  "base" | "dropdown" | "sticky" | "overlay" | "modal" | "popover" | "toast" | "tooltip";

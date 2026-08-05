import type { NebulaTheme, PaletteName, Scale11 } from "../theme/index.js";
import {
  animation,
  blur,
  breakpoints,
  font,
  glass,
  radius,
  shadows,
  sizes,
  spacing,
  zIndex,
} from "../tokens/index.js";
import {
  KeysBase,
  KeysEffects,
  type AnimationsProps,
  type BaseProps,
  type BorderProps,
  type ColorsProps,
  type DimensionsProps,
  type EffectsProps,
  type LayoutsProps,
  type SpacingProps,
  type TypographyProps,
  type VariantsProps,
} from "../types/index.js";

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
type Expect<T extends true> = T;
type Extends<A, B> = A extends B ? true : false;

export type CheckAnimations = Expect<Extends<BaseProps, AnimationsProps>>;
export type CheckSpacing = Expect<Extends<BaseProps, SpacingProps>>;
export type CheckDimensions = Expect<Extends<BaseProps, DimensionsProps>>;
export type CheckColors = Expect<Extends<BaseProps, ColorsProps>>;
export type CheckTypography = Expect<Extends<BaseProps, TypographyProps>>;
export type CheckBorder = Expect<Extends<BaseProps, BorderProps>>;
export type CheckEffects = Expect<Extends<BaseProps, EffectsProps>>;
export type CheckLayouts = Expect<Extends<BaseProps, LayoutsProps>>;
export type CheckVariants = Expect<Extends<BaseProps, VariantsProps>>;

type KeysBaseUnion = (typeof KeysBase)[number];
export type CheckKeysBaseExact = Expect<Equal<KeysBaseUnion, keyof BaseProps>>;
export type CheckKeysBaseIncludesEffects = Expect<
  Extends<(typeof KeysEffects)[number], KeysBaseUnion>
>;

const smokeScale = {
  50: "#f4f6ff",
  100: "#e0e7ff",
  200: "#c7d2fe",
  300: "#a5b4fc",
  400: "#818cf8",
  500: "#6366f1",
  600: "#4f46e5",
  700: "#4338ca",
  800: "#3730a3",
  900: "#312e81",
  950: "#1e1b4b",
} as const satisfies Scale11;

const smokePalettes = {
  indigo: smokeScale,
  violet: smokeScale,
  green: smokeScale,
  yellow: smokeScale,
  red: smokeScale,
  blue: smokeScale,
  orange: smokeScale,
  teal: smokeScale,
  pink: smokeScale,
  cyan: smokeScale,
  lime: smokeScale,
  grape: smokeScale,
  rose: smokeScale,
  gold: smokeScale,
  sand: smokeScale,
  slate: smokeScale,
  brown: smokeScale,
  light: smokeScale,
  dark: smokeScale,
} satisfies Record<PaletteName, Scale11>;

export const smokeTheme = {
  meta: { name: "smoke", scheme: "light", version: "0.0.0" },
  palettes: smokePalettes,
  colors: {
    ...smokePalettes,
    primary: smokeScale,
    accent: smokeScale,
    gray: smokeScale,
    semantic: {
      success: smokeScale,
      warning: smokeScale,
      error: smokeScale,
      info: smokeScale,
    },
    surface: {
      base: "#ffffff",
      raised: "#f8f9fa",
      overlay: "#ffffff",
      sunken: "#f1f3f5",
      hover: "#f1f3f5",
      active: "#e9ecef",
      hoverActive: "#dee2e6",
      disabled: "#eaeaea",
    },
    text: {
      primary: "#1a1b1e",
      secondary: "#495057",
      muted: "#868e96",
      placeholder: "#868e96",
      inverted: "#ffffff",
      onPrimary: "#ffffff",
      onGradient: "#ffffff",
      disabled: "#9fa5ac",
    },
    border: {
      subtle: "#f1f3f5",
      default: "#dee2e6",
      strong: "#adb5bd",
      focus: "#4f46e5",
      disabled: "#c0c5ca",
    },
  },
  font,
  radius,
  spacing,
  sizes,
  motion: {
    tier: "standard",
    duration: animation.duration,
    easing: animation.easing,
    spring: animation.spring,
  },
  effects: {
    blur,
    glass: { surface: glass.surface, noiseOpacity: glass.noiseOpacity, enabled: true },
    shadows,
    gradients: {
      brand: {
        type: "linear",
        angle: 135,
        stops: [
          { color: "#4f46e5", position: 0 },
          { color: "#7c3aed", position: 100 },
        ],
      },
      accent: {
        type: "linear",
        angle: 90,
        stops: [
          { color: "#7c3aed", position: 0 },
          { color: "#db2777", position: 100 },
        ],
      },
      surface: {
        type: "radial",
        angle: 0,
        stops: [
          { color: "#f4f6ff", position: 0 },
          { color: "#ffffff", position: 100 },
        ],
      },
    },
  },
  variantMap: {
    filled: { background: "scale.600", foreground: "text.onPrimary", border: "none" },
    outline: { background: "transparent", foreground: "scale.600", border: "scale.600" },
    light: { background: "scale.500.12", foreground: "scale.700", border: "none" },
    glass: {
      background: "surface.overlay",
      foreground: "text.primary",
      border: "border.subtle",
      glass: "default",
    },
    ghost: { background: "transparent", foreground: "scale.600", border: "none" },
    glow: { background: "scale.600", foreground: "text.onPrimary", border: "none", glow: "lg" },
    gradient: { background: "gradient.brand", foreground: "text.onPrimary", border: "none" },
    unstyled: { background: "transparent", foreground: "currentColor", border: "none" },
  },
  zIndex,
  breakpoints,
} satisfies NebulaTheme;

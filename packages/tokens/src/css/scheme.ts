import type {
  BorderRole,
  Scale11,
  SemanticStatus,
  SurfaceRole,
  TextRole,
} from "../theme/primitives.js";
import { blue, dark, gray, green, indigo, light, red, violet, yellow } from "../tokens/palettes.js";
import { shadows } from "../tokens/effects.js";

export interface SchemeColors {
  primary: Scale11;
  accent: Scale11;
  gray: Scale11;
  semantic: Record<SemanticStatus, Scale11>;
  surface: Record<SurfaceRole, string>;
  text: Record<TextRole, string>;
  border: Record<BorderRole, string>;
}

export interface SchemeRecipe {
  colors: SchemeColors;
  shadows: Record<keyof typeof shadows, string>;
}

export function FlipScale(scale: Scale11): Scale11 {
  return {
    50: scale["950"],
    100: scale["900"],
    200: scale["800"],
    300: scale["700"],
    400: scale["600"],
    500: scale["500"],
    600: scale["400"],
    700: scale["300"],
    800: scale["200"],
    900: scale["100"],
    950: scale["50"],
  };
}

const RIM = "inset 0 1px 0 0";

export const LIGHT_SCHEME = {
  colors: {
    primary: indigo,
    accent: violet,
    gray,
    semantic: { success: green, warning: yellow, error: red, info: blue },
    surface: {
      overlay: light["50"],
      base: light["200"],
      raised: light["300"],
      sunken: light["400"],
      hover: light["300"],
      active: light["300"],
      hoverActive: light["400"],
      disabled: gray["200"],
    },
    text: {
      primary: gray["950"],
      secondary: gray["900"],
      muted: gray["800"],
      placeholder: gray["700"],
      inverted: gray["50"],
      onPrimary: light["50"],
      onGradient: light["50"],
      disabled: gray["400"],
    },
    border: {
      subtle: light["400"],
      default: light["500"],
      strong: gray["500"],
      focus: indigo["600"],
      disabled: light["700"],
    },
  },
  shadows: {
    xxs: shadows.xxs.web,
    xs: shadows.xs.web,
    sm: shadows.sm.web,
    md: shadows.md.web,
    lg: shadows.lg.web,
    xl: shadows.xl.web,
    xxl: shadows.xxl.web,
  },
} as const satisfies SchemeRecipe;

export const DARK_SCHEME = {
  colors: {
    primary: FlipScale(indigo),
    accent: FlipScale(violet),
    gray: FlipScale(gray),
    semantic: {
      success: FlipScale(green),
      warning: FlipScale(yellow),
      error: FlipScale(red),
      info: FlipScale(blue),
    },
    surface: {
      overlay: dark["400"],
      base: dark["600"],
      raised: dark["700"],
      sunken: dark["800"],
      hover: dark["700"],
      active: dark["700"],
      hoverActive: dark["800"],
      disabled: dark["700"],
    },
    text: {
      primary: gray["50"],
      secondary: gray["300"],
      muted: gray["400"],
      placeholder: gray["400"],
      inverted: gray["900"],
      onPrimary: dark["100"],
      onGradient: dark["100"],
      disabled: gray["800"],
    },
    border: {
      subtle: dark["700"],
      default: dark["700"],
      strong: gray["500"],
      focus: indigo["400"],
      disabled: gray["900"],
    },
  },
  shadows: {
    xxs: `${RIM} rgba(255, 255, 255, 0.04), 0 1px 2px rgba(0, 0, 0, 0.40)`,
    xs: `${RIM} rgba(255, 255, 255, 0.07), 0 2px 4px rgba(0, 0, 0, 0.45)`,
    sm: `${RIM} rgba(255, 255, 255, 0.10), 0 4px 10px rgba(0, 0, 0, 0.50)`,
    md: `${RIM} rgba(255, 255, 255, 0.13), 0 10px 24px rgba(0, 0, 0, 0.55)`,
    lg: `${RIM} rgba(255, 255, 255, 0.16), 0 18px 42px rgba(0, 0, 0, 0.60)`,
    xl: `${RIM} rgba(255, 255, 255, 0.18), 0 26px 58px rgba(0, 0, 0, 0.66)`,
    xxl: `${RIM} rgba(255, 255, 255, 0.20), 0 36px 84px rgba(0, 0, 0, 0.72)`,
  },
} as const satisfies SchemeRecipe;

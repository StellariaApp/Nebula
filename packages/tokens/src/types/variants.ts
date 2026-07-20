import type {
  BorderRole,
  ColorShade,
  GlassLevel,
  GradientRole,
  ShadowLevel,
  SurfaceRole,
  TextRole,
} from "../theme/primitives.js";
import type { ColorExtended } from "./colors.js";
import type { Unit } from "./dimensions.js";

export type Size = "xs" | "sm" | "md" | "lg" | "xl";
export type SizeValue = Size | Unit;

export type Variant =
  "filled" | "outline" | "light" | "glass" | "ghost" | "glow" | "gradient" | "unstyled";

export type Orientation = "horizontal" | "vertical";

export type VariantColorRef =
  | "transparent"
  | "currentColor"
  | `scale.${ColorShade}`
  | `scale.${ColorShade}.${number}`
  | `surface.${SurfaceRole}`
  | `text.${TextRole}`
  | `border.${BorderRole}`;

export type VariantBackground = VariantColorRef | `gradient.${GradientRole}`;

export interface VariantRecipe {
  background: VariantBackground;
  foreground: VariantColorRef;
  border: VariantColorRef | "none";
  glass?: GlassLevel;
  glow?: ShadowLevel;
}

export type VariantMap = Record<Variant, VariantRecipe>;

export type VariantProps = {
  variant?: Variant;
  gradient?: { from: ColorExtended; to: ColorExtended; deg?: number; animate?: boolean };
};

export type InteractionProps = {
  disabled?: boolean;
  loading?: boolean;
};

export type DataProps = {
  data?: Record<string, string | number | boolean | undefined>;
};

export type VariantsProps = VariantProps & InteractionProps & DataProps;

export const KeysVariants = ["variant", "gradient", "disabled", "loading", "data"] as const;

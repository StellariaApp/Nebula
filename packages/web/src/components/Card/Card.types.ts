import type { ReactNode } from "react";

import type {
  RadiusName,
  ColorExtended,
  GlassLevel,
  ShadowLevel,
  Unit,
  Variant,
} from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export type CardVariant = Extract<
  Variant,
  "filled" | "outline" | "light" | "glass" | "glow" | "gradient"
>;

export interface CardProps extends Omit<StyleProps, "shadow" | "color"> {
  children: ReactNode;
  variant?: CardVariant | undefined;
  color?: ColorExtended | undefined;
  radius?: RadiusName | undefined;
  shadow?: ShadowLevel | "none" | undefined;
  padding?: "none" | "md" | "lg" | "xl" | undefined;
  withBorder?: boolean | undefined;
  /** Peldaño de cristal cuando `variant="glass"`. Por defecto `subtle` (ADR-078). */
  glass?: GlassLevel | undefined;
  interactive?: boolean | undefined;
  onPress?: (() => void) | undefined;
  href?: string | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}

export interface CardSectionProps {
  children: ReactNode;
  inset?: boolean | undefined;
  withBorder?: boolean | undefined;
  className?: string | undefined;
}

export interface CardImageProps {
  src?: string | undefined;
  alt: string;
  height?: Unit | undefined;
  className?: string | undefined;
}

export interface CardSlotProps {
  children: ReactNode;
  className?: string | undefined;
}

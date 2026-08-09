import type { ReactNode } from "react";

import type {
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

export interface CardProps extends Omit<StyleProps, "shadow"> {
  children: ReactNode;
  variant?: CardVariant | undefined;
  color?: ColorExtended | undefined;
  shadow?: ShadowLevel | "none" | undefined;
  padding?: "none" | "md" | "lg" | "xl" | undefined;
  withBorder?: boolean | undefined;
  /** Glass step when `variant="glass"`. `subtle` by default (ADR-078). */
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

/** Props of the `Card` parts — `Badges`, `Meta` and `Actions`: children, `className` and style props. */
export interface CardSlotProps extends StyleProps {
  children: ReactNode;
  className?: string | undefined;
}

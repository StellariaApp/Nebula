import type { CSSProperties, ReactNode } from "react";

import type { ColorExtended, Unit, Variant } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export type HeroVariant = Extract<Variant, "filled" | "outline" | "light" | "glass">;

export type HeroSize = "sm" | "md" | "lg" | "xl";

export interface HeroProps extends Omit<
  StyleProps,
  "color" | "align" | "left" | "right" | "bottom"
> {
  title?: ReactNode | undefined;
  subtitle?: ReactNode | undefined;
  hiper?: ReactNode | undefined;
  description?: ReactNode | undefined;
  image?: string | undefined;
  imageAlt?: string | undefined;
  overlayOpacity?: number | undefined;
  variant?: HeroVariant | undefined;
  color?: ColorExtended | undefined;
  size?: HeroSize | undefined;
  align?: "start" | "center" | undefined;
  order?: 1 | 2 | 3 | 4 | 5 | 6 | undefined;
  contentWidth?: Unit | undefined;
  id?: string | undefined;
  style?: CSSProperties | undefined;
  actions?: ReactNode | undefined;
  left?: ReactNode | undefined;
  right?: ReactNode | undefined;
  bottom?: ReactNode | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
}

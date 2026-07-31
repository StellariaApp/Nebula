import type { ReactNode } from "react";

import type { ColorExtended, Variant } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export type BannerVariant = Extract<Variant, "filled" | "outline" | "light" | "glass">;

export type BannerSize = "sm" | "md" | "lg" | "xl";

export interface BannerProps extends Omit<StyleProps, "color" | "align" | "left" | "right" | "bottom"> {
  title?: ReactNode | undefined;
  subtitle?: ReactNode | undefined;
  hiper?: ReactNode | undefined;
  description?: ReactNode | undefined;
  image?: string | undefined;
  imageAlt?: string | undefined;
  overlayOpacity?: number | undefined;
  variant?: BannerVariant | undefined;
  color?: ColorExtended | undefined;
  size?: BannerSize | undefined;
  align?: "start" | "center" | undefined;
  actions?: ReactNode | undefined;
  left?: ReactNode | undefined;
  right?: ReactNode | undefined;
  bottom?: ReactNode | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
}

import type { ReactNode } from "react";

import type { ColorExtended, Size, Variant } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export type ThemeIconVariant = Extract<
  Variant,
  "filled" | "outline" | "light" | "ghost" | "gradient"
>;

export interface ThemeIconProps extends StyleProps {
  children?: ReactNode | undefined;
  variant?: ThemeIconVariant | undefined;
  color?: ColorExtended | undefined;
  size?: Size | undefined;
  radius?: "sm" | "md" | "full" | undefined;
  label?: string | undefined;
  className?: string | undefined;
}

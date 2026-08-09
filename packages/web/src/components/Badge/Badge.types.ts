import type { ReactNode } from "react";

import type { ColorExtended, Size, Variant } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";

export type BadgeVariant = Extract<Variant, "filled" | "outline" | "light" | "ghost" | "gradient">;

export interface BadgeProps extends StyleProps {
  children?: ReactNode | undefined;
  variant?: BadgeVariant | undefined;
  dot?: boolean | undefined;
  color?: ColorExtended | undefined;
  size?: Size | undefined;
  radius?: "sm" | "md" | "full" | undefined;
  leftSection?: ReactNode | undefined;
  rightSection?: ReactNode | undefined;
  fullWidth?: boolean | undefined;
  className?: string | undefined;
  /** The colour dot. Only rendered with `dot`; its colour comes from the scale, not from the stylesheet. */
  dotProps?: BoxSlotProps | undefined;
  /** Wrapper for `leftSection`. */
  leftSectionProps?: BoxSlotProps | undefined;
  /** Wrapper for `rightSection`. */
  rightSectionProps?: BoxSlotProps | undefined;
}

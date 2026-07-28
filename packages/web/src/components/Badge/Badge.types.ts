import type { ReactNode } from "react";

import type { SemanticScaleName, Size } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export type BadgeVariant = "light" | "filled" | "outline" | "dot";

export interface BadgeProps extends Omit<StyleProps, "color"> {
  children?: ReactNode | undefined;
  variant?: BadgeVariant | undefined;
  color?: SemanticScaleName | undefined;
  size?: Size | undefined;
  radius?: "sm" | "md" | "full" | undefined;
  leftSection?: ReactNode | undefined;
  rightSection?: ReactNode | undefined;
  fullWidth?: boolean | undefined;
  className?: string | undefined;
}

import type { ReactNode } from "react";

import type { ColorExtended, Size, Variant } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export type TagVariant = Extract<Variant, "filled" | "outline" | "light" | "ghost">;

export interface TagProps extends StyleProps {
  children?: ReactNode | undefined;
  variant?: TagVariant | undefined;
  color?: ColorExtended | undefined;
  size?: Size | undefined;
  radius?: "sm" | "md" | "full" | undefined;
  leftSection?: ReactNode | undefined;
  onRemove?: (() => void) | undefined;
  removeLabel?: string | undefined;
  disabled?: boolean | undefined;
  className?: string | undefined;
}

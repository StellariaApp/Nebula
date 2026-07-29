import type { ReactNode } from "react";

import type { SemanticScaleName, Size, Unit, Variant } from "@stellaria/nebula-tokens";
import type { StyleProps } from "../../utils/style-props.js";

export type AvatarVariant = Extract<Variant, "filled" | "outline" | "light">;

export interface AvatarProps extends Omit<StyleProps, "color"> {
  src?: string | undefined;
  alt?: string | undefined;
  name?: string | undefined;
  children?: ReactNode | undefined;
  size?: Size | Unit | undefined;
  radius?: "sm" | "md" | "full" | undefined;
  variant?: AvatarVariant | undefined;
  color?: SemanticScaleName | undefined;
  className?: string | undefined;
}

export interface AvatarGroupProps {
  children: ReactNode;
  max?: number | undefined;
  total?: number | undefined;
  size?: Size | Unit | undefined;
  spacing?: Unit | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}

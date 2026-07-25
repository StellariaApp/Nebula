import type { ReactNode } from "react";

import type { SemanticScaleName, Size, Unit } from "@stellaria/nebula-tokens";

export interface AvatarProps {
  src?: string | undefined;
  alt?: string | undefined;
  name?: string | undefined;
  children?: ReactNode | undefined;
  size?: Size | Unit | undefined;
  radius?: "sm" | "md" | "full" | undefined;
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

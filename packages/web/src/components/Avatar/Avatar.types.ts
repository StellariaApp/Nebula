import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { ColorExtended, Size, Unit, Variant } from "@stellaria/nebula-tokens";
import type { StyleProps } from "../../utils/style-props.js";

export type AvatarVariant = Extract<Variant, "filled" | "outline" | "light">;

export interface AvatarProps extends StyleProps {
  src?: string | undefined;
  alt?: string | undefined;
  name?: string | undefined;
  children?: ReactNode | undefined;
  size?: Size | Unit | undefined;
  radius?: "sm" | "md" | "full" | undefined;
  variant?: AvatarVariant | undefined;
  color?: ColorExtended | undefined;
  className?: string | undefined;
  /** La imagen. Solo se pinta si hay `src` y no ha fallado la carga; si falla, caen las iniciales. */
  imageProps?: ComponentPropsWithoutRef<"img"> | undefined;
}

export interface AvatarGroupProps extends StyleProps {
  children: ReactNode;
  max?: number | undefined;
  total?: number | undefined;
  size?: Size | Unit | undefined;
  spacing?: Unit | undefined;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}

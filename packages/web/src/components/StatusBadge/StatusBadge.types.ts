import type { ReactNode } from "react";

import type { ColorExtended, Size } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";
import type { BadgeVariant } from "../Badge/Badge.types.js";

export type StatusBadgeVariant = BadgeVariant;

export interface StatusDescriptor {
  label: ReactNode;
  color?: ColorExtended | undefined;
  variant?: StatusBadgeVariant | undefined;
  icon?: ReactNode | undefined;
  dot?: boolean | undefined;
  description?: string | undefined;
}

export type StatusMap<S extends string = string> = Readonly<Record<S, StatusDescriptor>>;

export interface StatusBadgeProps<S extends string = string> extends StyleProps {
  status: S;
  map?: StatusMap<S> | undefined;
  variant?: StatusBadgeVariant | undefined;
  color?: ColorExtended | undefined;
  size?: Size | undefined;
  radius?: "sm" | "md" | "full" | undefined;
  dot?: boolean | undefined;
  fullWidth?: boolean | undefined;
  className?: string | undefined;
}

export interface StatusMapProviderProps<S extends string = string> {
  map: StatusMap<S>;
  children: ReactNode;
}

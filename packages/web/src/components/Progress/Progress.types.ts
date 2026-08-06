import type { ReactNode } from "react";

import type { ColorExtended, Size, Unit, Variant } from "@stellaria/nebula-tokens";
import type { StyleProps } from "../../utils/style-props.js";

export type ProgressVariant = Extract<Variant, "light" | "outline" | "ghost">;

export interface ProgressSegment {
  value: number;
  color?: ColorExtended | undefined;
  label?: string | undefined;
}

export interface ProgressProps extends StyleProps {
  value?: number | undefined;
  segments?: readonly ProgressSegment[] | undefined;
  max?: number | undefined;
  type?: "bar" | "ring" | undefined;
  variant?: ProgressVariant | undefined;
  color?: ColorExtended | undefined;
  size?: Size | Unit | undefined;
  thickness?: number | undefined;
  radius?: Unit | undefined;
  striped?: boolean | undefined;
  indeterminate?: boolean | undefined;
  label?: string | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
}

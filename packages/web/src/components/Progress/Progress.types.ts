import type { ReactNode } from "react";

import type { SemanticScaleName, Size, Unit } from "@stellaria/nebula-tokens";
import type { StyleProps } from "../../utils/style-props.js";

export interface ProgressSegment {
  value: number;
  color?: SemanticScaleName | undefined;
  label?: string | undefined;
}

export interface ProgressProps extends Omit<StyleProps, "color"> {
  value?: number | undefined;
  segments?: readonly ProgressSegment[] | undefined;
  max?: number | undefined;
  type?: "bar" | "ring" | undefined;
  color?: SemanticScaleName | undefined;
  size?: Size | Unit | undefined;
  thickness?: number | undefined;
  radius?: Unit | undefined;
  striped?: boolean | undefined;
  indeterminate?: boolean | undefined;
  label?: string | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
}

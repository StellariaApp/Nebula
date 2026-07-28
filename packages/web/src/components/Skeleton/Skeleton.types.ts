import type { ReactNode } from "react";

import type { RadiusName, Unit } from "@stellaria/nebula-tokens";
import type { StyleProps } from "../../utils/style-props.js";

export type SkeletonAnimation = "shimmer" | "pulse" | "none";

export interface SkeletonProps extends Omit<StyleProps, "color"> {
  loading?: boolean | undefined;
  children?: ReactNode | undefined;
  width?: Unit | undefined;
  height?: Unit | undefined;
  radius?: RadiusName | Unit | undefined;
  circle?: boolean | undefined;
  animation?: SkeletonAnimation | undefined;
  lines?: number | undefined;
  label?: string | undefined;
  className?: string | undefined;
}

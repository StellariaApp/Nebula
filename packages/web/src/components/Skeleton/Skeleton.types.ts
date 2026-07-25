import type { ReactNode } from "react";

import type { RadiusName, Unit } from "@stellaria/nebula-tokens";

export type SkeletonAnimation = "shimmer" | "pulse" | "none";

export interface SkeletonProps {
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

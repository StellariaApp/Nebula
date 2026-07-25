import type { CSSProperties, ReactNode } from "react";

import type { SpringName } from "@stellaria/nebula-tokens";

export type TransitionPreset =
  | "fade"
  | "scale"
  | "pop"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right";

export interface TransitionProps {
  mounted: boolean;
  transition?: TransitionPreset | undefined;
  spring?: SpringName | undefined;
  duration?: number | undefined;
  onExitComplete?: (() => void) | undefined;
  className?: string | undefined;
  style?: CSSProperties | undefined;
  children?: ReactNode | undefined;
}

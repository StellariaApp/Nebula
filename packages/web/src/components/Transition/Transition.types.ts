import type { CSSProperties, ReactNode } from "react";

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
  duration?: number | undefined;
  className?: string | undefined;
  style?: CSSProperties | undefined;
  children?: ReactNode | undefined;
}

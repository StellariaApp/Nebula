import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { SemanticScaleName, Size, Variant } from "@stellaria/nebula-tokens";
import type { PressEvent } from "react-aria";

type MotionConflictingProps =
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onDragEnter"
  | "onDragExit"
  | "onDragLeave"
  | "onDragOver"
  | "onDrop";

export interface ButtonProps extends Omit<
  ComponentPropsWithoutRef<"button">,
  "color" | "disabled" | MotionConflictingProps
> {
  variant?: Variant | undefined;
  size?: Size | undefined;
  color?: SemanticScaleName | undefined;
  disabled?: boolean | undefined;
  loading?: boolean | undefined;
  fullWidth?: boolean | undefined;
  leftSection?: ReactNode | undefined;
  rightSection?: ReactNode | undefined;
  children?: ReactNode | undefined;
  onPress?: ((event: PressEvent) => void) | undefined;
}

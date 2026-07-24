import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { ColorExtended, Size, Variant, VariantProps } from "@stellaria/nebula-tokens";

import type { PressLifecycleProps } from "../../utils/press-props.js";

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

export interface ActionIconProps
  extends Omit<ComponentPropsWithoutRef<"button">, "color" | "disabled" | MotionConflictingProps>,
    PressLifecycleProps {
  variant?: Variant | undefined;
  size?: Size | undefined;
  color?: ColorExtended | undefined;
  gradient?: VariantProps["gradient"] | undefined;
  disabled?: boolean | undefined;
  loading?: boolean | undefined;
  children?: ReactNode | undefined;
}

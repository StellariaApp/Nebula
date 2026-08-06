import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type {
  ColorExtended,
  PermissionProps,
  RadiusName,
  Size,
  Variant,
  VariantProps,
} from "@stellaria/nebula-tokens";

import type { PressLifecycleProps } from "../../utils/press-props.js";
import type { StyleProps } from "../../utils/style-props.js";

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

export type QuickActionOrientation = "vertical" | "horizontal";

export interface QuickActionProps
  extends
    Omit<ComponentPropsWithoutRef<"button">, "color" | "disabled" | MotionConflictingProps>,
    StyleProps,
    PressLifecycleProps,
    PermissionProps {
  label: ReactNode;
  icon?: ReactNode | undefined;
  description?: ReactNode | undefined;
  variant?: Variant | undefined;
  color?: ColorExtended | undefined;
  gradient?: VariantProps["gradient"] | undefined;
  size?: Size | undefined;
  radius?: RadiusName | undefined;
  orientation?: QuickActionOrientation | undefined;
  badge?: ReactNode | undefined;
  disabled?: boolean | undefined;
  loading?: boolean | undefined;
  fullWidth?: boolean | undefined;
  href?: string | undefined;
  target?: string | undefined;
  rel?: string | undefined;
}

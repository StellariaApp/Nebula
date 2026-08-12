import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type {
  ColorExtended,
  GlassLevel,
  PermissionProps,
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

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export type QuickActionOrientation = "vertical" | "horizontal";

export interface QuickActionProps
  extends
    Omit<ComponentPropsWithoutRef<"button">, "color" | "disabled" | MotionConflictingProps>,
    StyleProps,
    PressLifecycleProps,
    PermissionProps {
  label: ReactNode;
  /** The notification badge, when there is a `badge`. */
  badgeProps?: BoxSlotProps | undefined;
  /** Wrapper for the icon. Its size comes from `size`; the slot composes with it. */
  iconProps?: BoxSlotProps | undefined;
  /** Label and description column. */
  bodyProps?: BoxSlotProps | undefined;
  /** The label. */
  labelProps?: TextSlotProps | undefined;
  /** The description, when there is one. */
  descriptionProps?: TextSlotProps | undefined;
  icon?: ReactNode | undefined;
  description?: ReactNode | undefined;
  variant?: Variant | undefined;
  color?: ColorExtended | undefined;
  gradient?: VariantProps["gradient"] | undefined;
  /** Clase de cristal de la variante `glass`. Por defecto `veil`, la de los accionables (ADR-136). */
  glass?: GlassLevel | undefined;
  size?: Size | undefined;
  orientation?: QuickActionOrientation | undefined;
  badge?: ReactNode | undefined;
  disabled?: boolean | undefined;
  loading?: boolean | undefined;
  fullWidth?: boolean | undefined;
  href?: string | undefined;
  target?: string | undefined;
  rel?: string | undefined;
}

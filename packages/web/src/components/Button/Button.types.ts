import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type {
  ColorExtended,
  PermissionProps,
  Size,
  Variant,
  VariantProps,
} from "@stellaria/nebula-tokens";

import type { PressLifecycleProps } from "../../utils/press-props.js";
import type { StyleProps } from "../../utils/style-props.js";
import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

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

export interface ButtonProps
  extends
    Omit<ComponentPropsWithoutRef<"button">, "color" | "disabled" | MotionConflictingProps>,
    StyleProps,
    PressLifecycleProps,
    PermissionProps {
  /** Envoltorio de `leftSection`. */
  leftSectionProps?: BoxSlotProps | undefined;
  /** Envoltorio de `rightSection`. */
  rightSectionProps?: BoxSlotProps | undefined;
  /**
   * El rótulo, que envuelve a `children`. Con `loading` se atenúa junto a las secciones, que es
   * como el botón deja sitio al giro sin cambiar de tamaño.
   */
  labelProps?: TextSlotProps | undefined;
  variant?: Variant | undefined;
  size?: Size | undefined;
  color?: ColorExtended | undefined;
  gradient?: VariantProps["gradient"] | undefined;
  disabled?: boolean | undefined;
  loading?: boolean | undefined;
  fullWidth?: boolean | undefined;
  leftSection?: ReactNode | undefined;
  rightSection?: ReactNode | undefined;
  children?: ReactNode | undefined;
}

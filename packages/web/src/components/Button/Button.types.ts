import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

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
  /**
   * The element it renders. With anything other than `button` — an `a` for a CTA that navigates, a
   * router `Link` — React Aria adds the `role`, the `tabIndex` and the Space and Enter handling, so
   * the keyboard contract does not degrade. The `type` is only written when the element is a button.
   */
  component?: ElementType | undefined;
  /** Only has an effect with `component`: these are the attributes of the element you chose. */
  href?: string | undefined;
  /** Envoltorio de `leftSection`. */
  leftSectionProps?: BoxSlotProps | undefined;
  /** Envoltorio de `rightSection`. */
  rightSectionProps?: BoxSlotProps | undefined;
  /**
   * The label, which wraps `children`. With `loading` it dims alongside the sections, which is how
   * the button makes room for the spinner without changing size.
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

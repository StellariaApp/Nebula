import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { NebulaField, Size } from "@stellaria/nebula-tokens";

import type { ErrorDisplay } from "../FieldError/FieldError.types.js";
import type { PopoverPlacement } from "../Popover/Popover.types.js";
import type { FieldSurface } from "../../styles/field-surface.js";
import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { OverlayMotionSlotProps } from "../../overlays/overlay-motion.js";

import type { FormFieldSlotProps } from "../FormField/FormField.types.js";

export type ColorFormat = "hex" | "hexa" | "rgb" | "rgba" | "hsl" | "hsla";

export interface ColorPickerProps extends StyleProps {
  /** The swatch row. Only rendered with `swatches`. */
  swatchesProps?: BoxSlotProps | undefined;
  /**
   * Every swatch. It spreads over ALL of them. Its `background` is written AFTER the slot, because it
   * is the colour it represents; everything else — size, radius, border — can be adjusted from here.
   */
  swatchProps?: BoxSlotProps | undefined;
  label?: ReactNode | undefined;
  size?: Size | undefined;
  format?: ColorFormat | undefined;
  withAlpha?: boolean | undefined;
  swatches?: readonly string[] | undefined;
  disabled?: boolean | undefined;
  field?: NebulaField<string> | undefined;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  labels?: ColorPickerLabels | undefined;
  className?: string | undefined;
}

export interface ColorPickerLabels {
  area?: string | undefined;
  hue?: string | undefined;
  alpha?: string | undefined;
  swatches?: string | undefined;
  swatch?: ((value: string) => string) | undefined;
}

export interface ColorInputProps extends StyleProps, FormFieldSlotProps {
  /**
   * The chip that shows the colour. It spreads over BOTH: the one at the start of the field and the
   * one inside the button. Its `background` is written after the slot.
   */
  previewProps?: BoxSlotProps | undefined;
  /** The button that opens the picker. It only exists with `withPicker`. */
  triggerProps?: ComponentPropsWithoutRef<"button"> | undefined;
  /**
   * The dropdown with the picker, which is the motion wrapper of the floating surface and does not go
   * through `Box`: it does not accept style props. React Aria computes its position and writes it
   * after the slot; the `style` you pass composes with it.
   */
  dropdownProps?: OverlayMotionSlotProps | undefined;
  label?: ReactNode | undefined;
  description?: ReactNode | undefined;
  error?: string | boolean | undefined;
  errorDisplay?: ErrorDisplay | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  readOnly?: boolean | undefined;
  size?: Size | undefined;
  surface?: FieldSurface | undefined;
  format?: ColorFormat | undefined;
  withAlpha?: boolean | undefined;
  withPicker?: boolean | undefined;
  swatches?: readonly string[] | undefined;
  placement?: PopoverPlacement | undefined;
  placeholder?: string | undefined;
  openLabel?: string | undefined;
  labels?: ColorPickerLabels | undefined;
  field?: NebulaField<string> | undefined;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  name?: string | undefined;
  className?: string | undefined;
  rootClassName?: string | undefined;
}

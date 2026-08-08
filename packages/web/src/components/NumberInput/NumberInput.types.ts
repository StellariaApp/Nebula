import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { NebulaField, Size } from "@stellaria/nebula-tokens";

import type { ErrorDisplay } from "../FieldError/FieldError.types.js";
import type { FieldSurface } from "../../styles/field-surface.js";
import type { StyleProps } from "../../utils/style-props.js";

import type { FormFieldSlotProps } from "../FormField/FormField.types.js";
import type { BoxSlotProps } from "../Box/Box.types.js";
import type { UnstyledButtonProps } from "../UnstyledButton/UnstyledButton.types.js";

export interface NumberInputProps
  extends
    Omit<
      ComponentPropsWithoutRef<"input">,
      | "value"
      | "defaultValue"
      | "onChange"
      | "size"
      | "color"
      | "disabled"
      | "required"
      | "type"
      | "min"
      | "max"
      | "step"
    >,
    StyleProps,
    FormFieldSlotProps {
  /** La columna de las dos flechas. No se pinta con `hideControls`. */
  stepperProps?: BoxSlotProps | undefined;
  /** La flecha de subir. Se deshabilita sola al llegar a `max`. */
  incrementProps?: UnstyledButtonProps | undefined;
  /** La flecha de bajar. Se deshabilita sola al llegar a `min`. */
  decrementProps?: UnstyledButtonProps | undefined;
  label?: ReactNode | undefined;
  description?: ReactNode | undefined;
  error?: string | boolean | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  size?: Size | undefined;
  surface?: FieldSurface | undefined;
  field?: NebulaField<number> | undefined;
  value?: number | undefined;
  /** @default Number.NaN */
  defaultValue?: number | undefined;
  onChange?: ((value: number) => void) | undefined;
  min?: number | undefined;
  max?: number | undefined;
  step?: number | undefined;
  hideControls?: boolean | undefined;
  incrementLabel?: string | undefined;
  decrementLabel?: string | undefined;
  errorDisplay?: ErrorDisplay | undefined;
  rootClassName?: string | undefined;
}

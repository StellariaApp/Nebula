import type { ReactNode } from "react";

import type { NebulaField, Size } from "@stellaria/nebula-tokens";

import type { ErrorDisplay } from "../FieldError/FieldError.types.js";
import type { FieldSurface } from "../../styles/field-surface.js";
import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";

import type { FormFieldSlotProps } from "../FormField/FormField.types.js";

export type PinInputType = "numeric" | "alphanumeric";

export interface PinInputProps extends StyleProps, FormFieldSlotProps {
  /** La fila de casillas. Es el `role="group"` que agrupa los campos dentro del `FormField`. */
  groupProps?: BoxSlotProps | undefined;
  label?: ReactNode | undefined;
  description?: ReactNode | undefined;
  error?: string | boolean | undefined;
  errorDisplay?: ErrorDisplay | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  readOnly?: boolean | undefined;
  size?: Size | undefined;
  surface?: FieldSurface | undefined;
  length?: number | undefined;
  type?: PinInputType | undefined;
  mask?: boolean | undefined;
  placeholder?: string | undefined;
  autoFocus?: boolean | undefined;
  field?: NebulaField<string> | undefined;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  onComplete?: ((value: string) => void) | undefined;
  cellLabel?: ((index: number, length: number) => string) | undefined;
  name?: string | undefined;
  className?: string | undefined;
  rootClassName?: string | undefined;
}

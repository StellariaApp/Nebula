import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { NebulaField, Size } from "@stellaria/nebula-tokens";

import type { ErrorDisplay } from "../FieldError/FieldError.types.js";
import type { FieldSurface } from "../../styles/field-surface.js";
import type { StyleProps } from "../../utils/style-props.js";

import type { FormFieldSlotProps } from "../FormField/FormField.types.js";

export interface FileInputProps extends StyleProps, FormFieldSlotProps {
  /**
   * The button that opens the file browser and shows the chosen files. The native `input` has no
   * slot: it is hidden, and everything it accepts — `accept`, `multiple`, `capture`, `name` — is
   * already a prop.
   */
  triggerProps?: ComponentPropsWithoutRef<"button"> | undefined;
  label?: ReactNode | undefined;
  description?: ReactNode | undefined;
  error?: string | boolean | undefined;
  errorDisplay?: ErrorDisplay | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  size?: Size | undefined;
  surface?: FieldSurface | undefined;
  placeholder?: string | undefined;
  accept?: string | undefined;
  multiple?: boolean | undefined;
  capture?: "user" | "environment" | undefined;
  clearable?: boolean | undefined;
  field?: NebulaField<File[]> | undefined;
  value?: readonly File[] | undefined;
  defaultValue?: readonly File[] | undefined;
  onChange?: ((value: File[]) => void) | undefined;
  formatValue?: ((files: readonly File[]) => ReactNode) | undefined;
  browseLabel?: string | undefined;
  clearLabel?: string | undefined;
  name?: string | undefined;
  className?: string | undefined;
  rootClassName?: string | undefined;
}

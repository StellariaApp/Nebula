import type { FieldStatus, NebulaField } from "@stellaria/nebula-tokens";

import { useUncontrolled } from "./use-uncontrolled.js";

export interface UseFieldPropsInput<T> {
  field?: NebulaField<T> | undefined;
  value?: T | undefined;
  defaultValue: T;
  onChange?: ((value: T) => void) | undefined;
  error?: string | boolean | undefined;
  disabled?: boolean | undefined;
  required?: boolean | undefined;
}

export interface FieldPropsResult<T> {
  value: T;
  onChange: (value: T) => void;
  status: FieldStatus;
  errorMessage: string | undefined;
  isInvalid: boolean;
  isDisabled: boolean;
  isRequired: boolean;
}

export function useFieldProps<T>(input: UseFieldPropsInput<T>): FieldPropsResult<T> {
  const { field, value, defaultValue, onChange, error, disabled = false, required = false } = input;

  const [uncontrolled_value, set_uncontrolled_value] = useUncontrolled(
    value,
    defaultValue,
    onChange,
  );

  const resolved_value = field ? field.value : uncontrolled_value;
  const resolved_on_change = field ? field.setValue : set_uncontrolled_value;
  const status: FieldStatus = field ? field.status : "idle";

  const field_error =
    field && field.touched && field.status === "invalid" ? field.error : undefined;

  const explicit_message = typeof error === "string" ? error : undefined;
  const error_message = explicit_message ?? field_error;
  const is_invalid = error === true || error_message !== undefined;

  return {
    value: resolved_value,
    onChange: resolved_on_change,
    status,
    errorMessage: error_message,
    isInvalid: is_invalid,
    isDisabled: disabled,
    isRequired: required,
  };
}

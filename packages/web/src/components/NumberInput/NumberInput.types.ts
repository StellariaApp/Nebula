import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { NebulaField, Size } from "@stellaria/nebula-tokens";

import type { ErrorDisplay } from "../FieldError/FieldError.types.js";

export interface NumberInputProps
  extends Omit<
    ComponentPropsWithoutRef<"input">,
    "value" | "defaultValue" | "onChange" | "size" | "color" | "disabled" | "required" | "type" | "min" | "max" | "step"
  > {
  label?: ReactNode | undefined;
  description?: ReactNode | undefined;
  error?: string | boolean | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  size?: Size | undefined;
  field?: NebulaField<number> | undefined;
  value?: number | undefined;
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

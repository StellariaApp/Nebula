import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { NebulaField, Size } from "@stellaria/nebula-tokens";

import type { ErrorDisplay } from "../FieldError/FieldError.types.js";
import type { FieldSurface } from "../../styles/field-surface.js";
import type { StyleProps } from "../../utils/style-props.js";

export interface PasswordInputProps
  extends
    Omit<
      ComponentPropsWithoutRef<"input">,
      "value" | "defaultValue" | "onChange" | "size" | "color" | "disabled" | "required" | "type"
    >,
    StyleProps {
  label?: ReactNode | undefined;
  description?: ReactNode | undefined;
  error?: string | boolean | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  size?: Size | undefined;
  surface?: FieldSurface | undefined;
  field?: NebulaField<string> | undefined;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  showLabel?: string | undefined;
  hideLabel?: string | undefined;
  errorDisplay?: ErrorDisplay | undefined;
  rootClassName?: string | undefined;
}

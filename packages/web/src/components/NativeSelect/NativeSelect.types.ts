import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { NebulaField, Size } from "@stellaria/nebula-tokens";

import type { SelectOption } from "../../collections/options.js";
import type { ErrorDisplay } from "../FieldError/FieldError.types.js";
import type { FieldSurface } from "../../styles/field-surface.js";
import type { StyleProps } from "../../utils/style-props.js";

export interface NativeSelectGroup {
  label: string;
  options: readonly SelectOption[];
}

export interface NativeSelectProps
  extends
    Omit<
      ComponentPropsWithoutRef<"select">,
      "size" | "color" | "value" | "defaultValue" | "onChange" | "disabled" | "required"
    >,
    StyleProps {
  label?: ReactNode | undefined;
  description?: ReactNode | undefined;
  error?: string | boolean | undefined;
  errorDisplay?: ErrorDisplay | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  size?: Size | undefined;
  surface?: FieldSurface | undefined;
  data?: readonly SelectOption[] | undefined;
  groups?: readonly NativeSelectGroup[] | undefined;
  placeholder?: string | undefined;
  field?: NebulaField<string> | undefined;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  className?: string | undefined;
  rootClassName?: string | undefined;
}

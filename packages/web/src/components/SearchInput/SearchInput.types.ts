import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { NebulaField, Size } from "@stellaria/nebula-tokens";

import type { ErrorDisplay } from "../FieldError/FieldError.types.js";
import type { StyleProps } from "../../utils/style-props.js";

export interface SearchInputProps
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
  field?: NebulaField<string> | undefined;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  onSearch?: ((value: string) => void) | undefined;
  debounce?: number | undefined;
  clearable?: boolean | undefined;
  clearLabel?: string | undefined;
  errorDisplay?: ErrorDisplay | undefined;
  rootClassName?: string | undefined;
}

import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { NebulaField, Size } from "@stellaria/nebula-tokens";

export interface TextareaProps
  extends Omit<
    ComponentPropsWithoutRef<"textarea">,
    "value" | "defaultValue" | "onChange" | "size" | "color" | "disabled" | "required"
  > {
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
  autosize?: boolean | undefined;
  rootClassName?: string | undefined;
}

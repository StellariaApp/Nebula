import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { Orientation, SemanticScaleName, Size } from "@stellaria/nebula-tokens";

export interface CheckboxProps
  extends Omit<
    ComponentPropsWithoutRef<"input">,
    "size" | "onChange" | "checked" | "defaultChecked" | "type" | "color" | "disabled"
  > {
  label?: ReactNode | undefined;
  size?: Size | undefined;
  color?: SemanticScaleName | undefined;
  checked?: boolean | undefined;
  defaultChecked?: boolean | undefined;
  onChange?: ((checked: boolean) => void) | undefined;
  indeterminate?: boolean | undefined;
  value?: string | undefined;
  disabled?: boolean | undefined;
  error?: boolean | undefined;
  rootClassName?: string | undefined;
}

export interface CheckboxGroupProps {
  label?: ReactNode | undefined;
  description?: ReactNode | undefined;
  error?: string | boolean | undefined;
  value?: string[] | undefined;
  defaultValue?: string[] | undefined;
  onChange?: ((value: string[]) => void) | undefined;
  size?: Size | undefined;
  color?: SemanticScaleName | undefined;
  disabled?: boolean | undefined;
  required?: boolean | undefined;
  name?: string | undefined;
  orientation?: Orientation | undefined;
  children?: ReactNode | undefined;
}

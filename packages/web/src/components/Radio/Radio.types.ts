import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { Orientation, SemanticScaleName, Size } from "@stellaria/nebula-tokens";

export interface RadioProps
  extends Omit<
    ComponentPropsWithoutRef<"input">,
    "size" | "onChange" | "checked" | "defaultChecked" | "type" | "color" | "disabled"
  > {
  value: string;
  label?: ReactNode | undefined;
  size?: Size | undefined;
  color?: SemanticScaleName | undefined;
  disabled?: boolean | undefined;
  rootClassName?: string | undefined;
}

export interface RadioGroupProps {
  label?: ReactNode | undefined;
  description?: ReactNode | undefined;
  error?: string | boolean | undefined;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  size?: Size | undefined;
  color?: SemanticScaleName | undefined;
  disabled?: boolean | undefined;
  required?: boolean | undefined;
  name?: string | undefined;
  orientation?: Orientation | undefined;
  children?: ReactNode | undefined;
}

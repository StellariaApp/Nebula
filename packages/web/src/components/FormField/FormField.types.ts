import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import type { FieldStatus } from "@stellaria/nebula-tokens";

import type { BoxOwnProps, BoxSlotProps } from "../Box/Box.types.js";
import type { ErrorDisplay, FieldErrorProps } from "../FieldError/FieldError.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export interface FormFieldControlProps {
  id: string;
  "aria-describedby"?: string | undefined;
  "aria-invalid"?: true | undefined;
  "aria-required"?: true | undefined;
}

export interface FormFieldSlotProps {
  labelProps?: TextSlotProps | undefined;
  descriptionProps?: TextSlotProps | undefined;
  requiredProps?: BoxSlotProps | undefined;
  headerProps?: BoxSlotProps | undefined;
  bodyProps?: BoxSlotProps | undefined;
  errorProps?: Omit<FieldErrorProps, "children"> | undefined;
}

export interface FormFieldOwnProps
  extends Omit<BoxOwnProps, "component" | "children">, FormFieldSlotProps {
  component?: ElementType | undefined;
  label?: ReactNode | undefined;
  description?: ReactNode | undefined;
  error?: string | boolean | undefined;
  errorDisplay?: ErrorDisplay | undefined;
  status?: FieldStatus | undefined;
  required?: boolean | undefined;
  id?: string | undefined;
  children?: ReactNode | ((control: FormFieldControlProps) => ReactNode) | undefined;
}

export type FormFieldProps<C extends ElementType = "div"> = FormFieldOwnProps & {
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof FormFieldOwnProps | "component">;

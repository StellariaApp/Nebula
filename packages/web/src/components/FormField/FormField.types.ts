import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import type { BoxOwnProps } from "../Box/Box.types.js";

export interface FormFieldControlProps {
  id: string;
  "aria-describedby"?: string | undefined;
  "aria-invalid"?: true | undefined;
  "aria-required"?: true | undefined;
}

export interface FormFieldOwnProps extends Omit<BoxOwnProps, "component" | "children"> {
  component?: ElementType | undefined;
  label?: ReactNode | undefined;
  description?: ReactNode | undefined;
  error?: string | boolean | undefined;
  required?: boolean | undefined;
  id?: string | undefined;
  children?: ReactNode | ((control: FormFieldControlProps) => ReactNode) | undefined;
}

export type FormFieldProps<C extends ElementType = "div"> = FormFieldOwnProps & {
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof FormFieldOwnProps | "component">;

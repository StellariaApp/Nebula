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

/**
 * The six slots shared by the 27 field components. They travel together so the contract cannot
 * diverge between them: a slot added here is had by all 27 without touching them.
 */
export interface FormFieldSlotProps {
  /** The field label. It lands on the `<label>`, which already carries the control `htmlFor`. */
  labelProps?: TextSlotProps | undefined;
  /** Help text below the label. Only rendered with `description`. */
  descriptionProps?: TextSlotProps | undefined;
  /** The required asterisk, which lives inside the label. Only rendered with `required`. */
  requiredProps?: BoxSlotProps | undefined;
  /** The label and description row. Not rendered when the field has neither. */
  headerProps?: BoxSlotProps | undefined;
  /** Wrapper for the control. */
  bodyProps?: BoxSlotProps | undefined;
  /**
   * Configures the `FieldError`. With `errorDisplay="tooltip"` it spreads whole; with `"text"` there is
   * no `FieldError` to configure — it is a `Text` with `role="alert"` — and only `className` is honoured.
   */
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
  component?: C | undefined;
} & Omit<ComponentPropsWithoutRef<C>, keyof FormFieldOwnProps | "component">;

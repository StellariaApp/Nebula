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
 * Las seis ranuras que comparten los 27 componentes de campo. Viajan juntas para que el contrato no
 * pueda divergir entre ellos: una ranura añadida aqui la tienen los 27 sin tocarlos.
 */
export interface FormFieldSlotProps {
  /** Rotulo del campo. Cae sobre el `<label>`, que ya lleva el `htmlFor` del control. */
  labelProps?: TextSlotProps | undefined;
  /** Texto de ayuda bajo el rotulo. Solo se pinta si hay `description`. */
  descriptionProps?: TextSlotProps | undefined;
  /** El asterisco de obligatorio, que vive dentro del rotulo. Solo se pinta con `required`. */
  requiredProps?: BoxSlotProps | undefined;
  /** Fila de rotulo y descripcion. No se pinta si el campo no tiene ninguno de los dos. */
  headerProps?: BoxSlotProps | undefined;
  /** Envoltorio del control. */
  bodyProps?: BoxSlotProps | undefined;
  /**
   * Configura el `FieldError`. Con `errorDisplay="tooltip"` se esparce entero; con `"text"` no hay
   * `FieldError` que configurar —es un `Text` con `role="alert"`— y solo se honra `className`.
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
  component?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof FormFieldOwnProps | "component">;

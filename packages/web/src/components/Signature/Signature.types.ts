import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { NebulaField, Size } from "@stellaria/nebula-tokens";

import type { ErrorDisplay } from "../FieldError/FieldError.types.js";
import type { StyleProps } from "../../utils/style-props.js";

import type { FormFieldSlotProps } from "../FormField/FormField.types.js";
import type { BoxSlotProps } from "../Box/Box.types.js";

export type SignatureFormat = "png" | "jpeg";

export interface SignatureLabels {
  hint: string;
  signed: string;
  empty: string;
  undo: string;
  clear: string;
}

export interface SignatureProps extends StyleProps, FormFieldSlotProps {
  /**
   * The signature canvas. It carries the pointer handlers of the stroke, so an `onPointerDown` here
   * replaces them; its height is written after the slot, because it comes from `height`.
   */
  canvasProps?: ComponentPropsWithoutRef<"canvas"> | undefined;
  /** The undo and clear row. */
  actionsProps?: BoxSlotProps | undefined;
  label?: ReactNode | undefined;
  description?: ReactNode | undefined;
  error?: string | boolean | undefined;
  errorDisplay?: ErrorDisplay | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  size?: Size | undefined;
  field?: NebulaField<File | null> | undefined;
  value?: File | null | undefined;
  defaultValue?: File | null | undefined;
  onChange?: ((file: File | null) => void) | undefined;
  height?: number | undefined;
  strokeWidth?: number | undefined;
  penColor?: string | undefined;
  format?: SignatureFormat | undefined;
  quality?: number | undefined;
  fileName?: string | undefined;
  labels?: Partial<SignatureLabels> | undefined;
  name?: string | undefined;
  className?: string | undefined;
  rootClassName?: string | undefined;
}

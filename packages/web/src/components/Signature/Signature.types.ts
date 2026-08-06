import type { ReactNode } from "react";

import type { NebulaField, Size } from "@stellaria/nebula-tokens";

import type { ErrorDisplay } from "../FieldError/FieldError.types.js";
import type { StyleProps } from "../../utils/style-props.js";

export type SignatureFormat = "png" | "jpeg";

export interface SignatureLabels {
  hint: string;
  signed: string;
  empty: string;
  undo: string;
  clear: string;
}

export interface SignatureProps extends StyleProps {
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

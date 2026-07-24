import type { ReactNode } from "react";

import type { FieldStatus, NebulaField } from "@stellaria/nebula-tokens";

export type ErrorDisplay = "tooltip" | "text";

export type FieldErrorSource = Pick<NebulaField<unknown>, "status" | "error" | "touched">;

export interface FieldErrorProps {
  children: ReactNode;
  field?: FieldErrorSource | undefined;
  error?: string | boolean | undefined;
  message?: string | undefined;
  status?: FieldStatus | undefined;
  color?: "error" | "info" | undefined;
  position?: "top" | "bottom" | undefined;
  validatingLabel?: string | undefined;
  className?: string | undefined;
}

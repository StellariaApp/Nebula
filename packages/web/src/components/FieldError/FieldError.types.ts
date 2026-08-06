import type { ReactNode } from "react";

import type { FieldStatus, NebulaField } from "@stellaria/nebula-tokens";
import type { StyleProps } from "../../utils/style-props.js";

export type ErrorDisplay = "tooltip" | "text";

export type FieldErrorPosition =
  "top" | "top-left" | "top-right" | "bottom" | "bottom-left" | "bottom-right";

export type FieldErrorSource = Pick<NebulaField<unknown>, "status" | "error" | "touched">;

export interface FieldErrorProps extends Omit<StyleProps, "position"> {
  children: ReactNode;
  field?: FieldErrorSource | undefined;
  error?: string | boolean | undefined;
  message?: string | undefined;
  status?: FieldStatus | undefined;
  color?: "error" | "info" | undefined;
  position?: FieldErrorPosition | undefined;
  offset?: number | undefined;
  validatingLabel?: string | undefined;
  className?: string | undefined;
}

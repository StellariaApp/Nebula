import type { ReactNode } from "react";

import type { FieldStatus, NebulaField } from "@stellaria/nebula-tokens";
import type { StyleProps } from "../../utils/style-props.js";

export type ErrorDisplay = "tooltip" | "text";

export type FieldErrorPosition =
  "top" | "top-left" | "top-right" | "bottom" | "bottom-left" | "bottom-right";

export type FieldErrorSource = Pick<NebulaField<unknown>, "status" | "error" | "touched">;

export interface FieldErrorProps extends Omit<StyleProps, "position"> {
  /** The control being wrapped. The bubble anchors to it, so it cannot be left empty. */
  children: ReactNode;
  /**
   * The short route: a `NebulaField` provides the state, the message and whether it has been touched,
   * all at once. It wins over `error`, `message` and `status`, which exist for when there is no form
   * field behind.
   */
  field?: FieldErrorSource | undefined;
  /** With `true` it marks the control invalid with no text; with a string, that string is the message. */
  error?: string | boolean | undefined;
  /** The bubble text when `error` is `true` and brings no message of its own. */
  message?: string | undefined;
  status?: FieldStatus | undefined;
  color?: "error" | "info" | undefined;
  /** Where the bubble anchors. It shadows the `position` style prop, which does not apply here. */
  position?: FieldErrorPosition | undefined;
  /** Distance between the bubble and the control, in px. */
  offset?: number | undefined;
  /** What it announces while the field is validating. It is read aloud, so it cannot be a symbol. */
  validatingLabel?: string | undefined;
  className?: string | undefined;
}

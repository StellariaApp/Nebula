import type { StyleProps } from "../../utils/style-props.js";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { Orientation, ColorExtended, Size } from "@stellaria/nebula-tokens";

import type { ErrorDisplay } from "../FieldError/FieldError.types.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export interface RadioProps
  extends
    Omit<
      ComponentPropsWithoutRef<"input">,
      "size" | "onChange" | "checked" | "defaultChecked" | "type" | "color" | "disabled"
    >,
    StyleProps {
  value: string;
  label?: ReactNode | undefined;
  size?: Size | undefined;
  color?: ColorExtended | undefined;
  disabled?: boolean | undefined;
  rootClassName?: string | undefined;
  /** Label next to the radio. */
  labelProps?: TextSlotProps | undefined;
  /** The visual circle. The native input is separate. */
  indicatorProps?: BoxSlotProps | undefined;
  /** The inner dot, which appears on selection. */
  markProps?: BoxSlotProps | undefined;
}

export interface RadioGroupProps {
  /** The group is a `fieldset` and this is its `legend`: without it the options have no shared name. */
  label?: ReactNode | undefined;
  description?: ReactNode | undefined;
  error?: string | boolean | undefined;
  /** The `value` of the chosen option. Passing it makes the group controlled and `defaultValue` stops being read. */
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  /** Cascades to every option. One that declares its own wins over the group. */
  size?: Size | undefined;
  /** Cascades to every option. One that declares its own wins over the group. */
  color?: ColorExtended | undefined;
  /** Disables the whole group; an option cannot re-enable itself. */
  disabled?: boolean | undefined;
  required?: boolean | undefined;
  /** The form `name`. It is what makes the options mutually exclusive. */
  name?: string | undefined;
  orientation?: Orientation | undefined;
  /** With `text` the error sits below the group and takes up space; with `tooltip` it floats and does not shift the layout. */
  errorDisplay?: ErrorDisplay | undefined;
  /** The options. The group owns their state, so their own `checked` and `onChange` are redundant. */
  children?: ReactNode | undefined;
}

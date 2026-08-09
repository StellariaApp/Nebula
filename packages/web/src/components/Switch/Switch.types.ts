import type { StyleProps } from "../../utils/style-props.js";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { Orientation, ColorExtended, Size } from "@stellaria/nebula-tokens";

import type { ErrorDisplay } from "../FieldError/FieldError.types.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export interface SwitchProps
  extends
    Omit<
      ComponentPropsWithoutRef<"input">,
      "size" | "onChange" | "checked" | "defaultChecked" | "type" | "color" | "disabled"
    >,
    StyleProps {
  label?: ReactNode | undefined;
  size?: Size | undefined;
  color?: ColorExtended | undefined;
  checked?: boolean | undefined;
  defaultChecked?: boolean | undefined;
  onChange?: ((checked: boolean) => void) | undefined;
  value?: string | undefined;
  disabled?: boolean | undefined;
  draggable?: boolean | undefined;
  rootClassName?: string | undefined;
  /** Label next to the switch. */
  labelProps?: TextSlotProps | undefined;
  /** The track. The thumb is NOT exposed: motion moves it with a computed style. */
  indicatorProps?: BoxSlotProps | undefined;
}

export interface SwitchGroupProps {
  /** The group is a `fieldset` and this is its `legend`: without it the switches have no shared name. */
  label?: ReactNode | undefined;
  description?: ReactNode | undefined;
  error?: string | boolean | undefined;
  /** The `value` of each switch that is on. Passing it makes the group controlled and `defaultValue` stops being read. */
  value?: string[] | undefined;
  defaultValue?: string[] | undefined;
  onChange?: ((value: string[]) => void) | undefined;
  /** Cascades to every switch. One that declares its own wins over the group. */
  size?: Size | undefined;
  /** Cascades to every switch. One that declares its own wins over the group. */
  color?: ColorExtended | undefined;
  /** Disables the whole group; a switch cannot re-enable itself. */
  disabled?: boolean | undefined;
  /** The form `name`. Every switch in the group shares it. */
  name?: string | undefined;
  orientation?: Orientation | undefined;
  /** With `text` the error sits below the group and takes up space; with `tooltip` it floats and does not shift the layout. */
  errorDisplay?: ErrorDisplay | undefined;
  /** The switches. The group owns their state, so their own `checked` and `onChange` are redundant. */
  children?: ReactNode | undefined;
}

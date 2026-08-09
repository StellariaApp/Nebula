import type { StyleProps } from "../../utils/style-props.js";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { Orientation, ColorExtended, Size } from "@stellaria/nebula-tokens";

import type { ErrorDisplay } from "../FieldError/FieldError.types.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";
import type { GlyphProps } from "../../glyphs/index.js";

export interface CheckboxProps
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
  indeterminate?: boolean | undefined;
  value?: string | undefined;
  disabled?: boolean | undefined;
  error?: boolean | undefined;
  rootClassName?: string | undefined;
  /** Label next to the box. */
  labelProps?: TextSlotProps | undefined;
  /** The visual box. The native input is separate and still receives `className`. */
  indicatorProps?: BoxSlotProps | undefined;
  /** The mark inside: a tick, or a dash when indeterminate. */
  markProps?: GlyphProps | undefined;
}

export interface CheckboxGroupProps {
  /** The group is a `fieldset` and this is its `legend`: without it the boxes have no shared name. */
  label?: ReactNode | undefined;
  description?: ReactNode | undefined;
  error?: string | boolean | undefined;
  /** The `value` of each checked box. Passing it makes the group controlled and `defaultValue` stops being read. */
  value?: string[] | undefined;
  defaultValue?: string[] | undefined;
  onChange?: ((value: string[]) => void) | undefined;
  /** Cascades to every box. One that declares its own wins over the group. */
  size?: Size | undefined;
  /** Cascades to every box. One that declares its own wins over the group. */
  color?: ColorExtended | undefined;
  /** Disables the whole group; a box cannot re-enable itself. */
  disabled?: boolean | undefined;
  required?: boolean | undefined;
  /** The form `name`. Every box in the group shares it. */
  name?: string | undefined;
  orientation?: Orientation | undefined;
  /** With `text` the error sits below the group and takes up space; with `tooltip` it floats and does not shift the layout. */
  errorDisplay?: ErrorDisplay | undefined;
  /** The boxes. The group owns their state, so their own `checked` and `onChange` are redundant. */
  children?: ReactNode | undefined;
}

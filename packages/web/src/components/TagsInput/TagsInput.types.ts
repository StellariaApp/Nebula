import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { NebulaField, Size } from "@stellaria/nebula-tokens";

import type { ErrorDisplay } from "../FieldError/FieldError.types.js";
import type { FieldSurface } from "../../styles/field-surface.js";
import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { ButtonCloseProps } from "../ButtonClose/ButtonClose.types.js";
import type { FormFieldSlotProps } from "../FormField/FormField.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export interface TagsInputProps extends StyleProps, FormFieldSlotProps {
  /** Every tag added. It spreads over ALL of them; they carry `data-disabled`. */
  tagProps?: BoxSlotProps | undefined;
  /** The label of each tag. */
  tagLabelProps?: TextSlotProps | undefined;
  /** The cross that removes each tag. Not rendered when the field is read-only or disabled. */
  removeProps?: ButtonCloseProps | undefined;
  /**
   * The text field. It spreads AFTER the component keyboard handler, so an `onKeyDown` here takes out
   * add-on-Enter and backspace-to-remove.
   */
  inputProps?: ComponentPropsWithoutRef<"input"> | undefined;
  label?: ReactNode | undefined;
  description?: ReactNode | undefined;
  error?: string | boolean | undefined;
  errorDisplay?: ErrorDisplay | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  readOnly?: boolean | undefined;
  size?: Size | undefined;
  surface?: FieldSurface | undefined;
  placeholder?: string | undefined;
  maxTags?: number | undefined;
  allowDuplicates?: boolean | undefined;
  /** @default [","] */
  splitChars?: readonly string[] | undefined;
  clearable?: boolean | undefined;
  field?: NebulaField<string[]> | undefined;
  value?: readonly string[] | undefined;
  defaultValue?: readonly string[] | undefined;
  onChange?: ((value: string[]) => void) | undefined;
  validate?: ((tag: string) => boolean) | undefined;
  removeLabel?: ((tag: string) => string) | undefined;
  name?: string | undefined;
  className?: string | undefined;
  rootClassName?: string | undefined;
}

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
  /** Cada etiqueta puesta. Se esparce sobre TODAS; llevan `data-disabled`. */
  tagProps?: BoxSlotProps | undefined;
  /** El rótulo de cada etiqueta. */
  tagLabelProps?: TextSlotProps | undefined;
  /** El aspa que quita cada etiqueta. No se pinta si el campo es de solo lectura. */
  removeProps?: ButtonCloseProps | undefined;
  /**
   * El campo de texto. Se esparce DESPUÉS del manejador de teclado propio, así que un `onKeyDown`
   * aquí se lleva por delante el alta con Enter y el borrado con retroceso.
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

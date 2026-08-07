import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { NebulaField, Size } from "@stellaria/nebula-tokens";

import type { RenderOption, SelectOption } from "../../collections/options.js";
import type { ErrorDisplay } from "../FieldError/FieldError.types.js";
import type { PopoverPlacement } from "../Popover/Popover.types.js";
import type { FieldSurface } from "../../styles/field-surface.js";
import type { StyleProps } from "../../utils/style-props.js";

import type { FormFieldSlotProps } from "../FormField/FormField.types.js";

import type { BoxSlotProps } from "../Box/Box.types.js";

export interface SelectProps extends StyleProps, FormFieldSlotProps {
  data: readonly SelectOption[];
  label?: ReactNode | undefined;
  description?: ReactNode | undefined;
  placeholder?: string | undefined;
  error?: string | boolean | undefined;
  errorDisplay?: ErrorDisplay | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  size?: Size | undefined;
  surface?: FieldSurface | undefined;
  field?: NebulaField<string> | undefined;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  renderOption?: RenderOption | undefined;
  placement?: PopoverPlacement | undefined;
  maxDropdownHeight?: number | undefined;
  emptyLabel?: string | undefined;
  className?: string | undefined;
  /** El boton que abre la lista. */
  triggerProps?: ComponentPropsWithoutRef<"button"> | undefined;
  /** El valor mostrado en el boton. Lleva el estilo de marcador cuando no hay seleccion. */
  valueProps?: BoxSlotProps | undefined;
  /** El chevron. Lleva `data-open`, que es de donde sale su giro. */
  chevronProps?: BoxSlotProps | undefined;
  /** El desplegable. Su ancho se calcula del disparador; la ranura se compone, no lo pisa. */
  dropdownProps?: BoxSlotProps | undefined;
  rootClassName?: string | undefined;
  name?: string | undefined;
}

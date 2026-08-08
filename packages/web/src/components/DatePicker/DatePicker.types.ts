import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { DateRange, NebulaField, Size } from "@stellaria/nebula-tokens";

import type { CalendarLabels } from "../Calendar/Calendar.types.js";
import type { ErrorDisplay } from "../FieldError/FieldError.types.js";
import type { PopoverPlacement } from "../Popover/Popover.types.js";
import type { FieldSurface } from "../../styles/field-surface.js";
import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { FormFieldSlotProps } from "../FormField/FormField.types.js";

export type DateGranularity = "day" | "hour" | "minute" | "second";

export interface DatePickerBaseProps extends StyleProps {
  /**
   * El botón que abre el calendario. En `DatePicker` y `DateRangePicker` es el icono del extremo;
   * en `DatePickerInput` es el campo entero, que ahí es un botón y no un campo segmentado.
   */
  triggerProps?: ComponentPropsWithoutRef<"button"> | undefined;
  /**
   * La superficie flotante del calendario. Su posición la calcula React Aria, así que su `style` va
   * después de la ranura y no se puede pisar; el resto sí.
   */
  popoverProps?: BoxSlotProps | undefined;
  label?: ReactNode | undefined;
  description?: ReactNode | undefined;
  error?: string | boolean | undefined;
  errorDisplay?: ErrorDisplay | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  readOnly?: boolean | undefined;
  size?: Size | undefined;
  surface?: FieldSurface | undefined;
  locale?: string | undefined;
  minValue?: string | undefined;
  maxValue?: string | undefined;
  placement?: PopoverPlacement | undefined;
  visibleMonths?: number | undefined;
  labels?: CalendarLabels | undefined;
  openLabel?: string | undefined;
  name?: string | undefined;
  className?: string | undefined;
  rootClassName?: string | undefined;
}

export interface DatePickerProps extends DatePickerBaseProps, FormFieldSlotProps {
  field?: NebulaField<string> | undefined;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  granularity?: DateGranularity | undefined;
  isDateUnavailable?: ((value: string) => boolean) | undefined;
}

export interface DatePickerInputProps extends DatePickerBaseProps, FormFieldSlotProps {
  field?: NebulaField<string> | undefined;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  placeholder?: string | undefined;
  format?: Intl.DateTimeFormatOptions | undefined;
  isDateUnavailable?: ((value: string) => boolean) | undefined;
}

export interface DateRangePickerProps extends DatePickerBaseProps, FormFieldSlotProps {
  /** El guion que separa las dos fechas. Es decorativo: va con `aria-hidden`. */
  separatorProps?: BoxSlotProps | undefined;
  field?: NebulaField<DateRange> | undefined;
  value?: DateRange | undefined;
  defaultValue?: DateRange | undefined;
  onChange?: ((value: DateRange) => void) | undefined;
  isDateUnavailable?: ((value: string) => boolean) | undefined;
}

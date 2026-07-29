import type { ReactNode } from "react";

import type { DateRange, NebulaField, Size } from "@stellaria/nebula-tokens";

import type { CalendarLabels } from "../Calendar/Calendar.types.js";
import type { ErrorDisplay } from "../FieldError/FieldError.types.js";
import type { PopoverPlacement } from "../Popover/Popover.types.js";
import type { FieldSurface } from "../../styles/field-surface.js";
import type { StyleProps } from "../../utils/style-props.js";

export type DateGranularity = "day" | "hour" | "minute" | "second";

export interface DatePickerBaseProps extends StyleProps {
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

export interface DatePickerProps extends DatePickerBaseProps {
  field?: NebulaField<string> | undefined;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  granularity?: DateGranularity | undefined;
  isDateUnavailable?: ((value: string) => boolean) | undefined;
}

export interface DatePickerInputProps extends DatePickerBaseProps {
  field?: NebulaField<string> | undefined;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  placeholder?: string | undefined;
  format?: Intl.DateTimeFormatOptions | undefined;
  isDateUnavailable?: ((value: string) => boolean) | undefined;
}

export interface DateRangePickerProps extends DatePickerBaseProps {
  field?: NebulaField<DateRange> | undefined;
  value?: DateRange | undefined;
  defaultValue?: DateRange | undefined;
  onChange?: ((value: DateRange) => void) | undefined;
  isDateUnavailable?: ((value: string) => boolean) | undefined;
}

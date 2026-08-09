import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { ColorExtended, DateRange, NebulaField, Size } from "@stellaria/nebula-tokens";

import type { CalendarLabels, CalendarVariant } from "../Calendar/Calendar.types.js";
import type { ErrorDisplay } from "../FieldError/FieldError.types.js";
import type { PopoverPlacement } from "../Popover/Popover.types.js";
import type { FieldSurface } from "../../styles/field-surface.js";
import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { OverlayMotionSlotProps } from "../../overlays/overlay-motion.js";
import type { FormFieldSlotProps } from "../FormField/FormField.types.js";

export type DateGranularity = "day" | "hour" | "minute" | "second";

export interface DatePickerBaseProps extends StyleProps {
  /**
   * The button that opens the calendar. In `DatePicker` and `DateRangePicker` it is the icon at the
   * end; in `DatePickerInput` it is the whole field, which there is a button and not a segmented field.
   */
  triggerProps?: ComponentPropsWithoutRef<"button"> | undefined;
  /**
   * The floating surface of the calendar, which is the motion wrapper and does not go through `Box`:
   * it does not accept style props. React Aria computes its position and writes it after the slot;
   * the `style` you pass composes with it.
   */
  popoverProps?: OverlayMotionSlotProps | undefined;
  /**
   * The recipe used to tint the chosen day in the calendar. It is the same one `Calendar` accepts:
   * without it the calendar in the dropdown stayed pinned to `primary`, even when the product had a
   * different accent.
   */
  variant?: CalendarVariant | undefined;
  /** Accent of the chosen day and of the range. It goes with `variant`. */
  color?: ColorExtended | undefined;
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
  /** The dash between the two dates. Decorative: it is `aria-hidden`. */
  separatorProps?: BoxSlotProps | undefined;
  field?: NebulaField<DateRange> | undefined;
  value?: DateRange | undefined;
  defaultValue?: DateRange | undefined;
  onChange?: ((value: DateRange) => void) | undefined;
  isDateUnavailable?: ((value: string) => boolean) | undefined;
}

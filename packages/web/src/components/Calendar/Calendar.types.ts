import type { ReactNode } from "react";

import type {
  ColorExtended,
  DateRange,
  NebulaField,
  Size,
  Variant,
} from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";

export type CalendarVariant = Extract<Variant, "filled" | "outline" | "light" | "ghost">;

export interface CalendarLabels {
  previousMonth?: string | undefined;
  nextMonth?: string | undefined;
}

interface CalendarBaseProps extends Omit<StyleProps, "color"> {
  label?: ReactNode | undefined;
  size?: Size | undefined;
  variant?: CalendarVariant | undefined;
  color?: ColorExtended | undefined;
  locale?: string | undefined;
  minValue?: string | undefined;
  maxValue?: string | undefined;
  disabled?: boolean | undefined;
  readOnly?: boolean | undefined;
  autoFocus?: boolean | undefined;
  visibleMonths?: number | undefined;
  labels?: CalendarLabels | undefined;
  className?: string | undefined;
}

export interface CalendarProps extends CalendarBaseProps {
  field?: NebulaField<string> | undefined;
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  isDateUnavailable?: ((value: string) => boolean) | undefined;
}

export interface RangeCalendarProps extends CalendarBaseProps {
  field?: NebulaField<DateRange> | undefined;
  value?: DateRange | undefined;
  defaultValue?: DateRange | undefined;
  onChange?: ((value: DateRange) => void) | undefined;
  isDateUnavailable?: ((value: string) => boolean) | undefined;
}

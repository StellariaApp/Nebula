"use client";

import { useMemo, type ReactElement } from "react";

import type { CalendarDate, DateValue } from "@internationalized/date";
import { useFieldProps } from "@stellaria/nebula-hooks";
import type { DateRange } from "@stellaria/nebula-tokens";
import type { AriaRangeCalendarProps } from "react-aria";

import { EmptyRange, FormatDate, ParseDate } from "../../utils/date.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import { RangeCalendarView } from "./CalendarView.js";
import type { RangeCalendarProps } from "./Calendar.types.js";

export function RangeCalendar(props: RangeCalendarProps): ReactElement {
  const {
    label,
    size = "md",
    locale,
    minValue,
    maxValue,
    disabled = false,
    readOnly = false,
    autoFocus = false,
    visibleMonths = 1,
    labels,
    field: nebula_field,
    value,
    defaultValue,
    onChange,
    isDateUnavailable,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const fp = useFieldProps<DateRange>({
    field: nebula_field,
    value,
    defaultValue: defaultValue ?? EmptyRange(),
    onChange,
    disabled,
  });

  const start = useMemo(() => ParseDate(fp.value.start), [fp.value.start]);
  const end = useMemo(() => ParseDate(fp.value.end), [fp.value.end]);
  const min = useMemo(() => ParseDate(minValue), [minValue]);
  const max = useMemo(() => ParseDate(maxValue), [maxValue]);
  const range = useMemo(
    () => (start === null || end === null ? null : { start, end }),
    [start, end],
  );

  const calendar: AriaRangeCalendarProps<DateValue> = {
    value: range,
    onChange: (next) => {
      fp.onChange({
        start: FormatDate(next.start as CalendarDate),
        end: FormatDate(next.end as CalendarDate),
      });
    },
    isDisabled: fp.isDisabled,
    isReadOnly: readOnly,
    autoFocus,
    ...(min === null ? {} : { minValue: min }),
    ...(max === null ? {} : { maxValue: max }),
    ...(typeof label === "string" ? { "aria-label": label } : {}),
    ...(isDateUnavailable === undefined
      ? {}
      : { isDateUnavailable: (date: DateValue) => isDateUnavailable(FormatDate(date as CalendarDate)) }),
  };

  return (
    <RangeCalendarView
      calendar={calendar}
      size={size}
      locale={locale}
      labels={labels}
      visibleMonths={visibleMonths}
      className={cx(sprinkle_class, className)}
      style={sprinkle_style}
    />
  );
}

RangeCalendar.displayName = "RangeCalendar";

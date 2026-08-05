"use client";

import { useMemo, type ReactElement } from "react";

import type { CalendarDate, DateValue } from "@internationalized/date";
import { useFieldProps, useTheme } from "@stellaria/nebula-hooks";
import type { DateRange } from "@stellaria/nebula-tokens";
import type { AriaRangeCalendarProps } from "react-aria";

import { EmptyRange, FormatDate, ParseDate } from "../../utils/date.js";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant } from "../../theme/resolve-variant.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import { RangeCalendarView } from "./CalendarView.js";
import type { RangeCalendarProps } from "./Calendar.types.js";
import * as variables from "./Calendar.vars.css.js";

export function RangeCalendar(props: RangeCalendarProps): ReactElement {
  const {
    label,
    size = "md",
    variant = "filled",
    color = "primary",
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
      : {
          isDateUnavailable: (date: DateValue) =>
            isDateUnavailable(FormatDate(date as CalendarDate)),
        }),
  };

  const { theme } = useTheme();
  const resolved = ResolveVariant(variant, color, theme);
  const day_vars = assignInlineVars({
    [variables.dayBg]: resolved.background,
    [variables.dayBgHover]: resolved.backgroundHover,
    [variables.dayFg]: resolved.foreground,
    [variables.dayBorder]: resolved.borderColor,
    [variables.rangeBg]: `color-mix(in srgb, ${resolved.background} 16%, transparent)`,
  });

  return (
    <RangeCalendarView
      calendar={calendar}
      size={size}
      locale={locale}
      labels={labels}
      visibleMonths={visibleMonths}
      className={cx(sprinkle_class, className)}
      style={{ ...day_vars, ...sprinkle_style }}
    />
  );
}

RangeCalendar.displayName = "RangeCalendar";

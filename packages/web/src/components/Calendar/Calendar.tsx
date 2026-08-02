"use client";

import { useMemo, type ReactElement } from "react";

import type { CalendarDate, DateValue } from "@internationalized/date";
import { useFieldProps, useTheme } from "@stellaria/nebula-hooks";
import type { AriaCalendarProps } from "react-aria";

import { FormatDate, ParseDate } from "../../utils/date.js";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant } from "../../theme/resolve-variant.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import { CalendarView } from "./CalendarView.js";
import type { CalendarProps } from "./Calendar.types.js";
import { dayBg, dayBorder, dayFg, rangeBg } from "./Calendar.vars.css.js";

export function Calendar(props: CalendarProps): ReactElement {
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
    defaultValue = "",
    onChange,
    isDateUnavailable,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const fp = useFieldProps<string>({
    field: nebula_field,
    value,
    defaultValue,
    onChange,
    disabled,
  });

  const min = useMemo(() => ParseDate(minValue), [minValue]);
  const max = useMemo(() => ParseDate(maxValue), [maxValue]);
  const parsed = useMemo(() => ParseDate(fp.value), [fp.value]);

  const calendar: AriaCalendarProps<DateValue> = {
    value: parsed,
    onChange: (next) => {
      fp.onChange(FormatDate(next as CalendarDate));
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
    [dayBg]: resolved.background,
    [dayFg]: resolved.foreground,
    [dayBorder]: resolved.borderColor,
    [rangeBg]: `color-mix(in srgb, ${resolved.background} 16%, transparent)`,
  });

  return (
    <CalendarView
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

Calendar.displayName = "Calendar";

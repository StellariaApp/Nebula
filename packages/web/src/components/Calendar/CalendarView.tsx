"use client";

import { useRef, type CSSProperties, type ReactElement } from "react";

import { createCalendar } from "@internationalized/date";
import type { DateValue } from "@internationalized/date";
import { useCalendar, useLocale, useRangeCalendar } from "react-aria";
import type { AriaCalendarProps, AriaRangeCalendarProps } from "react-aria";
import { useCalendarState, useRangeCalendarState } from "react-stately";

import type { Size } from "@stellaria/nebula-tokens";

import { cx } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";

import { CalendarGrid } from "./CalendarGrid.js";
import { CalendarHeader } from "./CalendarHeader.js";
import * as styles from "./Calendar.css.js";
import type { CalendarLabels, CalendarSlotProps } from "./Calendar.types.js";

interface ViewShellProps {
  size: Size;
  locale?: string | undefined;
  labels?: CalendarLabels | undefined;
  visibleMonths?: number | undefined;
  className?: string | undefined;
  style?: CSSProperties | undefined;
  slots?: CalendarSlotProps | undefined;
}

export interface CalendarViewProps extends ViewShellProps {
  calendar: AriaCalendarProps<DateValue>;
}

export function CalendarView(props: CalendarViewProps): ReactElement {
  const {
    calendar,
    size,
    locale: locale_prop,
    labels,
    visibleMonths = 1,
    className,
    style,
    slots,
  } = props;

  const { locale: ambient } = useLocale();
  const locale = locale_prop ?? ambient;
  const months = Math.max(1, visibleMonths);

  const state = useCalendarState({
    ...calendar,
    locale,
    createCalendar,
    visibleDuration: { months },
  });

  const { calendarProps, prevButtonProps, nextButtonProps, title } = useCalendar(calendar, state);

  return (
    <div {...calendarProps} className={cx(styles.root, className)} style={style}>
      <CalendarHeader
        title={title}
        size={size}
        prevButtonProps={prevButtonProps}
        nextButtonProps={nextButtonProps}
        labels={labels}
        slots={slots}
      />
      <Box {...slots?.monthsProps} className={cx(styles.months, slots?.monthsProps?.className)}>
        {[...new Array(months).keys()].map((offset) => (
          <CalendarGrid
            key={offset}
            state={state}
            offset={offset}
            size={size}
            locale={locale}
            slots={slots}
          />
        ))}
      </Box>
    </div>
  );
}

CalendarView.displayName = "CalendarView";

export interface RangeCalendarViewProps extends ViewShellProps {
  calendar: AriaRangeCalendarProps<DateValue>;
}

export function RangeCalendarView(props: RangeCalendarViewProps): ReactElement {
  const {
    calendar,
    size,
    locale: locale_prop,
    labels,
    visibleMonths = 1,
    className,
    style,
    slots,
  } = props;

  const { locale: ambient } = useLocale();
  const locale = locale_prop ?? ambient;
  const months = Math.max(1, visibleMonths);
  const ref = useRef<HTMLDivElement>(null);

  const state = useRangeCalendarState({
    ...calendar,
    locale,
    createCalendar,
    visibleDuration: { months },
  });

  const { calendarProps, prevButtonProps, nextButtonProps, title } = useRangeCalendar(
    calendar,
    state,
    ref,
  );

  return (
    <div {...calendarProps} ref={ref} className={cx(styles.root, className)} style={style}>
      <CalendarHeader
        title={title}
        size={size}
        prevButtonProps={prevButtonProps}
        nextButtonProps={nextButtonProps}
        labels={labels}
        slots={slots}
      />
      <Box {...slots?.monthsProps} className={cx(styles.months, slots?.monthsProps?.className)}>
        {[...new Array(months).keys()].map((offset) => (
          <CalendarGrid
            key={offset}
            state={state}
            offset={offset}
            size={size}
            locale={locale}
            slots={slots}
          />
        ))}
      </Box>
    </div>
  );
}

RangeCalendarView.displayName = "RangeCalendarView";

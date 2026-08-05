"use client";

import { useRef, type ReactElement } from "react";

import {
  getLocalTimeZone,
  getWeeksInMonth,
  isSameDay,
  isToday,
  type CalendarDate,
} from "@internationalized/date";
import { mergeProps, useCalendarCell, useCalendarGrid, useFocusRing, useHover } from "react-aria";
import type { CalendarState, RangeCalendarState } from "react-stately";

import type { Size } from "@stellaria/nebula-tokens";

import { cx } from "../../utils/style-props.js";

import * as styles from "./Calendar.css.js";

type AnyCalendarState = CalendarState | RangeCalendarState;

function HighlightedRange(
  state: AnyCalendarState,
): { start: CalendarDate; end: CalendarDate } | null {
  if (!("highlightedRange" in state)) return null;
  const range = state.highlightedRange;
  if (range === null || range === undefined) return null;
  return { start: range.start, end: range.end };
}

interface CellProps {
  date: CalendarDate;
  currentMonth: CalendarDate;
  state: AnyCalendarState;
  size: Size;
}

function Cell(props: CellProps): ReactElement {
  const { date, currentMonth, state, size } = props;
  const ref = useRef<HTMLDivElement>(null);

  const {
    cellProps,
    buttonProps,
    isSelected,
    isDisabled,
    isUnavailable,
    isOutsideVisibleRange,
    isPressed,
    formattedDate,
  } = useCalendarCell({ date }, state, ref);

  const { focusProps, isFocusVisible } = useFocusRing();
  const { hoverProps, isHovered } = useHover({ isDisabled });

  const outside = isOutsideVisibleRange || date.month !== currentMonth.month;
  if (outside) return <td className={styles.cell_wrapper} />;

  const range = HighlightedRange(state);
  const in_range = range !== null && date.compare(range.start) >= 0 && date.compare(range.end) <= 0;
  const is_edge = range !== null && (isSameDay(date, range.start) || isSameDay(date, range.end));

  return (
    <td
      {...cellProps}
      className={styles.cell_wrapper}
      data-range-selected={in_range ? "true" : undefined}
      data-range-start={range !== null && isSameDay(date, range.start) ? "true" : undefined}
      data-range-end={range !== null && isSameDay(date, range.end) ? "true" : undefined}
    >
      <div
        {...mergeProps(buttonProps, focusProps, hoverProps)}
        ref={ref}
        className={cx(styles.cell, styles.cell_size[size])}
        data-selected={isSelected ? "true" : undefined}
        data-range-middle={in_range && !is_edge ? "true" : undefined}
        data-hovered={isHovered ? "true" : undefined}
        data-disabled={isDisabled ? "true" : undefined}
        data-unavailable={isUnavailable ? "true" : undefined}
        data-today={isToday(date, getLocalTimeZone()) ? "true" : undefined}
        data-focus-visible={isFocusVisible ? "true" : undefined}
        data-pressed={isPressed ? "true" : undefined}
      >
        {formattedDate}
      </div>
    </td>
  );
}

export interface CalendarGridProps {
  state: AnyCalendarState;
  offset?: number | undefined;
  size: Size;
  locale: string;
}

export function CalendarGrid(props: CalendarGridProps): ReactElement {
  const { state, offset = 0, size, locale } = props;
  const start_date = state.visibleRange.start.add({ months: offset });

  const { gridProps, headerProps, weekDays } = useCalendarGrid(
    { startDate: start_date, endDate: start_date.add({ months: 1 }).subtract({ days: 1 }) },
    state,
  );

  const weeks = getWeeksInMonth(start_date, locale);

  return (
    <table {...gridProps} className={styles.grid} cellPadding={0}>
      <thead {...headerProps}>
        <tr>
          {weekDays.map((day, index) => (
            <th key={`${day}-${String(index)}`} className={styles.weekday} scope="col">
              <span aria-hidden="true">{day}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...new Array(weeks).keys()].map((week) => (
          <tr key={week}>
            {state
              .getDatesInWeek(week, start_date)
              .map((date, index) =>
                date === null ? (
                  <td key={index} />
                ) : (
                  <Cell
                    key={date.toString()}
                    date={date}
                    currentMonth={start_date}
                    state={state}
                    size={size}
                  />
                ),
              )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

CalendarGrid.displayName = "CalendarGrid";

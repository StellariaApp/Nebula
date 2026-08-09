"use client";

import { useMemo, useRef, type ReactElement } from "react";

import { createCalendar } from "@internationalized/date";
import type { CalendarDate, DateValue } from "@internationalized/date";
import { useFieldProps, useTheme } from "@stellaria/nebula-hooks";
import type { DateRange } from "@stellaria/nebula-tokens";
import {
  mergeProps,
  useButton,
  useDateField,
  useDateRangePicker,
  useFocusRing,
  useLocale,
} from "react-aria";
import { useDateFieldState, useDateRangePickerState } from "react-stately";

import { DateSegments } from "../../fields/date-segments.js";
import * as field from "../../styles/field.css.js";
import { EmptyRange, FormatDate, ParseDate } from "../../utils/date.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";
import { CalendarDayVars } from "../Calendar/day-vars.js";
import { RangeCalendarView } from "../Calendar/CalendarView.js";
import { CALENDAR_ICON } from "../DatePicker/calendar-icon.js";
import { DatePickerPopover } from "../DatePicker/DatePickerPopover.js";
import * as styles from "../DatePicker/DatePicker.css.js";
import { FormField } from "../FormField/FormField.js";
import type { DateRangePickerProps } from "../DatePicker/DatePicker.types.js";

export function DateRangePicker(props: DateRangePickerProps): ReactElement {
  const {
    label,
    description,
    error,
    errorDisplay = "tooltip",
    required = false,
    disabled = false,
    readOnly = false,
    size = "md",
    surface = "outline",
    variant = "filled",
    color = "primary",
    locale: locale_prop,
    minValue,
    maxValue,
    placement = "bottom start",
    visibleMonths = 2,
    labels,
    openLabel = "Open calendar",
    field: nebula_field,
    value,
    defaultValue,
    onChange,
    isDateUnavailable,
    name,
    className,
    rootClassName,
    triggerProps,
    popoverProps,
    separatorProps,
    labelProps,
    descriptionProps,
    requiredProps,
    headerProps,
    bodyProps,
    errorProps,
    ...style_rest
  } = props;
  const field_slots = {
    labelProps,
    descriptionProps,
    requiredProps,
    headerProps,
    bodyProps,
    errorProps,
  };
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const { theme } = useTheme();
  const day_vars = CalendarDayVars(variant, color, theme);

  const { locale: ambient } = useLocale();
  const locale = locale_prop ?? ambient;

  const fp = useFieldProps<DateRange>({
    field: nebula_field,
    value,
    defaultValue: defaultValue ?? EmptyRange(),
    onChange,
    error,
    disabled,
    required,
  });

  const start = useMemo(() => ParseDate(fp.value.start), [fp.value.start]);
  const end = useMemo(() => ParseDate(fp.value.end), [fp.value.end]);
  const min = useMemo(() => ParseDate(minValue), [minValue]);
  const max = useMemo(() => ParseDate(maxValue), [maxValue]);
  const range = useMemo(
    () => (start === null || end === null ? null : { start, end }),
    [start, end],
  );

  const state = useDateRangePickerState({
    value: range,
    onChange: (next) => {
      if (next === null) {
        fp.onChange(EmptyRange());
        return;
      }
      fp.onChange({
        start: FormatDate(next.start),
        end: FormatDate(next.end),
      });
    },
    isDisabled: fp.isDisabled,
    isReadOnly: readOnly,
    isRequired: required,
    granularity: "day",
    shouldCloseOnSelect: true,
  });

  const group_ref = useRef<HTMLDivElement>(null);
  const trigger_ref = useRef<HTMLButtonElement>(null);
  const start_ref = useRef<HTMLDivElement>(null);
  const end_ref = useRef<HTMLDivElement>(null);

  const { groupProps, startFieldProps, endFieldProps, buttonProps, dialogProps, calendarProps } =
    useDateRangePicker(
      {
        isDisabled: fp.isDisabled,
        isReadOnly: readOnly,
        isRequired: required,
        granularity: "day",
        ...(min === null ? {} : { minValue: min }),
        ...(max === null ? {} : { maxValue: max }),
        ...(typeof label === "string" ? { "aria-label": label } : {}),
        ...(isDateUnavailable === undefined
          ? {}
          : {
              isDateUnavailable: (date: DateValue) =>
                isDateUnavailable(FormatDate(date as CalendarDate)),
            }),
      },
      state,
      group_ref,
    );

  const start_state = useDateFieldState({ ...startFieldProps, locale, createCalendar });
  const end_state = useDateFieldState({ ...endFieldProps, locale, createCalendar });
  const { fieldProps: start_group } = useDateField(startFieldProps, start_state, start_ref);
  const { fieldProps: end_group } = useDateField(endFieldProps, end_state, end_ref);

  const { buttonProps: dom_button } = useButton(buttonProps, trigger_ref);
  const { focusProps, isFocusVisible } = useFocusRing();

  const form_error = fp.errorMessage ?? (fp.isInvalid ? true : undefined);

  return (
    <FormField
      {...field_slots}
      label={label}
      description={description}
      error={form_error}
      errorDisplay={errorDisplay}
      status={fp.status}
      required={required}
      className={cx(sprinkle_class, rootClassName)}
      style={sprinkle_style}
    >
      {({ "aria-required": _required, id, ...control }) => (
        <div
          className={field.field({ size, surface })}
          data-invalid={fp.isInvalid ? "true" : undefined}
          data-disabled={fp.isDisabled ? "true" : undefined}
        >
          {name === undefined ? null : (
            <>
              <input type="hidden" name={`${name}.start`} value={fp.value.start} />
              <input type="hidden" name={`${name}.end`} value={fp.value.end} />
            </>
          )}
          <div {...groupProps} {...control} ref={group_ref} className={styles.group}>
            <DateSegments
              state={start_state}
              fieldProps={{ ...start_group, id }}
              fieldRef={start_ref}
              className={cx(className)}
            />
            <Box
              component="span"
              aria-hidden="true"
              {...separatorProps}
              className={cx(styles.range_separator, separatorProps?.className)}
            >
              –
            </Box>
            <DateSegments state={end_state} fieldProps={end_group} fieldRef={end_ref} />
          </div>
          <button
            {...mergeProps(dom_button, focusProps)}
            ref={trigger_ref}
            id={`${id}-trigger`}
            type="button"
            aria-label={openLabel}
            aria-labelledby={label === undefined ? undefined : `${id}-label ${id}-trigger`}
            disabled={fp.isDisabled}
            data-focus-visible={isFocusVisible ? "true" : undefined}
            {...triggerProps}
            className={cx(styles.trigger, triggerProps?.className)}
          >
            {CALENDAR_ICON}
          </button>
          <DatePickerPopover
            state={state}
            triggerRef={group_ref}
            dialogProps={dialogProps}
            placement={placement}
            slotProps={popoverProps}
          >
            <RangeCalendarView
              style={day_vars}
              calendar={calendarProps}
              size={size}
              locale={locale}
              labels={labels}
              visibleMonths={visibleMonths}
            />
          </DatePickerPopover>
        </div>
      )}
    </FormField>
  );
}

DateRangePicker.displayName = "DateRangePicker";

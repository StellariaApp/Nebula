"use client";

import { useMemo, useRef, type ReactElement } from "react";

import { createCalendar } from "@internationalized/date";
import type { CalendarDate, CalendarDateTime, DateValue } from "@internationalized/date";
import { useFieldProps } from "@stellaria/nebula-hooks";
import { mergeProps, useButton, useDateField, useDatePicker, useFocusRing, useLocale } from "react-aria";
import { useDateFieldState, useDatePickerState } from "react-stately";

import { DateSegments } from "../../fields/date-segments.js";
import * as field from "../../styles/field.css.js";
import { FormatDate, FormatDateTime, ParseDate, ParseDateTime } from "../../utils/date.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { CalendarView } from "../Calendar/CalendarView.js";
import { FormField } from "../FormField/FormField.js";

import { CALENDAR_ICON } from "./calendar-icon.js";
import { DatePickerPopover } from "./DatePickerPopover.js";
import * as styles from "./DatePicker.css.js";
import type { DatePickerProps } from "./DatePicker.types.js";

export function DatePicker(props: DatePickerProps): ReactElement {
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
    locale: locale_prop,
    minValue,
    maxValue,
    placement = "bottom start",
    visibleMonths = 1,
    labels,
    openLabel = "Abrir calendario",
    granularity = "day",
    field: nebula_field,
    value,
    defaultValue = "",
    onChange,
    isDateUnavailable,
    name,
    className,
    rootClassName,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const { locale: ambient } = useLocale();
  const locale = locale_prop ?? ambient;
  const with_time = granularity !== "day";

  const fp = useFieldProps<string>({
    field: nebula_field,
    value,
    defaultValue,
    onChange,
    error,
    disabled,
    required,
  });

  const Parse = (raw: string): CalendarDate | CalendarDateTime | null =>
    with_time ? ParseDateTime(raw) : ParseDate(raw);

  const Format = (next: DateValue | null): string =>
    with_time
      ? FormatDateTime(next as CalendarDateTime | null, granularity === "second")
      : FormatDate(next as CalendarDate | null);

  const parsed = useMemo(() => Parse(fp.value), [fp.value, with_time]);
  const min = useMemo(() => Parse(minValue ?? ""), [minValue, with_time]);
  const max = useMemo(() => Parse(maxValue ?? ""), [maxValue, with_time]);

  const state = useDatePickerState({
    value: parsed,
    onChange: (next) => {
      fp.onChange(Format(next));
    },
    isDisabled: fp.isDisabled,
    isReadOnly: readOnly,
    isRequired: required,
    granularity,
    shouldCloseOnSelect: !with_time,
  });

  const group_ref = useRef<HTMLDivElement>(null);
  const trigger_ref = useRef<HTMLButtonElement>(null);
  const field_ref = useRef<HTMLDivElement>(null);

  const { groupProps, fieldProps, buttonProps, dialogProps, calendarProps } = useDatePicker(
    {
      isDisabled: fp.isDisabled,
      isReadOnly: readOnly,
      isRequired: required,
      granularity,
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

  const field_state = useDateFieldState({ ...fieldProps, locale, createCalendar });
  const { fieldProps: segment_group } = useDateField(fieldProps, field_state, field_ref);

  const { buttonProps: dom_button } = useButton(buttonProps, trigger_ref);
  const { focusProps, isFocusVisible } = useFocusRing();

  const form_error = fp.errorMessage ?? (fp.isInvalid ? true : undefined);

  return (
    <FormField
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
          {name === undefined ? null : <input type="hidden" name={name} value={fp.value} />}
          <div {...groupProps} {...control} ref={group_ref} className={styles.group}>
            <DateSegments
              state={field_state}
              fieldProps={{ ...segment_group, id }}
              fieldRef={field_ref}
              className={cx(className)}
            />
          </div>
          <button
            {...mergeProps(dom_button, focusProps)}
            ref={trigger_ref}
            id={`${id}-trigger`}
            type="button"
            aria-label={openLabel}
            aria-labelledby={label === undefined ? undefined : `${id}-label ${id}-trigger`}
            className={styles.trigger}
            disabled={fp.isDisabled}
            data-focus-visible={isFocusVisible ? "true" : undefined}
          >
            {CALENDAR_ICON}
          </button>
          <DatePickerPopover
            state={state}
            triggerRef={group_ref}
            dialogProps={dialogProps}
            placement={placement}
          >
            <CalendarView
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

DatePicker.displayName = "DatePicker";

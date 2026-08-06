"use client";

import { useMemo, useRef, type ReactElement } from "react";

import type { CalendarDate, DateValue } from "@internationalized/date";
import { getLocalTimeZone } from "@internationalized/date";
import { useFieldProps } from "@stellaria/nebula-hooks";
import { mergeProps, useButton, useFocusRing, useLocale } from "react-aria";
import { useDatePickerState } from "react-stately";

import * as field from "../../styles/field.css.js";
import { FormatDate, ParseDate } from "../../utils/date.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { CalendarView } from "../Calendar/CalendarView.js";
import { FormField } from "../FormField/FormField.js";

import { CALENDAR_ICON } from "./calendar-icon.js";
import { DatePickerPopover } from "./DatePickerPopover.js";
import * as styles from "./DatePicker.css.js";
import type { DatePickerInputProps } from "./DatePicker.types.js";

const DEFAULT_FORMAT: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "short",
  year: "numeric",
};

export function DatePickerInput(props: DatePickerInputProps): ReactElement {
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
    placeholder = "Selecciona una fecha",
    format,
    field: nebula_field,
    value,
    defaultValue = "",
    onChange,
    isDateUnavailable,
    name,
    className,
    rootClassName,
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

  const { locale: ambient } = useLocale();
  const locale = locale_prop ?? ambient;

  const fp = useFieldProps<string>({
    field: nebula_field,
    value,
    defaultValue,
    onChange,
    error,
    disabled,
    required,
  });

  const min = useMemo(() => ParseDate(minValue), [minValue]);
  const max = useMemo(() => ParseDate(maxValue), [maxValue]);
  const parsed = useMemo(() => ParseDate(fp.value), [fp.value]);

  const state = useDatePickerState({
    value: parsed,
    onChange: (next) => {
      fp.onChange(FormatDate(next));
    },
    isDisabled: fp.isDisabled,
    isReadOnly: readOnly,
    isRequired: required,
    granularity: "day",
    shouldCloseOnSelect: true,
  });

  const trigger_ref = useRef<HTMLButtonElement>(null);
  const formatter = useMemo(
    () => new Intl.DateTimeFormat(locale, format ?? DEFAULT_FORMAT),
    [locale, format],
  );
  const display =
    parsed === null ? placeholder : formatter.format(parsed.toDate(getLocalTimeZone()));

  const { buttonProps } = useButton(
    {
      isDisabled: fp.isDisabled || readOnly,
      onPress: () => {
        state.setOpen(true);
      },
    },
    trigger_ref,
  );
  const { focusProps, isFocusVisible } = useFocusRing();

  const form_error = fp.errorMessage ?? (fp.isInvalid ? true : undefined);

  const calendar = {
    value: parsed,
    onChange: (next: DateValue) => {
      state.setValue(next);
    },
    isDisabled: fp.isDisabled,
    isReadOnly: readOnly,
    ...(min === null ? {} : { minValue: min }),
    ...(max === null ? {} : { maxValue: max }),
    ...(isDateUnavailable === undefined
      ? {}
      : {
          isDateUnavailable: (date: DateValue) =>
            isDateUnavailable(FormatDate(date as CalendarDate)),
        }),
  };

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
      {({ "aria-required": _required, ...control }) => (
        <div
          className={field.field({ size, surface })}
          data-invalid={fp.isInvalid ? "true" : undefined}
          data-disabled={fp.isDisabled ? "true" : undefined}
        >
          {name === undefined ? null : <input type="hidden" name={name} value={fp.value} />}
          <button
            {...mergeProps(buttonProps, focusProps)}
            {...control}
            ref={trigger_ref}
            type="button"
            className={cx(styles.text_trigger, className)}
            disabled={fp.isDisabled}
            data-placeholder={parsed === null ? "true" : undefined}
            data-focus-visible={isFocusVisible ? "true" : undefined}
          >
            {display}
          </button>
          <span className={field.section} aria-hidden="true">
            {CALENDAR_ICON}
          </span>
          <DatePickerPopover
            state={state}
            triggerRef={trigger_ref}
            dialogProps={{ "aria-label": openLabel }}
            placement={placement}
          >
            <CalendarView
              calendar={calendar}
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

DatePickerInput.displayName = "DatePickerInput";

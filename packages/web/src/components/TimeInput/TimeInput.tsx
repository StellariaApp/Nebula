"use client";

import { useMemo, useRef, type ReactElement } from "react";

import { useFieldProps } from "@stellaria/nebula-hooks";
import { useLocale, useTimeField } from "react-aria";
import { useTimeFieldState } from "react-stately";

import { DateSegments } from "../../fields/date-segments.js";
import * as field from "../../styles/field.css.js";
import { FormatTime, ParseTime } from "../../utils/date.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { CLOCK_ICON } from "../DatePicker/calendar-icon.js";
import { FormField } from "../FormField/FormField.js";

import type { TimeInputProps } from "./TimeInput.types.js";

export function TimeInput(props: TimeInputProps): ReactElement {
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
    hourCycle,
    granularity = "minute",
    minValue,
    maxValue,
    field: nebula_field,
    value,
    defaultValue = "",
    onChange,
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

  const min = useMemo(() => ParseTime(minValue), [minValue]);
  const max = useMemo(() => ParseTime(maxValue), [maxValue]);
  const parsed = useMemo(() => ParseTime(fp.value), [fp.value]);

  const state = useTimeFieldState({
    locale,
    value: parsed,
    onChange: (next) => {
      fp.onChange(FormatTime(next, granularity === "second"));
    },
    isDisabled: fp.isDisabled,
    isReadOnly: readOnly,
    isRequired: required,
    granularity,
    ...(hourCycle === undefined ? {} : { hourCycle }),
    ...(min === null ? {} : { minValue: min }),
    ...(max === null ? {} : { maxValue: max }),
  });

  const field_ref = useRef<HTMLDivElement>(null);
  const { fieldProps } = useTimeField(
    {
      isDisabled: fp.isDisabled,
      isReadOnly: readOnly,
      isRequired: required,
      granularity,
      ...(hourCycle === undefined ? {} : { hourCycle }),
      ...(typeof label === "string" ? { "aria-label": label } : {}),
    },
    state,
    field_ref,
  );

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
          {name === undefined ? null : <input type="hidden" name={name} value={fp.value} />}
          <DateSegments
            state={state}
            fieldProps={{ ...fieldProps, ...control, id }}
            fieldRef={field_ref}
            className={cx(className)}
          />
          <span className={field.section} aria-hidden="true">
            {CLOCK_ICON}
          </span>
        </div>
      )}
    </FormField>
  );
}

TimeInput.displayName = "TimeInput";

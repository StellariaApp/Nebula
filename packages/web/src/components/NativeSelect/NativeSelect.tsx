"use client";

import { forwardRef, type ReactElement } from "react";

import { useFieldProps } from "@stellaria/nebula-hooks";

import type { SelectOption } from "../../collections/options.js";
import * as field from "../../styles/field.css.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { FormField } from "../FormField/FormField.js";

import * as styles from "./NativeSelect.css.js";
import type { NativeSelectProps } from "./NativeSelect.types.js";

const CHEVRON = (
  <svg
    viewBox="0 0 24 24"
    width="1.1em"
    height="1.1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

function Option(option: SelectOption): ReactElement {
  return (
    <option key={option.value} value={option.value} disabled={option.disabled}>
      {option.label}
    </option>
  );
}

export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  function NativeSelect(props, ref) {
    const {
      label,
      description,
      error,
      errorDisplay = "tooltip",
      required = false,
      disabled = false,
      size = "md",
      surface = "outline",
      data,
      groups,
      placeholder,
      field: nebula_field,
      value,
      defaultValue = "",
      onChange,
      className,
      rootClassName,
      labelProps,
      descriptionProps,
      requiredProps,
      headerProps,
      bodyProps,
      errorProps,
      ...select_rest_and_style
    } = props;
    const field_slots = {
      labelProps,
      descriptionProps,
      requiredProps,
      headerProps,
      bodyProps,
      errorProps,
    };
    const {
      className: sprinkle_class,
      style: sprinkle_style,
      rest: select_rest,
    } = ExtractStyleProps(select_rest_and_style);

    const fp = useFieldProps<string>({
      field: nebula_field,
      value,
      defaultValue,
      onChange,
      error,
      disabled,
      required,
    });

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
        {(control) => (
          <div
            className={field.field({ size, surface })}
            data-invalid={fp.isInvalid ? "true" : undefined}
            data-disabled={fp.isDisabled ? "true" : undefined}
          >
            <select
              {...select_rest}
              {...control}
              ref={ref}
              className={cx(field.input, styles.select, className)}
              value={fp.value}
              disabled={fp.isDisabled}
              required={required}
              onChange={(event) => {
                fp.onChange(event.target.value);
              }}
            >
              {placeholder === undefined ? null : (
                <option value="" disabled={required}>
                  {placeholder}
                </option>
              )}
              {data?.map(Option)}
              {groups?.map((entry) => (
                <optgroup key={entry.label} label={entry.label}>
                  {entry.options.map(Option)}
                </optgroup>
              ))}
            </select>
            <span className={styles.chevron} aria-hidden="true">
              {CHEVRON}
            </span>
          </div>
        )}
      </FormField>
    );
  },
);

NativeSelect.displayName = "NativeSelect";

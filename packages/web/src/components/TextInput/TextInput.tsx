"use client";

import { forwardRef, type ChangeEvent } from "react";

import { useFieldProps } from "@stellaria/nebula-hooks";

import * as field from "../../styles/field.css.js";
import { cx } from "../../utils/style-props.js";
import { FieldError } from "../FieldError/FieldError.js";
import { FormField } from "../FormField/FormField.js";

import type { TextInputProps } from "./TextInput.types.js";

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput(props, ref) {
    const {
      label,
      description,
      error,
      required = false,
      disabled = false,
      size = "md",
      field: nebula_field,
      value,
      defaultValue = "",
      onChange,
      leftSection,
      rightSection,
      className,
      rootClassName,
      errorDisplay = "tooltip",
      type = "text",
      ...input_rest
    } = props;

    const fp = useFieldProps({
      field: nebula_field,
      value,
      defaultValue,
      onChange,
      error,
      disabled,
      required,
    });

    const use_tooltip = errorDisplay === "tooltip";
    const form_error = use_tooltip
      ? fp.isInvalid
        ? true
        : undefined
      : error === true
        ? true
        : fp.errorMessage;

    return (
      <FormField
        label={label}
        description={description}
        error={form_error}
        required={required}
        className={rootClassName}
      >
        {(control) => {
          const control_node = (
            <div
              className={field.field({ size })}
              data-invalid={fp.isInvalid ? "true" : undefined}
              data-disabled={fp.isDisabled ? "true" : undefined}
            >
              {leftSection === undefined || leftSection === null ? null : (
                <span className={field.section} aria-hidden="true">
                  {leftSection}
                </span>
              )}
              <input
                {...control}
                {...input_rest}
                ref={ref}
                type={type}
                className={cx(field.input, className)}
                value={fp.value}
                onChange={(event: ChangeEvent<HTMLInputElement>) => fp.onChange(event.target.value)}
                disabled={fp.isDisabled}
                required={required}
              />
              {rightSection === undefined || rightSection === null ? null : (
                <span className={field.section}>{rightSection}</span>
              )}
            </div>
          );
          return use_tooltip ? (
            <FieldError message={fp.errorMessage} status={fp.status}>
              {control_node}
            </FieldError>
          ) : (
            control_node
          );
        }}
      </FormField>
    );
  },
);

TextInput.displayName = "TextInput";

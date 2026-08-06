"use client";

import { forwardRef, type ChangeEvent } from "react";

import { useFieldProps } from "@stellaria/nebula-hooks";

import * as field from "../../styles/field.css.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
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
      surface = "outline",
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
      labelProps,
      descriptionProps,
      requiredProps,
      headerProps,
      bodyProps,
      errorProps,
      ...input_rest_and_style
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
      rest: input_rest,
    } = ExtractStyleProps(input_rest_and_style);

    const fp = useFieldProps({
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
        )}
      </FormField>
    );
  },
);

TextInput.displayName = "TextInput";

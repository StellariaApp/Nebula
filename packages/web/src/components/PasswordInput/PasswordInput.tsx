"use client";

import { forwardRef, useState, type ChangeEvent } from "react";

import { useFieldProps } from "@stellaria/nebula-hooks";

import * as field from "../../styles/field.css.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { FormField } from "../FormField/FormField.js";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton.js";

import type { PasswordInputProps } from "./PasswordInput.types.js";
import { Eye, EyeOff } from "../../glyphs/index.js";

const EYE = <Eye />;

const EYE_OFF = <EyeOff />;

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(props, ref) {
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
      className,
      rootClassName,
      errorDisplay = "tooltip",
      showLabel = "Show password",
      hideLabel = "Hide password",
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
    const [visible, set_visible] = useState(false);
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
            <input
              {...control}
              {...input_rest}
              ref={ref}
              type={visible ? "text" : "password"}
              className={cx(field.input, className)}
              value={fp.value}
              onChange={(event: ChangeEvent<HTMLInputElement>) => fp.onChange(event.target.value)}
              disabled={fp.isDisabled}
              required={required}
            />
            <UnstyledButton
              className={field.section}
              aria-label={visible ? hideLabel : showLabel}
              disabled={fp.isDisabled}
              onPress={() => set_visible((current) => !current)}
            >
              {visible ? EYE_OFF : EYE}
            </UnstyledButton>
          </div>
        )}
      </FormField>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

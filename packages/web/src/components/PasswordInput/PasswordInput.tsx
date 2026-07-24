"use client";

import { forwardRef, useState, type ChangeEvent } from "react";

import { useFieldProps } from "@stellaria/nebula-hooks";

import * as field from "../../styles/field.css.js";
import { cx } from "../../utils/style-props.js";
import { FieldError } from "../FieldError/FieldError.js";
import { FormField } from "../FormField/FormField.js";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton.js";

import type { PasswordInputProps } from "./PasswordInput.types.js";

const EYE = (
  <svg viewBox="0 0 24 24" width="1.1em" height="1.1em" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EYE_OFF = (
  <svg viewBox="0 0 24 24" width="1.1em" height="1.1em" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 3l18 18" />
    <path d="M10.6 10.6a3 3 0 0 0 4.2 4.2" />
    <path d="M9.9 4.2A10.9 10.9 0 0 1 12 4c6.5 0 10 7 10 7a17.6 17.6 0 0 1-2.9 3.9M6.6 6.6A17.7 17.7 0 0 0 2 11s3.5 7 10 7a10.7 10.7 0 0 0 3.1-.5" />
  </svg>
);

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(props, ref) {
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
      className,
      rootClassName,
      errorDisplay = "tooltip",
      showLabel = "Mostrar contraseña",
      hideLabel = "Ocultar contraseña",
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
    const [visible, set_visible] = useState(false);
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

PasswordInput.displayName = "PasswordInput";

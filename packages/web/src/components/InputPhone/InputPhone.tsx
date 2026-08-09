"use client";

import type { ChangeEvent, ReactElement } from "react";

import { useFieldProps } from "@stellaria/nebula-hooks";

import { DialSelect } from "../../fields/dial-select.js";
import * as field from "../../styles/field.css.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { FormField } from "../FormField/FormField.js";

import type { InputPhoneProps } from "./InputPhone.types.js";

const DIGITS = /[^\d\s-]/g;

export function InputPhone(props: InputPhoneProps): ReactElement {
  const {
    label,
    description,
    placeholder,
    error,
    errorDisplay = "tooltip",
    required = false,
    disabled = false,
    size = "md",
    surface = "outline",
    field: nebula_field,
    value,
    defaultValue = "",
    onChange,
    fieldDial,
    dialValue,
    defaultDialValue = "",
    onDialChange,
    data,
    renderFlag,
    emptyLabel = "No results",
    dialLabel = "Dialling code",
    name,
    dialName,
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

  const fp = useFieldProps<string>({
    field: nebula_field,
    value,
    defaultValue,
    onChange,
    error,
    disabled,
    required,
  });

  const dial = useFieldProps<string>({
    field: fieldDial,
    value: dialValue,
    defaultValue: defaultDialValue,
    onChange: onDialChange,
    disabled,
  });

  const form_error = fp.errorMessage ?? (fp.isInvalid ? true : undefined);

  const HandleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    fp.onChange(event.target.value.replace(DIGITS, ""));
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
      {(control) => (
        <div
          className={field.field({ size, surface })}
          data-invalid={fp.isInvalid ? "true" : undefined}
          data-disabled={fp.isDisabled ? "true" : undefined}
        >
          <DialSelect
            value={dial.value}
            onChange={dial.onChange}
            data={data}
            disabled={fp.isDisabled}
            invalid={fp.isInvalid}
            required={false}
            compact
            ariaLabel={dialLabel}
            emptyLabel={emptyLabel}
            renderFlag={renderFlag}
            name={dialName}
          />
          <input
            {...control}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            className={cx(field.input, className)}
            value={fp.value}
            onChange={HandleChange}
            disabled={fp.isDisabled}
            required={required}
            {...(placeholder === undefined ? {} : { placeholder })}
            {...(name === undefined ? {} : { name })}
          />
        </div>
      )}
    </FormField>
  );
}

InputPhone.displayName = "InputPhone";

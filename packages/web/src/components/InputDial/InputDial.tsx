"use client";

import type { ReactElement } from "react";

import { useFieldProps } from "@stellaria/nebula-hooks";

import { DialSelect } from "../../fields/dial-select.js";
import * as field from "../../styles/field.css.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { FormField } from "../FormField/FormField.js";

import type { InputDialProps } from "./InputDial.types.js";

export function InputDial(props: InputDialProps): ReactElement {
  const {
    label,
    description,
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
    data,
    renderFlag,
    emptyLabel = "Sin resultados",
    ariaLabel = "Prefijo telefónico",
    name,
    className,
    rootClassName,
    ...style_rest
  } = props;
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
      {(control) => (
        <div
          className={field.field({ size, surface })}
          data-invalid={fp.isInvalid ? "true" : undefined}
          data-disabled={fp.isDisabled ? "true" : undefined}
        >
          <DialSelect
            value={fp.value}
            onChange={fp.onChange}
            data={data}
            disabled={fp.isDisabled}
            invalid={fp.isInvalid}
            required={required}
            compact={false}
            ariaLabel={ariaLabel}
            emptyLabel={emptyLabel}
            renderFlag={renderFlag}
            controlId={control.id}
            describedBy={control["aria-describedby"]}
            labelledBy={label === undefined ? undefined : `${control.id}-label`}
            name={name}
            className={className}
          />
        </div>
      )}
    </FormField>
  );
}

InputDial.displayName = "InputDial";

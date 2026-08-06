"use client";

import { useEffect, useRef, useState, type ReactElement } from "react";

import { useFieldProps } from "@stellaria/nebula-hooks";

import * as field from "../../styles/field.css.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { FormField } from "../FormField/FormField.js";

import * as styles from "./JsonInput.css.js";
import type { JsonInputProps } from "./JsonInput.types.js";

interface Parsed {
  valid: boolean;
  message: string | undefined;
}

function Validate(raw: string): Parsed {
  if (raw.trim() === "") return { valid: true, message: undefined };
  try {
    JSON.parse(raw);
    return { valid: true, message: undefined };
  } catch (cause) {
    return { valid: false, message: cause instanceof Error ? cause.message : "JSON inválido" };
  }
}

export function JsonInput(props: JsonInputProps): ReactElement {
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
    placeholder,
    rows = 8,
    formatOnBlur = true,
    indent = 2,
    validationLabel,
    field: nebula_field,
    value,
    defaultValue = "",
    onChange,
    onValidationChange,
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

  const fp = useFieldProps<string>({
    field: nebula_field,
    value,
    defaultValue,
    onChange,
    error,
    disabled,
    required,
  });

  const parsed = Validate(fp.value);
  const [touched, set_touched] = useState(false);
  const last_valid = useRef(parsed.valid);

  useEffect(() => {
    if (last_valid.current === parsed.valid) return;
    last_valid.current = parsed.valid;
    onValidationChange?.(parsed.valid);
  }, [parsed.valid, onValidationChange]);

  const syntax_error = touched && !parsed.valid ? (validationLabel ?? parsed.message) : undefined;
  const form_error = fp.errorMessage ?? syntax_error ?? (fp.isInvalid ? true : undefined);
  const invalid = fp.isInvalid || syntax_error !== undefined;

  const Format = (): void => {
    if (!formatOnBlur || !parsed.valid || fp.value.trim() === "") return;
    try {
      fp.onChange(JSON.stringify(JSON.parse(fp.value), null, indent));
    } catch {
      return;
    }
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
          className={field.field({ size, surface, multiline: true })}
          data-invalid={invalid ? "true" : undefined}
          data-disabled={fp.isDisabled ? "true" : undefined}
        >
          <textarea
            {...control}
            aria-invalid={invalid ? true : undefined}
            className={cx(field.input, field.textarea, styles.editor, className)}
            value={fp.value}
            rows={rows}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            placeholder={placeholder}
            disabled={fp.isDisabled}
            readOnly={readOnly}
            required={required}
            {...(name === undefined ? {} : { name })}
            onChange={(event) => {
              fp.onChange(event.target.value);
            }}
            onBlur={() => {
              set_touched(true);
              Format();
            }}
          />
        </div>
      )}
    </FormField>
  );
}

JsonInput.displayName = "JsonInput";

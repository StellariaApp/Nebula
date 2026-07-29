"use client";

import { useRef, type ReactElement, type ReactNode } from "react";

import { useFieldProps } from "@stellaria/nebula-hooks";

import * as field from "../../styles/field.css.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { ButtonClose } from "../ButtonClose/ButtonClose.js";
import { FormField } from "../FormField/FormField.js";

import * as styles from "./FileInput.css.js";
import type { FileInputProps } from "./FileInput.types.js";

const CLIP = (
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
    <path d="M21.44 11.05l-8.49 8.49a6 6 0 0 1-8.49-8.49l8.49-8.49a4 4 0 0 1 5.66 5.66l-8.5 8.49a2 2 0 0 1-2.83-2.83l7.79-7.78" />
  </svg>
);

export function FileInput(props: FileInputProps): ReactElement {
  const {
    label,
    description,
    error,
    errorDisplay = "tooltip",
    required = false,
    disabled = false,
    size = "md",
    surface = "outline",
    placeholder = "Ningún archivo seleccionado",
    accept,
    multiple = false,
    capture,
    clearable = true,
    field: nebula_field,
    value,
    defaultValue,
    onChange,
    formatValue,
    browseLabel,
    clearLabel = "Quitar archivos",
    name,
    className,
    rootClassName,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const fp = useFieldProps<File[]>({
    field: nebula_field,
    value: value === undefined ? undefined : [...value],
    defaultValue: defaultValue === undefined ? [] : [...defaultValue],
    onChange,
    error,
    disabled,
    required,
  });

  const input_ref = useRef<HTMLInputElement>(null);
  const files = fp.value;
  const form_error = fp.errorMessage ?? (fp.isInvalid ? true : undefined);

  const Display = (): ReactNode => {
    if (files.length === 0) return placeholder;
    if (formatValue !== undefined) return formatValue(files);
    if (files.length === 1) return files[0]?.name ?? placeholder;
    return `${String(files.length)} archivos seleccionados`;
  };

  const Clear = (): void => {
    fp.onChange([]);
    if (input_ref.current !== null) input_ref.current.value = "";
  };

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
      {({ id, ...control }) => (
        <div
          className={field.field({ size, surface })}
          data-invalid={fp.isInvalid ? "true" : undefined}
          data-disabled={fp.isDisabled ? "true" : undefined}
        >
          <span className={field.section} aria-hidden="true">
            {CLIP}
          </span>
          <input
            {...control}
            ref={input_ref}
            id={id}
            type="file"
            className={styles.hidden}
            accept={accept}
            multiple={multiple}
            capture={capture}
            disabled={fp.isDisabled}
            required={required}
            {...(name === undefined ? {} : { name })}
            onChange={(event) => {
              fp.onChange([...(event.target.files ?? [])]);
            }}
          />
          <button
            type="button"
            className={cx(styles.trigger, className)}
            disabled={fp.isDisabled}
            aria-label={browseLabel}
            data-placeholder={files.length === 0 ? "true" : undefined}
            onClick={() => {
              input_ref.current?.click();
            }}
          >
            {Display()}
          </button>
          {clearable && files.length > 0 && !fp.isDisabled ? (
            <ButtonClose size="xs" aria-label={clearLabel} onPress={Clear} />
          ) : null}
        </div>
      )}
    </FormField>
  );
}

FileInput.displayName = "FileInput";

"use client";

import { forwardRef, useEffect, useRef, type ChangeEvent } from "react";

import { useFieldProps } from "@stellaria/nebula-hooks";
import { useObjectRef } from "react-aria";

import * as field from "../../styles/field.css.js";
import { cx } from "../../utils/style-props.js";
import { FormField } from "../FormField/FormField.js";

import type { TextareaProps } from "./Textarea.types.js";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(props, forwarded_ref) {
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
      autosize = false,
      rows = 3,
      className,
      rootClassName,
      ...textarea_rest
    } = props;

    const local_ref = useRef<HTMLTextAreaElement>(null);
    const ref = useObjectRef(forwarded_ref ?? local_ref);

    const fp = useFieldProps({
      field: nebula_field,
      value,
      defaultValue,
      onChange,
      error,
      disabled,
      required,
    });

    const form_error = error === true ? true : fp.errorMessage;

    useEffect(() => {
      if (!autosize) return;
      const element = ref.current;
      if (element === null) return;
      element.style.height = "auto";
      element.style.height = `${String(element.scrollHeight)}px`;
    }, [autosize, fp.value, ref]);

    return (
      <FormField
        label={label}
        description={description}
        error={form_error}
        required={required}
        className={rootClassName}
      >
        {(control) => (
          <div
            className={field.field({ size, multiline: true })}
            data-invalid={fp.isInvalid ? "true" : undefined}
            data-disabled={fp.isDisabled ? "true" : undefined}
          >
            <textarea
              {...control}
              {...textarea_rest}
              ref={ref}
              rows={rows}
              className={cx(field.input, field.textarea, className)}
              value={fp.value}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) => fp.onChange(event.target.value)}
              disabled={fp.isDisabled}
              required={required}
            />
          </div>
        )}
      </FormField>
    );
  },
);

Textarea.displayName = "Textarea";

"use client";

import { useRef, type ClipboardEvent, type KeyboardEvent, type ReactElement } from "react";

import { useFieldProps } from "@stellaria/nebula-hooks";

import * as field from "../../styles/field.css.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { FormField } from "../FormField/FormField.js";

import * as styles from "./PinInput.css.js";
import type { PinInputProps } from "./PinInput.types.js";

const NUMERIC = /^\d$/;
const ALPHANUMERIC = /^[a-z0-9]$/i;

export function PinInput(props: PinInputProps): ReactElement {
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
    length = 6,
    type = "numeric",
    mask = false,
    placeholder = "○",
    autoFocus = false,
    field: nebula_field,
    value,
    defaultValue = "",
    onChange,
    onComplete,
    cellLabel,
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

  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const pattern = type === "numeric" ? NUMERIC : ALPHANUMERIC;
  const chars = fp.value.slice(0, length).split("");
  const form_error = fp.errorMessage ?? (fp.isInvalid ? true : undefined);

  const Commit = (next: string): void => {
    const trimmed = next.slice(0, length);
    fp.onChange(trimmed);
    if (trimmed.length === length) onComplete?.(trimmed);
  };

  const Focus = (index: number): void => {
    refs.current[Math.max(0, Math.min(length - 1, index))]?.focus();
  };

  const HandleChange = (index: number, raw: string): void => {
    const typed = [...raw].filter((c) => pattern.test(c));
    if (typed.length === 0) return;
    const chars_next = fp.value.padEnd(length, " ").split("");
    let cursor = index;
    for (const c of typed) {
      if (cursor >= length) break;
      chars_next[cursor] = c;
      cursor += 1;
    }
    Commit(chars_next.join("").trimEnd());
    Focus(cursor);
  };

  const HandleKey = (index: number, event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Backspace") {
      event.preventDefault();
      const chars_next = fp.value.split("");
      if (chars_next[index] === undefined || chars_next[index] === "") {
        chars_next.splice(index - 1, 1);
        Commit(chars_next.join(""));
        Focus(index - 1);
        return;
      }
      chars_next.splice(index, 1);
      Commit(chars_next.join(""));
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      Focus(index - 1);
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      Focus(index + 1);
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      Focus(0);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      Focus(length - 1);
    }
  };

  const HandlePaste = (index: number, event: ClipboardEvent<HTMLInputElement>): void => {
    event.preventDefault();
    HandleChange(index, event.clipboardData.getData("text"));
  };

  const Label = (index: number): string =>
    cellLabel === undefined
      ? `Dígito ${String(index + 1)} de ${String(length)}`
      : cellLabel(index, length);

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
      {({ id, "aria-required": _required, ...control }) => (
        <div className={cx(styles.group, className)} role="group" {...control}>
          {name === undefined ? null : <input type="hidden" name={name} value={fp.value} />}
          {[...new Array(length).keys()].map((index) => (
            <div
              key={index}
              className={cx(field.field({ size, surface }), styles.cell_width[size])}
              data-invalid={fp.isInvalid ? "true" : undefined}
              data-disabled={fp.isDisabled ? "true" : undefined}
            >
              <input
                ref={(node) => {
                  refs.current[index] = node;
                }}
                id={index === 0 ? id : undefined}
                type={mask ? "password" : "text"}
                inputMode={type === "numeric" ? "numeric" : "text"}
                autoComplete={index === 0 ? "one-time-code" : "off"}
                className={cx(field.input, styles.cell)}
                maxLength={1}
                value={chars[index] ?? ""}
                placeholder={placeholder}
                aria-label={Label(index)}
                disabled={fp.isDisabled}
                readOnly={readOnly}
                autoFocus={autoFocus && index === 0}
                onChange={(event) => {
                  HandleChange(index, event.target.value);
                }}
                onKeyDown={(event) => {
                  HandleKey(index, event);
                }}
                onPaste={(event) => {
                  HandlePaste(index, event);
                }}
              />
            </div>
          ))}
        </div>
      )}
    </FormField>
  );
}

PinInput.displayName = "PinInput";

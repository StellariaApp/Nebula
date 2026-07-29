"use client";

import { useState, type KeyboardEvent, type ReactElement } from "react";

import { useFieldProps } from "@stellaria/nebula-hooks";

import * as field from "../../styles/field.css.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { ButtonClose } from "../ButtonClose/ButtonClose.js";
import { FormField } from "../FormField/FormField.js";

import * as styles from "./TagsInput.css.js";
import type { TagsInputProps } from "./TagsInput.types.js";

const DEFAULT_SPLIT = [","] as const;

export function TagsInput(props: TagsInputProps): ReactElement {
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
    maxTags,
    allowDuplicates = false,
    splitChars = DEFAULT_SPLIT,
    field: nebula_field,
    value,
    defaultValue,
    onChange,
    validate,
    removeLabel,
    name,
    className,
    rootClassName,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const fp = useFieldProps<string[]>({
    field: nebula_field,
    value: value === undefined ? undefined : [...value],
    defaultValue: defaultValue === undefined ? [] : [...defaultValue],
    onChange,
    error,
    disabled,
    required,
  });

  const [draft, set_draft] = useState("");
  const tags = fp.value;
  const form_error = fp.errorMessage ?? (fp.isInvalid ? true : undefined);
  const editable = !fp.isDisabled && !readOnly;
  const at_max = maxTags !== undefined && tags.length >= maxTags;

  const Add = (raw: string): void => {
    const candidate = raw.trim();
    if (candidate === "" || at_max) return;
    if (!allowDuplicates && tags.includes(candidate)) return;
    if (validate !== undefined && !validate(candidate)) return;
    fp.onChange([...tags, candidate]);
  };

  const Remove = (index: number): void => {
    fp.onChange(tags.filter((_, i) => i !== index));
  };

  const Flush = (raw: string): void => {
    const pattern = new RegExp(`[${splitChars.map((c) => `\\${c}`).join("")}]`);
    const parts = raw.split(pattern);
    if (parts.length === 1) {
      set_draft(raw);
      return;
    }
    for (const part of parts.slice(0, -1)) Add(part);
    set_draft(parts.at(-1) ?? "");
  };

  const HandleKey = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter") {
      event.preventDefault();
      Add(draft);
      set_draft("");
      return;
    }
    if (event.key === "Backspace" && draft === "" && tags.length > 0) {
      event.preventDefault();
      Remove(tags.length - 1);
    }
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
      {(control) => (
        <div
          className={field.field({ size, surface, multiline: true })}
          data-invalid={fp.isInvalid ? "true" : undefined}
          data-disabled={fp.isDisabled ? "true" : undefined}
        >
          {name === undefined
            ? null
            : tags.map((entry, index) => (
                <input key={`${entry}-${String(index)}`} type="hidden" name={name} value={entry} />
              ))}
          <div className={styles.wrapper}>
            <ul className={styles.wrapper} role="list">
              {tags.map((entry, index) => (
                <li
                  key={`${entry}-${String(index)}`}
                  className={styles.tag}
                  data-disabled={fp.isDisabled ? "true" : undefined}
                >
                  <span className={styles.tagLabel}>{entry}</span>
                  {editable ? (
                    <ButtonClose
                      size="xs"
                      className={styles.remove}
                      aria-label={
                        removeLabel === undefined ? `Quitar ${entry}` : removeLabel(entry)
                      }
                      onPress={() => {
                        Remove(index);
                      }}
                    />
                  ) : null}
                </li>
              ))}
            </ul>
            <input
              {...control}
              type="text"
              className={cx(field.input, styles.input, className)}
              value={draft}
              placeholder={tags.length === 0 ? placeholder : undefined}
              disabled={fp.isDisabled}
              readOnly={readOnly}
              required={required && tags.length === 0}
              onChange={(event) => {
                Flush(event.target.value);
              }}
              onKeyDown={HandleKey}
              onBlur={() => {
                Add(draft);
                set_draft("");
              }}
            />
          </div>
        </div>
      )}
    </FormField>
  );
}

TagsInput.displayName = "TagsInput";

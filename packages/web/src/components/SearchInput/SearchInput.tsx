"use client";

import { forwardRef, type ChangeEvent } from "react";

import { useDebouncedCallback, useFieldProps } from "@stellaria/nebula-hooks";

import * as field from "../../styles/field.css.js";
import { cx } from "../../utils/style-props.js";
import { FormField } from "../FormField/FormField.js";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton.js";

import type { SearchInputProps } from "./SearchInput.types.js";

const SEARCH_ICON = (
  <svg viewBox="0 0 24 24" width="1.05em" height="1.05em" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);

const CLEAR_ICON = (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(props, ref) {
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
      onSearch,
      debounce = 300,
      clearable = true,
      clearLabel = "Limpiar",
      className,
      rootClassName,
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

    const debounced_search = useDebouncedCallback((next: string) => {
      onSearch?.(next);
    }, debounce);

    const HandleChange = (next: string): void => {
      fp.onChange(next);
      debounced_search(next);
    };

    const form_error = error === true ? true : fp.errorMessage;
    const show_clear = clearable && fp.value.length > 0 && !fp.isDisabled;

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
            className={field.field({ size })}
            data-invalid={fp.isInvalid ? "true" : undefined}
            data-disabled={fp.isDisabled ? "true" : undefined}
          >
            <span className={field.section} aria-hidden="true">
              {SEARCH_ICON}
            </span>
            <input
              {...control}
              {...input_rest}
              ref={ref}
              type="search"
              className={cx(field.input, className)}
              value={fp.value}
              onChange={(event: ChangeEvent<HTMLInputElement>) => HandleChange(event.target.value)}
              disabled={fp.isDisabled}
              required={required}
            />
            {show_clear ? (
              <UnstyledButton
                className={field.section}
                aria-label={clearLabel}
                onPress={() => HandleChange("")}
              >
                {CLEAR_ICON}
              </UnstyledButton>
            ) : null}
          </div>
        )}
      </FormField>
    );
  },
);

SearchInput.displayName = "SearchInput";
